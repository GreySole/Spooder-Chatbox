// ============================================================================
// MAIN CHATBOX SCRIPT - GLOBALS AND OSC MESSAGE HANDLING
// ============================================================================

var txtDecoder = new TextDecoder();
var targetChannel = null;

/**
 * Handle incoming OSC messages
 * @param {object} message - OSC message object
 */
function getOSCMessage(message) {
  var address = message.address.split('/');

  switch (address[1]) {
    case 'chat':
      switch (address[2]) {
        case 'general':
          let messageData = JSON.parse(message.args[0]);
          if (targetChannel != null) {
            if (messageData.channel != targetChannel) {
              return;
            }
          }
          console.log(messageData);
          makeChatLine(
            txtDecoder.decode(Uint8Array.from(Object.values(messageData.message))),
            {
              messageId: messageData.messageId,
              userId: messageData.userId,
              name: messageData.displayName,
              color: messageData.color,
              broadcaster: messageData.isBroadcaster,
              mod: messageData.isMod,
              subscriber: messageData.isSubscriber,
              vip: messageData.isVIP,
              firstMsg: messageData.isFirstMessage,
            },
            messageData.emotes,
          );
          break;
        case 'delete':
          let deleteId = message.args[0];
          console.log('DELETE', deleteId);
          deleteMessage(deleteId);
          break;
        case 'ban':
          let banId = message.args[0];
          console.log('BAN', banId);
          deleteUser(banId);
          break;
        case 'clear':
          clearChat();
          break;
      }

    case 'settings':
      break;
  }
}
