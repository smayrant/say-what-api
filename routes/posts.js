const express = require("express");
const router = express.Router();
const knex = require("../config/database");

router.post("/:id", (req, res) => {
	const post = {
		content: "this is a post",
		created_at: new Date(),
		post_owner: req.params.id,
		title: "post title"
	};

	const { content, created_at, post_owner, title } = post;
	knex
		.insert([ { content, created_at, post_owner, title } ])
		.into("posts")
		.then(res.status(200).send("post created"))
		.catch(err => err);
});

module.exports = router;
