const db = require("../db");

function authorizeUser(EmailID, pass) {
    return new Promise((resolve, reject) => db.query(`SELECT * FROM LogIn WHERE EmailAddress = ? AND password = ?`,
    [EmailID,pass], (err, results) => {
        if (err) {
            console.error('Error querying LogIn table:', err);
            reject(err);
        }
        
        resolve(results.length == 1);
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

module.exports = {authorizeUser,updatePassword};