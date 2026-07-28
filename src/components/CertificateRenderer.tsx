import { useRef } from 'react';
import { Award, Download, Share2, Shield, Calendar, Award as Ribbon, CheckCircle2 } from 'lucide-react';

interface CertificateRendererProps {
  fullName: string;
  courseTitle: string;
  completionDate?: string;
  certificateId?: string;
  onClose?: () => void;
}

export default function CertificateRenderer({
  fullName,
  courseTitle,
  completionDate = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
  certificateId = `CD-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
  onClose
}: CertificateRendererProps) {
  const certificateRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Celebration Header */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
          🎉
        </div>
        <h2 className="font-head font-extrabold text-2xl tracking-widest text-[#00ff88]">CONGRATULATIONS!</h2>
        <p className="text-xs text-gray-400 max-w-md leading-relaxed">
          আপনি সাফল্যের সাথে মিশন সম্পন্ন করেছেন এবং আপনার অফিসিয়াল ভেরিফাইড সার্টিফিকেট অর্জন করেছেন!
        </p>
      </div>

      {/* Cyberpunk Certificate Card */}
      <div className="border border-[#1f2937] bg-black rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative max-w-4xl mx-auto w-full">
        {/* Neon Accents */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(0,212,255,0.03),transparent_70%) pointer-events-none" />

        {/* Certificate Frame/Padding */}
        <div
          ref={certificateRef}
          className="p-8 md:p-12 border-4 border-double border-[#1f2937]/50 m-4 rounded-lg flex flex-col items-center text-center relative print:border-none print:m-0 print:p-6"
        >
          {/* Watermark in background */}
          <div className="absolute opacity-5 pointer-events-none z-0">
            <Shield className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 border-2 border-cyan-500 rounded-lg flex items-center justify-center font-head font-bold text-xs text-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                CD
              </div>
              <div className="text-left leading-none">
                <span className="font-head font-extrabold text-sm tracking-widest text-cyan-400">CYBERDOJO</span>
                <span className="block text-[8px] text-gray-500 tracking-wider">LEARN • PRACTICE • DEFEND • INNOVATE</span>
              </div>
            </div>

            {/* Cert label */}
            <span className="font-head text-[10px] tracking-[0.3em] text-[#8b5cf6] font-extrabold uppercase mb-2">
              OFFICIAL CERTIFICATE OF COMPLETION
            </span>

            <h3 className="font-head font-black text-xl md:text-3xl text-white tracking-widest uppercase mb-1 flex items-center gap-1.5">
              CERTIFICATE OF MASTERY
            </h3>
            <div className="w-24 h-1 bg-[#1f2937] my-3" />

            <p className="text-xs text-gray-400 italic mb-6">This credentials certifies that dojo warrior</p>

            {/* Student Name */}
            <h4 className="font-head font-black text-2xl md:text-4xl text-cyan-400 tracking-wide uppercase filter drop-shadow-[0_0_15px_rgba(0,212,255,0.3)] mb-4">
              {fullName || 'WARRIOR NAME'}
            </h4>

            <p className="text-xs text-gray-400 max-w-lg leading-relaxed mb-6">
              has successfully completed all training missions, sandbox lab modules, and final assessments required to satisfy the rigorous syllabus of
            </p>

            {/* Course Title */}
            <div className="bg-white/5 border border-[#1f2937] px-6 py-3 rounded-lg max-w-xl mb-8">
              <span className="font-head font-extrabold text-sm md:text-lg text-[#00ff88] tracking-widest uppercase block">
                {courseTitle || 'COURSE OF EXPERTISE'}
              </span>
            </div>

            {/* Certificate Footer Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-6 border-t border-[#1f2937]/50 mt-2 text-left">
              {/* Left: Signatures */}
              <div className="flex flex-col justify-end items-center md:items-start text-center md:text-left gap-1">
                <span className="font-mono text-xs text-gray-300 italic border-b border-gray-700 pb-1 px-4 block">
                  Md. Alomgir Hossain
                </span>
                <span className="text-[10px] text-gray-500 font-head uppercase tracking-wider block">
                  Director, CYBERDOJO
                </span>
              </div>

              {/* Center: Stamp / Badge */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-purple-500/40 bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <Ribbon className="w-7 h-7" />
                </div>
                <span className="text-[9px] text-[#8b5cf6] font-head uppercase tracking-widest mt-2 block font-extrabold">
                  VERIFIED DOJO MASTER
                </span>
              </div>

              {/* Right: ID & QR code */}
              <div className="flex items-center gap-4 justify-center md:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 font-head tracking-wider uppercase block">
                    Credentials ID
                  </span>
                  <span className="text-xs text-[#00ff88] font-mono font-bold block">{certificateId}</span>
                  <span className="text-[9px] text-gray-600 block mt-1 flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3" /> {completionDate}
                  </span>
                </div>
                <div className="w-12 h-12 bg-white p-1 rounded">
                  {/* Pseudo QR code */}
                  <img
                    referrerPolicy="no-referrer"
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://cyberdojo.local/verify"
                    alt="Certificate QR"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-[#0d1117] border-t border-[#1f2937] p-4 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Signed &amp; Publicly Verified</span>
          </div>

          <div className="flex gap-2">
            {onClose && (
              <button onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-semibold tracking-wider transition-all">
                Close
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#00d4ff] hover:bg-cyan-500 text-black px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.4)]"
            >
              <Download className="w-4 h-4" /> Download PDF / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
