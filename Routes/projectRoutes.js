const express = require('express');
const router = express.Router();

const { createProject, getProjectDetails, getProjectList} = require('../Controllers/Owner/projectControllerOwner');
const { getEnrolledStudentList, fetchGroupDetails, getGroups, fetchNonGroupStudents, fetchVacantGroups } = require('../Controllers/commonC');
const {verifyProjectOwnership} = require("../Middlewares/verifyProjectOwnership");
const {joinProject} = require("../Controllers/User/projectControllerUser");
const {verifyProject} = require("../Middlewares/verifyProject");

router.route('/create').post(createProject);

router.route('/all').get(getProjectList)

router.route('/:project_ID/details').get(verifyProjectOwnership,getProjectDetails);

router.route('/:project_ID/join').put(verifyProject,joinProject)

router.route('/project/:Project_ID/viewParticipants').get(getEnrolledStudentList);

router.route('/project/:Project_ID/viewGroups').get(getGroups);

router.route('/project/:Project_ID/group/:GID').get(fetchGroupDetails);

router.route('/project/:Project_ID/viewNonGroupStudents').get(fetchNonGroupStudents);

router.route('/project/:Project_ID/viewVacantGroups').get(fetchVacantGroups);

module.exports = router;