const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const config = require('./config');
const models = require('./models');
const router = require('./router');

// Init
const port = process.env.PORT || 3000;
const app = express();

// Session
const redisClient = redis.createClient();
const sessionStore = new RedisStore({ client: redisClient });

// Middleware
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(express.static(__dirname + '/public'));
app.use(session({
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2419200000
  },
  secret: config.store.SECRET_KEY
}));

// Init passport session
app.use(passport.initialize());
app.use(passport.session());

// Passport serializer
passport.serializeUser((user, done) => {
  console.log('\n\nUSER SERIALIZED', user.id);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  models.User.findById(id).then(user => {
    console.log('\n\nUSER DESERIALIZED', user.id);
    done(null, user);
  });
});

// Routes
router(app);

// Init db
models.sequelize.sync({ force: true }).then(() => {
	// Run server
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
});
