import React, { useState, useRef, useEffect } from 'react';
import { AppProvider, useApp } from './AppContext.jsx';
import { Icon } from './components/Icon.jsx';
import { ToastContainer } from './components/Toast.jsx';
import { NotificationsPanel } from './components/NotificationsPanel.jsx';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { LandingPage } from './pages/Landing.jsx';
import { LoginPage, RegisterPage } from './pages/Auth.jsx';
import { DashboardPage } from './pages/Dashboard.jsx';
import { AssignmentsPage } from './pages/Assignments.jsx';
import { CreditsPage } from './pages/Credits.jsx';
import { NotesPage } from './pages/Notes.jsx';
import { ProfilePage } from './pages/Profile.jsx';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',  icon: 'dashboard'   },
  { id: 'assignments', label: 'Assignments', icon: 'assignments' },
  { id: 'credits',     label: 'Credits',     icon: 'credits'     },
  { id: 'notes',       label: 'Notes',       icon: 'notes'       },
];

function Shell() {
  const { user, page, setPage, notifications, loading } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const pageRef  = useRef(null);
  const isOnline = useOnlineStatus();

  
  useEffect(() => {
    if (pageRef.current) pageRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [page]);


  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', flexDirection: 'column', gap: 20, background: 'linear-gradient(155deg,#2A4F82 0%,#1A385D 50%,#0F2240 100%)' }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="graduation" size={34} color="#fff" />
        </div>
        <div style={{ color: '#fff', fontSize: 24, fontWeight: 900, letterSpacing: '-.3px' }}>Smart Campus</div>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (page === 'landing')  return <><LandingPage /><ToastContainer /></>;
  if (page === 'login')    return <><LoginPage /><ToastContainer /></>;
  if (page === 'register') return <><RegisterPage /><ToastContainer /></>;


  if (!user) { setPage('landing'); return null; }

  const unread   = notifications.filter((n) => !n.read).length;
  const initials = (user?.name || 'SC').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const inMain   = ['dashboard', 'assignments', 'credits', 'notes'].includes(page);

  return (
    <div className="app-shell">

    
      {!isOnline && (
        <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 150, background: 'var(--gold-dark)', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="warning" size={13} color="#fff" />
          You're offline — showing cached data
        </div>
      )}


      <header className="top-hdr" style={isOnline ? {} : { top: 27 }}>
        {page === 'profile' ? (
          <>
            <button className="icon-btn" onClick={() => setPage('dashboard')}>
              <Icon name="back" size={20} />
            </button>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)' }}>Profile</span>
            <div style={{ width: 40 }} />
          </>
        ) : (
          <>
            <div className="hdr-brand" onClick={() => setPage('profile')}>
              <div className="hdr-av">{initials}</div>
              <div>
                <div className="hdr-greeting">Welcome back,</div>
                <div className="hdr-name">{user?.name?.split(' ')[0] || 'Student'}</div>
              </div>
            </div>
            <div className="hdr-actions">
              <button className="icon-btn" onClick={() => setShowNotifs(true)}>
                <Icon name="bell" size={20} />
                {unread > 0 && (
                  <span className="n-badge">{unread > 9 ? '9+' : unread}</span>
                )}
              </button>
              <button className="icon-btn" onClick={() => setPage('profile')}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(145deg,var(--navy-light),var(--navy-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 800 }}>
                  {initials}
                </div>
              </button>
            </div>
          </>
        )}
      </header>


      <div className="page" ref={pageRef} style={isOnline ? {} : { paddingTop: 'calc(var(--hdr-h) + 27px)' }}>
        {page === 'dashboard'   && <DashboardPage />}
        {page === 'assignments' && <AssignmentsPage />}
        {page === 'credits'     && <CreditsPage />}
        {page === 'notes'       && <NotesPage />}
        {page === 'profile'     && <ProfilePage />}
      </div>

      {inMain && (
        <nav className="bot-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${page === item.id ? 'on' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <div className="nav-pip">
                <Icon name={item.icon} size={22} color={page === item.id ? 'var(--navy)' : 'var(--t3)'} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700 }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
