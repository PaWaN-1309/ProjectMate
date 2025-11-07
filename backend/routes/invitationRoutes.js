const express = require('express');
const router = express.Router();

const {
  sendInvitation,
  getInvitations,
  respondToInvitation,
  cancelInvitation,
  getProjectInvitations
} = require('../controllers/invitationController');

const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  validateInvitation,
  validateInvitationResponse
} = require('../middleware/validation');

// Apply auth middleware to all routes
router.use(auth);
router.use(apiLimiter);

// Invitation routes
router.get('/', getInvitations);
router.put('/:id/respond', validateInvitationResponse, respondToInvitation);
router.delete('/:id', cancelInvitation);

// Project invitation routes
router.post('/projects/:projectId/invite', validateInvitation, sendInvitation);
router.get('/projects/:projectId', getProjectInvitations);

module.exports = router;