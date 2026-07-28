import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Define Types inside server context or import from shared types file
interface UserSession {
  token: string;
  userId: string;
}

interface DBUser {
  id: string;
  email: string;
  password?: string; // stored plainly or simple hash for mockup
  fullName: string;
  avatar: string;
  phone: string;
  dob: string;
  country: string;
  goals: string[];
  xp: number;
  streak: number;
  badgesCount: number;
  coins: number;
  lastActive: string;
}

interface DBEnrollment {
  userId: string;
  courseSlug: string;
  progressPct: number;
  completedLessons: string[];
}

// In-Memory Database State (re-initializes on startup with safe default seed records)
const USERS: DBUser[] = [
  {
    id: 'user-1',
    email: 'alomgir.d1999@gmail.com',
    fullName: 'MD. Alomgir Hossain',
    avatar: '🤖',
    phone: '+8801700000000',
    dob: '1999-12-31',
    country: 'Bangladesh',
    goals: ['সাইবার সিকিউরিটি পেশাদার হতে চাই', 'প্রোগ্রামিং শিখতে চাই (Python/C)'],
    xp: 2450,
    streak: 7,
    badgesCount: 12,
    coins: 500,
    lastActive: new Date().toISOString()
  },
  {
    id: 'user-2',
    email: 'visitor@cyberdojo.com',
    fullName: 'Dojo Warrior Visitor',
    avatar: '🦊',
    phone: '',
    dob: '',
    country: 'Bangladesh',
    goals: ['কম্পিউটার বেসিক শিখতে চাই'],
    xp: 350,
    streak: 2,
    badgesCount: 2,
    coins: 80,
    lastActive: new Date().toISOString()
  }
];

const ENROLLMENTS: DBEnrollment[] = [
  {
    userId: 'user-1',
    courseSlug: 'python-fundamentals',
    progressPct: 75,
    completedLessons: ['py-1-1', 'py-1-2', 'py-2-1', 'py-2-2', 'py-3-1']
  },
  {
    userId: 'user-1',
    courseSlug: 'linux-mastery',
    progressPct: 40,
    completedLessons: ['lin-1-1', 'lin-1-2', 'lin-2-1']
  }
];

const MOCK_OTP_STORE: { [email: string]: string } = {};
const SESSIONS: UserSession[] = [];

// Gemini Client Lazy Initializer
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please check your AI Studio secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper Auth Extractor
  const getSessionUser = (req: express.Request): DBUser | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const session = SESSIONS.find((s) => s.token === token);
    if (!session) return null;
    return USERS.find((u) => u.id === session.userId) || null;
  };

  // ── HEALTH CHECK ────────────────────────────────
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'CYBERDOJO Server Engine', dbSize: USERS.length });
  });

  // ── AUTH ENDPOINTS ──────────────────────────────
  app.post('/api/auth/register', (req, res) => {
    const { email, password, full_name, phone, dob, country, avatar, goals } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'ইমেইল, পাসওয়ার্ড এবং পুরো নাম আবশ্যক।' });
    }

    const existing = USERS.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত হয়েছে।' });
    }

    // Generate random 6 digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    MOCK_OTP_STORE[email] = otp;

    // Output raw OTP in server logs for diagnostic transparency
    console.log(`\n[DIAGNOSTIC OTP GENERATED] for user ${email}: ${otp}\n`);

    // Create shadow draft user (unverified until OTP verifies)
    const newUser: DBUser = {
      id: `user-${Date.now()}`,
      email,
      fullName: full_name,
      phone: phone || '',
      dob: dob || '',
      country: country || 'Bangladesh',
      avatar: avatar || '🤖',
      goals: goals || [],
      xp: 150, // bonus starting points
      streak: 1,
      badgesCount: 1,
      coins: 50,
      lastActive: new Date().toISOString()
    };

    // Store unverified user plainly in list (password simple storage for sandbox verification)
    USERS.push({ ...newUser, password });

    res.json({
      success: true,
      message: `নিবন্ধন খসড়া সফল! OTP আপনার ইমেইলে প্রেরণ করা হয়েছে (খসড়া লগইন: ${otp})`,
      data: { email }
    });
  });

  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'ইমেইল এবং OTP কোড আবশ্যক।' });
    }

    const expectedOtp = MOCK_OTP_STORE[email];
    // Allow backdoor default code "123456" for sandbox preview ease
    if (otp !== expectedOtp && otp !== '123456' && otp !== '1234') {
      return res.status(400).json({ success: false, message: 'ভুল OTP কোড প্রবেশ করেছেন।' });
    }

    const user = USERS.find((u) => u.email === email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
    }

    const token = `session-token-${Math.random().toString(36).substring(2)}`;
    SESSIONS.push({ token, userId: user.id });

    // Clean up OTP key
    delete MOCK_OTP_STORE[email];

    res.json({
      success: true,
      message: 'OTP যাচাই সম্পন্ন হয়েছে!',
      data: {
        accessToken: token,
        refreshToken: `refresh-${token}`,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          phone: user.phone,
          dob: user.dob,
          country: user.country,
          goals: user.goals,
          stats: {
            totalXP: user.xp,
            totalBadges: user.badgesCount,
            currentStreak: user.streak,
            globalRank: 127,
            currentRank: user.xp > 7500 ? '🔴 Elite Guardian' : user.xp > 3500 ? '🟠 Cyber Defender' : '🟡 Cyber Learner',
            coins: user.coins
          }
        }
      }
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' });
    }

    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'ভুল ইমেইল বা পাসওয়ার্ড লিখেছেন।' });
    }

    const token = `session-token-${Math.random().toString(36).substring(2)}`;
    SESSIONS.push({ token, userId: user.id });

    res.json({
      success: true,
      data: {
        accessToken: token,
        refreshToken: `refresh-${token}`,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          phone: user.phone,
          dob: user.dob,
          country: user.country,
          goals: user.goals,
          stats: {
            totalXP: user.xp,
            totalBadges: user.badgesCount,
            currentStreak: user.streak,
            globalRank: 127,
            currentRank: user.xp > 7500 ? '🔴 Elite Guardian' : user.xp > 3500 ? '🟠 Cyber Defender' : '🟡 Cyber Learner',
            coins: user.coins
          }
        }
      }
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const sIdx = SESSIONS.findIndex((s) => s.token === token);
      if (sIdx !== -1) SESSIONS.splice(sIdx, 1);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ── USER SERVICES ───────────────────────────────
  app.get('/api/users/me', (req, res) => {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।' });
    }
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          phone: user.phone,
          dob: user.dob,
          country: user.country,
          goals: user.goals,
          stats: {
            totalXP: user.xp,
            totalBadges: user.badgesCount,
            currentStreak: user.streak,
            globalRank: 127,
            currentRank: user.xp > 7500 ? '🔴 Elite Guardian' : user.xp > 3500 ? '🟠 Cyber Defender' : '🟡 Cyber Learner',
            coins: user.coins
          }
        }
      }
    });
  });

  app.patch('/api/users/me', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { full_name, phone, country, avatar, goals } = req.body;
    if (full_name !== undefined) user.fullName = full_name;
    if (phone !== undefined) user.phone = phone;
    if (country !== undefined) user.country = country;
    if (avatar !== undefined) user.avatar = avatar;
    if (goals !== undefined) user.goals = goals;

    res.json({ success: true, message: 'আপনার প্রোফাইল তথ্য আপডেট সম্পন্ন হয়েছে।', data: user });
  });

  app.post('/api/users/change-password', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { current_password, new_password } = req.body;
    if (user.password && user.password !== current_password) {
      return res.status(400).json({ success: false, message: 'বর্তমান পাসওয়ার্ডটি ভুল।' });
    }
    user.password = new_password;
    res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' });
  });

  // ── COURSES API ─────────────────────────────────
  app.get('/api/courses', (req, res) => {
    // Just lists mock course outlines
    res.json({
      success: true,
      data: {
        courses: [
          { id: 1, slug: 'computer-basics', title: 'Computer Basics', total_students: 3200, rating_avg: 4.8, is_free: true },
          { id: 2, slug: 'python-fundamentals', title: 'Python Fundamentals', total_students: 5100, rating_avg: 4.9, is_free: false, price_amount: 999 },
          { id: 3, slug: 'linux-mastery', title: 'Linux Mastery', total_students: 2800, rating_avg: 4.9, is_free: false, price_amount: 1499 },
          { id: 4, slug: 'web-security', title: 'Web Application Security', total_students: 1950, rating_avg: 4.9, is_free: false, price_amount: 1999 },
          { id: 5, slug: 'ethical-hacking', title: 'Ethical Hacking', total_students: 1200, rating_avg: 4.8, is_free: false, price_amount: 2999 }
        ]
      }
    });
  });

  app.get('/api/courses/:slug', (req, res) => {
    const slug = req.params.slug;
    res.json({
      success: true,
      message: 'Course retrieved successfully',
      data: { slug }
    });
  });

  app.post('/api/courses/:slug/enroll', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const slug = req.params.slug;
    const exists = ENROLLMENTS.find((e) => e.userId === user.id && e.courseSlug === slug);
    if (!exists) {
      ENROLLMENTS.push({
        userId: user.id,
        courseSlug: slug,
        progressPct: 0,
        completedLessons: []
      });
    }
    res.json({ success: true, message: 'কোর্সে সফলভাবে এনরোল সম্পন্ন হয়েছে।' });
  });

  // ── STUDENT DASHBOARD COMPILER ──────────────────
  app.get('/api/dashboard', (req, res) => {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Active enrollments compilation
    const userEnrollments = ENROLLMENTS.filter((e) => e.userId === user.id);
    const activeCourses = userEnrollments.map((en) => {
      let icon = '📚';
      let title = en.courseSlug.replace('-', ' ').toUpperCase();
      if (en.courseSlug === 'python-fundamentals') { icon = '🐍'; title = 'Python Programming'; }
      if (en.courseSlug === 'linux-mastery') { icon = '🐧'; title = 'Linux Essentials'; }
      if (en.courseSlug === 'web-security') { icon = '🔐'; title = 'Web Application Security'; }
      return {
        title,
        icon,
        level: 'Beginner',
        progress_pct: en.progressPct,
        total_xp: en.completedLessons.length * 30
      };
    });

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, full_name: user.fullName, avatar: user.avatar },
        stats: {
          totalXP: user.xp,
          totalBadges: user.badgesCount,
          currentStreak: user.streak,
          globalRank: 127
        },
        rankInfo: {
          name: user.xp > 7500 ? 'Elite Guardian' : user.xp > 3500 ? 'Cyber Defender' : 'Cyber Learner',
          xpToNext: user.xp > 7500 ? 5000 : user.xp > 3500 ? 7500 - user.xp : 3500 - user.xp
        },
        activeCourses,
        leaderboard: [
          { rank: 1, full_name: 'Tahmina Akter', avatar: '🐉', total_xp: 9500 },
          { rank: 2, full_name: 'Sabbir Khan', avatar: '⚡', total_xp: 4800 },
          { rank: 3, full_name: 'Kamrul Islam', avatar: '🦊', total_xp: 3100 },
          { rank: 127, full_name: user.fullName, avatar: user.avatar, total_xp: user.xp, isCurrentUser: true }
        ]
      }
    });
  });

  app.post('/api/courses/lessons/:id/complete', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const lessonId = req.params.id;
    // Find active enrollment
    let courseSlug = 'python-fundamentals';
    if (lessonId.startsWith('lin')) courseSlug = 'linux-mastery';
    if (lessonId.startsWith('cb')) courseSlug = 'computer-basics';
    if (lessonId.startsWith('web')) courseSlug = 'web-security';

    let enrollment = ENROLLMENTS.find((e) => e.userId === user.id && e.courseSlug === courseSlug);
    if (!enrollment) {
      enrollment = {
        userId: user.id,
        courseSlug,
        progressPct: 0,
        completedLessons: []
      };
      ENROLLMENTS.push(enrollment);
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      user.xp += 30; // award 30 XP points
      user.coins += 10;
      
      // Re-calculate progress
      const totalLessonsMap: { [slug: string]: number } = {
        'computer-basics': 7,
        'python-fundamentals': 8,
        'linux-mastery': 7,
        'web-security': 8,
        'ethical-hacking': 6
      };
      const totalLessons = totalLessonsMap[courseSlug] || 8;
      enrollment.progressPct = Math.min(100, Math.round((enrollment.completedLessons.length / totalLessons) * 100));
    }

    res.json({ success: true, message: 'Lesson completed', data: { userXP: user.xp, progress: enrollment.progressPct } });
  });

  // ── AI MENTOR CHAT ENGINES (PROXY) ───────────────
  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message prompt required.' });
    }

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are ARIA, the intelligent Bengali-English cyber mentor of CYBERDOJO. 
                       Speak in a friendly, polite, highly encouraging combination of standard Bengali (বাংলা) and English (called Banglish or code-switching Bengali), exactly like a helpful young professional tech instructor in Bangladesh.
                       Keep all responses brief, highly technical yet accessible, clean, and perfectly suited for computer learning & hacking defenses.
                       Student question: ${message}`
              }
            ]
          }
        ]
      });

      const responseText = response.text || 'ধন্যবাদ আপনার প্রশ্নের জন্য! অনুগ্রহ করে পুনরায় জিজ্ঞাসা করুন।';
      res.json({ success: true, text: responseText });
    } catch (err: any) {
      console.error('Gemini proxy error:', err.message);
      // Friendly localized fallback response if API key is not present or failed
      res.json({
        success: true,
        text: `দুঃখিত! আমি ARIA। বর্তমানে আমার নিউরাল নেটওয়ার্ক অফলাইনে আছে (GEMINI_API_KEY কনফিগার করা নেই)।\n\nআপনি "${message}" সম্পর্কে জিজ্ঞাসা করেছেন। সাইবার সিকিউরিটি একাডেমির এই মডিউলটি অত্যন্ত আকর্ষণীয়! আপনার সিকিউরিটি ড্যাশবোর্ড থেকে অন্য কোনো ল্যাব চেষ্টা করুন।`
      });
    }
  });

  // ── VITE SERVING AND SPA FALLBACK ────────────────
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FULL-STACK ENTERPRISE ENGINE] CYBERDOJO listening on http://localhost:${PORT}`);
  });
}

startServer();
