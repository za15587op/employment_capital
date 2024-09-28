import mysql from 'mysql2';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const promisePool = pool.promise();

// const pool = mysql.createPool({
//     host: process.env.MYSQL_URI
// });

// const promisePool = pool.promise();

export default promisePool;