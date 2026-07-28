import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Award, CheckCircle, Shield, FileText, Download, Printer, CheckCircle2, XCircle } from 'lucide-react';
import { Student } from '../types';
import CertificateRenderer from './CertificateRenderer';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function StudentProfileModal({ student, onClose }: StudentProfileModalProps) {
  const [selectedCert, setSelectedCert] = useState<{ courseTitle: string; certId: string; date: string } | null>(null);

  if (!student) return null;

  // Calculate attendance statistics
  const totalAttendance = student.attendance?.length || 0;
  const presentDays = student.attendance?.filter(a => a.status === 'Present').length || 0;
  const absentDays = student.attendance?.filter(a => a.status === 'Absent').length || 0;
  const attendancePct = totalAttendance > 0 ? Math.round((presentDays / totalAttendance) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0d1117] border border-[#1f2937] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-white">
        
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-black p-6 border-b border-[#1f2937] flex flex-col md:flex-row items-center gap-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Student Photo */}
          <div className="relative group">
            <img
              src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={student.fullName}
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            />
            <span className="absolute -bottom-2 -right-2 bg-black border border-cyan-500 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
              #{student.studentId}
            </span>
          </div>

          {/* Student Header Details */}
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-head font-extrabold text-white">{student.fullName}</h2>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                student.status === 'Active' 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                {student.status} Student
              </span>
            </div>
            
            <p className="text-xs text-purple-300 font-semibold mb-2 flex items-center justify-center md:justify-start gap-1">
              <Shield className="w-3.5 h-3.5" /> Rank: {student.rankName} • <span className="text-[#00ff88] font-mono">{student.xp.toLocaleString()} XP</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-500" /> Joined: {student.joinedDate}
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Attendance: {attendancePct}% ({presentDays}/{totalAttendance} days)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Personal Details */}
          <div className="flex flex-col gap-6">
            
            {/* Student Personal Info Card */}
            <div className="border border-[#1f2937] bg-white/[0.01] rounded-xl p-5 relative overflow-hidden">
              <h3 className="text-xs font-head font-extrabold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[#1f2937] pb-2">
                <User className="w-4 h-4 text-cyan-400" /> Student Personal Profile
              </h3>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-gray-400 font-medium">Student Name:</span>
                  <span className="text-white font-bold">{student.fullName}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-gray-400 font-medium">Father's Name:</span>
                  <span className="text-amber-300 font-semibold">{student.fathersName || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email:
                  </span>
                  <span className="text-gray-200 font-mono">{student.email}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Number:
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">{student.contact || 'N/A'}</span>
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-gray-400 font-medium block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Address:
                  </span>
                  <span className="text-gray-300 leading-relaxed block">{student.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Attendance & Class Log */}
            <div className="border border-[#1f2937] bg-white/[0.01] rounded-xl p-5">
              <h3 className="text-xs font-head font-extrabold text-[#00ff88] uppercase tracking-wider mb-3 flex items-center justify-between border-b border-[#1f2937] pb-2">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#00ff88]" /> Attendance &amp; Class Register</span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{attendancePct}% Rate</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-emerald-400 uppercase font-mono block">Present Days</span>
                  <span className="text-lg font-bold text-white font-mono">{presentDays}</span>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-center">
                  <span className="text-[10px] text-rose-400 uppercase font-mono block">Absent Days</span>
                  <span className="text-lg font-bold text-white font-mono">{absentDays}</span>
                </div>
              </div>

              {/* Attendance Log List */}
              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                {student.attendance && student.attendance.length > 0 ? (
                  student.attendance.map((att, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-black/40 border border-white/5 rounded">
                      <span className="text-gray-400 font-mono">{att.date}</span>
                      <div className="flex items-center gap-2">
                        {att.remarks && <span className="text-[10px] text-gray-500">{att.remarks}</span>}
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          att.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {att.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic text-center py-2">No attendance logs recorded yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Achievements & Certificates */}
          <div className="flex flex-col gap-6">

            {/* Achievements & Badges */}
            <div className="border border-[#1f2937] bg-white/[0.01] rounded-xl p-5">
              <h3 className="text-xs font-head font-extrabold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[#1f2937] pb-2">
                <Award className="w-4 h-4 text-amber-400" /> Student Achievements ({student.achievements?.length || 0})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.achievements && student.achievements.length > 0 ? (
                  student.achievements.map((badge) => (
                    <div key={badge.id} className="border border-amber-500/20 bg-amber-500/5 p-3 rounded-lg flex items-center gap-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-amber-300">{badge.name}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{badge.description}</p>
                        {badge.dateEarned && <span className="text-[9px] text-gray-500 font-mono">Earned: {badge.dateEarned}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic col-span-2 py-2">No badges unlocked yet.</p>
                )}
              </div>
            </div>

            {/* Course Completion Certificates */}
            <div className="border border-[#1f2937] bg-white/[0.01] rounded-xl p-5">
              <h3 className="text-xs font-head font-extrabold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[#1f2937] pb-2">
                <FileText className="w-4 h-4 text-purple-400" /> Course Certificates ({student.certificates?.length || 0})
              </h3>

              <div className="flex flex-col gap-3">
                {student.certificates && student.certificates.length > 0 ? (
                  student.certificates.map((cert) => (
                    <div key={cert.id} className="border border-purple-500/30 bg-purple-500/10 p-3 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{cert.courseTitle}</span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">Grade: {cert.grade}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono block mt-1">ID: {cert.certificateId} • Issued: {cert.issueDate}</span>
                      </div>

                      <button
                        onClick={() => setSelectedCert({
                          courseTitle: cert.courseTitle,
                          certId: cert.certificateId,
                          date: cert.issueDate
                        })}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Certificate
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 border border-dashed border-[#1f2937] rounded-xl">
                    <p className="text-xs text-gray-500">No completed course certificates for this student yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Render Certificate Modal when selected */}
      {selectedCert && (
        <CertificateRenderer
          fullName={student.fullName}
          courseTitle={selectedCert.courseTitle}
          completionDate={selectedCert.date}
          certificateId={selectedCert.certId}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
