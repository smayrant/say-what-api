const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const knex = require("../config/database");

// route to register a user, ensuring the username, email and password fields are properly filled in using the express validator.
router.post(
	"/",
	[
		check("username", "Please add a username").not().isEmpty(),
		check("email", "Please include a valid email address").isEmail(),
		check("password", "Please ensure your password has 8 or more characters").isLength({ min: 8 })
	],
	(req, res) => {
		const errors = validationResult(req);
		// if errors isn't empty, send a 400 status and the array of errors
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { username, email, password, account_created } = req.body;

		// select all from the users table where the email or username equals the email or username from req.body. If a user is found, send a 400 status, otherwise, add the user to the DB.
		knex("users")
			.where({ email: email })
			.orWhere({ username: username })
			.then(currentAccount => {
				if (currentAccount.length > 0) {
					return res.status(400).send("Username and/or email already has a registered account");
				} else {
					knex
						.insert([ { username, email, password, account_created } ])
						.into("users")
						.then(res.status(200).send("User signed up"));
				}
			})
			.catch(err => res.send(err));
	}
);

module.exports = router;
