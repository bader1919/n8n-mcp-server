import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const N8N_API_BASE_URL = process.env.N8N_API_BASE_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

// Configure axios defaults
const api = axios.create({
  baseURL: N8N_API_BASE_URL,
  headers: {
    'X-N8N-API-KEY': N8N_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Helper function to handle API requests
const handleApiRequest = async (req, res, apiMethod, apiPath, dataTransformer = null) => {
  try {
    const requestData = dataTransformer ? dataTransformer(req.body) : req.body;
    const response = await apiMethod(`${apiPath}`, requestData);
    return res.json(response.data);
  } catch (error) {
    console.error(`Error on ${apiPath}:`, error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
};

// Define MCP endpoints

// Workflows endpoints
app.post('/mcp/listWorkflows', async (req, res) => {
  try {
    const response = await api.get('/workflows');
    return res.json(response.data);
  } catch (error) {
    console.error('Error listing workflows:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/getWorkflow', async (req, res) => {
  try {
    const { workflowId } = req.body;
    if (!workflowId) {
      return res.status(400).json({ error: 'workflowId is required' });
    }
    
    const response = await api.get(`/workflows/${workflowId}`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error getting workflow:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/createWorkflow', async (req, res) => {
  return handleApiRequest(req, res, api.post, '/workflows');
});

app.post('/mcp/updateWorkflow', async (req, res) => {
  try {
    const { workflowId, workflowData } = req.body;
    if (!workflowId || !workflowData) {
      return res.status(400).json({ error: 'workflowId and workflowData are required' });
    }
    
    const response = await api.put(`/workflows/${workflowId}`, workflowData);
    return res.json(response.data);
  } catch (error) {
    console.error('Error updating workflow:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/deleteWorkflow', async (req, res) => {
  try {
    const { workflowId } = req.body;
    if (!workflowId) {
      return res.status(400).json({ error: 'workflowId is required' });
    }
    
    const response = await api.delete(`/workflows/${workflowId}`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error deleting workflow:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/activateWorkflow', async (req, res) => {
  try {
    const { workflowId } = req.body;
    if (!workflowId) {
      return res.status(400).json({ error: 'workflowId is required' });
    }
    
    const response = await api.post(`/workflows/${workflowId}/activate`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error activating workflow:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/deactivateWorkflow', async (req, res) => {
  try {
    const { workflowId } = req.body;
    if (!workflowId) {
      return res.status(400).json({ error: 'workflowId is required' });
    }
    
    const response = await api.post(`/workflows/${workflowId}/deactivate`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error deactivating workflow:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

// Executions endpoints
app.post('/mcp/listExecutions', async (req, res) => {
  try {
    const { workflowId, limit, lastId } = req.body;
    let url = '/executions';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (workflowId) params.append('workflowId', workflowId);
    if (limit) params.append('limit', limit);
    if (lastId) params.append('lastId', lastId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return res.json(response.data);
  } catch (error) {
    console.error('Error listing executions:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/getExecution', async (req, res) => {
  try {
    const { executionId } = req.body;
    if (!executionId) {
      return res.status(400).json({ error: 'executionId is required' });
    }
    
    const response = await api.get(`/executions/${executionId}`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error getting execution:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/deleteExecution', async (req, res) => {
  try {
    const { executionId } = req.body;
    if (!executionId) {
      return res.status(400).json({ error: 'executionId is required' });
    }
    
    const response = await api.delete(`/executions/${executionId}`);
    return res.json(response.data);
  } catch (error) {
    console.error('Error deleting execution:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.post('/mcp/executeWorkflow', async (req, res) => {
  try {
    const { workflowId, data } = req.body;
    if (!workflowId) {
      return res.status(400).json({ error: 'workflowId is required' });
    }
    
    const payload = data || {};
    const response = await api.post(`/workflows/${workflowId}/execute`, payload);
    return res.json(response.data);
  } catch (error) {
    console.error('Error executing workflow:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});