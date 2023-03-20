const mysql = require('mysql');
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.PLANETSCALE_DB_HOST,
    user: process.env.PLANETSCALE_DB_USERNAME,
    password: process.env.PLANETSCALE_DB_PASSWORD,
    database: process.env.PLANETSCALE_DB
})

module.exports = connection;
