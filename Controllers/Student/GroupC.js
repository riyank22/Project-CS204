const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { verifyDate } = require('../../Middlewares/verifyDate');
const { verifyGroup } = require('../../Middlewares/verifyGroup');
const { verifyUser } = require('../../Middlewares/verifyUser');
const { insertGroup, joinGroup, leavegroup, renameGroup, removeGroupMember, changeLeader } = require('../../queries/groupQuery');

exports.createGroup = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const { groupName } = req.body;

    let result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyGroup(Project_ID, userID);

    if (result.status === 200) {
        return res.status(result.status).send(result.message);
    }

    const output = await insertGroup(Project_ID, groupName, userID);

    return res.status(output.status).send(output.message);

});

exports.joinGroupC = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const { GID } = req.params;

    let result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req, res, Project_ID);

    if (result.status != 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyGroup(Project_ID, userID, GID);

    if (result.status === 200) {
        return res.status(result.status).send(result.message);
    }

    const output = await joinGroup(Project_ID, GID, userID);

    return res.status(output.status).send(output.message);
});

exports.leaveGroupC = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const { GID } = req.params;

    let result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyGroup(userID, Project_ID, GID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    const output = await leavegroup(GID, userID, result.details.Role);

    return res.status(output.status).send(output.message);
});

exports.renameGroupC = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const { GID } = req.params;
    const { oldGroupName, newGroupName } = req.body;

    if (oldGroupName === undefined || newGroupName === undefined) {
        return res.status(400).send('Please provide both old and new group names');
    }

    if (oldGroupName === newGroupName) {
        return res.status(400).send('Old and new group names cannot be the same');
    }

    let result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyGroup(userID, Project_ID, GID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    if (result.details.Role !== 'L') {
        return res.status(403).send('You are not authorized to rename the group');
    }

    const output = await renameGroup(Project_ID, oldGroupName, newGroupName);


    return res.status(output.status).send(output.message);
});

exports.removeMember = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const { GID } = req.params;
    const { removeUserID } = req.body;

    if (removeUserID === undefined) {
        return res.status(400).send('Please provide the user ID to remove');
    }

    if (removeUserID === userID) {
        return res.status(400).send('You cannot remove yourself from the group');
    }

    let result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyGroup(userID, Project_ID, GID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    if (result.details.Role !== 'L') {
        return res.status(403).send('You are not authorized to remove a member in the group');
    }

    result = await verifyGroup(removeUserID, Project_ID, GID);

    if (result.status !== 200) {
        return res.status(result.status).send("The user you are trying to remove is not a part of the groups");
    }

    const output = await removeGroupMember(GID, removeUserID);

    return res.status(output.status).send(output.message);
});

exports.changeLeaderC = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const { GID } = req.params;
    const { newLeaderID } = req.body;

    if (newLeaderID === undefined) {
        return res.status(400).send('Please provide new Leader ID.');
    }

    if (newLeaderID === userID) {
        return res.status(400).send('New Leader ID and old Leader ID cannot be the same');
    }

    let result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req, res, Project_ID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    result = await verifyGroup(userID, Project_ID, GID);

    if (result.status !== 200) {
        return res.status(result.status).send(result.message);
    }

    if (result.details.Role !== 'L') {
        return res.status(403).send('You are not authorized to change Lead of the group');
    }

    result = await verifyGroup(newLeaderID, Project_ID, GID);

    if (result.status !== 200) {
        return res.status(result.status).send("The user you are trying to make the leader is not a part of the groups");
    }

    const output = await changeLeader(GID, userID, newLeaderID);

    return res.status(output.status).send(output.message);
});