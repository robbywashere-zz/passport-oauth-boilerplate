const express = require('express');
require('dotenv').config();
const fs = require('fs');
let app = express();

const GoogleOAuth = require('./strats/google')
const GithubOAuth = require('./strats/github')
const FacebookOAuth = require('./strats/facebook')
const SpotifyOAuth = require('./strats/spotify')
const Auth0OAuth = require('./strats/auth0')
const TwitterOAuth = require('./strats/twitter')

const INDEXHTML = fs.readFileSync('./public/index.html').toString()

let passport = require('passport')

app.use(require('serve-static')(__dirname + '/public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ 
  secret: 'keyboard cat', 
  resave: true, 
  saveUninitialized: true 
}));


if (!fs.existsSync('.env') && process.env.NODE_ENV === "development") {
  console.error(`****

ERROR: Cannot locate .env file!

***`)
} 

GoogleOAuth(app,{ 
  clientID: process.env.GOOGLE_CLIENTID, 
  clientSecret: process.env.GOOGLE_CLIENTSECRET 
})

/*

TwitterOAuth(app,{ 
  consumerKey: process.env.TWITTER_CONSUMERKEY, 
  consumerSecret: process.env.TWITTER_CONSUMERSECRET 
})

Auth0OAuth(app,{ 
  domain: 'example.auth0.com',
  clientID: process.env.AUTH0_CLIENTID, 
  clientSecret: process.env.AUTH0_CLIENTSECRET 
})
GithubOAuth(app,{ 
  clientID: process.env.GITHUB_CLIENTID, 
  clientSecret: process.env.GITHUB_CLIENTSECRET 
})
FacebookOAuth(app,{ 
  clientID: process.env.FACEBOOK_CLIENTID, 
  clientSecret: process.env.FACEBOOK_CLIENTSECRET 
})

SpotifyOAuth(app,{ 
  clientID: process.env.SPOTIFY_CLIENTID, 
  clientSecret: process.env.SPOTIFY_CLIENTSECRET 
})

*/

function ensureLoggedIn() {
  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      res.send('not logged in!')
    } else {
      next()
    }
  }
}
app.get('/whoami',ensureLoggedIn(),function(req,res){
  const profile = `;__PROFILE__ = ${JSON.stringify(req.user)};`
  const responseHTML = INDEXHTML
    .replace('%__AUTH__%',profile)
    .replace('%__PROFILE__%',profile)
  res.send(responseHTML)
})

app.listen(3000)
