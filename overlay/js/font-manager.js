// ============================================================================
// FONT MANAGEMENT
// ============================================================================

/**
 * Generate text styling CSS from plugin settings
 * @returns {string} CSS text styling properties
 */
function getTextStyling() {
  let textStyling = '';

  // Add text outline/stroke if enabled
  if (
    pluginSettings.font.textoutline &&
    pluginSettings.font.textoutlinecolor &&
    pluginSettings.font.textoutlinewidth
  ) {
    const outlineWidth = pluginSettings.font.textoutlinewidth || 1;
    const outlineColor = pluginSettings.font.textoutlinecolor || '#000000';
    textStyling += `text-stroke: ${outlineWidth}px ${outlineColor}; -webkit-text-stroke: ${outlineWidth}px ${outlineColor}; `;
  }

  // Add text shadow if enabled
  if (pluginSettings.font.textshadow && pluginSettings.font.textshadowcolor) {
    const shadowX = pluginSettings.font.textshadowoffsetx || 2;
    const shadowY = pluginSettings.font.textshadowoffsety || 2;
    const shadowBlur = pluginSettings.font.textshadowblur || 0;
    const shadowColor = pluginSettings.font.textshadowcolor || '#000000';
    const shadowOpacity = pluginSettings.font.textshadowopacity || 1.0;

    // Convert color to rgba with opacity if needed
    const shadowColorWithOpacity =
      shadowOpacity < 1.0 ? convertToRgbaWithOpacity(shadowColor, shadowOpacity) : shadowColor;

    textStyling += `text-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColorWithOpacity}; `;
  }

  return textStyling;
}

/**
 * Load custom font from URL or local path
 * @param {string} fontPath - Font URL or local path
 */
function loadCustomFont(fontPath) {
  // Remove any existing custom font
  const existingFont = document.querySelector('#custom-font-style');
  if (existingFont) {
    existingFont.remove();
  }

  const existingLink = document.querySelector('#custom-font-link');
  if (existingLink) {
    existingLink.remove();
  }

  // Create font URL - if it's already a URL, use as-is, otherwise convert path to URL
  let fontURL;
  if (
    fontPath.startsWith('http://') ||
    fontPath.startsWith('https://') ||
    fontPath.startsWith('data:')
  ) {
    fontURL = fontPath;
  } else {
    fontURL = getAssetPath(fontPath);
  }

  // Check if this is a CSS file (like Google Fonts) or a direct font file
  const isCSSFont =
    fontURL.includes('googleapis.com') ||
    fontURL.includes('.css') ||
    fontURL.includes('fonts.') ||
    fontURL.includes('css2?family=');

  if (isCSSFont) {
    // Handle CSS-based fonts (like Google Fonts)
    const link = document.createElement('link');
    link.id = 'custom-font-link';
    link.rel = 'stylesheet';
    link.href = fontURL;

    link.onload = function () {
      console.log('CSS font loaded successfully:', fontURL);

      // Extract font family names from Google Fonts URL or use common ones
      let fontFamilies = extractFontFamiliesFromURL(fontURL);

      // Apply the fonts to the body with text styling
      const style = document.createElement('style');
      style.id = 'custom-font-style';

      style.textContent = `
        body {
          font-family: ${fontFamilies}, var(--chatbox-font), Arial, sans-serif !important;
          ${getTextStyling()}
        }
      `;
      document.head.appendChild(style);
    };

    link.onerror = function () {
      console.error('Failed to load CSS font:', fontURL);
      // Fallback to default font
      document.documentElement.style.setProperty(
        '--chatbox-font',
        pluginSettings.font.defaultfont || 'Arial',
      );
    };

    document.head.appendChild(link);
  } else {
    // Handle direct font files (.ttf, .woff, .woff2, etc.)
    const style = document.createElement('style');
    style.id = 'custom-font-style';

    // Define the font face and apply it with text styling
    style.textContent = `
      @font-face {
        font-family: 'CustomChatFont';
        src: url('${fontURL}') format('truetype'),
             url('${fontURL}') format('woff2'),
             url('${fontURL}') format('woff'),
             url('${fontURL}') format('opentype');
        font-display: swap;
      }
      
      body {
        font-family: 'CustomChatFont', var(--chatbox-font), Arial, sans-serif !important;
        ${getTextStyling()}
      }
    `;

    document.head.appendChild(style);

    // Optional: Check if font loaded successfully
    if ('fonts' in document) {
      const fontFace = new FontFace('CustomChatFont', `url(${fontURL})`);
      fontFace
        .load()
        .then(function (loadedFont) {
          document.fonts.add(loadedFont);
          console.log('Custom font loaded successfully:', fontURL);
        })
        .catch(function (error) {
          console.error('Failed to load custom font:', fontURL, error);
          // Fallback to default font
          document.documentElement.style.setProperty(
            '--chatbox-font',
            pluginSettings.font.defaultfont || 'Arial',
          );
        });
    }
  }
}

/**
 * Convert a color to rgba with specified opacity
 * @param {string} color - Color in hex, rgb, or named format
 * @param {number} opacity - Opacity value between 0 and 1
 * @returns {string} RGBA color string
 */
function convertToRgbaWithOpacity(color, opacity) {
  // If already rgba/hsla, return as-is
  if (color.toLowerCase().includes('rgba') || color.toLowerCase().includes('hsla')) {
    return color;
  }

  // Convert hex to rgb
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Convert rgb to rgba
  if (color.toLowerCase().startsWith('rgb(')) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${opacity})`;
    }
  }

  // For named colors or other formats, wrap in rgba (may not work for all cases)
  return color;
}

/**
 * Extract font families from Google Fonts URL
 * @param {string} url - Google Fonts URL
 * @returns {string} Comma-separated font family list
 */
function extractFontFamiliesFromURL(url) {
  try {
    // Extract font families from Google Fonts URL
    if (url.includes('family=')) {
      const families = [];
      const matches = url.match(/family=([^&]+)/g);

      if (matches) {
        matches.forEach((match) => {
          const familyPart = match.replace('family=', '');
          // Extract just the font name (before any colon or plus signs)
          let fontName = familyPart.split(':')[0];
          fontName = fontName.replace(/\+/g, ' '); // Replace + with spaces
          fontName = decodeURIComponent(fontName);
          families.push(`'${fontName}'`);
        });
      }

      return families.join(', ');
    }
  } catch (error) {
    console.error('Error extracting font families:', error);
  }

  // Fallback to common font names if extraction fails
  return "'Roboto', 'Lato', 'Open Sans', 'Montserrat'";
}
