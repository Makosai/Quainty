/*
auth.js -
  Used to house any authentication data required for Twitch. This data is independent
  of the user themselves and should only contain information belonging to the website
  and not the consumers.
*/

var oauthConfig = {
  clientID: 'de84rjd2hrql8kw0q1d0r7mw51moyid',
  redirectURI: 'http://127.0.0.1:3000', //For testing on a private server. Feel free to change.
  scope: ['chat_login', 'user_read']
}

Twitch.init({
  clientId: oauthConfig.clientID
}, function(error, status) {
  // the sdk is now loaded
});
