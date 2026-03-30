// import mysql from "mysql2/promise";
import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";
dotenv.config();

// export async function initDB() {
//   const connection = await mysql.createConnection({
//     host: process.env.LOCALHOST,
//     user: process.env.LOCALUSERNAME,
//     password: "",
//     port: parseInt(process.env.LOCALPORT, 10),
//     database: process.env.LOCALDATABASE,
//   });

//   return connection;
// }

export const client = new Client({
  host: process.env.RENDER_HOST,
  user: process.env.RENDER_USER,
  password: process.env.RENDER_PASSWORD,
  database: process.env.RENDER_DATABASE,
  port: parseInt(process.env.PORT, 10),
  ssl: {
    rejectUnauthorized: false,
  },
});
