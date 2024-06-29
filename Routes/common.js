const express = require('express')
const jwt = require('jsonwebtoken');

const router = express.Router();
// Route for serving the login page
router.get('/', (req, res) => {
    // res.end("Landing Page");
    res.render("LogIn");
});

// Route for serving the home page
router.get('/Home', (req, res) => {
    res.render("");
});

// router.use(authenticateToken);

// router.route('/profile').get();

module.exports = router;