const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { fetchProjectStudent } = require('../../queries/projectQuery');
const { fetchProfileStudent } = require('../../queries/profile');

exports.fetchProfile = catchAsyncErrors(async (req, res) => {
    const { userID } = req;
    const output = await fetchProfileStudent(userID);
    if (output.status === 200) {
        return res.status(200).send(output);
    }
    else if (output.status === 404) {
        return res.status(400).send(output);
    }
    else {
        return res.status(500).send(output);
    }
});

exports.loadHomePage = catchAsyncErrors(async (req, res) => {
    const { userID } = req;

    const result = await fetchProjectStudent(userID);
    if (result.status === 500) {
        res.status(500).send("Internal Server Error");
    }
    else {
        res.status(200).send({ projects: result });
    }
})