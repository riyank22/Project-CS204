const dotenv = require('dotenv');
const express = require('express');
const {authenticateToken} = require("./Middlewares/jwtTokenVerifer");
const {verifyUser} = require("./Middlewares/verifyUser");

dotenv.config({path : "./env"})
const app = express();

app.use(express.json())

app.use('/api/auth', require('./Routes/authRoutes'));
app.use(authenticateToken);
app.use(verifyUser);
app.use('/api/User', require('./Routes/userRoutes'));
app.use('/api/project/o', require('./Routes/Owner/projectRouteOwner'));
app.use('/api/project/u', require('./Routes/User/projectRoutesUser'));
app.use('/', (req,res) => {
    res.status(200).send(`<h1> Welcome to groupify APIS </h1>`)
});

PORT = 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});