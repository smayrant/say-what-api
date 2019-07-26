const express = require("express");
const router = express.Router();
const User = require("../models/Users");

// route to get all users
router.get("/", (req, res) => {
	User.findAll()
		.then(users => {
			console.log(users);
			res.status(200).send("OK");
		})
		.catch(err => console.log(err));
});

// route to retrieve an individual user
router.get("/:id", (req, res) => {
	res.send(data.users[req.params.id]);
});

// route to register a user
router.post("/", (req, res) => {
	const data = {
		username: "tom",
		email: "tom@gmail.com",
		password: "123456",
		bio: "Just browsing around",
		posts: 1,
		likes: 15
	};

	const { username, email, password, bio, posts, likes } = data;

	User.create({
		username,
		email,
		password,
		bio,
		posts,
		likes
	}).then(newUser => {
		console.log(newUser);
	});
});

module.exports = router;
