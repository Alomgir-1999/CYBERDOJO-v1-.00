import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Shield, Loader, BookOpen } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AIMentorProps {
  streak: number;
  rankName: string;
  userName: string;
}

export default function AIMentor({ streak, rankName, userName }: AIMentorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `স্বাগতম, ${userName}! 🌅\n\nআমি ARIA, আপনার ডেডিকেটেড সাইবার সিকিউরিটি AI মেন্টর।\n\nআপনার বর্তমান Streak: 🔥 ${streak} Days এবং Rank: 🟡 ${rankName}।\n\nআজকে আপনার জন্য Linux Lab #3 সম্পন্ন করার সুপারিশ করা হচ্ছে। কোনো টপিক বা কোড বুঝতে সমস্যা হলে আমাকে নির্দ্বিধায় জিজ্ঞাসা করুন!`
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'দুঃখিত, সার্ভারের সাথে সংযোগ স্থাপনে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'নেটওয়ার্ক সংযোগ ত্রুটি। দয়া করে আপনার ইন্টারনেট চেক করুন এবং পুনরায় চেষ্টা করুন।'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-[#1f2937] bg-[#0d1117]/95 rounded-xl overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10 border-b border-[#1f2937] p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-purple-500/40 bg-purple-500/10 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            🤖
          </div>
          <div>
            <div className="font-head font-bold text-sm tracking-widest text-white">ARIA — AI MENTOR</div>
            <div className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping inline-block" />
              ONLINE & READY TO ASSIST
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-semibold px-2 py-1 rounded-full flex items-center gap-1 border border-cyan-500/20">
            <Shield className="w-3 h-3" /> SECURITY CO-PILOT
          </span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] flex gap-2 items-start ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            {msg.role === 'assistant' ? (
              <div className="w-7 h-7 rounded-full bg-purple-500/20 text-xs border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                🤖
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-xs border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-1 font-bold text-cyan-400">
                U
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-cyan-500/10 text-cyan-50 border border-cyan-500/20 rounded-tr-none'
                  : 'bg-white/5 text-gray-200 border border-[#1f2937] rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="max-w-[85%] flex gap-2 items-start self-start">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 text-xs border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
              🤖
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 text-gray-400 border border-[#1f2937] rounded-tl-none flex items-center gap-2 text-xs">
              <Loader className="w-3.5 h-3.5 animate-spin text-purple-400" />
              ARIA চিন্তাভাবনা করছে...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions shortcuts */}
      <div className="px-4 py-2 border-t border-[#1f2937]/50 bg-white/[0.01] flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setInput('What is SQL Injection and how can I defend against it?')}
          className="text-[10px] bg-white/5 hover:bg-white/10 border border-[#1f2937] text-gray-400 hover:text-white px-2.5 py-1.5 rounded-full transition-all"
        >
          🔑 Explain SQL Injection
        </button>
        <button
          onClick={() => setInput('Give me a simple guide to Linux chmod permissions')}
          className="text-[10px] bg-white/5 hover:bg-white/10 border border-[#1f2937] text-gray-400 hover:text-white px-2.5 py-1.5 rounded-full transition-all"
        >
          🐧 Linux Permissions Guide
        </button>
        <button
          onClick={() => setInput('Suggest a standard career learning path for Cyber Security')}
          className="text-[10px] bg-white/5 hover:bg-white/10 border border-[#1f2937] text-gray-400 hover:text-white px-2.5 py-1.5 rounded-full transition-all"
        >
          🗺️ Cyber Security Career Path
        </button>
      </div>

      {/* Input panel */}
      <div className="p-4 border-t border-[#1f2937] bg-white/[0.02] flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 bg-white/5 border border-[#1f2937] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
          placeholder="সাইবার নিরাপত্তা সংক্রান্ত যেকোনো প্রশ্ন করুন..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-800 disabled:text-gray-600 text-black p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
