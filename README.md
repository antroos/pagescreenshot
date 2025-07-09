# PageScreenshot Chrome Extension

A simple Chrome extension to capture a full-page screenshot of any website by URL.

![Demo Screenshot](screenshot.png)

## Features
- Enter any URL and get a full-page screenshot (not just the visible area)
- Waits for the page to load and for 3 seconds before capturing
- Automatically downloads the screenshot as a PNG
- Works with most modern websites

## How to Install
1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select this project folder
5. The extension icon will appear in your Chrome toolbar

## How to Use
1. Click the extension icon
2. Enter the URL of the page you want to capture
3. Click "Take Screenshot"
4. The extension will open the page in a new tab, wait for it to load, scroll and capture the full page, and automatically download the screenshot

## Example
![How it works](screenshot.png)

## Project Structure
- `manifest.json` — Chrome extension manifest
- `popup.html` — Popup UI
- `popup.js` — Popup logic
- `background.js` — Background logic (tab management, screenshot)
- `contentScript.js` — Content script for full-page screenshot
- `styles.css` — Popup styles

## License
MIT 