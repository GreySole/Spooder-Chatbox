// ============================================================================
// CHAT MESSAGE HANDLING
// ============================================================================

/**
 * Create and display a chat line
 * @param {string} message - Chat message text
 * @param {object} user - User information object
 * @param {array} emotes - Array of emote objects
 */
function makeChatLine(message, user, emotes) {
  console.log(message, user);
  let thisSettings = pluginSettings;

  //Numbers and chat commands will not show
  if (message.startsWith('!') || !isNaN(message)) {
    return;
  }

  let userBadges = [];
  let windowBadges = [];

  if (user.badges) {
    userBadges = Object.keys(user.badges);
  }

  if (user.mod) {
    userBadges.push('mod');
  }
  if (user.broadcaster) {
    userBadges.push('broadcaster');
  }
  if (user.turbo) {
    userBadges.push('turbo');
  }
  if (user.firstMsg) {
    windowBadges.push('firstMsg');
  }
  if (user.discord) {
    userBadges.push('discord');
  }

  const chatEl = document.createElement('div');
  chatEl.dataset.messageId = user.messageId;
  chatEl.dataset.userId = user.userId;
  chatEl.className = 'chatbox-message ' + windowBadges.join(' ');

  let chatLine = '';

  if (user == null) {
    user = {
      name: 'Anon',
      color: '#000000',
    };
  }

  let tPos = 0;
  if (emotes == null) {
    emotes = [];
  }
  console.log('MESSAGE', message, emotes);
  if (thisSettings.usernamecolor == false || user['color'] == '' || user['color'] == null) {
    user['color'] = thisSettings.defaultnamecolor;
  }
  chatLine +=
    "<span class='message-content' style='color:" +
    thisSettings.textcolor +
    "'><span class='message-name " +
    userBadges.join(' ') +
    "' style='color:" +
    user['color'] +
    "'>" +
    user['name'] +
    ':</span>';

  if (emotes.length > 0) {
    emotes = emotes.sort(function (a, b) {
      return a.start - b.start;
    });
    if (emotes.length == 1 && emotes[0].end + 1 - emotes[0].start == message.length) {
      chatLine += getEmoteImage(emotes[0].id, 4.0);
    } else {
      for (let e in emotes) {
        chatLine += message.substring(tPos, emotes[e].start);
        chatLine += getEmoteImage(emotes[e].id, 2.0);
        tPos = emotes[e].end + 1;
      }
      chatLine += message.substring(tPos);
    }
  } else {
    chatLine += message;
  }
  chatLine += '</span>';
  chatEl.innerHTML = chatLine;

  if (document.body.classList.contains('fheight')) {
    document.querySelector('.chatbox-main').prepend(chatEl);
  } else {
    document.querySelector('.chatbox-main').append(chatEl);
  }
  chatEl.ghostOut = () => {
    chatEl.style.animationName = 'heightOut';
    chatEl.style.animationDuration = '0.5s';
    chatEl.style.animationIterationCount = 1;
    chatEl.addEventListener('animationend', function () {
      chatEl.remove();
    });
  };
  if (
    document.querySelector('.chatbox-main').children.length > parseInt(thisSettings.maxmessages)
  ) {
    if (document.body.classList.contains('fheight')) {
      document.querySelector('.chatbox-main').lastElementChild.remove();
    } else {
      document.querySelector('.chatbox-main').firstElementChild.remove();
    }
  }
  if (thisSettings.messagetimeout != '0') {
    setTimeout(chatEl.ghostOut, parseInt(thisSettings.messagetimeout) * 1000);
  }
  setTimeout(scrollToBottom, 200);
  //scrollToBottom();
}

/**
 * Delete a chat message by ID
 * @param {string} id - Message ID to delete
 */
function deleteMessage(id) {
  let chatEl = document.querySelector(`.chatbox-main [data-message-id='${id}']`);
  console.log('DELETE', id);
  chatEl.style.animationName = 'heightOut';
  chatEl.style.animationDuration = '0.5s';
  chatEl.style.animationIterationCount = 1;
  chatEl.addEventListener('animationend', function () {
    chatEl.remove();
  });
}

function deleteUser(userId) {
  let chatEl = document.querySelectorAll(`.chatbox-main [data-user-id='${userId}']`);
  chatEl.forEach((element) => {
    element.style.animationName = 'heightOut';
    element.style.animationDuration = '0.5s';
    element.style.animationIterationCount = 1;
    element.addEventListener('animationend', function () {
      element.remove();
    });
  });
  console.log('DELETE USER', userId);
  chatEl.forEach((element) => {
    element.style.animationName = 'heightOut';
    element.style.animationDuration = '0.5s';
    element.style.animationIterationCount = 1;
    element.addEventListener('animationend', function () {
      element.remove();
    });
  });
}

function clearChat() {
  let chatEls = document.querySelectorAll('.chatbox-main .chatbox-message');
  chatEls.forEach((element) => {
    element.style.animationName = 'heightOut';
    element.style.animationDuration = '0.5s';
    element.style.animationIterationCount = 1;
    element.addEventListener('animationend', function () {
      element.remove();
    });
  });
}
