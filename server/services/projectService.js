const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProjectService {
  /**
   * Get all projects
   * @param {string} [query] - Search query
   * @returns {Promise<Array>} List of all projects
   */
  async getAllProjects(query) {
    const where = {};
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { owner: { contains: query } }
      ];
    }

    const projects = await prisma.project.findMany({ where });
    return projects.map(p => ({
      ...p,
      tags: JSON.parse(p.tags)
    }));
  }

  /**
   * Get a single project by ID
   * @param {number|string} id - Project ID
   * @returns {Promise<Object|null>} Project object or null if not found
   */
  async getProjectById(id) {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!project) return null;
    
    return {
      ...project,
      tags: JSON.parse(project.tags)
    };
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Created project
   * @throws {Error} If validation fails
   */
  async createProject(projectData) {
    // Validate project data
    this.validateProjectData(projectData);

    const newProject = await prisma.project.create({
      data: {
        name: projectData.name,
        status: projectData.status || 'In Progress',
        statusColor: this.getStatusColor(projectData.status || 'In Progress'),
        progress: parseInt(projectData.progress || 0),
        total: parseInt(projectData.total || 0),
        done: parseInt(projectData.done || 0),
        due: projectData.due,
        owner: projectData.owner,
        ownerImg: projectData.ownerImg || `https://i.pravatar.cc/150?u=${Date.now()}`,
        description: projectData.description || '',
        tags: JSON.stringify(projectData.tags || []),
      }
    });

    return {
      ...newProject,
      tags: JSON.parse(newProject.tags)
    };
  }

  /**
   * Update an existing project
   * @param {number|string} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise<Object>} Updated project
   * @throws {Error} If project not found or validation fails
   */
  async updateProject(id, projectData) {
    const projectId = parseInt(id);

    // Validate only provided fields
    this.validateProjectData(projectData, false);

    try {
      const dataToUpdate = { ...projectData };
      
      if (dataToUpdate.tags) {
        dataToUpdate.tags = JSON.stringify(dataToUpdate.tags);
      }
      
      if (dataToUpdate.status) {
        dataToUpdate.statusColor = this.getStatusColor(dataToUpdate.status);
      }
      
      // Remove id from dataToUpdate if present to avoid updating it
      delete dataToUpdate.id;
      delete dataToUpdate.updatedAt; // Let Prisma handle updatedAt

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: dataToUpdate
      });

      return {
        ...updatedProject,
        tags: JSON.parse(updatedProject.tags)
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Project not found');
      }
      throw error;
    }
  }

  /**
   * Delete a project
   * @param {number|string} id - Project ID
   * @returns {Promise<boolean>} True if deleted successfully
   * @throws {Error} If project not found
   */
  async deleteProject(id) {
    try {
      await prisma.project.delete({
        where: { id: parseInt(id) }
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Project not found');
      }
      throw error;
    }
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
