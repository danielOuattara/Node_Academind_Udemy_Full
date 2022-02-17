const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PSWD
})

module.exports = pool.promise()