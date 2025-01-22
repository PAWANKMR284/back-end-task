// Import required modules
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pk@123456",
  database: "task_manager",
  PORT: 4000,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Routes

// Create a new task
app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;
  const sql = "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
  db.query(sql, [title, description, status || "pending"], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create task." });
    }
    res
      .status(201)
      .json({ message: "Task created successfully.", taskId: result.insertId });
  });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch tasks." });
    }
    res.status(200).json(results);
  });
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const sql =
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
  db.query(sql, [title, description, status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update task." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(200).json({ message: "Task updated successfully." });
  });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete task." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(200).json({ message: "Task deleted successfully." });
  });
});

// Search tasks by title and description
app.get("/tasks/search", (req, res) => {
  const { query } = req.query;
  const sql = "SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ?";
  const searchQuery = `%${query}%`;
  db.query(sql, [searchQuery, searchQuery], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to search tasks." });
    }
    res.status(200).json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
