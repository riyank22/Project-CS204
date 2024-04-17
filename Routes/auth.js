const express = require('express');
const jwt = require('jsonwebtoken');
const {authorizeUser,updatePassword, getRoll} = require('../queries/authQuery');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());

const {JWT_SECRET} = process.env;

// Route for serving the login page
router.post('/LogIn', (req,res) => {
    const {EmailID, password} = req.body;
    authorizeUser(EmailID, password).then(output => 
        {
            if(output.localeCompare('n') != 0)
            {
                getRoll(EmailID, output).then(output1 => {
                    jwt.sign({EmailID: EmailID, Roll: output, id: output1}, 'alpha', {expiresIn: '1h'}, (err, token) => {
                        if(err) {
                            console.error('Error generating token:', err);
                            return res.status(500).json({message: 'Internal Server Error'});
                        }
                        res.cookie('token', token, { httpOnly: true });

                        if(output == "s")
                        {
                            res.redirect('/Student/Home?id=' + output1);
                        }
                        else
                        {
                            res.redirect('/Teacher/Home?id=' + output1);
                        }
                    });
                })
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