# Sentinel

> Security Operations Center (SOC) telemetry dashboard with real-time network packet inspection, interactive 3D WebGL edge mapping, and host containment workflows.

![Sentinel Preview](./preview.png)

---

## Overview

**Sentinel** is an operations dashboard built for security analysts, incident responders, and network administrators. Designed as an instrument-grade workstation interface, Sentinel prioritizes high information density, precise tabular data visualization, and instant mitigation controls over decorative styling.

The dashboard provides end-to-end visibility across gateway throughput, endpoint infection pathways, geographic authentication attacks, and client-side binary heuristic analysis.

---

## Key Modules

### 1. Gateway Traffic & Telemetry Stream
- **Dual-Stream Telemetry**: Smooth SVG-rendered curves visualizing ingress and egress bandwidth in real time.
- **Scrubbing Inspector**: Hover-based vertical cursor scrubbing for exact timestamp and throughput readouts.
- **Time Windows**: Multi-window analysis across `1h`, `6h`, `24h`, and `7d` snapshots.
- **Surge Simulation**: On-demand traffic burst testing to evaluate anomaly detection under load.

### 2. Network Topology & Host Containment
- **Interactive SVG Topology**: Visual node-link map linking the primary gateway, core switch, application servers, database clusters, and corporate workstations.
- **Host Containment**: One-click route isolation for suspect endpoints, severing active network bridges while maintaining isolated telemetry.

### 3. Global 3D Edge Telemetry
- **60 FPS WebGL Globe**: Powered by [Cobe](https://github.com/shuding/cobe), tracking request volume and latency across 8 global edge Points of Presence (PoPs).
- **Interactive Spatial Controls**: Drag-to-rotate with inertia damping and animated threat ping markers.

### 4. Brute Force & Credential Velocity
- **Burst Pattern Histogram**: Visual attack frequency graphs distinguishing distributed scans from localized stuffing.
- **Geographic Origin Analysis**: Country-ranked offender lists and ASN mapping.
- **Impossible Travel Detection**: Flagging credentials authenticated across distant geographic regions within impossible time intervals.

### 5. Client-Side Heuristic Malware Sandbox
- **Shannon Entropy Analysis**: Computes byte distribution randomness to detect obfuscated payloads and encrypted packers.
- **Deterministic Cryptographic Hashing**: In-browser SHA-256 fingerprinting of dropped files.
- **Threat Signatures**: Matches metadata against known ransomware, Trojan dropper, and keylogger behavioral profiles.

### 6. Incident Triage & Quick Actions
- **Kanban Board**: Drag-and-drop or one-click incident triage lifecycle (`Investigating` → `Contained` → `Resolved`).
- **Command Palette**: Universal keyboard navigation via `⌘K` or `Ctrl+K` for instant filtering, host isolation, and incident escalation.

---

## Architecture & Codebase Layout

```
cyber-defense-dashboard/
├── public/                 # Static assets and HTML template
├── src/
│   ├── components/         # Modular dashboard widgets
│   │   ├── AlertPanel.jsx        # Persistent threat feed ticker
│   │   ├── AssetsView.jsx        # Zero-trust managed endpoint inventory
│   │   ├── BruteForceMonitor.jsx # Authentication attempt analytics
│   │   ├── CommandPalette.jsx    # Global keyboard modal
│   │   ├── Header.jsx            # Top navigation bar and status indicators
│   │   ├── IncidentBoard.jsx     # Kanban triage management board
│   │   ├── IncidentModal.jsx     # Detailed threat investigation view
│   │   ├── LoginPage.jsx         # Analyst authentication view
│   │   ├── MalwareDetection.jsx  # Client-side heuristic entropy sandbox
│   │   ├── NetworkTopology.jsx   # Interactive SVG node containment map
│   │   ├── NetworkTraffic.jsx    # Live throughput dual-stream chart
│   │   ├── ReportsView.jsx       # Shift briefs and compliance export
│   │   ├── StatCard.jsx          # Metric cards with tabular figures
│   │   ├── SystemPosture.jsx     # Security subsystem health gauge
│   │   └── ThreatRadarMap.jsx    # 3D WebGL Cobe edge mesh
│   ├── data/
│   │   └── mockData.js           # Baseline operational data & threat vectors
│   ├── services/
│   │   └── securityStore.js      # Session & topology state persistence
│   ├── App.jsx             # Main dashboard controller and layout shell
│   ├── index.css           # Design tokens, typography, and utility classes
│   └── index.js            # React application entry point
├── tailwind.config.js      # Design system color and grid configuration
└── package.json            # Dependencies and build scripts
```

---

## Design System

Sentinel utilizes a light console theme optimized for prolonged operational shifts:
- **Canvas**: Neutral off-white (`#F8F9FB`) minimizing screen glare.
- **Sidebar**: High-contrast dark charcoal (`#111215`) for visual anchor and navigation clarity.
- **Semantic Accents**: Coral red (`#F2542D`) strictly reserved for active incidents; Signal blue (`#2563EB`) for nominal streaming telemetry.
- **Typography**: Display headings in *Outfit*, paired with *Plus Jakarta Sans* for UI elements and tabular monospace figures for metrics, IP addresses, and timestamps.

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **WebGL 3D Rendering**: [Cobe](https://github.com/shuding/cobe)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: Create React App / Webpack 5

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or newer recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cyber-defense-dashboard.git
   cd cyber-defense-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to access the dashboard.

4. Build for production:
   ```bash
   npm run build
   ```
   Optimized production bundles will be compiled to the `build/` directory.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` / `Ctrl+K` | Open / Close Command Palette |
| `Escape` | Dismiss modals and overlays |
| `↑` / `↓` | Navigate command list |
| `Enter` | Execute selected command |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
