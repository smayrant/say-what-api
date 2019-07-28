const express = require("express");
const router = express.Router();
const knex = require("../config/database");

router.post("/", (req, res) => {
	const { content, post_owner, title } = req.body;

	// insert the post information into the posts table using Knex. Then increase the posts field from the users table for the post owner by 1.
	knex
		.returning("post_owner")
		.insert([ { content, created_at: new Date(), post_owner, title } ])
		.into("posts")
		.then(post_owner => {
			knex("users").where("id", "=", post_owner[0]).increment("posts", 1).returning("posts").then(posts => {
				res.json(posts);
			});
		})
		.catch(err => err);
});

module.exports = router;
