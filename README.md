# Developer Browser - New Tab Extension

A clean, lightweight, and developer-focused Chrome New Tab extension. Perfect for developers who want quick access to their essential tools and resources.

![Developer Browser Preview](preview.png)

## ✨ Features

- **Editable Title** - Personalize your new tab with a custom title (click to edit)
- **Quick Links** - One-click access to essential developer tools and websites
- **Live Clock** - Real-time display of current time and date
- **DuckDuckGo Search** - Privacy-focused search right from your new tab
- **Built-in Notepad** - Quick notes that persist across sessions
- **Beautiful Backgrounds** - Rotating tech-themed backgrounds
- **Keyboard Shortcuts** - Fast navigation with keyboard support

## 🔗 Quick Links Categories

### AI & Learning
- ChatGPT, Claude, Stack Overflow, HackerRank, LeetCode, GeeksforGeeks

### Code & Repositories
- GitHub, GitLab, Bitbucket

### Hosting & Deployment
- Vercel, Netlify, Railway

### Docs & Tools
- MDN Docs, Firebase Studio, Docker Hub, Postman

### Utilities
- JSON Formatter, URL Encoder, Image Color Picker, CSS Gradient Generator
- Color Palette, Color Space, CDN Fonts, Note Pad, Atternity UI

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus search bar |
| `Alt + N` | Open notepad |
| `Alt + T` | Edit title |
| `Enter` | Save title (when editing) |
| `Escape` | Cancel editing / Close notepad |

## 🚀 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](#) (link coming soon)
2. Click "Add to Chrome"
3. Open a new tab to see your new homepage!

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `DeveloperBrowser` folder
6. Open a new tab to enjoy!

## 📋 Chrome Web Store Policy Compliance

This extension adheres to all Chrome Web Store policies:

- ✅ **No tracking** - Zero external trackers or analytics
- ✅ **No data collection** - All data stored locally in your browser
- ✅ **No ads** - Completely ad-free experience
- ✅ **No misleading content** - Honest, straightforward functionality
- ✅ **Minimal permissions** - Only requests `storage` permission
- ✅ **Fast & lightweight** - Pure HTML, CSS, and vanilla JavaScript
- ✅ **Privacy-focused** - Uses DuckDuckGo as default search

## 🔒 Privacy

- All data (title, notes) is stored locally using `localStorage`
- No external requests except when you click links or search
- No cookies or tracking scripts
- No user data leaves your browser

## 🛠️ Technical Details

- **Manifest Version**: 3 (latest)
- **Technologies**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Chrome Storage API / localStorage
- **Fonts**: JetBrains Mono, Inter (Google Fonts)

## 📁 Project Structure

```
DeveloperBrowser/
├── manifest.json      # Chrome extension manifest
├── newtab.html        # Main HTML structure
├── styles.css         # All styling
├── script.js          # Core functionality
├── icons/
│   ├── icon16.png     # 16x16 icon
│   ├── icon48.png     # 48x48 icon
│   └── icon128.png    # 128x128 icon
└── README.md          # This file
```

## 🎨 Customization

The extension uses CSS custom properties for easy theming. Edit `styles.css` to customize:

```css
:root {
  --accent-primary: #6366f1;    /* Main accent color */
  --accent-secondary: #8b5cf6;  /* Secondary accent */
  --bg-primary: #0a0a0f;        /* Background color */
}
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Support

If you encounter any issues, please open an issue on GitHub.

---

Made with ❤️ for developers, by developers.
