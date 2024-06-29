const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { addProject, fetchProject } = require('../../queries/CourseQuery');
const {verifyUser} = require('../../Middlewares/verifyUser');
const { DateTime } = require('luxon');

exports.createProject = catchAsyncErrors( async (req, res) => {
    const { userID } = req;
    const { projectName, maxStudents, minStudents, lastDate } = req.body;
    if(projectName === undefined || maxStudents === undefined || minStudents === undefined || lastDate === undefined)
    {
        res.status(400).send("Bad Request");  
    }

    const formatDate = DateTime.fromFormat(lastDate, 'yyyy-MM-dd').toString();

    const output = await addProject(projectName, maxStudents, minStudents, formatDate, userID);
    if(output.status === 200)
    {
        res.status(200).send("Project Created");
    }
    else
    {
        res.status(500).send("Internal Server Error");
    }
});

exports.getProjectDetails = catchAsyncErrors( async (req, res) => {
    const { Project_ID } = req.params;
    if(Project_ID === undefined)
    {
        res.status(400).send("Bad Request");
    }
    await verifyUser(req, res, Project_ID);
    const output = await fetchProject(Project_ID);
    if(output.status === undefined)
    {
        res.status(200).send(output);
    }
    else
    {
        res.status(500).send("Internal Server Error");
    }
});