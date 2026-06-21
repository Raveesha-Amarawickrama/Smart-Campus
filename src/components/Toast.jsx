import { useApp } from '../AppContext.jsx';
import { Icon } from './Icon.jsx';

export function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  const typeMap = { success:'t-success', error:'t-error', info:'t-info', warning:'t-warning' };
  const iconMap = { success:'check', error:'close', info:'bell', warning:'warning' };
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${typeMap[t.type] || 't-info'}`}>
          <Icon name={iconMap[t.type] || 'bell'} size={16}/>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
