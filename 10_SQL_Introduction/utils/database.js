const mysql = require('mysql2');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: `academind_node_express_udemy_full`,
    password: "1_superPassword!"
});

module.exports = pool.promise();
