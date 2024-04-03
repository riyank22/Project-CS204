const db = require("../db");

function checkUser(EmailID, pass) {
    return new Promise((resolve, reject) => db.query(`SELECT * FROM LogIn WHERE EmailAddress = ? AND password = ?`,
    [EmailID,pass], (err, results) => {
        if (err) {
            console.error('Error querying LogIn table:', err);
            reject(err);
        }
        
        resolve(results.length == 1);
    }));
}

module.exports = checkUser;

// checkUser("202251127@iiitvadodara.ac.in", "202251127")
//     .then(userFound => {
//         console.log(userFound); // true if user found, false if not found
//     })
//     .catch(error => {
//         console.error(error); // Log any errors that occurred during the query
//     });