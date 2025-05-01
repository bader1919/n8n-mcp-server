// This is an example client script to demonstrate how to use the N8N MCP server
// You would typically implement these functions in your MCP client application

async function listWorkflows() {
  const response = await fetch('http://localhost:3000/mcp/listWorkflows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  });
  
  return await response.json();
}

async function getWorkflow(workflowId) {
  const response = await fetch('http://localhost:3000/mcp/getWorkflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workflowId })
  });
  
  return await response.json();
}

async function createWorkflow(workflowData) {
  const response = await fetch('http://localhost:3000/mcp/createWorkflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData)
  });
  
  return await response.json();
}

async function executeWorkflow(workflowId, data = {}) {
  const response = await fetch('http://localhost:3000/mcp/executeWorkflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workflowId, data })
  });
  
  return await response.json();
}

async function listExecutions(workflowId, limit = 20) {
  const response = await fetch('http://localhost:3000/mcp/listExecutions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workflowId, limit })
  });
  
  return await response.json();
}

// Example workflow data for creating a new workflow
const exampleWorkflow = {
  name: "Example Workflow",
  nodes: [
    {
      parameters: {},
      name: "Start",
      type: "n8n-nodes-base.start",
      typeVersion: 1,
      position: [100, 300]
    }
  ],
  connections: {},
  active: false,
  settings: {
    saveManualExecutions: true,
    callerPolicy: "workflowsFromSameOwner"
  }
};

// Example usage
(async () => {
  try {
    // Uncomment and use these examples as needed
    
    // List all workflows
    // const workflows = await listWorkflows();
    // console.log('All workflows:', workflows);
    
    // Create a new workflow
    // const newWorkflow = await createWorkflow(exampleWorkflow);
    // console.log('Created workflow:', newWorkflow);
    
    // Execute a workflow (replace with your actual workflow ID)
    // const execution = await executeWorkflow('123', { data: 'input data' });
    // console.log('Workflow execution:', execution);
    
    // List executions for a workflow (replace with your actual workflow ID)
    // const executions = await listExecutions('123');
    // console.log('Workflow executions:', executions);
  } catch (error) {
    console.error('Error:', error);
  }
})();