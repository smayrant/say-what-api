const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { check, validationResult } = require("express-validator");
const knex = require("../config/database");
const auth = require("../middleware/auth");

// init dotenv
dotenv.config();

router.get("/", auth, (req, res) => {
	// select all from the users table where the id = the id stored in the request object that comes from the token payload from the auth function
	knex("users").where("id", req.user).then(user => {
		res.send(user[0]);
	});
});

// route to register a user, ensuring the username, email and password fields are properly filled in using the express validator.
router.post(
	"/register",
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

		// insert the user into the DB using Knex
		knex
			.returning("*")
			.insert([ { username, email, password: hash, account_created: new Date() } ])
			.into("users")
			.then(user =>
				jwt.sign({ id: user[0].id }, process.env.TOKEN_SECRET, { expiresIn: 3600 }, (err, token) => {
					if (err) throw err;
					res.json({ token });
				})
			)
			.catch(err => res.status(400).json({ msg: err }));
	}
);

router.post(
	"/login",
	[ check("email", "Please include a valid email address"), check("password", "Password is required") ],
	(req, res) => {
		const { email, password } = req.body;

		// select all from the users table where the email from the DB matches the email from req.body. Using bcrypt to compare the password from req.body and the hashed password stored in the DB, return the user if passwords match, return a 400 status otherwise.
		knex("users")
			.where({
				email: email
			})
			.select("*")
			.then(loginUser => {
				if (loginUser[0]) {
					bcrypt
						.compare(password, loginUser[0].password)
						.then(isMatch => {
							if (isMatch) {
								jwt.sign(
									{ id: loginUser[0].id },
									process.env.TOKEN_SECRET,
									{ expiresIn: 3600 },
									(err, token) => {
										if (err) throw err;
										res.json({ token });
									}
								);
							} else {
								res.json({ msg: "Invalid credentials" });
							}
						})
						.catch(err => res.json(err));
				} else {
					return res.status(400).json({ msg: "Invalid credentials" });
				}
			})
			.catch(() => res.status(400).json({ msg: "Invalid credentials" }));
	}
);

module.exports = router;
