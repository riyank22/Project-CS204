const express = require('express');
const jwt = require('jsonwebtoken');
const {JoinCourse, fetchCoursesStudent, viewCourse, unenrollCourse, getStudents} = require('../queries/CourseQuery');
const router = express.Router();
const cookieParser = require('cookie-parser');
const {getProjects, getProjectDetails} = require('../queries/ProjectQuery');
const {createTeam, inTeam, getTeamInfo, getAllTeamsInfo,
    joinTeam, leaveTeam, deleteTeam, getNonTeamStudent} = require('../queries/team');

const {createInviteNotification,createRequestNotificaiton,deleteNotification} = require('../queries/notification'); 
const { authenticateToken, validateUserTypeS } = require('../Middlewares/jwtTokenVerifer');
const { fetchProfile } = require('../Controllers/Student/homeC');

router.use(cookieParser());

router.use(authenticateToken);

router.use(validateUserTypeS);

router.route('/profile').get(fetchProfile);

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
    console.log(req.cookies.token);
    const Project_ID = req.query.id;
    getProjectDetails(Project_ID).then(output => {
        inTeam(Project_ID, id).then(team => {
            if(team != -1)
            {
                getTeamInfo(team).then(teamInfo => {
                    if(id == teamInfo[0].Team_Lead)
                    {
                        res.render('Student/Project/Project-Team-L', {
                            Project: output,
                            Team_Name : teamInfo[0].Team_Name,
                            Team_ID : teamInfo[0].id,
                            Team: teamInfo
                        });
                    }
                    else
                    {
                        res.render('Student/Project/Project-Team-M', {
                            Project: output,
                            Team_Name : teamInfo[0].Team_Name,
                            Team_ID : teamInfo[0].id,
                            Team: teamInfo
                        });
                    }
                });
            }
            else
            {
                res.render('Student/Project/Project-No-Team', {
                    Project: output,
                });
            }
        });
    });
});

router.get('/Project/ViewAllTeams', (req,res) => {
    const Project_ID = req.query.Project_ID;
    getAllTeamsInfo(Project_ID).then(output => {
        res.render('Student/Project/ViewAllTeams', {
            Teams: output
        });
    });
});

router.get('/Project/JoinTeam', (req,res) => {
    const {id} = jwt.verify(req.cookies.token, 'alpha');
    const Team_ID = req.query.Team_ID;

    joinTeam(Team_ID, id).then(output => {
        if(output != false)
        {
            res.redirect('/Student/Project?id='+output);
        }
        else
        {
            console.log(output);
        }
    });
}
);

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

router.get('/Project/LeaveTeam', (req,res) => {
    const {id} = jwt.verify(req.cookies.token, 'alpha');
    const Team_ID = req.query.Team_ID;
    leaveTeam(Team_ID, id).then(output => {
        if(output != -1)
        {
            res.redirect('/Student/Project?id='+output);
        }
        else
        {
            console.log(output);
        }
    });
});

router.get('/Project/DeleteTeam', (req,res) => {
    deleteTeam(req.query.Team_ID).then(output => {
        if(output != -1)
        {
            res.redirect('/Student/Project?id='+output);
        }
        else
        {
            console.log(output);
        }
    });
});

router.get('/Project/ViewPotentialMembers', (req,res) => {
    const Project_ID = req.query.Project_ID;
    getNonTeamStudent(Project_ID).then(output => {
        res.render('Student/Project/PotentialMembers', {
            Project_ID: Project_ID,
            Students: output
        });
    });
});

router.get('/Project/GenerateInvite', (req,res) => {
    const Project_ID = req.query.Project_ID;
    const RollNo = req.query.RollNo;
    const {id} = jwt.verify(req.cookies.token, 'alpha');
    console.log(Project_ID);
    createInviteNotification(Project_ID, RollNo, id).then(output => {
        if(output)
        {
            res.redirect('/Student/Project?id='+req.query.Project_ID);
        }
        else
        {
            console.log(output);
        }
    });
});

router.get('/Project/ViewInvites', (req,res) => {
});

module.exports = router;