const express = require('express');
const {verifyProject, verifyProjectEnrollment} = require("../../Middlewares/project");
const {verifyGroup} = require("../../Middlewares/verifyGroup");
const {getGroupDetails, createGroup} = require("../../Controllers/User/groupControllerUser");
const router = express.Router();

router.route('/:project_ID/create').post(verifyProject,verifyProjectEnrollment,createGroup);
router.route('/:project_ID/:group_UUID/details').get(verifyProject,verifyProjectEnrollment,verifyGroup, getGroupDetails);

module.exports = router;