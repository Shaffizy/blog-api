require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// quick test route to confirm DB connection works
app.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT 1 + 1 AS result');
  res.json({ message: 'Server is running', dbTest: rows[0].result });
});

// Register a user
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.status(201).json({ id: result.insertId, username, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a post
app.post('/posts', async (req, res) => {
  const { user_id, title, content } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
      [user_id, title, content]
    );
    res.status(201).json({ id: result.insertId, user_id, title, content });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all posts with pagination + author's username joined in
app.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT posts.id, posts.title, posts.content, posts.created_at, users.username
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  res.json({ page, limit, results: rows });
});

// Get one post by id
app.get('/posts/:id', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT posts.id, posts.title, posts.content, posts.created_at, users.username
     FROM posts
     JOIN users ON posts.user_id = users.id
     WHERE posts.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
  res.json(rows[0]);
});

// Update a post
app.patch('/posts/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    await pool.query(
      'UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content) WHERE id = ?',
      [title, content, req.params.id]
    );
    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
  res.json({ message: 'Post deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));