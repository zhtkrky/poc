const express = require('express');
const cors = require('cors');
const mockData = require('./data/mockData');
const projectService = require('./services/projectService');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.get('/api/stats', (req, res) => {
  setTimeout(() => {
    res.json({ success: true, data: mockData.stats });
  }, 300); // Simulate network delay
});

app.get('/api/tasks', (req, res) => {
  setTimeout(() => {
    res.json({ success: true, data: mockData.tasks });
  }, 300);
});

// Project CRUD Routes
// GET all projects
app.get('/api/projects', (req, res) => {
  setTimeout(() => {
    try {
      const projects = projectService.getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }, 300);
});

// GET single project by ID
app.get('/api/projects/:id', (req, res) => {
  setTimeout(() => {
    try {
      const project = projectService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }, 300);
});

// POST create new project
app.post('/api/projects', (req, res) => {
  setTimeout(() => {
    try {
      const newProject = projectService.createProject(req.body);
      res.status(201).json({ success: true, data: newProject });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }, 300);
});

// PUT update project
app.put('/api/projects/:id', (req, res) => {
  setTimeout(() => {
    try {
      const updatedProject = projectService.updateProject(req.params.id, req.body);
      res.json({ success: true, data: updatedProject });
    } catch (error) {
      const statusCode = error.message === 'Project not found' ? 404 : 400;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }, 300);
});

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
  setTimeout(() => {
    try {
      projectService.deleteProject(req.params.id);
      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      const statusCode = error.message === 'Project not found' ? 404 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }, 300);
});

app.get('/api/performance', (req, res) => {
  setTimeout(() => {
    res.json({ success: true, data: mockData.performance });
  }, 300);
});

app.get('/api/summary', (req, res) => {
  setTimeout(() => {
    res.json({ success: true, data: mockData.summary });
  }, 300);
});

app.get('/api/dashboard', (req, res) => {
  setTimeout(() => {
    res.json({ 
      success: true, 
      data: {
        stats: mockData.stats,
        tasks: mockData.tasks,
        projects: mockData.projects,
        performance: mockData.performance,
        summary: mockData.summary
      }
    });
  }, 500);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET /api/stats`);
  console.log(`   - GET /api/tasks`);
  console.log(`   - GET /api/projects`);
  console.log(`   - GET /api/projects/:id`);
  console.log(`   - POST /api/projects`);
  console.log(`   - PUT /api/projects/:id`);
  console.log(`   - DELETE /api/projects/:id`);
  console.log(`   - GET /api/performance`);
  console.log(`   - GET /api/summary`);
  console.log(`   - GET /api/dashboard (all data)`);
});
