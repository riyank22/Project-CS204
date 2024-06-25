const { verifyToken } = require("../utils/jwt");

function authenticateToken(req,res,next){
    const {token} = req.cookies;

    if(token == undefined || token == null)
    {
        return res.status(401).send("Please Login to access the page")   
    }

    const decoded =  verifyToken(token);

    if(decoded.status === 400)
    {
        return res.status(400).send("Your session has expired. Please login again");
    }
    
    req.emailID = decoded.emailID;
    req.userType = decoded.userType;
    req.userID = decoded.userID;

    next();
}

function validateUserTypeT(req,res,next)
{
    if(req.userType !== 't')
    {
        return res.status(403).send("Unauthorized Access");
    }
    next();
}

function validateUserTypeS(req,res,next)
{
    if(req.userType !== 's')
    {
        return res.status(403).send("Unauthorized Access");
    }
    next();
}

module.exports = {authenticateToken, validateUserTypeT, validateUserTypeS};