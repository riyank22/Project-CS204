const e = require("express");
const dbQuery = require("../db");

async function canEditAfterDeadline(Project_ID) {
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

async function inGroup(Project_ID, Student_ID) {
    const result = await dbQuery(`SELECT * FROM group_member WHERE Project_ID = ? AND Student_ID  = ?`, [Project_ID, Student_ID]);

    if (result.length > 0)
        return { status: 200, message: "Already in a group", details: result[0] };
    else
        return { status: 404, message: "Not in a group" };

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

async function joinGroup(Project_ID, GID, Student_ID) {

    const group = await dbQuery(`SELECT Capacity_Left FROM \`group\` WHERE Project_ID = ? AND GID = ?`, [Project_ID, GID]);

    if (group.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    if (group.lenght === 0) {
        return { status: 404, message: "Group Not Found or is not assciated with this project" };
    }

    console.log(group.length === 0)

    if (group[0].Capacity_Left === 0) {
        return { status: 403, message: "Group is full" };
    }

    const output = await dbQuery(`INSERT INTO group_member (Project_ID, GID, Student_ID, Role, Joining_Time) VALUES (?, ?, ?, 'M', ?)`, [Project_ID, GID, Student_ID, new Date()]);

    if (output.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, message: "Joined Group Successfully" };
};

async function fetchgroups(Project_ID, GID) {
    let result;
    if (GID === undefined) {
        result = await dbQuery(`SELECT * FROM group_with_groupmembers WHERE Project_ID = ?`, [Project_ID]);
    }
    else {
        result = await dbQuery(`SELECT * FROM group_with_groupmembers WHERE Project_ID = ? and GID = ?`, [Project_ID, GID]);
    }

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    let groups = [];
    let currentGroup = {};
    let currentGID = null

    for (const obj of result) {
        const member = { FName: obj.FName, LName: obj.LName, Student_ID: obj.Student_ID, Role: obj.Role }
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

async function leavegroup(GID, Student_ID, Role) {
    if (Role === 'M') {
        const result = await dbQuery(`DELETE FROM group_member WHERE GID = ? AND Student_ID = ?`, [GID, Student_ID]);
        if (result.status === 500) {
            return { status: 500, message: "Internal Server Error" };
        }
        return { status: 200, message: "Left Group Successfully" };
    }
    else if (Role === 'L') {
        const result = await dbQuery(`DELETE FROM group_member WHERE GID = ?`, [GID]);
        if (result.status === 500) {
            return { status: 500, message: "Internal Server Error" };
        }
        const result2 = await dbQuery(`DELETE FROM \`group\` WHERE GID = ?`, [GID]);
        if (result2.status === 500) {
            return { status: 500, message: "Internal Server Error" };
        }
        return { status: 200, message: "Left Group Successfully" };
    }
}

async function renameGroup(Project_ID, oldGroupName, newGroupName) {
    console.log(Project_ID, oldGroupName, newGroupName);
    let result = await dbQuery(`SELECT GID FROM \`group\` WHERE Project_ID = ? AND Group_Name = ?`, [Project_ID, oldGroupName]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    console.log(result);

    if (result.length === 0) {
        return { status: 404, message: "Group Not Found" };
    }

    const gid = result[0].GID;

    result = await dbQuery(`SELECT * FROM \`group\` WHERE Project_ID = ? AND Group_Name = ?`, [Project_ID, newGroupName]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    if (result.length !== 0) {
        return { status: 409, message: "Group Name already exists, change Group Name." };
    }

    result = await dbQuery(`UPDATE \`group\` SET Group_Name = ? WHERE GID = ?`, [newGroupName, gid]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, message: "Group Renamed Successfully" };
}

async function removeGroupMember(GID, Student_ID) {
    const result = await dbQuery(`DELETE FROM group_member WHERE GID = ? AND Student_ID = ?`, [GID, Student_ID]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, message: "Member Removed Successfully" };
}

async function changeLeader(GID, oldLeaderID, newLeaderID) {
    const result = await dbQuery(`UPDATE group_member SET Role = 'M' WHERE GID = ? AND Student_ID = ?`, [GID, oldLeaderID]);
    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    const result2 = await dbQuery(`UPDATE group_member SET Role = 'L' WHERE GID = ? AND Student_ID = ?`, [GID, newLeaderID]);

    if (result2.status === 500) {
        await dbQuery(`UPDATE group_member SET Role = 'L' WHERE GID = ? AND Student_ID = ?`, [GID, oldLeaderID]);
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, message: "Leader Changed Successfully" };
}

async function getGroupInfo(Project_ID, Group_ID) {
    const result = await fetchgroups(Project_ID, Group_ID);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, group: result.groups[0] };
}

async function getNonGroupStudent(Project_ID) {
    const result = await dbQuery(`SELECT s.Fname, s.LName, s.userID from enrollement e join student s on s.userID= e.Student_ID
    where Project_ID= ? and e.Student_ID not in ( SELECT Student_ID from group_member gm join \`group\` g on g.GID = gm.GID where g.Project_ID = ?)`, [Project_ID, Project_ID]);

    if (result.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, students: result };

}

async function getVacantGroups(Project_ID) {
    const groups = await dbQuery(`SELECT GID, Group_Name, Capacity_Left FROM \`group\` WHERE Project_ID = ? and Capacity_Left <> 0`, [Project_ID]);

    if (groups.status === 500) {
        return { status: 500, message: "Internal Server Error" };
    }

    return { status: 200, groups: groups };
};

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

module.exports = {
    canEditAfterDeadline,
    insertGroup,
    joinGroup,
    fetchgroups,
    inGroup,
    leavegroup,
    renameGroup,
    removeGroupMember,
    changeLeader,
    getGroupInfo,
    getNonGroupStudent,
    getVacantGroups,
    deleteTeam
}