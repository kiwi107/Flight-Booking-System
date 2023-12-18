const jwt = require("jsonwebtoken");
require("dotenv").config();


function authenticateToken(req, res, next) {
    // const token = req.cookies.token;
    const token = req.headers['x-access-token'];
    if (!token) {
        console.log("token not found");
        return res.sendStatus(401); // if there isn't any token
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("token not verified");
            return res.sendStatus(403);
        }
        req.user = user;
        console.log("token verified");
        next();
    });
}

module.exports = authenticateToken;