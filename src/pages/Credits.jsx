import React, { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';
import { calcGPA, calcTotalCredits, GRADE_POINTS } from '../data/defaults.js';

const GRADE_OPTS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
const TYPES      = ['Major Core', 'Major Requirement', 'General Education', 'Elective'];
const REQUIRED   = 120;

function gradeCls(g) {
  if (g === 'A+' || g === 'A') return 'gA';
  if (g === 'A-')              return 'gAm';
  if (g === 'B+')              return 'gBp';
  if (g === 'B')               return 'gB';
  if (g === 'B-')              return 'gBm';
  if (g.startsWith('C'))       return 'gC';
  return 'gD';
}

function Donut({ pct, size = 82, stroke = 8 }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#F6C94E" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray .6s ease' }}
      />
    </svg>
  );
}

export function CreditsPage() {

  const { courses: rawCourses = [], saveCourses, toast } = useApp();


  const courses = Array.isArray(rawCourses) ? rawCourses : [];

  const [modal,   setModal]   = useState(null);
  const [addSem,  setAddSem]  = useState(false);
  const [semName, setSemName] = useState('');

  const gpa   = calcGPA(courses);
  const total = calcTotalCredits(courses);
  const pct   = Math.min(100, Math.round((total / REQUIRED) * 100));
  const all   = courses.flatMap((s) => Array.isArray(s.courses) ? s.courses : []);

  const major    = all.filter((c) => c.type.includes('Major')).reduce((s, c) => s + c.credits, 0);
  const elective = all.filter((c) => c.type === 'Elective').reduce((s, c) => s + c.credits, 0);
  const gen      = all.filter((c) => c.type === 'General Education').reduce((s, c) => s + c.credits, 0);

  const saveCourse = ({ semIdx, courseIdx, data }) => {
    const upd = courses.map((sem, si) => {
      if (si !== semIdx) return sem;
      const nc = courseIdx != null
        ? sem.courses.map((c, ci) => ci === courseIdx ? { ...c, ...data } : c)
        : [...sem.courses, { id: 'c' + Date.now(), ...data }];
      return { ...sem, courses: nc, credits: nc.reduce((s, c) => s + Number(c.credits), 0) };
    });
    saveCourses(upd);
    toast('Saved ✓', 'success');
    setModal(null);
  };

  const delCourse = ({ semIdx, courseIdx }) => {
    const upd = courses.map((sem, si) => {
      if (si !== semIdx) return sem;
      const nc = sem.courses.filter((_, ci) => ci !== courseIdx);
      return { ...sem, courses: nc, credits: nc.reduce((s, c) => s + c.credits, 0) };
    });
    saveCourses(upd);
    toast('Record removed', 'error');
    setModal(null);
  };

  const addSemester = () => {
    if (!semName.trim()) return;
    saveCourses([{ semester: semName.trim(), credits: 0, courses: [] }, ...courses]);
    setSemName('');
    setAddSem(false);
    toast('Semester added', 'success');
  };

  return (
    <>
      <div className="pg">
        <div className="navy-card cr-hero-card">
          <div className="cr-hero-inner">
            <div className="cr-top-row">
              <div className="cr-gpa-block">
                <div className="cr-gpa-label">Current GPA</div>
                <div className="gpa-num">{gpa}</div>
                <div style={{ marginTop: 10 }}>
                  <span className="cr-honor-badge">⭐ Top 5% · Honor Roll</span>
                </div>
              </div>
              <div className="cr-donut-wrap">
                <Donut pct={pct} size={82} stroke={8} />
                <div className="cr-donut-overlay">
                  <div className="cr-donut-pct">{pct}%</div>
                  <div className="cr-donut-lbl">Done</div>
                </div>
              </div>
            </div>

            <div className="cr-prog-row">
              <span>Degree Progress</span>
              <span style={{ fontSize: 11 }}>{pct}% of {REQUIRED} cr</span>
            </div>
            <div className="prog">
              <div className="prog-bar" style={{ width: `${pct}%` }} />
            </div>
            <div className="cr-prog-foot">
              <span>Earned: <strong>{total}</strong></span>
              <span>Needed: <strong>{REQUIRED}</strong></span>
            </div>

            <div className="cred-grid">
              {[
                { lbl: 'Major',      val: `${major} / 60` },
                { lbl: 'Electives',  val: `${elective} / 30` },
                { lbl: 'General Ed', val: `${gen} / 30` },
                { lbl: 'Remaining',  val: Math.max(0, REQUIRED - total), hi: true },
              ].map((c) => (
                <div key={c.lbl} className={`cred-cell ${c.hi ? 'hi' : ''}`}>
                  <div className="cred-lbl">{c.lbl}</div>
                  <div className="cred-val">{c.val}</div>
                </div>
              ))}
            </div>

            <div className="cr-grad-box">
              <div className="cr-grad-title">🎓 Graduation Path</div>
              <div className="cr-grad-body">On track to graduate by 2027.</div>
            </div>
          </div>
        </div>

        <div className="sec-hd" style={{ marginTop: 16 }}>
          <span className="sec-ttl">Course History</span>
          <button className="sec-act" onClick={() => setAddSem(true)}>+ Semester</button>
        </div>

        {addSem && (
          <div className="cr-add-sem-row">
            <input
              className="finput"
              style={{ flex: 1, minWidth: 0 }}
              placeholder="e.g. Fall Semester 2024"
              value={semName}
              onChange={(e) => setSemName(e.target.value)}
            />
            <button className="btn btn-navy btn-sm cr-add-sem-btn" onClick={addSemester}>Add</button>
            <button className="btn btn-ghost btn-sm cr-add-sem-btn" onClick={() => setAddSem(false)}>✕</button>
          </div>
        )}

        {courses.map((sem, si) => (
          <div key={sem.semester + si} className="card cr-sem-card">
            <div className="cr-sem-hdr">
              <span className="sem-lbl">{sem.semester}</span>
              <div className="cr-sem-hdr-right">
                <span className="sem-cred">{sem.credits} credits</span>
                <button
                  onClick={() => setModal({ type: 'add', semIdx: si })}
                  style={{ color: 'var(--teal)', display: 'flex', alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' }}
                >
                  <Icon name="plus" size={18} />
                </button>
              </div>
            </div>

            {sem.courses.length === 0 ? (
              <div className="cr-empty-sem">
                No courses.{' '}
                <button style={{ color: 'var(--teal)', fontWeight: 700 }} onClick={() => setModal({ type: 'add', semIdx: si })}>
                  Add one →
                </button>
              </div>
            ) : sem.courses.map((c, ci) => (
              <div
                key={c.id}
                className="course-row"
                style={{ cursor: 'pointer' }}
                onClick={() => setModal({ type: 'edit', semIdx: si, courseIdx: ci, data: c })}
              >
                <div className="cr-course-info">
                  <div className="cr-course-name">{c.name}</div>
                  <div className="cr-course-meta">
                    <span className={`stag ${c.type.includes('Major') ? 'stag-cs' : c.type.includes('General') ? 'stag-math' : 'stag-hist'}`}>
                      {c.type}
                    </span>
                    <span className="cr-course-cred">{c.credits} cr</span>
                  </div>
                </div>
                <div className={`gbadge ${gradeCls(c.grade)}`}>{c.grade}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => courses.length > 0 ? setModal({ type: 'add', semIdx: 0 }) : setAddSem(true)}>
        <Icon name="plus" size={24} color="#fff" />
      </button>

      {modal && (
        <CModal
          init={modal.type === 'edit' ? modal.data : null}
          onSave={(data) => saveCourse({ semIdx: modal.semIdx, courseIdx: modal.courseIdx ?? null, data })}
          onDelete={modal.type === 'edit' ? () => delCourse({ semIdx: modal.semIdx, courseIdx: modal.courseIdx }) : null}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function CModal({ init, onSave, onDelete, onClose }) {
  const isEdit = !!init;
  const [form, setForm] = useState({
    name:    init?.name    || '',
    credits: init?.credits || 3,
    grade:   init?.grade   || 'A',
    type:    init?.type    || 'Major Core',
  });
  const [err, setErr]               = useState({});
  const [confirmDel, setConfirmDel] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!form.name.trim()) { setErr({ name: 'Course name required' }); return; }
    onSave({ ...form, credits: Number(form.credits) });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-hdr">
          <span className="sheet-title">{isEdit ? 'Edit Record' : 'Add Course'}</span>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="sheet-body">
          {isEdit && (
            <div className="cr-modal-info-box">
              <div className="cr-modal-info-ttl">Record Details</div>
              <div className="cr-modal-info-sub">Ensure info matches your official transcript for accurate GPA.</div>
            </div>
          )}
          <div className="fgrp">
            <label className="flbl"><Icon name="book" size={12} /> Course Name</label>
            <input className="finput" placeholder="e.g. CS 301 - Data Structures" value={form.name} onChange={set('name')} />
            {err.name && <span className="ferr"><Icon name="warning" size={12} />{err.name}</span>}
          </div>
          <div className="cr-modal-2col">
            <div className="fgrp">
              <label className="flbl"># Credits</label>
              <input className="finput" type="number" min={1} max={6} value={form.credits} onChange={set('credits')} />
            </div>
            <div className="fgrp">
              <label className="flbl">Grade</label>
              <select className="finput fselect" value={form.grade} onChange={set('grade')}>
                {GRADE_OPTS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="fgrp">
            <label className="flbl">Type</label>
            <select className="finput fselect" value={form.type} onChange={set('type')}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          {isEdit && (
            <div className="dzone">
              <div className="dzone-ttl"><Icon name="trash" size={13} color="var(--danger)" />Remove Record</div>
              {confirmDel ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={onDelete}>Confirm Remove</button>
                  <button className="btn btn-ghost btn-sm"  style={{ flex: 1 }} onClick={() => setConfirmDel(false)}>Cancel</button>
                </div>
              ) : (
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDel(true)}>
                  <Icon name="trash" size={15} />Remove this record
                </button>
              )}
            </div>
          )}
        </div>
        <div className="sheet-foot">
          <button className="btn btn-navy" onClick={submit}>
            <Icon name="save" size={18} color="#fff" />Save Changes
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}