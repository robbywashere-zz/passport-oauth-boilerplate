let { Strategy } = require('passport-twitter');
const { AuthApp } = require('./passport-auth');
const { User } = require('../models')

module.exports = function(app, { consumerKey, clientSecret }) {
  AuthApp(app,{
    credentials: { consumerKey, clientSecret },
    callbackURL: '/auth/twitter/callback',
    userModel: User,
    loginURL: '/auth/twitter',
    strategy:  Strategy,
    successRedirect: '/whoami',
    failureRedirect: '/',
    findBy: 'oauthID',
    defaultUser:{
      login: p=> p.username,
      email: p=> p.emails[0].value,
      oauthID: p => p.id,
      accessToken: p => p.accessToken,
      refreshToken: p => p.refreshToken
    },
    authConfig: { 
      approval_prompt: 'force',
      accessType: 'offline',
      scope: [
        'user-read-email', 
        'user-read-private',
        'playlist-modify-private',
        'playlist-modify-public'
      ],
      showDialog: true
    } 
  })
}
