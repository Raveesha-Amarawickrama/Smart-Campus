import React from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from './Icon.jsx';

const TYPE_CLASS = { success: 't-success', error: 't-error', info: 't-info', warning: 't-warning' };
const TYPE_ICON  = { success: 'check', error: 'close', info: 'bell', warning: 'warning' };

export function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${TYPE_CLASS[t.type] || 't-info'}`}>
          <Icon name={TYPE_ICON[t.type] || 'bell'} size={16} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
