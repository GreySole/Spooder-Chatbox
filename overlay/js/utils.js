// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color string
 * @returns {object|null} RGB object or null if invalid
 */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Scroll chatbox to bottom
 */
function scrollToBottom() {
  document
    .querySelector('.chatbox-main')
    .scrollTo(0, document.querySelector('.chatbox-main').scrollHeight);
}

/**
 * Handle window resize events
 */
window.onresize = (e) => {
  scrollToBottom();
};
