const express = require('express');
const router = express.Router();

const {getProjectDetails, getEnrolledUsers, fetchGroupDetails, getGroups, fetchNonGroupStudents, fetchVacantGroups} = require('../../Controllers/projectControllerCommon');
const {joinProject, getEnrolledProjectList} = require("../../Controllers/User/projectControllerUser");
const {verifyProject, verifyProjectEnrollment} = require("../../Middlewares/project");

router.route('/all').get(getEnrolledProjectList)

router.route('/:project_ID/details').get(verifyProject,verifyProjectEnrollment,getProjectDetails);

router.route('/:project_ID/join').put(verifyProject,joinProject)

router.route('/:project_ID/participants').get(verifyProject,verifyProjectEnrollment,getEnrolledUsers);

router.route('/project/:Project_ID/viewGroups').get(getGroups);

router.route('/project/:Project_ID/group/:GID').get(fetchGroupDetails);

router.route('/project/:Project_ID/viewNonGroupStudents').get(fetchNonGroupStudents);

router.route('/project/:Project_ID/viewVacantGroups').get(fetchVacantGroups);

module.exports = router;