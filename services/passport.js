const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models').User;

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, pw, done) => {
  // Verify this email and password
	User.findOne({ where: { email: email.toLowerCase() }}).then(user => {
		if (!user) {
			return done(null, false);
		}

		// Check if password entered matches hashed and salted password
		user.comparePasswords(pw, (err, isMatch) => {
			if (err) {
				done(err);
			} else if (!isMatch) {
        // Timeout to prevent brute forcing
        setTimeout(() => done(null, false), 1000);
			} else {
			  done(null, user);
      }
		});
	}).catch(err => {
		done(err);
	});
});

// Passport serializer/deserializer
passport.serializeUser((user, done) => {
  done(null, user.get('id'));
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, { id: user.get('id') });
  });
});

passport.use(localLogin);