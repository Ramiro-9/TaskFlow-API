const express = require('express');
const app = express();

const authRoutes = require('./routes/auth.routes');
const tasksRoutes = require('./routes/tasks.routes');
const rateLimiter = require('./middleware/rateLimiter');

app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

module.exports = app;