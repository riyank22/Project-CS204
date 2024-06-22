const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { fetchProfileTeacher } = require('../../queries/profile');

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
    })