import { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';
import { calcGPA, calcTotalCredits, GRADE_POINTS } from '../data/defaults.js';

const GRADE_OPTS = ['A+','A','A-','B+','B','B-','C+','C','C-','D','F'];
const TYPES = ['Major Core','Major Requirement','General Education','Elective'];
const REQUIRED = 120;

function gradeCls(g) {
  if (g==='A+'||g==='A') return 'gA';
  if (g==='A-') return 'gAm';
  if (g==='B+') return 'gBp';
  if (g==='B')  return 'gB';
  if (g==='B-') return 'gBm';
  if (g.startsWith('C')) return 'gC';
  return 'gD';
}

function Donut({pct,size=94,stroke=9}) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, dash=(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F6C94E" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"
        style={{transition:'stroke-dasharray .6s ease'}}/>
    </svg>
  );
}

export function CreditsPage() {
  const { courses, saveCourses, toast } = useApp();
  const [modal,  setModal]  = useState(null);
  const [addSem, setAddSem] = useState(false);
  const [semName,setSemName] = useState('');

  const gpa   = calcGPA(courses);
  const total = calcTotalCredits(courses);
  const pct   = Math.min(100, Math.round((total/REQUIRED)*100));
  const all   = courses.flatMap(s=>s.courses);
  const major   = all.filter(c=>c.type.includes('Major')).reduce((s,c)=>s+c.credits,0);
  const elective= all.filter(c=>c.type==='Elective').reduce((s,c)=>s+c.credits,0);
  const gen     = all.filter(c=>c.type==='General Education').reduce((s,c)=>s+c.credits,0);

  const saveCourse = ({semIdx,courseIdx,data}) => {
    const upd = courses.map((sem,si)=>{
      if(si!==semIdx) return sem;
      const nc = courseIdx!=null ? sem.courses.map((c,ci)=>ci===courseIdx?{...c,...data}:c) : [...sem.courses,{id:'c'+Date.now(),...data}];
      return {...sem,courses:nc,credits:nc.reduce((s,c)=>s+Number(c.credits),0)};
    });
    saveCourses(upd); toast('Saved ✓','success'); setModal(null);
  };

  const delCourse = ({semIdx,courseIdx}) => {
    const upd = courses.map((sem,si)=>{
      if(si!==semIdx) return sem;
      const nc = sem.courses.filter((_,ci)=>ci!==courseIdx);
      return {...sem,courses:nc,credits:nc.reduce((s,c)=>s+c.credits,0)};
    });
    saveCourses(upd); toast('Record removed','error'); setModal(null);
  };

  const addSemester = () => {
    if (!semName.trim()) return;
    saveCourses([{semester:semName.trim(),credits:0,courses:[]},...courses]);
    setSemName(''); setAddSem(false); toast('Semester added ','success');
  };

  return (
    <div className="page">
      <div className="pg">

      
        <div className="navy-card" style={{padding:20,marginBottom:16}}>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:11,opacity:.6,fontWeight:700,textTransform:'uppercase',letterSpacing:.5,marginBottom:4}}>Current GPA</div>
                <div className="gpa-num">{gpa}</div>
                <div style={{marginTop:10}}>
                  <span style={{background:'var(--gold)',color:'#fff',fontSize:11,fontWeight:800,padding:'4px 12px',borderRadius:999}}>⭐ Top 5% · Honor Roll</span>
                </div>
              </div>
              <div style={{position:'relative',width:94,height:94}}>
                <Donut pct={pct}/>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <div style={{fontSize:16,fontWeight:900,color:'#fff'}}>{pct}%</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.55)',textTransform:'uppercase',letterSpacing:.4}}>Done</div>
                </div>
              </div>
            </div>

            <div style={{marginTop:16,marginBottom:8,display:'flex',justifyContent:'space-between',fontSize:12,opacity:.72}}>
              <span>Degree Progress</span><span>{pct}% of {REQUIRED} credits</span>
            </div>
            <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:12,opacity:.7}}>
              <span>Earned: <strong>{total}</strong></span>
              <span>Required: <strong>{REQUIRED}</strong></span>
            </div>

            <div className="cred-grid">
              {[
                {lbl:'Major',val:`${major} / 60`},
                {lbl:'Electives',val:`${elective} / 30`},
                {lbl:'General Ed',val:`${gen} / 30`},
                {lbl:'Remaining',val:Math.max(0,REQUIRED-total),hi:true},
              ].map(c=>(
                <div key={c.lbl} className={`cred-cell ${c.hi?'hi':''}`}>
                  <div className="cred-lbl">{c.lbl}</div>
                  <div className="cred-val">{c.val}</div>
                </div>
              ))}
            </div>

            <div style={{marginTop:12,background:'rgba(214,158,46,.18)',border:'1px solid rgba(214,158,46,.35)',borderRadius:12,padding:'10px 14px',fontSize:13}}>
              <div style={{fontWeight:800,marginBottom:2}}>🎓 Graduation Path</div>
              <div style={{opacity:.85}}>On track to graduate by  2027.</div>
            </div>
          </div>
        </div>

        
        <div className="sec-hd">
          <span className="sec-ttl">Course History</span>
          <button className="sec-act" onClick={()=>setAddSem(true)}>+ Semester</button>
        </div>

        {addSem && (
          <div style={{background:'var(--surface)',border:'2px solid var(--navy)',borderRadius:12,padding:14,marginBottom:12,display:'flex',gap:8}}>
            <input className="finput" style={{flex:1}} placeholder="e.g. Fall Semester 2024" value={semName} onChange={e=>setSemName(e.target.value)}/>
            <button className="btn btn-navy btn-sm" style={{width:'auto',padding:'0 16px'}} onClick={addSemester}>Add</button>
            <button className="btn btn-ghost btn-sm" style={{width:'auto',padding:'0 12px'}} onClick={()=>setAddSem(false)}>✕</button>
          </div>
        )}

        {courses.map((sem,si)=>(
          <div key={sem.semester+si} className="card" style={{marginBottom:12,padding:'4px 14px 14px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0 6px'}}>
              <span className="sem-lbl">{sem.semester}</span>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span className="sem-cred">{sem.credits} credits</span>
                <button onClick={()=>setModal({type:'add',semIdx:si})} style={{color:'var(--teal)',display:'flex',alignItems:'center'}}>
                  <Icon name="plus" size={18}/>
                </button>
              </div>
            </div>
            {sem.courses.length===0 ? (
              <div style={{textAlign:'center',color:'var(--t3)',fontSize:13,padding:'10px 0'}}>
                No courses. <button style={{color:'var(--teal)',fontWeight:700}} onClick={()=>setModal({type:'add',semIdx:si})}>Add one →</button>
              </div>
            ) : sem.courses.map((c,ci)=>(
              <div key={c.id} className="course-row" style={{cursor:'pointer'}} onClick={()=>setModal({type:'edit',semIdx:si,courseIdx:ci,data:c})}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}>
                    <span className={`stag ${c.type.includes('Major')?'stag-cs':c.type.includes('General')?'stag-math':'stag-hist'}`}>{c.type}</span>
                    <span style={{fontSize:12,color:'var(--t3)'}}>{c.credits} cr</span>
                  </div>
                </div>
                <div className={`gbadge ${gradeCls(c.grade)}`}>{c.grade}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="fab" onClick={()=>courses.length>0?setModal({type:'add',semIdx:0}):setAddSem(true)}>
        <Icon name="plus" size={24} color="#fff"/>
      </button>

      {modal && (
        <CModal
          init={modal.type==='edit'?modal.data:null}
          onSave={data=>saveCourse({semIdx:modal.semIdx,courseIdx:modal.courseIdx??null,data})}
          onDelete={modal.type==='edit'?()=>delCourse({semIdx:modal.semIdx,courseIdx:modal.courseIdx}):null}
          onClose={()=>setModal(null)}
        />
      )}
    </div>
  );
}

function CModal({init,onSave,onDelete,onClose}) {
  const isEdit = !!init;
  const [form,setForm]=useState({name:init?.name||'',credits:init?.credits||3,grade:init?.grade||'A',type:init?.type||'Major Core'});
  const [err,setErr]=useState({});
  const [confirmDel,setConfirmDel]=useState(false);
  const set=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const submit=()=>{
    if(!form.name.trim()){setErr({name:'Course name required'});return;}
    onSave({...form,credits:Number(form.credits)});
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-hdr">
          <span className="sheet-title">{isEdit?'Edit Record':'Add Course'}</span>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18}/></button>
        </div>
        <div className="sheet-body">
          {isEdit&&(
            <div style={{background:'rgba(26,56,93,.05)',borderLeft:'4px solid var(--navy)',borderRadius:8,padding:'10px 14px'}}>
              <div style={{fontWeight:800,fontSize:15,color:'var(--navy)'}}>Record Details</div>
              <div style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Ensure info matches your official transcript for accurate GPA.</div>
            </div>
          )}
          <div className="fgrp">
            <label className="flbl"><Icon name="book" size={12}/> Course Name</label>
            <input className="finput" placeholder="e.g. CS 301 - Data Structures" value={form.name} onChange={set('name')}/>
            {err.name&&<span className="ferr"><Icon name="warning" size={12}/>{err.name}</span>}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="fgrp">
              <label className="flbl"># Credits</label>
              <input className="finput" type="number" min={1} max={6} value={form.credits} onChange={set('credits')}/>
            </div>
            <div className="fgrp">
              <label className="flbl">☆ Grade</label>
              <select className="finput fselect" value={form.grade} onChange={set('grade')}>
                {GRADE_OPTS.map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="fgrp">
            <label className="flbl">Type</label>
            <select className="finput fselect" value={form.type} onChange={set('type')}>
              {TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          {isEdit&&(
            <div className="dzone">
              <div className="dzone-ttl"><Icon name="trash" size={13} color="var(--danger)"/>Remove Record</div>
              {confirmDel?(
                <div style={{display:'flex',gap:8}}>
                  <button className="btn btn-danger btn-sm" style={{flex:1}} onClick={onDelete}>Confirm Remove</button>
                  <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={()=>setConfirmDel(false)}>Cancel</button>
                </div>
              ):(
                <button className="btn btn-danger btn-sm" onClick={()=>setConfirmDel(true)}>
                  <Icon name="trash" size={15}/>Remove this record
                </button>
              )}
            </div>
          )}
        </div>
        <div className="sheet-foot">
          <button className="btn btn-navy" onClick={submit}>
            <Icon name="save" size={18} color="#fff"/>Save Changes
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
