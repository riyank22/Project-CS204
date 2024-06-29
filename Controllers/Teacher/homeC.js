const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { fetchProfileTeacher } = require('../../queries/profile');
const { fetchProjectTeacher } = require('../../queries/CourseQuery');

exports.fetchProfile = catchAsyncErrors( async (req ,res) => 
    {
        const { userID } = req;
        const output = await fetchProfileTeacher(userID);
        if(output.status === 200)
        {
            return res.status(200).send(output);
        }
        else
        {
            return res.status(500).send(output);
        }
    });

exports.loadHomePage = catchAsyncErrors( async (req, res) => {
    const { userID, userType } = req;

    const result = await fetchProjectTeacher(userID);
    if(result.status === 500)
    {
        res.status(500).send("Internal Server Error");
    }
    else
    {
        res.status(200).send({projects: result});
    }
})