export const storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {  }
  },
};

export const KEYS = {
  USER:           'sc_user',
  ASSIGNMENTS:    'sc_assignments',
  COURSES:        'sc_courses',
  SCHEDULE:       'sc_schedule',
  NOTES:          'sc_notes',
  SETTINGS:       'sc_settings',
  NOTIFS:         'sc_notifs',
  NOTIFIED_TODAY: 'sc_notified_today',
};
