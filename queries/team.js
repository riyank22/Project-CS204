const db = require("../db");

function inTeam(Project_ID, RollNo)
{
    return new Promise((resolve, reject) => db.query(`SELECT * FROM Team_Member JOIN Team on 
    Team.id = Team_Member.Team_ID WHERE Team.Project_ID = ? AND RollNo = ?`,
    [Project_ID, RollNo], (err, results) => {
        if (err) {
            console.error('Error querying group table:', err);
            reject(err);
        }
        else
        {
            if(results.length == 0)
                resolve(-1);
            else
                resolve(results[0].Team_ID);
        }
    }));
}

function createTeam(Project_ID, RollNo, Team_Name)
{
    return new Promise((resolve, reject) => db.query(`INSERT INTO Team (Project_ID, Team_Lead, Team_Name) VALUES (?, ?, ?)`,
    [Project_ID, RollNo, Team_Name], (err, results) => {
        if (err) {
            console.error('Error querying group table:', err);
            reject(err);
        }
        else
        {
            resolve(true);
        }
    }));
}

function getTeamInfo(Team_ID)
{
    const query = `SELECT * FROM Team_Member JOIN student on student.RollNo = Team_Member.RollNo join Team on Team.id = Team_Member.Team_ID WHERE Team_ID = ${Team_ID} ORDER BY role`
    return new Promise((resolve, reject) => db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying group table:', err);
            reject(err);
        }
        else
        {
            resolve(results);
        }
    }));
}

function getTeamID(Project_ID, RollNo)
{
    return new Promise((resolve, reject) => 
    {
        db.query(`SELECT Team_ID FROM Team_Member tm
        JOIN Team t on t.id = tm.Team_ID WHERE Project_ID = ${Project_ID} AND RollNo = ${RollNo}`, (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else
            {
                console.log(results[0].Team_ID);
                resolve(results[0].Team_ID);
            }
        });
    });
}

function viewTeams(Project_ID)
{
    const query = `SELECT * FROM Team_Member JOIN Team_Member.Team_ID = Team.Team_ID WHERE Project_ID = ${Project_ID}`
    return new Promise((resolve, reject) => db.query(query,
    (err, results) => {
        if (err) {
            console.error('Error querying group table:', err);
            reject(err);
        }
        else
        {
            resolve(results);
        }
    }));
}

function getTeamSize(Project_ID)
{
    return new Promise((resolve, reject) => db.query(`SELECT Max_Students, Min_Students FROM project WHERE Project_ID = ?`,
    [Project_ID], (err, results) => {
        if (err) {
            console.error('Error querying group table:', err);
            reject(err);
        }
        else
        {
            resolve(results[0]);
        }
    }));
}

function canJoinTeam(Team_ID, Project_ID)
{
    return new Promise((resolve, reject) => {

    getTeamSize(Project_ID).then(size => {
        db.query(`SELECT COUNT(*) as count FROM Team_Member WHERE Team_ID = ?`,[Team_ID], (err, results) => {
        if(results[0].count >= size.Max_Students)
        {
            resolve(false);
        }
        else
        {
            resolve(true);
        }
    });
    });
});    
}

function getProjectID(Team_ID)
{
    return new Promise((resolve, reject) => {
        db.query(`SELECT Project_ID FROM Team WHERE id = ?`,[Team_ID], (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else
            {
                resolve(results[0].Project_ID);
            }
        });
    });
}

function joinTeam(Team_ID, RollNo)
{
    return new Promise((resolve, reject) => {
        inTeam(Team_ID, RollNo).then(team => {
            if(team == -1)
            {
                getProjectID(Team_ID).then(Project_ID =>
                    {
                        canJoinTeam(Team_ID, Project_ID).then(canJoin =>
                            {
                            if(canJoin)
                            {
                                db.query(`INSERT INTO Team_Member (Team_ID,role, RollNo) VALUES (?, ?,?)`,[Team_ID,'m', RollNo], (err, results) => {
                                    if (err) {
                                        console.error('Error querying group table:', err);
                                        reject(err);
                                    }
                                    else
                                    {
                                        resolve(Project_ID);
                                    }
                                });
                            }
                            else
                            {
                                resolve(false);
                            }
                    });
                });
            }

            else
            {
                console.log("Already in a team"+team);
                resolve(false);
            }
});
})};

function getAllTeamsInfo(Project_ID)
{
    const query1 = `select Team.id, Team_Name from Team where Project_ID = ${Project_ID}`;
    return new Promise((resolve, reject) => {
        db.query(query1, async (err, results) => {
            if (err) {
                console.error('Error querying team table:', err);
                reject(err);
            }
            else
            {
                for (let i = 0; i < results.length; i++) {
                    const query2 = `select s.FName, s.LName, s.RollNo, t.role from student s join Team_Member t on t.RollNo = s.RollNo where Team_ID = ${results[i].id}`;
                    await db.query(query2, (err, results2) =>{
                        if (err) {
                            console.error('Error querying team table:', err);
                            reject(err);
                        }
                        else
                        {
                            results[i]["Members"] = results2;
                        }
                    });
                }
                resolve(results);
            }
        });
    });
}

function deleteTeam(Team_ID)
{
    return new Promise((resolve, reject) => {
        getProjectID(Team_ID).then(Project_ID => {
            db.query(`DELETE FROM Team_Member WHERE Team_ID = ?`,[Team_ID], (err, results) => {
                if (err) {
                    console.error('Error querying group table:', err);
                    reject(err);
                }
                else
                {
                    db.query(`DELETE FROM Team WHERE id = ?`,[Team_ID], (err, results) => {
                        if (err) {
                            console.error('Error querying group table:', err);
                            reject(err);
                        }
                        else
                        {
                            resolve(Project_ID);
                        }
                    });
                }
            });
        });
    });
}

function leaveTeam(Team_ID, RollNo)
{
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM Team_Member WHERE Team_ID = ? AND RollNo = ?`,[Team_ID, RollNo], (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else
            {
                getProjectID(Team_ID).then(Project_ID => {
                    resolve(Project_ID);
                });
            }
        });
    });
}

function getNonTeamStudent(Project_ID)
{
    return new Promise((resolve, reject) => {
        const query = `SELECT FName, LName, s.RollNo from student s
        join Enrollement e on e.RollNo = s.RollNo
        where s.RollNo not in (SELECT RollNo from Team_Member tm
        join Team t on t.id = tm.Team_ID
        where Project_ID = ${Project_ID});`
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }

            else
            {
                resolve(results);
            }
        });
    });
}

function createRequestNotificaiton(Project, RollNo, id)
{
    return new Promise((resolve, reject) => {
        getTeamID(Project, RollNo).then(Team_ID => {
            db.query(`INSERT INTO request (Team_ID, Sender_ID) VALUES (?, ?)`,[Team_ID, id], (err, results) => {
                if (err) {
                    console.error('Error querying group table:', err);
                    reject(err);
                }
                else
                {
                    resolve(true);
                }
            });
        });
    });
}

function createInviteNotification(Project_ID, RollNo, id)
{
    return new Promise((resolve, reject) => {
        getTeamID(Project_ID, id).then(Team_ID => {
            db.query(`INSERT INTO invite (Team_ID, Receiver_ID) VALUES (?, ?)`,[Team_ID, RollNo], (err, results) => {
                if (err) {
                    console.error('Error querying group table:', err);
                    reject(err);
                }
                else
                {
                    resolve(true);
                }
            });
        });
    });
}

function deleteNotification(RollNo)
{
    return new Promise((resolve, reject) => {
        const query1 = `DELETE FROM request WHERE Sender_ID = ${RollNo}`;
        const query2 = `DELETE FROM invite WHERE Receiver_ID = ${RollNo}`;
        db.query(query1, (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else
            {
                db.query(query2, (err, results) => {
                    if (err) {
                        console.error('Error querying group table:', err);
                        reject(err);
                    }
                    else
                    {
                        resolve(true);
                    }
                });
            }
        });
    });
}

module.exports = {inTeam, createTeam, getTeamInfo, viewTeams,joinTeam, getAllTeamsInfo,
    leaveTeam, deleteTeam, getNonTeamStudent, createRequestNotificaiton, createInviteNotification, deleteNotification};