const {prisma} = require('../config/db');

exports.getUserDetailsController = async (req, res) => {
    try {
        console.log("[DEBUG] Fetching user details for email:", req.user.id);
        const userDetails = {
            email: req.user.email,
            name: req.user.name,
            createdAt: req.user.created_at,
        }
        return res.status(200).send({ message: "User details retrieved successfully", success: true, userDetails});
    } catch (error) {
        console.error("[WARNING] Error retrieving user details:", error);
        return res.status(500).send({ message: error.message, success: false });
    }
}

exports.updateUserDetails = async (req, res) => {
    try{
        console.log("[DEBUG] Updating user details for email:", req.user.email);
        if(!req.body) {
            return res.status(400).send({message: "Request is Broken, No Body", success: false});
        }

        let {name} = req.body;
        console.log(name)

        let update = false;

        if(!name) {
           name = req.user.name;
        }
        else
        {
            update = true;
        }

        if(update)
        {
            console.log("[DEBUG] Updating user name to:", name);
            await prisma.users.update({
                where: {
                    email: req.user.email
                },
                data: {
                    name: name || req.user.name, // Use existing name if not provided
                }},
            )
        }

        return res.status(200).send({ message: "User details updated successfully", success: true });

    }
    catch (error) {
        console.error("[WARNING] Error updating user details:", error);
        return res.status(500).send({ message: error.message, success: false });
    }
}