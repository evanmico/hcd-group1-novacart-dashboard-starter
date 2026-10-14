import React, { useEffect, useState } from 'react';
import { getHealth } from '../utils/dataSource';

const COLORS = {
  healthy:  'bg-emerald-400 shadow-[0_0_6px_#3DDC97]',
  degraded: 'bg-yellow-400',
  error:    'bg-red-400',
  checking: 'bg-slate-400',
};
const LABELS = {
  healthy:  'Service healthy',
  degraded: 'Degraded',
  error:    'Offline',
  checking: 'Checking…',
};

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
    <div
      className="flex items-center gap-2 text-[13px] font-medium text-white"
      title={detail}
      role="status"
      aria-live="polite"
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${COLORS[status]}`} />
      <span>{LABELS[status]}</span>
    </div>
  );
}
