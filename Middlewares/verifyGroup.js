const { inGroup } = require("../queries/groupQuery");

async function verifyGroup(req, res, Project_ID, GID) {

    let output;
    if (req.userType === 't') {
        return res.status(403).send("You are a teacher, you can't deal with group.");
    }
    else {
        output = await inGroup(Project_ID, req.userID);
    }

    if(output.details.GID !== GID) {
        return res.status(403).send("You are not in this group or group does not exists.");
    }

    return output;
}

module.exports = { verifyGroup };