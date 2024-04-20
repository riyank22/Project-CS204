const db = require("../db");

function createProject(Course_ID, Project_Name, Last_Date, Max_Student, Min_Student)
{
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

function getProjects(Course_ID)
{
    return new Promise((resolve, reject) => db.query(`SELECT * FROM project WHERE Course_ID = ?`,
    [Course_ID], (err, results) => {
        if (err) {
            console.error('Error querying Project Table:', err);
            reject(err);
        }
        else
        {   
            console.log(results);
            resolve(results);
        }
    }));
}

function getProjectDetails(Project_ID)
{
    return new Promise((resolve, reject) => db.query(`SELECT * FROM project WHERE Project_ID = ?`,
    [Project_ID], (err, results) => {
        if (err) {
            console.error('Error querying Project Table:', err);
            reject(err);
        }
        else
        {   
            console.log(results);
            resolve(results[0]);
        }
    }));

}

module.exports = {createProject, getProjects, getProjectDetails};