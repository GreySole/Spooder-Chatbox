# Chatbox Overlay - Modular Structure

This chatbox overlay has been refactored into a modular structure for better maintainability and organization.

## File Structure

```
chatbox/
├── index.html              # Main HTML file with script includes
├── chatbox.css             # Styles and animations
├── chatbox.js              # Compatibility loader (optional)
├── chatbox.js.legacy       # Original monolithic file (backup)
├── osc-bundle.js           # OSC communication library
└── js/                     # Modular JavaScript files
    ├── main.js             # Core globals and OSC message handling
    ├── utils.js            # Utility functions
    ├── font-manager.js     # Font loading and management
    ├── emotes.js           # Emote handling
    ├── chat-handler.js     # Chat message creation and deletion
    ├── init.js             # Chatbox initialization
    └── test-functions.js   # Testing utilities
```

## Module Responsibilities

### 📁 `js/main.js`

- Global variables (`txtDecoder`, `targetChannel`)
- OSC message routing and handling
- Entry point for chat messages

### 🔧 `js/utils.js`

- `hexToRgb()` - Color conversion utility
- `scrollToBottom()` - Scroll management
- Window resize handlers

### 🎨 `js/font-manager.js`

- `loadCustomFont()` - Dynamic font loading
- `extractFontFamiliesFromURL()` - Google Fonts URL parsing
- Support for both direct font files and CSS-based fonts (Google Fonts)

### 😀 `js/emotes.js`

- `getEmoteImage()` - Emote HTML generation
- `onEmoteError()` - Emote fallback handling
- Twitch emote integration

### 💬 `js/chat-handler.js`

- `makeChatLine()` - Chat message creation and display
- `deleteMessage()` - Message deletion with animations
- User badge processing
- Message formatting and emote parsing

### ⚙️ `js/init.js`

- `onOSCOpen()` - Chatbox initialization
- Plugin settings application
- CSS custom property management
- Background and border configuration

### 🧪 `js/test-functions.js`

- `testChatLine()` - Test message display
- `testFont()` - Test font loading
- `testGoogleFont()` - Quick Google Fonts testing
- Test data objects

## Font System

The font system now supports:

### Direct Font Files

```javascript
pluginSettings.customfonturl = 'fonts/my-font.woff2';
```

### Google Fonts URLs

```javascript
pluginSettings.customfonturl =
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
```

### Multiple Google Fonts

```javascript
pluginSettings.customfonturl =
  'https://fonts.googleapis.com/css2?family=Irish+Grover&family=Lato:wght@400;700&display=swap';
```

## Testing

Open browser console and use:

```javascript
// Test chat messages
testChatLine('Hello world!');

// Test custom fonts
testFont('https://fonts.googleapis.com/css2?family=Roboto');
testGoogleFont('Comic Sans MS');

// Access API
ChatboxAPI.loadCustomFont('path/to/font.woff2');
```

## Migration Notes

- All functionality remains the same
- Original file preserved as `chatbox.js.legacy`
- Loading order in `index.html` ensures proper dependencies
- Backward compatibility maintained through `ChatboxAPI`

## Benefits

✅ **Maintainability** - Each module has a single responsibility  
✅ **Debugging** - Easier to locate and fix issues  
✅ **Testing** - Individual modules can be tested in isolation  
✅ **Collaboration** - Multiple developers can work on different modules  
✅ **Performance** - Only load needed modules (test functions can be excluded in production)  
✅ **Readability** - Clear separation of concerns
