const express = require('express')
const ValidLogIn = require('../queries/authQuery')

const router = express.Router();

// Route for serving the login page
router.post('/LogIn', (req,res) => {
    const {EmailID, password} = req.body;
    ValidLogIn(EmailID, password).then(output => 
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

module.exports = router;