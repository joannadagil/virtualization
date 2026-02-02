const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const {
  DB_HOST = "db",
  DB_USER = "app_user",
  DB_PASSWORD = "app_pass",
  DB_NAME = "app_db",
} = process.env;

let pool;

async function waitForDb(retries = 10) {
  while (retries > 0) {
    try {
      pool = await mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: Number(process.env.DB_PORT || 3306),
      });

      await pool.query("SELECT 1");

      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          content VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log("DB ready");
      return;
    } catch (err) {
      console.log("Waiting for DB...", err.code);
      retries--;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error("DB not ready after retries");
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/messages", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM messages ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/messages", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content required" });
  await pool.query("INSERT INTO messages (content) VALUES (?)", [content]);
  res.json({ ok: true });
});

waitForDb()
  .then(() => {
    app.listen(3000, () => console.log("Backend listening on :3000"));
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
