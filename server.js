import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.post("/api/change-password", async (req, res) => {
  const [rows] = await db.query(
    "UPDATE admins SET password = 'adminNewPass' WHERE username = 'admin'",
  );
  console.log("password was changed.");
});

//Login route for admin
app.post("/api/admin-login", async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password],
  );

  const admin = rows[0];

  if (!admin) {
    return res
      .status(401)
      .json({ message: "Invalid username", success: false });
  }

  // compare password
  if (admin.password !== password) {
    return res
      .status(401)
      .json({ message: "Invalid password", success: false });
  }

  res.json({
    success: true,
    message: "Login successful",
    username: admin.username,
  });
});
