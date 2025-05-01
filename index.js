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