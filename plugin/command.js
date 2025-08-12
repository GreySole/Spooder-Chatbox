class ChatBox {
  constructor() {}

  expressions = {
    neutral: String.raw`
		/╲/\( ºo ω oº )/\╱\
	`,
    happy: String.raw`
		/╲/\( º^ ω ^º )/\╱\
	`,
    uwu: String.raw`
		/╲/\( ºU ω Uº )/\╱\
	`,
    owo: String.raw`
		/╲/\( ºO ω Oº )/\╱\
	`,
    pwq: String.raw`
		/╲/\( ºp ω qº )/\╱\
	`,
  };

  lastMessage = null;

  commandList = {};

  txtEncoder = new TextEncoder();

  onLoad() {
    const twitch = this.modules.stream.twitch;
    twitch?.subscribeToModuleEvent('messagedeleted', (data) => {
      console.log('CHATBOX MESSAGE DELETED', data);
      this.osc.sendToTCP('/chat/delete/message', data.userstate['target-msg-id']);
    });
    twitch?.subscribeToModuleEvent('ban', (data) => {
      console.log('CHATBOX USER BANNED', data);
      this.osc.sendToTCP('/chat/ban/user', data.userstate['target-user-id']);
    });

    twitch?.subscribeToModuleEvent('clearchat', (data) => {
      console.log('CHATBOX CLEAR CHAT', data);
      this.osc.sendToTCP('/chat/clear', 0);
    });

    twitch?.subscribeToModuleEvent('botmessage', (data) => {
      console.log('CHATBOX BOT MESSAGE', data);
      this.onChat(data);
    });

    this.setSettings({
      ...this.settings,
      homeChannel: this.modules.stream.twitch.broadcasterUsername,
    });
  }

  testMe() {}

  onChat(message) {
    if (
      message.message.includes('<iframe') ||
      message.message.includes('<img') ||
      message.message.includes('<video')
    ) {
      message.respond("I see an HTML media tag, so I probably shouldn't send that to chatbox.");
      return;
    }

    const settings = message.shareId ? this.getShareSettings(message.shareId) : this.settings;

    let owo = settings.bot.owo;
    if (owo == true) {
      if (
        (message.message.toLowerCase().length == 3 &&
          message.message.toLowerCase().charAt(1) == 'w') ||
        (message.message.toLowerCase().length == 5 &&
          message.message.toLowerCase().charAt(2) == 'w')
      ) {
        let eyes = ['?', '?'];
        if (
          message.message.toLowerCase().length == 3 &&
          message.message.toLowerCase().charAt(1) == 'w'
        ) {
          eyes = [message.message.charAt(0), message.message.charAt(2)];
        } else {
          eyes = [
            message.message.charAt(0) + message.message.charAt(1),
            message.message.charAt(3) + message.message.charAt(4),
          ];
        }
        let expression = String.raw`
				/╲/\( º${eyes[0]} ω ${eyes[1]}º )/\╱\
				`;
        message.respond(expression);
      }
    }

    if (message.message.toLowerCase() == '!botinchat' && (message.isBroadcaster || message.isMod)) {
      if (settings.bot.botinchat) {
        message.respond('I will show in Chatbox ' + this.expressions.happy);
      } else {
        message.respond('I will not show in Chatbox ' + this.expressions.pwq);
      }
    }

    if (message.message.startsWith('!')) {
      return;
    }

    let botInChat = settings.bot.botinchat;

    console.log(message.botUsername, this.modules.stream.twitch);

    if (botInChat == false) {
      if (message.username == this.modules.stream.twitch?.botUsername) {
        return;
      }
    }

    if (message.message == this.lastMessage) {
      return;
    }

    this.lastMessage = message.message;
    this.osc.sendToTCP(
      '/chat/general',
      JSON.stringify({
        message: this.txtEncoder.encode(message.message),
        messageId: message.tags['id'],
        color: message.tags['color'],
        emotes: message.tags['emotes'],
        channel: message.channel,
        userId: message.userId,
        username: message.username,
        displayName: message.displayName,
        isFirstMessage: message.isFirstMessage,
        isBroadcaster: message.isBroadcaster,
        isMod: message.isMod,
        isSubscriber: message.isSubscriber,
        isVIP: message.isVIP,
      }),
    );
  }
}

module.exports = ChatBox;
