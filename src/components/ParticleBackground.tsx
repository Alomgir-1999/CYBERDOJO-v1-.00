import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Node-Link particles
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.6 ? '#00d4ff' : Math.random() > 0.5 ? '#8b5cf6' : '#00ff88',
      alpha: Math.random() * 0.4 + 0.15,
    }));

    // Matrix binary rain columns
    const columns = Math.floor(window.innerWidth / 20) + 1;
    const rainDrops = Array.from({ length: columns }, () => Math.random() * -60);

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 10, 15, 0.08)'; // Fade trail for binary rain
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw binary rain
      ctx.font = '12px Courier New, monospace';
      for (let i = 0; i < rainDrops.length; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        const x = i * 22;
        const y = rainDrops[i] * 14;

        ctx.fillStyle = `rgba(0, 212, 255, ${Math.random() * 0.06 + 0.01})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i] += 0.45;
      }

      // 2. Draw moving nodes and lines
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 3. Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 100) * 0.075})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40 bg-[#050a0f]"
      />
      {/* Dynamic drifting background glows */}
      <div className="fixed -top-24 -left-24 w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none z-0" />
      <div className="fixed -bottom-24 -right-24 w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none z-0" />
    </>
  );
}
