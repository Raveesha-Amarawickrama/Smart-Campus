import { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';
import { calcGPA, calcTotalCredits } from '../data/defaults.js';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';

export function ProfilePage() {
  const { user, saveUser, settings, saveSettings, courses, assignments, logout, toast, setPage } = useApp();
  const [editModal, setEditModal] = useState(false);
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();

  const gpa    = calcGPA(courses);
  const total  = calcTotalCredits(courses);
  const done   = assignments.filter(a=>a.completed).length;
  const pending= assignments.filter(a=>!a.completed).length;
  const initials = (user?.name||'SC').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const toggleSetting = key => {
    const upd = {...settings,[key]:!settings[key]};
    saveSettings(upd);
    toast(`${key.charAt(0).toUpperCase()+key.slice(1)} ${upd[key]?'enabled':'disabled'}`,'success');
    if (key==='notifications' && upd[key] && 'Notification' in window) Notification.requestPermission();
  };

  const handleInstall = async () => {
    if (!isInstallable) {
      
      toast('Open browser menu → "Add to Home Screen" / "Install App" to install.', 'info');
      return;
    }
    const choice = await promptInstall();
    if (choice.outcome === 'accepted') toast('App installed! 🎉 Check your home screen.', 'success');
    else if (choice.outcome === 'dismissed') toast('Install dismissed — you can try again anytime.', 'info');
    else toast('Use your browser\'s "Add to Home Screen" option to install.', 'info');
  };

  return (
    <div style={{overflowX:"hidden"}}>
  
      <div className="prof-hero">
        <div className="prof-av">
          {user?.avatar ? <img src={user.avatar} alt={user.name}/> : initials}
        </div>
        <div style={{fontSize:22,fontWeight:900,letterSpacing:'-.3px',position:'relative',zIndex:1}}>{user?.name}</div>
        <div style={{fontSize:13,opacity:.72,marginTop:4,position:'relative',zIndex:1}}>{user?.major} · {user?.year}</div>
        {user?.studentId && <div style={{fontSize:12,opacity:.55,marginTop:2,position:'relative',zIndex:1}}>{user.studentId}</div>}
        <div style={{marginTop:12,position:'relative',zIndex:1}}>
          <span style={{background:'var(--gold)',color:'#fff',fontSize:11,fontWeight:800,padding:'4px 14px',borderRadius:999}}>⭐ GPA {gpa} · Top 5%</span>
        </div>
      </div>

      <div className="pg" style={{paddingTop:0}}>
        
        <div className="prof-float">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>Academic Standing</div>
              <div style={{fontSize:13,color:'var(--t2)',marginTop:2}}>
                {parseFloat(gpa)>=3.7 ? '✅ Dean\'s List Eligible' : '📚 Keep it up!'}
              </div>
            </div>
            <button className="btn btn-outline btn-sm" style={{width:'auto',padding:'8px 16px'}} onClick={()=>setEditModal(true)}>
              <Icon name="edit" size={15}/> Edit
            </button>
          </div>

          <div style={{margin:'14px 0 6px',display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--t3)',fontWeight:600}}>
            <span>Degree Progress</span>
            <span>{Math.min(100,Math.round((total/120)*100))}%</span>
          </div>
          <div style={{background:'var(--surf2)',borderRadius:999,height:8,overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:999,background:'linear-gradient(90deg,var(--teal-light),var(--teal))',width:`${Math.min(100,Math.round((total/120)*100))}%`,transition:'width .5s'}}/>
          </div>

          <div className="stat-row">
            {[
              {v:total,  l:'Credits'},
              {v:gpa,    l:'GPA'},
              {v:done,   l:'Done'},
              {v:pending,l:'Pending'},
            ].map(s=>(
              <div key={s.l} className="stat-cell">
                <div className="stat-v">{s.v}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

      
        <div className="card" style={{padding:16,marginBottom:12}}>
          <div style={{fontWeight:800,fontSize:15,color:'var(--navy)',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
            <Icon name="graduation" size={17} color="var(--navy)"/> Academic Info
          </div>
          {[
            {lbl:'Major / Faculty', val:user?.major||'—'},
            {lbl:'Year',            val:user?.year||'—'},
            {lbl:'Email',           val:user?.email||'—'},
            {lbl:'Remaining Credits',val:`${Math.max(0,120-total)} credits`},
            {lbl:'Graduation Path', val:' 2026', hi:true},
          ].map(item=>(
            <div key={item.lbl} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:13,color:'var(--t3)',fontWeight:600}}>{item.lbl}</span>
              <span style={{fontSize:13,fontWeight:700,color:item.hi?'var(--teal)':'var(--t1)'}}>{item.val}</span>
            </div>
          ))}
          <div style={{paddingTop:2}}/>
        </div>

        <div className="navy-card" style={{padding:18, marginBottom:12}}>
          <div style={{position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:14}}>
            <div style={{width:46,height:46,borderRadius:14,background:'rgba(255,255,255,.12)',border:'1.5px solid rgba(255,255,255,.20)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Icon name="smartphone" size={22} color="#fff"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,marginBottom:2}}>
                {isInstalled ? 'App Installed ✓' : 'Install Smart Campus'}
              </div>
              <div style={{fontSize:12,opacity:.72,lineHeight:1.4}}>
                {isInstalled
                  ? 'Running as a standalone app on this device.'
                  : 'Add to your home screen for offline access.'}
              </div>
            </div>
          </div>
          {!isInstalled && (
            <button
              onClick={handleInstall}
              style={{marginTop:14, position:'relative', zIndex:1, width:'100%', background:'var(--gold)', color:'#fff', border:'none', borderRadius:10, padding:'11px 16px', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', minHeight:44}}
            >
              <Icon name="plus" size={17} color="#fff"/> Install App
            </button>
          )}
        </div>

      
        <div className="card" style={{padding:'8px 16px',marginBottom:12}}>
          <div style={{fontWeight:800,fontSize:15,color:'var(--navy)',padding:'10px 0',display:'flex',alignItems:'center',gap:8}}>
            <Icon name="settings" size={17} color="var(--navy)"/> Preferences
          </div>
          <div className="set-row" onClick={()=>toggleSetting('notifications')}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:11,background:'rgba(26,56,93,.08)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="bell" size={18} color="var(--navy)"/>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700}}>Deadline Notifications</div>
                <div style={{fontSize:12,color:'var(--t3)'}}>Browser push alerts for due dates</div>
              </div>
            </div>
            <div className={`toggle ${settings?.notifications?'on':''}`}><div className="toggle-t"/></div>
          </div>
        </div>

        <div className="card" style={{padding:'8px 16px',marginBottom:12}}>
          <div style={{fontWeight:800,fontSize:15,color:'var(--navy)',padding:'10px 0',display:'flex',alignItems:'center',gap:8}}>
            <Icon name="grid" size={17} color="var(--navy)"/> Quick Access
          </div>
          {[
            {lbl:'My Assignments',  icon:'assignments', pg:'assignments', col:'rgba(214,158,46,.10)', icol:'var(--gold-dark)'},
            {lbl:'Credit Records',  icon:'credits',     pg:'credits',     col:'rgba(26,56,93,.08)',  icol:'var(--navy)'},
            {lbl:'Captured Notes',  icon:'camera',      pg:'notes',       col:'rgba(41,140,189,.10)',icol:'var(--teal)'},
          ].map(item=>(
            <div key={item.lbl} className="set-row" onClick={()=>setPage(item.pg)}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:38,height:38,borderRadius:11,background:item.col,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon name={item.icon} size={18} color={item.icol}/>
                </div>
                <span style={{fontSize:14,fontWeight:700}}>{item.lbl}</span>
              </div>
              <Icon name="chevron-r" size={17} color="var(--t3)"/>
            </div>
          ))}
        </div>

        <div className="card" style={{padding:'8px 16px',marginBottom:20}}>
          <div style={{fontWeight:800,fontSize:15,color:'var(--navy)',padding:'10px 0',display:'flex',alignItems:'center',gap:8}}>
            <Icon name="smartphone" size={17} color="var(--navy)"/> About
          </div>
          {[
            {lbl:'App Version',   val:'1.0.0'},
            {lbl:'Module',        val:'SENG 41293'},
            {lbl:'University',    val:'Kelaniya, Sri Lanka'},
          ].map(item=>(
            <div key={item.lbl} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:13,color:'var(--t3)',fontWeight:600}}>{item.lbl}</span>
              <span style={{fontSize:13,fontWeight:700}}>{item.val}</span>
            </div>
          ))}
          <div style={{paddingTop:2}}/>
        </div>
        <button className="btn" style={{background:'rgba(229,62,62,.06)',border:'1.5px solid rgba(229,62,62,.25)',color:'var(--danger)',gap:10}}
          onClick={()=>{ logout(); toast('Signed out. See you soon! 👋','info'); }}>
          <Icon name="logout" size={18} color="var(--danger)"/> Sign Out
        </button>
      </div>

      {editModal && (
        <EditProfileModal
          user={user}
          onSave={u=>{ saveUser(u); setEditModal(false); toast('Profile updated ✓','success'); }}
          onClose={()=>setEditModal(false)}
        />
      )}
    </div>
  );
}

function EditProfileModal({user, onSave, onClose}) {
  const [form, setForm] = useState({
    name:      user?.name||'',
    major:     user?.major||'',
    year:      user?.year||'Freshman',
    email:     user?.email||'',
    studentId: user?.studentId||'',
  });
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-hdr">
          <span className="sheet-title">Edit Profile</span>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18}/></button>
        </div>
        <div className="sheet-body">
          {[
            {k:'name',      lbl:'Full Name',     ph:'Your full name',           icon:'user'},
            {k:'email',     lbl:'Email',         ph:'your@university.edu',      icon:'bell'},
            {k:'studentId', lbl:'Student ID',    ph:'ID-123456',                icon:'book'},
            {k:'major',     lbl:'Major/Faculty', ph:'e.g. Computer Science',    icon:'graduation'},
          ].map(({k,lbl,ph,icon})=>(
            <div className="fgrp" key={k}>
              <label className="flbl"><Icon name={icon} size={12}/>{lbl}</label>
              <input className="finput" placeholder={ph} value={form[k]} onChange={set(k)}/>
            </div>
          ))}
          <div className="fgrp">
            <label className="flbl"><Icon name="calendar" size={12}/>Year</label>
            <select className="finput fselect" value={form.year} onChange={set('year')}>
              {['Freshman','Sophomore','Junior','Senior','Graduate'].map(y=><option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="sheet-foot">
          <button className="btn btn-navy" onClick={()=>onSave({...user,...form})}>
            <Icon name="save" size={18} color="#fff"/> Save Changes
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
