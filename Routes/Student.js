const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const { authenticateToken, validateUserTypeS } = require('../Middlewares/jwtTokenVerifer');
const { fetchProfile, loadHomePage } = require('../Controllers/Student/homeC');
const { joinProject, getProjectDetails, leaveProject } = require('../Controllers/Student/ProjectC');
const { getEnrolledStudentList, getGroups, fetchGroupDetails, fetchNonGroupStudents, fetchVacantGroups } = require('../Controllers/commonC');
const { createGroup, joinGroupC, leaveGroupC, renameGroupC, removeMember, changeLeaderC } = require('../Controllers/Student/GroupC');

router.use(cookieParser());

router.use(authenticateToken);

router.use(validateUserTypeS);

router.route('/profile').get(fetchProfile);

router.route('/home').get(loadHomePage);

router.route('/project/:Project_ID').post(joinProject);

router.route('/project/:Project_ID').get(getProjectDetails);

router.route('/project/:Project_ID/viewParticpants').get(getEnrolledStudentList);

router.route('/project/:Project_ID').delete(leaveProject);

router.route('/project/:Project_ID/group').put(createGroup);

router.route('/project/:Project_ID/viewGroups').get(getGroups);

router.route('/project/:Project_ID/group/:GID').get(fetchGroupDetails);

router.route('/project/:Project_ID/group/:GID').post(joinGroupC);

router.route('/project/:Project_ID/group/:GID').delete(leaveGroupC);

router.route('/project/:Project_ID/group/:GID').patch(renameGroupC);

router.route('/project/:Project_ID/group/:GID/removeMember').delete(removeMember);

router.route('/project/:Project_ID/group/:GID/changeLeader').patch(changeLeaderC);

router.route('/project/:Project_ID/viewNonGroupStudents').get(fetchNonGroupStudents);

router.route('/project/:Project_ID/viewVacantGroups').get(fetchVacantGroups);

module.exports = router;