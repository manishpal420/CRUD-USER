// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database
let users = [];

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes

app.get("/", (req, res) => {
  res.status(200).json({ "server is running with data": users });
});

app.get("/api/users", (req, res) => {
  res.status(200).json(users);
});

app.get("/api/users/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.id === userId);

  if (!userId || !uuidv4(userId)) {
    res.status(400).json({ error: "Invalid userId" });
  } else if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/users", (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    res.status(400).json({ error: "Username and age are required fields" });
  } else {
    const newUser = { id: uuidv4(), username, age, hobbies: hobbies || [] };
    users.push(newUser);
    res.status(201).json(newUser);
  }
});

app.put("/api/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);

  if (!userId || !uuidv4(userId)) {
    res.status(400).json({ error: "Invalid userId" });
  } else if (userIndex !== -1) {
    users[userIndex] = { id: userId, username, age, hobbies: hobbies || [] };
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/api/users/:userId", (req, res) => {
  const { userId } = req.params;
  const userIndex = users.findIndex((u) => u.id === userId);

  if (!userId || !uuidv4(userId)) {
    res.status(400).json({ error: "Invalid userId" });
  } else if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
