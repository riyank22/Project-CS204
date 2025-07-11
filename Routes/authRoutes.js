const express = require('express');
const router = express.Router();
const { loginController, registerUserController, changePasswordController} = require('../Controllers/authController');
const {authenticateToken} = require("../Middlewares/jwtTokenVerifer");
const {verifyUser} = require("../Middlewares/verifyUser");

router.route('/login').post(loginController);
router.route('/register').post(registerUserController);
router.use(authenticateToken);
router.use(verifyUser)
router.route('/change-password').post(changePasswordController)

module.exports = router;