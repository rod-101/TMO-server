import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT, 10),
    database: process.env.MYSQL_DATABASE,
  });

  return connection;
}

const connection = await initDB(); // now dotenv is guaranteed loaded
export default connection;
