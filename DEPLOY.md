# n8n MCP Server - Cloudflare Workers Deployment

This repository contains an n8n MCP (Model Context Protocol) server that has been adapted to run on Cloudflare Workers for serverless deployment.

## ? Features

- **Serverless Architecture**: Runs on Cloudflare Workers with automatic scaling
- **Global Distribution**: Available worldwide through Cloudflare's edge network
- **Zero Infrastructure**: No servers to manage or maintain
- **Cost Effective**: Pay only for actual usage
- **High Performance**: Low latency responses from edge locations

## ? Prerequisites

- A Cloudflare account
- An n8n instance with API access
- n8n API key
- GitHub account (for automated deployments)

## ?? Deployment Methods

### Method 1: Automated GitHub Deployment (Recommended)

1. **Fork this repository** to your GitHub account

2. **Set up GitHub Secrets** in your repository:
   - Go to Settings ? Secrets and variables ? Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `N8N_API_KEY`: Your n8n API key
     - `N8N_API_BASE_URL`: Your n8n instance URL (e.g., `https://your-n8n.com/api/v1`)

3. **Get Cloudflare API Token**:
   - Visit [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Create a custom token with permissions:
     - `Account:Cloudflare Workers:Edit`
     - `Zone:Zone:Read` (if using custom domain)

4. **Push to main branch** - deployment happens automatically!

### Method 2: Manual Deployment with Wrangler

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Set environment variables**:
   ```bash
   wrangler secret put N8N_API_KEY
   wrangler secret put N8N_API_BASE_URL
   ```

4. **Deploy**:
   ```bash
   npm install
   npm run deploy
   ```

## ? Configuration

### Environment Variables

Set these in Cloudflare Workers dashboard or via Wrangler:

- `N8N_API_BASE_URL`: Your n8n API endpoint (e.g., `https://your-n8n.com/api/v1`)
- `N8N_API_KEY`: Your n8n API key for authentication

### Custom Domain (Optional)

To use a custom domain, update `wrangler.toml`:

```toml
[env.production.routes]
pattern = "mcp.yourdomain.com/*"
zone_name = "yourdomain.com"
```

## ? API Endpoints

Once deployed, your MCP server will be available at:
`https://n8n-mcp-server.your-subdomain.workers.dev`

### Available Endpoints:

#### Workflows
- `POST /mcp/listWorkflows` - List all workflows
- `POST /mcp/getWorkflow` - Get specific workflow by ID
- `POST /mcp/createWorkflow` - Create new workflow
- `POST /mcp/updateWorkflow` - Update existing workflow
- `POST /mcp/deleteWorkflow` - Delete workflow
- `POST /mcp/activateWorkflow` - Activate workflow
- `POST /mcp/deactivateWorkflow` - Deactivate workflow
- `POST /mcp/executeWorkflow` - Execute workflow

#### Executions
- `POST /mcp/listExecutions` - List workflow executions
- `POST /mcp/getExecution` - Get specific execution
- `POST /mcp/deleteExecution` - Delete execution

#### Credentials
- `POST /mcp/listCredentials` - List credentials
- `POST /mcp/createCredential` - Create credential
- `POST /mcp/updateCredential` - Update credential
- `POST /mcp/deleteCredential` - Delete credential

#### Tags
- `POST /mcp/listTags` - List tags
- `POST /mcp/createTag` - Create tag
- `POST /mcp/deleteTag` - Delete tag

#### Health Check
- `GET /` or `GET /health` - Server status and available endpoints

## ? Testing Your Deployment

1. **Health Check**:
   ```bash
   curl https://your-worker-url.workers.dev/health
   ```

2. **List Workflows**:
   ```bash
   curl -X POST https://your-worker-url.workers.dev/mcp/listWorkflows \
     -H "Content-Type: application/json"
   ```

3. **Execute Workflow**:
   ```bash
   curl -X POST https://your-worker-url.workers.dev/mcp/executeWorkflow \
     -H "Content-Type: application/json" \
     -d '{"workflowId": "your-workflow-id", "data": {"input": "test"}}'
   ```

## ? Integration with Claude and AI Assistants

### Using with Claude Desktop

Add to your MCP settings:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["path/to/mcp-client.js"],
      "env": {
        "MCP_SERVER_URL": "https://your-worker-url.workers.dev"
      }
    }
  }
}
```

### Direct HTTP Integration

You can integrate directly with any AI assistant by making HTTP POST requests to the MCP endpoints.

## ? Business Benefits

This serverless deployment offers significant advantages for consultancy and business automation:

- **Scalability**: Handles traffic spikes automatically
- **Reliability**: 99.9% uptime SLA from Cloudflare
- **Global Reach**: Low latency worldwide
- **Cost Optimization**: Pay only for actual usage
- **Security**: Built-in DDoS protection and SSL

## ?? Security Considerations

- API keys are stored as encrypted secrets in Cloudflare
- CORS headers configured for browser compatibility
- Rate limiting available through Cloudflare
- SSL/TLS encryption by default

## ? Monitoring and Analytics

Monitor your deployment through:
- Cloudflare Workers dashboard
- Real-time logs and metrics
- Custom analytics and alerts
- Performance insights

## ? Development Workflow

1. **Local Development**:
   ```bash
   npm run dev:worker
   ```

2. **Testing**:
   ```bash
   npm run test:worker
   ```

3. **Staging Deployment**:
   ```bash
   npm run deploy:staging
   ```

4. **Production Deployment**:
   ```bash
   npm run deploy
   ```

## ? Performance Optimization

- Edge caching for static responses
- Minimal cold start times
- Efficient request routing
- Global load distribution

## ? Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Check your n8n API key
2. **CORS Errors**: Ensure proper headers are configured
3. **Timeout Issues**: Verify n8n instance accessibility
4. **Deployment Failures**: Check GitHub secrets configuration

### Debugging:

- Check Cloudflare Workers logs
- Verify environment variables
- Test n8n API connectivity
- Review GitHub Actions logs

## ? Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [n8n API Documentation](https://docs.n8n.io/api/)
- [MCP Protocol Specification](https://github.com/microsoft/mcp)
- [BY MB Consultancy Services](https://github.com/bader1919)

## ? License

MIT License - see LICENSE file for details.

## ? Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ? Support

For professional implementation and customization services, contact BY MB Consultancy.

---

**Powered by BY MB Consultancy** - Expert solutions in automation, data analytics, and digital transformation.