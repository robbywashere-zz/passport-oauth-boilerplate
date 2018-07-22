let { Strategy } = require('passport-instagram');
const { AuthApp } = require('./passport-auth');
const { User } = require('../models')
const { get } = require('lodash')

module.exports = function(app, { clientID, clientSecret }) {
  AuthApp(app,{
    credentials: { clientID, clientSecret },
    callbackURL: '/auth/instagram/callback',
    userModel: User,
    loginURL: '/auth/instagram',
    strategy:  Strategy,
    successRedirect: '/whoami',
    failureRedirect: '/',
    findBy: 'oauthID',
    defaultUser:{
      login: p=> p.emails[0].value,
      email: p=> p.emails[0].value,
      oauthID: p=> p.id,
      accessToken: p => p.accessToken
    },
  })
}

