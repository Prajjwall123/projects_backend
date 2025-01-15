const jwt = require("jsonwebtoken");

const SECRET_KEY = '7c047a7d3dec647e73ef908c29f38e591ab2c0877b6933eb17f2e3fb0fe8af34';

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

function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send("You are not authorized to access.");
        }
        next();
    }
}

module.exports = { authenticateToken, authorizeRole };