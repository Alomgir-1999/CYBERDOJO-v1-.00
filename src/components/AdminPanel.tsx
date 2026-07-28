import React, { useState, useEffect } from 'react';
import { Shield, Users, DollarSign, Activity, FilePlus, Settings, BookOpen, Trash, Eye, CheckCircle2, ChevronRight, AlertTriangle, Database, Terminal, UserPlus, Check, X, Calendar, Search, Filter } from 'lucide-react';
import { Student } from '../types';
import { getStoredStudents, saveStoredStudents } from '../data/students';
import StudentProfileModal from './StudentProfileModal';

export default function AdminPanel() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance' | 'sql-db' | 'ai-insights'>('overview');
  
  // Selected Student Profile Modal
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Add New Student Form Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [newStudentData, setNewStudentData] = useState({
    fullName: '',
    fathersName: '',
    address: '',
    email: '',
    contact: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    enrolledCourse: 'Computer Basics & Digital Literacy'
  });

  // Attendance Register Filter / Selected Date
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // SQL Console Simulator State
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM students WHERE status = "Active";');
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);
  const [sqlMessage, setSqlMessage] = useState<string | null>(null);

  // Load students from localStorage or initial mock data
  useEffect(() => {
    const loaded = getStoredStudents();
    setStudents(loaded);
  }, []);

  // Update localStorage when students state changes
  const updateStudentsList = (newList: Student[]) => {
    setStudents(newList);
    saveStoredStudents(newList);
  };

  // Add New Student Handler
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.fullName.trim() || !newStudentData.email.trim()) return;

    const newId = String(Date.now());
    const newStudent: Student = {
      id: newId,
      studentId: `STU-2025-${Math.floor(100 + Math.random() * 900)}`,
      fullName: newStudentData.fullName.trim(),
      fathersName: newStudentData.fathersName.trim() || 'Md. Rafiqul Islam',
      address: newStudentData.address.trim() || 'Dhaka, Bangladesh',
      email: newStudentData.email.trim(),
      contact: newStudentData.contact.trim() || '+880 1700-000000',
      avatar: newStudentData.avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      status: 'Active',
      joinedDate: 'আজ (Today)',
      xp: 500,
      rankName: 'Novice Cadet',
      enrolledCourses: [newStudentData.enrolledCourse],
      achievements: [
        { id: 'b-new', name: 'New Cadet', icon: '🌱', description: 'Enrolled in CyberDojo', dateEarned: '2026-07-22' }
      ],
      certificates: [],
      attendance: [
        { date: attendanceDate, status: 'Present', remarks: 'On time' }
      ]
    };

    const updated = [newStudent, ...students];
    updateStudentsList(updated);

    // Reset Form
    setNewStudentData({
      fullName: '',
      fathersName: '',
      address: '',
      email: '',
      contact: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      enrolledCourse: 'Computer Basics & Digital Literacy'
    });
    setShowAddStudentModal(false);
  };

  // Delete Student Handler
  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে শিক্ষার্থী "${name}" কে ডাটাবেস থেকে মুছে ফেলতে চান?`)) {
      const updated = students.filter(s => s.id !== id);
      updateStudentsList(updated);
    }
  };

  // Attendance Present/Absent Toggle Handler
  const handleToggleAttendance = (studentId: string, targetStatus: 'Present' | 'Absent') => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        const existingAtt = s.attendance || [];
        const dateIdx = existingAtt.findIndex(a => a.date === attendanceDate);

        let newAtt = [...existingAtt];
        if (dateIdx >= 0) {
          newAtt[dateIdx] = { ...newAtt[dateIdx], status: targetStatus };
        } else {
          newAtt.unshift({ date: attendanceDate, status: targetStatus, remarks: targetStatus === 'Present' ? 'On time' : 'Absent' });
        }

        return {
          ...s,
          attendance: newAtt
        };
      }
      return s;
    });

    updateStudentsList(updated);
  };

  // Execute SQL Query Simulator
  const handleExecuteSQL = (queryToRun?: string) => {
    const q = (queryToRun || sqlQuery).trim();
    setSqlMessage(null);

    if (q.toLowerCase().startsWith('select')) {
      if (q.toLowerCase().includes('where status = "active"')) {
        setSqlResult(students.filter(s => s.status === 'Active'));
        setSqlMessage(`Query returned ${students.filter(s => s.status === 'Active').length} rows from database.`);
      } else if (q.toLowerCase().includes('absent')) {
        const absentList = students.filter(s => s.attendance?.some(a => a.status === 'Absent'));
        setSqlResult(absentList);
        setSqlMessage(`Query returned ${absentList.length} rows with absence history.`);
      } else {
        setSqlResult(students);
        setSqlMessage(`Query executed successfully: SELECT * FROM students returned ${students.length} rows.`);
      }
    } else if (q.toLowerCase().startsWith('delete')) {
      setSqlMessage('DELETE query executed. Specified record removed from database tables.');
      setSqlResult([]);
    } else if (q.toLowerCase().startsWith('insert') || q.toLowerCase().startsWith('update')) {
      setSqlMessage('INSERT/UPDATE statement executed. 1 row affected in database.');
      setSqlResult([]);
    } else {
      setSqlResult(students);
      setSqlMessage(`Executed statement: ${q}`);
    }
  };

  // Overall Attendance Summary Metrics
  const totalStudentsCount = students.length;
  const presentTodayCount = students.filter(s => {
    const att = s.attendance?.find(a => a.date === attendanceDate);
    return att ? att.status === 'Present' : s.status === 'Active';
  }).length;
  const absentTodayCount = totalStudentsCount - presentTodayCount;
  const attendanceRatePct = totalStudentsCount > 0 ? Math.round((presentTodayCount / totalStudentsCount) * 100) : 100;

  // Filtered Students List for Search
  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="border border-[#1f2937] bg-[#0d1117]/95 rounded-xl overflow-hidden backdrop-blur-xl min-h-[550px] shadow-2xl">
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-[#1f2937] via-[#111827] to-black p-4 border-b border-[#1f2937] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500 flex items-center justify-center text-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.4)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-head font-extrabold text-sm tracking-widest text-white">CYBERDOJO ADMIN &amp; DATABASE CONTROL</h2>
            <p className="text-[10px] text-gray-400 font-mono uppercase">Role: Super Admin • SQL Database: Operational</p>
          </div>
        </div>

        {/* Tab Triggers */}
        <div className="flex border border-[#1f2937] bg-black/60 rounded-xl overflow-hidden p-1 flex-wrap gap-1">
          {[
            { id: 'overview', name: 'OVERVIEW', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'students', name: `STUDENTS (${students.length})`, icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'attendance', name: 'ATTENDANCE', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { id: 'sql-db', name: 'SQL DATABASE', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'ai-insights', name: 'AI DIAGNOSTICS', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-[10px] font-head font-extrabold px-3 py-1.5 rounded-lg tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id ? 'bg-[#00d4ff] text-black shadow-[0_0_10px_rgba(0,212,255,0.4)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel Body */}
      <div className="p-6">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'TOTAL REGISTERED STUDENTS', value: students.length, icon: <Users className="w-5 h-5 text-cyan-400" />, change: 'Realtime database count' },
                { title: 'ATTENDANCE RATE TODAY', value: `${attendanceRatePct}%`, icon: <Activity className="w-5 h-5 text-[#00ff88]" />, change: `${presentTodayCount} Present / ${absentTodayCount} Absent` },
                { title: 'COURSE CERTIFICATES', value: '3,120', icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />, change: '100% verified digital seals' },
                { title: 'SQL SYSTEM STATUS', value: 'HEALTHY', icon: <Database className="w-5 h-5 text-amber-400" />, change: 'Drizzle ORM / SQLite / PostgreSQL' }
              ].map((s, i) => (
                <div key={i} className="border border-[#1f2937] bg-white/[0.01] p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-30">{s.icon}</div>
                  <span className="text-[10px] text-gray-500 font-head tracking-wider uppercase block">{s.title}</span>
                  <span className="text-xl md:text-2xl font-head font-black text-white block mt-1">{s.value}</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1.5 block">{s.change}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="border border-[#1f2937] bg-black/40 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-head font-extrabold text-white">STUDENT MANAGEMENT QUICK ACTIONS</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">নতুন শিক্ষার্থী যোগ করুন, উপস্থিতি পরিচালনা করুন বা প্রোফাইল আপডেট করুন।</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-head font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,212,255,0.3)] cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Add New Student Profile
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-head font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Today's Attendance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS MANAGEMENT & PROFILES */}
        {activeTab === 'students' && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="নাম, আইডি বা ইমেইল দিয়ে শিক্ষার্থী খুঁজুন..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-black/50 border border-[#1f2937] focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-head font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,212,255,0.3)] cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" /> Add New Student
              </button>
            </div>

            {/* Students List Table */}
            <div className="border border-[#1f2937] rounded-xl overflow-hidden bg-black/50 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#1f2937] bg-white/[0.02] text-[10px] text-gray-400 font-head tracking-wider uppercase">
                    <th className="p-3">PHOTO &amp; STUDENT</th>
                    <th className="p-3">FATHER'S NAME</th>
                    <th className="p-3">CONTACT &amp; EMAIL</th>
                    <th className="p-3">ADDRESS</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">PROFILE &amp; ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]/60 text-xs text-gray-300">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.fullName}
                              className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                            />
                            <div>
                              <span className="font-bold text-white block">{student.fullName}</span>
                              <span className="text-[10px] font-mono text-cyan-400">{student.studentId}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-amber-300 font-semibold">
                          {student.fathersName || 'N/A'}
                        </td>

                        <td className="p-3">
                          <span className="block font-mono text-emerald-400">{student.contact || 'N/A'}</span>
                          <span className="block font-mono text-gray-400 text-[10px]">{student.email}</span>
                        </td>

                        <td className="p-3 max-w-[180px] truncate text-gray-400 text-[11px]" title={student.address}>
                          {student.address || 'N/A'}
                        </td>

                        <td className="p-3">
                          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            student.status === 'Active' 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {student.status}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingStudent(student)}
                              className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              title="Open Full Student Profile"
                            >
                              <Eye className="w-3.5 h-3.5" /> Profile
                            </button>

                            <button
                              onClick={() => handleDeleteStudent(student.id, student.fullName)}
                              className="bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 p-1.5 rounded-lg transition-all cursor-pointer"
                              title="Delete Student from Database"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE REGISTER */}
        {activeTab === 'attendance' && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/40 p-4 rounded-xl border border-[#1f2937]">
              <div>
                <h3 className="text-xs font-head font-extrabold text-[#00ff88] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00ff88]" /> DAILY ATTENDANCE &amp; ABSENCE REGISTER
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">প্রতিটি শিক্ষার্থীর ক্লাসে উপস্থিতি বা অনুপস্থিতি রেকর্ড নিশ্চিত করুন।</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">Date:</span>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-white/5 border border-[#1f2937] focus:border-cyan-500 text-xs text-white rounded-lg px-3 py-1.5 outline-none font-mono"
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-[#1f2937] p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Total Students</span>
                <span className="text-xl font-black text-white font-mono mt-0.5">{totalStudentsCount}</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-mono block">Present Count</span>
                <span className="text-xl font-black text-emerald-400 font-mono mt-0.5">{presentTodayCount}</span>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-center">
                <span className="text-[10px] text-rose-400 uppercase font-mono block">Absent Count</span>
                <span className="text-xl font-black text-rose-400 font-mono mt-0.5">{absentTodayCount}</span>
              </div>
            </div>

            {/* Attendance Register Table */}
            <div className="border border-[#1f2937] rounded-xl overflow-hidden bg-black/50 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#1f2937] bg-white/[0.02] text-[10px] text-gray-400 font-head tracking-wider uppercase">
                    <th className="p-3">STUDENT NAME &amp; ID</th>
                    <th className="p-3">CONTACT</th>
                    <th className="p-3">STATUS ON {attendanceDate}</th>
                    <th className="p-3 text-right">MARK ATTENDANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]/60 text-xs text-gray-300">
                  {students.map((student) => {
                    const attRecord = student.attendance?.find(a => a.date === attendanceDate);
                    const isPresent = attRecord ? attRecord.status === 'Present' : student.status === 'Active';

                    return (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={student.avatar} alt={student.fullName} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <span className="font-bold text-white block">{student.fullName}</span>
                              <span className="text-[10px] font-mono text-gray-500">{student.studentId}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 font-mono text-emerald-400">
                          {student.contact}
                        </td>

                        <td className="p-3">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            isPresent 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {isPresent ? 'PRESENT (উপস্থিত)' : 'ABSENT (অনুপস্থিত)'}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleAttendance(student.id, 'Present')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isPresent 
                                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                                  : 'bg-white/5 text-gray-400 hover:text-white'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleToggleAttendance(student.id, 'Absent')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                !isPresent 
                                  ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                                  : 'bg-white/5 text-gray-400 hover:text-white'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SQL DATABASE CONSOLE */}
        {activeTab === 'sql-db' && (
          <div className="flex flex-col gap-5">
            <div className="border border-[#1f2937] bg-black/60 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-xs font-head font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> INTERACTIVE SQL DATABASE TERMINAL
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  SQL কোয়েরি রান করে স্টুডেন্ট টেবিল, অ্যাটেনডেন্স ও কোর্স সার্টিফিকেটের তথ্য ফিল্টার বা আপডেট করুন।
                </p>
              </div>
            </div>

            {/* SQL Editor */}
            <div className="border border-[#1f2937] bg-black rounded-xl p-4 flex flex-col gap-3 font-mono">
              <div className="flex items-center justify-between text-xs text-gray-400 border-b border-[#1f2937] pb-2">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4" /> SQL Editor
                </span>
                <span>Database: `cyberdojo_db`</span>
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full bg-[#080b10] border border-[#1f2937] focus:border-cyan-500 rounded-lg p-3 text-xs text-green-400 font-mono outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const q = 'SELECT * FROM students WHERE status = "Active";';
                      setSqlQuery(q);
                      handleExecuteSQL(q);
                    }}
                    className="text-[10px] bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded cursor-pointer"
                  >
                    Select Active
                  </button>
                  <button
                    onClick={() => {
                      const q = 'SELECT * FROM students WHERE attendance = "Absent";';
                      setSqlQuery(q);
                      handleExecuteSQL(q);
                    }}
                    className="text-[10px] bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded cursor-pointer"
                  >
                    Select Absent
                  </button>
                  <button
                    onClick={() => {
                      const q = 'SELECT id, fullName, contact FROM students;';
                      setSqlQuery(q);
                      handleExecuteSQL(q);
                    }}
                    className="text-[10px] bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded cursor-pointer"
                  >
                    Select Contacts
                  </button>
                </div>

                <button
                  onClick={() => handleExecuteSQL()}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded-lg text-xs font-head font-extrabold cursor-pointer transition-all shadow-[0_0_10px_rgba(0,212,255,0.3)]"
                >
                  Run Query ▶
                </button>
              </div>
            </div>

            {/* Query Results */}
            {sqlMessage && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 font-mono">
                {sqlMessage}
              </div>
            )}

            {sqlResult && sqlResult.length > 0 && (
              <div className="border border-[#1f2937] rounded-xl overflow-hidden bg-black/40 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#1f2937] bg-white/[0.02] text-[10px] text-gray-400 font-mono uppercase">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">STUDENT NAME</th>
                      <th className="p-2.5">EMAIL</th>
                      <th className="p-2.5">CONTACT</th>
                      <th className="p-2.5">XP</th>
                      <th className="p-2.5">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2937]/50 font-mono text-[11px] text-gray-300">
                    {sqlResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-2.5 text-cyan-400">{row.studentId || row.id}</td>
                        <td className="p-2.5 text-white font-bold">{row.fullName}</td>
                        <td className="p-2.5 text-gray-400">{row.email}</td>
                        <td className="p-2.5 text-emerald-400">{row.contact || 'N/A'}</td>
                        <td className="p-2.5 text-amber-300">{row.xp}</td>
                        <td className="p-2.5">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AI DIAGNOSTICS */}
        {activeTab === 'ai-insights' && (
          <div className="flex flex-col gap-5">
            <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-head font-bold text-xs tracking-wider text-amber-400 uppercase block mb-1">
                  DROPOUT RISK WARNINGS (ARIA AI ENGINE)
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  ARIA AI মেন্টর সনাক্ত করেছে যে ২ জন শিক্ষার্থী গত ৪ দিন ধরে কোনো কার্যকলাপে অংশ নেয়নি এবং তাদের Streak বাতিল হতে পারে। তাদের উদ্বুদ্ধ করতে একটি মোটিভেশনাল নোটিফিকেশন পাঠানোর সুপারিশ করা হচ্ছে।
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add New Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d1117] border border-[#1f2937] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-head font-extrabold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" /> Add New Student Profile to Database
            </h3>

            <form onSubmit={handleAddStudentSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Full Name (শিক্ষার্থীর পুরো নাম)*</label>
                <input
                  type="text"
                  required
                  value={newStudentData.fullName}
                  onChange={(e) => setNewStudentData({ ...newStudentData, fullName: e.target.value })}
                  placeholder="e.g. Md. Tanvir Rahman"
                  className="w-full bg-black/50 border border-[#1f2937] focus:border-cyan-500 rounded-lg p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Father's Name (পিতার নাম)*</label>
                <input
                  type="text"
                  required
                  value={newStudentData.fathersName}
                  onChange={(e) => setNewStudentData({ ...newStudentData, fathersName: e.target.value })}
                  placeholder="e.g. Md. Rafiqul Islam"
                  className="w-full bg-black/50 border border-[#1f2937] focus:border-cyan-500 rounded-lg p-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Email Address*</label>
                  <input
                    type="email"
                    required
                    value={newStudentData.email}
                    onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                    placeholder="tanvir@gmail.com"
                    className="w-full bg-black/50 border border-[#1f2937] focus:border-cyan-500 rounded-lg p-2.5 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Contact Number (মোবাইল)*</label>
                  <input
                    type="text"
                    required
                    value={newStudentData.contact}
                    onChange={(e) => setNewStudentData({ ...newStudentData, contact: e.target.value })}
                    placeholder="+880 1712-000000"
                    className="w-full bg-black/50 border border-[#1f2937] focus:border-cyan-500 rounded-lg p-2.5 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Address (ঠিকানা)</label>
                <input
                  type="text"
                  value={newStudentData.address}
                  onChange={(e) => setNewStudentData({ ...newStudentData, address: e.target.value })}
                  placeholder="House, Road, City, District"
                  className="w-full bg-black/50 border border-[#1f2937] focus:border-cyan-500 rounded-lg p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Photo / Avatar URL</label>
                <input
                  type="text"
                  value={newStudentData.avatar}
                  onChange={(e) => setNewStudentData({ ...newStudentData, avatar: e.target.value })}
                  className="w-full bg-black/50 border border-[#1f2937] focus:border-cyan-500 rounded-lg p-2.5 text-white outline-none font-mono text-[11px]"
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-[#1f2937] rounded-lg text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-head font-extrabold rounded-lg shadow-[0_0_12px_rgba(0,212,255,0.3)]"
                >
                  Save Student Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Student Profile View Modal */}
      {viewingStudent && (
        <StudentProfileModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
        />
      )}
    </div>
  );
}
