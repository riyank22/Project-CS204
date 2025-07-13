const {prisma} = require('../config/db');

exports.verifyProjectOwnership = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
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