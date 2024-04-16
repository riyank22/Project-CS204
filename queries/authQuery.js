const db = require("../db");

function authorizeUser(EmailID, pass) {
    return new Promise((resolve, reject) => db.query(`SELECT * FROM LogIn WHERE EmailAddress = ? AND password = ?`,
    [EmailID,pass], (err, results) => {
        if (err) {
            console.error('Error querying LogIn table:', err);
            reject(err);
        }

        else if(results.length == 1)
        {
            resolve(results[0].role);
        }
        else
        {
            resolve("n");
        }
    }));
}

function updatePassword(EmailID,newPassword) {
    return new Promise((resolve, reject) => db.query(`UPDATE LogIn SET password = ? WHERE EmailAddress = ?`,
    [newPassword,EmailID], (err, results) => {
        if (err) {
            console.error('Error querying LogIn table:', err);
            reject(err);
        }
        else
        {
            resolve(true);
        }
    }));
}

function getRoll(EmailId, Roll)
{
    if(Roll == "s")
    {
        console.log("Gettting RollNo");
        return new Promise((resolve,reject) => db.query(`SELECT RollNo from student join LogIn on student.EmailAddress = LogIn.EmailAddress where student.EmailAddress = ?`,
        [EmailId],(err, result) => {
            if (err) {
                console.error('Error querying Student table:', err);
                reject(err);
            }
            else
            {
                resolve(result[0].RollNo);
            }
        })) 
    }

    else
    {
        return new Promise((resolve,reject) => db.query(`SELECT Teacher_ID from teacher join LogIn on teacher.EmailAddress = LogIn.EmailAddress where teacher.EmailAddress = ?`,
        [EmailId],(err, result) => {
            if (err) {
                console.error('Error querying LogIn table:', err);
                reject(err);
            }
            else
            {
                resolve(result[0].Teacher_ID);
            }
        })) 
    }
}

module.exports = {authorizeUser,updatePassword, getRoll};