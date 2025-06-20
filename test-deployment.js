/**
 * Simple test script to verify n8n MCP Server deployment
 * Usage: node test-deployment.js [worker-url]
 */

const WORKER_URL = process.argv[2] || 'https://n8n-mcp-server.your-subdomain.workers.dev';

async function testEndpoint(path, data = {}) {
  try {
    const response = await fetch(`${WORKER_URL}${path}`, {
      method: path === '/health' ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: path === '/health' ? undefined : JSON.stringify(data)
    });

    const result = await response.json();
    console.log(`? ${path}:`, response.status, result);
    return { success: true, status: response.status, data: result };
  } catch (error) {
    console.log(`? ${path}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`? Testing n8n MCP Server deployment at: ${WORKER_URL}\n`);

  // Test health endpoint
  await testEndpoint('/health');
  
  // Test MCP endpoints (will fail without proper n8n setup, but tests connectivity)
  await testEndpoint('/mcp/listWorkflows');
  await testEndpoint('/mcp/listTags');
  await testEndpoint('/mcp/listCredentials');

  console.log('\n? Deployment test completed!');
  console.log('Note: MCP endpoints may return errors without proper n8n API configuration.');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}