import React, { useEffect, useState } from 'react';
import { getHealth } from '../utils/dataSource';

const COLORS = { healthy: '#3DDC97', degraded: '#FFC857', error: '#FF6B6B', checking: '#B8C4E0' };
const LABELS = { healthy: 'Service healthy', degraded: 'Degraded', error: 'Offline', checking: 'Checking…' };

export default function ServiceStatus() {
  const [status, setStatus] = useState('checking');
  const [detail, setDetail] = useState('');

  async function check() {
    try {
      const data = await getHealth();
      setStatus(data.status === 'healthy' ? 'healthy' : 'degraded');
      setDetail(data.database?.status === 'connected' ? 'Connected' : 'DB issue');
    } catch {
      setStatus('error');
      setDetail('Backend unreachable');
    }
  }

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="service-status" title={detail} role="status" aria-live="polite">
      <span
        className="status-dot"
        style={{
          backgroundColor: COLORS[status],
          boxShadow: status === 'healthy' ? `0 0 6px ${COLORS[status]}` : 'none',
        }}
      />
      <span>{LABELS[status]}</span>
    </div>
  );
}
