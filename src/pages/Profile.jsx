import React, { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';
import { calcGPA, calcTotalCredits } from '../data/defaults.js';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';

const YEARS   = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const MAJORS  = [
  'Software Engineering', 'Computer Science', 'Mathematics', 'Physics',
  'Business', 'Arts & Humanities', 'Medicine', 'Law', 'Education',
];

export function ProfilePage() {
  const { user, saveUser, settings, saveSettings, courses, assignments, logout, toast, setPage } = useApp();
  const [editModal,    setEditModal]    = useState(false);
  const [iosGuide,     setIosGuide]     = useState(false);
  const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();

  const gpa      = calcGPA(courses);
  const total    = calcTotalCredits(courses);
  const done     = assignments.filter((a) => a.completed).length;
  const pending  = assignments.filter((a) => !a.completed).length;
  const initials = (user?.name || 'SC').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const toggleNotifications = () => {
    const upd = { ...settings, notifications: !settings.notifications };
    saveSettings(upd);
    toast(`Notifications ${upd.notifications ? 'enabled' : 'disabled'}`, 'success');
    if (upd.notifications && 'Notification' in window) Notification.requestPermission();
  };

  const handleInstall = async () => {
    if (isInstalled) { toast('App is already installed ✓', 'info'); return; }

    if (isIOS) {
    
      setIosGuide(true);
      return;
    }

    if (!isInstallable) {
      toast('To install: tap browser menu → "Add to Home Screen"', 'info');
      return;
    }

   
    const choice = await promptInstall();
    if (choice.outcome === 'accepted')   toast('App installed! 🎉 Check your home screen.', 'success');
    else if (choice.outcome === 'dismissed') toast('You can install anytime from this page.', 'info');
  };

  return (
    <div style={{ overflowX: 'hidden' }}>

    
      <div className="prof-hero">
        <div className="prof-av">
          {user?.avatar ? <img src={user.avatar} alt={user.name} /> : initials}
        </div>
        <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-.3px', position: 'relative', zIndex: 1 }}>
          {user?.name}
        </div>
        <div style={{ fontSize: 13, opacity: .72, marginTop: 3, position: 'relative', zIndex: 1 }}>
          {user?.major} · {user?.year}
        </div>
        {user?.studentId && (
          <div style={{ fontSize: 12, opacity: .55, marginTop: 2, position: 'relative', zIndex: 1 }}>
            {user.studentId}
          </div>
        )}
        <div style={{ marginTop: 10, position: 'relative', zIndex: 1, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: 'var(--gold)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 999 }}>
            ⭐ GPA {gpa} · Top 5%
          </span>
          {/* Inline Edit button in hero */}
          <button
            onClick={() => setEditModal(true)}
            style={{ background: 'rgba(255,255,255,.18)', border: '1.5px solid rgba(255,255,255,.35)', borderRadius: 999, padding: '4px 14px', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', minHeight: 30 }}
          >
            <Icon name="edit" size={12} color="#fff" /> Edit Profile
          </button>
        </div>
      </div>

      <div className="pg" style={{ paddingTop: 0 }}>

       
        <div className="prof-float">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>
                Academic Standing
              </div>
              <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 2 }}>
                {parseFloat(gpa) >= 3.7 ? "✅ Dean's List Eligible" : '📚 Keep it up!'}
              </div>
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{ width: 'auto', padding: '8px 14px', minHeight: 40, fontSize: 13 }}
              onClick={() => setEditModal(true)}
            >
              <Icon name="edit" size={14} /> Edit
            </button>
          </div>

          <div style={{ margin: '12px 0 5px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
            <span>Degree Progress</span>
            <span>{Math.min(100, Math.round((total / 120) * 100))}%</span>
          </div>
          <div style={{ background: 'var(--surf2)', borderRadius: 999, height: 7, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,var(--teal-light),var(--teal))', width: `${Math.min(100, Math.round((total / 120) * 100))}%`, transition: 'width .5s' }} />
          </div>

          <div className="stat-row">
            {[
              { v: total,   l: 'Credits' },
              { v: gpa,     l: 'GPA' },
              { v: done,    l: 'Done' },
              { v: pending, l: 'Pending' },
            ].map((s) => (
              <div key={s.l} className="stat-cell">
                <div className="stat-v">{s.v}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="graduation" size={17} color="var(--navy)" /> Academic Info
          </div>
          {[
            { lbl: 'Major / Faculty',   val: user?.major || '—' },
            { lbl: 'Year',              val: user?.year  || '—' },
            { lbl: 'Student ID',        val: user?.studentId || '—' },
            { lbl: 'Email',             val: user?.email || '—' },
            { lbl: 'Remaining Credits', val: `${Math.max(0, 120 - total)} credits` },
            { lbl: 'Graduation Path',   val: '🎓 2027', hi: true },
          ].map((item) => (
            <div key={item.lbl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>{item.lbl}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: item.hi ? 'var(--teal)' : 'var(--t1)', textAlign: 'right', maxWidth: '55%', wordBreak: 'break-all' }}>{item.val}</span>
            </div>
          ))}
          <div style={{ paddingTop: 2 }} />
        </div>

     
        <div className="navy-card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,.12)', border: '1.5px solid rgba(255,255,255,.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="smartphone" size={20} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>
                {isInstalled ? 'App Installed ✓' : isIOS ? 'Add to Home Screen (iOS)' : 'Install Smart Campus'}
              </div>
              <div style={{ fontSize: 12, opacity: .72, lineHeight: 1.4 }}>
                {isInstalled
                  ? 'Running as a standalone PWA.'
                  : isIOS
                  ? 'Tap Share → "Add to Home Screen" in Safari.'
                  : 'Install for offline access & home screen icon.'}
              </div>
            </div>
          </div>
          {!isInstalled && (
            <button
              onClick={handleInstall}
              style={{ marginTop: 12, position: 'relative', zIndex: 1, width: '100%', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', minHeight: 44 }}
            >
              <Icon name="plus" size={16} color="#fff" />
              {isIOS ? 'Show Install Steps' : 'Install App'}
            </button>
          )}
        </div>

        <div className="card" style={{ padding: '6px 16px', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="settings" size={17} color="var(--navy)" /> Preferences
          </div>
          <div className="set-row" onClick={toggleNotifications}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(26,56,93,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bell" size={17} color="var(--navy)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Deadline Notifications</div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>Browser push alerts for due dates</div>
              </div>
            </div>
            <div className={`toggle ${settings?.notifications ? 'on' : ''}`}><div className="toggle-t" /></div>
          </div>
        </div>

     
        <div className="card" style={{ padding: '6px 16px', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="grid" size={17} color="var(--navy)" /> Quick Access
          </div>
          {[
            { lbl: 'My Assignments', icon: 'assignments', pg: 'assignments', col: 'rgba(214,158,46,.10)', icol: 'var(--gold-dark)' },
            { lbl: 'Credit Records', icon: 'credits',     pg: 'credits',     col: 'rgba(26,56,93,.08)',   icol: 'var(--navy)' },
            { lbl: 'Captured Notes', icon: 'camera',      pg: 'notes',       col: 'rgba(41,140,189,.10)', icol: 'var(--teal)' },
          ].map((item) => (
            <div key={item.lbl} className="set-row" onClick={() => setPage(item.pg)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: item.col, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={item.icon} size={17} color={item.icol} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{item.lbl}</span>
              </div>
              <Icon name="chevron-r" size={17} color="var(--t3)" />
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '6px 16px', marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="smartphone" size={17} color="var(--navy)" /> About
          </div>
          {[
            { lbl: 'App Version', val: '1.0.0' },
            { lbl: 'Module',      val: 'SENG 41293' },
            { lbl: 'University',  val: 'Kelaniya, Sri Lanka' },
          ].map((item) => (
            <div key={item.lbl} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>{item.lbl}</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{item.val}</span>
            </div>
          ))}
          <div style={{ paddingTop: 2 }} />
        </div>

        <button
          className="btn"
          style={{ background: 'rgba(229,62,62,.06)', border: '1.5px solid rgba(229,62,62,.25)', color: 'var(--danger)', gap: 10 }}
          onClick={() => { logout(); toast('Signed out. See you soon! 👋', 'info'); }}
        >
          <Icon name="logout" size={18} color="var(--danger)" /> Sign Out
        </button>
      </div>

   
      {editModal && (
        <EditProfileModal
          user={user}
          onSave={(u) => { saveUser(u); setEditModal(false); toast('Profile updated ✓', 'success'); }}
          onClose={() => setEditModal(false)}
        />
      )}

      {iosGuide && <IOSInstallGuide onClose={() => setIosGuide(false)} />}
    </div>
  );
}


function EditProfileModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    name:      user?.name      || '',
    major:     user?.major     || '',
    year:      user?.year      || 'Freshman',
    email:     user?.email     || '',
    studentId: user?.studentId || '',
  });
  const [err, setErr] = useState({});

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErr((p)  => ({ ...p, [k]: '' }));
  };

  const submit = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Enter your full name';
    if (form.email && !form.email.includes('@'))           e.email = 'Enter a valid email';
    setErr(e);
    if (Object.keys(e).length) return;
    onSave({ ...user, ...form });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-hdr">
          <span className="sheet-title">Edit Profile</span>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="sheet-body">
          {/* Avatar placeholder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 8px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(145deg,var(--navy-light),var(--navy-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
              {(form.name || user?.name || 'SC').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{form.name || 'Your Name'}</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{form.major} · {form.year}</div>
            </div>
          </div>

          {[
            { k: 'name',      lbl: 'Full Name',     ph: 'Your full name',       icon: 'user'       },
            { k: 'email',     lbl: 'Email',         ph: 'your@kelaniya.ac.lk',  icon: 'bell'       },
            { k: 'studentId', lbl: 'Student ID',    ph: 'SE/2021/XXX',          icon: 'book'       },
          ].map(({ k, lbl, ph, icon }) => (
            <div className="fgrp" key={k}>
              <label className="flbl"><Icon name={icon} size={12} />{lbl}</label>
              <input className="finput" placeholder={ph} value={form[k]} onChange={set(k)} />
              {err[k] && <span className="ferr"><Icon name="warning" size={12} />{err[k]}</span>}
            </div>
          ))}

          <div className="fgrp">
            <label className="flbl"><Icon name="graduation" size={12} />Major / Faculty</label>
            <select className="finput fselect" value={form.major} onChange={set('major')}>
              {MAJORS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="fgrp">
            <label className="flbl"><Icon name="calendar" size={12} />Academic Year</label>
            <select className="finput fselect" value={form.year} onChange={set('year')}>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn btn-navy" onClick={submit}>
            <Icon name="save" size={18} color="#fff" /> Save Changes
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


function IOSInstallGuide({ onClose }) {
  const steps = [
    { icon: 'arrow',    text: 'Tap the Share button at the bottom of Safari (the box with an arrow)' },
    { icon: 'plus',     text: 'Scroll down and tap "Add to Home Screen"' },
    { icon: 'check',    text: 'Tap "Add" in the top-right corner' },
    { icon: 'smartphone', text: 'Smart Campus now appears on your home screen like a native app!' },
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-hdr">
          <span className="sheet-title">Install on iPhone / iPad</span>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="sheet-body">
    
          <div style={{ background: 'rgba(26,56,93,.06)', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', border: '1px solid rgba(26,56,93,.10)' }}>
            <Icon name="warning" size={18} color="var(--navy)" />
            <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 600, lineHeight: 1.5 }}>
              Make sure you are using <strong>Safari</strong> — this won't work in Chrome or Firefox on iOS.
            </div>
          </div>

          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(145deg,var(--navy-light),var(--navy-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1, paddingTop: 6 }}>
                <div style={{ fontSize: 14, color: 'var(--t1)', lineHeight: 1.55, fontWeight: 500 }}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="sheet-foot">
          <button className="btn btn-navy" onClick={onClose}>
            <Icon name="check" size={18} color="#fff" /> Got it
          </button>
        </div>
      </div>
    </div>
  );
}
