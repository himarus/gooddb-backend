import express from 'express';
import cors from 'cors';
import { GoodDB, SQLiteDriver } from 'good.db';

const app = express();

// Timestamped logger
const log = (...args) => {
  console.log(`[${new Date().toISOString()}]`, ...args);
};

// Initialize database with SQLite (no need to connect!)
const db = new GoodDB(new SQLiteDriver({ path: './data.sqlite' }));

app.use(cors());
app.use(express.json());

// ✅ Root route - health check
app.get('/', (req, res) => {
  log('Health check hit');
  res.send('✅ GoodDB backend is running.');
});

// ✅ Get all users
app.get('/users', async (req, res) => {
  const users = await db.get('users') || [];
  log('GET /users →', users);
  res.json(users);
});

// ✅ Add a user
app.post('/users', async (req, res) => {
  const user = req.body;
  await db.push('users', user);
  log('POST /users →', user);
  res.json({ success: true });
});

// ✅ Delete user by name
app.delete('/users/:name', async (req, res) => {
  const name = req.params.name;
  await db.pull('users', u => u.name === name);
  log('DELETE /users/' + name);
  res.json({ success: true });
});

// ✅ Delete all users (use carefully)
app.delete('/users', async (req, res) => {
  await db.set('users', []);
  log('DELETE ALL /users');
  res.json({ success: true });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log(`🚀 Server running on port ${PORT}`);
});
