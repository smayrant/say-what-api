const knex = require("knex")({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "sheldrickmayrant",
		password: "",
		database: "saywhatDB"
	}
});
module.exports = knex;
