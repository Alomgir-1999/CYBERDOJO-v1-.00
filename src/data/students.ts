import { Student } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '101',
    studentId: 'STU-2025-001',
    fullName: 'Md. Alomgir Hossain',
    fathersName: 'Md. Rafiqul Islam',
    address: 'House #45, Road #12, Dhanmondi, Dhaka-1209, Bangladesh',
    email: 'alomgir.d1999@gmail.com',
    contact: '+880 1712-345678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
    joinedDate: '১৫ জুলাই ২০২৫',
    xp: 2450,
    rankName: 'Cyber Warrior',
    enrolledCourses: ['Computer Basics & Digital Literacy', 'Programming Fundamentals with Python', 'Linux & Command Line Mastery'],
    achievements: [
      { id: 'b1', name: 'Cyber Warrior', icon: '🛡️', description: 'Completed 5+ Cyber Labs', dateEarned: '2025-08-01' },
      { id: 'b2', name: 'Python Master', icon: '🐍', description: 'Built first Python automation tool', dateEarned: '2025-08-15' },
      { id: 'b3', name: 'Streak Leader', icon: '🔥', description: 'Maintained a 7-day learning streak', dateEarned: '2025-08-20' },
      { id: 'b4', name: 'Linux Pioneer', icon: '🐧', description: 'Mastered Bash scripting commands', dateEarned: '2025-09-02' }
    ],
    certificates: [
      {
        id: 'cert-101-1',
        courseTitle: 'Computer Basics & Digital Literacy',
        issueDate: '১০ আগস্ট ২০২৫',
        certificateId: 'CERT-CB-8842',
        grade: 'A+'
      },
      {
        id: 'cert-101-2',
        courseTitle: 'Programming Fundamentals with Python',
        issueDate: '১৮ সেপ্টেম্বর ২০২৫',
        certificateId: 'CERT-PY-9921',
        grade: 'A+'
      }
    ],
    attendance: [
      { date: '2026-07-22', status: 'Present', remarks: 'On time' },
      { date: '2026-07-21', status: 'Present', remarks: 'On time' },
      { date: '2026-07-20', status: 'Present', remarks: 'On time' },
      { date: '2026-07-19', status: 'Absent', remarks: 'Sick leave' },
      { date: '2026-07-18', status: 'Present', remarks: 'On time' }
    ]
  },
  {
    id: '102',
    studentId: 'STU-2025-002',
    fullName: 'Sabbir Khan',
    fathersName: 'Golam Kibria Khan',
    address: 'Station Road, Chawkbazar, Chittagong, Bangladesh',
    email: 'sabbir.khan@gmail.com',
    contact: '+880 1819-876543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
    joinedDate: '১০ জুন ২০২৫',
    xp: 4800,
    rankName: 'Cyber Defender',
    enrolledCourses: ['Linux & Command Line Mastery', 'Web Application Security & OWASP Top 10'],
    achievements: [
      { id: 'b5', name: 'Linux Admin', icon: '🐧', description: 'Passed Linux FHS Exam', dateEarned: '2025-07-01' },
      { id: 'b6', name: 'Bug Hunter', icon: '👾', description: 'Found 3 vulnerabilities in CTF', dateEarned: '2025-07-22' }
    ],
    certificates: [
      {
        id: 'cert-102-1',
        courseTitle: 'Linux & Command Line Mastery',
        issueDate: '২৫ আগস্ট ২০২৫',
        certificateId: 'CERT-LIN-3312',
        grade: 'A'
      }
    ],
    attendance: [
      { date: '2026-07-22', status: 'Present', remarks: 'On time' },
      { date: '2026-07-21', status: 'Present', remarks: 'On time' },
      { date: '2026-07-20', status: 'Present', remarks: 'On time' },
      { date: '2026-07-19', status: 'Present', remarks: 'On time' },
      { date: '2026-07-18', status: 'Present', remarks: 'On time' }
    ]
  },
  {
    id: '103',
    studentId: 'STU-2025-003',
    fullName: 'Tahmina Akter',
    fathersName: 'Md. Anwar Hossain',
    address: 'BUET Campus Hall #3, Palashi, Dhaka-1000, Bangladesh',
    email: 'tahmina.buet@gmail.com',
    contact: '+880 1911-223344',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
    joinedDate: '০২ মে ২০২৫',
    xp: 9500,
    rankName: 'Elite Guardian',
    enrolledCourses: ['Web Application Security & OWASP Top 10', 'Ethical Hacking & Penetration Testing'],
    achievements: [
      { id: 'b7', name: 'Elite Guardian', icon: '👑', description: 'Reached Top 10 Global Leaderboard', dateEarned: '2025-06-10' },
      { id: 'b8', name: 'OWASP Crusader', icon: '🔐', description: 'Secured 10 OWASP Vulnerabilities', dateEarned: '2025-07-05' },
      { id: 'b9', name: 'Pentest Legend', icon: '⚔️', description: 'Completed Metasploit Root Lab', dateEarned: '2025-08-11' }
    ],
    certificates: [
      {
        id: 'cert-103-1',
        courseTitle: 'Web Application Security & OWASP Top 10',
        issueDate: '১৪ জুলাই ২০২৫',
        certificateId: 'CERT-WEB-7789',
        grade: 'A+'
      },
      {
        id: 'cert-103-2',
        courseTitle: 'Ethical Hacking & Penetration Testing',
        issueDate: '০২ সেপ্টেম্বর ২০২৫',
        certificateId: 'CERT-EH-1029',
        grade: 'A+'
      }
    ],
    attendance: [
      { date: '2026-07-22', status: 'Present', remarks: 'On time' },
      { date: '2026-07-21', status: 'Present', remarks: 'On time' },
      { date: '2026-07-20', status: 'Present', remarks: 'On time' },
      { date: '2026-07-19', status: 'Present', remarks: 'On time' },
      { date: '2026-07-18', status: 'Present', remarks: 'On time' }
    ]
  },
  {
    id: '104',
    studentId: 'STU-2025-004',
    fullName: 'Rohit Hasan',
    fathersName: 'Kazi Nazrul Hasan',
    address: 'Zindabazar, Sylhet-3100, Bangladesh',
    email: 'rohit.hasan@gmail.com',
    contact: '+880 1612-998877',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    status: 'Pending',
    joinedDate: '০১ জুলাই ২০২৫',
    xp: 450,
    rankName: 'Novice Cadet',
    enrolledCourses: ['Computer Basics & Digital Literacy'],
    achievements: [
      { id: 'b10', name: 'Novice Cadet', icon: '🌱', description: 'First step into CyberDojo', dateEarned: '2025-07-02' }
    ],
    certificates: [],
    attendance: [
      { date: '2026-07-22', status: 'Absent', remarks: 'Unexcused' },
      { date: '2026-07-21', status: 'Present', remarks: 'Late' },
      { date: '2026-07-20', status: 'Absent', remarks: 'Personal issue' }
    ]
  },
  {
    id: '105',
    studentId: 'STU-2025-005',
    fullName: 'Farzana Yesmin',
    fathersName: 'S. M. Jalal Uddin',
    address: 'Shaheb Bazar, Rajshahi-6000, Bangladesh',
    email: 'farzana.yesmin@gmail.com',
    contact: '+880 1515-667788',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    status: 'Active',
    joinedDate: '২০ এপ্রিল ২০২৫',
    xp: 1200,
    rankName: 'Cyber Explorer',
    enrolledCourses: ['Programming Fundamentals with Python'],
    achievements: [
      { id: 'b11', name: 'Python Explorer', icon: '🐍', description: 'Completed Python Basics', dateEarned: '2025-05-15' }
    ],
    certificates: [
      {
        id: 'cert-105-1',
        courseTitle: 'Computer Basics & Digital Literacy',
        issueDate: '৩০ জুন ২০২৫',
        certificateId: 'CERT-CB-1102',
        grade: 'B+'
      }
    ],
    attendance: [
      { date: '2026-07-22', status: 'Present', remarks: 'On time' },
      { date: '2026-07-21', status: 'Absent', remarks: 'Family emergency' },
      { date: '2026-07-20', status: 'Present', remarks: 'On time' }
    ]
  }
];

export function getStoredStudents(): Student[] {
  try {
    const data = localStorage.getItem('cd_students');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to read students from localStorage", e);
  }
  return INITIAL_STUDENTS;
}

export function saveStoredStudents(students: Student[]) {
  try {
    localStorage.setItem('cd_students', JSON.stringify(students));
  } catch (e) {
    console.error("Failed to save students to localStorage", e);
  }
}
