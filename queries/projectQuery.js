const dbQuery = require("../db");

async function fetchProjectTeacher(userID) {

    const result = await dbQuery(`SELECT Project_ID, Project_Name FROM project WHERE Teacher_ID = ?`, [userID]);
    if (result.status === 500) {
        return { status: 500 };
    }
    return result;
}

async function fetchProjectStudent(userID) {

    const query = `SELECT e.Project_ID, p.Project_Name FROM enrollement as e
    join project as p 
    on p.Project_ID = e.Project_ID 
    WHERE Student_ID = ?`;
    const result = await dbQuery(query, [userID]);
    if (result.status === 500) {
        return { status: 500 };
    }
    return result;
}

async function fetchProject(projectID) {
    console.log(projectID);
    const result = await dbQuery(`SELECT * FROM project WHERE Project_ID = ?`, [projectID]);
    if (result.status === 500) {
        return { status: 500 };
    }
    else if (result.length === 0) {
        return { status: 404 };
    }
    result[0].status = 200;
    return result[0];
}

async function addProject(projectName, maxStudents, minStudents, lastDate, userID) {
    const currentTime = new Date();
    const result = await dbQuery(`INSERT INTO project (Project_Name, Max_Students, Min_Students, Last_Date, Teacher_ID, CanJoin, Posted_Date, Modified_Date) VALUES (?, ?, ?, ?, ?, 'Y', ?, ?)`,
        [projectName, maxStudents, minStudents, lastDate, userID, currentTime, currentTime]);
    if (result.status === 500) {
        console.error('Error querying project table:', err);
        return { status: 500 };
    }
    else {
        return { status: 200 };
    }
}

async function fetchTeacherID(Project_ID) {
    const result = await dbQuery(`SELECT Teacher_ID FROM project WHERE Project_ID = ?`, [Project_ID]);
    if (result.status === 500) {
        return { status: 500 };
    }
    else if (result.length === 0) {
        return { status: 404 };
    }
    return { result: result[0], status: 200 };
}

async function fetchStudentID(Project_ID) {
    const result = await dbQuery(`SELECT Student_ID FROM enrollement WHERE Project_ID = ?`, [Project_ID]);
    if (result.status === 500) {
        return { status: 500 };
    }
    else if (result.length === 0) {
        return { status: 404 };
    }
    return { result: result[0], status: 200 };
}


async function addToProject(Project_ID, Student_ID) {
    const projectDetails = await fetchProject(Project_ID);
    if (projectDetails.status === 200) {
        if (projectDetails.CanJoin === 'Y') {
            const alreadyExists = await dbQuery(`SELECT * FROM enrollement WHERE Project_ID = ? AND Student_ID = ?`, [Project_ID, Student_ID]);
            if (alreadyExists.status === 500) {
                return { status: 500 };
            }
            else if (alreadyExists.length !== 0) {
                return { status: 409 };
            }

            const result = await dbQuery(`INSERT INTO enrollement (Project_ID, Student_ID) VALUES (?, ?)`, [Project_ID, Student_ID]);
            if (result.status === 500) {
                return { status: 500 };
            }
            else {
                return { status: 200 };
            }
        }
        else {
            return { status: 403 };
        }
    }
    else if (projectDetails.status === 404) {
        return { status: 404 };
    }
    else {
        return { status: 500 };
    }
}

function fetchCoursesStudent(ID) {
    return new Promise((resolve, reject) => db.query(`SELECT * FROM Enrollement join Course on Enrollement.Course_ID = Course.Course_ID
    where RollNo = '${ID}'`,
        (err, results) => {
            if (err) {
                console.error('Error querying Course Table:', err);
                reject(err);
            }
            else {
                console.log(results);
                resolve(results);
            }
        }));
}


function unenrollCourse(RollNo, Course_ID) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Enrollement WHERE RollNo = ${RollNo} AND Course_ID = ${Course_ID} AND Year = ${new Date().getFullYear()}`;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error querying Enrollement table:', err);
                reject(err);
            }
            else {
                resolve(1);
            }
        });
    });
}

function removeStudents(ID) {
    return new Promise((resolve, reject) => db.query(`DELETE FROM Enrollement WHERE Course_ID = ${ID}`, (err, result) => {
        if (err) {
            console.error('Error querying Student table:', err);
            reject(err);
        }
        else {
            resolve(true);
        }
    }))
}

function deleteCourse(ID) {
    const query0 = `SELECT Project_ID FROM project WHERE Course_ID = ${ID}`;
    const query1 = `SELECT id from Team where Project_ID IN (${query0})`;
    const query2 = `DELETE FROM Team_Member WHERE Team_ID IN (${query1})`;
    const query3 = `DELETE FROM Team WHERE id IN (${query0})`;
    const query4 = `DELETE FROM project WHERE Course_ID = ${ID}`;
    const query5 = `DELETE FROM Enrollement WHERE Course_ID = ${ID}`;
    const query6 = `DELETE FROM Course WHERE Course_ID = ${ID}`;
    return new Promise((resolve, reject) => {
        db.query(query0, (err, results) => {
            if (err) {
                console.error('Error querying Project table:', err);
                reject(err);
            }
            else {
                db.query(query1, (err, results) => {
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
                                                db.query(query5, (err, results) => {
                                                    if (err) {
                                                        console.error('Error querying Project table:', err);
                                                        reject(err);
                                                    }
                                                    else {
                                                        db.query(query6, (err, results) => {
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
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

function getStudents(ID) {
    return new Promise((resolve, reject) => {
        const query = `SELECT s.FName, s.LName, s.RollNo FROM student s JOIN Enrollement e ON s.RollNo = e.RollNo WHERE e.Course_ID = ${ID}`;
        db.query(query, (err, result) => {
            if (err) {
                console.error('Error querying Student table:', err);
                reject(err);
            }
            else {
                resolve(result);
            }
        })
    });
};

module.exports = {
    fetchProjectTeacher,
    fetchProjectStudent,
    fetchProject,
    addProject,
    fetchTeacherID,
    fetchStudentID,
    addToProject,
    fetchCoursesStudent,
    unenrollCourse,
    deleteCourse,
    getStudents
};