const express = require('express');
const jwt = require('jsonwebtoken');
const {authorizeUser,updatePassword} = require('../queries/authQuery');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());

const {JWT_SECRET} = process.env;

// Route for serving the login page
router.post('/LogIn', (req,res) => {
    const {EmailID, password} = req.body;
    authorizeUser(EmailID, password).then(output => 
        {
            if(output)
            {
                jwt.sign({EmailID: EmailID}, 'alpha', {expiresIn: '1h'}, (err, token) => {
                    if(err) {
                        console.error('Error generating token:', err);
                        return res.status(500).json({message: 'Internal Server Error'});
                    }
                    console.log('Token:', token);
                    res.cookie('token', token, { httpOnly: true });
                    return res.render('Home', {
                        EmailID: EmailID
                    })
                });
            }
            else
            {
                return res.render('LogIn', {
                    message: 'Wrong Credientails'
                })
            }
        })
} );

// Route for serving the login page
router.post('/ChangePassword', (req,res) => {

    console.log(req.body);
    
    const {EmailID} = jwt.verify(req.cookies.token, 'alpha');

    const {password} = req.body;
    updatePassword(EmailID, password).then(output => 
        {
            if(output)
            {
                return res.render('ChangePassword', {
                    message: "Password changes successfully"
                })
            }
            else
            {
                return res.render('ChangePassword', {
                    message: 'Error changing password. Try again Later'
                })
            }
        })
} );

module.exports = router;