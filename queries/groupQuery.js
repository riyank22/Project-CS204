const dbQuery = require("../db");

async function canEdit(Project_ID) {
    const result = await dbQuery(`SELECT Last_Date FROM project WHERE Project_ID = ?`, [Project_ID]);
    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    if (result[0].Last_Date < new Date()) {
        return { status: 403, message: "Cannot create group after deadline" };
    }
    else {
        return { status: 200 };
    }
}

async function insertGroup(Project_ID, Group_Name, Student_ID) {

    const result = await dbQuery(`SELECT Total_Groups, Max_Students FROM project WHERE Project_ID = ?`, [Project_ID]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    if (result[0].Total_Groups !== null) {
        const count = await dbQuery(`select * from number_of_groups where Project_ID = ?`, [Project_ID]);

        if (result.status === 500) {
            return { status: 500, message: "Internal Server Error" };
        }

        if (count.length != 0 && result[0].Total_Groups <= count[0].count) {
            return { status: 403, message: "Max number of groups are formed. Can not create more groups." };
        }
    }

    if (await inGroup(Project_ID, Student_ID)) {
        return { status: 403, message: "Already in a group" };
    }

    const totalGroups = await dbQuery(`SELECT * FROM \`group\` WHERE Project_ID = ? AND Group_Name = ?`, [Project_ID, Group_Name]);

    if (totalGroups.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    if (totalGroups.length > 0) {
        return { status: 409, message: "Group Name already exists, change Group Name." };
    }

    const output1 = await dbQuery(`INSERT INTO \`group\` (Project_ID, Group_Name, Creation_Time, Capacity_Left) VALUES (?, ?, ?, ?)`, [Project_ID, Group_Name, new Date(), result[0].Max_Students]);
    if (output1.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    const gid = await dbQuery(`SELECT GID FROM \`group\` WHERE Project_ID = ? AND Group_Name = ?`, [Project_ID, Group_Name]);

    if (gid.status === 500 || gid.length === 0) {
        return { status: 500, message: "Internal Server Error" };
    }

    console.log(gid);

    const output2 = await dbQuery(`INSERT INTO group_Member (Project_ID, GID, Student_ID, Role, Joining_Time) VALUES (?, ?, ?, 'L', ?)`, [Project_ID, gid[0].GID, Student_ID, new Date()]);

    if (output2.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, message: "Group Created Successfully" };
}

async function inGroup(Project_ID, Student_ID) {
    const result = await dbQuery(`SELECT * FROM group_member WHERE Project_ID = ? AND Student_ID  = ?`, [Project_ID, Student_ID]);

    if (result.length > 0)
        return true;
    else
        return false;

}

async function joinGroup(Project_ID, GID, Student_ID) {
    let result = await dbQuery(`SELECT count(*) as count FROM group_member WHERE Project_ID = ? AND Student_ID = ?`, [Project_ID, Student_ID]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    if (result[0].count > 0) {
        return { status: 409, message: "Already in a group" };
    }

    result = await dbQuery(`SELECT Capacity_Left FROM \`group\` WHERE Project_ID = ? AND GID = ?`, [Project_ID, GID]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    if (result.lenght == 0 || result === null) {
        console.log("hell")
        return { status: 404, message: "Group Not Found or is not assciated with this project" };
    }

    if (result[0].Capacity_Left === 0) {
        return { status: 403, message: "Group is full" };
    }

    const output = await dbQuery(`INSERT INTO group_member (Project_ID, GID, Student_ID, Role, Joining_Time) VALUES (?, ?, ?, 'M', ?)`, [Project_ID, GID, Student_ID, new Date()]);

    if (output.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, message: "Joined Group Successfully" };
};

async function fetchgroups(Project_ID) {
    const result = await dbQuery(`SELECT * FROM group_with_groupmembers WHERE Project_ID = ?`, [Project_ID]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    let groups = [];
    let currentGroup = {};
    let currentGID = null

    for (const obj of result) {
        const member = { FName: obj.FName, LName: obj.LName, Student_ID: obj.Student_ID }
        if (currentGID === null || currentGID !== obj.GID) {
            if (currentGID !== null) {
                groups.push(currentGroup)
            }
            currentGID = obj.GID
            currentGroup = { GID: obj.GID, Group_Name: obj.Group_Name, Capacity_Left: obj.Capacity_Left, members: [member] };
        }
        else {
            currentGroup.members.push(member);
        }
    }

    groups.push(currentGroup)

    return { status: 200, groups: groups }
}

function getTeamInfo(Team_ID) {
    const query = `SELECT * FROM Team_Member JOIN student on student.RollNo = Team_Member.RollNo join Team on Team.id = Team_Member.Team_ID WHERE Team_ID = ${Team_ID} ORDER BY role DESC`
    return new Promise((resolve, reject) => db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying group table:', err);
            reject(err);
        }
        else {
            resolve(results);
        }
    }));
}

function getTeamID(Project_ID, RollNo) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT Team_ID FROM Team_Member tm
        JOIN Team t on t.id = tm.Team_ID WHERE Project_ID = ${Project_ID} AND RollNo = ${RollNo}`, (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else {
                console.log(results[0].Team_ID);
                resolve(results[0].Team_ID);
            }
        });
    });
}

function viewTeams(Project_ID) {
    const query = `SELECT * FROM Team WHERE Project_ID = ${Project_ID};`
    return new Promise((resolve, reject) => db.query(query,
        (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else {
                resolve(results);
            }
        }));
}

function getTeamSize(Project_ID) {
    return new Promise((resolve, reject) => db.query(`SELECT Max_Students, Min_Students FROM project WHERE Project_ID = ?`,
        [Project_ID], (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else {
                resolve(results[0]);
            }
        }));
}

function getProjectID(Team_ID) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT Project_ID FROM Team WHERE id = ?`, [Team_ID], (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else {
                resolve(results[0].Project_ID);
            }
        });
    });
}

function deleteTeam(Team_ID) {
    return new Promise((resolve, reject) => {
        getProjectID(Team_ID).then(Project_ID => {
            db.query(`DELETE FROM Team_Member WHERE Team_ID = ?`, [Team_ID], (err, results) => {
                if (err) {
                    console.error('Error querying group table:', err);
                    reject(err);
                }
                else {
                    db.query(`DELETE FROM Team WHERE id = ?`, [Team_ID], (err, results) => {
                        if (err) {
                            console.error('Error querying group table:', err);
                            reject(err);
                        }
                        else {
                            resolve(Project_ID);
                        }
                    });
                }
            });
        });
    });
}

function leaveTeam(Team_ID, RollNo) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM Team_Member WHERE Team_ID = ? AND RollNo = ?`, [Team_ID, RollNo], (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else {
                getProjectID(Team_ID).then(Project_ID => {
                    resolve(Project_ID);
                });
            }
        });
    });
}

function getCourseID(Project_ID) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT Course_ID FROM project WHERE Project_ID = ?`, [Project_ID], (err, results) => {
            if (err) {
                console.error('Error querying group table:', err);
                reject(err);
            }
            else {
                resolve(results[0].Course_ID);
            }
        });
    });
}

function getNonTeamStudent(Project_ID) {
    return new Promise((resolve, reject) => {
        getCourseID(Project_ID).then(Course_ID => {
            const query = `SELECT e.RollNo,FName, LName from Enrollement e
        join student s on s.RollNo = e.RollNo
        where Course_ID = ${Course_ID}
        and e.RollNo not in (
        SELECT RollNo from Team_Member tm
        join Team t on t.id = tm.Team_ID
        where Project_ID = ${Project_ID});`
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error querying group table:', err);
                    reject(err);
                }

                else {
                    resolve(results);
                }
            });
        })
    });
}

module.exports = {
    canEdit,
    insertGroup,
    joinGroup,
    fetchgroups,
    viewTeams,
    leaveTeam, deleteTeam, getNonTeamStudent, getProjectID, getTeamID
}