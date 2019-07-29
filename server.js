const express = require("express");
const helmet = require("helmet");
const app = express();

// utilizing helmet to secure the app by setting various HTTP headers, including the non-default CSP header
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [ "'self'" ],
			styleSrc: [ "'self'" ]
		}
	})
);

app.get("/", (req, res) => {
	res.set({
		"Content-Security-Policy": "script-src 'self'"
	});
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
