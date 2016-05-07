/*
login.js -
  Constructs the WebSocket and holds user data. This script also authenticates
  the user and handles the sending and receiving of raw data.
*/

var config = {
  nick: '',
  name: '', // display name
  pass: '',
  addr: 'irc-ws.chat.twitch.tv',
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
var chatstatus = document.getElementById('chat-status'); // Chat status text

// Used to make sure variables are loaded in the event that this scripts loads
// before the page does (Twitch API causes this).
function reinitVars() {
  if (!chatbox)
    chatbox = document.getElementById('chat-box');

  if (!messagebox)
    messagebox = document.getElementById('message-box');

  if (!chatbtn)
    chatbtn = document.getElementById('chat-btn');

  if (!chatstatus)
    chatstatus = document.getElementById('chat-status');
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

    ws = new WebSocket('wss://' + config.addr);

    output('WebSocket initializing...');

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
      chatstatus.innerHTML =
        '<div class="name">' + config.name +
        '<a href class="logout" onclick="javascript:logout();return false;">[Logout]</a></div>';
      chatstatus.style.background =
        'radial-gradient(circle at 5px 5px, #58FA58, #38610B)';
      messagebox.disabled = false;
    };

    ws.onmessage = function(e) {
      if (e.data.match(/^PING (\S*)/i)) {
        ws.send('PONG ' + RegExp.$1 + '\n');
      } else {
        handleMsg(e.data);
      }
    };

    ws.onclose = function() {
      // websocket is closed
      debugMe('Connection is closed...');
      loggedIn = false;
    };
  } catch (err) {
    debugMe('Failed to initialize WebSocket: ' + err.message);

    logout();
  }
}

function logout() {
  if (loggedIn) {
    Twitch.logout(function(error) {
      // the user is now logged out
      ws.close();

      loggedIn = false;

      chatbtn.value = "Login";
      chatstatus.innerHTML = '<div class="name">Not signed in</div>';
      chatstatus.style.background =
        'radial-gradient(circle at 5px 5px, #555, #000)';
      messagebox.disabled = true;
    });
  }
}

function handleMsg(data) {
  debugMe(data);
  var _nick, _type, _channel, _message = "",
    ex = [];

  ex = data.split(' ', 5);

  // split the message and the other data
  var split1 = data.split(':');
  if (split1.length > 1) {
    // splitting nick, type, chan, and message
    var split2 = split1[1].split(' ');

    //the nick section consists of various things - we only need the nick itself
    _nick = split2[0]
    _nick = _nick.split('!')[0];

    // type = PRIVMSG for normal messages and some other types will be added later
    _type = split2[1];

    // the channel the data was sent to
    _channel = split2[2];

    // get the message
    if (split1.length > 2) {
      for (var i = 2; i < split1.length; i++) {
        _message += split1[i] + ' ';
      }
    }

    if (_type == "353") {
      // split the message
      split3 = split1[2].split(' ');
      for (var i = 0; i < split3.length; i++) {
        // add multiple users
      }
    } else {
      if (_channel.includes('#')) {
        switch (_type) {
          case 'JOIN':
            // add the user
            break;
          case 'PART':
            // rem the user
            break;
          case 'PRIVMSG':
            output('<font color="blue"><b>' + _nick + '</font></b>: ' +
              _message); // replace with a new function that loads the user's color from a list
            break;
        }
      }
    }
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

  var prevTop = chatbox.scrollHeight - chatbox.scrollTop;
  var prevHeight = chatbox.scrollHeight;
  var factorTop = (chatbox.scrollHeight - prevHeight); // keeps the scrolling still if they are not at the bottom

  if (chatbox.scrollTop === chatbox.scrollHeight - chatbox.offsetHeight) {
    prevTop -= prevTop;
  } else {
    factorTop = 0;
  }

  chatbox.innerHTML += ('<div class="message">' + str + '</div>');

  chatbox.scrollTop = chatbox.scrollHeight - prevTop - (chatbox.scrollHeight -
    prevHeight);
}
