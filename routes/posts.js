const express = require("express");
const router = express.Router();
const knex = require("../config/database");
const auth = require("../middleware/auth");
const helmet = require("helmet");

// utilizing helmet to secure the app by setting various HTTP headers
router.use(helmet());

// route to create a new post
router.post("/", auth, (req, res) => {
	res.set({
		"Content-Security-Policy": "script-src 'self'"
	});

	const { content, title } = req.body;

	// insert the post information into the posts table using Knex. Then increase the posts field from the users table for the post owner by 1.
	knex
		.returning("post_owner")
		.insert([ { content, created_at: new Date(), post_owner: req.user, title } ])
		.into("posts")
		.then(() => {
			knex("users").where("id", "=", req.user).increment("posts", 1).returning("posts").then(posts => {
				res.json({ posts });
			});
		})
		.catch(err => err);
});

// retrieve all posts
router.get("/", (req, res) => {
	res.set({
		"Content-Security-Policy": "script-src 'self'"
	});
	knex.select().table("posts").then(posts => {
		res.send(posts);
	});
});

// retrieve all posts from the posts' owner. The owner's id comes from req.user which comes from the auth middleware function
router.get("/user-posts", auth, (req, res) => {
	res.set({
		"Content-Security-Policy": "script-src 'self'"
	});
	knex("posts").where("post_owner", req.user).then(user => {
		res.send(user);
	});
});

module.exports = router;
