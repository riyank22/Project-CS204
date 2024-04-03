const express = require('express')

const router = express.Router();

// Route for serving the login page
router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'FrontEnd/LogIn', 'LogIn.html'));
    res.render("LogIn");
});

// Route for serving the login page
router.get('/Home', (req, res) => {
    // res.sendFile(path.join(__dirname, 'FrontEnd/LogIn', 'LogIn.html'));
    res.render("Home");
});

module.exports = router;