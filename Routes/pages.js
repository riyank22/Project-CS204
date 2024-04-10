const express = require('express')

const router = express.Router();

// Route for serving the login page
router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'FrontEnd/LogIn', 'LogIn.html'));
    res.render("LogIn");
});

// Route for serving the home page
router.get('/Home', (req, res) => {
    res.render("Home");
});

// Route for serving the home page
router.get('/ChangePassword', (req, res) => {
    res.render("ChangePassword");
});

module.exports = router;