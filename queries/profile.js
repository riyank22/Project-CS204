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

function fetchProfileStudent(ID) {
    return new Promise((resolve, reject) => db.query(`SELECT RollNo, Student_FName, Student_LName,
    EmailAddress FROM student WHERE RollNo = ?`
    [ID], (err, results) => {
        if (err) {
            console.error('Error querying LogIn table:', err);
            reject(err);
        }
        else
        {
            console.log(results[0]);
            resolve(results[0]);
        }
    }));
}

module.exports = {fetchProfileTeacher, fetchProfileStudent};