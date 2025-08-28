const express = require('express');
const router = express.Router();

const {getProjectList} = require('../../Controllers/Owner/projectControllerOwner');
const { getEnrolledUsers, fetchGroupDetails, getGroups, fetchNonGroupStudents, fetchVacantGroups } = require('../../Controllers/projectControllerCommon');
const {verifyProjectOwnership} = require("../../Middlewares/project");

router.route('/all').get(getProjectList)

router.route('/:project_ID/details').get(verifyProjectOwnership,getProjectList);

router.route('/:project_ID/participants').get(verifyProjectOwnership,getEnrolledUsers);

router.route('/project/:Project_ID/viewGroups').get(getGroups);

router.route('/project/:Project_ID/group/:GID').get(fetchGroupDetails);

router.route('/project/:Project_ID/viewNonGroupStudents').get(fetchNonGroupStudents);

router.route('/project/:Project_ID/viewVacantGroups').get(fetchVacantGroups);

module.exports = router;