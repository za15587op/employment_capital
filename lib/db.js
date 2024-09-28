// import mysql from 'mysql2';

// // const pool = mysql.createPool({
// //     host: process.env.DB_HOST,
// //     user: process.env.DB_USER,
// //     password: process.env.DB_PASSWORD,
// //     database: process.env.DB_NAME,
// // });

// // const promisePool = pool.promise();

// const pool = mysql.createPool({
//     host: process.env.MYSQL_URI
// });

// const promisePool = pool.promise();

// export default promisePool;

//------------------------------------------------------------------------------------

// import mysql from 'mysql2';

// let pool = null;

// export function connect() {
//   return mysql.createPool({
//     host: process.env.DB_HOST, // TiDB host, for example: {gateway-region}.aws.tidbcloud.com
//     port: process.env.DB_PORT || 4000, // TiDB port, default: 4000
//     user: process.env.DB_USERNAME, // TiDB user, for example: {prefix}.root
//     password: process.env.DB_PASSWORD, // The password of TiDB user.
//     database: process.env.DB_DATABASE || 'employment_capital', // TiDB database name, default: test
//     ssl: {
//       minVersion: 'TLSv1.2',
//       rejectUnauthorized: true,
//     },
//     connectionLimit: 1, // Setting connectionLimit to "1" in a serverless function environment optimizes resource usage, reduces costs, ensures connection stability, and enables seamless scalability.
//     maxIdle: 1, // max idle connections, the default value is the same as `connectionLimit`
//     enableKeepAlive: true,
//   });
// }

// export function getPool() {
//   if (!pool) {
//     pool = createPool();
//   }
//   return pool;
// }

import mysql from 'mysql2';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true
    }
});

const promisePool = pool.promise();

export default promisePool;