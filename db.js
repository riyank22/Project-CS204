const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'project'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
});

// Close the database connection
// connection.end((err) => {
//     if (err) {
//         console.error('Error closing MySQL database connection:', err);
//         return;
//     }
//     console.log('MySQL database connection closed');
// });

module.exports = connection;