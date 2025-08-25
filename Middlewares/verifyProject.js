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