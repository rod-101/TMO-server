import mysql from "mysql2/promise"; // Use the promise-based version of mysql2
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const connection = await mysql.createConnection({
  host: "localhost", // mysql host
  user: "root", // mysql username
  password: "mysqlPass", // mysql password
  database: "tmo_system", //database name
});

export default connection; // Export the connection for use in other files
