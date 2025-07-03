import express from 'express';
import cors from 'cors';
import { GoodDB, PostgreSQLDriver } from 'good.db';

const app = express();

// ✅ Custom logger with timestamp
const log = (...args) => {
  console.log(`[${new Date().toISOString()}]`, ...args);
};

// ✅ Initialize GoodDB with PostgreSQL
// Using the direct connection string (can also use process.env.DATABASE_URL)
const db = new GoodDB(new PostgreSQLDriver({
  connectionString: 'postgresql://feedback_db_oh5j_user:Ukwt0MDRmReH05BIrMsUJMLeYXw92zI3@dpg-d1j4akqli9vc739civ10-a.oregon-postgres.render.com/feedback_db_oh5j'
}));

// ✅ PostgreSQLDriver requires connect()
await db.connect();

app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  log('Health check hit');
  res.send('✅ GoodDB + PostgreSQL backend is running.');
});

// ✅ Get all feedbacks (stored under 'users')
app.get('/users', async (req, res) => {
  const users = await db.get('users') || [];
  log('GET /users →', users);
  res.json(users);
});

// ✅ Add feedback
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

// ✅ Clear all feedbacks (optional)
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
