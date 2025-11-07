const express = require('express');
const router = express.Router();

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');

const { auth } = require('../middleware/auth');
const { isProjectOwner, isProjectAdmin } = require('../middleware/projectAuth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateProject } = require('../middleware/validation');

// Apply auth middleware to all routes
router.use(auth);
router.use(apiLimiter);

// Project CRUD routes
router.route('/')
  .get(getProjects)
  .post(validateProject, createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(isProjectOwner, deleteProject);

// Member management routes
router.post('/:id/members', isProjectOwner, addMember);
router.delete('/:id/members/:userId', isProjectOwner, removeMember);

module.exports = router;