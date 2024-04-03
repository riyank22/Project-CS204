const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

const app = express()

dotenv.config({path : "./env"})

const publicDirectory = path.join(__dirname,'/public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extneded: false}));
app.use(express.json());

app.set('view engine','hbs');

app.use('/', require('./Routes/pages'));
app.use('/auth', require('./Routes/auth'))

PORT = 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});