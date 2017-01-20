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
const redisSession = session({
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // for HTTPS
    maxAge: 604800
  },
  secret: config.store.SECRET_KEY
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(express.static(__dirname + '/public'));
app.use(redisSession);

// Init passport session
app.use(passport.initialize());
app.use(passport.session());

// Routes
router(app);

// Init db
models.sequelize.sync({ force: false }).then(() => {
  // Run server
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
