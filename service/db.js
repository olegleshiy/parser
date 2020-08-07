const { Client } = require('pg');

const conn = new Client({
    host: process.env.DB_HOST_PG,
    user: process.env.DB_USER_PG,
    password: process.env.DB_PASS_PG,
    database: process.env.DB_NAME_PG,
    port: 5432,
});

// const mysql = require('mysql');
//
// const conn = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
// });

module.exports = conn;
