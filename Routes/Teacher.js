const express = require('express');
const jwt = require('jsonwebtoken');
const {createCourse, fetchCoursesTeacher, viewCourse, deleteCourse, getStudents} = require('../queries/CourseQuery');
const {createProject, getProjects, getProjectDetails, deleteProject, getCourseID} = require('../queries/ProjectQuery');
const {getNonTeamStudent, getTeamInfo, viewTeams} = require('../queries/team');

const { fetchProfile } = require('../Controllers/Teacher/homeC');
const { authenticateToken } = require('../Middlewares/jwtTokenVerifer');
const cookieParser = require('cookie-parser');
const router = express.Router();

router.use(cookieParser());

router.use(authenticateToken);

router.route('/profile').get(fetchProfile);

router.get('/CreateCourse', (req,res) => {
    res.render('Teacher/CreateCourse');
});

router.get('/Home', (req,res) => {
    fetchCoursesTeacher(req.query.id).then(output => {
    res.render('Teacher/Home' , {
        Courses: output});
    });
});

router.post('/CreateCourse', (req,res) => {
    const jwtToken = req.cookies.token;
    const {id} = jwt.verify(jwtToken, 'alpha');
    const {Course_Code, Course_Name} = req.body;
    createCourse(Course_Code, Course_Name, id).then(output => {
        if(output == 1)
        {
            res.redirect('/Teacher/Home?id='+id);
        }
        else if(output == -1)
        {
            res.redirect('/Teacher/CreateCourse?Message=Course already exists');
        }
        else
        {
            console.log(output);
        }
    })
});

router.get('/Course', (req,res) => {
    const id = req.query.id;
    viewCourse(id).then(output => {
        getStudents(id).then(students => {
            getProjects(id).then(projects => {
                res.render('Teacher/Course', {
                    Course: output[0],
                    Students: students,
                    Projects: projects
                });
            });
        });
    });
});

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