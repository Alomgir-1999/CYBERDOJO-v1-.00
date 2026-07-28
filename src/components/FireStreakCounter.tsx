import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Plus, Minus, Zap, Info } from 'lucide-react';

interface Spark {
  id: number;
  x: number; // Horizontal offset %
  size: number; // Size in px
  duration: number; // Duration in seconds
  delay: number; // Delay in seconds
  color: string;
}

interface FireStreakCounterProps {
  streak: number;
  onStreakChange?: (newStreak: number) => void;
}

export default function FireStreakCounter({ streak, onStreakChange }: FireStreakCounterProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const sparkIdCounter = useRef(0);

  // Get fire configurations based on streak duration
  const getFireLevel = (s: number) => {
    if (s <= 2) {
      return {
        level: 1,
        title: "Gentle Ember",
        tagline: "Ember Sparking",
        colorClasses: "from-rose-500/80 via-orange-500/80 to-amber-400/80",
        glowClass: "shadow-[0_0_20px_rgba(244,63,94,0.25)]",
        particleCount: 4,
        scale: 0.85,
        speed: 1.6,
        isCyber: false,
        textColor: "text-rose-400",
        bgLight: "bg-rose-500/5",
        borderStyle: "border-[#1f2937]",
        particleColors: ['#f43f5e', '#f97316', '#fbbf24']
      };
    } else if (s <= 5) {
      return {
        level: 2,
        title: "Rising Blaze",
        tagline: "Steady Heat",
        colorClasses: "from-red-500 via-orange-500 to-yellow-400",
        glowClass: "shadow-[0_0_30px_rgba(249,115,22,0.4)]",
        particleCount: 8,
        scale: 1.0,
        speed: 1.2,
        isCyber: false,
        textColor: "text-orange-400",
        bgLight: "bg-orange-500/5",
        borderStyle: "border-orange-900/30",
        particleColors: ['#ef4444', '#f97316', '#facc15']
      };
    } else if (s <= 9) {
      return {
        level: 3,
        title: "Roaring Fire",
        tagline: "Dojo Champion",
        colorClasses: "from-red-600 via-amber-500 to-yellow-300",
        glowClass: "shadow-[0_0_40px_rgba(239,68,68,0.55)]",
        particleCount: 14,
        scale: 1.15,
        speed: 0.9,
        isCyber: false,
        textColor: "text-amber-400 font-bold",
        bgLight: "bg-red-500/10",
        borderStyle: "border-red-500/30",
        particleColors: ['#dc2626', '#f59e0b', '#fde047', '#ffffff']
      };
    } else if (s <= 14) {
      return {
        level: 4,
        title: "Solar Supernova",
        tagline: "Unstoppable Force",
        colorClasses: "from-rose-600 via-orange-400 to-white",
        glowClass: "shadow-[0_0_55px_rgba(244,63,94,0.7)]",
        particleCount: 22,
        scale: 1.3,
        speed: 0.7,
        isCyber: false,
        textColor: "text-yellow-300 font-extrabold animate-pulse",
        bgLight: "bg-rose-500/15",
        borderStyle: "border-rose-500/50",
        particleColors: ['#e11d48', '#fb923c', '#ffffff', '#fbbf24']
      };
    } else {
      return {
        level: 5,
        title: "Quantum Plasma Core",
        tagline: "Hacker Transcendence",
        colorClasses: "from-violet-600 via-cyan-500 to-emerald-400",
        glowClass: "shadow-[0_0_65px_rgba(6,182,212,0.7),_0_0_25px_rgba(139,92,246,0.5)]",
        particleCount: 30,
        scale: 1.45,
        speed: 0.5,
        isCyber: true,
        textColor: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-300 to-emerald-300 font-black animate-pulse",
        bgLight: "bg-cyan-500/10 border-cyan-500/20",
        borderStyle: "border-cyan-500/50 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]",
        particleColors: ['#8b5cf6', '#06b6d4', '#10b981', '#ffffff', '#a78bfa']
      };
    }
  };

  const f = getFireLevel(streak);

  // Periodic particle emission based on streak level intensity
  useEffect(() => {
    const interval = setInterval(() => {
      // Spawn extra particles for higher streaks
      const spawnCount = f.level >= 4 ? 3 : f.level >= 2 ? 2 : 1;
      const newSparks: Spark[] = [];

      for (let i = 0; i < spawnCount; i++) {
        sparkIdCounter.current += 1;
        newSparks.push({
          id: sparkIdCounter.current,
          x: Math.random() * 80 + 10, // 10% to 90%
          size: Math.random() * (f.level * 1.5 + 2) + 2, // Bigger particles for higher streaks
          duration: Math.random() * 1.5 + 1.0 - (f.level * 0.1), // Rise faster at high levels
          delay: Math.random() * 0.3,
          color: f.particleColors[Math.floor(Math.random() * f.particleColors.length)]
        });
      }

      setSparks((prev) => {
        // Limit active particles to avoid lag
        const maxParticles = f.level * 6 + 10;
        const filtered = prev.filter((p) => p.id > sparkIdCounter.current - maxParticles);
        return [...filtered, ...newSparks];
      });
    }, 400 - (f.level * 50)); // Faster emission for high streaks

    return () => clearInterval(interval);
  }, [streak, f]);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStreakChange) {
      onStreakChange(streak + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStreakChange && streak > 0) {
      onStreakChange(streak - 1);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStreakChange) {
      onStreakChange(1);
    }
  };

  return (
    <div 
      className={`border p-4 rounded-xl relative transition-all duration-500 overflow-hidden flex flex-col justify-between ${f.borderStyle} ${f.bgLight} ${f.glowClass}`}
      style={{ height: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      id="fire-streak-card"
    >
      {/* Animated Plasma Border for Level 5 */}
      {f.isCyber && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[pulse_2s_infinite]" />
          <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-[pulse_3s_infinite]" />
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-[pulse_2s_infinite]" />
          <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-[pulse_3s_infinite]" />
        </div>
      )}

      {/* SVG Displacement / Turbulance Filter definition */}
      <svg className="hidden">
        <defs>
          <filter id={`fire-warp-filter-${f.level}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency={`0.015 ${0.03 * (1 / f.speed)}`} 
              numOctaves="3" 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={10 + f.level * 4} 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* Header Info */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[9px] text-gray-500 font-head uppercase tracking-wider block">DAY STREAK</span>
        
        {/* Interactive Tooltip to view streak achievements */}
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
            className="text-gray-500 hover:text-gray-300 p-0.5 rounded-full transition-colors"
            title="Streak Level Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          
          <AnimatePresence>
            {showTooltip && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-6 w-56 p-3 rounded-lg bg-[#0d1117] border border-gray-800 text-left text-[11px] text-gray-300 z-50 shadow-2xl"
              >
                <h4 className="font-bold text-white mb-2 pb-1 border-b border-gray-800">🔥 Streak Intensities</h4>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between"><span className="text-rose-400">1-2 Days</span> <span>Ember 🔥</span></div>
                  <div className="flex justify-between"><span className="text-orange-400">3-5 Days</span> <span>Rising Blaze 💥</span></div>
                  <div className="flex justify-between"><span className="text-amber-400">6-9 Days</span> <span>Roaring Champion 🏆</span></div>
                  <div className="flex justify-between"><span className="text-rose-300">10-14 Days</span> <span>Solar Supernova 🌟</span></div>
                  <div className="flex justify-between"><span className="text-cyan-300">15+ Days</span> <span>Quantum Core ⚡</span></div>
                </div>
                <div className="mt-2 text-[9px] text-gray-500 text-center italic border-t border-gray-900 pt-1.5">
                  Keep learning daily to level up!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Fire Render Container */}
      <div className="relative flex-1 min-h-[90px] flex items-center justify-center z-10 py-2">
        
        {/* Fire Glow Aura Behind */}
        <div 
          className={`absolute rounded-full filter blur-xl transition-all duration-700 opacity-30 ${
            f.level === 5 ? "bg-gradient-to-r from-violet-600 to-cyan-500 w-20 h-20" : "bg-orange-500 w-16 h-16"
          }`}
          style={{ transform: `scale(${f.scale * 1.2})` }}
        />

        {/* The Turbulent SVG Flame */}
        <div 
          className="relative transition-transform duration-700 select-none flex items-center justify-center"
          style={{ 
            transform: `scale(${f.scale})`,
            filter: `url(#fire-warp-filter-${f.level})`
          }}
        >
          {/* Flame Layers */}
          <div className="relative w-16 h-20 flex items-end justify-center">
            {/* Outer Flame */}
            <div 
              className={`absolute bottom-0 w-12 h-16 rounded-t-full bg-gradient-to-t ${f.colorClasses} opacity-60 filter blur-[1px]`} 
              style={{
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transformOrigin: 'bottom center',
                animation: `flicker ${f.speed * 1.2}s ease-in-out infinite alternate`
              }}
            />
            {/* Middle Flame */}
            <div 
              className={`absolute bottom-0 w-8 h-12 rounded-t-full bg-gradient-to-t ${
                f.level === 5 
                  ? "from-cyan-400 via-emerald-400 to-white" 
                  : "from-orange-500 via-yellow-400 to-white"
              } opacity-85 filter blur-[0.5px]`}
              style={{
                borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
                transformOrigin: 'bottom center',
                animation: `flicker ${f.speed * 0.9}s ease-in-out infinite alternate-reverse`
              }}
            />
            {/* Inner Core Flame */}
            <div 
              className="absolute bottom-0 w-4 h-7 rounded-t-full bg-white opacity-95"
              style={{
                borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
                transformOrigin: 'bottom center',
                animation: `flicker ${f.speed * 0.6}s ease-in-out infinite alternate`
              }}
            />
          </div>
        </div>

        {/* Floating Sparks/Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{ y: 80, x: `${spark.x}%`, opacity: 1, scale: 1 }}
                animate={{
                  y: [80, -20 - Math.random() * 40],
                  x: [
                    `${spark.x}%`, 
                    `${spark.x + (Math.sin(spark.id) * 12)}%`, 
                    `${spark.x + (Math.cos(spark.id) * 18)}%`
                  ],
                  opacity: [1, 0.9, 0],
                  scale: [1, 1.2, 0.4]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: spark.duration,
                  ease: "easeOut",
                  delay: spark.delay
                }}
                className="absolute w-1 h-1 rounded-full filter blur-[0.2px] shadow-sm z-20"
                style={{
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  backgroundColor: spark.color,
                  boxShadow: `0 0 6px ${spark.color}`
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Large Digit Overlay inside the Flame center */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] z-30">
          <span className={`text-3xl md:text-4xl font-head font-black tracking-tighter ${f.textColor}`}>
            {streak}
          </span>
          <span className="text-[8px] text-white/80 font-semibold tracking-wider uppercase mt-[-2px]">
            Days
          </span>
        </div>
      </div>

      {/* Footer Text & Simulator Controls */}
      <div className="flex flex-col gap-1.5 z-10">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold ${f.textColor} uppercase tracking-wider`}>
            {f.title}
          </span>
          <span className="text-[8px] text-gray-500 italic">
            {f.tagline}
          </span>
        </div>

        {/* Streak Test/Simulator Slider & Controls - Appears cleanly and adds awesome interactability */}
        <div className="mt-1 flex items-center justify-between border-t border-[#1f2937]/50 pt-2 gap-2">
          <span className="text-[8px] text-gray-500 font-semibold uppercase tracking-widest flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-yellow-400" /> SIMULATOR
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDecrement}
              disabled={streak <= 1}
              className="w-4 h-4 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-[10px] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Decrease Streak (-1 Day)"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={handleReset}
              className="px-1 text-[8px] rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-all font-head font-bold"
              title="Reset Streak to 1 Day"
            >
              RESET
            </button>
            <button
              onClick={handleIncrement}
              className="w-4 h-4 rounded bg-rose-900/40 border border-rose-500/20 hover:bg-rose-500 hover:text-black text-rose-300 flex items-center justify-center text-[10px] transition-all"
              title="Increase Streak (+1 Day)"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Flicker Animation Inject */}
      <style>{`
        @keyframes flicker {
          0% { transform: scaleY(1) rotate(-1deg); filter: brightness(1); }
          25% { transform: scaleY(1.04) scaleX(1.02) rotate(1deg); filter: brightness(1.1); }
          50% { transform: scaleY(0.96) rotate(-2deg); filter: brightness(0.95); }
          75% { transform: scaleY(1.08) scaleX(0.98) rotate(2deg); filter: brightness(1.15); }
          100% { transform: scaleY(1) rotate(0deg); filter: brightness(1); }
        }
      `}</style>
    </div>
  );
}
