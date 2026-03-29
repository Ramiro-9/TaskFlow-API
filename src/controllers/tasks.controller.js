const pool = require('../config/db');

const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        completed = COALESCE($3, completed)
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [title, description, completed, id, req.userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Task not found' });

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };