import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, CheckCircle, Award, BookOpen, Clock, FileText, Sparkles, ExternalLink, HelpCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Course, Lesson, QuizQuestion } from '../types';

interface CourseViewerProps {
  course: Course;
  enrolledProgress: { progressPct: number; completedLessons: string[] };
  onCompleteLesson: (lessonId: string, xpReward: number) => void;
  onCompleteCourse: () => void;
}

export default function CourseViewer({
  course,
  enrolledProgress,
  onCompleteLesson,
  onCompleteCourse,
}: CourseViewerProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.modules[0].lessons[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [subtitleLang, setSubtitleLang] = useState<'bn' | 'en'>('bn');
  const [expandedModuleIdx, setExpandedModuleIdx] = useState<number>(0);
  
  // Custom Notes state
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');

  // 3-Question Quiz State for the Active Lesson
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Active Tab under Video (Quiz vs Learning Details vs Notes)
  const [activeBottomTab, setActiveBottomTab] = useState<'quiz' | 'learning-details' | 'notes'>('quiz');

  // Fallback 3 quiz questions if lesson doesn't have custom ones
  const defaultLessonQuiz: QuizQuestion[] = [
    {
      id: 'q1',
      question: `Question 1: What is the main objective of "${activeLesson.name}"?`,
      options: [
        'To understand foundational principles and apply practical concepts.',
        'To skip execution and memorize syntax only.',
        'To restrict access without analysis.'
      ],
      correctAnswer: 0,
      explanation: 'Foundational understanding and hands-on application are essential.'
    },
    {
      id: 'q2',
      question: 'Question 2: Which methodology best ensures system safety in this scenario?',
      options: [
        'Ignoring validation checks.',
        'Implementing strict authorization and verification protocols.',
        'Running commands with random privileges.'
      ],
      correctAnswer: 1,
      explanation: 'Strict authorization and input validation prevent critical security flaws.'
    },
    {
      id: 'q3',
      question: 'Question 3: What is the recommended best practice after completing this lesson?',
      options: [
        'Practice in a sandbox laboratory and document findings.',
        'Immediately shut down the terminal.',
        'Delete configuration logs.'
      ],
      correctAnswer: 0,
      explanation: 'Hands-on practice in a sandbox environment builds real mastery.'
    }
  ];

  const currentQuizList = activeLesson.quiz && activeLesson.quiz.length >= 3 ? activeLesson.quiz : defaultLessonQuiz;

  // Auto trigger check when progress reaches 100%
  const totalLessonsCount = course.modules.flatMap(m => m.lessons).length;
  const completedCount = enrolledProgress.completedLessons.length;
  const currentProgressPct = Math.round((completedCount / totalLessonsCount) * 100);

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setIsPlaying(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && !enrolledProgress.completedLessons.includes(activeLesson.id)) {
      onCompleteLesson(activeLesson.id, 30);
    }
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotes((prev) => [...prev, `[02:15] ${noteInput.trim()}`]);
    setNoteInput('');
  };

  const handleSelectQuizOption = (qIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleEvaluate3QuestionQuiz = () => {
    let score = 0;
    currentQuizList.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });

    setQuizSubmitted(true);
    setQuizScore(score);

    if (score >= 2) {
      // Award XP & mark quiz completed
      onCompleteLesson(`quiz-${activeLesson.id}`, 60);
    }
  };

  // Pseudo video player progress updates
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerProgress < 100) {
      interval = setInterval(() => {
        setPlayerProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playerProgress]);

  useEffect(() => {
    setPlayerProgress(enrolledProgress.completedLessons.includes(activeLesson.id) ? 100 : 0);
  }, [activeLesson, enrolledProgress]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Video & Interactive Area (2/3 width) */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        
        {/* Course Header Banner */}
        <div className="border border-[#1f2937] bg-[#0d1117]/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
          <div>
            <h2 className="font-head font-extrabold text-lg text-white flex items-center gap-2">
              <span className="text-[#00d4ff] text-2xl">{course.icon}</span> {course.title}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {course.level} Level • {course.duration} Total Duration • {course.students} Students
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 font-mono uppercase">Course Realtime Progress</span>
              <span className="text-xs font-mono font-bold text-[#00ff88]">
                {currentProgressPct}% ({completedCount}/{totalLessonsCount} Completed)
              </span>
            </div>
            <div className="w-28 bg-[#1f2937] h-2.5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-[#00ff88] transition-all duration-500" 
                style={{ width: `${currentProgressPct}%` }} 
              />
            </div>
            {currentProgressPct >= 100 && (
              <button
                onClick={onCompleteCourse}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
              >
                <Award className="w-4 h-4" /> View Certificate 📜
              </button>
            )}
          </div>
        </div>

        {/* Video Player Simulator */}
        <div className="relative border border-[#1f2937] bg-black rounded-xl overflow-hidden aspect-video flex flex-col justify-between p-4 group shadow-2xl">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_45%,rgba(0,0,0,0.4))] z-10" />
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 animate-scan z-10 pointer-events-none" />

          {/* Top Info Overlay */}
          <div className="flex justify-between items-start relative z-20">
            <span className="bg-black/80 border border-cyan-500/40 rounded px-2.5 py-1 text-[11px] text-[#00d4ff] font-mono tracking-wider flex items-center gap-1.5">
              <span>{activeLesson.icon}</span> ACTIVE LESSON
            </span>
            <span className="bg-black/80 border border-white/10 rounded px-2.5 py-1 text-[11px] text-gray-200 font-semibold max-w-[60%] truncate">
              {activeLesson.name}
            </span>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={handleTogglePlay}
              className="w-16 h-16 rounded-full border border-cyan-500/40 bg-black/70 hover:bg-black/90 flex items-center justify-center text-cyan-400 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(0,212,255,0.5)] cursor-pointer"
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </button>
          </div>

          {/* Subtitles Overlay */}
          <div className="w-full text-center px-4 relative z-20 mb-8 select-none pointer-events-none">
            {isPlaying && (
              <span className="bg-black/90 border border-white/10 px-4 py-1.5 rounded text-xs text-amber-300 inline-block max-w-[90%] leading-relaxed font-semibold filter drop-shadow-md">
                {subtitleLang === 'bn'
                  ? `[পাঠসূচী]: আজ আমরা "${activeLesson.name}" মডিউলটি প্র্যাকটিক্যালি আলোচনা করবো...`
                  : `[Lesson]: Today we will dive deep into "${activeLesson.name}" step-by-step...`}
              </span>
            )}
          </div>

          {/* Bottom Controllers */}
          <div className="w-full flex items-center justify-between gap-4 bg-black/80 border border-white/10 rounded-lg p-2.5 relative z-20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button onClick={handleTogglePlay} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <span className="text-[10px] text-gray-400 font-mono">02:15 / {activeLesson.dur}</span>
            </div>

            <div className="flex-1 bg-gray-800 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
              <div className="bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 h-full" style={{ width: `${playerProgress}%` }} />
            </div>

            <div className="flex items-center gap-2">
              {/* Speed Switcher */}
              <div className="flex items-center border border-white/10 rounded overflow-hidden">
                {[1.0, 1.5, 2.0].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`text-[9px] px-1.5 py-0.5 font-mono cursor-pointer ${
                      playbackSpeed === speed ? 'bg-[#00d4ff] text-black font-bold' : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Subtitle Lang Switcher */}
              <div className="flex items-center border border-white/10 rounded overflow-hidden">
                <button
                  onClick={() => setSubtitleLang('bn')}
                  className={`text-[9px] px-1.5 py-0.5 cursor-pointer ${subtitleLang === 'bn' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-gray-400'}`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setSubtitleLang('en')}
                  className={`text-[9px] px-1.5 py-0.5 cursor-pointer ${subtitleLang === 'en' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-gray-400'}`}
                >
                  ENG
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Quiz, Learning Details & Reference Links */}
        <div className="border border-[#1f2937] bg-[#0d1117]/90 rounded-xl p-2 flex border-b border-[#1f2937] gap-2">
          <button
            onClick={() => setActiveBottomTab('quiz')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-head font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeBottomTab === 'quiz'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Lesson Quiz (3 Questions)
          </button>

          <button
            onClick={() => setActiveBottomTab('learning-details')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-head font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeBottomTab === 'learning-details'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-300" /> Learning Details &amp; Reference Links
          </button>

          <button
            onClick={() => setActiveBottomTab('notes')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-head font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeBottomTab === 'notes'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-300" /> Lesson Notes
          </button>
        </div>

        {/* TAB 1: 3-QUESTION LESSON QUIZ */}
        {activeBottomTab === 'quiz' && (
          <div className="border border-[#1f2937] bg-[#0d1117]/90 rounded-xl p-5 backdrop-blur-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
              <div>
                <h3 className="font-head font-extrabold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Lesson Quiz: {activeLesson.name}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  ভিডিও দেখার পর ৩টি কুইজ প্রশ্নের সঠিক উত্তর দিন এবং +৬০ XP অর্জন করুন।
                </p>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full font-mono font-bold">
                Reward: 60 XP
              </span>
            </div>

            {/* Render 3 Questions */}
            <div className="flex flex-col gap-6">
              {currentQuizList.map((q, qIdx) => (
                <div key={qIdx} className="border border-[#1f2937] bg-black/40 rounded-xl p-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" /> {q.question}
                  </span>

                  <div className="flex flex-col gap-2">
                    {q.options.map((option, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      const isCorrectOpt = q.correctAnswer === optIdx;

                      let styleClass = "border-[#1f2937] bg-white/[0.02] text-gray-300 hover:bg-white/[0.05]";
                      if (quizSubmitted) {
                        if (isCorrectOpt) {
                          styleClass = "border-emerald-500 bg-emerald-500/15 text-emerald-200 font-semibold";
                        } else if (isSelected && !isCorrectOpt) {
                          styleClass = "border-rose-500 bg-rose-500/15 text-rose-200 font-semibold";
                        }
                      } else if (isSelected) {
                        styleClass = "border-cyan-500 bg-cyan-500/10 text-cyan-200 font-semibold shadow-[0_0_10px_rgba(0,212,255,0.2)]";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                          className={`p-3 rounded-lg border text-xs text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${styleClass}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-[10px] font-mono font-bold text-gray-400">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{option}</span>
                          </div>

                          {quizSubmitted && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                          {quizSubmitted && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div className="mt-1 p-2.5 rounded-lg bg-black/60 border border-white/5 text-[11px] text-gray-300">
                      <span className="font-bold text-cyan-400 block mb-0.5">ব্যাখ্যা (Explanation):</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quiz Action / Submission Footer */}
            <div className="flex items-center justify-between border-t border-[#1f2937] pt-4">
              {quizSubmitted && quizScore !== null ? (
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${quizScore >= 2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {quizScore >= 2 
                      ? `🎉 চমৎকার! ৩টির মধ্যে ${quizScore}টি সঠিক হয়েছে! +৬০ XP যোগ হয়েছে!` 
                      : `৩টির মধ্যে ${quizScore}টি সঠিক হয়েছে। পুনরায় চেষ্টা করুন।`}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 font-mono">
                  {Object.keys(quizAnswers).length}/3 প্রশ্নের উত্তর নির্বাচিত হয়েছে।
                </span>
              )}

              {!quizSubmitted ? (
                <button
                  onClick={handleEvaluate3QuestionQuiz}
                  disabled={Object.keys(quizAnswers).length < 3}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black px-5 py-2.5 rounded-xl text-xs font-head font-extrabold tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                >
                  Submit 3-Question Quiz
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                    setQuizScore(null);
                  }}
                  className="border border-[#1f2937] text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LEARNING DETAILS & EXTERNAL REFERENCE LINKS */}
        {activeBottomTab === 'learning-details' && (
          <div className="border border-[#1f2937] bg-[#0d1117]/90 rounded-xl p-6 backdrop-blur-xl flex flex-col gap-6">
            
            {/* Summary */}
            <div className="border-b border-[#1f2937] pb-4">
              <h3 className="text-xs font-head font-extrabold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Course Learning Summary
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {course.learningDetails?.summary || `${course.title} এর মাধ্যমে বিষয়টির বিস্তারিত তাত্ত্বিক ও ব্যবহারিক জ্ঞান অর্জন করা সম্ভব।`}
              </p>
            </div>

            {/* Key Outcomes */}
            <div className="border-b border-[#1f2937] pb-4">
              <h4 className="text-xs font-head font-extrabold text-emerald-400 uppercase tracking-wider mb-3">
                🎯 Key Outcomes (যা যা শিখবেন)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(course.learningDetails?.keyOutcomes || [
                  'বিষয়টির মূল তত্ত্ব ও বেসিক কনসেপ্ট আয়ত্ত করা',
                  'বাস্তব প্রজেক্ট ও সিকিউরিটি টেস্ট রান করা',
                  'সমস্যা সমাধানের আধুনিক দৃষ্টিভঙ্গি গঠন',
                  'সার্টিফিকেশন ও প্রফেশনাল স্কিল তৈরি'
                ]).map((outcome, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* External Reference Links */}
            <div>
              <h4 className="text-xs font-head font-extrabold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-400" /> External Reference Links &amp; Documentation Sites
              </h4>
              <div className="flex flex-col gap-3">
                {(course.learningDetails?.referenceLinks || [
                  {
                    title: 'Official Documentation & Guides',
                    url: 'https://docs.python.org/3/',
                    siteName: 'Official Docs',
                    description: 'বিষয়টির উপর অফিশিয়াল গাইডবুক ও রেফারেন্স ম্যানুয়াল।'
                  }
                ]).map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">{link.title}</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                          {link.siteName}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{link.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0 ml-3" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: LESSON NOTES */}
        {activeBottomTab === 'notes' && (
          <div className="border border-[#1f2937] bg-[#0d1117]/90 rounded-xl p-5 backdrop-blur-xl">
            <h3 className="font-head font-bold text-xs tracking-wider text-white uppercase mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Timeline Bookmarked Notes
            </h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
                placeholder="ভিডিওর বর্তমান সময়ে নোট বা বুকমার্ক লিখুন..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                Add Note
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2 text-center">এখনো কোনো নোট নেওয়া হয়নি।</p>
              ) : (
                notes.map((note, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-2.5 text-xs text-gray-300 flex justify-between">
                    <span>{note}</span>
                    <span className="text-[10px] text-gray-500 font-mono">Timestamped</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Modules & Syllabus Explorer Sidebar (1/3 width) */}
      <div className="flex flex-col gap-4">
        <div className="border border-[#1f2937] bg-[#0d1117]/95 rounded-xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#1f2937] pb-3">
            <span className="font-head font-extrabold text-xs tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" /> COURSE SYLLABUS
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {completedCount}/{totalLessonsCount} Lessons
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {course.modules.map((mod, mIdx) => {
              const isExpanded = expandedModuleIdx === mIdx;
              return (
                <div key={mIdx} className="border border-[#1f2937] rounded-xl overflow-hidden bg-black/40">
                  <button
                    onClick={() => setExpandedModuleIdx(isExpanded ? -1 : mIdx)}
                    className="w-full bg-white/[0.02] hover:bg-white/[0.04] p-3 flex justify-between items-center text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-[9px] text-purple-400 font-mono font-bold block mb-0.5">MODULE 0{mIdx + 1}</span>
                      <span className="text-xs font-bold text-white line-clamp-1">{mod.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#1f2937]/50 flex flex-col divide-y divide-[#1f2937]/30">
                      {mod.lessons.map((les) => {
                        const isCompleted = enrolledProgress.completedLessons.includes(les.id);
                        const isCurrent = activeLesson.id === les.id;
                        return (
                          <button
                            key={les.id}
                            onClick={() => handleLessonSelect(les)}
                            className={`p-3 flex justify-between items-center text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-cyan-500/15 text-white border-l-2 border-cyan-400'
                                : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs">{les.icon}</span>
                              <div>
                                <span className={`text-xs block ${isCurrent ? 'text-cyan-400 font-bold' : ''}`}>{les.name}</span>
                                <span className="text-[10px] text-gray-500 font-mono">{les.dur} duration</span>
                              </div>
                            </div>

                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-[#00ff88] flex-shrink-0" />
                            ) : (
                              les.free && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">Free</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
