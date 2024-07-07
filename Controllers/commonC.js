const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const { verifyUser } = require("../Middlewares/verifyUser");
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
        res.status(result.status).send("Forbidden");
    }
})