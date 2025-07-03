import express from 'express';
import cors from 'cors';
import { GoodDB, SQLiteDriver } from 'good.db';

const app = express();
const db = new GoodDB(new SQLiteDriver({ path: './data.sqlite' }));

await db.connect();

app.use(cors());
app.use(express.json());

// Get all users
app.get('/users', async (req, res) => {
  const users = await db.get('users') || [];
  res.json(users);
});

// Add user
app.post('/users', async (req, res) => {
  const user = req.body;
  await db.push('users', user);
  res.json({ success: true });
});

// Delete user by name
app.delete('/users/:name', async (req, res) => {
  await db.pull('users', (u) => u.name === req.params.name);
  res.json({ success: true });
});

app.get('/', (req, res) => res.send('✅ GoodDB backend is running.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
