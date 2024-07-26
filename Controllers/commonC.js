const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const { verifyUser } = require("../Middlewares/verifyUser");
const { fetchgroups, getGroupInfo, getNonGroupStudent, getVacantGroups } = require("../queries/groupQuery");
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

exports.getGroups = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;

    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const groups = await fetchgroups(Project_ID)

    if (groups.status === 200) {
        return res.status(200).send(groups.groups);
    }
    else {
        return res.status(groups.status).send(groups.message);
    }
})

exports.fetchGroupDetails = catchAsyncErrors(async (req, res) => {
    const { Project_ID, GID } = req.params;

    if (Project_ID === undefined || GID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const group = await getGroupInfo(Project_ID, GID)

    if (group.status === 200) {
        return res.status(200).send(group.group);
    }
    else {
        return res.status(group.status).send(group.message);
    }
});

exports.fetchNonGroupStudents = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;

    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const students = await getNonGroupStudent(Project_ID)

    if (students.status !== 200) {
        return res.status(students.status).send(students.message);
    }

    return res.status(students.status).send(students.students);
});

exports.fetchVacantGroups = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;

    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const groups = await getVacantGroups(Project_ID)

    if (groups.status !== 200) {
        return res.status(groups.status).send(groups.message);
    }

    return res.status(200).send(groups.groups);
});