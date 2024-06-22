const jwt = require('jsonwebtoken');

exports.generateToken =  (emailID, userType, userID) => {
    try{
        const token = jwt.sign({emailID: emailID, userType: userType, userID:userID}, 'alpha', {expiresIn: '1h'});
        return token;
    }
    catch(err)
    {
        console.error('Error generating token:', err);
        return 500;
    }
}

exports.verifyToken = (token) => {
    
    try{
        const { emailID, userType, userID} = jwt.verify(token, 'alpha');
        return {status:200 , emailID, userType, userID};
    }

    catch(err)
    {
        return {status:400};
    }
}