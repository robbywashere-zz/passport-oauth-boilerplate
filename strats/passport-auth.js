const { Passport } = require('passport');

const url = require('url');

async function UserHandler(defaultUser) {

  let created;
  [ user, created] = await this.userModel.findOrCreate({
    defaults: defaultUser,
    where: { [this.findBy]: defUser[this.findBy] },
  });

  if (!created) await user.update(defUser);

  user.setDataValue('newUser', !!created);

  return user;
}


function deserializeUser(id, done) {
  this.userModel
    .findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
};

function serializeUser(user, done) {
  done(null, user.id);
};

//TODO: change name?
async function SignOn(accessToken, refreshToken, profile, done) {
  const defUser = {};

  const newProfile = Object.assign(profile, {
    accessToken,
    refreshToken,
  });

  Object.keys(this.defaultUser).forEach((k) => {
    defUser[k] = this.defaultUser[k](newProfile);
  });


  try {
    let user = await this.userHandler.bind(this)(defUser);
    done(null, user);
  } catch (e) {
    done(e, null);
  }
}


function AuthApp(app, config) {

  //defaults
  config = Object.assign({ 
    userHandler: UserHandler, 
    signOn: SignOn, 
  }, config);
  
  const passport = new Passport();

  const missing = [
    'credentials',
    'loginURL',
    'strategy',
    'userModel',
    'callbackURL',
    'findBy',
    'defaultUser',
    'successRedirect',
    'failureRedirect',
  ].filter(arg => !config.hasOwnProperty(arg));
  if (missing.length > 0) throw new Error(`Missing args: ${missing.join(',')}`);
  const cc = config.credentials;
  Object.keys(cc).forEach((k) => {
    if (typeof cc[k] === 'undefined') {
      throw new Error(`credentials error: ${k} is 'undefined'`);
    }
  });


  app.use(passport.initialize());

  app.use(passport.session());

  const Options = Object.assign({
    callbackURL: config.callbackURL,
    state: true,
  }, config.credentials, config.stratConfig || {});

  const _handler = SignOn.bind(config);
  const strategy = new config.strategy(Options, _handler);

  passport.use(strategy);

  passport.serializeUser(config.serializeUser || serializeUser.bind(config));

  passport.deserializeUser(config.deserializeUser || deserializeUser.bind(config));

  app.get(config.loginURL,
    passport.authenticate(strategy.name, config.authConfig || {})
  );

  app.get(url.parse(config.callbackURL).pathname,
    passport.authenticate(strategy.name, {
      failureRedirect: config.failureRedirect,
      successRedirect: config.successRedirect,
    }),
    function (err, req, res, next) {
      if (err) {
        console.log(`>>>>>> Passport-Auth Exception

${JSON.stringify(err, null, 4)}

<<<<<<< check your configuration
          `);
        next(err);
      }
      else {
        next();
      }
    });
}


module.exports = { AuthApp, SignOn };

