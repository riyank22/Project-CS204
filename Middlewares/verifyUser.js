const { fetchTeacherID, verifyStudentID } = require("../queries/projectQuery");

async function verifyUser(req, res, Project_ID) {

    let output;
    if (req.userType === 't') {
        output = await fetchTeacherID(Project_ID);
        if (output.status === 200 && req.userID === output.result.Teacher_ID) {
            return { status: 200 };
        }
    }
    else {
        output = await verifyStudentID(Project_ID, req.userID);
        if (output.status === 200) {
            return { status: 200 };
        }
    }

    if (output.status === 404) {
        return { status: 404, message: "Project Not Found"};
    }
    else {
        return { status: 403, message : "Forbidden"};
    }
}

module.exports = { verifyUser };