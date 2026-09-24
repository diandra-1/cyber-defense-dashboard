#!/usr/bin/env node
/**
 * Aura Build MCP Server
 * Model Context Protocol (MCP) server providing design tokens, architectural component
 * blueprints, and anti-AI-slop validation inspired by aura.build & 21st.dev.
 */

const readline = require('readline');

const SERVER_NAME = 'aura-build-mcp';
const SERVER_VERSION = '1.0.0';

const AURA_TOKENS = {
  philosophy: "Architectural restraint, high typographical precision, purposeful contrast, zero AI-slop",
  canvas: {
    background: "#F8F9FB",
    gridPattern: "radial-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px) with 24px/28px step",
    surface: "#FFFFFF",
    hairlineBorder: "rgba(15, 23, 42, 0.08)",
    hairlineHover: "rgba(15, 23, 42, 0.16)"
  },
  contrastRail: {
    sidebarBackground: "#111215",
    sidebarHover: "#1A1D23",
    sidebarBorder: "#232730",
    activePill: "rgba(255, 255, 255, 0.08)",
    textColor: "#F8FAFC",
    mutedColor: "#64748B"
  },
  signals: {
    rule: "Color must carry functional status only, never decorative wallpaper",
    urgentRed: { hex: "#F2542D", bg: "rgba(242, 84, 45, 0.08)", usage: "Active threats, isolated nodes, critical breaches" },
    telemetryBlue: { hex: "#2563EB", bg: "rgba(37, 99, 235, 0.08)", usage: "Live gateway streams, nominal connections, primary links" },
    healthyEmerald: { hex: "#10B981", bg: "rgba(16, 185, 129, 0.08)", usage: "Protected endpoints, synchronized policies, 0 bypasses" },
    warningAmber: { hex: "#F59E0B", bg: "rgba(245, 158, 11, 0.08)", usage: "Pending firmware updates, anomalous spikes" }
  },
  typography: {
    headings: "Space Grotesk or Plus Jakarta Sans with negative tracking (-0.025em to -0.035em)",
    body: "Plus Jakarta Sans, 400/500 weight, line-height 1.5",
    dataFigures: "DM Mono with font-feature-settings: 'tnum' on, 'zero' on (strictly for IPs, bandwidth, ports, timestamps, counts)"
  },
  elevation: {
    subtle: "0 1px 3px rgba(0,0,0,0.02), 0 6px 18px rgba(15, 23, 42, 0.03)",
    elevatedHover: "0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)"
  }
};

const AURA_BLUEPRINTS = {
  "hero-stream": {
    name: "Hero Bandwidth Telemetry Stream",
    description: "Dominant 70% width area chart with live scanning laser, tabular Mbps gauges, and stacked protocol progress bar",
    keyPatterns: [
      "70% dominant width vs 30% secondary posture card",
      "SVG polyline + area polygon with gradient stop opacity",
      "Live pulsing tip circle and animated scan-line overlay",
      "Protocol stacked multi-colored bar (HTTPS, WireGuard, DNS, SSH)"
    ]
  },
  "instrument-gauge": {
    name: "Instrument Security Posture Gauge",
    description: "Circular SVG stroke-dashoffset arc indicator with pass/fail subsystem checklist",
    keyPatterns: [
      "Avoids generic donut chart; uses calibrated instrument arc (e.g. 94/100)",
      "Subsystem rows with status dots (Firewall, DNS, EDR agent, Patching)",
      "Interactive click feedback on each subsystem"
    ]
  },
  "topology-graph": {
    name: "Interactive Network Topology & Containment Graph",
    description: "Bézier curve network mesh with pulsing flow particles and one-click host isolation switch",
    keyPatterns: [
      "Edge gateway central router connecting WAN to internal endpoints",
      "Dynamic SVG risk path that severs/disconnects upon endpoint quarantine",
      "Inspection drawer displaying node IP, EDR agent status, and containment action"
    ]
  },
  "command-palette": {
    name: "21st.dev Spotlight Command Palette (⌘K)",
    description: "Keyboard-first modal with instant action triggers, category tags, and search filter",
    keyPatterns: [
      "Triggered globally by Cmd+K or Ctrl+K",
      "Quick actions for threat simulation, host isolation, PCAP export",
      "Live search matching active alerts, IP addresses, and routes"
    ]
  },
  "entropy-sandbox": {
    name: "Client-Side Malware Entropy Sandbox",
    description: "Drag-and-drop file inspection with Shannon entropy calculation and SHA-256 fingerprint",
    keyPatterns: [
      "Zero execution/upload - 100% private in browser memory",
      "PE binary header detection and double-extension heuristics",
      "Quarantine vault with purge capability"
    ]
  }
};

const TOOLS = [
  {
    name: "get_aura_tokens",
    description: "Retrieve official aura.build architectural design tokens (colors, typography, elevation, and layout rules) to build non-AI-slop UIs.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["all", "canvas", "contrastRail", "signals", "typography", "elevation"],
          description: "Optional specific token category to fetch."
        }
      }
    }
  },
  {
    name: "search_aura_blueprints",
    description: "Search production component blueprints modeled after aura.build and 21st.dev (e.g., hero stream, command palette, network topology, posture gauge).",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term such as 'stream', 'topology', 'command', 'gauge', or 'sandbox'."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "audit_anti_ai_slop",
    description: "Analyze code snippet or UI design description against concrete AI-slop anti-patterns (e.g. middle-dot eyebrows, colored words in headlines, generic donuts, identical cards).",
    inputSchema: {
      type: "object",
      properties: {
        codeOrSnippet: {
          type: "string",
          description: "HTML, JSX, or CSS snippet to check for AI-slop patterns."
        }
      },
      required: ["codeOrSnippet"]
    }
  }
];

function handleAudit(snippet) {
  const issues = [];

  if (/·\s*[A-Z]{3,}/.test(snippet) || /[A-Z]{3,}\s*·/.test(snippet)) {
    issues.push({
      severity: "high",
      tell: "All-caps eyebrow label joined with a middle dot (e.g. 'LIVE DEFENSE · OVERVIEW')",
      fix: "Use clean sentence case or small mono tag. A single pulsing ping dot is sufficient."
    });
  }

  if (/<(i|span|em|b)[^>]*class=["'][^"']*(text-|color-)[^"']*["']>[^<]+<\/\1>/i.test(snippet) && /h[1-3]/i.test(snippet)) {
    issues.push({
      severity: "high",
      tell: "Decoratively coloring a single word inside a headline (e.g. 'A clearer view of <span class=\"text-orange\">today\'s</span> defense')",
      fix: "Keep headlines strictly monochrome. Reserve color exclusively for real data signals and alerts."
    });
  }

  if (/(from-purple|to-pink|from-indigo-500|gradient.*purple)/i.test(snippet)) {
    issues.push({
      severity: "medium",
      tell: "Generic purple/violet SaaS AI gradient",
      fix: "Replace with architectural off-white canvas (#F8F9FB) with crisp hairline borders (rgba(15,23,42,0.08))."
    });
  }

  if (/donut|piechart/i.test(snippet)) {
    issues.push({
      severity: "medium",
      tell: "Generic donut/ring chart for score summary",
      fix: "Use an instrument-style radial arc or a stacked subsystem pass/fail checklist."
    });
  }

  return {
    clean: issues.length === 0,
    score: issues.length === 0 ? "100% Anti-AI-Slop Compliant" : `${Math.max(0, 100 - issues.length * 25)}% Compliance`,
    detectedIssues: issues
  };
}

function processMessage(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
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
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS
      }
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;

    if (name === 'get_aura_tokens') {
      const category = args?.category;
      const data = category && category !== 'all' ? AURA_TOKENS[category] : AURA_TOKENS;
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        }
      };
    }

    if (name === 'search_aura_blueprints') {
      const q = (args?.query || '').toLowerCase();
      const results = Object.entries(AURA_BLUEPRINTS)
        .filter(([key, val]) => key.includes(q) || val.name.toLowerCase().includes(q) || val.description.toLowerCase().includes(q))
        .map(([key, val]) => ({ key, ...val }));

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2)
            }
          ]
        }
      };
    }

    if (name === 'audit_anti_ai_slop') {
      const result = handleAudit(args?.codeOrSnippet || '');
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        }
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Tool not found: ${name}`
      }
    };
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

// Read stdin line by line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    const response = processMessage(parsed);
    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    process.stderr.write(`[aura-build-mcp] Error parsing message: ${err.message}\n`);
  }
});

process.stderr.write(`[aura-build-mcp] Server initialized on stdio. v${SERVER_VERSION}\n`);
