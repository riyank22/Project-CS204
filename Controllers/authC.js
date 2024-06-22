const catchAsyncErrors = require('../Middlewares/catchAsyncErrors');
const { authorizeUser, updatePassword, getUserID } = require('../queries/authQuery');
const { generateToken } = require('../utils/jwt');

exports.loginController = catchAsyncErrors(async (req, res) => {
    const { emailID, password } = req.body;

    if (emailID == undefined || password == undefined) {
        return res.status(400).send("Bad Request");
    }

    const result1 = await authorizeUser(emailID, password)

    if (result1.status === 200) {

        const result2 = await getUserID(result1.emailID, result1.userType);

        const token = generateToken(result1.emailID, result1.userType, result2.userID);
        if (token !== 500) {
            res.cookie('token', token, { httpOnly: true });
            if (result1.userType === 's') {
                return res.status(200).send("Student Logged In")
            }
            else if (result1.userType === 't') {

                return res.status(200).send("Teacher Login")
            }
            else
            {
                return res.status(500).send("Invalid User Type")
            }
        }
    }

    return res.status(result1.status).send(result1);
})

exports.logoutController = (req,res) => {
    res.clearCookie('token');
    res.status(200).send("You are logged Out");
}

exports.changePasswordController = catchAsyncErrors(async(req, res) =>{

    const {oldPassword, newPassword} = req.body;
    if(oldPassword == undefined || newPassword == undefined)
    {
        return res.status(400).send("Old Password and New Password are required");
    }

    if(oldPassword === newPassword)
    {
        return res.status(400).send("Old Password and New Password cannot be same");
    }

    const isOldPasswordValid = await authorizeUser(req.emailID, oldPassword);

    if(isOldPasswordValid.status !== 200)
    {
        return res.status(isOldPasswordValid.status).send("Error changing Password");
    }
    
    const result = await updatePassword(req.emailID, req.body.newPassword);
    if(result.status = 200){
        res.status(200).send("Password Changed Successfullt")
    }
    else{
        res.status(500).send("Password changed failed, try again later")
    }
}) 