const express = require('express')
const jwt = require('jsonwebtoken');

const router = express.Router();

// Route for serving the login page
router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'FrontEnd/LogIn', 'LogIn.html'));
    res.render("LogIn");
});

// Route for serving the home page
router.get('/Home', (req, res) => {
    if(req.cookies.token == null) {
        return res.render('LogIn');
    }
    res.render("Home");
});

// Route for serving the home page
router.get('/ChangePassword', (req, res) => {
    res.render("ChangePassword");
});

//Router for logOut Page
router.get('/LogOut', (req, res) => {
    res.clearCookie('token');
    res.render("LogOut");
});

module.exports = router;