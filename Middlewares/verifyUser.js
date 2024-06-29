const { fetchTeacherID } = require("../queries/CourseQuery");

async function verifyUser(req, res, next, Project_ID) {

    const output = await fetchTeacherID(Project_ID);
    if(output.status === 200 && req.userID === output.result.Teacher_ID)
    {
        next();
    }
    else if(output.status === 404)
    {
        res.status(404).send("Project Not Found");
    }
    else
    {
        res.status(403).send("Forbidden");
    }
}

module.exports = {verifyUser};