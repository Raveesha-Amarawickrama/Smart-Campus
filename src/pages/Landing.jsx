import React from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';

export function LandingPage() {
  const { setPage } = useApp();

  return (
    <div className="lp">
      <section className="lp-hero">
        <div className="lp-bar">
          <div className="lp-logo">
            <div className="lp-logo-box">
              <Icon name="graduation" size={20} color="#fff" />
            </div>
            <span className="lp-logo-txt">Smart Campus</span>
          </div>
        </div>

        <div className="lp-hero-body">
          <h1 className="lp-h1">Your Campus,<br /><span>Simplified.</span></h1>
          <p className="lp-hero-p">
            Manage your schedule, prioritize assignments, track credit progress, and capture
            lecture notes — all packed into one seamless interface.
          </p>
          <div className="lp-hero-btns">
            <button className="btn btn-gold" onClick={() => setPage('register')}>
              Get Started Free
              <Icon name="arrow" size={18} color="#fff" />
            </button>
            <button className="btn btn-glass" onClick={() => setPage('login')}>
              <Icon name="user" size={16} color="#fff" />
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      <section className="lp-sec">
        <h2 className="lp-sec-title">Powerful Tools for Success</h2>
        <p className="lp-sec-sub">Every feature you need to dominate your curriculum.</p>

        {[
          {
            icon: 'dashboard', iconCls: 'feat-icon-navy',
            title: 'Unified Dashboard',
            desc: 'Your academic command center. View upcoming classes, grade trends, and urgent tasks at a glance.',
            bullets: ['Live lecture schedule', 'Deadline alerts'],
          },
          {
            icon: 'assignments', iconCls: 'feat-icon-gold',
            title: 'Assignment Tracker',
            desc: 'Never miss a deadline. Priority tagging and dynamic status filtering keep you ahead.',
            bullets: ['Smart prioritization', 'Overdue detection'],
          },
          {
            icon: 'camera', iconCls: 'feat-icon-teal',
            title: 'Notes Capture',
            desc: 'Photograph handwritten notes with your device camera and organise by subject.',
          },
          {
            icon: 'credits', iconCls: 'feat-icon-succ',
            title: 'Degree Progress',
            desc: 'Visual credit tracking to keep you on the path to graduation without surprises.',
          },
        ].map((f) => (
          <div key={f.title} className="feat-card">
            <div className={`feat-icon ${f.iconCls}`}>
              <Icon name={f.icon} size={22} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="feat-ttl">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
              {f.bullets && (
                <div className="feat-bullets">
                  {f.bullets.map((b) => (
                    <div key={b} className="feat-bullet">
                      <div className="feat-dot" />{b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: '0 20px 28px' }}>
        <div className="lp-preview">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="lp-preview-title">Everything in one place</div>
            <div className="lp-preview-sub">Four powerful modules working together.</div>
            <div className="lp-preview-list">
              {[
                { icon: 'dashboard',   text: 'Unified Dashboard — classes, tasks, progress at a glance' },
                { icon: 'assignments', text: 'Smart Assignment Tracker with deadline alerts' },
                { icon: 'credits',     text: 'GPA & Credit tracker with graduation path' },
                { icon: 'camera',      text: 'Camera notes — capture handwritten notes instantly' },
              ].map((r) => (
                <div key={r.text} className="lp-preview-row">
                  <div className="lp-preview-icon">
                    <Icon name={r.icon} size={14} color="#fff" />
                  </div>
                  {r.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lp-join">
        <div className="lp-join-avatars">
          {['A', 'B', 'C', 'D'].map((l, i) => (
            <div
              key={l}
              className="lp-join-av"
              style={{
                zIndex: 4 - i,
                background: i % 2 === 0
                  ? 'linear-gradient(145deg,#2A4F82,#0F2240)'
                  : 'linear-gradient(145deg,#298CBD,#1a6e98)',
              }}
            >
              {l}
            </div>
          ))}
        </div>
        <div className="lp-join-num">Join Smart Campus</div>
        <div className="lp-join-sub">Connect with classmates and manage your degree with confidence.</div>

        <div className="lp-testimonial">
          <div className="lp-quote-mark">"</div>
          <p className="lp-quote">
            Smart Campus didn't just organise my schedule; it fundamentally changed how I approach
            my degree. It's the digital backbone of my academic career.
          </p>
          <div className="lp-author">
            <div className="lp-author-av">R</div>
            <div>
              <div className="lp-author-name">Rasadi Sanchala</div>
              <div className="lp-author-sub">Software Engineering, University of Kelaniya</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
