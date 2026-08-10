'use client';

import React, { useEffect, useRef } from 'react';
import { useCrowdStore } from '../../../stores/crowd-store';
import { Particle } from '../../../types/models';

export const DigitalTwinCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { venue, gates, updateTelemetry, updateRiskAssessment, sosIncidents } = useCrowdStore();

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastTelemetryEmitRef = useRef<number>(0);

  // Initialize Particles whenever venue changes
  useEffect(() => {
    const newParticles: Particle[] = [];
    const count = venue.defaultCrowdCount;

    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * 700 + 30,
        y: Math.random() * 440 + 30,
        vx: (Math.random() - 0.4) * 1.5,
        vy: (Math.random() - 0.4) * 1.5,
        isStuck: false,
      });
    }

    particlesRef.current = newParticles;
  }, [venue]);

  // Main 60fps Loop Decoupled from 400ms Telemetry Evaluation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;

      // 1. Clear background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      // 2. Draw Subtle Grid Lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // 3. Draw Barriers
      venue.barriers.forEach((b) => {
        if (b.type === 'stage') {
          ctx.fillStyle = 'rgba(147, 51, 234, 0.3)';
          ctx.strokeStyle = '#a855f7';
        } else if (b.type === 'water') {
          ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
          ctx.strokeStyle = '#38bdf8';
        } else if (b.type === 'vip') {
          ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
          ctx.strokeStyle = '#eab308';
        } else {
          ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
          ctx.strokeStyle = '#64748b';
        }
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeRect(b.x, b.y, b.width, b.height);
      });

      // 4. Update and Draw Particles
      let stuckCount = 0;
      const particles = particlesRef.current;

      particles.forEach((p) => {
        // Find nearest open exit gate
        const openExits = gates.filter((g) => g.isOpen && (g.type === 'exit' || g.type === 'emergency'));
        let targetGate = openExits[0];
        let minDist = Infinity;

        openExits.forEach((g) => {
          const gx = g.x + g.width / 2;
          const gy = g.y + g.height / 2;
          const d = Math.hypot(gx - p.x, gy - p.y);
          if (d < minDist) {
            minDist = d;
            targetGate = g;
          }
        });

        if (targetGate) {
          const gx = targetGate.x + targetGate.width / 2;
          const gy = targetGate.y + targetGate.height / 2;
          const angle = Math.atan2(gy - p.y, gx - p.x);

          // Force toward target gate
          p.vx += Math.cos(angle) * 0.08;
          p.vy += Math.sin(angle) * 0.08;
        }

        // Apply friction
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Boundary collision
        if (p.x < 10) { p.x = 10; p.vx *= -0.5; }
        if (p.x > W - 10) { p.x = W - 10; p.vx *= -0.5; }
        if (p.y < 10) { p.y = 10; p.vy *= -0.5; }
        if (p.y > H - 10) { p.y = H - 10; p.vy *= -0.5; }

        // Barrier collision
        venue.barriers.forEach((b) => {
          if (p.x > b.x && p.x < b.x + b.width && p.y > b.y && p.y < b.y + b.height) {
            p.vx *= -0.8;
            p.vy *= -0.8;
            p.x += p.vx * 2;
            p.y += p.vy * 2;
          }
        });

        // Speed evaluation
        const speed = Math.hypot(p.vx, p.vy);
        p.isStuck = speed < 0.2;
        if (p.isStuck) stuckCount++;

        // Particle rendering color based on velocity
        ctx.fillStyle = p.isStuck ? '#ef4444' : speed > 1.0 ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Render Gates
      gates.forEach((g) => {
        ctx.lineWidth = 2;
        if (!g.isOpen) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.strokeStyle = '#ef4444';
        } else if (g.type === 'emergency') {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.strokeStyle = '#10b981';
        } else {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.strokeStyle = '#06b6d4';
        }

        ctx.fillRect(g.x, g.y, g.width, g.height);
        ctx.strokeRect(g.x, g.y, g.width, g.height);

        // Gate Text
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px sans-serif';
        ctx.fillText(
          `${g.id.toUpperCase()}: ${g.isOpen ? 'OPEN' : 'CLOSED'}`,
          g.x,
          g.y > 20 ? g.y - 6 : g.y + g.height + 14
        );
      });

      // 6. Render Active SOS Beacons
      sosIncidents.forEach((sos) => {
        if (sos.status === 'active') {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sos.x, sos.y, 16, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sos.x, sos.y, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('SOS', sos.x - 9, sos.y - 20);
        }
      });

      // 7. Decoupled 400ms Telemetry Calculation Loop
      const now = Date.now();
      if (now - lastTelemetryEmitRef.current > 400) {
        lastTelemetryEmitRef.current = now;

        const totalCount = particles.length;
        const avgVel =
          particles.reduce((acc, p) => acc + Math.hypot(p.vx, p.vy), 0) / (totalCount || 1);
        const stuckRatio = stuckCount / (totalCount || 1);

        let riskLevel: 'NORMAL' | 'ELEVATED' | 'CRITICAL' = 'NORMAL';
        let riskScore = Math.min(100, Math.round(stuckRatio * 150 + (avgVel < 0.5 ? 40 : 10)));

        if (riskScore > 65 || stuckCount > 150) {
          riskLevel = 'CRITICAL';
        } else if (riskScore > 35 || stuckCount > 60) {
          riskLevel = 'ELEVATED';
        }

        updateTelemetry({
          totalCrowdCount: totalCount,
          avgVelocity: parseFloat(avgVel.toFixed(2)),
          stuckParticleCount: stuckCount,
          riskLevel,
        });

        updateRiskAssessment({
          riskLevel,
          score: riskScore,
          compressionHazard: stuckCount > 100,
          bottleneckGateIds: gates.filter((g) => g.canBottleneck && !g.isOpen).map((g) => g.id),
          summaryText:
            riskLevel === 'CRITICAL'
              ? 'CRITICAL DENSITY SURGE DETECTED! Open Emergency Gate 4 immediately.'
              : riskLevel === 'ELEVATED'
              ? 'Elevated crowd pressure near Nigam Ghat bottlenecks.'
              : 'Crowd movement normal across active gates.',
        });
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [venue, gates, sosIncidents, updateTelemetry, updateRiskAssessment]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <div className="flex items-center justify-between w-full max-w-[760px] mb-2 px-1 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          CANVAS DIGITAL TWIN SIMULATOR (60 FPS)
        </span>
        <span className="font-mono text-cyan-400">{venue.name}</span>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-slate-700 glass-panel shadow-2xl">
        <canvas
          ref={canvasRef}
          width={760}
          height={500}
          className="block cursor-crosshair bg-slate-900"
        />
      </div>
    </div>
  );
};
