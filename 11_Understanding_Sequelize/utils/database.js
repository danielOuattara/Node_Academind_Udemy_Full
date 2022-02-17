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

const sequelize = new Sequelize(
    process.env.DATABASE, 
    process.env.USER, 
    process.env.PSWD, 
    {
        dialect: 'mysql',
        host: 'localhost',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
});


module.exports = sequelize;