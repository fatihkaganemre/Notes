import express from "express";
import path, { dirname }  from "path";
import cors from "cors";
import env from "dotenv";
import pg from "pg";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
env.config();

app.use(cors());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// Serve the React app in production mode
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../Frontend/public')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/getNotes", async (req, res) => {
    const result = await db.query("SELECT * FROM notes ORDER BY id ASC");
    const notes = result.rows;
    res.json({ notes: notes });
});

app.post("/addNote", async (req, res) => {
  let title = req.body['title'];
  let content = req.body['content'];

  try {
    await db.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2)",
      [title, content]
    );
    var result = await db.query( "SELECT id FROM notes WHERE title=$1", [title]);
    var id = result.rows[0];
    res.json({id: id})
  } catch (error) {
    res.json({ error: error });
  }
})

app.delete("/deleteNote", async (req, res) => {
  const noteId = req.body.id;
  try {
    await db.query(
      "DELETE FROM notes WHERE id=$1",
      [noteId]
    );
    res.json({ isDeleted: true })
  } catch (error) {
    res.json({ error: error });
  }
});
