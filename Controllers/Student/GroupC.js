const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { verifyDate } = require('../../Middlewares/verifyDate');
const { verifyUser } = require('../../Middlewares/verifyUser');
const { insertGroup, joinGroup } = require('../../queries/groupQuery');

exports.createGroup = catchAsyncErrors(async (req, res) => {
    const { Project_ID } = req.params;
    const { userID } = req;
    const {groupName} = req.body;

    let result = await verifyUser(req, res, Project_ID);

    if(result.status !== 200)
    {
        return res.status(result.status).send(result.message);
    }

    result = await verifyDate(Project_ID);

    if(result.status !== 200)
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

    console.log(req.params);

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

    const output = await joinGroup(Project_ID, GID, userID);
        
    return res.status(output.status).send(output.message);
});
