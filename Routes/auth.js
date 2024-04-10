const express = require('express');
const {authorizeUser,updatePassword} = require('../queries/authQuery');

const router = express.Router();

// Route for serving the login page
router.post('/LogIn', (req,res) => {
    const {EmailID, password} = req.body;
    authorizeUser(EmailID, password).then(output => 
        {
            if(output)
            {
                return res.render('Home', {
                    EmailID: EmailID
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
    const {EmailID, password} = req.body;
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