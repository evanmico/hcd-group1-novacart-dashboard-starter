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
    <div className="flex items-center gap-2 text-[13px] font-medium text-white" title={detail} role="status" aria-live="polite">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          backgroundColor: COLORS[status],
          boxShadow: status === 'healthy' ? `0 0 6px ${COLORS[status]}` : 'none',
        }}
      />
      <span>{LABELS[status]}</span>
    </div>
  );
}
