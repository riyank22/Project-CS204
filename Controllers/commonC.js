const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const { verifyUser } = require("../Middlewares/verifyUser");
const { fetchTeamInfo, fetchgroups, getGroupInfo } = require("../queries/groupQuery");
const { fetchStudents } = require("../queries/projectQuery");

exports.getEnrolledStudentList = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);
    if (result.status === 200) {
        const output = await fetchStudents(Project_ID);
        if (output.status === 200) {
            res.status(200).send({
                students: output.result,
                count: output.result.length
            });
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.status(result.status).send(result.message);
    }
})

exports.getTeams = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);
    if (result.status === 200) {
        const output = await fetchTeamInfo(Project_ID);
        if (output.status === 200) {
           
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.status(result.status).send("Forbidden");
    }
})

exports.getGroups = catchAsyncErrors(async (req, res) => {
    const{Project_ID} = req.params;

    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if(result.status !== 200)
    {
        res.status(result.status).send(res.message);
    }

    const groups = await fetchgroups(Project_ID)

    if(groups.status === 200)
    {
        return res.status(200).send(groups.groups);
    }
    else
    {
        return res.status(groups.status).send(groups.message);
    }
})

exports.fetchGroupDetails = catchAsyncErrors(async (req, res) => {
    const{Project_ID, GID} = req.params;

    if (Project_ID === undefined || GID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if(result.status !== 200)
    {
        res.status(result.status).send(res.message);
    }

    const group = await getGroupInfo(Project_ID, GID)

    if(group.status === 200)
    {
        return res.status(200).send(group.group);
    }
    else
    {
        return res.status(group.status).send(group.message);
    }
});