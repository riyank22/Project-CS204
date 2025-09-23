const {prisma} = require("../../config/db")

exports.createGroup = async (req, res) => {
    try
    {
        const { user, project } = req;
        if(!req.body)
        {
            return res.status(400).send({
                message: "Request body is missing",
                success: false
            });
        }
        const { groupName } = req.body;

        if(!groupName || groupName.trim() === "")
        {
            return res.status(400).send({
                message: "Group name is required",
                success: false
            })
        }

        // validating the user does not exist in some other group

        const userId = user.id;

        const existGroup = await prisma.groups.findFirst(
            {where: { project_id: project.id, owner_id: userId}}
        )

        if(existGroup)
        {
            return res.status(409).send({
                message: "User already owns a group in this project",
                success: false,
                group: existGroup
            });
        }

        const inGroup = await prisma.group_members.findFirst(
            {where : {project_id: project.id, user_id: userId}}
        )

        if(inGroup)
        {
            return res.status(409).send({
                message: "User already in a group in this project",
                success: false,
                group: inGroup
            });
        }

        //checking for duplication in group name
        const duplicateGroup = await prisma.groups.findFirst(
            {where: { project_id: project.id, name: groupName}}
        )

        if(duplicateGroup)
        {
            return res.status(409).send({
                message: "Group name already exists in this project",
                success: false,
                group: null
            });
        }

        //finally creating the group

        const newGroup = await prisma.groups.create(
            {
                data: {
                    name: groupName,
                    project_id: project.id,
                    owner_id: userId,
                    created_by: JSON.stringify({
                        name: user.name,
                        email: user.email,
                        id: user.id
                    })
                }
            }
        )

        if(!newGroup)
        {
            return res.status(500).send({
                message: "Internal Server Error: Unable to create group",
                success: false,
                group: null
            });
        }

        // adding the owner to the group members
        const addOwnerToGroup = await prisma.group_members.create(
            {
                data: {
                    group_id: newGroup.id,
                    user_id: userId,
                    project_id: project.id,
                }
            }
        )

        if(!addOwnerToGroup)
        {
            await prisma.groups.delete(
                {where: {id: newGroup.id}}
            )
            return res.status(500).send({
                message: "Internal Server Error: Unable to add owner to group",
                success: false,
                group: null
            });
        }

        return res.status(201).send({
            message: "Group created successfully",
            success: true,
            group: newGroup
        });
    }
    catch (e)
    {
        console.error("[ERROR] Error in createGroup:", e);
        return res.status(500).send({
            message: "Internal Server Error",
            success: false
        });
    }
};

exports.getGroupDetails = async (req, res) => {
    try
    {
        const {project, group} = req;

        const groupMembers = await prisma.group_members.findMany({
            where: {group_id: group.id}
        })

        if(!groupMembers)
        {
            return res.status(404).send({
                message: "No members found in this group",
                success: false,
                group: group,
                members: []
            });
        }

        return res.status(200).send({
            message: "Group details fetched successfully",
            success: true,
            group: group,
            members: groupMembers,
            leader: group.owner_id,
            projectName: project.name
        })
    }
    catch (e)
    {
        console.error("[ERROR] Error in getGroupDetails:", e);
        return res.status(500).send({
            message: "Internal Server Error",
            success: false
        })
    }
};

// exports.leaveGroupC = async (req, res) => {
//     const { Project_ID } = req.params;
//     const { userID } = req;
//     const { GID } = req.params;
//
//     let result = await verifyUser(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyDate(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyGroup(userID, Project_ID, GID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     const output = await leavegroup(GID, userID, result.details.Role);
//
//     return res.status(output.status).send(output.message);
// };
//
// exports.renameGroupC = async (req, res) => {
//     const { Project_ID } = req.params;
//     const { userID } = req;
//     const { GID } = req.params;
//     const { oldGroupName, newGroupName } = req.body;
//
//     if (oldGroupName === undefined || newGroupName === undefined) {
//         return res.status(400).send('Please provide both old and new group names');
//     }
//
//     if (oldGroupName === newGroupName) {
//         return res.status(400).send('Old and new group names cannot be the same');
//     }
//
//     let result = await verifyUser(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyDate(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyGroup(userID, Project_ID, GID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     if (result.details.Role !== 'L') {
//         return res.status(403).send('You are not authorized to rename the group');
//     }
//
//     const output = await renameGroup(Project_ID, oldGroupName, newGroupName);
//
//
//     return res.status(output.status).send(output.message);
// };
//
// exports.removeMember = async (req, res) => {
//     const { Project_ID } = req.params;
//     const { userID } = req;
//     const { GID } = req.params;
//     const { removeUserID } = req.body;
//
//     if (removeUserID === undefined) {
//         return res.status(400).send('Please provide the User ID to remove');
//     }
//
//     if (removeUserID === userID) {
//         return res.status(400).send('You cannot remove yourself from the group');
//     }
//
//     let result = await verifyUser(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyDate(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyGroup(userID, Project_ID, GID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     if (result.details.Role !== 'L') {
//         return res.status(403).send('You are not authorized to remove a member in the group');
//     }
//
//     result = await verifyGroup(removeUserID, Project_ID, GID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send("The User you are trying to remove is not a part of the groups");
//     }
//
//     const output = await removeGroupMember(GID, removeUserID);
//
//     return res.status(output.status).send(output.message);
// };
//
// exports.changeLeaderC = async (req, res) => {
//     const { Project_ID } = req.params;
//     const { userID } = req;
//     const { GID } = req.params;
//     const { newLeaderID } = req.body;
//
//     if (newLeaderID === undefined) {
//         return res.status(400).send('Please provide new Leader ID.');
//     }
//
//     if (newLeaderID === userID) {
//         return res.status(400).send('New Leader ID and old Leader ID cannot be the same');
//     }
//
//     let result = await verifyUser(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyDate(req, res, Project_ID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     result = await verifyGroup(userID, Project_ID, GID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send(result.message);
//     }
//
//     if (result.details.Role !== 'L') {
//         return res.status(403).send('You are not authorized to change Lead of the group');
//     }
//
//     result = await verifyGroup(newLeaderID, Project_ID, GID);
//
//     if (result.status !== 200) {
//         return res.status(result.status).send("The User you are trying to make the leader is not a part of the groups");
//     }
//
//     const output = await changeLeader(GID, userID, newLeaderID);
//
//     return res.status(output.status).send(output.message);
// };