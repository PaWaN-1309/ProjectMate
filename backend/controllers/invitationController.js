const { Invitation, Project, User } = require('../models');
const { sendSuccess, sendError, sendPaginatedResponse, getPagination } = require('../utils/responseUtils');
const { asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

// @desc    Send invitation to user
// @route   POST /api/projects/:projectId/invite
// @access  Private
const sendInvitation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }
  
  const { email, role = 'member', message } = req.body;
  const { projectId } = req.params;
  
  // Check if project exists and user has permission
  const project = await Project.findById(projectId);
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  const isOwner = project.owner.toString() === req.user._id.toString();
  const memberData = project.members.find(member => 
    member.user.toString() === req.user._id.toString()
  );
  const isAdmin = memberData?.role === 'admin';
  
  if (!isOwner && !isAdmin) {
    return sendError(res, 'Not authorized to send invitations', 403);
  }
  
  // Find user by email
  const invitedUser = await User.findOne({ email });
  if (!invitedUser) {
    return sendError(res, 'User not found with this email', 404);
  }
  
  // Check if user is already a member
  const isMember = project.members.some(member => 
    member.user.toString() === invitedUser._id.toString()
  );
  
  if (isMember) {
    return sendError(res, 'User is already a member of this project', 400);
  }
  
  // Check for existing pending invitation
  const existingInvitation = await Invitation.findOne({
    project: projectId,
    invitedUser: invitedUser._id,
    status: 'pending'
  });
  
  if (existingInvitation) {
    return sendError(res, 'Invitation already sent to this user', 400);
  }
  
  // Create invitation
  const invitation = await Invitation.create({
    project: projectId,
    invitedBy: req.user._id,
    invitedUser: invitedUser._id,
    role,
    message
  });
  
  const populatedInvitation = await Invitation.findById(invitation._id)
    .populate('project', 'name description')
    .populate('invitedBy', 'name email')
    .populate('invitedUser', 'name email');
  
  sendSuccess(res, 'Invitation sent successfully', populatedInvitation, 201);
});

// @desc    Get user's invitations
// @route   GET /api/invitations
// @access  Private
const getInvitations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  // Build query
  const query = { invitedUser: req.user._id };
  if (status) {
    query.status = status;
  }
  
  // Get total count
  const total = await Invitation.countDocuments(query);
  const pagination = getPagination(page, limit, total);
  
  // Get invitations
  const invitations = await Invitation.find(query)
    .populate('project', 'name description color')
    .populate('invitedBy', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.pageSize);
  
  sendPaginatedResponse(res, 'Invitations retrieved successfully', invitations, pagination);
});

// @desc    Respond to invitation
// @route   PUT /api/invitations/:id/respond
// @access  Private
const respondToInvitation = asyncHandler(async (req, res) => {
  const { response } = req.body; // 'accept' or 'decline'
  
  if (!['accept', 'decline'].includes(response)) {
    return sendError(res, 'Invalid response. Must be "accept" or "decline"', 400);
  }
  
  const invitation = await Invitation.findById(req.params.id)
    .populate('project');
    
  if (!invitation) {
    return sendError(res, 'Invitation not found', 404);
  }
  
  // Check if invitation belongs to current user
  if (invitation.invitedUser.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to respond to this invitation', 403);
  }
  
  // Check if invitation is still pending
  if (invitation.status !== 'pending') {
    return sendError(res, 'Invitation has already been responded to', 400);
  }
  
  // Check if invitation is expired
  if (invitation.expiresAt < new Date()) {
    invitation.status = 'expired';
    await invitation.save();
    return sendError(res, 'Invitation has expired', 400);
  }
  
  // Update invitation status
  invitation.status = response === 'accept' ? 'accepted' : 'declined';
  invitation.respondedAt = new Date();
  await invitation.save();
  
  // If accepted, add user to project
  if (response === 'accept') {
    const project = invitation.project;
    
    // Add member to project
    project.members.push({
      user: req.user._id,
      role: invitation.role,
      joinedAt: new Date()
    });
    await project.save();
    
    // Add project to user's projects
    await User.findByIdAndUpdate(req.user._id, {
      $push: { projects: project._id }
    });
  }
  
  sendSuccess(res, `Invitation ${response}ed successfully`, invitation);
});

// @desc    Cancel invitation (by sender)
// @route   DELETE /api/invitations/:id
// @access  Private
const cancelInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id)
    .populate('project');
    
  if (!invitation) {
    return sendError(res, 'Invitation not found', 404);
  }
  
  // Check if user is authorized to cancel
  const project = invitation.project;
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isSender = invitation.invitedBy.toString() === req.user._id.toString();
  
  if (!isOwner && !isSender) {
    return sendError(res, 'Not authorized to cancel this invitation', 403);
  }
  
  // Can only cancel pending invitations
  if (invitation.status !== 'pending') {
    return sendError(res, 'Can only cancel pending invitations', 400);
  }
  
  await Invitation.findByIdAndDelete(req.params.id);
  
  sendSuccess(res, 'Invitation cancelled successfully');
});

// @desc    Get project invitations (for project owners/admins)
// @route   GET /api/projects/:projectId/invitations
// @access  Private
const getProjectInvitations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const { projectId } = req.params;
  
  // Check if project exists and user has permission
  const project = await Project.findById(projectId);
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  const isOwner = project.owner.toString() === req.user._id.toString();
  const memberData = project.members.find(member => 
    member.user.toString() === req.user._id.toString()
  );
  const isAdmin = memberData?.role === 'admin';
  
  if (!isOwner && !isAdmin) {
    return sendError(res, 'Not authorized to view project invitations', 403);
  }
  
  // Build query
  const query = { project: projectId };
  if (status) {
    query.status = status;
  }
  
  // Get total count
  const total = await Invitation.countDocuments(query);
  const pagination = getPagination(page, limit, total);
  
  // Get invitations
  const invitations = await Invitation.find(query)
    .populate('invitedBy', 'name email avatar')
    .populate('invitedUser', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.pageSize);
  
  sendPaginatedResponse(res, 'Project invitations retrieved successfully', invitations, pagination);
});

module.exports = {
  sendInvitation,
  getInvitations,
  respondToInvitation,
  cancelInvitation,
  getProjectInvitations
};