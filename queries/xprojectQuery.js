const db = require("../db");

function createProject(Course_ID, Project_Name, Last_Date, Max_Student, Min_Student) {
    const query = `INSERT INTO project (Course_ID, Project_Name, Last_Date, Max_Students, Min_Students) VALUES (${Course_ID}, '${Project_Name}', '${Last_Date}', ${Max_Student}, ${Min_Student})`;

    return new Promise((resolve, reject) => db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying Project table:', err);
            reject(err);
        }
        else {
            console.log(results);
            resolve(1);
        }
    }));
}

function getProjects(Course_ID) {
    return new Promise((resolve, reject) => db.query(`SELECT * FROM project WHERE Course_ID = ?`,
        [Course_ID], (err, results) => {
            if (err) {
                console.error('Error querying Project Table:', err);
                reject(err);
            }
            else {
                console.log(results);
                resolve(results);
            }
        }));
}

function getProjectDetails(Project_ID) {
    console.log(Project_ID)
    return new Promise((resolve, reject) => db.query(`SELECT * FROM project WHERE Project_ID = ?`,
        [Project_ID], (err, results) => {
            if (err) {
                console.error('Error querying Project Table:', err);
                reject(err);
            }
            else {
                console.log(results);
                resolve(results[0]);
            }
        }));

}

function deleteProject(Project_ID) {
    const query1 = `SELECT id from Team where Project_ID = ${Project_ID}`;
    const query2 = `DELETE FROM Team_Member WHERE Team_ID IN (${query1})`;
    const query3 = `DELETE FROM Team WHERE Project_ID = ${Project_ID}`;
    const query4 = `DELETE FROM project WHERE Project_ID = ${Project_ID}`;

    return new Promise((resolve, reject) => db.query(query1, (err, results) => {
        if (err) {
            console.error('Error querying Project table:', err);
            reject(err);
        }
        else {
            db.query(query2, (err, results) => {
                if (err) {
                    console.error('Error querying Project table:', err);
                    reject(err);
                }
                else {
                    db.query(query3, (err, results) => {
                        if (err) {
                            console.error('Error querying Project table:', err);
                            reject(err);
                        }
                        else {
                            db.query(query4, (err, results) => {
                                if (err) {
                                    console.error('Error querying Project table:', err);
                                    reject(err);
                                }
                                else {
                                    resolve(1);
                                }
                            });
                        }
                    });
                }
            });
        }
    }));
}

function getCourseID(Project_ID) {
    return new Promise((resolve, reject) => db.query(`SELECT Course_ID FROM project WHERE Project_ID = ?`, [Project_ID], (err, results) => {
        if (err) {
            console.error('Error querying group table:', err);
            reject(err);
        }
        else {
            resolve(results[0].Course_ID);
        }
    }));

}

module.exports = { createProject, getProjects, getProjectDetails, deleteProject, getCourseID };