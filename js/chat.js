/*
chat.js -
  Handles basic chatting functions. Mainly sending and receiving. Receiving calls
  are handled in login.js where the WebSocket is initialized. However, chat.js owns
  the actual function.
*/

// Send a privmsg() to all the channels that the user has selected to chat to
function sendMessage() {
  if (!loggedIn) {
    login();
    return;
  }
  if (!messagebox) {
    messagebox = document.getElementById('message-box');
  }

  if (messagebox.value.length > 0 && messagebox.value.match(".*\\w.*")) {
    output(config.name + ': ' + messagebox.value);
    privmsg(messagebox.value, config.sendChans);
    clearChatInput();
  }
}

// Send raw PRIVMSG to server with msg
function privmsg(msg, chans) {
  chans.forEach(function(chan) {
    raw('PRIVMSG ' + chan + ' :' + msg);
  });
}

function clearChatInput() {
  if (!messagebox) {
    messagebox = document.getElementById('message-box');
  }

  messagebox.value = "";
}
