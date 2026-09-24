#!/usr/bin/env node
/**
 * 21st.dev MCP Server Proxy
 * Model Context Protocol (MCP) server for 21st.dev component library.
 * Reads API key from environment or .env, and proxies requests to https://21st.dev/api/mcp
 */

const readline = require('readline');
const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVER_NAME = 'twentyfirst-mcp';
const SERVER_VERSION = '1.0.0';

// Try to read API key from environment or .env file
function getApiKey() {
  if (process.env.API_KEY_21ST) return process.env.API_KEY_21ST;
  if (process.env.TWENTYFIRST_TOKEN) return process.env.TWENTYFIRST_TOKEN;
  if (process.env.TWENTY_FIRST_API_KEY) return process.env.TWENTY_FIRST_API_KEY;

  // Check .env in current directory or parent
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, 'twentyfirst.key')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/API_KEY_21ST\s*=\s*["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          return match[1].trim();
        }
      } catch {}
    }
  }
  return '';
}

const FALLBACK_TOOLS = [
  {
    name: "search_21st_components",
    description: "Search 21st.dev registry for modern React, Tailwind, Framer Motion, and shadcn UI components.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g. 'hero section', 'bento grid', 'command palette', 'radar chart', 'card beam')."
        },
        limit: {
          type: "number",
          description: "Max results to return (default 5)."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "get_21st_component",
    description: "Retrieve full source code and dependencies for a 21st.dev component by its ID or slug.",
    inputSchema: {
      type: "object",
      properties: {
        componentId: {
          type: "string",
          description: "Component slug or ID from 21st.dev search."
        }
      },
      required: ["componentId"]
    }
  },
  {
    name: "get_21st_status",
    description: "Check if 21st.dev API key is configured and display quota information.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

function proxyTo21st(requestPayload, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(requestPayload);
    const options = {
      hostname: '21st.dev',
      port: 443,
      path: '/api/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-api-key': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': '21st-mcp-client/1.0.0'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch {
          resolve({
            jsonrpc: '2.0',
            id: requestPayload.id,
            error: { code: -32000, message: `Invalid response from 21st.dev: ${body.slice(0, 150)}` }
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        jsonrpc: '2.0',
        id: requestPayload.id,
        error: { code: -32000, message: `Network error connecting to 21st.dev: ${err.message}` }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        jsonrpc: '2.0',
        id: requestPayload.id,
        error: { code: -32000, message: 'Request to 21st.dev timed out.' }
      });
    });

    req.write(data);
    req.end();
  });
}

async function processMessage(msg) {
  const { id, method, params } = msg;
  const apiKey = getApiKey();

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        }
      }
    };
  }

  if (method === 'notifications/initialized') {
    return null;
  }

  if (method === 'tools/list') {
    if (apiKey) {
      try {
        const remoteRes = await proxyTo21st(msg, apiKey);
        if (remoteRes && remoteRes.result && remoteRes.result.tools) {
          return remoteRes;
        }
      } catch {}
    }
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: FALLBACK_TOOLS
      }
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;

    if (name === 'get_21st_status') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                server: '21st.dev MCP Proxy',
                apiKeyConfigured: Boolean(apiKey),
                maskedKey: apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'NOT_FOUND',
                help: apiKey 
                  ? 'API key active. Queries will be proxied directly to 21st.dev.' 
                  : 'No API key detected. Add API_KEY_21ST to .env file or opencode.json.'
              }, null, 2)
            }
          ]
        }
      };
    }

    if (apiKey) {
      // Forward call to 21st.dev endpoint
      return await proxyTo21st(msg, apiKey);
    } else {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `[21st.dev MCP] API key is missing. Please add your key to .env file: API_KEY_21ST=your_key_here or provide it in opencode.json. Get a key at https://21st.dev/mcp`
            }
          ]
        }
      };
    }
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method not implemented: ${method}`
    }
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    const response = await processMessage(parsed);
    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    process.stderr.write(`[twentyfirst-mcp] Error: ${err.message}\n`);
  }
});

process.stderr.write(`[twentyfirst-mcp] Server initialized on stdio. v${SERVER_VERSION}\n`);
