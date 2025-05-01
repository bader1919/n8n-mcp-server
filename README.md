# N8N MCP Server

This is a Model Control Protocol (MCP) server for interacting with N8N's API. It provides a simplified interface to access N8N functionality through MCP endpoints.

## What is this?

This MCP server acts as a bridge between AI assistants like Claude and the N8N automation platform. It allows AI assistants to:

- List, create, update, and delete workflows
- Execute workflows and manage workflow executions
- Manage credentials and tags
- Integrate N8N capabilities into conversation flows

## Requirements

- Node.js 16+
- An N8N instance with API access
- An N8N API key

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/bader1919/n8n-mcp-server.git
   cd n8n-mcp-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your environment variables:
   - Copy `.env.example` to `.env` 
   - Fill in your N8N API details:
     - `N8N_API_BASE_URL`: URL of your N8N API (default: http://localhost:5678/api/v1)
     - `N8N_API_KEY`: Your N8N API key
     - `PORT`: Port where this MCP server will run (default: 3000)

4. Start the server:
   ```
   npm start
   ```

## Available Endpoints

### Workflows

- `/mcp/listWorkflows`: Get all workflows
- `/mcp/getWorkflow`: Get a specific workflow by ID
- `/mcp/createWorkflow`: Create a new workflow
- `/mcp/updateWorkflow`: Update an existing workflow
- `/mcp/deleteWorkflow`: Delete a workflow
- `/mcp/activateWorkflow`: Activate a workflow
- `/mcp/deactivateWorkflow`: Deactivate a workflow

### Executions

- `/mcp/listExecutions`: Get all executions, optionally filtered by workflow
- `/mcp/getExecution`: Get a specific execution by ID
- `/mcp/deleteExecution`: Delete an execution
- `/mcp/executeWorkflow`: Execute a workflow with optional data

### Credentials

- `/mcp/listCredentials`: Get all credentials
- `/mcp/getCredential`: Get a specific credential by ID
- `/mcp/createCredential`: Create a new credential
- `/mcp/updateCredential`: Update an existing credential
- `/mcp/deleteCredential`: Delete a credential

### Tags

- `/mcp/listTags`: Get all tags
- `/mcp/createTag`: Create a new tag
- `/mcp/deleteTag`: Delete a tag

## Using with Claude

To use this MCP server with Claude, install it as follows:

```
install_local_mcp_server path="./n8n-mcp-server"
```

Then you can access the N8N functionality through the MCP endpoints. Claude can help you build and execute N8N workflows through natural language conversations.

## Example Usage

Here's an example of how to list all workflows:

```javascript
// Example call to listWorkflows
const result = await listWorkflows();
console.log(result);
```

To execute a workflow:

```javascript
// Example call to executeWorkflow
const result = await executeWorkflow({
  workflowId: "1234",
  data: {
    input1: "value1",
    input2: "value2"
  }
});
console.log(result);
```

See `example-client.js` for more examples.

## Security Considerations

- This MCP server requires N8N API credentials to function
- Be cautious about exposing this server to the public internet
- Consider using API keys or other authentication mechanisms if deploying in production

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.