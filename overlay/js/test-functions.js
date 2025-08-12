// ============================================================================
// TEST DATA AND FUNCTIONS
// ============================================================================

var testUser = {
  name: 'GreyBoiGaming',
  color: '#FF0000',
  mod: false,
  subscriber: false,
  firstMsg: false,
  badges: {},
};

var testEmote = [
  {
    id: 'emotesv2_e0276ad25377439eb77862ecc5d72005',
    start: 6,
    end: 21,
  },
  {
    id: '555555584',
    start: 28,
    end: 29,
  },
  {
    id: 'emotesv2_7b316222884b49eab03546dd056d66a0',
    start: 38,
    end: 44,
  },
];

var testMessage = 'Hello goodgr8BeanHeart I am <3 da boi HeyGuys';
var longTestMessage =
  "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley";

/**
 * Test chat line creation
 * @param {string} customMsg - Custom message to test (optional)
 */
function testChatLine(customMsg) {
  if (customMsg == null) {
    if (Math.round(Math.random()) == 1) {
      makeChatLine(testMessage, testUser, testEmote);
    } else {
      makeChatLine(longTestMessage, testUser, null);
    }
  } else {
    if (Math.round(Math.random()) == 1) {
      makeChatLine(customMsg, testUser, testEmote);
    } else {
      makeChatLine(customMsg, testUser, null);
    }
  }
}

/**
 * Test font loading - can be called from browser console
 * @param {string} fontPath - Font URL or path to test
 */
function testFont(fontPath) {
  console.log('Testing font:', fontPath);
  loadCustomFont(fontPath);
}

/**
 * Quick test function for Google Fonts
 * @param {string} fontName - Google Font name to test
 */
function testGoogleFont(fontName) {
  const googleFontURL = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
  console.log('Testing Google Font:', fontName, 'URL:', googleFontURL);
  loadCustomFont(googleFontURL);
}
