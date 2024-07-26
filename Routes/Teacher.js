const express = require('express');

const { fetchProfile, loadHomePage } = require('../Controllers/Teacher/homeC');
const { authenticateToken, validateUserTypeT } = require('../Middlewares/jwtTokenVerifer');
const cookieParser = require('cookie-parser');
const { createProject, getProjectDetails } = require('../Controllers/Teacher/ProjectC');
const { getEnrolledStudentList, fetchGroupDetails, getGroups, fetchNonGroupStudents, fetchVacantGroups } = require('../Controllers/commonC');
const router = express.Router();

router.use(cookieParser());

router.use(authenticateToken);

router.use(validateUserTypeT);

router.route('/profile').get(fetchProfile);

router.route('/home').get(loadHomePage);

router.route('/project').put(createProject);

router.route('/project/:Project_ID').get(getProjectDetails);

router.route('/project/:Project_ID/viewParticpants').get(getEnrolledStudentList);

router.route('/project/:Project_ID/viewGroups').get(getGroups);

router.route('/project/:Project_ID/group/:GID').get(fetchGroupDetails);

router.route('/project/:Project_ID/viewNonGroupStudents').get(fetchNonGroupStudents);

router.route('/project/:Project_ID/viewVacantGroups').get(fetchVacantGroups);

router.get('/Project/DeleteProject', (req, res) => {
    const Project_ID = req.query.Project_ID;

    getCourseID(Project_ID).then(Course_ID => {
        deleteProject(Project_ID).then(output => {
            if (output == 1) {
                res.redirect('/Teacher/Course?id=' + Course_ID);
            }
            else {
                console.log(output);
            }
        });
    });

});

module.exports = router;