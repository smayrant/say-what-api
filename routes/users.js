const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/Users");

// router.post(
// 	"/",
// 	[
// 		check("name", "Please add a name").not().isEmpty(),
// 		check("email", "Please include a valid email address").isEmail(),
// 		check("password", "Please ensure your password has 8 or more characters").isLength({ min: 8 })
// 	],
// 	(req, res) => {
// 		const errors = validationResult(req);
// 		// if ther are errors, send a 400 status and the array of errors
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({ errors: errors.array() });
// 		} else {
// 		}
// 	}
// );

router.get("/", (req, res) => {
	User.findAll()
		.then(users => {
			console.log(users);
			res.status(200).send("OK");
		})
		.catch(err => console.log(err));
});

router.get("/add", (req, res) => {
	const data = {
		name: "rick",
		email: "user2@gmail.com",
		post_entries: 2,
		joined: new Date()
	};

	let { name, email, post_entries, joined } = data;

	User.create({
		name,
		email,
		post_entries,
		joined
	})
		.then(gig => res.redirect("/"))
		.catch(err => console.log(err));
});

module.exports = router;
