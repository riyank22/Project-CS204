const db = require("../db");

function fetchProfileTeacher(ID) {
    return new Promise((resolve, reject) => db.query(`SELECT Teacher_ID, Teacher_FName, Teacher_LName,
    EmailAddress FROM teacher WHERE Teacher_ID = ?`
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