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
    chat(messagebox.value, new Array(config.chan));
    clearChatInput();
  }
}

function chat(msg, chans) {
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
