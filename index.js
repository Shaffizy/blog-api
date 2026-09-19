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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));