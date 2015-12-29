/*
login.js -
  Constructs the WebSocket and holds user data. This script also authenticates
  the user and handles the sending and receiving of raw data.
*/

var config = {
  nick: '',
  name: '', // display name
  pass: '',
  addr: 'irc.twitch.tv',
  port: '80',
  chans: ['#quaintshanty'],
  sendChans: null // channels to send chat to.
};
config.sendChans = config.chans;

var ws = null; // WebSocket

var loggedIn = false;

var chatbox = document.getElementById('chat-box'); // Output
var messagebox = document.getElementById('message-box'); // Input
var chatbtn = document.getElementById('chat-btn'); // Submit

// Used to make sure variables are loaded in the event that this scripts loads
// before the page does (Twitch API causes this).
function reinitVars() {
  if (!chatbox)
    chatbox = document.getElementById('chat-box');

  if (!messagebox)
    messagebox = document.getElementById('message-box');

  if (!chatbtn)
    chatbtn = document.getElementById('chat-btn');
}

// Prepare for authentication and the WebSocket
function login() {
  if (!'WebSocket' in window) {
    output('Error: WebSocket is not supported by your browser.');
    return;
  }

  reinitVars();

  Twitch.getStatus(function(err, status) {
    if (status.authenticated) {
      debugMe('authenticated!');
      handleLogin();
    } else {
      Twitch.login({
        scope: oauthConfig.scope
      });
    }
  });
}

Twitch.events.addListener('auth.login', handleLogin);

// Authenticate
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

// Initialize WebSocket
function connect() {
  if (loggedIn)
    return;

  try {
    debugMe('Connecting to ' + config.addr + ' on port ' + config.port + '...');

    ws = new WebSocket('ws://' + config.addr);

    output('WebSocket initialized.');

    ws.onopen = function() {
      // WebSocket is connected
      raw('PASS ' + config.pass);
      raw('NICK ' + config.nick);
      raw('CAP REQ :twitch.tv/membership');
      config.chans.forEach(function(chan) {
        raw('JOIN ' + chan + '\n');
      });
      loggedIn = true;

      chatbtn.value = "Chat";
      messagebox.disabled = false;
    };

    ws.onmessage = function(e) {
      if (e.data.match(/^PING (\S*)/i)) {
        ws.send('PONG ' + RegExp.$1 + '\n');
      } else {
        output(e.data);
      }
    };

    ws.onclose = function() {
      // websocket is closed
      debugMe('Connection is closed...');
      loggedIn = false;
    };
  } catch (err) {
    debugMe('Failed to initialize WebSocket: ' + err.message);
    loggedIn = false;

    chatbtn.value = "Login";
    messagebox.disabled = true;
  }
}

function raw(data) {
  try {
    ws.send(data);
    debugMe('sent: ' + data);
    return true;
  } catch (err) {
    debugMe('Failed to send RAW data: ' + err.message);
    return false;
  }
}

// Display text to chat box
function output(str) {
  if (!chatbox) {
    chatbox = document.getElementById('chat-box');
  }

  chatbox.innerHTML += ('<div class="message">' + str + '</div>');
}
