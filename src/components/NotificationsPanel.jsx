import { useApp } from '../AppContext.jsx';
import { Icon } from './Icon.jsx';

export function NotificationsPanel({ onClose }) {
  const { notifications, markNotifsRead } = useApp();
  const timeAgo = iso => {
    const d = (Date.now() - new Date(iso)) / 1000;
    if (d < 60) return 'Just now';
    if (d < 3600) return `${Math.floor(d/60)}m ago`;
    if (d < 86400) return `${Math.floor(d/3600)}h ago`;
    return `${Math.floor(d/86400)}d ago`;
  };
  const colors = { success:'rgba(56,161,105,.12)', error:'rgba(229,62,62,.10)', info:'rgba(41,140,189,.10)', warning:'rgba(214,158,46,.12)' };
  const icons  = { success:'check', error:'warning', info:'bell', warning:'clock' };
  const icolors = { success:'var(--success)', error:'var(--danger)', info:'var(--teal)', warning:'var(--gold)' };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-hdr">
          <span className="sheet-title">Notifications</span>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <button onClick={markNotifsRead} style={{fontSize:12,fontWeight:700,color:'var(--teal)'}}>Mark all read</button>
            <button className="icon-btn" onClick={onClose}><Icon name="close" size={18}/></button>
          </div>
        </div>
        <div style={{padding:'0 20px 24px'}}>
          {notifications.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Icon name="bell" size={28} color="var(--border2)"/></div>
              <div className="empty-h">All caught up!</div>
              <div className="empty-p">Complete assignments to see activity here.</div>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} className="notif-item" style={{opacity:n.read?.7:1}}>
              <div className="notif-icon" style={{background:colors[n.type]||colors.info}}>
                <Icon name={icons[n.type]||'bell'} size={16} color={icolors[n.type]||icolors.info}/>
              </div>
              <div style={{flex:1}}>
                <div className="notif-ttl">
                  {n.title}
                  {!n.read && <span className="unread-dot"/>}
                </div>
                <div className="notif-body">{n.body}</div>
                <div className="notif-time">{timeAgo(n.time)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
