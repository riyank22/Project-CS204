const express = require('express');
const jwt = require('jsonwebtoken');
const {fetchCoursesTeacher, viewCourse, deleteCourse, getStudents} = require('../queries/CourseQuery');
const {getProjects, deleteProject, getCourseID} = require('../queries/ProjectQuery');
const {getNonTeamStudent, getTeamInfo, viewTeams} = require('../queries/team');

const { fetchProfile, loadHomePage } = require('../Controllers/Teacher/homeC');
const { authenticateToken, validateUserTypeT } = require('../Middlewares/jwtTokenVerifer');
const cookieParser = require('cookie-parser');
const { createProject, getProjectDetails } = require('../Controllers/Teacher/ProjectC');
const router = express.Router();

router.use(cookieParser());

router.use(authenticateToken);

router.use(validateUserTypeT);

router.route('/profile').get(fetchProfile);

router.route('/home').get(loadHomePage);

router.route('/project').put(createProject);

router.route('/project/:Project_ID').get(getProjectDetails);

router.get('/ViewCourseParticipants', (req,res) => {
    const Course_ID = req.query.Course_ID;
    getStudents(Course_ID).then(output => {
        res.render('Teacher/ViewCourseParticipants', {
            Course_ID: Course_ID,
            Students: output
        });
    });
});

router.get('/ViewNonTeamStudents', (req,res) => {
    const Project_ID = req.query.Project_ID;
    getNonTeamStudent(Project_ID).then(output => {
        res.render('Teacher/Projects/ViewNonTeamStudents', {
            Project_ID: Project_ID,
            Students: output
        });
    });
});

router.get('/ViewTeams', (req,res) => {
    const Project_ID = req.query.Project_ID;
    viewTeams(Project_ID).then(output => {
        res.render('Teacher/Projects/ViewTeams', {
            Project_ID: Project_ID,
            Teams: output
        });
    });
});

router.get('/ViewTeamMembers', (req,res) => {
    const Team_ID = req.query.Team_ID;
    getTeamInfo(Team_ID).then(output => {
        res.render('Teacher/Projects/ViewTeamMembers', {
            Team: output,
            Team_Name: output[0].Team_Name
        });
    });
});

router.get('/DeleteCourse', (req,res) => {
    const Course_Id = req.query.Course_ID;
    const token = req.cookies.token;
    console.log(token);
    const ou = jwt.verify(token, 'alpha');
    console.log(Course_Id);
    console.log(ou);
    const id = ou.id;
    deleteCourse(Course_Id).then(output => {
        if(output == 1)
        {
            res.redirect('/Teacher/Home?id='+id);
        }
        else
        {
            console.log(output);
        }
    });
})

router.get('/CreateProject', (req,res) => {
    res.render('Teacher/CreateProject', {
        id : req.query.id
    });
});

router.post('/CreateProject', (req,res) => {
    const {Course_Code, ProjectName, MaxStudent, MinStudent, date} = req.body;
    createProject(Course_Code, ProjectName, date, MaxStudent, MinStudent).then(output => {
        if(output == 1)
        {
            res.redirect('/Teacher/Course?id='+Course_Code);
        }
        else
        {
            console.log(output);
        }
    });    
});

router.get('/ViewProject', (req,res) => {
    const Project_ID = req.query.Project_ID;
    getProjectDetails(Project_ID).then(output => {
        res.render('Teacher/ViewProject', {
            Project: output
        });
    });
});

router.get('/Project/DeleteProject', (req,res) => {
    const Project_ID = req.query.Project_ID;
    
    getCourseID(Project_ID).then(Course_ID => {
        deleteProject(Project_ID).then(output => {
            if(output == 1)
            {
                res.redirect('/Teacher/Course?id='+Course_ID);
            }
            else
            {
                console.log(output);
            }
        });
    });
    
});

module.exports = router;