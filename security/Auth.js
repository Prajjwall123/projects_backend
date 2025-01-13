const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).send("Access denied: No token provided");
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (e) {
        res.status(400).send("Invalid token");
    }
}

module.exports = { authenticateToken };
