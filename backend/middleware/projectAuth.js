const { Project } = require('../models');

// Check if user is project owner
const isProjectOwner = async (req, res, next) => {
  try {
    // Support both :id and :projectId parameters
    const projectId = req.params.id || req.params.projectId;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as project owner'
      });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is project member (including owner)
const isProjectMember = async (req, res, next) => {
  try {
    // Support both :id and :projectId parameters
    const projectId = req.params.id || req.params.projectId;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isMember = project.members.some(member => 
      member.user.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    req.project = project;
    req.userRole = isOwner ? 'owner' : 
      project.members.find(member => member.user.toString() === req.user._id.toString())?.role || 'member';
    
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is project admin (owner or admin)
const isProjectAdmin = async (req, res, next) => {
  try {
    // Support both :id and :projectId parameters
    const projectId = req.params.id || req.params.projectId;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberData = project.members.find(member => 
      member.user.toString() === req.user._id.toString()
    );
    const isAdmin = memberData?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. Admin access required.'
      });
    }

    req.project = project;
    req.userRole = isOwner ? 'owner' : memberData?.role || 'member';
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isProjectOwner,
  isProjectMember,
  isProjectAdmin
};