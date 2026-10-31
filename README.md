# MP3 Web Scraper

A lightweight Node.js web scraper that finds MP3 links on a webpage, uses the associated anchor text as the filename, and downloads the audio files locally.

Built with **Axios** and **Cheerio**.

## Features

- Scrapes a webpage for links pointing to MP3 files.
- Uses the anchor (`<a>`) text as the downloaded filename.
- Supports relative and absolute MP3 URLs.
- Handles MP3 URLs with query strings and URL fragments.
- Allows you to specify how many MP3 files to download.
- Downloads all available MP3 files when no download limit is specified.
- Automatically creates a `downloads` directory if one doesn't exist.
- Sanitizes filenames to remove invalid filesystem characters.

## Requirements

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

## Installation

Clone the repository or download the project files.

Install dependencies:

```bash
npm install
```

The project uses:

- `axios` – HTTP requests and file downloads.
- `cheerio` – HTML parsing and element selection.

If setting up from scratch:

```bash
npm init -y
npm install axios cheerio
```

## Usage

Run the scraper from your terminal:

```bash
node scraper.js <URL> [LIMIT]
```

### Arguments

| Argument | Required | Description |
|---|---|---|
| `URL` | Yes | The webpage containing MP3 links. |
| `LIMIT` | No | Maximum number of MP3 files to download. Defaults to all available links. |

### Examples

**Download all MP3 files:**

```bash
node scraper.js https://example.com/music
```

**Download the first 5 MP3 files:**

```bash
node scraper.js https://example.com/music 5
```

**Download only 1 MP3 file:**

```bash
node scraper.js https://example.com/music 1
```

## How It Works

1. Accepts a webpage URL and optional download limit from the command line.
2. Sends an HTTP request to retrieve the webpage HTML.
3. Uses Cheerio to parse the HTML.
4. Searches for anchor elements containing links to `.mp3` files.
5. Extracts the anchor text to use as the filename.
6. Resolves relative URLs into absolute URLs.
7. Downloads the MP3 files into the local `downloads` directory.

### Example HTML

Given the following webpage markup:

```html
<a href="/audio/song-01.mp3">Amazing Grace</a>
<a href="/audio/song-02.mp3">How Great Thou Art</a>
<a href="/audio/song-03.mp3">Be Thou My Vision</a>
```

The scraper downloads the files with the following names:

```text
Amazing Grace.mp3
How Great Thou Art.mp3
Be Thou My Vision.mp3
```

## Project Structure

```text
mp3-scraper/
├── scraper.js
├── package.json
├── package-lock.json
└── downloads/
    ├── Amazing Grace.mp3
    ├── How Great Thou Art.mp3
    └── Be Thou My Vision.mp3
```

## Limitations

- **Static HTML:** The scraper only processes HTML returned by the server. It does not execute JavaScript or discover dynamically generated links.
- **Anchor text required:** Links without usable anchor text are skipped.
- **Direct MP3 links:** The scraper expects links that point directly to MP3 files.
- **Access restrictions:** Pages requiring authentication, special headers, or browser-based verification may not be accessible.
- **Duplicate filenames:** Different MP3 links with identical anchor text may overwrite previously downloaded files.

## Future Improvements

Potential enhancements include:

- Support for JavaScript-rendered pages using Playwright.
- Custom download directory.
- Duplicate filename detection.
- Progress indicators for downloads.
- Parallel downloads for improved performance.
- Support for additional audio formats.

## License

MIT License

## Disclaimer

Only download audio files that you have permission to access and download (e.g. Public Domain). Respect website terms of service, copyright restrictions, and applicable laws.