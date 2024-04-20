const express = require('express');
const jwt = require('jsonwebtoken');
const {fetchProfileTeacher} = require('../queries/profile');
const {createCourse, fetchCoursesTeacher, viewCourse, deleteCourse, getStudents} = require('../queries/CourseQuery');
const {createProject, getProjects} = require('../queries/ProjectQuery');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());


router.get('/ProfilePage', (req,res) => {

    const jwtToken = req.cookies.token;

    console.log(req);
    
    const {id} = jwt.verify(req.cookies.token, 'alpha');

    console.log(id);    
    
    fetchProfileTeacher(id).then(output => 
        {
            console.log(output);
            if(output.length == 1)
            {
                return res.render('/Teacher/ProfilePage', {
                    Teacher_FName: output.Teacher_FName,
                    Teacher_LName: output.Teacher_LName,
                    EmailAddress: output.EmailAddress,
                    Teacher_ID: output.Teacher_ID
                })
            }
            else
            {
                console.log(output);
            }
        })
} );

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

module.exports = router;