const { Project, ProjectStatus } = require('../models/project.model');
const { Client } = require('../models/client.model');
const { Employee } = require('../models/employee.model');
const { User, UserRole } = require('../models/user.model');
const mongoose = require('mongoose');

// Create project
exports.createProject = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const projectData = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to create projects' });
    }

    // Check if client exists if provided
    if (projectData.client) {
      const client = await Client.findOne({ _id: projectData.client, tenantId });
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
    }

    // Check if manager exists if provided
    if (projectData.manager) {
      const manager = await Employee.findOne({ _id: projectData.manager, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }
    }

    // Check if team members exist if provided
    if (projectData.team && projectData.team.length > 0) {
      for (const memberId of projectData.team) {
        const member = await Employee.findOne({ _id: memberId, tenantId });
        if (!member) {
          return res.status(404).json({ message: `Team member with ID ${memberId} not found` });
        }
      }
    }

    // Create project
    const project = new Project({
      ...projectData,
      tenantId
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;
    const updates = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to update projects' });
    }

    // Find project
    const project = await Project.findOne({ _id: id, tenantId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if client exists if provided
    if (updates.client) {
      const client = await Client.findOne({ _id: updates.client, tenantId });
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
    }

    // Check if manager exists if provided
    if (updates.manager) {
      const manager = await Employee.findOne({ _id: updates.manager, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }
    }

    // Check if team members exist if provided
    if (updates.team && updates.team.length > 0) {
      for (const memberId of updates.team) {
        const member = await Employee.findOne({ _id: memberId, tenantId });
        if (!member) {
          return res.status(404).json({ message: `Team member with ID ${memberId} not found` });
        }
      }
    }

    // Update project
    Object.keys(updates).forEach(key => {
      project[key] = updates[key];
    });

    await project.save();

    res.status(200).json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to delete projects' });
    }

    // Find and delete project
    const project = await Project.findOneAndDelete({ _id: id, tenantId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get projects
exports.getProjects = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { status, client, manager, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { tenantId };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by client
    if (client) {
      query.client = client;
    }

    // Filter by manager
    if (manager) {
      query.manager = manager;
    }

    // Search by name or code
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const projects = await Project.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate('client', 'name company.name')
      .populate('manager', 'personalInfo.firstName personalInfo.lastName')
      .populate('team', 'personalInfo.firstName personalInfo.lastName');

    // Get total count
    const total = await Project.countDocuments(query);

    res.status(200).json({
      projects,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    // Find project
    const project = await Project.findOne({ _id: id, tenantId })
      .populate('client', 'name company.name contactPerson')
      .populate('manager', 'personalInfo.firstName personalInfo.lastName personalInfo.email')
      .populate('team', 'personalInfo.firstName personalInfo.lastName personalInfo.email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add team member to project
exports.addTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;
    const { employeeId } = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to update project team' });
    }

    // Find project
    const project = await Project.findOne({ _id: id, tenantId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if employee exists
    const employee = await Employee.findOne({ _id: employeeId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee is already in team
    if (project.team.includes(employeeId)) {
      return res.status(400).json({ message: 'Employee is already in the project team' });
    }

    // Add employee to team
    project.team.push(employeeId);
    await project.save();

    res.status(200).json({
      message: 'Team member added successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove team member from project
exports.removeTeamMember = async (req, res) => {
  try {
    const { id, employeeId } = req.params;
    const { tenantId, role } = req.user;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to update project team' });
    }

    // Find project
    const project = await Project.findOne({ _id: id, tenantId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if employee is in team
    if (!project.team.includes(employeeId)) {
      return res.status(400).json({ message: 'Employee is not in the project team' });
    }

    // Remove employee from team
    project.team = project.team.filter(member => member.toString() !== employeeId);
    await project.save();

    res.status(200).json({
      message: 'Team member removed successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project statistics
exports.getProjectStats = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Get project counts by status
    const statusCounts = await Project.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Format status counts
    const formattedStatusCounts = {};
    statusCounts.forEach(item => {
      formattedStatusCounts[item._id] = item.count;
    });

    // Get total projects
    const totalProjects = await Project.countDocuments({ tenantId });

    // Get projects by client
    const projectsByClient = await Project.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$client', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get client details
    const clientDetails = [];
    for (const item of projectsByClient) {
      if (item._id) {
        const client = await Client.findById(item._id);
        if (client) {
          clientDetails.push({
            id: client._id,
            name: client.name,
            count: item.count
          });
        }
      }
    }

    // Get projects by manager
    const projectsByManager = await Project.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$manager', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get manager details
    const managerDetails = [];
    for (const item of projectsByManager) {
      if (item._id) {
        const employee = await Employee.findById(item._id);
        if (employee) {
          managerDetails.push({
            id: employee._id,
            name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
            count: item.count
          });
        }
      }
    }

    res.status(200).json({
      totalProjects,
      statusCounts: formattedStatusCounts,
      projectsByClient: clientDetails,
      projectsByManager: managerDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};