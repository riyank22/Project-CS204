const express = require('express');
const jwt = require('jsonwebtoken');
const {fetchProfileTeacher} = require('../queries/profile');
const {createCourse, fetchCoursesTeacher} = require('../queries/CourseQuery');
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
    console.log(jwtToken);
    const {id} = jwt.verify(jwtToken, 'alpha');
    console.log(id);
    const {Course_Code, Course_Name} = req.body;
    console.log(Course_Code);
    console.log(Course_Name);
    createCourse(Course_Code, Course_Name, id).then(output => {
        if(output)
        {
            res.redirect('/Teacher/Home?id='+id);
        }
        else
        {
            console.log(output);
        }
    })
});

module.exports = router;