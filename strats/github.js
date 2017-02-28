let { Strategy } = require('passport-github');
const { AuthApp } = require('./passport-auth');
const { User } = require('../models')

module.exports = function(app, { clientID, clientSecret }) {
  AuthApp(app,{
    credentials: { clientID, clientSecret },
    callbackURL: '/auth/github/callback',
    userModel: User,
    loginURL: '/auth/github',
    strategy:  Strategy,
    successRedirect: '/whoami',
    failureRedirect: '/',
    findBy: 'oauthID',
    defaultUser:{
      login: p=> p.username,
      email: p=> p.emails[0].value,
      oauthID: p=> p.id,
      accessToken: p => p.accessToken
    },

    authConfig: { 
      approval_prompt: 'force',
      accessType: 'offline',
      scope: [''], 
      showDialog: true
    } 
  })
}
