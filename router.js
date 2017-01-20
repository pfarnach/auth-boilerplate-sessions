const passport = require('passport');

const config = require('./config');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

const requireSignin = passport.authenticate('local');

module.exports = (app) => {
	// Generic unprotected route
	app.get('/', (req, res) => {
		res.sendFile('index.html');
	});

  // Local
  app.post('/signup', Authentication.signup);
  app.post('/login', requireSignin, Authentication.login);

};
