const { fetchTeacherID } = require("../queries/projectQuery");

async function verifyUser(req, res, Project_ID) {

    let output;
    if(req.userType === 't')
    {
        output = await fetchTeacherID(Project_ID);        
    }
    else
    {
        output = await fetchStudentID(Project_ID);
    }
    
    if(output.status === 200 && req.userID === output.result.Teacher_ID)
    {
        return {status: 200};
    }
    else if(output.status === 404)
    {
        res.status(404).send("Project Not Found");
        return {status: 404};
    }
    else
    {
        res.status(403).send("Forbidden");
        return {status: 403};
    }
}

module.exports = {verifyUser};