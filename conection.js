const mysql = require('mysql');
require("dotenv").config();

const connection = mysql.createConnection(process.env.DATABASE_URL)

module.exports = connection;
