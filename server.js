const express = require("express");
const db = require("./config/database");
const app = express();

// test db connection
db.authenticate().then(() => console.log("database connected now")).catch(err => "Error: " + err);

app.get("/", (req, res) => {
	res.send("index page");
});

// user routes
app.use("/users", require("./routes/users"));

const port = 3000;
app.listen(port, console.log("app listening on 3000"));
