const mockData = require('../data/mockData');

class ProjectService {
  /**
   * Get all projects
   * @returns {Array} List of all projects
   */
  getAllProjects() {
    return mockData.projects;
  }

  /**
   * Get a single project by ID
   * @param {number|string} id - Project ID
   * @returns {Object|null} Project object or null if not found
   */
  getProjectById(id) {
    const projectId = parseInt(id);
    return mockData.projects.find(project => project.id === projectId) || null;
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Object} Created project
   * @throws {Error} If validation fails
   */
  createProject(projectData) {
    // Validate project data
    this.validateProjectData(projectData);

    // Generate new ID
    const newId = mockData.projects.length > 0 
      ? Math.max(...mockData.projects.map(p => p.id)) + 1 
      : 1;

    // Create new project with defaults
    const newProject = {
      id: newId,
      name: projectData.name,
      status: projectData.status || 'In Progress',
      statusColor: this.getStatusColor(projectData.status || 'In Progress'),
      progress: projectData.progress || 0,
      total: projectData.total || 0,
      done: projectData.done || 0,
      due: projectData.due,
      owner: projectData.owner,
      ownerImg: projectData.ownerImg || `https://i.pravatar.cc/150?u=${newId}`,
      description: projectData.description || '',
      tags: projectData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock data
    mockData.projects.push(newProject);

    return newProject;
  }

  /**
   * Update an existing project
   * @param {number|string} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Object} Updated project
   * @throws {Error} If project not found or validation fails
   */
  updateProject(id, projectData) {
    const projectId = parseInt(id);
    const projectIndex = mockData.projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Validate only provided fields
    this.validateProjectData(projectData, false);

    // Update project
    const updatedProject = {
      ...mockData.projects[projectIndex],
      ...projectData,
      id: projectId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    // Update status color if status changed
    if (projectData.status) {
      updatedProject.statusColor = this.getStatusColor(projectData.status);
    }

    mockData.projects[projectIndex] = updatedProject;

    return updatedProject;
  }

  /**
   * Delete a project
   * @param {number|string} id - Project ID
   * @returns {boolean} True if deleted successfully
   * @throws {Error} If project not found
   */
  deleteProject(id) {
    const projectId = parseInt(id);
    const projectIndex = mockData.projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    mockData.projects.splice(projectIndex, 1);
    return true;
  }

  /**
   * Validate project data
   * @param {Object} data - Project data to validate
   * @param {boolean} requireAll - Whether all fields are required (for create vs update)
   * @throws {Error} If validation fails
   */
  validateProjectData(data, requireAll = true) {
    if (requireAll) {
      if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        throw new Error('Project name is required and must be a non-empty string');
      }

      if (!data.owner || typeof data.owner !== 'string' || data.owner.trim().length === 0) {
        throw new Error('Project owner is required and must be a non-empty string');
      }

      if (!data.due || typeof data.due !== 'string') {
        throw new Error('Project due date is required');
      }
    } else {
      // For updates, validate only if fields are provided
      if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
        throw new Error('Project name must be a non-empty string');
      }

      if (data.owner !== undefined && (typeof data.owner !== 'string' || data.owner.trim().length === 0)) {
        throw new Error('Project owner must be a non-empty string');
      }
    }

    // Validate status if provided
    if (data.status !== undefined) {
      const validStatuses = ['In Progress', 'Completed', 'On Hold', 'Pending'];
      if (!validStatuses.includes(data.status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Validate progress if provided
    if (data.progress !== undefined) {
      const progress = parseInt(data.progress);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        throw new Error('Progress must be a number between 0 and 100');
      }
    }

    // Validate total and done if provided
    if (data.total !== undefined) {
      const total = parseInt(data.total);
      if (isNaN(total) || total < 0) {
        throw new Error('Total tasks must be a non-negative number');
      }
    }

    if (data.done !== undefined) {
      const done = parseInt(data.done);
      if (isNaN(done) || done < 0) {
        throw new Error('Done tasks must be a non-negative number');
      }
    }

    // Validate tags if provided
    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      throw new Error('Tags must be an array');
    }
  }

  /**
   * Get status color based on status
   * @param {string} status - Project status
   * @returns {string} CSS classes for status color
   */
  getStatusColor(status) {
    const statusColors = {
      'In Progress': 'text-blue-400 border-blue-400/20 bg-blue-400/10',
      'Completed': 'text-green-400 border-green-400/20 bg-green-400/10',
      'On Hold': 'text-gray-400 border-gray-400/20 bg-gray-400/10',
      'Pending': 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
    };

    return statusColors[status] || statusColors['In Progress'];
  }
}

// Export singleton instance
module.exports = new ProjectService();
