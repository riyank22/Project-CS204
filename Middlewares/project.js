const {prisma} = require('../config/db');

exports.verifyProject = async (req, res, next) => {
    try {
        const projectId = req.params.project_ID;

        if (!projectId) {
            return res.status(400).send({ message: "Project ID is required", success:false });
        }

        const project = await prisma.projects.findUnique({
            where: { uuid: projectId },
        });

        if (!project) {
            return res.status(404).send({ message: "Project not found" });
        }

        req.project = project;
        console.log("[INFO] Project details retried successfully:", projectId);
        next();
    } catch (error) {
        console.error("[ERROR] Error retrieving project details:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
}

exports.verifyProjectOwnership = async (req, res, next) => {
    try {
        const projectId = req.params.project_ID;
        const userId = req.user.id;

        if (!projectId) {
            return res.status(400).send({ message: "Project ID is required", success:false });
        }

        const project = await prisma.projects.findUnique({
            where: { uuid: projectId },
        });

        if (!project) {
            return res.status(404).send({ message: "Project not found" });
        }

        if (project.owner_id !== userId) {
            return res.status(403).send({ message: "You do not have permission to access this project" });
        }

        req.project = project;
        console.log("[INFO] Project ownership verified for project ID:", projectId);
        next();
    } catch (error) {
        console.error("[ERROR] Error verifying project ownership:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
}

exports.verifyProjectEnrollment  = async (req, res, next) => {
    try {
        const projectID = req.project.id;
        const userId = req.user.id;

        const enrollment = await prisma.project_enrollments.findUnique({
            where:{
                user_id_project_id:{
                    project_id:projectID,
                    user_id:userId,
                }
            }
        });

        if (!enrollment) {
            return res.status(403).send({ message: "You are not enrolled in this project" });
        }

        console.log("[INFO] Project enrollment verified for project ID:", projectID);
        next();
    } catch (error) {
        console.error("[ERROR] Error verifying project enrollment:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
}