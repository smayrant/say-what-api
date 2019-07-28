const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// init dotenv
dotenv.config();

module.exports = function (req, res, next) {
	// get token from header
	const token = req.header("x-auth-token");

	// ensure token exists
	if (!token) {
		return res.status(401).json({ msg: "Authorization denied" });
	}
	try {
		// verify token, storing the payload (user's id) in the variable, decoded
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

		// the id retrieved from the token's payload is stored in req.user, allowing it to be accessible in the protected routes that require a token
		req.user = decoded.id;

		next();
	} catch (err) {
		res.status(401).json({ msg: "Unauthorized" });
	}
};
