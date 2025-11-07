const { Project, Task, User } = require('../models');
const { sendSuccess, sendError, sendPaginatedResponse, getPagination } = require('../utils/responseUtils');
const { asyncHandler, getRandomProjectColor } = require('../utils/helpers');
const { validationResult } = require('express-validator');

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  // Build query
  const query = {
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.$text = { $search: search };
  }
  
  // Get total count
  const total = await Project.countDocuments(query);
  const pagination = getPagination(page, limit, total);
  
  // Get projects with pagination
  const projects = await Project.find(query)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate('tasks')
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.pageSize);
    
  // Add computed fields
  const projectsWithStats = projects.map(project => {
    const projectObj = project.toObject();
    const tasks = projectObj.tasks || [];
    
    projectObj.taskStats = {
      total: tasks.length,
      todo: tasks.filter(task => task.status === 'todo').length,
      inProgress: tasks.filter(task => task.status === 'inprogress').length,
      completed: tasks.filter(task => task.status === 'completed').length
    };
    
    projectObj.progress = tasks.length > 0 
      ? Math.round((projectObj.taskStats.completed / tasks.length) * 100)
      : 0;
      
    return projectObj;
  });
  
  sendPaginatedResponse(res, 'Projects retrieved successfully', projectsWithStats, pagination);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .populate({
      path: 'tasks',
      populate: {
        path: 'assignedTo createdBy',
        select: 'name email avatar'
      }
    });
    
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  // Check access
  const isOwner = project.owner._id.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user._id.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to access this project', 403);
  }
  
  sendSuccess(res, 'Project retrieved successfully', project);
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }
  
  const { name, description, color } = req.body;
  
  const project = await Project.create({
    name,
    description,
    color: color || getRandomProjectColor(),
    owner: req.user._id,
    members: [{
      user: req.user._id,
      role: 'owner',
      joinedAt: new Date()
    }]
  });
  
  // Add project to user's projects
  await User.findByIdAndUpdate(req.user._id, {
    $push: { projects: project._id }
  });
  
  const populatedProject = await Project.findById(project._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');
  
  sendSuccess(res, 'Project created successfully', populatedProject, 201);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, color, status, priority, deadline } = req.body;
  
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  // Check if user is owner or admin
  const isOwner = project.owner.toString() === req.user._id.toString();
  const memberData = project.members.find(member => 
    member.user.toString() === req.user._id.toString()
  );
  const isAdmin = memberData?.role === 'admin';
  
  if (!isOwner && !isAdmin) {
    return sendError(res, 'Not authorized to update this project', 403);
  }
  
  // Update fields
  if (name) project.name = name;
  if (description) project.description = description;
  if (color) project.color = color;
  if (status) project.status = status;
  if (priority) project.priority = priority;
  if (deadline) project.deadline = deadline;
  
  await project.save();
  
  const updatedProject = await Project.findById(project._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');
  
  sendSuccess(res, 'Project updated successfully', updatedProject);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  // Only owner can delete
  if (project.owner.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to delete this project', 403);
  }
  
  // Delete all tasks associated with this project
  await Task.deleteMany({ project: project._id });
  
  // Remove project from all users' projects array
  await User.updateMany(
    { projects: project._id },
    { $pull: { projects: project._id } }
  );
  
  await Project.findByIdAndDelete(req.params.id);
  
  sendSuccess(res, 'Project deleted successfully');
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
const addMember = asyncHandler(async (req, res) => {
  const { email, userId, role = 'member' } = req.body;
  
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  // Check if user is owner or admin
  const isOwner = project.owner.toString() === req.user._id.toString();
  const memberData = project.members.find(member => 
    member.user.toString() === req.user._id.toString()
  );
  const isAdmin = memberData?.role === 'admin';
  
  if (!isOwner && !isAdmin) {
    return sendError(res, 'Not authorized to add members', 403);
  }
  
  // Find user by email or userId
  let user;
  if (email) {
    user = await User.findOne({ email });
  } else if (userId) {
    user = await User.findById(userId);
  } else {
    return sendError(res, 'Email or userId is required', 400);
  }
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  // Check if user is already a member
  const isMember = project.members.some(member => 
    member.user.toString() === user._id.toString()
  );
  
  if (isMember) {
    return sendError(res, 'User is already a member of this project', 400);
  }
  
  // Add member
  project.members.push({
    user: user._id,
    role: role,
    joinedAt: new Date()
  });
  
  await project.save();
  
  // Add project to user's projects
  await User.findByIdAndUpdate(user._id, {
    $push: { projects: project._id }
  });
  
  const updatedProject = await Project.findById(project._id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');
  
  sendSuccess(res, 'Member added successfully', updatedProject);
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  // Check if user is owner
  if (project.owner.toString() !== req.user._id.toString()) {
    return sendError(res, 'Only project owner can remove members', 403);
  }
  
  // Can't remove owner
  if (userId === project.owner.toString()) {
    return sendError(res, 'Cannot remove project owner', 400);
  }
  
  // Remove member
  project.members = project.members.filter(member => 
    member.user.toString() !== userId
  );
  
  await project.save();
  
  // Remove project from user's projects
  await User.findByIdAndUpdate(userId, {
    $pull: { projects: project._id }
  });
  
  sendSuccess(res, 'Member removed successfully');
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};