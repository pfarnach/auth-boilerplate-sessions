# Session-based Auth boilerplate

### Overview
This is a boilerplate project that's starting point for session-based authentication in NodeJS/Express apps.  It uses Passport, bcrypt, Postgres/Sequelize, and express-session with Redis.

### Use
Clone the repo and install the dependencies with either `yarn` or `npm install`.

Create a `config.js` file in the project root that looks like:
```
module.exports = {
	db: {
		POSTGRES_URL: 'postgres://user:password@localhost:5432/db_name',
		REDIS_URL: 'http://localhost:6379' (or wherever you have your Redis server running)
	},
	store: {
		SECRET_KEY: 'your secret key here'
	}
}
```

Make sure Redis and Postgres are running.

Start up the server on `localhost:3000` with `yarn run start` or `npm run start`.