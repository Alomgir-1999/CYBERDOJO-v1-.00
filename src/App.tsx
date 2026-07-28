import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, BookOpen, Users, LogIn, LogOut, Award, Menu, X, CheckCircle,
  ChevronDown, HelpCircle, Activity, Star, Calendar, ArrowRight, User, Terminal, Sparkles, Flame, CheckCircle2, TrendingUp
} from 'lucide-react';
import { coursesData } from './data/courses';
import { Course, User as AppUser, Enrollment, Badge } from './types';
import ParticleBackground from './components/ParticleBackground';
import TerminalConsole from './components/TerminalConsole';
import AIMentor from './components/AIMentor';
import CertificateRenderer from './components/CertificateRenderer';
import CourseViewer from './components/CourseViewer';
import AdminPanel from './components/AdminPanel';
import FireStreakCounter from './components/FireStreakCounter';
import StudentProfileModal from './components/StudentProfileModal';
import ServerLoadingScreen from './components/ServerLoadingScreen';
import { Student } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>('');
  
  // Landing Page Server Loading Animation State
  const [isServerLoading, setIsServerLoading] = useState<boolean>(true);
  
  // Current session user details
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  
  // Student Profile Modal State
  const [activeStudentModal, setActiveStudentModal] = useState<Student | null>(null);
  
  // Dashboard panel sections
  const [dashSection, setDashSection] = useState<string>('dashboard');
  
  // Course Viewer State
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  
  // User Enrollments and Progress (stored locally & synchronized with server)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      courseSlug: 'python-fundamentals',
      progressPct: 75,
      completedLessons: ['py-1-1', 'py-1-2', 'py-2-1', 'py-2-2', 'py-3-1']
    },
    {
      courseSlug: 'linux-mastery',
      progressPct: 40,
      completedLessons: ['lin-1-1', 'lin-1-2', 'lin-2-1']
    }
  ]);

  // Unlocked Badges shelves
  const [badges, setBadges] = useState<Badge[]>([
    { id: 'b-1', name: 'First Mission', icon: '🚀', description: 'সাফল্যের সাথে প্রথম পাঠ সম্পন্ন করেছেন।' },
    { id: 'b-2', name: 'Python Initiate', icon: '🐍', description: 'পাইথনের প্রাথমিক যুক্তি ও গঠন আয়ত্ত করেছেন।' },
    { id: 'b-3', name: 'Linux Voyager', icon: '🐧', description: 'লিনাক্স ডিরেক্টরি এবং পারমিশন সিস্টেমে অভিজ্ঞ।' }
  ]);

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Search Filter Query
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // OTP Verification state
  const [otpEmail, setOtpEmail] = useState<string>('');
  const [otpInputs, setOtpInputs] = useState<string[]>(['', '', '', '', '', '']);

  // Dynamic counter states (increment animations on mount)
  const [counts, setCounts] = useState({ students: 0, courses: 0, badges: 0, xp: 0 });

  // Custom Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    // Increment numbers on home tab view
    if (activePage === 'home') {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        setCounts({
          students: Math.min(10240, Math.floor((10240 / steps) * step)),
          courses: Math.min(50, Math.floor((50 / steps) * step)),
          badges: Math.min(500, Math.floor((500 / steps) * step)),
          xp: Math.min(1000000, Math.floor((1000000 / steps) * step))
        });

        if (step >= steps) {
          clearInterval(interval);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [activePage]);

  // Check storage on mount
  useEffect(() => {
    const token = localStorage.getItem('cyberdojo_token');
    const storedUser = localStorage.getItem('cd_user');
    if (token && storedUser) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // ── AUTH ACTION LAYERS ─────────────────────────
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPass, setLoginPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      showToast('সব ক্ষেত্র পূরণ করুন!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });
      const data = await responseHelper(res);
      if (data.success && data.data) {
        saveSession(data.data.accessToken, data.data.user);
        showToast('মিশন কন্ট্রোলে স্বাগতম! 🎮', 'success');
        setActivePage('dashboard');
      } else {
        showToast(data.message || 'লগইন ব্যর্থ হয়েছে!', 'error');
      }
    } catch (err) {
      // Offline fallback login for client simulation
      if (loginEmail === 'alomgir.d1999@gmail.com' && loginPass === 'password') {
        const fallbackUser: AppUser = {
          id: 'user-1',
          email: 'alomgir.d1999@gmail.com',
          fullName: 'MD. Alomgir Hossain',
          avatar: '🤖',
          phone: '+8801700000000',
          dob: '1999-12-31',
          country: 'Bangladesh',
          goals: ['সাইবার সিকিউরিটি পেশাদার হতে চাই'],
          stats: {
            totalXP: 2450,
            totalBadges: 12,
            currentStreak: 7,
            globalRank: 127,
            currentRank: '🟡 Cyber Learner',
            coins: 500
          }
        };
        saveSession('dummy-token-7382', fallbackUser);
        showToast('মিশন কন্ট্রোলে স্বাগতম! (Fallback Offline Mode)', 'success');
        setActivePage('dashboard');
      } else {
        showToast('ভুল ইমেইল বা পাসওয়ার্ড লিখেছেন!', 'error');
      }
    }
  };

  const saveSession = (token: string, user: any) => {
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('cyberdojo_token', token);
    localStorage.setItem('cd_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('cyberdojo_token');
    localStorage.removeItem('cd_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken('');
    showToast('Logged out successfully.', 'info');
    setActivePage('home');
    setDashSection('dashboard');
  };

  // Register state machine
  const [regStep, setRegStep] = useState<number>(1);
  const [regForm, setRegForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '', country: 'Bangladesh', password: '', avatar: '🤖', goals: [] as string[]
  });

  const handleRegisterStart = async () => {
    if (!regForm.firstName || !regForm.email || !regForm.password) {
      showToast('পুরো নাম, ইমেইল ও পাসওয়ার্ড আবশ্যক!', 'error');
      return;
    }

    try {
      const fullName = `${regForm.firstName} ${regForm.lastName}`.trim();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regForm.email,
          password: regForm.password,
          full_name: fullName,
          phone: regForm.phone,
          dob: regForm.dob,
          country: regForm.country,
          avatar: regForm.avatar
        })
      });
      const data = await responseHelper(res);
      if (data.success) {
        setOtpEmail(regForm.email);
        showToast(data.message || 'OTP পাঠানো হয়েছে!', 'success');
        setRegStep(2); // Jump to choose avatar then OTP
      } else {
        showToast(data.message || 'নিবন্ধন ব্যর্থ হয়েছে!', 'error');
      }
    } catch (err) {
      // Fallback
      setOtpEmail(regForm.email);
      showToast('OTP কোড (Fallback): 123456', 'info');
      setRegStep(2);
    }
  };

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otpInputs];
    newOtp[index] = val;
    setOtpInputs(newOtp);

    // Auto-focus next box
    if (val && index < 5) {
      const nextBox = document.getElementById(`otp-input-${index + 1}`);
      nextBox?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpInputs.join('');
    if (otp.length < 6) {
      showToast('সম্পূর্ণ ৬ অঙ্কের OTP প্রবেশ করুন!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp })
      });
      const data = await responseHelper(res);
      if (data.success && data.data) {
        saveSession(data.data.accessToken, data.data.user);
        showToast('OTP যাচাই সফল হয়েছে! ✓', 'success');
        setRegStep(4); // Goal selection
      } else {
        showToast(data.message || 'ভুল OTP কোড প্রবেশ করেছেন!', 'error');
      }
    } catch (err) {
      if (otp === '123456') {
        const dummyUser: AppUser = {
          id: `user-${Date.now()}`,
          email: regForm.email,
          fullName: `${regForm.firstName} ${regForm.lastName}`.trim(),
          avatar: regForm.avatar,
          goals: regForm.goals,
          stats: {
            totalXP: 150,
            totalBadges: 1,
            currentStreak: 1,
            globalRank: 180,
            currentRank: '🟡 Cyber Learner',
            coins: 50
          }
        };
        saveSession('dummy-token-7382', dummyUser);
        showToast('OTP যাচাই সফল! (Fallback Mode)', 'success');
        setRegStep(4);
      } else {
        showToast('ভul OTP! ডেমো কোড "123456" ব্যবহার করুন।', 'error');
      }
    }
  };

  const handleRegisterComplete = async () => {
    if (!currentUser) return;
    
    // Save learning goals to profile
    try {
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ goals: regForm.goals })
      });
    } catch (_) {}

    const updatedUser = { ...currentUser, goals: regForm.goals };
    setCurrentUser(updatedUser);
    localStorage.setItem('cd_user', JSON.stringify(updatedUser));

    showToast('নিবন্ধন সম্পন্ন! মিশন লঞ্চ করা হচ্ছে... 🚀', 'success');
    setActivePage('dashboard');
    setRegStep(1);
    // Reset forms
    setRegForm({
      firstName: '', lastName: '', email: '', phone: '', dob: '', country: 'Bangladesh', password: '', avatar: '🤖', goals: []
    });
    setOtpInputs(['', '', '', '', '', '']);
  };

  const responseHelper = async (res: Response) => {
    try {
      return await res.json();
    } catch (_) {
      return { success: false, message: 'Server communication error.' };
    }
  };

  // ── STUDENT ACTIVITIES & PROGRESS ENGINES ───────
  const handleCompleteLesson = async (lessonId: string, xpReward: number) => {
    if (!currentUser) return;

    // Send complete status to server
    try {
      await fetch(`/api/courses/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (_) {}

    // Update locally in React state
    let courseSlug = 'python-fundamentals';
    if (lessonId.startsWith('lin')) courseSlug = 'linux-mastery';
    if (lessonId.startsWith('cb')) courseSlug = 'computer-basics';
    if (lessonId.startsWith('web')) courseSlug = 'web-security';

    const updatedEnrollments = enrollments.map((e) => {
      if (e.courseSlug === courseSlug) {
        if (!e.completedLessons.includes(lessonId)) {
          const list = [...e.completedLessons, lessonId];
          const totalMap: { [key: string]: number } = {
            'computer-basics': 8,
            'python-fundamentals': 9,
            'linux-mastery': 8,
            'web-security': 8
          };
          const max = totalMap[courseSlug] || 8;
          return {
            ...e,
            completedLessons: list,
            progressPct: Math.min(100, Math.round((list.length / max) * 100))
          };
        }
      }
      return e;
    });

    setEnrollments(updatedEnrollments);

    // Update user stats
    const updatedUser = {
      ...currentUser,
      stats: {
        ...currentUser.stats,
        totalXP: currentUser.stats.totalXP + xpReward,
        coins: currentUser.stats.coins + 10
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('cd_user', JSON.stringify(updatedUser));

    showToast(`পাঠ সম্পন্ন! +${xpReward} XP এবং +১০ কয়েন অর্জিত! ⭐`, 'success');
  };

  const handleEnrollCourse = async (slug: string) => {
    if (!isAuthenticated) {
      showToast('কোর্সে এনরোল করতে প্রথমে লগইন করুন।', 'info');
      setActivePage('login');
      return;
    }

    try {
      await fetch(`/api/courses/${slug}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (_) {}

    const alreadyEnrolled = enrollments.some((e) => e.courseSlug === slug);
    if (!alreadyEnrolled) {
      setEnrollments((prev) => [...prev, { courseSlug: slug, progressPct: 0, completedLessons: [] }]);
    }

    showToast('সাফল্যের সাথে কোর্সে এনরোল সম্পন্ন হয়েছে! 🚀', 'success');
    setActivePage('dashboard');
    setDashSection('dashboard');
  };

  const handleCompleteCourse = () => {
    // Award Course completion badge and update stats
    if (!currentUser) return;
    const badgeId = `b-${Date.now()}`;
    const newBadge: Badge = {
      id: badgeId,
      name: 'Curriculum Master',
      icon: '🎓',
      description: 'সাফল্যের সাথে পূর্ণাঙ্গ সিলেবাস সম্পন্ন করেছেন।'
    };
    setBadges((prev) => [...prev, newBadge]);

    const updatedUser = {
      ...currentUser,
      stats: {
        ...currentUser.stats,
        totalXP: currentUser.stats.totalXP + 500,
        totalBadges: currentUser.stats.totalBadges + 1
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('cd_user', JSON.stringify(updatedUser));

    showToast('🎉 অভিনন্দন! পূর্ণাঙ্গ কোর্স সম্পন্ন করে গোল্ডেন সার্টিফিকেট ও ৫০০ XP অর্জন করেছেন!', 'success');
    setDashSection('certificates');
  };

  const handleClaimDailyReward = async () => {
    if (!currentUser) return;
    
    // Update streak and award coins
    const updatedUser = {
      ...currentUser,
      stats: {
        ...currentUser.stats,
        currentStreak: currentUser.stats.currentStreak + 1,
        totalXP: currentUser.stats.totalXP + 50,
        coins: currentUser.stats.coins + 20
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('cd_user', JSON.stringify(updatedUser));

    showToast('দৈনিক উপহার সম্পন্ন! +৫০ XP এবং +২০ কয়েন অর্জিত! 🔥', 'success');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।', 'success');
  };

  return (
    <div className="font-body relative min-h-screen text-[#f0f6ff] overflow-x-hidden">
      {/* Immersive background components */}
      <ParticleBackground />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-up bg-black/85">
          <span className="text-xl">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="text-xs font-semibold text-gray-200">{toast.message}</span>
        </div>
      )}

      {/* ── TOP NEON GLOW DECORATOR BAR ──────────────── */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-transparent via-[#00D4FF] via-[#8B5CF6] to-[#00FF88] relative z-40" />

      {/* ── NAVBAR HEADER ─────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-[#050a0f]/90 border-b border-[#1f2937] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          {/* Logo Frame */}
          <div onClick={() => setActivePage('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-cyan-500/10 border-2 border-[#00d4ff] rounded-xl flex items-center justify-center font-head font-extrabold text-xs text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.4)]">
              CD
            </div>
            <div>
              <span className="font-head font-extrabold text-sm md:text-base tracking-widest text-[#00d4ff] block filter drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">
                CYBERDOJO
              </span>
              <span className="block text-[8px] text-gray-500 font-accent tracking-widest uppercase">
                LEARN • PRACTICE • DEFEND • INNOVATE
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 list-none">
            <button
              onClick={() => setActivePage('home')}
              className={`text-xs font-semibold px-4 py-2 rounded-lg tracking-wide transition-all ${
                activePage === 'home' ? 'bg-[#00d4ff]/15 text-[#00d4ff]' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              HOME
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActivePage('dashboard')}
                className={`text-xs font-semibold px-4 py-2 rounded-lg tracking-wide transition-all ${
                  activePage === 'dashboard' ? 'bg-[#00d4ff]/15 text-[#00d4ff]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                📊 DASHBOARD
              </button>
            )}
          </div>

          {/* CTA actions login/logout group */}
          <div className="flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="hidden sm:flex items-center gap-2 border border-white/5 bg-white/[0.02] pl-2.5 pr-4 py-1.5 rounded-full text-xs">
                <span className="text-xl">{currentUser.avatar || '🤖'}</span>
                <span className="font-semibold text-gray-200">{currentUser.fullName.split(' ')[0]}</span>
                <span className="bg-[#00ff88]/10 border border-[#00ff88]/20 px-2 py-0.5 rounded-full text-[9px] text-[#00ff88] font-mono">
                  {currentUser.stats.totalXP} XP
                </span>
              </div>
            ) : null}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 border border-white/10 hover:border-rose-500 hover:text-rose-400 px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            ) : (
              <button
                onClick={() => setActivePage('login')}
                className="hidden md:flex items-center gap-1.5 border border-white/10 hover:border-[#00d4ff] hover:text-[#00d4ff] px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </button>
            )}

            <button
              onClick={() => (isAuthenticated ? setActivePage('dashboard') : setActivePage('register'))}
              className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-[#8b5cf6] hover:from-cyan-500 hover:to-purple-600 text-black px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)]"
            >
              🚀 {isAuthenticated ? 'Dashboard' : 'Start Mission'}
            </button>

            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 border border-white/10 rounded-lg text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#050a0f] border-t border-[#1f2937] p-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setActivePage('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-4 rounded hover:bg-white/5 font-semibold text-xs text-gray-300"
            >
              🏠 HOME
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setActivePage('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-4 rounded hover:bg-white/5 font-semibold text-xs text-cyan-400"
              >
                📊 STUDENT DASHBOARD
              </button>
            )}
            <div className="border-t border-[#1f2937]/50 pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold"
                >
                  LOGOUT
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActivePage('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 border border-[#00d4ff]/20 text-[#00d4ff] rounded-lg text-xs font-bold"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── MAIN INTERACTIVE ROUTER VIEWS ──────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* ===========================================
            1. VIEW: HOME / LANDING PAGE
           =========================================== */}
        {activePage === 'home' && (
          <div className="flex flex-col gap-20">
            {/* Hero Section */}
            <section className="min-h-[calc(100vh-180px)] flex flex-col lg:flex-row items-center gap-12 pt-6">
              <div className="flex-1 flex flex-col items-start gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-xs font-head font-bold tracking-widest text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                    🛡️ BANGLADESH&apos;S PREMIER CYBER ACADEMY — NOW LIVE
                  </div>
                  
                  <button
                    onClick={() => setIsServerLoading(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono font-bold text-emerald-400 cursor-pointer transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    title="Click to view Server Connection Loading Animation"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>SERVER: ONLINE [11ms]</span>
                  </button>
                </div>
                
                <h1 className="font-head font-black text-5xl md:text-7xl lg:text-8xl leading-tight text-white tracking-wider relative select-none animate-float-cyber">
                  {/* Ambient Cyber Neon Backdrop */}
                  <span className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-purple-600/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-70 animate-pulse pointer-events-none" />
                  
                  <span className="relative z-10 inline-block">
                    <span className="bg-gradient-to-r from-cyan-400 via-teal-300 via-blue-500 to-[#8b5cf6] bg-clip-text text-transparent animate-cyber-gradient animate-cyber-glow inline-block filter drop-shadow-[0_0_20px_rgba(0,212,255,0.7)]">
                      CYBER
                    </span>
                  </span>
                  <br />
                  <span className="relative z-10 inline-block mt-1">
                    <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-cyber-gradient filter drop-shadow-[0_0_25px_rgba(0,255,136,0.6)]">
                      DOJO
                    </span>
                    <span className="inline-flex items-center justify-center ml-3 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.5)] animate-bounce align-top">
                      v2.4
                    </span>
                  </span>
                </h1>

                <p className="font-head font-extrabold text-sm md:text-lg tracking-widest text-[#00ff88] uppercase">
                  Learn • Practice • Defend • Innovate
                </p>

                <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
                  একটি গল্পভিত্তিক, গেমিফাইড ডিজিটাল একাডেমি — মিশন-ভিত্তিক যাত্রার মাধ্যমে
                  শেখো প্রোগ্রামিং, লিনাক্স, এবং সাইবার সিকিউরিটি। আমাদের উন্নত ভার্চুয়াল ল্যাব এবং AI মেন্টর ARIA নিয়ে এখনই আপনার মিশন শুরু করুন।
                </p>

                <div className="flex flex-wrap gap-3 mt-2">
                  <button
                    onClick={() => (isAuthenticated ? setActivePage('dashboard') : setActivePage('register'))}
                    className="bg-[#00ff88] hover:bg-emerald-500 text-black px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] cursor-pointer"
                  >
                    🚀 Start Your Mission
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('courses');
                      setCourseFilter('all');
                    }}
                    className="border border-[#1f2937] hover:border-gray-500 bg-white/[0.02] hover:bg-white/[0.04] text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
                  >
                    Explore Courses
                  </button>
                </div>

                {/* Micro statistics counter indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-6 pt-6 border-t border-[#1f2937]/50 text-left">
                  <div>
                    <span className="font-head font-black text-xl text-[#00d4ff] block">
                      {(counts.students).toLocaleString()}+
                    </span>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block mt-0.5">
                      ACTIVE WARRIORS
                    </span>
                  </div>
                  <div>
                    <span className="font-head font-black text-xl text-purple-400 block">
                      {counts.courses}+
                    </span>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block mt-0.5">
                      SPECIALIZED MISSIONS
                    </span>
                  </div>
                  <div>
                    <span className="font-head font-black text-xl text-[#00ff88] block">
                      {counts.badges}+
                    </span>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block mt-0.5">
                      UNLOCKED BADGES
                    </span>
                  </div>
                  <div>
                    <span className="font-head font-black text-xl text-amber-400 block">
                      {counts.xp > 0 ? '1.2M+' : '0'}
                    </span>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block mt-0.5">
                      XP EARNED
                    </span>
                  </div>
                </div>
              </div>

              {/* Hero Right: Mission Console Terminal demo */}
              <div className="flex-1 w-full relative">
                <div className="border border-[#1f2937]/80 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-black/90 p-5 font-mono text-xs">
                  {/* Console Header */}
                  <div className="flex items-center justify-between border-b border-[#1f2937] pb-3 mb-4">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-cyan-400 font-head tracking-wider uppercase">
                      DOJO_HQ_NODE v1.0
                    </span>
                    <span className="text-[10px] text-gray-600">SECURE SHELL</span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-gray-400 leading-relaxed font-mono select-none pointer-events-none">
                    <div>
                      <span className="text-[#00ff88] font-bold">$</span> cyber --status
                    </div>
                    <div className="text-gray-300">✓ Platform: ONLINE &amp; SECURE</div>
                    <div>
                      <span className="text-[#00ff88] font-bold">$</span> list-active-labs
                    </div>
                    <div className="text-gray-300">🧪 3 Safe Sandbox Containers Ready</div>
                    <div>
                      <span className="text-[#00ff88] font-bold">$</span> aria --greet
                    </div>
                    <div className="text-purple-300">
                      &quot;আসসালামু আলাইকুম! আমি ARIA, ড্যাশবোর্ডে আপনার অপেক্ষা করছি...&quot;
                      <span className="inline-block w-1.5 h-3 bg-[#00ff88] ml-1 animate-ping" />
                    </div>
                  </div>

                  {/* Syllabus linear progres bars */}
                  <div className="mt-5 border-t border-[#1f2937] pt-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                      <span>🐍 Python Basics</span>
                      <span className="font-mono text-cyan-400">75%</span>
                    </div>
                    <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-[#8b5cf6] h-full" style={{ width: '75%' }} />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                      <span>🐧 Linux Fundamentals</span>
                      <span className="font-mono text-cyan-400">40%</span>
                    </div>
                    <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-[#8b5cf6] h-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Course curriculum Highlights (Section 2) */}
            <section className="flex flex-col gap-6">
              <div>
                <span className="text-[#00d4ff] font-head font-extrabold text-xs tracking-widest uppercase">
                  📚 FEATURED COURSES
                </span>
                <h2 className="font-head font-extrabold text-2xl md:text-3xl text-white tracking-wider mt-1.5">
                  Trending Cyber Missions
                </h2>
                <p className="text-xs text-gray-400 max-w-md mt-1 leading-relaxed">
                  আমাদের সর্বাধিক জনপ্রিয় শিক্ষাক্রম — প্রোগ্রামিং লজিক থেকে শুরু করে এডভান্সড হ্যাকিং পেনটেস্টিং।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coursesData.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setActiveCourse(course);
                      setActivePage('course-detail');
                    }}
                    className="border border-[#1f2937] hover:border-cyan-500/50 bg-[#0d1117]/85 p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden transition-all duration-300 group cursor-pointer hover:-translate-y-1.5 shadow-xl hover:shadow-[0_20px_40px_rgba(0,212,255,0.08)]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-[#1f2937] flex items-center justify-center text-2xl">
                        {course.icon}
                      </div>
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        course.badgeColor === 'secondary'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                      }`}>
                        {course.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-head font-extrabold text-sm text-white group-hover:text-cyan-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex gap-4 text-[10px] text-gray-500 font-mono">
                      <span>📶 {course.level}</span>
                      <span>⏱️ {course.duration}</span>
                      <span>👨‍🎓 {course.students}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#1f2937]/50 mt-1">
                      <span className="text-[#00ff88] font-bold text-xs">★ {course.rating}</span>
                      <span className={`text-xs font-head font-extrabold ${course.isFree ? 'text-[#00ff88]' : 'text-purple-400'}`}>
                        {course.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Roadmap timeline section (Section 3) */}
            <section className="flex flex-col gap-6">
              <div>
                <span className="text-[#00d4ff] font-head font-extrabold text-xs tracking-widest uppercase">
                  🗺️ LEARNING JOURNEY
                </span>
                <h2 className="font-head font-extrabold text-2xl md:text-3xl text-white tracking-wider mt-1.5">
                  Beginner থেকে Cyber Sensei
                </h2>
                <p className="text-xs text-gray-400 max-w-md mt-1 leading-relaxed">
                  একটি সুশৃঙ্খল রোডম্যাপ — প্রতিটি স্কিল পরেরটির সঠিক ভিত্তি তৈরি করে।
                </p>
              </div>

              <div className="border border-[#1f2937] bg-[#0d1117]/85 p-6 rounded-xl relative shadow-xl backdrop-blur-xl">
                <div className="absolute left-10 top-10 bottom-10 w-[2px] bg-gradient-to-b from-cyan-400 via-[#8b5cf6] to-[#00ff88]" />

                <div className="flex flex-col gap-6">
                  {[
                    { title: '🖥️ Computer Basics & Digital Literacy', desc: 'কম্পিউটার অপারেটিং সিস্টেম ও ডিজিটাল লিটারেসির বেসিক' },
                    { title: '🐍 Programming Fundamentals (Python / C)', desc: 'লজিক, ভেরিয়েবল, ফাংশন, OOP — প্রোগ্রামিং মানসিকতা গঠন' },
                    { title: '🌐 Web Development Essentials', desc: 'HTML, CSS, JavaScript — Web Technology বোঝার ভিত্তি' },
                    { title: '🔌 Computer Networking', desc: 'TCP/IP, DNS, HTTP, Protocols — নেটওয়ার্কের গভীরে' },
                    { title: '🐧 Linux & Command Line Mastery', desc: 'Shell, File System, Bash Scripting — হ্যাকারের প্রধান হাতিয়ার' },
                    { title: '🔐 Cyber Security Fundamentals', desc: 'ঝুঁকি, CIA Triad, Cryptography, OWASP Top 10' },
                    { title: '⚔️ Ethical Hacking & Penetration Testing', desc: 'Recon, Exploitation, Post-Exploitation — আইনি পেনটেস্টিং' },
                    { title: '🔍 Digital Forensics & Incident Response', desc: 'Evidence Collection, Log Analysis, SIEM ফরেনসিক' },
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-6 items-start relative z-10 pl-1">
                      <div className="w-8 h-8 rounded-full border border-cyan-400/40 bg-black flex items-center justify-center font-mono font-bold text-xs text-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-white/[0.01] border border-[#1f2937]/50 rounded-lg p-3.5 hover:bg-white/[0.02] hover:border-cyan-500/20 transition-all">
                        <h4 className="font-head font-bold text-xs md:text-sm text-white">{step.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Final node */}
                  <div className="flex gap-6 items-start relative z-10 pl-1">
                    <div className="w-8 h-8 rounded-full border border-purple-500/40 bg-purple-500/20 flex items-center justify-center text-xs text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                      ★
                    </div>
                    <div className="flex-1 bg-[#8b5cf6]/5 border border-purple-500/30 rounded-lg p-3.5">
                      <h4 className="font-head font-bold text-xs md:text-sm text-purple-300">🎓 Professional Certification — Cyber Sensei</h4>
                      <p className="text-[11px] text-purple-400/70 mt-1">Industry-recognized Certificate + Job &amp; Career Placement Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials (Section 7) */}
            <section className="flex flex-col gap-6">
              <div className="text-center">
                <span className="text-[#00d4ff] font-head font-extrabold text-xs tracking-widest uppercase">
                  💬 SUCCESS STORIES
                </span>
                <h2 className="font-head font-extrabold text-2xl md:text-3xl text-white tracking-wider mt-1.5">
                  শিক্ষার্থীরা কী বলছে
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#1f2937]/80 bg-[#0d1117]/85 p-6 rounded-xl flex flex-col gap-4">
                  <div className="flex gap-1 text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    &quot;CYBERDOJO তে শেখার অভিজ্ঞতা সত্যিই অনন্য। Mission-ভিত্তিক পড়াশোনা এতটাই আসক্তিমূলক যে আমি প্রতিদিন নতুন কিছু শিখতে উৎসাহিত হই।&quot;
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-9 h-9 rounded-full bg-cyan-400/20 flex items-center justify-center font-bold text-cyan-400 text-xs">
                      RM
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-white">Rafiqul Mohsin</h4>
                      <span className="text-[10px] text-gray-500">Cyber Security Analyst • BUET</span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#1f2937]/80 bg-[#0d1117]/85 p-6 rounded-xl flex flex-col gap-4">
                  <div className="flex gap-1 text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    &quot;Virtual Lab গুলো অসাধারণ! ঘরে বসেই রিয়েল হ্যাকিং environment পেলাম। ARIA মেন্টর আমার দুর্বল দিক ধরিয়ে দিয়েছে।&quot;
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-9 h-9 rounded-full bg-purple-400/20 flex items-center justify-center font-bold text-purple-400 text-xs">
                      TA
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-white">Tahmina Akter</h4>
                      <span className="text-[10px] text-gray-500">Ethical Hacker • Dhaka University</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===========================================
            2. VIEW: LOGIN PAGE
           =========================================== */}
        {activePage === 'login' && (
          <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
            <div className="border border-[#1f2937] bg-[#0d1117]/95 rounded-2xl p-8 max-w-md w-full relative overflow-hidden shadow-2xl backdrop-blur-2xl">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-cyan-500 to-[#8b5cf6]" />

              <div className="text-center mb-6">
                <span className="font-head font-black text-xl text-white tracking-widest block uppercase">
                  MISSION CONTROL LOGIN
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  আপনার কন্ট্রোল প্যানেলে প্রবেশ করুন
                </span>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-head font-extrabold text-gray-400 tracking-wider">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-head font-extrabold text-gray-400 tracking-wider">PASSWORD</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 my-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="accent-cyan-400" /> Remember me
                  </label>
                  <span className="text-cyan-400 hover:underline cursor-pointer">Forgot passcode?</span>
                </div>

                <button
                  type="submit"
                  className="bg-[#00d4ff] hover:bg-cyan-500 text-black py-3 rounded-xl text-xs font-head font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] cursor-pointer"
                >
                  🔐 Enter Mission Control
                </button>
              </form>

              <div className="text-center text-xs text-gray-500 mt-5 pt-4 border-t border-[#1f2937]/50">
                নতুন যোদ্ধা?{' '}
                <span onClick={() => setActivePage('register')} className="text-cyan-400 hover:underline cursor-pointer font-bold">
                  নিবন্ধন করুন →
                </span>
              </div>

              {/* Direct Access to Academy & Cyber Lab Inside Login Page */}
              <div className="mt-5 pt-4 border-t border-[#1f2937]/80 flex flex-col gap-2.5">
                <span className="text-[10px] font-head font-extrabold text-gray-400 tracking-wider uppercase text-center block">
                  ⚡ DIRECT PLATFORM ACCESS
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('courses');
                      setCourseFilter('all');
                    }}
                    className="flex items-center justify-center gap-2 bg-[#080d14] hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 py-2.5 px-3 rounded-xl text-xs font-bold text-cyan-400 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,212,255,0.1)] group"
                  >
                    <span className="text-sm group-hover:scale-125 transition-transform">🎓</span>
                    <span>ACADEMY</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (isAuthenticated) {
                        setActivePage('dashboard');
                        setDashSection('cyber-lab');
                      } else {
                        showToast('ল্যাব ব্যবহার করতে আগে লগইন করুন।', 'info');
                      }
                    }}
                    className="flex items-center justify-center gap-2 bg-[#080d14] hover:bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-400 transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.1)] group"
                  >
                    <span className="text-sm group-hover:scale-125 transition-transform">🧪</span>
                    <span>CYBER LAB</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===========================================
            3. VIEW: REGISTER PAGE (4-STEP)
           =========================================== */}
        {activePage === 'register' && (
          <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
            <div className="border border-[#1f2937] bg-[#0d1117]/95 rounded-2xl p-8 max-w-lg w-full relative overflow-hidden shadow-2xl backdrop-blur-2xl">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00ff88] via-cyan-400 to-[#8b5cf6]" />

              {/* Progress Steps Indicators */}
              <div className="flex items-center justify-between gap-2 mb-8">
                {[
                  { step: 1, name: 'Basic Info' },
                  { step: 2, name: 'Profile' },
                  { step: 3, name: 'Verify' },
                  { step: 4, name: 'Goals' }
                ].map((s) => (
                  <div key={s.step} className="flex-1 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-head font-extrabold text-[10px] border ${
                      regStep === s.step
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                        : regStep > s.step
                        ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'
                        : 'border-[#1f2937] text-gray-500'
                    }`}>
                      {regStep > s.step ? '✓' : s.step}
                    </div>
                    <span className={`hidden sm:inline text-[9px] font-head font-bold uppercase tracking-wider ${
                      regStep === s.step ? 'text-cyan-400' : 'text-gray-500'
                    }`}>
                      {s.name}
                    </span>
                    {s.step < 4 && <div className={`flex-1 h-[1.5px] ${regStep > s.step ? 'bg-[#00ff88]' : 'bg-[#1f2937]'}`} />}
                  </div>
                ))}
              </div>

              {/* STEP 1: Basic Info */}
              {regStep === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="mb-2">
                    <h3 className="font-head font-black text-lg text-white">Create Your Cyber Identity</h3>
                    <p className="text-xs text-gray-500 mt-1">আপনার মিশন আইডি এবং পার্সোনাল ক্রেডেনশিয়াল সেট করুন।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-head font-extrabold text-gray-400">FIRST NAME</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={regForm.firstName}
                        onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                        className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-head font-extrabold text-gray-400">LAST NAME</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={regForm.lastName}
                        onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                        className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-head font-extrabold text-gray-400">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-head font-extrabold text-gray-400">DATE OF BIRTH</label>
                      <input
                        type="date"
                        value={regForm.dob}
                        onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                        className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-gray-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-head font-extrabold text-gray-400">COUNTRY</label>
                      <select
                        value={regForm.country}
                        onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                        className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-gray-400 outline-none"
                      >
                        <option value="Bangladesh">🇧🇩 Bangladesh</option>
                        <option value="United States">🇺🇸 United States</option>
                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-head font-extrabold text-gray-400">PASSWORD (MIN 8 CHARS)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span onClick={() => setActivePage('login')} className="text-xs text-gray-500 hover:underline cursor-pointer">
                      ← Back to Login
                    </span>
                    <button
                      onClick={handleRegisterStart}
                      className="bg-[#00ff88] hover:bg-emerald-500 text-black px-6 py-2.5 rounded-xl text-xs font-head font-extrabold tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                    >
                      Next: Profile →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Choose Avatar */}
              {regStep === 2 && (
                <div className="flex flex-col gap-5">
                  <div className="mb-2">
                    <h3 className="font-head font-black text-lg text-white">Choose Your Avatar</h3>
                    <p className="text-xs text-gray-500 mt-1">মিশন কন্ট্রোলের জন্য আপনার ভার্চুয়াল আইকন বা এভাটার পছন্দ করুন।</p>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {['🤖', '👾', '🦊', '🐉', '💀', '🛡️', '⚡', '🔥', '🎯', '🦅'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setRegForm({ ...regForm, avatar: emoji })}
                        className={`aspect-square rounded-xl border-2 flex items-center justify-center text-3xl transition-all ${
                          regForm.avatar === emoji
                            ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                            : 'border-[#1f2937] bg-white/[0.02] hover:border-gray-500'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="border border-dashed border-[#1f2937] rounded-xl p-4 text-center cursor-pointer text-xs text-gray-500 hover:border-gray-500">
                    📁 Or click to upload profile image
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setRegStep(1)} className="border border-[#1f2937] text-gray-400 hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
                      ← Back
                    </button>
                    <button
                      onClick={() => setRegStep(3)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-2.5 rounded-xl text-xs font-head font-extrabold tracking-wider transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                    >
                      Next: Verify →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: OTP Verification */}
              {regStep === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="mb-2">
                    <h3 className="font-head font-black text-lg text-white">Verify Your Identity</h3>
                    <p className="text-xs text-gray-500 mt-1">আপনার ইমেইলে প্রেরিত ৬-সংখ্যার OTP কোডটি প্রবেশ করুন।</p>
                  </div>

                  <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/20 p-3 rounded-lg text-xs text-cyan-400 font-mono">
                    📧 OTP Sent to: <span className="font-bold">{otpEmail}</span>
                  </div>

                  <div className="flex gap-2.5 justify-center py-4">
                    {otpInputs.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-input-${i}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        className="w-12 h-14 bg-white/5 border-2 border-[#1f2937] focus:border-cyan-500 rounded-xl text-center font-head font-black text-xl text-white outline-none transition-all"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-center text-gray-500">
                    কোড পাননি?{' '}
                    <span onClick={() => showToast('কোড পুনরায় পাঠানো হয়েছে! (ডেমো কোড: 123456)', 'info')} className="text-cyan-400 hover:underline cursor-pointer font-semibold">
                      Resend Code
                    </span>
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setRegStep(2)} className="border border-[#1f2937] text-gray-400 hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
                      ← Back
                    </button>
                    <button
                      onClick={handleVerifyOtp}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-2.5 rounded-xl text-xs font-head font-extrabold tracking-wider transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                    >
                      Verify Code ✓
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Learning Goals */}
              {regStep === 4 && (
                <div className="flex flex-col gap-4">
                  <div className="mb-2">
                    <h3 className="font-head font-black text-lg text-white">Set Your Learning Goals</h3>
                    <p className="text-xs text-gray-500 mt-1">আপনার প্রধান লক্ষ্য নির্বাচন করুন। আমাদের AI মেন্টর ARIA সেই অনুযায়ী গাইড করবে।</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {[
                      { icon: '🖥️', text: 'কম্পিউটার বেসিক ও ডিজিটাল লিটারেসি' },
                      { icon: '🐍', text: 'প্রোগ্রামিং ও সফটওয়্যার ডেভেলপমেন্ট (Python)' },
                      { icon: '🔐', text: 'সাইবার সিকিউরিটি প্রফেশনাল ক্যারিয়ার' },
                      { icon: '💼', text: 'আইটি জব এবং পেশাদার ক্যারিয়ার অর্জন' }
                    ].map((g) => {
                      const isSelected = regForm.goals.includes(g.text);
                      return (
                        <button
                          key={g.text}
                          onClick={() => {
                            const list = isSelected
                              ? regForm.goals.filter((item) => item !== g.text)
                              : [...regForm.goals, g.text];
                            setRegForm({ ...regForm, goals: list });
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3.5 transition-all ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                              : 'border-[#1f2937] bg-white/[0.01] text-gray-400 hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className="text-xl">{g.icon}</span>
                          <span className="text-xs font-semibold">{g.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border border-purple-500/20 bg-purple-500/5 p-3.5 rounded-xl flex gap-3 text-xs text-purple-300 items-start">
                    <span>🤖</span>
                    <div>
                      <strong className="block text-[10px] text-purple-400 font-head tracking-wider uppercase mb-0.5">ARIA AI RECOMMENDATION</strong>
                      লক্ষ্য নির্বাচন করার পর, আপনার জন্য একটি কাস্টমাইজড রোডম্যাপ ড্যাশবোর্ডে সচল করা হবে।
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setRegStep(3)} className="border border-[#1f2937] text-gray-400 hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
                      ← Back
                    </button>
                    <button
                      onClick={handleRegisterComplete}
                      className="bg-gradient-to-r from-cyan-400 to-[#8b5cf6] text-black px-7 py-3 rounded-xl text-xs font-head font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer"
                    >
                      🚀 Launch Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===========================================
            4. VIEW: ACADEMY COURSES DIRECTORY
           =========================================== */}
        {activePage === 'courses' && (
          <div className="flex flex-col gap-8">
            <div className="border-b border-[#1f2937] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[#00d4ff] font-head font-extrabold text-xs tracking-widest uppercase">
                  📚 STUDY CURRICULUM
                </span>
                <h1 className="font-head font-black text-3xl md:text-4xl tracking-wider mt-1 text-white">
                  CYBERDOJO Mission Library
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  কম্পিউটার বেসিক থেকে শুরু করে উন্নত সাইবার নিরাপত্তা ও নৈতিক হ্যাকিং সিলেবাস।
                </p>
              </div>

              {/* Dynamic Search & Category Filtering Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-center w-full md:max-w-xl">
                <input
                  type="text"
                  placeholder="মিশন বা স্কিল খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none"
                />
                
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-gray-400 outline-none"
                >
                  <option value="all">ALL CLASSES</option>
                  <option value="beginner">BEGINNER</option>
                  <option value="intermediate">INTERMEDIATE</option>
                  <option value="advanced">ADVANCED</option>
                  <option value="programming">PROGRAMMING</option>
                  <option value="security">CYBER SECURITY</option>
                </select>
              </div>
            </div>

            {/* Courses Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coursesData
                .filter((c) => {
                  const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchFilter = courseFilter === 'all' || c.category.includes(courseFilter) || c.level.toLowerCase() === courseFilter;
                  return matchSearch && matchFilter;
                })
                .map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setActiveCourse(course);
                      setActivePage('course-detail');
                    }}
                    className="border border-[#1f2937] hover:border-cyan-500/50 bg-[#0d1117]/85 p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden transition-all duration-300 group cursor-pointer hover:-translate-y-1 shadow-xl hover:shadow-[0_20px_40px_rgba(0,212,255,0.08)]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-11 h-11 rounded-lg bg-cyan-500/10 border border-[#1f2937] flex items-center justify-center text-2xl">
                        {course.icon}
                      </div>
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        course.badgeColor === 'secondary'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                      }`}>
                        {course.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-head font-extrabold text-sm text-white group-hover:text-cyan-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex gap-4 text-[10px] text-gray-500 font-mono">
                      <span>📶 {course.level}</span>
                      <span>⏱️ {course.duration}</span>
                      <span>👨‍🎓 {course.students}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#1f2937]/50 mt-1">
                      <span className="text-[#00ff88] font-bold text-xs">★ {course.rating}</span>
                      <span className="text-xs font-head font-extrabold text-[#00ff88]">
                        {course.price}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===========================================
            5. VIEW: COURSE DETAIL HUB
           =========================================== */}
        {activePage === 'course-detail' && activeCourse && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Breadcrumb back */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span onClick={() => setActivePage('courses')} className="hover:underline cursor-pointer">Academy Directory</span>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">{activeCourse.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Syllabus Info Column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div>
                  <span className="badge badge-primary bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-[10px] font-mono">
                    {activeCourse.badge} SYLLABUS
                  </span>
                  <h1 className="font-head font-extrabold text-2xl md:text-3xl text-white tracking-wider mt-3">
                    {activeCourse.title}
                  </h1>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {activeCourse.description}
                  </p>
                </div>

                {/* Meta details list */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-[#1f2937] rounded-xl bg-white/[0.01]">
                  <div>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block">MISSION RATING</span>
                    <span className="text-sm font-bold text-[#00ff88] font-mono mt-0.5 block">★ {activeCourse.rating} / 5.0</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block">STUDENTS ENROLLED</span>
                    <span className="text-sm font-bold text-white font-mono mt-0.5 block">{activeCourse.students}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block">CURRICULUM DURATION</span>
                    <span className="text-sm font-bold text-white font-mono mt-0.5 block">{activeCourse.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block">EXPERTISE LEVEL</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">{activeCourse.level}</span>
                  </div>
                </div>

                {/* Modules Explorer list */}
                <div>
                  <h3 className="font-head font-extrabold text-sm text-white tracking-widest uppercase mb-4">
                    📖 Course Modules &amp; Chapters
                  </h3>

                  <div className="flex flex-col gap-3">
                    {activeCourse.modules.map((mod, i) => (
                      <div key={i} className="border border-[#1f2937] bg-white/[0.01] rounded-xl overflow-hidden">
                        <div className="p-4 bg-white/[0.02] flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-head font-extrabold text-xs text-cyan-400">
                              0{i + 1}
                            </div>
                            <span className="text-xs md:text-sm font-bold text-white">{mod.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">{mod.lessons.length} lessons</span>
                        </div>
                        <div className="p-2 border-t border-[#1f2937]/50 flex flex-col bg-black/35 divide-y divide-[#1f2937]/30">
                          {mod.lessons.map((les) => (
                            <div key={les.id} className="p-2.5 flex justify-between items-center text-xs text-gray-400">
                              <div className="flex items-center gap-2">
                                <span>{les.icon}</span>
                                <span>{les.name}</span>
                              </div>
                              <span className="text-[10px] text-gray-600 font-mono">{les.dur}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Enroll card */}
              <div className="border border-cyan-500/40 bg-black/90 p-6 rounded-xl flex flex-col gap-4 shadow-2xl relative">
                {/* Visual stamp glowing */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-purple-500/10 border border-purple-500 rounded-full flex items-center justify-center text-lg animate-pulse">
                  🛡️
                </div>

                <div>
                  <span className="text-xs text-gray-500 font-head uppercase tracking-wider block">MISSION COST</span>
                  <span className="text-3xl font-head font-black text-[#00ff88] mt-1 block">
                    {activeCourse.price}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Lifetime access • Professional Certificate included
                  </p>
                </div>

                <div className="w-full h-[1.5px] bg-[#1f2937]" />

                {/* Course include checklist */}
                <span className="text-[10px] text-cyan-400 font-head tracking-wider uppercase font-bold">
                  WHAT IS INCLUDED IN THIS MISSION
                </span>
                <ul className="flex flex-col gap-2.5 text-xs text-gray-300">
                  <li className="flex gap-2 items-center">
                    <CheckCircle className="w-4 h-4 text-[#00ff88]" /> Full video training syllabus
                  </li>
                  <li className="flex gap-2 items-center">
                    <CheckCircle className="w-4 h-4 text-[#00ff88]" /> Interactive virtual lab simulator
                  </li>
                  <li className="flex gap-2 items-center">
                    <CheckCircle className="w-4 h-4 text-[#00ff88]" /> AI Mentor (ARIA) assistance
                  </li>
                  <li className="flex gap-2 items-center">
                    <CheckCircle className="w-4 h-4 text-[#00ff88]" /> Verified completion certificate
                  </li>
                </ul>

                <button
                  onClick={() => {
                    const isEnrolled = enrollments.some((e) => e.courseSlug === activeCourse.slug);
                    if (isEnrolled) {
                      setActivePage('dashboard');
                      setDashSection('dashboard');
                    } else {
                      handleEnrollCourse(activeCourse.slug);
                    }
                  }}
                  className="w-full bg-[#00ff88] hover:bg-emerald-500 text-black py-3 rounded-lg text-xs font-head font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] cursor-pointer mt-2"
                >
                  {enrollments.some((e) => e.courseSlug === activeCourse.slug) ? 'CONTINUE LEARNING' : 'START MISSION NOW 🚀'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===========================================
            6. VIEW: STUDENT DASHBOARD ("MISSION CONTROL")
           =========================================== */}
        {activePage === 'dashboard' && currentUser && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Dashboard Sidebar Navigation menu */}
            <aside className="lg:w-60 w-full flex flex-col border border-[#1f2937]/80 rounded-xl bg-[#0d1117]/85 overflow-hidden flex-shrink-0 backdrop-blur-xl">
              <div className="p-4 border-b border-[#1f2937]/50 text-center sm:text-left bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent">
                <span className="font-head font-extrabold text-sm text-[#00d4ff] tracking-widest block uppercase">
                  MISSION CONTROL
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                  Dojo Warrior Workspace
                </span>
              </div>

              <div className="p-2 flex flex-col gap-1 sm:grid sm:grid-cols-3 lg:flex lg:flex-col lg:grid-cols-none">
                {([
                  { id: 'dashboard', name: 'Dashboard Overview', icon: '📊', isLink: false },
                  { id: 'academy', name: 'Curriculum Academy', icon: '🎓', isLink: true },
                  { id: 'cyber-lab', name: 'Interactive Lab', icon: '🧪', isLink: false },
                  { id: 'badges', name: 'Badges earned', icon: '🏅', isLink: false },
                  { id: 'certificates', name: 'My Certificates', icon: '📜', isLink: false },
                  { id: 'ai-chat', name: 'ARIA AI Mentor', icon: '🤖', isLink: false },
                  { id: 'profile', name: 'Identity Settings', icon: '⚙️', isLink: false },
                  { id: 'admin', name: 'Admin diagnostics', icon: '🛡️', isLink: false }
                ] as { id: string; name: string; icon: string; isLink?: boolean }[]).map((sec) => {
                  const isActive = dashSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        if (sec.isLink) {
                          setActivePage('courses');
                        } else {
                          setDashSection(sec.id);
                          setActiveCourse(null); // Close course viewer
                        }
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        isActive
                          ? 'bg-[#00d4ff]/15 text-[#00d4ff] font-bold border-l-2 border-[#00d4ff]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <span>{sec.icon}</span>
                      <span>{sec.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-[#1f2937]/50 p-4 flex items-center gap-2.5 bg-black/35">
                <span className="text-2xl">{currentUser.avatar || '🤖'}</span>
                <div>
                  <span className="text-xs font-bold text-white block">{currentUser.fullName}</span>
                  <span className="text-[10px] text-[#00ff88] font-mono">🟡 {currentUser.stats.currentRank}</span>
                </div>
              </div>
            </aside>

            {/* Dashboard active panel view content */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* ACTIVE COURSE VIEW (takes precedence if course is selected) */}
              {activeCourse ? (
                <div className="animate-fade-in">
                  <div className="mb-4">
                    <button
                      onClick={() => setActiveCourse(null)}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1.5"
                    >
                      ← Back to Dashboard Overview
                    </button>
                  </div>
                  
                  <CourseViewer
                    course={activeCourse}
                    enrolledProgress={enrollments.find((e) => e.courseSlug === activeCourse.slug) || { progressPct: 0, completedLessons: [] }}
                    onCompleteLesson={handleCompleteLesson}
                    onCompleteCourse={handleCompleteCourse}
                  />
                </div>
              ) : (
                <>
                  {/* DASH SECTION: OVERVIEW */}
                  {dashSection === 'dashboard' && (
                    <div className="flex flex-col gap-6">
                      {/* GREETING & STREAK CLAIM */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="font-head font-extrabold text-xl text-white">
                            Good Morning, {currentUser.fullName.split(' ')[0]}! 👋
                          </h2>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — Mission Day Active
                          </p>
                        </div>

                        <button
                          onClick={handleClaimDailyReward}
                          className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-black px-5 py-2.5 rounded-full text-xs font-head font-extrabold tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        >
                          <Flame className="w-4 h-4 text-black" /> Claim Daily Streak Reward
                        </button>
                      </div>

                      {/* STATS MATRIX CARDS */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border border-[#1f2937] p-4 rounded-xl bg-[#0d1117]/85 relative">
                          <span className="text-[9px] text-gray-500 font-head uppercase tracking-wider block">TOTAL EXPERIENCE</span>
                          <span className="text-xl md:text-2xl font-head font-black text-cyan-400 block mt-1">
                            {currentUser.stats.totalXP.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-[#00ff88] mt-1 block">Level rank unlocked</span>
                        </div>
                        <div className="border border-[#1f2937] p-4 rounded-xl bg-[#0d1117]/85 relative">
                          <span className="text-[9px] text-gray-500 font-head uppercase tracking-wider block">BADGES COLLECTED</span>
                          <span className="text-xl md:text-2xl font-head font-black text-purple-400 block mt-1">
                            {currentUser.stats.totalBadges}
                          </span>
                          <span className="text-[9px] text-gray-500 mt-1 block">+2 new unlocked</span>
                        </div>
                        {currentUser && (
                          <FireStreakCounter
                            streak={currentUser.stats.currentStreak}
                            onStreakChange={(newStreak) => {
                              const updatedUser = {
                                ...currentUser,
                                stats: {
                                  ...currentUser.stats,
                                  currentStreak: newStreak
                                }
                              };
                              setCurrentUser(updatedUser);
                              localStorage.setItem('cd_user', JSON.stringify(updatedUser));
                            }}
                          />
                        )}
                        <div className="border border-[#1f2937] p-4 rounded-xl bg-[#0d1117]/85 relative">
                          <span className="text-[9px] text-gray-500 font-head uppercase tracking-wider block">CYBER COINS</span>
                          <span className="text-xl md:text-2xl font-head font-black text-amber-400 block mt-1">
                            🪙 {currentUser.stats.coins}
                          </span>
                          <span className="text-[9px] text-gray-500 mt-1 block">Spend on hints/pro items</span>
                        </div>
                      </div>

                      {/* ARIA ASSISTANCE BRIEF RECOMMENDED BANNER */}
                      <div className="border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-transparent rounded-xl p-5 flex flex-col md:flex-row items-center gap-5 relative">
                        <div className="w-12 h-12 rounded-full border border-purple-500 bg-purple-500/10 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(139,92,246,0.3)] flex-shrink-0">
                          🤖
                        </div>
                        <div>
                          <strong className="block text-[10px] text-purple-400 font-head uppercase tracking-widest mb-0.5">ARIA AI RECOMMENDATIONS</strong>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            আজকের Streak: <strong>🔥 {currentUser.stats.currentStreak} Days</strong> — দারুণ চলছে! আজ <strong>Linux Lab #3</strong> সম্পন্ন করো। দুর্বল বিষয়: <strong>Networking</strong> — TCP/IP Fundamentals-এ মনোযোগ দাও।
                          </p>
                        </div>
                        <div className="flex gap-2 ml-auto flex-shrink-0">
                          <button
                            onClick={() => setDashSection('ai-chat')}
                            className="bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg text-xs font-semibold"
                          >
                            Ask ARIA 💬
                          </button>
                        </div>
                      </div>

                      {/* PROGRESS BAR GRIDS & ACTIVE TARGETS */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        
                        {/* Enrollments Progress list */}
                        <div className="md:col-span-3 border border-[#1f2937] p-5 rounded-xl bg-[#0d1117]/85 flex flex-col gap-4">
                          <h3 className="font-head font-extrabold text-xs text-gray-300 tracking-wider uppercase flex items-center justify-between">
                            <span>📈 Active Missions Progress</span>
                            <span onClick={() => setActivePage('courses')} className="text-[9px] text-cyan-400 font-semibold cursor-pointer hover:underline">
                              See Academy
                            </span>
                          </h3>

                          <div className="flex flex-col gap-4">
                            {enrollments.map((en) => {
                              const course = coursesData.find((c) => c.slug === en.courseSlug);
                              if (!course) return null;
                              return (
                                <div key={en.courseSlug} className="flex flex-col gap-1.5">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-gray-200">{course.title}</span>
                                    <span className="font-mono text-[#00ff88]">{en.progressPct}%</span>
                                  </div>
                                  <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-cyan-400 to-[#8b5cf6]" style={{ width: `${en.progressPct}%` }} />
                                  </div>
                                  <button
                                    onClick={() => {
                                      setActiveCourse(course);
                                    }}
                                    className="text-[10px] text-cyan-400 hover:underline text-left self-start mt-1.5 font-semibold"
                                  >
                                    Continue Learning Modules →
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Leaderboard brief lists */}
                        <div className="md:col-span-2 border border-[#1f2937] p-5 rounded-xl bg-[#0d1117]/85 flex flex-col gap-4">
                          <h3 className="font-head font-extrabold text-xs text-gray-300 tracking-wider uppercase">
                            🏆 Top Dojo Warriors
                          </h3>

                          <div className="flex flex-col gap-3">
                            {[
                              { rank: 1, name: 'Tahmina Akter', avatar: '🐉', xp: 9500, label: '🥇' },
                              { rank: 2, name: 'Sabbir Khan', avatar: '⚡', xp: 4800, label: '🥈' },
                              { rank: 3, name: 'Kamrul Islam', avatar: '🦊', xp: 3100, label: '🥉' },
                              { rank: 127, name: currentUser.fullName, avatar: currentUser.avatar, xp: currentUser.stats.totalXP, label: '#127', isCurrent: true }
                            ].map((row, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                  row.isCurrent ? 'bg-[#00d4ff]/10 border border-[#00d4ff]/25' : 'bg-white/[0.01]'
                                }`}
                              >
                                <span className="font-mono font-bold text-xs text-gray-500 w-5 text-center">{row.label}</span>
                                <span className="text-lg">{row.avatar}</span>
                                <div className="flex-1 min-w-0">
                                  <span className={`text-xs font-semibold block truncate ${row.isCurrent ? 'text-[#00d4ff]' : 'text-white'}`}>
                                    {row.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono">{row.xp} XP</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Daily CTF challenge simulation box */}
                      <div className="border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-xl relative">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(16,185,129,0.3)] flex-shrink-0 animate-pulse">
                          🎯
                        </div>
                        <div className="flex-1">
                          <h4 className="font-head font-black text-sm text-white tracking-widest uppercase">
                            Daily CTF Challenge — SQL Injection Basics
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                            একটি vulnerable login panel থেকে SQL Injection bypass সম্পন্ন করুন। sandbox পরিবেশে নিরাপদভাবে অনুশীলন করে বিশেষ ব্যাজ ও ২০০ XP অর্জন করুন।
                          </p>
                          <div className="text-[10px] text-emerald-400 font-mono font-bold mt-2">
                            🏆 Reward: 200 XP + Special Badge
                          </div>
                        </div>
                        <div className="flex flex-col items-stretch sm:items-end gap-2 text-right flex-shrink-0">
                          <button
                            onClick={() => {
                              setDashSection('cyber-lab');
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2.5 rounded-lg text-xs font-head font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                          >
                            Enter Cyber Lab 🧪
                          </button>
                          <span className="text-[9px] text-gray-500 font-mono">Time left: 18h 42m</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DASH SECTION: INTERACTIVE CYBER LAB TERMINAL */}
                  {dashSection === 'cyber-lab' && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <h2 className="font-head font-extrabold text-xl text-white tracking-wider flex items-center gap-2">
                          🧪 Interactive Cyber Lab Sandbox
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          আপনার কন্টেইনারে নিরাপদ হ্যাকিং ল্যাব সচল করা হয়েছে। সমাধান করতে বাম পাশের নির্দেশিকা ও ডান পাশের টার্মিনালটি ব্যবহার করুন।
                        </p>
                      </div>

                      <TerminalConsole
                        userXP={currentUser.stats.totalXP}
                        onChallengeComplete={(earnedXP, title) => {
                          // Complete assessment
                          const updatedUser = {
                            ...currentUser,
                            stats: {
                              ...currentUser.stats,
                              totalXP: currentUser.stats.totalXP + earnedXP,
                              totalBadges: currentUser.stats.totalBadges + 1
                            }
                          };
                          setCurrentUser(updatedUser);
                          localStorage.setItem('cd_user', JSON.stringify(updatedUser));

                          // Add Badge
                          const badgeId = `b-lab-${Date.now()}`;
                          const newBadge: Badge = {
                            id: badgeId,
                            name: title.replace('Challenge', 'Hacker'),
                            icon: '🛡️',
                            description: `সাফল্যের সাথে ল্যাব মডিউল সম্পন্ন করেছেন: ${title}`
                          };
                          setBadges((prev) => [...prev, newBadge]);
                        }}
                      />
                    </div>
                  )}

                  {/* DASH SECTION: CHAT WITH ARIA */}
                  {dashSection === 'ai-chat' && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <h2 className="font-head font-extrabold text-xl text-white tracking-wider flex items-center gap-2">
                          🤖 ARIA — Personalized AI Mentor
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          আপনার সাইবার সহায়ক কো-পাইলট। যেকোনো প্রযুক্তিগত কোড বা তত্ত্বের ব্যখ্যা পেতে ARIA এর সাথে চ্যাট করুন।
                        </p>
                      </div>

                      <AIMentor
                        userName={currentUser.fullName}
                        streak={currentUser.stats.currentStreak}
                        rankName={currentUser.stats.currentRank}
                      />
                    </div>
                  )}

                  {/* DASH SECTION: BADGES COLLECTION */}
                  {dashSection === 'badges' && (
                    <div className="flex flex-col gap-6 border border-[#1f2937] p-6 rounded-xl bg-[#0d1117]/85 backdrop-blur-xl">
                      <div>
                        <h3 className="font-head font-extrabold text-sm text-white tracking-widest uppercase">
                          🏅 Unlocked Dojo Achievements &amp; Badges
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          আপনি কোর্সের পাঠ সম্পন্ন ও কুইজ উত্তরের মাধ্যমে এই সম্মানজনক ব্যাজগুলো অর্জন করেছেন।
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {badges.map((b) => (
                          <div
                            key={b.id}
                            className="border border-[#1f2937] bg-white/[0.01] hover:border-purple-500/40 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 shadow-md group relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-500/10 group-hover:bg-purple-500" />
                            <div className="w-11 h-11 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                              {b.icon}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block group-hover:text-purple-400 transition-colors">
                                {b.name}
                              </span>
                              <span className="text-[10px] text-gray-500 mt-1 block leading-relaxed">
                                {b.description}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DASH SECTION: MY CERTIFICATES RENDERER */}
                  {dashSection === 'certificates' && (
                    <div className="flex flex-col gap-6">
                      <CertificateRenderer
                        fullName={currentUser.fullName}
                        courseTitle={activeCourse?.title || "Python Programming & System Scripting"}
                      />
                    </div>
                  )}

                  {/* DASH SECTION: ACCOUNT SETTINGS */}
                  {dashSection === 'profile' && (
                    <div className="border border-[#1f2937] bg-[#0d1117]/95 p-6 rounded-xl backdrop-blur-xl">
                      <div className="border-b border-[#1f2937]/50 pb-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="font-head font-extrabold text-sm text-white tracking-widest uppercase">
                            ⚙️ Dojo Student Profile &amp; Settings
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">আপনার প্রাতিষ্ঠানিক স্টুডেন্ট আইডি ও প্রোফাইল আপডেট করুন।</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const sProfile: Student = {
                                id: currentUser.id || 'curr-1',
                                studentId: currentUser.studentId || 'STU-2025-001',
                                fullName: currentUser.fullName,
                                fathersName: currentUser.fathersName || 'Md. Rafiqul Islam',
                                address: currentUser.address || 'House #45, Dhanmondi, Dhaka, Bangladesh',
                                email: currentUser.email,
                                contact: currentUser.phone || '+880 1712-345678',
                                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                                status: 'Active',
                                joinedDate: '১৫ জুলাই ২০২৫',
                                xp: currentUser.stats?.totalXP || 2450,
                                rankName: currentUser.stats?.currentRank || 'Cyber Warrior',
                                enrolledCourses: ['Programming Fundamentals with Python', 'Linux & Command Line Mastery'],
                                achievements: [
                                  { id: 'b1', name: 'Cyber Warrior', icon: '🛡️', description: 'Completed Cyber Labs', dateEarned: '2025-08-01' },
                                  { id: 'b2', name: 'Python Master', icon: '🐍', description: 'Built automation tool', dateEarned: '2025-08-15' }
                                ],
                                certificates: [
                                  {
                                    id: 'cert-1',
                                    courseTitle: 'Computer Basics & Digital Literacy',
                                    issueDate: '১০ আগস্ট ২০২৫',
                                    certificateId: 'CERT-CB-8842',
                                    grade: 'A+'
                                  }
                                ],
                                attendance: [
                                  { date: '2026-07-22', status: 'Present', remarks: 'On time' },
                                  { date: '2026-07-21', status: 'Present', remarks: 'On time' },
                                  { date: '2026-07-20', status: 'Present', remarks: 'On time' }
                                ]
                              };
                              setActiveStudentModal(sProfile);
                            }}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wider cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                          >
                            📄 Open Full Profile View
                          </button>
                          <button
                            onClick={handleProfileSave}
                            className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-lg text-xs font-semibold tracking-wider cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-head font-extrabold text-gray-400">STUDENT FULL NAME (শিক্ষার্থীর নাম)*</label>
                            <input
                              type="text"
                              value={currentUser.fullName}
                              onChange={(e) => setCurrentUser({ ...currentUser, fullName: e.target.value })}
                              className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-head font-extrabold text-amber-400">FATHER'S NAME (পিতার নাম)*</label>
                            <input
                              type="text"
                              placeholder="Md. Rafiqul Islam"
                              value={currentUser.fathersName || 'Md. Rafiqul Islam'}
                              onChange={(e) => setCurrentUser({ ...currentUser, fathersName: e.target.value })}
                              className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-head font-extrabold text-gray-400">CONTACT / PHONE NUMBER*</label>
                            <input
                              type="tel"
                              value={currentUser.phone || ''}
                              onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                              className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-head font-extrabold text-gray-400">EMAIL ADDRESS*</label>
                            <input
                              type="email"
                              disabled
                              value={currentUser.email}
                              className="bg-white/5 border border-[#1f2937] rounded-xl px-4 py-2.5 text-xs text-gray-400 font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-head font-extrabold text-gray-400">FULL ADDRESS (বর্তমান ও স্থায়ী ঠিকানা)*</label>
                          <input
                            type="text"
                            placeholder="House #45, Road #12, Dhanmondi, Dhaka-1209, Bangladesh"
                            value={currentUser.address || 'House #45, Road #12, Dhanmondi, Dhaka-1209, Bangladesh'}
                            onChange={(e) => setCurrentUser({ ...currentUser, address: e.target.value })}
                            className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white"
                          />
                        </div>
                      </form>
                    </div>
                  )}

                  {/* DASH SECTION: ADMIN & INSTRUCTOR MANAGEMENT */}
                  {dashSection === 'admin' && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <h2 className="font-head font-extrabold text-xl text-white tracking-wider flex items-center gap-2">
                          🛡️ Platform Administration Panel
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          সাইবার নিরাপত্তা ড্যাশবোর্ড এবং কোর্স কারিকুলাম পরিচালনার কেন্দ্রীয় কার্যালয়।
                        </p>
                      </div>

                      <AdminPanel />
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER COPYWRITING INFO (Section 8) ────────── */}
      <footer className="border-t border-[#1f2937] bg-[#050a0f] py-10 relative z-30 mt-16 select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500 rounded-lg flex items-center justify-center font-head font-bold text-xs text-cyan-400">
                CD
              </div>
              <div className="leading-none text-left">
                <span className="font-head font-extrabold text-sm text-[#00d4ff] block">CYBERDOJO</span>
                <span className="text-[8px] text-gray-500 block">LEARN • PRACTICE • DEFEND • INNOVATE</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              বাংলাদেশের প্রথম ও একমাত্র গেমিফাইড এবং রোডম্যাপ-ভিত্তিক সাইবার নিরাপত্তা একাডেমি। MD. ALOMGIR HOSSAIN এর পরিচালনায়।
            </p>
          </div>

          <div>
            <h4 className="font-head font-bold text-xs text-cyan-400 tracking-wider uppercase mb-3">QUICK LINKS</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400 font-semibold">
              <span onClick={() => setActivePage('home')} className="hover:text-white cursor-pointer transition-colors">Home Landing</span>
              <span onClick={() => setActivePage('courses')} className="hover:text-white cursor-pointer transition-colors">Mission Library</span>
              <span onClick={() => {
                if (isAuthenticated) setActivePage('dashboard');
                else setActivePage('login');
              }} className="hover:text-white cursor-pointer transition-colors">My Dashboard</span>
            </div>
          </div>

          <div>
            <h4 className="font-head font-bold text-xs text-purple-400 tracking-wider uppercase mb-3">COURSES</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <span>Python Basics</span>
              <span>Linux Shell Scripting</span>
              <span>OWASP Web Security</span>
              <span>Ethical Hacking</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2.5">
            <h4 className="font-head font-bold text-xs text-[#00ff88] tracking-wider uppercase">NEWSLETTER</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              সর্বশেষ সাইবার হ্যাকিং থ্রেট এবং ল্যাব আপডেটের জন্য আমাদের সাপ্তাহিক নিউজলেটারে যুক্ত থাকুন।
            </p>
            <div className="flex gap-2 w-full mt-1.5">
              <input
                type="email"
                placeholder="ইমেইল অ্যাড্রেস..."
                className="flex-1 bg-white/5 border border-[#1f2937] rounded-lg px-3 py-2 text-xs text-white"
              />
              <button
                onClick={() => showToast('নিউজলেটার সাবস্ক্রিপশন সফল হয়েছে! 📬', 'success')}
                className="bg-[#00ff88] hover:bg-emerald-500 text-black px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-[#1f2937]/50 mt-10 pt-6 flex flex-col md:flex-row justify-between text-[11px] text-gray-600 gap-4">
          <span>© 2025 CYBERDOJO | Powered by RB Digital Creator | Director: MD. Alomgir Hossain</span>
          <span>সর্বস্বত্ব সংরক্ষিত।</span>
        </div>
      </footer>

      {/* Render Active Student Profile Modal if selected */}
      {activeStudentModal && (
        <StudentProfileModal
          student={activeStudentModal}
          onClose={() => setActiveStudentModal(null)}
        />
      )}

      {/* Render Server Loading Animation on Initial Load or Server Test Trigger */}
      {isServerLoading && (
        <ServerLoadingScreen
          onComplete={() => setIsServerLoading(false)}
          isInitialLoad={true}
        />
      )}
    </div>
  );
}
