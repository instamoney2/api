const mysql = require('mysql');
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: '',
    database: process.env.database
})

module.exports = connection;