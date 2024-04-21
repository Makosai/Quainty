/*
chat.js -
  Handles basic chatting functions. Mainly sending and receiving. Receiving calls
  are handled in login.js where the WebSocket is initialized. However, chat.js owns
  the actual function.
*/

// Send a privmsg() to all the channels that the user has selected to chat to

let _messagebox = messagebox;
function sendMessage() {
  if (!loggedIn) {
    login();
    return;
  }
  if (!messagebox) {
    _messagebox = document.getElementById('message-box');
  }

  if (_messagebox.value.length > 0 && _messagebox.value.match(".*\\w.*")) {
    output('<b><font color="blue">' + config.name + '</font></b>: ' +
      _messagebox.value);
    privmsg(_messagebox.value, config.sendChans);
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
  if (!_messagebox) {
    _messagebox = document.getElementById('message-box');
  }

  _messagebox.value = "";
}
