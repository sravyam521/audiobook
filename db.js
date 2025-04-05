
require('dotenv').config(); // Load environment variables from the Render environment
const mysql = require('mysql2');

const pool = mysql.createPool({
    uri: process.env.MYSQL_URL,
    host: process.env.MYSQLHOST,       // Host from Render
    user: 'avnadmin',                      // User is usually 'root' for MySQL
    password: process.env.MYSQLPASSWORD, // Password from Render
    database: process.env.MYSQLDATABASE, // Database name from Render
    port: 13395                     // Default MySQL port
});

module.exports = pool.promise();


