const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

const { createInviteNotification, createRequestNotificaiton, deleteNotification } = require('../queries/notification');
const { authenticateToken, validateUserTypeS } = require('../Middlewares/jwtTokenVerifer');
const { fetchProfile, loadHomePage } = require('../Controllers/Student/homeC');
const { joinProject, getProjectDetails } = require('../Controllers/Student/ProjectC');
const { getEnrolledStudentList } = require('../Controllers/commonC');
const { createGroup, joinGroupC } = require('../Controllers/Student/GroupC');

router.use(cookieParser());

router.use(authenticateToken);

router.use(validateUserTypeS);

router.route('/profile').get(fetchProfile);

router.route('/home').get(loadHomePage);

router.route('/project/:Project_ID').post(joinProject);

router.route('/project/:Project_ID').get(getProjectDetails);

router.route('/project/:Project_ID/viewParticpants').get(getEnrolledStudentList);

router.route('/project/:Project_ID/group').put(createGroup);

router.route('/project/:Project_ID/group/:GID').post(joinGroupC);

router.get('/Unenroll', (req, res) => {
    const Course_ID = req.query.Course_ID;
    const token = req.cookies.token;
    const { id } = jwt.verify(token, 'alpha');
    console.log(Course_ID);
    console.log(id);

    unenrollCourse(id, Course_ID).then(output => {
        if (output == 1) {
            res.redirect('/Student/Home?id=' + id)
        }
        else {
            console.log(output)
        }
    })
});

router.get('/Project', (req, res) => {
    const { id } = jwt.verify(req.cookies.token, 'alpha');
    console.log(req.cookies.token);
    const Project_ID = req.query.id;
    getProjectDetails(Project_ID).then(output => {
        inTeam(Project_ID, id).then(team => {
            if (team != -1) {
                getTeamInfo(team).then(teamInfo => {
                    if (id == teamInfo[0].Team_Lead) {
                        res.render('Student/Project/Project-Team-L', {
                            Project: output,
                            Team_Name: teamInfo[0].Team_Name,
                            Team_ID: teamInfo[0].id,
                            Team: teamInfo
                        });
                    }
                    else {
                        res.render('Student/Project/Project-Team-M', {
                            Project: output,
                            Team_Name: teamInfo[0].Team_Name,
                            Team_ID: teamInfo[0].id,
                            Team: teamInfo
                        });
                    }
                });
            }
            else {
                res.render('Student/Project/Project-No-Team', {
                    Project: output,
                });
            }
        });
    });
});

router.get('/Project/ViewAllTeams', (req, res) => {
    const Project_ID = req.query.Project_ID;
    getAllTeamsInfo(Project_ID).then(output => {
        res.render('Student/Project/ViewAllTeams', {
            Teams: output
        });
    });
});

router.get('/Project/LeaveTeam', (req, res) => {
    const { id } = jwt.verify(req.cookies.token, 'alpha');
    const Team_ID = req.query.Team_ID;
    leaveTeam(Team_ID, id).then(output => {
        if (output != -1) {
            res.redirect('/Student/Project?id=' + output);
        }
        else {
            console.log(output);
        }
    });
});

router.get('/Project/DeleteTeam', (req, res) => {
    deleteTeam(req.query.Team_ID).then(output => {
        if (output != -1) {
            res.redirect('/Student/Project?id=' + output);
        }
        else {
            console.log(output);
        }
    });
});

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