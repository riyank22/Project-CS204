const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { fetchProfileStudent } = require('../../queries/profile');

exports.fetchProfile = catchAsyncErrors( async (req ,res) => 
    {
        const { userID } = req;
        const output = await fetchProfileStudent(userID);
        if(output.status === 200)
        {
            return res.status(200).send(output);
        }
        else if(output.status === 404)
        {
            return res.status(400).send(output);
        }
        else
        {
            return res.status(500).send(output);
        }
    })