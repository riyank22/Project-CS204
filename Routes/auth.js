const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { loginController, logoutController, changePasswordController } = require('../Controllers/authC');
const { authenticateToken } = require('../Middlewares/jwtTokenVerifer');

router.use(cookieParser());

router.route('/login').post(loginController); 

router.route('/logout').get(logoutController);

router.use(authenticateToken);

router.route('/changePassword').post(changePasswordController)

module.exports = router;