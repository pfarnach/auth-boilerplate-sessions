const User = require('../models').User;
const config = require('../config');

exports.signup = (req, res, next) => {
	const { email: rawEmail, password } = req.body;
	const email = rawEmail.toLowerCase();

	// Enforce email and password params
	if (!email || !password) {
		res.status(422).send({ error: 'You must provide a valid email and password' });
	}

	// See if user with given email exists
	User.findOne({ where: { email }}).then(user => {
		// If a user with email already exists, return error
		if (user) {
			return res.status(422).send({ error: 'Email is already in use' });
		}

		// If a user with an email does NOT exist, create and save user record
		User.create({
			email,
			password
		}).then(createdUser => {
			// Respond to request indicating the user was created
			req.login(req.body, (err) => {
        if (err) {
          throw new Error('Login error: ' + err);
        }

        res.send({ loggedIn: true });
      })
		}).catch(err => {
			res.status(400).send({ error: 'Invalid email or password' });
		})
	});
};

exports.login = (req, res, next) => {
  res.send({ loggedIn: true });
};