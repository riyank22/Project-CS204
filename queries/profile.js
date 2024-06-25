const dbQuery = require("../db");

async function fetchProfileTeacher(userID)
{
    const params = [userID];
    const result = await dbQuery(`SELECT Teacher_FName, Teacher_LName, emailID, gender, Joining_Year FROM teacher WHERE userId = ?`, params);
    if(result.length === 1)
    {
        result[0].status = 200;
        return result[0];
    }
    else
    {
        return {status: 404};
    }
}

async function fetchProfileStudent(userID)
{
    const params = [userID];
    const result = await dbQuery(`SELECT * FROM student WHERE userId = ?`, params);
    if(result.length === 1)
    {
        result[0].status = 200;
        return result[0];
    }
    else if(result.status === 500)
    {
        return {status: 500};
    }
    else
    {
        return {status: 404};
    }
}

module.exports = {fetchProfileTeacher, fetchProfileStudent};