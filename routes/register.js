const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post(
	"/",
	[
		check("name", "Please add a name").not().isEmpty(),
		check("email", "Please include a valid email address").isEmail(),
		check("password", "Please ensure your password has 8 or more characters").isLength({ min: 8 })
	],
	(req, res) => {
		const errors = validationResult(req);
		// if ther are errors, send a 400 status and the array of errors
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		res.send("successfully registered");
	}
);

module.exports = router;
