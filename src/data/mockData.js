export const malwareData = [
  { id: 1, type: 'Ransomware', name: 'CryptoLocker', origin: 'Russia', severity: 'critical', timestamp: '2026-09-16 13:42:15' },
  { id: 2, type: 'Trojan', name: 'Emotet', origin: 'China', severity: 'high', timestamp: '2026-09-16 13:40:22' },
  { id: 3, type: 'Spyware', name: 'Pegasus', origin: 'Israel', severity: 'critical', timestamp: '2026-09-16 13:38:45' },
  { id: 4, type: 'Ransomware', name: 'WannaCry', origin: 'North Korea', severity: 'critical', timestamp: '2026-09-16 13:35:10' },
  { id: 5, type: 'Trojan', name: 'TrickBot', origin: 'Russia', severity: 'high', timestamp: '2026-09-16 13:30:55' },
  { id: 6, type: 'Spyware', name: 'DarkComet', origin: 'Iran', severity: 'medium', timestamp: '2026-09-16 13:28:30' },
  { id: 7, type: 'Adware', name: 'Fireball', origin: 'China', severity: 'low', timestamp: '2026-09-16 13:25:18' },
  { id: 8, type: 'Ransomware', name: 'Locky', origin: 'Russia', severity: 'high', timestamp: '2026-09-16 13:20:42' },
];

export const bruteForceData = {
  totalAttempts: 15847,
  last24Hours: 2341,
  attemptsByCountry: [
    { country: 'China', attempts: 5234, flag: '🇨🇳' },
    { country: 'Russia', attempts: 3891, flag: '🇷🇺' },
    { country: 'Brazil', attempts: 2156, flag: '🇧🇷' },
    { country: 'India', attempts: 1823, flag: '🇮🇳' },
    { country: 'United States', attempts: 1456, flag: '🇺🇸' },
    { country: 'Iran', attempts: 1287, flag: '🇮🇷' },
  ],
  recentAttempts: [
    { ip: '192.168.1.105', username: 'admin', country: 'China', timestamp: '13:44:32', success: false },
    { ip: '10.0.0.87', username: 'root', country: 'Russia', timestamp: '13:43:18', success: false },
    { ip: '172.16.0.42', username: 'administrator', country: 'Brazil', timestamp: '13:42:05', success: false },
    { ip: '192.168.1.105', username: 'user', country: 'China', timestamp: '13:40:51', success: false },
    { ip: '10.0.0.23', username: 'admin', country: 'India', timestamp: '13:39:27', success: false },
  ],
  trend: [
    { time: '00:00', attempts: 45 },
    { time: '04:00', attempts: 78 },
    { time: '08:00', attempts: 156 },
    { time: '12:00', attempts: 234 },
    { time: '13:00', attempts: 312 },
    { time: '13:30', attempts: 389 },
    { time: '13:45', attempts: 445 },
  ]
};

export const networkTraffic = {
  status: 'safe',
  bandwidth: {
    upload: 45.7,
    download: 128.3,
    unit: 'Mbps'
  },
  packetsPerSecond: 12847,
  activeConnections: 234,
  devices: [
    { name: 'Desktop-PC', ip: '192.168.1.10', status: 'safe', traffic: 45.2 },
    { name: 'Laptop-John', ip: '192.168.1.15', status: 'safe', traffic: 23.8 },
    { name: 'Server-Main', ip: '192.168.1.5', status: 'suspicious', traffic: 89.4 },
    { name: 'IoT-Camera', ip: '192.168.1.22', status: 'safe', traffic: 5.6 },
    { name: 'Mobile-Phone', ip: '192.168.1.18', status: 'safe', traffic: 12.3 },
  ],
  trafficHistory: [
    { time: '13:00', upload: 38, download: 115 },
    { time: '13:05', upload: 42, download: 122 },
    { time: '13:10', upload: 45, download: 128 },
    { time: '13:15', upload: 48, download: 135 },
    { time: '13:20', upload: 44, download: 125 },
    { time: '13:25', upload: 46, download: 130 },
    { time: '13:30', upload: 45, download: 128 },
    { time: '13:35', upload: 47, download: 132 },
    { time: '13:40', upload: 45, download: 128 },
    { time: '13:45', upload: 46, download: 129 },
  ],
  protocolDistribution: [
    { protocol: 'HTTPS', percentage: 68, color: '#10b981' },
    { protocol: 'HTTP', percentage: 15, color: '#f59e0b' },
    { protocol: 'FTP', percentage: 8, color: '#3b82f6' },
    { protocol: 'SSH', percentage: 5, color: '#8b5cf6' },
    { protocol: 'Other', percentage: 4, color: '#6b7280' },
  ]
};

export const alerts = [
  { id: 1, type: 'critical', message: 'Ransomware detected from Russia', time: '2 min ago', acknowledged: false },
  { id: 2, type: 'high', message: 'Brute force attack spike from China', time: '5 min ago', acknowledged: false },
  { id: 3, type: 'medium', message: 'Suspicious traffic pattern on Server-Main', time: '12 min ago', acknowledged: false },
  { id: 4, type: 'low', message: 'New device connected: IoT-Camera', time: '25 min ago', acknowledged: true },
  { id: 5, type: 'high', message: 'Trojan Emotet detected from China', time: '32 min ago', acknowledged: false },
];

export const threatOrigins = [
  { country: 'Russia', threats: 234, coordinates: { x: 65, y: 35 } },
  { country: 'China', threats: 189, coordinates: { x: 75, y: 45 } },
  { country: 'United States', threats: 156, coordinates: { x: 20, y: 40 } },
  { country: 'Brazil', threats: 134, coordinates: { x: 30, y: 70 } },
  { country: 'India', threats: 112, coordinates: { x: 70, y: 55 } },
  { country: 'Iran', threats: 98, coordinates: { x: 60, y: 50 } },
  { country: 'North Korea', threats: 87, coordinates: { x: 80, y: 42 } },
  { country: 'Israel', threats: 76, coordinates: { x: 58, y: 52 } },
];