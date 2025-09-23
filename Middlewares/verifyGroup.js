const {prisma} = require("../config/db")

exports.verifyGroup =  async (req,res,next) => {
    try {
        const groupUUID = req.params.group_UUID;

        if (!groupUUID) {
            console.log("Group UUID is missing");
            return res.status(400).send({ message: "Group UUID is required", success:false });
        }

        const group = await prisma.groups.findUnique({
            where: { uuid: groupUUID },
        });

        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }

        req.group = group;
        console.log("[INFO] Group details retried successfully:", groupUUID);
        next();
    } catch (error) {
        console.error("[ERROR] Error retrieving group details:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
}