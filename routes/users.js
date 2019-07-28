const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
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

		const { username, email, password } = req.body;

		// bcrypt configuration
		const saltRounds = 10;
		var salt = bcrypt.genSaltSync(saltRounds);
		var hash = bcrypt.hashSync(password, salt);

		knex
			.returning("*")
			.insert([ { username, email, password: hash, account_created: new Date() } ])
			.into("users")
			.then(user => res.status(200).json(user[0]))
			.catch(err => res.status(400).json(err));
	}
);

module.exports = router;
