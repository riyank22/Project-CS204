const dbQuery = require("../db");
// const db = require("../db").connection;

async function authorizeUser(emailID, password) {
    const params = [emailID];
    const result1 = await dbQuery(`SELECT * FROM login WHERE emailID = ?`, params);

    if (result1.length === 1) {
        const params = [emailID, password];
        const result2 = await dbQuery(`SELECT * FROM login WHERE emailID = ? AND password = ?`, params);
        if (result2.length === 1) {
            result2[0].status = 200;
            return result2[0];
        }
        else {
            console.log(401)
            return { status: 401 };
        }
    }
    else {
        console.log(404)
        return { status: 404 };
    }
};


async function getUserID(emailID, userType) {
    if (userType === 's') {
        const params = [emailID]
        const result = await dbQuery(`SELECT userID from student join login on student.emailID = login.emailID where student.emailID = ?`, params);

        if (result.length === 1) {
            result[0].status = 200;
            return result[0];
        }
        else {
            console.log(404 + "User not found")
            return { status: 404 };
        }
    }

    else if (userType === 't') {
        const params = [emailID]
        const result = await dbQuery(`SELECT userID from teacher join login on teacher.emailID = login.emailID where teacher.emailID = ?`, params);
        if (result.length === 1) {
            result[0].status = 200;
            return result[0];
        }
        else {
            console.log(404 + "User not found")
            return { status: 404 };
        }
    }
    else {
        return { status: 400 };
    }
}

async function updatePassword(emailID, newPassword) {
    try {
        const params = [newPassword, emailID];
        await dbQuery(`UPDATE login SET password = ? WHERE emailID = ?`, params);
        return { status: 200 }
    }
    catch (err) {
        console.log(err)
        return { stack: 500 }
    }
}

module.exports = { authorizeUser, updatePassword, getUserID };