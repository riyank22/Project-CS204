//Verfiiy the User if he is a teacher or student as well as he is in the project or not.
const { prisma } = require("../config/db");

exports.verifyUser = async (req, res, next) => {

    const user = await prisma.users.findUnique(
        {where : {id: req.userId}}
    )

    if(!user) {
        return res.status(404).send({message: "User not found"});
    }

    req.user = user;
    next()
}