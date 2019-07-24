const express = require("express");
const knex = require("knex");
const app = express();

const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "sheldrickmayrant",
		password: "",
		database: "saywhat"
	}
});

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.json({ msg: "App connected" });
});

app.use("/register", require("./routes/register"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
