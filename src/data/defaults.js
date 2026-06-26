export const DEFAULT_SCHEDULE = [
  { "id": "s1", "course": "Advanced Data Structures", "room": "Hall 302", "dept": "Software Engineering", "time": "09:00 AM", "end": "10:30 AM", "day": "Mon,Wed,Fri,Sat" },
  { "id": "s2", "course": "Cloud Computing",          "room": "Hall B",   "dept": "Software Engineering", "time": "11:30 AM", "end": "01:00 PM", "day": "Mon,Wed,Fri,Sat" },
  { "id": "s3", "course": "Software Metrics",         "room": "Room 101", "dept": "Software Engineering", "time": "02:45 PM", "end": "04:00 PM", "day": "Tue,Thu"        },
  { "id": "s4", "course": "Mobile Development",       "room": "Lab 204",  "dept": "Software Engineering", "time": "09:00 AM", "end": "10:30 AM", "day": "Tue,Thu"        },
  { "id": "s5", "course": "Software Evaluation",      "room": "Room 110", "dept": "Software Engineering", "time": "11:00 AM", "end": "12:30 PM", "day": "Mon,Wed,Fri,Sat" }
]

const futureDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Data Structures Project',
    subject: 'Advanced Data Structures',
    subjectTag: 'cs',
    description: 'Implement a balanced binary search tree with complex traversal logic.',
    dueDate: futureDays(2),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    title: 'Mobile App Development Project',
    subject: 'Mobile Development',
    subjectTag: 'cs',
    description: 'Develop a cross-platform mobile application using React Native.',
    dueDate: futureDays(8),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a3',
    title: 'Software Evaluation Report',
    subject: 'Software Evaluation',
    subjectTag: 'cs',
    description: 'Evaluate the usability of a popular software application and write a detailed report.',
    dueDate: futureDays(12),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a4',
    title: 'Case Study: Ethical AI',
    subject: 'Ethics in Technology',
    subjectTag: 'sci',
    description: 'SWOT analysis for ethical AI deployment case. Harvard citation style.',
    dueDate: futureDays(0),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a5',
    title: 'Big Data Analysis Assignment',
    subject: 'Big Data',
    subjectTag: 'big',
    description: 'Analyze a large dataset using Hadoop and present your findings in a report.',
    dueDate: futureDays(5),
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_COURSES = [
  {
    semester: 'First Semester 2025',
    credits: 16,
    courses: [
      { id: 'c1', name: 'CS 301 - Data Structures',    credits: 4, grade: 'A',  type: 'Major Core' },
      { id: 'c2', name: 'CS 302 - Algorithms',         credits: 4, grade: 'A-', type: 'General Education' },
      { id: 'c3', name: 'MATH 250 - Linear Algebra',   credits: 4, grade: 'B+', type: 'Major Requirement' },
      { id: 'c4', name: 'ENG 210 - Technical Writing', credits: 4, grade: 'A',  type: 'Elective' },
    ],
  },
  {
    semester: 'Second Semester 2025',
    credits: 12,
    courses: [
      { id: 'c5', name: 'CS 202 - Algorithms',                      credits: 4, grade: 'A',  type: 'Major Core' },
      { id: 'c6', name: 'SOC 105 - Global Trends',                  credits: 4, grade: 'B',  type: 'Elective' },
      { id: 'c7', name: 'MATH 251 - Differential Equations',        credits: 4, grade: 'A-', type: 'Major Requirement' },
    ],
  },
  {
    semester: 'First Semester 2026',
    credits: 16,
    courses: [
      { id: 'c8',  name: 'CS 101 - Intro to CS',                          credits: 4, grade: 'A',  type: 'Major Core' },
      { id: 'c9',  name: 'FSE 105 - Fundamentals of Software Engineering', credits: 4, grade: 'B+', type: 'General Education' },
      { id: 'c10', name: 'PS 108 - Professional Practice',                credits: 4, grade: 'A',  type: 'General Education' },
      { id: 'c11', name: 'HIST 101 - History of Computing',               credits: 4, grade: 'B',  type: 'Elective' },
    ],
  },
];

export const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D':  1.0, 'F': 0,
};

export const SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Ethics in Technology',
  'Big Data',
  'Software Engineering',
  'Mobile Development',
  'Advanced Data Structures',
  'Cloud Computing',
  'Software Metrics',
  'Software Evaluation',
];

export function calcGPA(semesters) {
  let totalPoints = 0, totalCredits = 0;
  semesters.forEach((sem) => {
    sem.courses.forEach((c) => {
      const pts = GRADE_POINTS[c.grade] ?? 0;
      totalPoints  += pts * c.credits;
      totalCredits += c.credits;
    });
  });
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}

export function calcTotalCredits(semesters) {
  return semesters.reduce((s, sem) => s + sem.courses.reduce((a, c) => a + c.credits, 0), 0);
}

export function getDuePriority(dueDate) {
  const diff = (new Date(dueDate + 'T23:59:00') - new Date()) / 36e5;
  if (diff < 0)  return 'overdue';
  if (diff < 48) return 'urgent';
  return 'normal';
}

export function formatDueDate(dueDate) {
  const d    = new Date(dueDate + 'T00:00:00');
  const diff = Math.floor((d - new Date()) / 864e5);
  if (diff < 0)  return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getTodaySchedule(schedule) {
  const days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  return schedule.filter((s) => s.day.includes(today));
}

export function getNextClass(schedule) {
  const todays  = getTodaySchedule(schedule);
  const now     = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const parse = (t) => {
    const [time, ampm] = t.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const current = todays.find((s) => {
    const start = parse(s.time), end = parse(s.end);
    return nowMins >= start && nowMins <= end;
  });
  if (current) return { ...current, status: 'current' };

  const upcoming = todays.filter((s) => parse(s.time) > nowMins);
  if (upcoming.length) return { ...upcoming[0], status: 'upcoming' };
  return null;
}
