const ALERTS_KEY = 'sentinel.security.alerts';
const TOPOLOGY_KEY = 'sentinel.security.topology';
const SESSION_KEY = 'sentinel.security.session';

export const initialAlerts = [
  { id: 1, title: 'Ransomware beacon', source: '185.220.101.42', country: 'Netherlands', severity: 'Critical', time: 'Just now', detail: 'Encrypted command-and-control behavior matched an endpoint pattern on WS-14.' },
  { id: 2, title: 'Brute force burst', source: '45.155.205.233', country: 'Russia', severity: 'High', time: '2 min ago', detail: '42 failed SSH attempts were blocked by the edge gateway.' },
  { id: 3, title: 'Suspicious DNS', source: '103.78.213.4', country: 'Indonesia', severity: 'Medium', time: '7 min ago', detail: 'Unusual DNS query frequency was observed from Laptop-John.' },
  { id: 4, title: 'Port scan detected', source: '89.248.165.121', country: 'Germany', severity: 'Medium', time: '12 min ago', detail: 'Sequential scans targeted ports 22, 80, 443 and 3389.' },
];

const read = (key, fallback) => {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};

const write = (key, value) => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {} };

export const loadAlerts = () => read(ALERTS_KEY, initialAlerts);
export const saveAlerts = alerts => write(ALERTS_KEY, alerts);
export const loadTopology = () => read(TOPOLOGY_KEY, { isolated: false });
export const saveTopology = topology => write(TOPOLOGY_KEY, topology);
export const loadSession = () => read(SESSION_KEY, null);
export const saveSession = session => write(SESSION_KEY, session);
export const clearSession = () => { try { window.localStorage.removeItem(SESSION_KEY); } catch {} };
