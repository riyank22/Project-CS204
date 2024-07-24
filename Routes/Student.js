const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

const { createInviteNotification, createRequestNotificaiton, deleteNotification } = require('../queries/notification');
const { authenticateToken, validateUserTypeS } = require('../Middlewares/jwtTokenVerifer');
const { fetchProfile, loadHomePage } = require('../Controllers/Student/homeC');
const { joinProject, getProjectDetails, leaveProject } = require('../Controllers/Student/ProjectC');
const { getEnrolledStudentList, getGroups } = require('../Controllers/commonC');
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

router.route('/project/:Project_ID/group/:GID').post(joinGroupC);

router.route('/project/:Project_ID/viewGroups').get(getGroups);

router.route('/project/:Project_ID/group/:GID').delete(leaveGroupC);

router.route('/project/:Project_ID/group/:GID').patch(renameGroupC);

router.route('/project/:Project_ID/group/:GID/removeMember').delete(removeMember);

router.route('/project/:Project_ID/group/:GID/changeLeader').patch(changeLeaderC);

router.get('/Project/ViewPotentialMembers', (req, res) => {
    const Project_ID = req.query.Project_ID;
    getNonTeamStudent(Project_ID).then(output => {
        res.render('Student/Project/PotentialMembers', {
            Project_ID: Project_ID,
            Students: output
        });
    });
});

router.get('/Project/GenerateInvite', (req, res) => {
    const Project_ID = req.query.Project_ID;
    const RollNo = req.query.RollNo;
    const { id } = jwt.verify(req.cookies.token, 'alpha');
    console.log(Project_ID);
    createInviteNotification(Project_ID, RollNo, id).then(output => {
        if (output) {
            res.redirect('/Student/Project?id=' + req.query.Project_ID);
        }
        else {
            console.log(output);
        }
    });
});

router.get('/Project/ViewInvites', (req, res) => {
});

module.exports = router;