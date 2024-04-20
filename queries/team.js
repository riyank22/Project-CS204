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
    return new Promise((resolve, reject) => db.query(`SELECT * FROM Team WHERE id = ?`,
    [Team_ID], (err, results) => {
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

function joinTeam(Team_ID, RollNo)
{
    return new Promise((resolve, reject) => {
        canJoinTeam(Team_ID).then(canJoin => {
            if(canJoin)
            {
                db.query(`INSERT INTO Team_Member (Team_ID,role, RollNo) VALUES (?, ?,?)`,[Team_ID,'m', RollNo], (err, results) => {
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
            else
            {
                resolve(false);
            }
        });
    });
}

module.exports = {inTeam, createTeam, getTeamInfo, viewTeams,joinTeam};