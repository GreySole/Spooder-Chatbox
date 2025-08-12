// ============================================================================
// CHATBOX INITIALIZATION AND CONFIGURATION
// ============================================================================

/**
 * Initialize chatbox when OSC connection opens
 */
onOSCOpen = () => {
  targetChannel = pluginSettings.homeChannel;
  if (window.shareInfo) {
    targetChannel = window.shareInfo.streamPlatforms?.twitch?.username || null;
    console.log('Target Channel:', targetChannel);
  }

  const windowColor = hexToRgb(pluginSettings.window.windowcolor);
  const borderColor = hexToRgb(pluginSettings.border.bordercolor);
  const windowStyle =
    'rgba(' +
    windowColor.r +
    ', ' +
    windowColor.g +
    ', ' +
    windowColor.b +
    ', ' +
    pluginSettings.window.windowopacity / 100 +
    ')';
  const borderStyle =
    'rgba(' +
    borderColor.r +
    ', ' +
    borderColor.g +
    ', ' +
    borderColor.b +
    ', ' +
    pluginSettings.border.borderopacity / 100 +
    ')';

  const useImage = pluginSettings.bg.useimage;
  const backgroundImage = pluginSettings.bg.backgroundimage;
  const bgOpacity = pluginSettings.bg.bgopacity;
  const bgFill = pluginSettings.bg.bgfill;
  const tileBG = pluginSettings.bg.tilebg;
  const tileBGSize = pluginSettings.bg.tilebgsize;
  const tileScrollX = pluginSettings.bg.scrollbgx;
  const tileScrollY = pluginSettings.bg.scrollbgy;
  const tileScrollSpeed = pluginSettings.bg.scrollspeed;
  const fullWidth =
    pluginSettings.window.windowmode == 'fwidth' || pluginSettings.window.windowmode == 'fheight';
  const fullHeight = pluginSettings.window.windowmode == 'fheight';
  const defaultFont = pluginSettings.font.defaultfont;

  const borderUseImage = pluginSettings.border.border_useimage;
  const borderImage = pluginSettings.border.border_image;
  const borderImageSlice = pluginSettings.border.border_image_slice;
  const borderImageWidth = pluginSettings.border.border_image_width;
  const borderImageMargin = pluginSettings.border.border_image_margin;

  const fontSize = pluginSettings.font.fontsize;
  const useCustomFont = pluginSettings.font.usecustomfont;
  const customFontType = pluginSettings.font.customfonttype;

  const customFontURL = useCustomFont
    ? customFontType === 'url'
      ? pluginSettings.font.customfonturl
      : getAssetPath(pluginSettings.font.customfontasset)
    : '';

  // Apply window mode classes
  if (fullWidth == true) {
    document.body.classList.add('fwidth');
  }
  if (fullHeight == true) {
    document.body.classList.add('fheight');
    document.body.classList.add('fwidth');
  }

  document.documentElement.style.setProperty('--chatbox-font-size', (fontSize ?? 1.5) + 'rem');

  // Set default font
  document.documentElement.style.setProperty('--chatbox-font', defaultFont);

  // Handle custom font loading
  if (customFontURL && customFontURL.trim() !== '') {
    loadCustomFont(customFontURL);
  }

  // Apply background and border styles
  document.documentElement.style.setProperty('--background-color', windowStyle);
  document.documentElement.style.setProperty('--border-color', borderStyle);

  if (useImage) {
    document.documentElement.style.setProperty(
      '--background-image',
      "url('" + getAssetPath(backgroundImage) + "')",
    );
    document.documentElement.style.setProperty('--background-image-opacity', bgOpacity);
    if (tileBG) {
      document.documentElement.style.setProperty('--background-size', tileBGSize + 'px');
      document.documentElement.style.setProperty(
        '--background-scroll-x',
        tileBGSize * parseInt(tileScrollX) + 'px',
      );
      document.documentElement.style.setProperty(
        '--background-scroll-y',
        tileBGSize * parseInt(tileScrollY) + 'px',
      );
      document.documentElement.style.setProperty(
        '--background-scroll-speed',
        parseInt(tileScrollSpeed) + 's',
      );
    } else {
      document.documentElement.style.setProperty('--background-size', bgFill);
    }
  }

  if (borderUseImage) {
    document.documentElement.style.setProperty(
      '--border-image',
      "url('" + getAssetPath(borderImage) + "')",
    );
    document.documentElement.style.setProperty('--border-image-slice', borderImageSlice + '%');
    document.documentElement.style.setProperty('--border-image-width', borderImageWidth + 'px');
    document.documentElement.style.setProperty('--border-image-margin', borderImageMargin + 'px');
    document.querySelector('.chatbox-main').classList.add('border-image');
  }
};
