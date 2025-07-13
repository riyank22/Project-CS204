const express = require('express');
const router = express.Router();

const { createProject, getProjectDetails, getProjectList} = require('../Controllers/Creator/projectCreatorController');
const { getEnrolledStudentList, fetchGroupDetails, getGroups, fetchNonGroupStudents, fetchVacantGroups } = require('../Controllers/commonC');
const {verifyProjectOwnership} = require("../Middlewares/verifyProjectOwnership");

router.route('/create').post(createProject);

router.route('/all').get(getProjectList)

router.route('/:projectId/details').get(verifyProjectOwnership,getProjectDetails);

router.route('/project/:Project_ID/viewParticpants').get(getEnrolledStudentList);

router.route('/project/:Project_ID/viewGroups').get(getGroups);

router.route('/project/:Project_ID/group/:GID').get(fetchGroupDetails);

router.route('/project/:Project_ID/viewNonGroupStudents').get(fetchNonGroupStudents);

router.route('/project/:Project_ID/viewVacantGroups').get(fetchVacantGroups);

// router.get('/Project/DeleteProject', (req, res) => {
    // const Project_ID = req.query.Project_ID;
    //
    // getCourseID(Project_ID).then(Course_ID => {
    //     deleteProject(Project_ID).then(output => {
    //         if (output == 1) {
    //             res.redirect('/Creator/Course?id=' + Course_ID);
    //         }
    //         else {
    //             console.log(output);
    //         }
    //     });
    // });

// });

module.exports = router;