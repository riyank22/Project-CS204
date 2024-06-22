const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// // Create a connection to the MySQL database
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '1234',
//     database: 'project'
// });

// async function query (query)
// {
//     try{
//         const result = await connection.query(query);
//         return result;
//     }
//     catch (error)
//     {
//         console.log("error quering database\n" + error);
//     }
// }

// Close the database connection
// connection.end((err) => {
//     if (err) {
//         console.error('Error closing MySQL database connection:', err);
//         return;
//     }
//     console.log('MySQL database connection closed');
// });

async function queryDatabase(queryString, params) {
    let connection;
    try {
      // Get a connection from the pool
      connection = await pool.getConnection();
  
      // Execute the query with parameters
      const [rows, fields] = await connection.execute(queryString, params);
  
      // Return the query results
      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      return {status:500}
    } finally {
      // Release the connection back to the pool
      if (connection) {
        connection.release();
      }
    }
  }

module.exports = queryDatabase;