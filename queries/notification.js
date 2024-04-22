const db = require("../db");
const{getProjectID} = require('./team');

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

function viewInvites(RollNo, Project_ID)
{
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM invite WHERE Receiver_ID = ${RollNo} AND Team_ID IN (SELECT id FROM Team WHERE Project_ID = ${Project_ID})`;
        db.query(`SELECT * FROM invite WHERE Receiver_ID = ?`,[RollNo], (err, results) => {
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


module.exports = {deleteNotification,createInviteNotification,createRequestNotificaiton};