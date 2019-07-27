const express = require("express");
const db = require("./config/database");
const app = express();

app.get("/", (req, res) => {
	res.send("index page");
});

// Init Middleware
app.use(express.json({ extended: false }));

// user routes
app.use("/users", require("./routes/users"));

// posts routes
app.use("/posts", require("./routes/posts"));

const port = 3000;
app.listen(port, console.log("app listening on 3000"));
