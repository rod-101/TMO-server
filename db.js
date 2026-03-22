import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: parseInt(process.env.MYSQLPORT, 10),
    database: process.env.MYSQLDATABASE,
  });

  return connection;
}

const connection = await initDB(); // now dotenv is guaranteed loaded
export default connection;
