const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { verifyUser } = require('../../Middlewares/verifyUser');
const { addToProject, fetchProject, unenrollProject } = require('../../queries/projectQuery');

exports.joinProject = catchAsyncErrors(async (req, res) => {
    const { userID } = req;
    const { Project_ID } = req.params;

    const result = await addToProject(Project_ID, userID);
    if (result.status === 200) {
        res.status(200).send("Joined Project Successfully");
    }
    else if (result.status === 404) {
        res.status(404).send("Project Not Found");
    }
    else if (result.status === 403) {
        res.status(403).send("Project is Closed for Joining");
    }
    else if (result.status === 409) {
        res.status(409).send("Already Joined Project");
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
        else {
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.status(result.status).send(result.message);
    }
});

exports.leaveProject = catchAsyncErrors(async (req, res) => {
    const { userID } = req;
    const { Project_ID } = req.params;

    const inProject = await verifyUser(req, res, Project_ID);

    if (inProject.status !== 200) {
        return res.status(inProject.status).send(inProject.message);
    }

    const result = await unenrollProject(userID, Project_ID);

    return res.status(result.status).send(result.message);
})