import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';
import { getDuePriority, formatDueDate, getTodaySchedule, getNextClass } from '../data/defaults.js';

export function DashboardPage() {
  const { user, assignments, schedule, scheduleLoading, scheduleError, setPage, saveAssignments, toast, addNotification } = useApp();
  const todaySched = getTodaySchedule(schedule);
  const nextClass  = getNextClass(schedule);
  const pending    = assignments.filter(a => !a.completed);
  const urgent     = pending.filter(a => getDuePriority(a.dueDate) !== 'normal');
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const complete = id => {
    const a = assignments.find(x=>x.id===id);
    saveAssignments(assignments.map(x=>x.id===id?{...x,completed:true}:x));
    toast(` "${a.title}" completed!`,'success');
    addNotification({title:'Assignment Done',body:`You completed "${a.title}"`,type:'success'});
  };

  const reqNotif = async () => {
    if (!('Notification' in window)) { toast('Notifications not supported','error'); return; }
    const p = await Notification.requestPermission();
    if (p === 'granted') toast('Deadline reminders enabled! ','success');
    else toast('Enable notifications in browser settings','warning');
  };

  return (
    <div className="page">
      <div className="pg">

        {/* Greeting */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:13,color:'var(--t3)',fontWeight:600}}>{greeting},</div>
          <div style={{fontSize:26,fontWeight:900,color:'var(--navy)',letterSpacing:'-.5px',lineHeight:1.2}}>
            {user?.name?.split(' ')[0]} 👋
          </div>
          <div style={{fontSize:13,color:'var(--t3)',marginTop:5}}>
            {pending.length > 0 ? <>You have <strong style={{color:'var(--gold)'}}>{pending.length} pending</strong>{urgent.length>0?`, ${urgent.length} need attention`:''}</> : '🎉 No pending assignments!'}
          </div>
        </div>

        {/* Enable notifications prompt */}
        {'Notification' in window && Notification.permission === 'default' && (
          <button onClick={reqNotif} style={{width:'100%',marginBottom:18,background:'rgba(26,56,93,.07)',border:'1.5px dashed var(--navy)',borderRadius:14,padding:'12px 14px',color:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:13,fontWeight:700,cursor:'pointer',minHeight:48}}>
            <Icon name="bell" size={18} color="var(--navy)"/>
            Enable Deadline Alerts
          </button>
        )}

        {/* Urgent next-up card */}
        {urgent.length > 0 && (
          <div className="navy-card" style={{padding:18,marginBottom:18}}>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{background:'var(--gold)',color:'#fff',fontSize:10,fontWeight:800,padding:'3px 10px',borderRadius:999,letterSpacing:.5}}>
                  ⚡ NEXT UP
                </span>
                <span style={{fontSize:12,opacity:.7}}>{urgent[0].subject}</span>
              </div>
              <div style={{fontSize:21,fontWeight:900,marginBottom:5,letterSpacing:'-.3px'}}>{urgent[0].title}</div>
              <div style={{fontSize:12,opacity:.72,marginBottom:14,lineHeight:1.5}}>{urgent[0].description}</div>
              <button onClick={() => complete(urgent[0].id)} style={{background:'rgba(255,255,255,.15)',border:'1.5px solid rgba(255,255,255,.3)',borderRadius:10,padding:'9px 16px',color:'#fff',fontSize:13,fontWeight:700,display:'flex',alignItems:'center',gap:6,cursor:'pointer',backdropFilter:'blur(8px)'}}>
                <Icon name="check" size={15} color="#fff"/> Mark Complete
              </button>
            </div>
          </div>
        )}

        {/* Today schedule */}
        <div className="sec-hd">
          <span className="sec-ttl">Today's Schedule</span>
          <span className="sec-act" style={{display:'flex',alignItems:'center',gap:4}}>
            <Icon name="calendar" size={13} color="var(--teal)"/>
            {now.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
          </span>
        </div>

        {scheduleError && (
          <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(229,62,62,.06)',border:'1px solid rgba(229,62,62,.18)',borderRadius:12,padding:'10px 14px',marginBottom:12}}>
            <Icon name="warning" size={15} color="var(--danger)"/>
            <span style={{fontSize:12,color:'var(--danger)',fontWeight:600}}>{scheduleError}</span>
          </div>
        )}

        {scheduleLoading ? (
          <div style={{marginBottom:18}}>
            {[1,2].map(i => (
              <div key={i} style={{display:'flex',gap:12,marginBottom:12}}>
                <div style={{width:13,height:13,borderRadius:'50%',background:'var(--border)',marginTop:14,flexShrink:0}}/>
                <div style={{flex:1,background:'var(--surf2)',borderRadius:12,padding:'11px 13px',height:64}}>
                  <div style={{width:'40%',height:9,background:'var(--border2)',borderRadius:4,marginBottom:8}}/>
                  <div style={{width:'70%',height:13,background:'var(--border2)',borderRadius:4}}/>
                </div>
              </div>
            ))}
          </div>
        ) : todaySched.length === 0 ? (
          <div className="empty" style={{padding:'28px 0',background:'var(--surface)',borderRadius:14,border:'1.5px solid var(--border)',marginBottom:18}}>
            <div className="empty-icon"><Icon name="calendar" size={28} color="var(--border2)"/></div>
            <div className="empty-h">No classes today</div>
            <div className="empty-p">Enjoy your free day! 🎉</div>
          </div>
        ) : (
          <div style={{marginBottom:18}}>
            {todaySched.map((item, i) => {
              const isCurrent = nextClass?.id === item.id && nextClass?.status === 'current';
              const isDone = (() => {
                const [t,ap] = item.end.split(' '); let [h,m] = t.split(':').map(Number);
                if(ap==='PM'&&h!==12)h+=12; if(ap==='AM'&&h===12)h=0;
                return now.getHours()*60+now.getMinutes() > h*60+m;
              })();
              return (
                <div key={item.id} className="sched-row">
                  <div className="sched-dot-col">
                    <div className={`sched-dot ${isCurrent?'current':isDone?'done':''}`}/>
                    {i < todaySched.length-1 && <div className="sched-line"/>}
                  </div>
                  <div className={`sched-card ${isCurrent?'current':''}`} style={{marginLeft:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <span className={`sched-lbl ${isCurrent?'current':''}`}>{isCurrent?'CURRENT SESSION':isDone?'COMPLETED':'COMING UP'}</span>
                      <span className={`sched-time ${isDone?'done':''}`}>{item.time}</span>
                    </div>
                    <div className="sched-course">{item.course}</div>
                    <div className="sched-meta"><Icon name="location" size={12}/>{item.room} • {item.dept}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats row */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:18}}>
          {[
            {lbl:'Pending',val:pending.length,col:'var(--navy)',bg:'rgba(26,56,93,.07)',icon:'assignments'},
            {lbl:'Due Soon',val:urgent.length,col:'var(--gold-dark)',bg:'rgba(214,158,46,.10)',icon:'clock'},
            {lbl:'Overdue',val:assignments.filter(a=>!a.completed&&getDuePriority(a.dueDate)==='overdue').length,col:'var(--danger)',bg:'rgba(229,62,62,.08)',icon:'warning'},
          ].map(s=>(
            <div key={s.lbl} onClick={()=>setPage('assignments')} style={{background:s.bg,borderRadius:14,padding:'13px 10px',cursor:'pointer',border:`1.5px solid ${s.col}22`,textAlign:'center'}}>
              <Icon name={s.icon} size={20} color={s.col}/>
              <div style={{fontSize:24,fontWeight:900,color:s.col,margin:'4px 0 2px'}}>{s.val}</div>
              <div style={{fontSize:11,color:'var(--t3)',fontWeight:600}}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Recent assignments */}
        <div className="sec-hd">
          <span className="sec-ttl">Recent Assignments</span>
          <button className="sec-act" onClick={()=>setPage('assignments')}>View all</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {assignments.slice(0,3).map(a => {
            const pri = getDuePriority(a.dueDate);
            return (
              <div key={a.id} className={`acard ${a.completed?'done':pri}`}>
                <div className="chk-hit" onClick={()=>!a.completed&&complete(a.id)}>
                  <div className={`chk ${a.completed?'done':pri}`}>
                    {a.completed && <Icon name="check" size={13} color="#fff"/>}
                  </div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="acard-ttl">{a.title}</div>
                  <div className="acard-meta">
                    <span className={`stag stag-${a.subjectTag||'cs'}`}>{a.subject}</span>
                    <span className={`due-pill ${a.completed?'done':pri}`}>
                      <Icon name="calendar" size={10}/>
                      {a.completed?'Done':formatDueDate(a.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
