const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

dotenv.config({path : "./env"})

const publicDirectory = path.join(__dirname,'/public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extneded: false}));
app.use(express.json());

app.set('view engine','hbs');

app.use('/', require('./Routes/common'));
app.use('/auth', require('./Routes/auth'));
app.use('/t', require('./Routes/Teacher'));
app.use('/s', require('./Routes/Student'));

PORT = 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});