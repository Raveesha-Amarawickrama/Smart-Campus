import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, KEYS } from './utils/storage.js';
import { DEFAULT_ASSIGNMENTS, DEFAULT_COURSES, DEFAULT_SCHEDULE } from './data/defaults.js';

const AppCtx = createContext(null);

const safeArray = (val, fallback) => (Array.isArray(val) ? val : fallback);

export function AppProvider({ children }) {
  const [user,            setUserState]       = useState(null);
  const [assignments,     setAssignments]     = useState([]);
  const [courses,         setCourses]         = useState([]);
  const [schedule,        setSchedule]        = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError,   setScheduleError]   = useState(null);
  const [notes,           setNotes]           = useState([]);
  const [settings,        setSettings]        = useState({ notifications: true, darkMode: false });
  const [notifications,   setNotifications]   = useState([]);
  const [toasts,          setToasts]          = useState([]);
  const [page,            setPage]            = useState('landing');
  const [loading,         setLoading]         = useState(true);

 
  useEffect(() => {
    const u = storage.get(KEYS.USER);
    if (u) setUserState(u);

    setAssignments(safeArray(storage.get(KEYS.ASSIGNMENTS), DEFAULT_ASSIGNMENTS));
    setCourses    (safeArray(storage.get(KEYS.COURSES),     DEFAULT_COURSES));
    setNotes      (safeArray(storage.get(KEYS.NOTES),       []));

    const savedSettings = storage.get(KEYS.SETTINGS);
    setSettings(savedSettings && typeof savedSettings === 'object'
      ? savedSettings
      : { notifications: true, darkMode: false });

    setNotifications(safeArray(storage.get(KEYS.NOTIFS), []));
    setLoading(false);
  }, []);


  useEffect(() => {
    let cancelled = false;

    async function loadSchedule() {
      setScheduleLoading(true);
      setScheduleError(null);
      try {
        const res = await fetch('/data/schedule.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setSchedule(Array.isArray(data) ? data : DEFAULT_SCHEDULE);
        storage.set(KEYS.SCHEDULE, data);
      } catch (err) {
        if (cancelled) return;
        console.warn('[Schedule] Fetch failed, using cached/default data:', err.message);
        setSchedule(safeArray(storage.get(KEYS.SCHEDULE), DEFAULT_SCHEDULE));
        setScheduleError('Could not refresh schedule — showing saved data.');
      } finally {
        if (!cancelled) setScheduleLoading(false);
      }
    }

    loadSchedule();
    return () => { cancelled = true; };
  }, []);


  const saveUser = useCallback((u) => {
    storage.set(KEYS.USER, u);
    setUserState(u);
  }, []);

  const saveAssignments = useCallback((list) => {
    storage.set(KEYS.ASSIGNMENTS, list);
    setAssignments(list);
  }, []);

  const saveCourses = useCallback((list) => {
    storage.set(KEYS.COURSES, list);
    setCourses(list);
  }, []);

  const saveNotes = useCallback((list) => {
    storage.set(KEYS.NOTES, list);
    setNotes(list);
  }, []);

  const saveSettings = useCallback((s) => {
    storage.set(KEYS.SETTINGS, s);
    setSettings(s);
  }, []);

  const addNotification = useCallback((n) => {
    setNotifications((prev) => {
      const updated = [
        { ...n, id: Date.now(), read: false, time: new Date().toISOString() },
        ...prev,
      ].slice(0, 20);
      storage.set(KEYS.NOTIFS, updated);
      return updated;
    });
  }, []);

  const markNotifsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      storage.set(KEYS.NOTIFS, updated);
      return updated;
    });
  }, []);

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    if (!user || !settings.notifications) return;
    if (!('Notification' in window)) return;

    const check = () => {
      const todayKey = new Date().toISOString().split('T')[0];
      const notifiedToday = storage.get(KEYS.NOTIFIED_TODAY, {});
      const alreadyNotified = notifiedToday[todayKey] || [];
      let updated = false;

      assignments.forEach((a) => {
        if (a.completed || alreadyNotified.includes(a.id)) return;
        const diff = (new Date(a.dueDate + 'T23:59:00') - new Date()) / 36e5;
        if (diff > 0 && diff < 24 && Notification.permission === 'granted') {
          new Notification('📚 Smart Campus', {
            body: `"${a.title}" is due in ${Math.round(diff)} hours!`,
            icon: '/icon-192.png',
          });
          alreadyNotified.push(a.id);
          updated = true;
        }
      });

      if (updated) {
        storage.set(KEYS.NOTIFIED_TODAY, { [todayKey]: alreadyNotified });
      }
    };

    check();
    const interval = setInterval(check, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, assignments, settings.notifications]);

  const logout = useCallback(() => {
    storage.remove(KEYS.USER);
    setUserState(null);
    setPage('landing');
  }, []);

  return (
    <AppCtx.Provider value={{
      user, saveUser, logout,
      assignments, saveAssignments,
      courses, saveCourses,
      schedule, scheduleLoading, scheduleError,
      notes, saveNotes,
      settings, saveSettings,
      notifications, addNotification, markNotifsRead,
      toasts, toast,
      page, setPage,
      loading,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);