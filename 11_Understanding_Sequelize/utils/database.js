// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: `academind_node_express_udemy_full`,
//     password: "1_superPassword!"
// });

// module.exports = pool.promise();


//----------------------------------------------------------
const Sequelize = require('sequelize');

const sequelize = new Sequelize('academind_node_express_udemy', 'root', '1_superPassword!', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


module.exports = sequelize;