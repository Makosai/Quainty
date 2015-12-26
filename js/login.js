var config = {
  nick: '',
  name: '',
  pass: '',
  addr: 'irc.twitch.tv',
  port: '80',
  chan: '#quaintshanty'
};

var ws = null;

var loggedIn = false;

var chatbox = document.getElementById('chat-box');
var messagebox = document.getElementById('message-box');
var chatbtn = document.getElementById('chat-btn');

Twitch.events.addListener('auth.login', handleLogin);

function reinitVars() {
  if (!chatbox)
    chatbox = document.getElementById('chat-box');

  if (!messagebox)
    messagebox = document.getElementById('message-box');

  if (!chatbtn)
    chatbtn = document.getElementById('chat-btn');
}

function handleLogin() {
  Twitch.api({
    method: 'user'
  }, function(error, data) {
    config.nick = data.name;
    config.name = data.display_name;
    config.pass = 'oauth:' + Twitch.getToken();
    connect();
  });
}

function login() {
  if (!'WebSocket' in window) {
    output('Error: WebSocket is not supported by your browser.');
    return;
  }

  reinitVars();

  Twitch.getStatus(function(err, status) {
    if (status.authenticated) {
      console.log('authenticated!');
      handleLogin();
    } else {
      Twitch.login({
        scope: oauthConfig.scope
      });
    }
  });
}

function connect() {
  if (loggedIn)
    return;

  try {
    output('Connecting to ' + config.addr + ' on port ' + config.port + '...');

    ws = new WebSocket('ws://' + config.addr);

    output('WebSocket initialized.');

    ws.onopen = function() {
      // Web Socket is connected, send data using send()
      raw('PASS ' + config.pass);
      raw('NICK ' + config.nick);
      raw('CAP REQ :twitch.tv/membership');
      raw('JOIN #quaintshanty\n');
      loggedIn = true;

      chatbtn.value = "Chat";
      messagebox.disabled = false;
    };

    ws.onmessage = function(e) {
      if (e.data.match(/^PING (\S*)/i)) {
        ws.send('PONG ' + RegExp.$1 + '\n');
        output('*PING*PONG*\n');
      } else {
        output(e.data);
      }
    };

    ws.onclose = function() {
      // websocket is closed.
      output('Connection is closed...');
      loggedIn = false;
    };
  } catch (err) {
    output('Failed to send RAW data: ' + err.message);
    loggedIn = false;

    chatbtn.value = "Login";
    messagebox.disabled = true;
  }
}

function raw(data) {
  try {
    ws.send(data);
    output('sent: ' + data);
    return true;
  } catch (err) {
    output('Failed to send RAW data: ' + err.message);
    return false;
  }
}

function output(str) {
  if (!chatbox) {
    chatbox = document.getElementById('chat-box');
  }

  chatbox.innerHTML += ('<div class="message">' + str + '</div>');
}
