
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Accept URL from terminal or use a default URL
const url = process.argv[2] || 'https://example.com';

const downloadStart = process.argv[3]
  ? parseInt(process.argv[3], 10) - 1
  : 0;

const downloadLimit = process.argv[4]
  ? parseInt(process.argv[4], 10)
  : Infinity;

// Download directory
const downloadDir = path.join(__dirname, 'downloads');

// Create directory if it doesn't exist
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

// Clean filenames
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Download MP3
async function downloadMp3(mp3Url, filename) {
  try {
    const response = await axios({
      method: 'GET',
      url: mp3Url,
      responseType: 'stream'
    });

    const filePath = path.join(downloadDir, filename);

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
      response.data.on('error', reject);
    });

    console.log(`Downloaded: ${filename}`);
  } catch (error) {
    console.error(`Failed to download ${filename}:`, error.message);
  }
}

// Scraper
async function scrapePage() {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const mp3Links = $('a').filter((_, element) => {
      const href = $(element).attr('href');

      return href && /\.mp3(?:[?#]|$)/i.test(href);
    });

    console.log(`Found ${mp3Links.length} MP3 links.`);

    const selectedLinks = mp3Links
      .toArray()
      .slice(downloadStart, downloadStart + downloadLimit);

    console.log(`Downloading ${selectedLinks.length} MP3 files.`);

    for (const element of selectedLinks) {
      const anchor = $(element);

      const anchorText = anchor.text().trim();
      const mp3Url = new URL(anchor.attr('href'), url).href;

      if (!anchorText) {
        console.log(`Skipping link without anchor text: ${mp3Url}`);
        continue;
      }

      const filename = `${sanitizeFilename(anchorText)}.mp3`;

      await downloadMp3(mp3Url, filename);
    }

    console.log('Scraping complete!');
  } catch (error) {
    console.error('Scraping failed:', error.message);
  }
}

scrapePage();
