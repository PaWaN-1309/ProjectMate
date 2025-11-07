const { Task, Project } = require('../models');
const { sendSuccess, sendError, sendPaginatedResponse, getPagination } = require('../utils/responseUtils');
const { asyncHandler } = require('../utils/helpers');
const { validationResult } = require('express-validator');

// @desc    Get tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status, assignedTo, priority } = req.query;
  
  // Check if user has access to project
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to access this project', 403);
  }
  
  // Build query
  const query = { project: req.params.projectId };
  
  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;
  if (priority) query.priority = priority;
  
  // Get total count
  const total = await Task.countDocuments(query);
  const pagination = getPagination(page, limit, total);
  
  // Get tasks
  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name email avatar')
    .sort({ position: 1, createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.pageSize);
  
  sendPaginatedResponse(res, 'Tasks retrieved successfully', tasks, pagination);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'name owner members')
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name email avatar');
    
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }
  
  // Check if user has access to the project
  const project = task.project;
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to access this task', 403);
  }
  
  sendSuccess(res, 'Task retrieved successfully', task);
});

// @desc    Create task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }
  
  const { title, description, priority, assignedTo, dueDate, tags } = req.body;
  
  // Check if user has access to project
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to create tasks in this project', 403);
  }
  
  // Get position for new task
  const lastTask = await Task.findOne({ project: req.params.projectId })
    .sort({ position: -1 });
  const position = lastTask ? lastTask.position + 1 : 1;
  
  const task = await Task.create({
    title,
    description,
    priority,
    project: req.params.projectId,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    dueDate: dueDate || null,
    tags: tags || [],
    position
  });
  
  // Add task to project
  await Project.findByIdAndUpdate(req.params.projectId, {
    $push: { tasks: task._id }
  });
  
  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');
  
  sendSuccess(res, 'Task created successfully', populatedTask, 201);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, assignedTo, dueDate, tags } = req.body;
  
  const task = await Task.findById(req.params.id).populate('project');
  
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }
  
  // Check if user has access to the project
  const project = task.project;
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to update this task', 403);
  }
  
  // Update fields
  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (assignedTo !== undefined) task.assignedTo = assignedTo;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (tags) task.tags = tags;
  
  await task.save();
  
  const updatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');
  
  sendSuccess(res, 'Task updated successfully', updatedTask);
});

// @desc    Update task status (for drag & drop)
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status, position } = req.body;
  
  const task = await Task.findById(req.params.id).populate('project');
  
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }
  
  // Check if user has access to the project
  const project = task.project;
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to update this task', 403);
  }
  
  // Update status and position
  task.status = status;
  if (position !== undefined) {
    task.position = position;
  }
  
  await task.save();
  
  const updatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');
  
  sendSuccess(res, 'Task status updated successfully', updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project');
  
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }
  
  // Check if user has access to the project
  const project = task.project;
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  
  if (!isOwner && !isMember && !isCreator) {
    return sendError(res, 'Not authorized to delete this task', 403);
  }
  
  // Remove task from project
  await Project.findByIdAndUpdate(task.project._id, {
    $pull: { tasks: task._id }
  });
  
  await Task.findByIdAndDelete(req.params.id);
  
  sendSuccess(res, 'Task deleted successfully');
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  if (!content || content.trim().length === 0) {
    return sendError(res, 'Comment content is required', 400);
  }
  
  const task = await Task.findById(req.params.id).populate('project');
  
  if (!task) {
    return sendError(res, 'Task not found', 404);
  }
  
  // Check if user has access to the project
  const project = task.project;
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to comment on this task', 403);
  }
  
  // Add comment
  task.comments.push({
    user: req.user._id,
    content: content.trim(),
    createdAt: new Date()
  });
  
  await task.save();
  
  const updatedTask = await Task.findById(task._id)
    .populate('comments.user', 'name email avatar');
  
  sendSuccess(res, 'Comment added successfully', updatedTask);
});

// @desc    Update task positions (for reordering)
// @route   PUT /api/projects/:projectId/tasks/reorder
// @access  Private
const reorderTasks = asyncHandler(async (req, res) => {
  const { tasks } = req.body; // Array of { id, position, status }
  
  // Check if user has access to project
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return sendError(res, 'Project not found', 404);
  }
  
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );
  
  if (!isOwner && !isMember) {
    return sendError(res, 'Not authorized to reorder tasks in this project', 403);
  }
  
  // Update tasks in bulk
  const bulkOps = tasks.map(task => ({
    updateOne: {
      filter: { _id: task.id },
      update: { 
        position: task.position,
        ...(task.status && { status: task.status })
      }
    }
  }));
  
  await Task.bulkWrite(bulkOps);
  
  sendSuccess(res, 'Tasks reordered successfully');
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment,
  reorderTasks
};