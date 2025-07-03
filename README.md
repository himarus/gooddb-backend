# GoodDB Backend API

This is a simple Node.js + Express backend using GoodDB with SQLiteDriver.

## Routes

- `GET /users` → Get all users
- `POST /users` → Add new user (JSON: `{ "name": "Alice", "age": 25 }`)
- `DELETE /users/:name` → Delete user by name

## Deploy

1. Push to GitHub
2. Deploy to [Render](https://render.com)

Build command: `npm install`  
Start command: `npm start`
