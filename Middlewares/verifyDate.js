const { canEdit } = require("../queries/groupQuery");

async function verifyDate(req, res, Project_ID) {

    let output;
    if (req.userType === 't') {
        res.status(403).send("You are a teacher, you can't join a group.");
    }
    else {
        output = await canEdit(Project_ID);
        if (output.status === 200) {
            return { status: 200 };
        }
    }

    return output;
}

module.exports = { verifyDate };