import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';
import { SUBJECTS } from '../data/defaults.js';
import { saveImage, getAllImages, deleteImage } from '../utils/imageDB.js';

const TAG = {
  'Computer Science': 'cs', 'Mathematics': 'math', 'History': 'hist', 'Physics': 'sci',
  'Philosophy': 'sci', 'Economics': 'econ', 'Biology': 'bio', 'Engineering': 'cs',
  'English Literature': 'eng', 'Psychology': 'sci', 'Statistics': 'math',
  'Software Engineering': 'cs', 'Mobile Development': 'cs', 'Advanced Data Structures': 'cs',
  'Cloud Computing': 'cs', 'Software Metrics': 'cs', 'Software Evaluation': 'cs',
  'Ethics in Technology': 'sci', 'Big Data': 'cs',
};

export function NotesPage() {
  const { notes, saveNotes, toast } = useApp();
  const [images,   setImages]   = useState({});
  const [imgReady, setImgReady] = useState(false);
  const [camOpen,  setCamOpen]  = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');

  useEffect(() => {
    (async () => {
      const map = await getAllImages();
      setImages(map);
      setImgReady(true);
    })();
  }, []);

  const withImage = (note) => ({ ...note, imageData: images[note.id] || null });

  const subjects = ['All', ...new Set(notes.map((n) => n.subject))];
  const filtered = notes.filter((n) => {
    const ms = filter === 'All' || n.subject === filter;
    const mq = n.title.toLowerCase().includes(search.toLowerCase()) ||
               n.subject.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  }).map(withImage);

  const addNote = async (data) => {
    const id = 'n' + Date.now();
    const { imageData, ...meta } = data;
    await saveImage(id, imageData);
    saveNotes([{ id, ...meta, createdAt: new Date().toISOString() }, ...notes]);
    setImages((prev) => ({ ...prev, [id]: imageData }));
    toast('Note captured! 📸', 'success');
  };

  const deleteNote = async (id) => {
    saveNotes(notes.filter((n) => n.id !== id));
    await deleteImage(id);
    setImages((prev) => { const next = { ...prev }; delete next[id]; return next; });
    setViewNote(null);
    toast('Note deleted', 'error');
  };

  const lastThumb = notes[0] ? images[notes[0].id] : null;

  return (
    <div className="page">
      <div className="pg">
        <div className="pg-ttl">Capture Notes</div>
        <div className="pg-sub" style={{ marginBottom: 10 }}>Photograph and store your handwritten lecture notes.</div>

   
        <div className="navy-card" style={{ padding: 20, marginBottom: 18 }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,.12)', border: '1.5px solid rgba(255,255,255,.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="camera" size={24} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 3 }}>Capture a Note</div>
              <div style={{ fontSize: 12, opacity: .72, lineHeight: 1.5 }}>Open your camera to photograph handwritten notes and store them by subject.</div>
            </div>
          </div>
          <button className="btn btn-gold" style={{ marginTop: 14, position: 'relative', zIndex: 1 }} onClick={() => setCamOpen(true)}>
            <Icon name="camera" size={18} color="#fff" /> Open Camera
          </button>
        </div>

    
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: 'rgba(26,56,93,.07)', border: '1.5px solid rgba(26,56,93,.12)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--navy)' }}>{notes.length}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>Total Notes</div>
          </div>
          <div style={{ background: 'rgba(41,140,189,.08)', border: '1.5px solid rgba(41,140,189,.12)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--teal)' }}>{new Set(notes.map((n) => n.subject)).size}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>Subjects</div>
          </div>
        </div>

     
        <div className="finput-wrap" style={{ marginBottom: 12 }}>
          <span className="finput-icon"><Icon name="search" size={17} /></span>
          <input className="finput" placeholder="Search notes…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>


        {subjects.length > 1 && (
          <div className="chips" style={{ marginBottom: 16 }}>
            {subjects.map((s) => (
              <button key={s} className={`chip ${filter === s ? 'on' : ''}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        )}

  
        {!imgReady ? (
          <div className="empty">
            <div className="empty-icon"><Icon name="camera" size={28} color="var(--border2)" /></div>
            <div className="empty-h">Loading notes…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><Icon name="camera" size={28} color="var(--border2)" /></div>
            <div className="empty-h">{notes.length === 0 ? 'No notes yet' : 'No results'}</div>
            <div className="empty-p">{notes.length === 0 ? 'Tap "Open Camera" to capture your first note.' : 'Try a different search or subject filter.'}</div>
          </div>
        ) : (
          <div className="note-grid">
            {filtered.map((note) => (
              <div key={note.id} className="note-card" onClick={() => setViewNote(note)}>
                <div className="note-thumb">
                  {note.imageData
                    ? <img src={note.imageData} alt={note.title} />
                    : <Icon name="image" size={32} color="var(--border2)" />}
                </div>
                <span className="note-sub-tag">{note.subject?.slice(0, 4).toUpperCase()}</span>
                <div className="note-info">
                  <div className="note-name">{note.title}</div>
                  <div className="note-date">
                    {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {camOpen  && <CameraView onCapture={addNote} onClose={() => setCamOpen(false)} lastThumb={lastThumb} />}
      {viewNote && <NoteViewer note={viewNote} onDelete={() => deleteNote(viewNote.id)} onClose={() => setViewNote(null)} />}
    </div>
  );
}


function CameraView({ onCapture, onClose, lastThumb }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [ready,    setReady]    = useState(false);
  const [flash,    setFlash]    = useState(false);
  const [error,    setError]    = useState('');
  const [captured, setCaptured] = useState(null);
  const [form,     setForm]     = useState({ title: '', subject: SUBJECTS[0] });

  useEffect(() => {
    startCam();
    return () => stopCam();
  }, []);

  
  const startCam = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch (e) {
      setError('Camera unavailable. ' + (e.message || 'Please allow camera access in browser settings.'));
    }
  };

  const stopCam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  // Capture frame to canvas (then to base64 JPEG)
  const shoot = () => {
    if (!ready || !videoRef.current) return;
    const cv = canvasRef.current;
    const vd = videoRef.current;
    cv.width  = vd.videoWidth;
    cv.height = vd.videoHeight;
    cv.getContext('2d').drawImage(vd, 0, 0);
    const img = cv.toDataURL('image/jpeg', 0.82);
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setCaptured(img);
    stopCam();
  };

  const retake = () => {
    setCaptured(null);
    setReady(false);
    startCam();
  };

  const saveNote = () => {
    if (!form.title.trim()) return;
    onCapture({ title: form.title, subject: form.subject, imageData: captured, subjectTag: TAG[form.subject] || 'cs' });
    onClose();
  };

  return (
    <div className="cam-shell">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!captured ? (
        <>
          {error ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32, background: '#111', color: '#fff', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="camera" size={36} color="rgba(255,255,255,.3)" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Camera Not Available</div>
              <div style={{ fontSize: 13, opacity: .7, lineHeight: 1.6, maxWidth: 280 }}>{error}</div>
              <button className="btn btn-glass" style={{ maxWidth: 220 }} onClick={onClose}>
                <Icon name="back" size={18} color="#fff" /> Go Back
              </button>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="cam-video" />
              {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: .75, zIndex: 10, pointerEvents: 'none' }} />}
              <div className="cam-ov">
                <div className="cam-top">
                  <button onClick={onClose} style={{ color: '#fff', minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="close" size={24} color="#fff" />
                  </button>
                  <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>Capture Notes</span>
                  <div style={{ width: 44 }} />
                </div>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="cam-frame">
                    <div className="cam-scan" />
                    {[
                      { top: 0, left: 0,     borderTop: '3px solid var(--gold-light)', borderLeft: '3px solid var(--gold-light)' },
                      { top: 0, right: 0,    borderTop: '3px solid var(--gold-light)', borderRight: '3px solid var(--gold-light)' },
                      { bottom: 0, left: 0,  borderBottom: '3px solid var(--gold-light)', borderLeft: '3px solid var(--gold-light)' },
                      { bottom: 0, right: 0, borderBottom: '3px solid var(--gold-light)', borderRight: '3px solid var(--gold-light)' },
                    ].map((style, i) => (
                      <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...style }} />
                    ))}
                  </div>
                  <div style={{ position: 'absolute', bottom: 'calc(50% - 52% + 8px)', fontSize: 12, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>
                    Align notes within frame
                  </div>
                </div>
                <div className="cam-bot">
                  <div className="cam-thumb">
                    {lastThumb && <img src={lastThumb} alt="last" />}
                  </div>
                  <button className="cam-shutter" onClick={shoot} disabled={!ready}>
                    <div style={{ width: 58, height: 58, borderRadius: '50%', background: ready ? '#fff' : 'rgba(255,255,255,.5)', border: '3px solid #ddd' }} />
                  </button>
                  <div style={{ width: 54 }} />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#000' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(0,0,0,.6)' }}>
            <button onClick={retake} style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, minHeight: 44 }}>
              <Icon name="back" size={20} color="#fff" /> Retake
            </button>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Preview</span>
            <div style={{ width: 70 }} />
          </div>
          <img src={captured} alt="captured" style={{ flex: 1, objectFit: 'contain', width: '100%', background: '#111' }} />
          <div style={{ background: 'var(--surface)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="fgrp">
              <label className="flbl">Note Title</label>
              <input
                className="finput"
                placeholder="e.g. Advanced Calculus — Oct 24"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="fgrp">
              <label className="flbl">Subject</label>
              <select className="finput fselect" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}>
                {SUBJECTS.filter(Boolean).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn btn-navy" onClick={saveNote} disabled={!form.title.trim()}>
              <Icon name="save" size={18} color="#fff" /> Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteViewer({ note, onDelete, onClose }) {
  const [confirmDel, setConfirmDel] = useState(false);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" style={{ maxHeight: '95dvh' }} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-hdr">
          <span className="sheet-title" style={{ flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</span>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        {note.imageData && (
          <img src={note.imageData} alt={note.title} style={{ width: '100%', maxHeight: '52dvh', objectFit: 'contain', background: '#f0f0f0' }} />
        )}
        <div className="sheet-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className={`stag stag-${note.subjectTag || 'cs'}`}>{note.subject}</span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>
              {new Date(note.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="dzone">
            <div className="dzone-ttl"><Icon name="trash" size={13} color="var(--danger)" />Delete Note</div>
            {confirmDel ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={onDelete}>Confirm Delete</button>
                <button className="btn btn-ghost btn-sm"  style={{ flex: 1 }} onClick={() => setConfirmDel(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmDel(true)}>
                <Icon name="trash" size={15} /> Delete this note
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
