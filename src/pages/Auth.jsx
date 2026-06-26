import React, { useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { Icon } from '../components/Icon.jsx';

const MAJORS = [
  'Computer Science', 'Mathematics', 'Physics', 'Software Engineering',
  'Business', 'Arts & Humanities', 'Medicine', 'Law', 'Education',
];


export function LoginPage() {
  const { saveUser, setPage, toast } = useApp();
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [show,    setShow]    = useState(false);
  const [err,     setErr]     = useState({});
  const [loading, setLoading] = useState(false);


  const validate = () => {
    const e = {};
    if (!email.includes('@') || !email.includes('.')) e.email = 'Enter a valid university email';
    if (pass.length < 6) e.pass = 'Password must be at least 6 characters';
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErr(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    saveUser({ name: 'Alex Jordan', email, major: 'Software Engineering', year: 'Junior', avatar: null });
    setPage('dashboard');
    toast('Welcome back, Alex! 👋', 'success');
    setLoading(false);
  };

  const ssoLogin = () => {
    saveUser({ name: 'Alex Jordan', email: 'alex@kelaniya.ac.lk', major: 'Software Engineering', year: 'Junior', avatar: null });
    setPage('dashboard');
    toast('Signed in with University SSO 🎓', 'success');
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-logo"><Icon name="graduation" size={34} color="#fff" /></div>
        <div className="auth-pill">
          <Icon name="star" size={11} color="var(--gold-light)" strokeWidth={3} />
          SMART CAMPUS
        </div>
        <h1 className="auth-h1">Welcome Back</h1>
        <p className="auth-p">Sign in to access your courses, track grades, and stay ahead of deadlines.</p>
      </div>

      <div className="auth-body">
     
        <div className="fgrp">
          <label className="flbl"><Icon name="user" size={12} /> Student Email</label>
          <div className="finput-wrap">
            <span className="finput-icon"><Icon name="user" size={17} /></span>
            <input
              className="finput"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErr((p) => ({ ...p, email: '' })); }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              autoComplete="email"
            />
          </div>
          {err.email && <span className="ferr"><Icon name="warning" size={12} />{err.email}</span>}
        </div>

   
        <div className="fgrp">
          <label className="flbl">
            <Icon name="settings" size={12} /> Password
            <span className="auth-link" onClick={() => toast('Password reset email sent!', 'info')}>Forgot Password?</span>
          </label>
          <div className="pw-wrap finput-wrap">
            <span className="finput-icon"><Icon name="settings" size={17} /></span>
            <input
              className="finput"
              style={{ paddingLeft: 44 }}
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setErr((p) => ({ ...p, pass: '' })); }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              autoComplete="current-password"
            />
            <button className="pw-eye" onClick={() => setShow(!show)}>
              <Icon name={show ? 'eye-off' : 'eye'} size={18} />
            </button>
          </div>
          {err.pass && <span className="ferr"><Icon name="warning" size={12} />{err.pass}</span>}
        </div>

        <button className="btn btn-navy" onClick={submit} disabled={loading}>
          {loading ? <span className="spin" /> : <><span>Sign In</span><Icon name="arrow" size={18} color="#fff" /></>}
        </button>

        <div className="auth-divider">or continue with</div>

        <button className="auth-sso" onClick={ssoLogin}>
          <GoogleIcon />
          University Single Sign-On
        </button>
      </div>

      <div className="auth-foot">
        Don't have an account?{' '}
        <strong onClick={() => setPage('register')}>Register for free</strong>
      </div>
    </div>
  );
}


export function RegisterPage() {
  const { saveUser, setPage, toast } = useApp();
  const [form,    setForm]    = useState({ name: '', id: '', email: '', pass: '', major: 'Software Engineering' });
  const [show,    setShow]    = useState(false);
  const [err,     setErr]     = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErr((p)  => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name  = 'Enter your full name (at least 2 characters)';
    if (!form.id.trim())             e.id    = 'Enter your student ID';
    if (!form.email.includes('@'))   e.email = 'Enter a valid university email';
    if (form.pass.length < 6)        e.pass  = 'Password must be at least 6 characters';
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErr(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    saveUser({
      name: form.name, email: form.email,
      studentId: form.id, major: form.major,
      year: 'Freshman', avatar: null,
    });
    setPage('dashboard');
    toast(`Account created! Welcome, ${form.name.split(' ')[0]}! 🎉`, 'success');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-logo"><Icon name="graduation" size={34} color="#fff" /></div>
        <div className="auth-pill">
          <Icon name="star" size={11} color="var(--gold-light)" strokeWidth={3} />
          FREE ACCOUNT
        </div>
        <h1 className="auth-h1">Join our community</h1>
        <p className="auth-p">Register to access courses, track your grades, and connect with peers.</p>
      </div>

      <div className="auth-body">
        {[
          { k: 'name',  lbl: 'Full Name',    ph: 'John Doe',             icon: 'user',       type: 'text'  },
          { k: 'id',    lbl: 'Student ID',   ph: 'SE/2021/XXX',          icon: 'book',       type: 'text'  },
          { k: 'email', lbl: 'Academic Email', ph: 'john@kelaniya.ac.lk', icon: 'bell',      type: 'email' },
        ].map(({ k, lbl, ph, icon, type }) => (
          <div className="fgrp" key={k}>
            <label className="flbl"><Icon name={icon} size={12} /> {lbl}</label>
            <div className="finput-wrap">
              <span className="finput-icon"><Icon name={icon} size={17} /></span>
              <input className="finput" type={type} placeholder={ph} value={form[k]} onChange={set(k)} />
            </div>
            {err[k] && <span className="ferr"><Icon name="warning" size={12} />{err[k]}</span>}
          </div>
        ))}

        <div className="fgrp">
          <label className="flbl"><Icon name="graduation" size={12} /> Major / Faculty</label>
          <select className="finput fselect" value={form.major} onChange={set('major')}>
            {MAJORS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="fgrp">
          <label className="flbl"><Icon name="settings" size={12} /> Password</label>
          <div className="pw-wrap finput-wrap">
            <span className="finput-icon"><Icon name="settings" size={17} /></span>
            <input
              className="finput"
              style={{ paddingLeft: 44 }}
              type={show ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={form.pass}
              onChange={set('pass')}
            />
            <button className="pw-eye" onClick={() => setShow(!show)}>
              <Icon name={show ? 'eye-off' : 'eye'} size={18} />
            </button>
          </div>
          {err.pass && <span className="ferr"><Icon name="warning" size={12} />{err.pass}</span>}
        </div>

        <button className="btn btn-navy" onClick={submit} disabled={loading}>
          {loading ? <span className="spin" /> : <><span>Create Account</span><Icon name="arrow" size={18} color="#fff" /></>}
        </button>

        <div className="auth-divider">or join with</div>
        <button className="auth-sso" onClick={() => {
          saveUser({ name: form.name || 'New Student', email: form.email || 'student@kelaniya.ac.lk', major: form.major, year: 'Freshman', avatar: null });
          setPage('dashboard');
          toast('Registered with University SSO 🎓', 'success');
        }}>
          <GoogleIcon />
          University Single Sign-On
        </button>
      </div>

      <div className="auth-foot">
        Already have an account?{' '}
        <strong onClick={() => setPage('login')}>Sign In</strong>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
