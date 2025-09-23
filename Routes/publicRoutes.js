const express = require('express');
const {getPublicProjects} = require("../Controllers/User/projectControllerUser");
const {verifyProject} = require("../Middlewares/project");
const {getProjectDetails} = require("../Controllers/projectControllerCommon");
const router = express.Router();

router.route('/projects').get(getPublicProjects);
router.route('/projects/:project_ID/details').get(verifyProject, getProjectDetails);

module.exports = router;