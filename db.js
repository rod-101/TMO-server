import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.RENDER_HOST,
    user: process.env.RENDER_USER,
    password: process.env.RENDER_PASSWORD,
    port: parseInt(process.env.RENDER_PORT, 10),
    database: process.env.RENDER_DATABASE,
  });

  return connection;
}

const connection = await initDB(); // now dotenv is guaranteed loaded
export default connection;
