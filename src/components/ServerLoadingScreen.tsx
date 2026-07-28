import React, { useState, useEffect } from 'react';
import { Server, HardDrive, Cpu, Shield, Wifi, Zap, CheckCircle2, Terminal, RefreshCw, Activity, Layers, ArrowRight } from 'lucide-react';

interface ServerLoadingScreenProps {
  onComplete: () => void;
  isInitialLoad?: boolean;
}

const BOOT_STEPS = [
  { progress: 15, msg: "📡 Connecting to CyberDojo Core Cloud Server (asia-east1)...", status: "PENDING" },
  { progress: 35, msg: "⚡ Initializing Quantum SSL Protocol & AES-256 Encryption...", status: "CONNECTING" },
  { progress: 55, msg: "🛡️ Activating Anti-DDoS Firewall & Security Intrusion Shield...", status: "VERIFYING" },
  { progress: 78, msg: "🧠 Syncing AI Mentor Neural Nets (Gemini 2.5 Flash Engine)...", status: "LOADING" },
  { progress: 92, msg: "💾 Loading Cyber Labs, Interactive Terminal & Course Matrix...", status: "SYNCING" },
  { progress: 100, msg: "🚀 CyberDojo Server Cluster Online - Latency 11ms [SYSTEM READY]", status: "COMPLETE" }
];

export default function ServerLoadingScreen({ onComplete, isInitialLoad = true }: ServerLoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState<number>(24);
  const [ramUsage, setRamUsage] = useState<number>(1.8);
  const [serverStatus, setServerStatus] = useState<'booting' | 'ready'>('booting');

  useEffect(() => {
    // Step animation timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setServerStatus('ready');
          setTimeout(() => {
            onComplete();
          }, 900);
          return 100;
        }

        const next = prev + 2;
        // Determine current boot step
        const stepIdx = BOOT_STEPS.findIndex(s => next <= s.progress);
        const activeIdx = stepIdx === -1 ? BOOT_STEPS.length - 1 : stepIdx;
        
        if (activeIdx !== currentStepIndex) {
          setCurrentStepIndex(activeIdx);
          setLogs(prevLogs => [...prevLogs, BOOT_STEPS[activeIdx].msg]);
        }

        // Randomize hardware metrics for realism
        setCpuUsage(Math.floor(20 + Math.random() * 45));
        setRamUsage(parseFloat((1.5 + Math.random() * 0.8).toFixed(1)));

        return next;
      });
    }, 40);

    // Initial log message
    setLogs([BOOT_STEPS[0].msg]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#070a0f] text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden font-sans">
      {/* Background Animated Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px), radial-gradient(#3b82f6 1px, #070a0f 1px)`,
          backgroundSize: `40px 40px`,
          backgroundPosition: `0 0, 20px 20px`
        }}
      />

      {/* Radial Glow Layer */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-6">
        
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Activity className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>CYBERDOJO CORE SERVER CLUSTER v2.4</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
        </div>

        {/* Server Hardware Rack Visualizer */}
        <div className="w-full bg-[#0d1117]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl flex flex-col gap-5">
          
          {/* Server Blade Unit Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((node) => {
              const isActive = progress >= node * 25;
              return (
                <div 
                  key={node} 
                  className={`border rounded-xl p-3.5 transition-all duration-300 flex flex-col gap-2 relative overflow-hidden ${
                    isActive 
                      ? 'border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : 'border-gray-800 bg-gray-900/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                      <span className="text-xs font-mono font-bold text-gray-300">NODE-0{node}</span>
                    </div>
                    {/* Blinking Server LEDs */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-700'}`} />
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-gray-700'}`} />
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400' : 'bg-gray-700'}`} />
                    </div>
                  </div>

                  {/* Node Activity Bar */}
                  <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                      style={{ width: isActive ? `${Math.min(100, (progress - (node - 1) * 25) * 4)}%` : '0%' }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span>LOAD: {isActive ? `${cpuUsage + node * 3}%` : 'OFFLINE'}</span>
                    <span className={isActive ? 'text-emerald-400' : 'text-gray-600'}>
                      {isActive ? 'HEALTHY' : 'STANDBY'}
                    </span>
                  </div>

                  {/* Scanline Sweep Effect */}
                  {isActive && (
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400/80 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Central Progress Bar & Percentage */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                  SERVER BOOT PROGRESS
                </span>
              </div>
              <span className="text-sm font-mono font-extrabold text-cyan-400">
                {progress}%
              </span>
            </div>

            <div className="relative w-full h-3 bg-gray-900 rounded-full border border-cyan-500/30 overflow-hidden p-0.5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-100 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                style={{ width: `${progress}%` }}
              />
              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
            </div>
          </div>

          {/* Live System Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-800 text-[11px] font-mono text-gray-300">
            <div className="flex items-center gap-2 bg-gray-900/60 p-2 rounded-lg border border-gray-800">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <p className="text-[9px] text-gray-500">CPU LOAD</p>
                <p className="font-bold text-white">{cpuUsage}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/60 p-2 rounded-lg border border-gray-800">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              <div>
                <p className="text-[9px] text-gray-500">RAM ALLOC</p>
                <p className="font-bold text-white">{ramUsage} GB / 16GB</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/60 p-2 rounded-lg border border-gray-800">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <p className="text-[9px] text-gray-500">LATENCY</p>
                <p className="font-bold text-white">11 ms</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/60 p-2 rounded-lg border border-gray-800">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <p className="text-[9px] text-gray-500">ENCRYPTION</p>
                <p className="font-bold text-white">AES-256-GCM</p>
              </div>
            </div>
          </div>

          {/* Real-time Boot Logs Terminal */}
          <div className="bg-[#05080c] border border-gray-800 rounded-xl p-3 font-mono text-xs text-gray-300 flex flex-col gap-1.5 h-28 overflow-y-auto">
            <div className="flex items-center justify-between text-[10px] text-gray-500 border-b border-gray-800/60 pb-1 mb-1">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>SERVER_BOOT_CONSOLE.LOG</span>
              </div>
              <span className="text-emerald-400">STREAMING LIVE</span>
            </div>

            {logs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] animate-fadeIn">
                <span className="text-cyan-500 font-bold">&gt;</span>
                <span className={idx === logs.length - 1 ? 'text-cyan-300 font-semibold' : 'text-gray-400'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Skip / Enter Immediately Option */}
        <div className="flex items-center justify-between w-full px-2">
          <p className="text-xs text-gray-500 font-mono">
            সার্ভার অটোমেশন প্রসেস চলছে...
          </p>
          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <span>Skip Loading</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
