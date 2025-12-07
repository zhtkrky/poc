const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const projectService = require('./services/projectService');
const diagnosisService = require('./services/diagnosisService');

const app = express();
const prisma = new PrismaClient();
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
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await prisma.stat.findMany();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Project CRUD Routes
// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const { search } = req.query;
    const projects = await projectService.getAllProjects(search);
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new project
app.post('/api/projects', async (req, res) => {
  try {
    const newProject = await projectService.createProject(req.body);
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await projectService.updateProject(req.params.id, req.body);
    res.json({ success: true, data: updatedProject });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 400;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

app.get('/api/performance', async (req, res) => {
  try {
    const performance = await prisma.performance.findFirst();
    if (performance) {
      performance.data = JSON.parse(performance.data);
    }
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/summary', async (req, res) => {
  try {
    const summary = await prisma.summary.findFirst();
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Car Diagnosis Routes
// GET all diagnoses
app.get('/api/diagnosis', async (req, res) => {
  try {
    const diagnoses = await diagnosisService.getAllDiagnoses();
    res.json({ success: true, data: diagnoses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET diagnosis by ID
app.get('/api/diagnosis/:id', async (req, res) => {
  try {
    const diagnosis = await diagnosisService.getDiagnosisById(req.params.id);
    if (!diagnosis) {
      return res.status(404).json({ success: false, error: 'Diagnosis not found' });
    }
    res.json({ success: true, data: diagnosis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new diagnosis
app.post('/api/diagnosis', async (req, res) => {
  try {
    const newDiagnosis = await diagnosisService.createDiagnosis(req.body);
    res.status(201).json({ success: true, data: newDiagnosis });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update diagnosis vehicle info
app.put('/api/diagnosis/:id', async (req, res) => {
  try {
    const updatedDiagnosis = await diagnosisService.updateDiagnosis(req.params.id, req.body);
    res.json({ success: true, data: updatedDiagnosis });
  } catch (error) {
    const statusCode = error.message === 'Diagnosis not found' ? 404 : 400;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// PUT update part status
app.put('/api/diagnosis/:id/parts/:partId', async (req, res) => {
  try {
    const updatedPart = await diagnosisService.updatePart(req.params.id, req.params.partId, req.body);
    res.json({ success: true, data: updatedPart });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// DELETE diagnosis
app.delete('/api/diagnosis/:id', async (req, res) => {
  try {
    await diagnosisService.deleteDiagnosis(req.params.id);
    res.json({ success: true, message: 'Diagnosis deleted successfully' });
  } catch (error) {
    const statusCode = error.message === 'Diagnosis not found' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const [stats, tasks, projects, performance, summary] = await Promise.all([
      prisma.stat.findMany(),
      prisma.task.findMany(),
      projectService.getAllProjects(),
      prisma.performance.findFirst(),
      prisma.summary.findFirst()
    ]);

    if (performance) {
      performance.data = JSON.parse(performance.data);
    }

    res.json({ 
      success: true, 
      data: {
        stats,
        tasks,
        projects,
        performance,
        summary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Connected to SQLite database via Prisma`);
});
