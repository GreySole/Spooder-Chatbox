// ============================================================================
// EMOTE HANDLING
// ============================================================================

/**
 * Handle emote loading errors
 * @param {HTMLImageElement} img - Image element that failed to load
 */
function onEmoteError(img) {
  console.log(img);
  let scale = img.getAttribute('scale');
  var emoteID = img.getAttribute('emote');
  if (img.src.includes('animated')) {
    img.src = 'https://static-cdn.jtvnw.net/emoticons/v2/' + emoteID + '/static/light/' + scale;
  } else {
    console.log('EMOTE NOT FOUND');
  }
}

/**
 * Generate emote image HTML
 * @param {string} id - Emote ID
 * @param {number} scale - Scale factor
 * @returns {string} HTML string for emote image
 */
function getEmoteImage(id, scale) {
  var url = 'https://static-cdn.jtvnw.net/emoticons/v2/' + id + '/animated/light/' + scale + '.0';
  let tag =
    "<img src='" +
    url +
    "' onerror='onEmoteError(this)' scale='" +
    scale +
    ".0' emote='" +
    id +
    `' style='height: ${scale}em; width: auto; vertical-align: middle;'/>`;
  return tag;
}
