// import mysql from "mysql2/promise";
import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";
dotenv.config();

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

await client.connect();

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
