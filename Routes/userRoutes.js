const express = require('express')
const {getUserDetailsController, updateUserDetails} = require("../Controllers/userController");

const router = express.Router();
// Route for serving the login page
router.get('/get-user-details', getUserDetailsController);
router.patch('/update-user', updateUserDetails)

module.exports = router;