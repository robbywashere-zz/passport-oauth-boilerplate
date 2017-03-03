let { Strategy } = require('passport-auth0');
const { AuthApp, Handler } = require('./passport-auth');
const { User } = require('../models')

function handler(accessToken, refreshToken, extraParams, profile, done) { 
  return Handler.bind(this)(accessToken, refreshToken, profile, done)
}

module.exports = function(app, { clientID, clientSecret, domain }) {
  AuthApp(app,{
    credentials: { clientID, clientSecret },
    callbackURL: '/auth/auth0/callback',
    userModel: User,
    loginURL: '/auth/auth0',
    strategy:  Strategy,
    successRedirect: '/whoami',
    failureRedirect: '/',
    findBy: 'oauthID',
    stratConfig: { domain },
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
      scope: [''],
      showDialog: true
    } 
  }, handler)
}
