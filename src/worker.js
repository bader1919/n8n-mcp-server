/**
 * Cloudflare Workers adapter for n8n MCP Server
 * Adapts the Express-style server to work with Cloudflare Workers
 */

// N8N MCP Server for Cloudflare Workers
class N8nMCPServer {
  constructor(env) {
    this.baseUrl = env.N8N_API_BASE_URL || 'http://localhost:5678/api/v1';
    this.apiKey = env.N8N_API_KEY;
  }

  async handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers for browser compatibility
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-N8N-API-KEY',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling based on MCP endpoints
      switch (path) {
        case '/mcp/listWorkflows':
          return await this.listWorkflows(request, corsHeaders);
        case '/mcp/getWorkflow':
          return await this.getWorkflow(request, corsHeaders);
        case '/mcp/createWorkflow':
          return await this.createWorkflow(request, corsHeaders);
        case '/mcp/updateWorkflow':
          return await this.updateWorkflow(request, corsHeaders);
        case '/mcp/deleteWorkflow':
          return await this.deleteWorkflow(request, corsHeaders);
        case '/mcp/activateWorkflow':
          return await this.activateWorkflow(request, corsHeaders);
        case '/mcp/deactivateWorkflow':
          return await this.deactivateWorkflow(request, corsHeaders);
        case '/mcp/executeWorkflow':
          return await this.executeWorkflow(request, corsHeaders);
        case '/mcp/listExecutions':
          return await this.listExecutions(request, corsHeaders);
        case '/mcp/getExecution':
          return await this.getExecution(request, corsHeaders);
        case '/mcp/deleteExecution':
          return await this.deleteExecution(request, corsHeaders);
        case '/mcp/listCredentials':
          return await this.listCredentials(request, corsHeaders);
        case '/mcp/createCredential':
          return await this.createCredential(request, corsHeaders);
        case '/mcp/updateCredential':
          return await this.updateCredential(request, corsHeaders);
        case '/mcp/deleteCredential':
          return await this.deleteCredential(request, corsHeaders);
        case '/mcp/listTags':
          return await this.listTags(request, corsHeaders);
        case '/mcp/createTag':
          return await this.createTag(request, corsHeaders);
        case '/mcp/deleteTag':
          return await this.deleteTag(request, corsHeaders);
        case '/':
        case '/health':
          return new Response(JSON.stringify({ 
            status: 'ok', 
            message: 'n8n MCP Server is running on Cloudflare Workers!',
            endpoints: [
              '/mcp/listWorkflows', '/mcp/getWorkflow', '/mcp/createWorkflow',
              '/mcp/updateWorkflow', '/mcp/deleteWorkflow', '/mcp/activateWorkflow',
              '/mcp/deactivateWorkflow', '/mcp/executeWorkflow', '/mcp/listExecutions',
              '/mcp/getExecution', '/mcp/deleteExecution', '/mcp/listCredentials',
              '/mcp/createCredential', '/mcp/updateCredential', '/mcp/deleteCredential',
              '/mcp/listTags', '/mcp/createTag', '/mcp/deleteTag'
            ]
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        default:
          return new Response(JSON.stringify({ error: 'Endpoint not found' }), { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('Server error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async makeN8nRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'X-N8N-API-KEY': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  async listWorkflows(request, corsHeaders) {
    try {
      const workflows = await this.makeN8nRequest('/workflows');
      return new Response(JSON.stringify(workflows), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async getWorkflow(request, corsHeaders) {
    try {
      const body = await request.json();
      const { workflowId } = body;
      
      if (!workflowId) {
        return new Response(JSON.stringify({ error: 'workflowId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const workflow = await this.makeN8nRequest(`/workflows/${workflowId}`);
      return new Response(JSON.stringify(workflow), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async createWorkflow(request, corsHeaders) {
    try {
      const workflowData = await request.json();
      const workflow = await this.makeN8nRequest('/workflows', {
        method: 'POST',
        body: JSON.stringify(workflowData)
      });
      return new Response(JSON.stringify(workflow), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async updateWorkflow(request, corsHeaders) {
    try {
      const body = await request.json();
      const { workflowId, workflowData } = body;
      
      if (!workflowId || !workflowData) {
        return new Response(JSON.stringify({ error: 'workflowId and workflowData are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const workflow = await this.makeN8nRequest(`/workflows/${workflowId}`, {
        method: 'PUT',
        body: JSON.stringify(workflowData)
      });
      return new Response(JSON.stringify(workflow), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async deleteWorkflow(request, corsHeaders) {
    try {
      const body = await request.json();
      const { workflowId } = body;
      
      if (!workflowId) {
        return new Response(JSON.stringify({ error: 'workflowId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await this.makeN8nRequest(`/workflows/${workflowId}`, {
        method: 'DELETE'
      });
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async activateWorkflow(request, corsHeaders) {
    try {
      const body = await request.json();
      const { workflowId } = body;
      
      if (!workflowId) {
        return new Response(JSON.stringify({ error: 'workflowId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await this.makeN8nRequest(`/workflows/${workflowId}/activate`, {
        method: 'POST'
      });
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async deactivateWorkflow(request, corsHeaders) {
    try {
      const body = await request.json();
      const { workflowId } = body;
      
      if (!workflowId) {
        return new Response(JSON.stringify({ error: 'workflowId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await this.makeN8nRequest(`/workflows/${workflowId}/deactivate`, {
        method: 'POST'
      });
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async executeWorkflow(request, corsHeaders) {
    try {
      const body = await request.json();
      const { workflowId, data } = body;

      if (!workflowId) {
        return new Response(JSON.stringify({ error: 'workflowId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const payload = data || {};
      const execution = await this.makeN8nRequest(`/workflows/${workflowId}/execute`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return new Response(JSON.stringify(execution), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async listExecutions(request, corsHeaders) {
    try {
      const body = await request.json().catch(() => ({}));
      const { workflowId, limit, lastId } = body;
      
      let url = '/executions';
      const params = new URLSearchParams();
      if (workflowId) params.append('workflowId', workflowId);
      if (limit) params.append('limit', limit);
      if (lastId) params.append('lastId', lastId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const executions = await this.makeN8nRequest(url);
      return new Response(JSON.stringify(executions), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async getExecution(request, corsHeaders) {
    try {
      const body = await request.json();
      const { executionId } = body;
      
      if (!executionId) {
        return new Response(JSON.stringify({ error: 'executionId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const execution = await this.makeN8nRequest(`/executions/${executionId}`);
      return new Response(JSON.stringify(execution), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async deleteExecution(request, corsHeaders) {
    try {
      const body = await request.json();
      const { executionId } = body;
      
      if (!executionId) {
        return new Response(JSON.stringify({ error: 'executionId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await this.makeN8nRequest(`/executions/${executionId}`, {
        method: 'DELETE'
      });
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async listCredentials(request, corsHeaders) {
    try {
      const credentials = await this.makeN8nRequest('/credentials');
      return new Response(JSON.stringify(credentials), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async createCredential(request, corsHeaders) {
    try {
      const credentialData = await request.json();
      const credential = await this.makeN8nRequest('/credentials', {
        method: 'POST',
        body: JSON.stringify(credentialData)
      });
      return new Response(JSON.stringify(credential), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async updateCredential(request, corsHeaders) {
    try {
      const body = await request.json();
      const { credentialId, credentialData } = body;
      
      if (!credentialId || !credentialData) {
        return new Response(JSON.stringify({ error: 'credentialId and credentialData are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const credential = await this.makeN8nRequest(`/credentials/${credentialId}`, {
        method: 'PATCH',
        body: JSON.stringify(credentialData)
      });
      return new Response(JSON.stringify(credential), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async deleteCredential(request, corsHeaders) {
    try {
      const body = await request.json();
      const { credentialId } = body;
      
      if (!credentialId) {
        return new Response(JSON.stringify({ error: 'credentialId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await this.makeN8nRequest(`/credentials/${credentialId}`, {
        method: 'DELETE'
      });
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async listTags(request, corsHeaders) {
    try {
      const tags = await this.makeN8nRequest('/tags');
      return new Response(JSON.stringify(tags), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async createTag(request, corsHeaders) {
    try {
      const tagData = await request.json();
      const tag = await this.makeN8nRequest('/tags', {
        method: 'POST',
        body: JSON.stringify(tagData)
      });
      return new Response(JSON.stringify(tag), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  async deleteTag(request, corsHeaders) {
    try {
      const body = await request.json();
      const { tagId } = body;
      
      if (!tagId) {
        return new Response(JSON.stringify({ error: 'tagId is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await this.makeN8nRequest(`/tags/${tagId}`, {
        method: 'DELETE'
      });
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}

// Main fetch handler for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    const server = new N8nMCPServer(env);
    return await server.handleRequest(request, env);
  }
};