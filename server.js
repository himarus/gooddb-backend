// server.js
import express from 'express';
import cors from 'cors';
import { GoodDB, PostgreSQLDriver } from 'good.db';

// Create express app
const app = express();

// ✅ Timestamped logger
const log = (...args) => {
  console.log(`[${new Date().toISOString()}]`, ...args);
};

// ✅ Connect to PostgreSQL via DATABASE_URL env
// ✅ Connect to PostgreSQL via DATABASE_URL env with SSL enabled
const db = new GoodDB(new PostgreSQLDriver({
  connectionString: process.env.DATABASE_URL,
  ssl: true
}));

await db.connect(); // Required for PostgreSQL

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get('/', (req, res) => {
  log('Health check hit');
  res.send('✅ GoodDB + PostgreSQL backend is running.');
});

// ✅ Get all feedbacks
app.get('/users', async (req, res) => {
  const users = await db.get('users') || [];
  log('GET /users →', users);
  res.json(users);
});

// ✅ Add new feedback
app.post('/users', async (req, res) => {
  const user = req.body;
  await db.push('users', user);
  log('POST /users →', user);
  res.json({ success: true });
});

// ✅ Delete feedback by name
app.delete('/users/:name', async (req, res) => {
  const name = req.params.name;
  await db.pull('users', u => u.name === name);
  log(`DELETE /users/${name}`);
  res.json({ success: true });
});

// ✅ Clear all feedbacks (use with care!)
app.delete('/users', async (req, res) => {
  await db.set('users', []);
  log('DELETE ALL /users');
  res.json({ success: true });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log(`🚀 Server running on port ${PORT}`);
});
