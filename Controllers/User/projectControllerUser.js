const {prisma} = require("../../config/db");

exports.joinProject = async (req, res) => {
    const { user, project } = req;
    const userID = user.id;

    if(!project.entry){
        console.log("[INFO] Project does not allow for new entries of members." + project.id);
        return res.status(403).send({
            message: "Project does not allow new entries of members.",
            project: null,
            success: false
        });
    }

    try{

        if(project.owner_id === userID){
            console.log("[INFO] User is the owner of the project with id :" + project.id);
            return res.status(200).send({
                message: "Owner can not enroll in the same project",
                project: {
                    id: project.uuid,
                    name: project.name,
                    visibility: project.visibility,
                    entry: project.entry,
                    max_capacity: project.max_capacity,
                    min_capacity: project.min_capacity,
                    max_group: project.max_group,
                    deadline: project.deadline,
                    created_at: project.created_at,
                    updated_at: project.updated_at,
                    created_by: JSON.parse(project.created_by),
                },
                success: false
            });
        }

        const isAlreadyEnrolled = await prisma.project_enrollments.findFirst({
            where: {
                user_id: userID,
                project_id: project.id
            }
        });

        if(isAlreadyEnrolled){
            console.log("[INFO] User already enrolled in the project with id :" + project.id);
            return res.status(200).send({
                message: "User already enrolled in the project",
                project: {
                    id: project.uuid,
                    name: project.name,
                    visibility: project.visibility,
                    entry: project.entry,
                    max_capacity: project.max_capacity,
                    min_capacity: project.min_capacity,
                    max_group: project.max_group,
                    deadline: project.deadline,
                    created_at: project.created_at,
                    updated_at: project.updated_at,
                    created_by: JSON.parse(project.created_by),
                },
                success: false
            });
        }

        const enrollment = await prisma.project_enrollments.create({
            data: {
                user_id: userID,
                project_id: project.id
            }
        });

        if(!enrollment){
            console.log("[INFO] Unable to enroll user in the project with id :" + project.id);
            return res.status(500).send({
                message: "Internal Server Error: Unable to enroll in project",
                project: null,
                success: false
            });
        }

        console.log("[INFO] User enrolled in the project with id :" + project.id);
        return res.status(200).send({
            message: "User enrolled in the project successfully",
            project: {
                id: project.uuid,
                name: project.name,
                visibility: project.visibility,
                entry: project.entry,
                max_capacity: project.max_capacity,
                min_capacity: project.min_capacity,
                max_group: project.max_group,
                deadline: project.deadline,
                created_at: project.created_at,
                updated_at: project.updated_at,
                created_by: JSON.parse(project.created_by),
            },
            success: true
        });
        }
    catch (error){
        console.error("[ERROR] Error in adding to the project:", error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false
        });
    }
};

exports.getProjectDetails = async (req, res) => {
    const { Project_ID } = req.params;
    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }
    const result = await verifyUser(req, res, Project_ID);
    if (result.status === 200) {
        const output = await fetchProject(Project_ID);
        if (output.status === 200) {
            res.status(200).send(output);
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.status(result.status).send(result.message);
    }
};

exports.leaveProject = async (req, res) => {
    const { userID } = req;
    const { Project_ID } = req.params;

    const inProject = await verifyUser(req, res, Project_ID);

    if (inProject.status !== 200) {
        return res.status(inProject.status).send(inProject.message);
    }

    const result = await unenrollProject(userID, Project_ID);

    return res.status(result.status).send(result.message);
}