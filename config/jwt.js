const jwt = require('jsonwebtoken');

exports.generateToken = (email, userId) => {
    try {
        return jwt.sign({
            email: email,
            userId: userId
        }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY});
    } catch (err) {
        console.error('Error generating token:', err);
        return null;
    }
}

exports.verifyToken = (token) => {

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return { decoded: false, error: 'Token is not valid or has expired' };
        const { email, userId } = decoded;
        if(!email || !userId) return {decoded: false, error: 'Not able to extract the contents of the token'};
        return { decoded: true, email, userId };
    } catch (err) {
        console.error('Token verification failed:', err);
        return { decoded: false, error: 'Invalid or expired token' };
    }
}