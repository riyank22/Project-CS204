const { inGroup } = require("../queries/groupQuery");

async function verifyGroup(userID, Project_ID, GID) {

    const output = await inGroup(Project_ID, userID);

    if (output.details !== undefined && output.details.GID != GID) {
        return { status: 403, message: "You are not in this group or group does not exists." };
    }

    return output;
}

module.exports = { verifyGroup };