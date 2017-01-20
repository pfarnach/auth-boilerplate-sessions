const passport = require('passport');

const config = require('./config');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

const requireSignin = passport.authenticate('local');

const requireAuth = (req, res, next) => {
  // req.user is set in passport deserializer
  if (req.user && req.user.id) {
    return next();
  }
  res.status(401).send();
};

module.exports = (app) => {
	// Generic unprotected route
	app.get('/', (req, res) => {
		res.sendFile('index.html');
	});

  // Generic protected route
  app.get('/protected', requireAuth, (req, res) => {
    res.send({ msg: 'You\'re authorized to see this' });
  });

  // Local auth
  app.post('/signup', Authentication.signup);
  app.post('/signin', requireSignin, Authentication.signin);
  app.get('/signout', requireAuth, Authentication.signout);
};
