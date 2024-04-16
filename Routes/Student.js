const express = require('express');
const jwt = require('jsonwebtoken');
const {JoinCourse} = require('../queries/CourseQuery');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/JoinCourse', (req,res) => {
    res.render('Student/JoinCourse',
    {
        message: req.query.message
    });
});

router.get('/Home', (req,res) => {
    res.render('Student/Home')
});

router.post('/JoinCourse', (req,res) => {
    const jwtToken = req.cookies.token;
    console.log(jwtToken);
    const {id} = jwt.verify(jwtToken, 'alpha');
    console.log(id);
    const {Course_ID} = req.body;
    console.log(Course_ID);
    JoinCourse(id, Course_ID).then(output => {
        if(output == 1)
        {
            console.log("Course Joined");
            res.redirect('/Student/Home');
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

module.exports = router;