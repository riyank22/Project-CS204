const db = require("../db");

function createCourse(CourseCode, CourseName, Teacher_ID) {

    return new Promise((resolve, reject) => {
        canCreate(CourseCode, CourseName).then(output => {
            if(output)
            {
                const currentDate = new Date();
    
                // Get the current year
                const currentYear = currentDate.getFullYear();
    
                const query = `INSERT INTO Course (Course_Code, Course_Name, Teacher_ID, Year, CanJoin)
                VALUES ('${CourseCode}', '${CourseName}', ${Teacher_ID}, ${currentYear}, 'Y')`;
                db.query(query, (err, results) => {
                    if (err) {
                        console.error('Error querying LogIn table:', err);
                        reject(err);
                    }
                    else
                    {
                        console.log(results);
                        resolve(true);
                    }
                });
            }
            else
            {
                resolve(-1); //indication the course already exists.
            }
        });
    });
}

function canCreate(CourseCode)
{
    const query = `SELECT * FROM Course WHERE Course_Code = '${CourseCode}' AND Year = ${new Date().getFullYear()}`;
    return new Promise((resolve, reject) => db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying Course table:', err);
            reject(err);
        }
        else
        {
            if(results.length > 0)
            {
                resolve(false);
            }
            else
            {
                resolve(true);
            }
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
            resolve(results);
        }
    }));
}

function fetchCoursesStudent(ID){
    return new Promise((resolve, reject) => db.query(`SELECT * FROM Enrollement join Course on Enrollement.Course_ID = Course.Course_ID
    where RollNo = '${ID}'`,
    (err, results) => {
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

function viewCourse(Course_ID)
{
    return new Promise((resolve, reject) => db.query(`SELECT * FROM Course WHERE Course_ID = ?`,
    [Course_ID], (err, results) => {
        if (err) {
            console.error('Error querying Course Table:', err);
            reject(err);
        }
        else
        {   
            resolve(results);
        }
    }));
}

function unenrollCourse(RollNo, Course_ID)
{
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

function removeStudents(ID)
{
    return new Promise((resolve,reject) => db.query(`DELETE FROM Enrollement WHERE Course_ID = ${ID}`,(err,result) => {
        if(err)
        {
            console.error('Error querying Student table:', err);
            reject(err);
        }
        else
        {
            resolve(true);
        }
    }))
}

function deleteCourse(ID)
{
    return new Promise((resolve,reject) =>        

        removeStudents(ID).then(() =>
        {
            db.query(`DELETE FROM Course WHERE Course_ID = ${ID}`,(err,result) => {
            if(err)
            {
                console.error('Error querying Student table:', err);
                reject(err);
            }
            else
            {
                resolve(true);
            }
        });
    }))
}

function getStudents(ID)
{
    return new Promise((resolve,reject) =>        
    {
        const query = `SELECT s.FName, s.LName, s.RollNo FROM student s JOIN Enrollement e ON s.RollNo = e.RollNo WHERE e.Course_ID = ${ID}`;
        db.query(query,(err,result) => {
        if(err)
        {
            console.error('Error querying Student table:', err);
            reject(err);
        }
        else
        {
            resolve(result);
        }
        })
    });
};

module.exports = {createCourse, JoinCourse, fetchCoursesTeacher,
    fetchCoursesStudent, viewCourse, unenrollCourse, deleteCourse, getStudents};