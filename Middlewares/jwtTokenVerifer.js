const { verifyToken } = require("../config/jwt");

function authenticateToken(req, res, next) {

    if(!req.body)
    {
        console.log("[DEBUG] Request body not found");
        return res.status(400).send("Broken request");
    }

    const token  = req.headers.authorization;

    if (!token) {
        console.log("[DEBUG] Token not found in headers");
        return res.status(401).send("Please Login to access the page")
    }

    const decoded = verifyToken(token.split(' ')[1]);

    if (decoded.decoded === false) {
        return res.status(400).send("Your session has expired. Please login again");
    }

    if (!decoded.email || !decoded.userId) {
        return res.status(400).send("Token is not valid or has expired");
    }

    req.email = decoded.email;
    req.userId = decoded.userId;

    next();
}

function validateUserTypeT(req, res, next) {
    if (req.userType !== 't') {
        return res.status(403).send("Unauthorized Access");
    }
    next();
}

function validateUserTypeS(req, res, next) {
    if (req.userType !== 's') {
        return res.status(403).send("Unauthorized Access");
    }
    next();
}

module.exports = { authenticateToken, validateUserTypeT, validateUserTypeS };