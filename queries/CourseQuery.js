const db = require("../db");

function createCourse(CourseCode, CourseName, Teacher_ID) {
    const currentDate = new Date();

    // Get the current year
    const currentYear = currentDate.getFullYear();

    const query = `INSERT INTO Course (Course_Code, Course_Name, Teacher_ID, Year, CanJoin)
    VALUES ('${CourseCode}', '${CourseName}', ${Teacher_ID}, ${currentYear}, 'Y')`;
    console.log(query);
    return new Promise((resolve, reject) => db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying LogIn table:', err);
            reject(err);
        }
        else
        {
            console.log(results);
            resolve(true);
        }
    }));
}

function canJoin(Course_ID)
{
    const query = `SELECT CanJoin FROM Course WHERE Course_ID = ${Course_ID} and Year = ${new Date().getFullYear()}`;
    return new Promise((resolve, reject) => db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying Course_ID table:', err);
            reject(err);
        }
        else
        {
            console.log(results);
            resolve(results);
        }
    }));
}

function JoinCourse(RollNo, Course_ID)
{
    return new Promise((resolve, reject) =>{
        
        canJoin(Course_ID).then(output => {
            
            const Year = new Date().getFullYear();
            if (output.length == 1 && output[0].CanJoin == 'Y') {
                const checkQuery = `SELECT * FROM Enrollement WHERE RollNo = ${RollNo} AND Course_ID = ${Course_ID} AND Year = ${Year}`;
                db.query(checkQuery, (err, results) => {
                    if (err) {
                        console.error('Error querying Enrollement table:', err);
                        reject(err);
                    }
                    else {
                        if (results.length > 0)
                        {
                            console.log('You are already enrolled in this course');
                            resolve(-1);
                        }
                        else {
                            console.log("About to insert" + Year);
                            const query = `INSERT INTO Enrollement (RollNo, Course_ID, Year)
                            VALUES (${RollNo}, ${Course_ID}, ${Year})`;
                            db.query(query, (err, results) => {
                                if (err) {
                                    console.error('Error querying Enrollement table:', err);
                                    reject(err);
                                }
                                else {
                                    console.log(results);
                                    resolve(1);
                                }
                            });
                        }
                    }
                });
            }
            else {
                resolve(0); // Course is not joinable or does not exist
            }
        });
    })
}

function fetchCoursesTeacher(ID){
    return new Promise((resolve, reject) => db.query(`SELECT * FROM Course WHERE Teacher_ID = ?`,
    [ID], (err, results) => {
        if (err) {
            console.error('Error querying Course Table:', err);
            reject(err);
        }
        else
        {   
            console.log(results);
            resolve(results);
        }
    }));
}

module.exports = {createCourse, JoinCourse, fetchCoursesTeacher};