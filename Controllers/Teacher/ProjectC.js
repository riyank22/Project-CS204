const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { addProject, fetchProject } = require('../../queries/projectQuery');
const { verifyUser } = require('../../Middlewares/verifyUser');
const { DateTime } = require('luxon');

exports.createProject = catchAsyncErrors(async (req, res) => {
    const { userID } = req;
    const { projectName, maxStudents, minStudents, lastDate } = req.body;
    if (projectName === undefined || maxStudents === undefined || minStudents === undefined || lastDate === undefined) {
        res.status(400).send("Bad Request");
    }

    let { canJoin, projectDescription, totalGroups } = req.body;

    console.log(projectDescription)

    if (canJoin === undefined) {
        canJoin = 'Y';
    }

    if (projectDescription === undefined) {
        projectDescription = null;
    }

    if (totalGroups === undefined) {
        totalGroups = null;
    }

    const formatDate = DateTime.fromFormat(lastDate, 'yyyy-MM-dd').toString();

    const output = await addProject(projectName, maxStudents, minStudents, formatDate, userID, canJoin, projectDescription, totalGroups);
    if (output.status === 200) {
        res.status(200).send("Project Created");
    }
    else {
        res.status(500).send("Internal Server Error");
    }
});

exports.getProjectDetails = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }
    const result = await verifyUser(req, res, Project_ID);
    if (result.status === 200) {
        const output = await fetchProject(Project_ID);
        if (output.status === 200) {
            res.status(200).send(output);
        }
        else if (output.status === 404) {
            res.status(404).send("Project Not Found");
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.status(result.status).send(result.message);
    }
});