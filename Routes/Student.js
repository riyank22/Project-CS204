const express = require('express');
const jwt = require('jsonwebtoken');
const {JoinCourse, fetchCoursesStudent, viewCourse, unenrollCourse, getStudents} = require('../queries/CourseQuery');
const router = express.Router();
const cookieParser = require('cookie-parser');
const {getProjects, getProjectDetails} = require('../queries/ProjectQuery');
const {createTeam, inTeam, getTeamInfo} = require('../queries/team');

router.use(cookieParser());

router.get('/JoinCourse', (req,res) => {
    res.render('Student/JoinCourse',
    {
        message: req.query.message
    });
});

router.get('/Home', (req,res) => {
    fetchCoursesStudent(req.query.id).then(output => {
        res.render('Student/Home' , {
            Courses: output});
        });
});

router.post('/JoinCourse', (req,res) => {
    const jwtToken = req.cookies.token;
    const {id} = jwt.verify(jwtToken, 'alpha');
    const {Course_ID} = req.body;
    JoinCourse(id, Course_ID).then(output => {
        if(output == 1)
        {
            console.log("Course Joined");
            res.redirect('/Student/Home?id='+id);
        }
        else if(output == 0)
        {
            console.log(output);
            res.redirect('/Student/JoinCourse?message=Course enrollement is close or course does bot exists');
        }
        else if(output == -1)
        {
            console.log(output);
            res.redirect('/Student/JoinCourse?message=You are already enrolled in this course');
        }
    })
});

router.get('/Course', (req,res) => {
    const id = req.query.id;
    viewCourse(id).then(output => {
        getStudents(id).then(students => {
            getProjects(id).then(projects => {
                res.render('Student/Course', {
                    Course: output[0],
                    Students: students,
                    Projects: projects
                });
            });
        });
    });
});

router.get('/Unenroll', (req,res) => {
    const Course_ID = req.query.Course_ID;
    const token = req.cookies.token;
    const {id} = jwt.verify(token,'alpha');
    console.log(Course_ID);
    console.log(id);
    
    unenrollCourse(id,Course_ID).then(output => {
        if(output == 1)
        {
            res.redirect('/Student/Home?id='+id)
        }
        else
        {
            console.log(output)
        }
    })
});

router.get('/Project', (req,res)=>{
    const {id} = jwt.verify(req.cookies.token, 'alpha');
    const Project_ID = req.query.id;
    getProjectDetails(Project_ID).then(output => {
        inTeam(Project_ID, id).then(team => {
            if(team != -1)
            {
                getTeamInfo(team).then(teamInfo => {
                    console.log(teamInfo);
                    res.render('Student/Project', {
                        Project: output,
                        inTeam: team,
                        Team: teamInfo
                    });
                });
            }
            else
            {
                res.render('Student/Project', {
                    Project: output,
                    inTeam: team
                });
            }
        });
    });
});

router.get('/Project/CreateTeam', (req,res) => {
    res.render('Student/Team/CreateTeam',
    {
       Project_ID: req.query.Project_ID
    });
});

router.post('/Project/CreateTeam', (req,res) => {
    const token = req.cookies.token;
    const {id} = jwt.verify(token,'alpha');
    const {Project_ID, Team_Name} = req.body;
    createTeam(Project_ID, id, Team_Name).then(output => {
        if(output == 1)
        {
            res.redirect('/Student/Project?id='+Project_ID);
        }
        else
        {
            console.log(output);
        }
    });
});

module.exports = router;