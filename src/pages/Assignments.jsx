import React, { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';
import { getDuePriority, formatDueDate, SUBJECTS } from '../data/defaults.js';

const TAG = {
  'Computer Science': 'cs', 'Mathematics': 'math', 'History': 'hist', 'Physics': 'sci',
  'Philosophy': 'sci', 'Economics': 'econ', 'Biology': 'bio', 'Engineering': 'cs',
  'English Literature': 'eng', 'Psychology': 'sci', 'Statistics': 'math',
  'Sociology': 'econ', 'Political Science': 'sci', 'Art History': 'hist',
  'Ethics in Technology': 'sci', 'Big Data': 'cs', 'Software Engineering': 'cs',
  'Mobile Development': 'cs', 'Advanced Data Structures': 'cs', 'Cloud Computing': 'cs',
  'Software Metrics': 'cs', 'Software Evaluation': 'cs',
};

export function AssignmentsPage() {
  const { assignments, saveAssignments, toast, addNotification } = useApp();
  const [filter, setFilter] = useState('All');
  const [modal,  setModal]  = useState(null);
  const [search, setSearch] = useState('');

  const filtered = assignments.filter((a) => {
    const mq = a.title.toLowerCase().includes(search.toLowerCase()) ||
               a.subject.toLowerCase().includes(search.toLowerCase());
    if (!mq) return false;
    if (filter === 'Pending')   return !a.completed;
    if (filter === 'Completed') return a.completed;
    if (filter === 'Overdue')   return !a.completed && getDuePriority(a.dueDate) === 'overdue';
    if (filter === 'Urgent')    return !a.completed && getDuePriority(a.dueDate) === 'urgent';
    return true;
  });

  const counts = {
    all:     assignments.length,
    pending: assignments.filter((a) => !a.completed).length,
    done:    assignments.filter((a) => a.completed).length,
    overdue: assignments.filter((a) => !a.completed && getDuePriority(a.dueDate) === 'overdue').length,
  };

  const toggle = (id) => {
    const a = assignments.find((x) => x.id === id);
    saveAssignments(assignments.map((x) => x.id === id ? { ...x, completed: !x.completed } : x));
    if (!a.completed) {
      toast(`"${a.title}" completed!`, 'success');
      addNotification({ title: 'Assignment Done', body: `You completed "${a.title}"`, type: 'success' });
    }
  };

  const save = (data) => {
    if (data.id && assignments.find((a) => a.id === data.id)) {
      saveAssignments(assignments.map((a) => a.id === data.id ? data : a));
      toast('Assignment updated ✓', 'success');
    } else {
      const n = {
        ...data,
        id: 'a' + Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
        subjectTag: TAG[data.subject] || 'cs',
      };
      saveAssignments([n, ...assignments]);
      toast('Assignment added!', 'success');
      addNotification({ title: 'New Assignment', body: `"${data.title}" due ${formatDueDate(data.dueDate)}`, type: 'info' });
    }
    setModal(null);
  };

  const del = (id) => {
    const a = assignments.find((x) => x.id === id);
    saveAssignments(assignments.filter((x) => x.id !== id));
    setModal(null);
    toast(`Deleted "${a.title}"`, 'error');
  };

  return (
    <div className="page" style={{ overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      <div className="pg" style={{ overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>

        <div className="pg-ttl">Assignments</div>
        <div className="pg-sub">Manage your coursework and deadlines.</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 8,
          marginBottom: 14,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {[
            { lbl: 'Total',   val: counts.all,    col: 'var(--navy)',    bg: 'rgba(26,56,93,.07)',   border: 'rgba(26,56,93,.12)' },
            { lbl: 'Pending', val: counts.pending, col: 'var(--teal)',    bg: 'rgba(41,140,189,.08)', border: 'rgba(41,140,189,.15)' },
            { lbl: 'Done',    val: counts.done,    col: 'var(--success)', bg: 'rgba(56,161,105,.08)', border: 'rgba(56,161,105,.15)' },
            { lbl: 'Late',    val: counts.overdue, col: 'var(--danger)',  bg: 'rgba(229,62,62,.08)',  border: 'rgba(229,62,62,.15)' },
          ].map((s) => (
            <div key={s.lbl} style={{
              background: s.bg,
              border: `1.5px solid ${s.border}`,
              borderRadius: 12,
              padding: '12px 8px',
              textAlign: 'center',
              minWidth: 0,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}>
              <div style={{ fontSize: 'clamp(18px, 6vw, 24px)', fontWeight: 900, color: s.col, lineHeight: 1.1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, marginTop: 3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

    
        <div className="finput-wrap" style={{ marginBottom: 10, width: '100%', boxSizing: 'border-box' }}>
          <span className="finput-icon"><Icon name="search" size={17} /></span>
          <input
            className="finput"
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 44, fontSize: 16 }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            gap: 8,
            paddingBottom: 4,
            marginBottom: 14,
            maxWidth: '100%',
            boxSizing: 'border-box',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
          role="group"
          aria-label="Filter assignments"
        >
          {['All', 'Pending', 'Urgent', 'Overdue', 'Completed'].map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? 'on' : ''}`}
              onClick={() => setFilter(f)}
              style={{ flexShrink: 0 }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Icon name="graduation" size={28} color="var(--border2)" /></div>
              <div className="empty-h">All caught up! 🎉</div>
              <div className="empty-p">
                No {filter !== 'All' ? filter.toLowerCase() + ' ' : ''}assignments found.
              </div>
            </div>
          ) : filtered.map((a) => {
            const pri = getDuePriority(a.dueDate);
            return (
              <div
                key={a.id}
                className={`acard ${a.completed ? 'done' : pri}`}
                onClick={() => setModal(a)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Checkbox hit-area */}
                <div
                  className="chk-hit"
                  onClick={(e) => { e.stopPropagation(); toggle(a.id); }}
                  style={{ flexShrink: 0 }}
                  role="checkbox"
                  aria-checked={a.completed}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle(a.id))}
                >
                  <div className={`chk ${a.completed ? 'done' : pri}`}>
                    {a.completed && <Icon name="check" size={13} color="#fff" />}
                  </div>
                </div>

                {/* Body */}
                <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: a.completed ? 'var(--t3)' : 'var(--t1)',
                    textDecoration: a.completed ? 'line-through' : 'none',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.35,
                    wordBreak: 'break-word',
                  }}>
                    {a.title}
                  </div>

                  {a.description ? (
                    <div style={{
                      fontSize: 12, color: 'var(--t3)', marginTop: 2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {a.description}
                    </div>
                  ) : null}

                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 5, marginTop: 7,
                    flexWrap: 'wrap', maxWidth: '100%',
                  }}>
                    <span
                      className={`stag stag-${a.subjectTag || 'cs'}`}
                      style={{
                        maxWidth: 'min(48%, 110px)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flexShrink: 1,
                      }}
                    >
                      {a.subject}
                    </span>

                    <span className={`due-pill ${a.completed ? 'done' : pri}`} style={{ flexShrink: 0 }}>
                      <Icon name="calendar" size={10} />
                      {a.completed ? 'Completed' : formatDueDate(a.dueDate)}
                    </span>
                  </div>
                </div>

                <Icon name="chevron-r" size={16} color="var(--t3)" style={{ flexShrink: 0, marginLeft: 4 }} />
              </div>
            );
          })}
        </div>

        <div style={{ height: 16 }} />
      </div>

      <button className="fab" onClick={() => setModal('add')} aria-label="Add assignment">
        <Icon name="plus" size={24} color="#fff" />
      </button>

      {modal && (
        <AModal
          init={modal === 'add' ? null : modal}
          onSave={save}
          onDelete={modal !== 'add' ? () => del(modal.id) : null}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}


function AModal({ init, onSave, onDelete, onClose }) {
  const isEdit = !!init;
  const [form, setForm] = useState({
    title:       init?.title       || '',
    subject:     init?.subject     || 'Computer Science',
    dueDate:     init?.dueDate     || new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0],
    description: init?.description || '',
    id:          init?.id          || null,
  });
  const [err, setErr]               = useState({});
  const [confirmDel, setConfirmDel] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    const e = {};
    if (!form.title.trim()) e.title   = 'Title is required';
    if (!form.dueDate)      e.dueDate = 'Due date is required';
    setErr(e);
    if (Object.keys(e).length) return;
    onSave({ ...form, subjectTag: TAG[form.subject] || 'cs' });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="sheet"
        style={{ overflowX: 'hidden', boxSizing: 'border-box', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />

        <div className="sheet-hdr">
          <span className="sheet-title" style={{
            flex: 1, minWidth: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {isEdit ? 'Edit Assignment' : 'Add Assignment'}
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close" style={{ flexShrink: 0 }}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="sheet-body" style={{ overflowX: 'hidden', boxSizing: 'border-box' }}>

          <div className="fgrp">
            <label className="flbl">Assignment Title</label>
            <input
              className="finput"
              placeholder="e.g. Data Structures Project"
              value={form.title}
              onChange={set('title')}
              autoComplete="off"
              style={{ fontSize: 16 }}
            />
            {err.title && <span className="ferr"><Icon name="warning" size={12} />{err.title}</span>}
          </div>

          <div className="fgrp">
            <label className="flbl">Subject</label>
            <select className="finput fselect" value={form.subject} onChange={set('subject')} style={{ fontSize: 16 }}>
              {SUBJECTS.filter(Boolean).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="fgrp">
            <label className="flbl">Due Date</label>
            <input
              className="finput"
              type="date"
              value={form.dueDate}
              onChange={set('dueDate')}
              min={new Date().toISOString().split('T')[0]}
              style={{ fontSize: 16, appearance: 'none', WebkitAppearance: 'none' }}
            />
            {err.dueDate && <span className="ferr"><Icon name="warning" size={12} />{err.dueDate}</span>}
          </div>

          <div className="fgrp">
            <label className="flbl">Description (optional)</label>
            <textarea
              className="finput"
              rows={3}
              placeholder="What does this assignment involve?"
              value={form.description}
              onChange={set('description')}
              style={{ resize: 'none', fontSize: 16 }}
            />
          </div>

          {isEdit && (
            <div className="dzone">
              <div className="dzone-ttl">
                <Icon name="warning" size={13} color="var(--danger)" />Danger Zone
              </div>
              {confirmDel ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1, minWidth: 0 }} onClick={onDelete}>
                    Confirm Delete
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1, minWidth: 0 }} onClick={() => setConfirmDel(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDel(true)}>
                  <Icon name="trash" size={15} />Delete Assignment
                </button>
              )}
            </div>
          )}
        </div>

        <div className="sheet-foot">
          <button className="btn btn-navy" onClick={submit}>
            <Icon name="save" size={18} color="#fff" />
            {isEdit ? 'Save Changes' : 'Add Assignment'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}