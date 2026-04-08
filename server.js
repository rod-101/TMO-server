import express from "express";
import cors from "cors";
import { client } from "./db.js";

const app = express();
app.use(express.json());
// const PORT = process.env.LOCALPORT;
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.post("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.post("/api/change-password", async (req, res) => {
  const [rows] = await client.query(
    "UPDATE admins SET password = 'adminNewPass' WHERE username = 'admin'",
  );
  console.log("password was changed.");
});

//Login route for admin
app.post("/api/admin-login", async (req, res) => {
  const { username, password } = req.body;

  const result = await client.query(
    "SELECT * FROM admins WHERE username = $1 AND password = $2",
    [username, password],
  );

  const admin = result.rows[0];

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

app.post("/tickets", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM tickets ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const updatedRecord = req.body;
  try {
    await client.query(
      `UPDATE tickets SET ticket_id=$1, name=$2, type=$3, date=$4, total=$5, status=$6, plate=$7 WHERE id=$8`,
      [
        updatedRecord.ticket_id,
        updatedRecord.name,
        updatedRecord.type,
        updatedRecord.date,
        updatedRecord.total,
        updatedRecord.status,
        updatedRecord.plate,

        id,
      ],
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database update failed" });
  }
});

//dashboard chart api
// Fix: truncate timestamp to day for proper grouping
app.get("/dashboard-violations-trend", async (req, res) => {
  try {
    const daily = await client.query(`
      SELECT 
        DATE_TRUNC('day', date) AS day,
        COUNT(*) AS violations
      FROM tickets
      GROUP BY DATE_TRUNC('day', date)
      ORDER BY day ASC
    `);

    const weekly = await client.query(`
      SELECT 
        DATE_TRUNC('week', date) AS week,
        COUNT(*) AS violations
      FROM tickets
      GROUP BY DATE_TRUNC('week', date)
      ORDER BY week ASC
    `);

    res.json({
      daily: daily.rows.map((r) => ({
        day: r.day,
        violations: Number(r.violations),
      })),
      weekly: weekly.rows.map((r) => ({
        week: r.week,
        violations: Number(r.violations),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Stats endpoint (if not already correct)
app.get("/dashboard-stats", async (req, res) => {
  try {
    const issued = await client.query(`SELECT COUNT(*) FROM tickets`);

    const unresolved = await client.query(`
      SELECT COUNT(*) FROM tickets WHERE LOWER(status) = 'unresolved'
    `);

    const newTickets = await client.query(`
      SELECT COUNT(*) FROM tickets 
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    `);

    console.log("Issued:", issued.rows[0].count);
    console.log("Unresolved:", unresolved.rows[0].count);
    console.log("New:", newTickets.rows[0].count);

    res.json({
      issued: Number(issued.rows[0].count),
      unresolved: Number(unresolved.rows[0].count),
      new: Number(newTickets.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
