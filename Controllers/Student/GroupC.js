const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { verifyDate } = require('../../Middlewares/verifyDate');
const { verifyGroup } = require('../../Middlewares/verifyGroup');
const { verifyUser } = require('../../Middlewares/verifyUser');
const { insertGroup, joinGroup, leavegroup } = require('../../queries/groupQuery');

exports.createGroup = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const {groupName} = req.body;

    let result = await verifyUser(req, res, Project_ID);

    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req,res,Project_ID);

    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }

    result = await inGroup(Project_ID, userID);

    if(result.status === 200)
    {
        return res.status(result.status).send(result.message);
    }

    const output = await insertGroup(Project_ID, groupName, userID);
        
    return res.status(output.status).send(output.message);
  
});

exports.joinGroupC = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const {GID} = req.params;

    let result = await verifyUser(req, res, Project_ID);

    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(req, res, Project_ID);

    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }

    result = await inGroup(Project_ID, userID);

    if(result.status === 200)
    {
        return res.status(result.status).send(result.message);
    }

    const output = await joinGroup(Project_ID, GID, userID);
        
    return res.status(output.status).send(output.message);
});

exports.leaveGroupC = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const {GID} = req.params;

    let result = await verifyUser(req, res, Project_ID);

    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }
    
    result = await verifyDate(req, res, Project_ID);
    
    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }

    result = await verifyGroup(req,res,Project_ID, userID, GID);

    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }
    console.log(result);

    const output = await leavegroup(GID, userID, result.details.Role);
        
    return res.status(output.status).send(output.message);
});