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

app.get("/dashboard-stats", async (req, res) => {
  try {
    const issuedTickets = await client.query("SELECT COUNT(*) FROM tickets");

    const unresolvedTickets = await client.query(
      "SELECT COUNT(*) FROM tickets WHERE status = 'unresolved'",
    );

    const newTickets = await client.query(
      "SELECT COUNT(*) FROM tickets WHERE date = CURRENT_DATE",
    );

    const motorcycles = await client.query(
      "SELECT COUNT(*) FROM tickets WHERE vehicle_type = 'motorcycle'",
    );

    const tricycles = await client.query(
      "SELECT COUNT(*) FROM tickets WHERE vehicle_type = 'tricycle'",
    );

    const cars = await client.query(
      "SELECT COUNT(*) FROM tickets WHERE vehicle_type = 'car'",
    );

    res.json({
      issued: issuedTickets.rows[0].count,
      unresolved: unresolvedTickets.rows[0].count,
      new: newTickets.rows[0].count,
      motorcycles: motorcycles.rows[0].count,
      tricycles: tricycles.rows[0].count,
      cars: cars.rows[0].count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});
