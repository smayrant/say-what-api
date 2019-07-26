const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define("users", {
	username: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	},
	posts: {
		type: Sequelize.INTEGER
	},
	likes: {
		type: Sequelize.INTEGER
	},
	bio: {
		type: Sequelize.TEXT
	}
});

module.exports = User;
