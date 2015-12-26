var oauthConfig = {
  clientID: 'de84rjd2hrql8kw0q1d0r7mw51moyid',
  redirectURI: 'http://108.33.115.197:3000',
  scope: ['chat_login']
}

Twitch.init({
  clientId: oauthConfig.clientID
}, function(error, status) {
  // the sdk is now loaded
});
