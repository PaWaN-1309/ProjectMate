const express = require('express');
const router = express.Router();

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment,
  reorderTasks
} = require('../controllers/taskController');

const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateTask } = require('../middleware/validation');

// Apply auth middleware to all routes
router.use(auth);
router.use(apiLimiter);

// Task routes through projects
router.route('/projects/:projectId/tasks')
  .get(getTasks)
  .post(validateTask, createTask);

// Reorder tasks in project
router.put('/projects/:projectId/tasks/reorder', reorderTasks);

// Individual task routes
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Task status update (for drag & drop)
router.put('/:id/status', updateTaskStatus);

// Task comments
router.post('/:id/comments', addComment);

module.exports = router;