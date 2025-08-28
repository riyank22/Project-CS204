const {prisma} = require("../config/db")

exports.getProjectDetails = async (req, res) => {
    try {
        const project = req.project;

        console.log("[INFO] Project details for project ID:", project.id);

        res.status(200).send({
            message: "Project details fetched successfully",
            success: true,
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
        });
    }
    catch (error) {
        console.log("[ERROR] Fetching project details for project ID:", error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false
        });
    }
};

exports.getEnrolledUsers = async (req, res) => {
    const { project } = req;

    try {
        const users = await prisma.project_enrollments.findMany({
            where: {project_id: project.id}
        });
        if (!users) {
            console.log("[INFO] No users enrolled in the project with project ID:",project.id);
            return res.status(200).send({
                message: "No users enrolled in this project",
                success: true,
                users: []
            });
        }
        console.log("[INFO] Fetched", users.length, "enrolled users for project ID:",project.id);
        return res.status(200).send({
            message: "Enrolled users fetched successfully",
            success: true,
            users: users
        });
    }
    catch (error) {
        console.log("[ERROR] Fetching enrolled users of the project with project ID:",project.id +" " + error);
        res.status(500).send({
            message: "Internal Server Error",
            success: false
        });
    }
}

exports.getGroups = async (req, res) => {
    const { Project_ID } = req.params;

    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const groups = await fetchgroups(Project_ID)

    if (groups.status === 200) {
        return res.status(200).send(groups.groups);
    }
    else {
        return res.status(groups.status).send(groups.message);
    }
}

exports.fetchGroupDetails = async (req, res) => {
    const { Project_ID, GID } = req.params;

    if (Project_ID === undefined || GID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const group = await getGroupInfo(Project_ID, GID)

    if (group.status === 200) {
        return res.status(200).send(group.group);
    }
    else {
        return res.status(group.status).send(group.message);
    }
};

exports.fetchNonGroupStudents = async (req, res) => {
    const { Project_ID } = req.params;

    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const students = await getNonGroupStudent(Project_ID)

    if (students.status !== 200) {
        return res.status(students.status).send(students.message);
    }

    return res.status(students.status).send(students.students);
};

exports.fetchVacantGroups = async (req, res) => {
    const { Project_ID } = req.params;

    if (Project_ID === undefined) {
        res.status(400).send("Bad Request");
    }

    const result = await verifyUser(req, res, Project_ID);

    if (result.status !== 200) {
        res.status(result.status).send(res.message);
    }

    const groups = await getVacantGroups(Project_ID)

    if (groups.status !== 200) {
        return res.status(groups.status).send(groups.message);
    }

    return res.status(200).send(groups.groups);
};