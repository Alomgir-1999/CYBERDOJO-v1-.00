export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  name: string;
  icon: string;
  dur: string;
  free: boolean;
  quiz?: QuizQuestion[];
}

export interface CourseModule {
  title: string;
  lessons: Lesson[];
}

export interface ReferenceLink {
  title: string;
  url: string;
  siteName: string;
  description: string;
}

export interface LearningDetails {
  summary: string;
  keyOutcomes: string[];
  referenceLinks: ReferenceLink[];
  prerequisites: string[];
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  students: string;
  price: string;
  priceAmount: number;
  isFree: boolean;
  category: string[];
  badge: string;
  badgeColor: 'primary' | 'secondary' | 'accent' | 'warning';
  modules: CourseModule[];
  learningDetails?: LearningDetails;
}

export interface UserStats {
  totalXP: number;
  totalBadges: number;
  currentStreak: number;
  globalRank: number;
  currentRank: string;
  coins: number;
}

export interface StudentCertificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  certificateId: string;
  grade: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent';
  remarks?: string;
}

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  fathersName: string;
  address: string;
  email: string;
  contact: string;
  avatar: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinedDate: string;
  xp: number;
  rankName: string;
  enrolledCourses: string[];
  achievements: Badge[];
  certificates: StudentCertificate[];
  attendance: AttendanceRecord[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  fathersName?: string;
  address?: string;
  phone?: string;
  dob?: string;
  country?: string;
  studentId?: string;
  goals?: string[];
  stats: UserStats;
}

export interface Enrollment {
  courseSlug: string;
  progressPct: number;
  completedLessons: string[]; // array of lesson IDs
  completedQuizzes?: string[]; // array of lesson quiz IDs
}

export interface LeaderboardUser {
  rank: number;
  fullName: string;
  avatar: string;
  totalXP: number;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateEarned?: string;
}

export interface LabChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  objective: string;
  background: string;
  instructions: string[];
  expectedFlag: string;
  rewardXP: number;
  hint: string;
  hintCost: number;
}
