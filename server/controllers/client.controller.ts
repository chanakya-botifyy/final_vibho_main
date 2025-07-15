const { Client } = require('../models/client.model');
const { Project } = require('../models/project.model');
const { User, UserRole } = require('../models/user.model');

// Create client
exports.createClient = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const clientData = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to create clients' });
    }

    // Check if client with same name or code already exists
    const existingClient = await Client.findOne({
      $or: [
        { name: clientData.name, tenantId },
        { code: clientData.code, tenantId }
      ]
    });

    if (existingClient) {
      return res.status(400).json({ message: 'Client with this name or code already exists' });
    }

    // Create client
    const client = new Client({
      ...clientData,
      tenantId
    });

    await client.save();

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;
    const updates = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to update clients' });
    }

    // Find client
    const client = await Client.findOne({ _id: id, tenantId });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if name or code is being updated and if it already exists
    if ((updates.name && updates.name !== client.name) || (updates.code && updates.code !== client.code)) {
      const existingClient = await Client.findOne({
        $or: [
          { name: updates.name || client.name, tenantId, _id: { $ne: id } },
          { code: updates.code || client.code, tenantId, _id: { $ne: id } }
        ]
      });

      if (existingClient) {
        return res.status(400).json({ message: 'Client with this name or code already exists' });
      }
    }

    // Update client
    Object.keys(updates).forEach(key => {
      client[key] = updates[key];
    });

    await client.save();

    res.status(200).json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to delete clients' });
    }

    // Check if client has associated projects
    const projects = await Project.find({ client: id, tenantId });
    if (projects.length > 0) {
      return res.status(400).json({ message: 'Cannot delete client with associated projects' });
    }

    // Find and delete client
    const client = await Client.findOneAndDelete({ _id: id, tenantId });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      message: 'Client deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get clients
exports.getClients = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { status, industry, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { tenantId };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by industry
    if (industry) {
      query['company.industry'] = industry;
    }

    // Search by name, code, or company name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const clients = await Client.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ name: 1 });

    // Get total count
    const total = await Client.countDocuments(query);

    res.status(200).json({
      clients,
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

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    // Find client
    const client = await Client.findOne({ _id: id, tenantId });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Get client projects
    const projects = await Project.find({ client: id, tenantId })
      .select('name code status startDate endDate')
      .sort({ startDate: -1 });

    res.status(200).json({
      client,
      projects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get client statistics
exports.getClientStats = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Get total clients
    const totalClients = await Client.countDocuments({ tenantId });

    // Get active clients
    const activeClients = await Client.countDocuments({ tenantId, status: 'active' });

    // Get clients by industry
    const clientsByIndustry = await Client.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$company.industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get clients by country
    const clientsByCountry = await Client.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$company.address.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get clients with most projects
    const clientsWithProjects = await Project.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$client', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get client details
    const topClients = [];
    for (const item of clientsWithProjects) {
      if (item._id) {
        const client = await Client.findById(item._id);
        if (client) {
          topClients.push({
            id: client._id,
            name: client.name,
            company: client.company.name,
            projectCount: item.count
          });
        }
      }
    }

    res.status(200).json({
      totalClients,
      activeClients,
      inactiveClients: totalClients - activeClients,
      clientsByIndustry,
      clientsByCountry,
      topClients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};