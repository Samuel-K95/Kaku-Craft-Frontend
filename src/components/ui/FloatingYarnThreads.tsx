// ============================================================================
// components/ui/FloatingYarnThreads.tsx
// ============================================================================
'use client';

import React, { useEffect, useRef } from 'react';
import { FloatingYarnProps } from '@/types';

interface Point3D {
  x: number;
  y: number;
  z: number;
  normalX?: number;
  normalY?: number;
}

interface StrandConfig {
  baseColor: string;
  twistHighlight: string;
  shadowColor: string;
  radius: number;
  speed: number;
  nodesCount: number;
  seed: number;
  curliness: number;
  loopChance: number;
  fuzzDensity: number;
}

const STRANDS: StrandConfig[] = [
  // 1. Spun Terracotta Highland Wool (Deep loops with twisted plies)
  {
    baseColor: '#B85D43',
    twistHighlight: '#D4A373',
    shadowColor: 'rgba(44, 48, 46, 0.16)',
    radius: 4.5,
    speed: 0.00045,
    nodesCount: 48,
    seed: 13.4,
    curliness: 1.4,
    loopChance: 0.7,
    fuzzDensity: 0.35,
  },
  // 2. Botanical Sage Green Filament (Soft Transverse Drape)
  {
    baseColor: '#52796F',
    twistHighlight: '#A3B19B',
    shadowColor: 'rgba(44, 48, 46, 0.12)',
    radius: 3.8,
    speed: 0.00035,
    nodesCount: 42,
    seed: 47.9,
    curliness: 1.1,
    loopChance: 0.4,
    fuzzDensity: 0.25,
  },
  // 3. Raw Warm Alpaca Twine (Tightly Spun Fiber Tail)
  {
    baseColor: '#D4A373',
    twistHighlight: '#EFEBE4',
    shadowColor: 'rgba(44, 48, 46, 0.10)',
    radius: 3.2,
    speed: 0.00055,
    nodesCount: 38,
    seed: 91.2,
    curliness: 1.6,
    loopChance: 0.9,
    fuzzDensity: 0.45,
  },
];

export const FloatingYarnThreads: React.FC<Partial<FloatingYarnProps>> = ({
  side = 'left',
  color = '#B85D43',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);

    const handleResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
    };

    window.addEventListener('resize', handleResize);

    // Multi-octave 3D noise approximation
    const pseudoNoise3D = (x: number, y: number, z: number) => {
      const sin1 = Math.sin(x * 1.7 + y * 2.3 + z * 0.9);
      const cos1 = Math.cos(x * 2.9 - y * 1.3 + z * 1.7);
      const sin2 = Math.sin(x * 0.6 - y * 0.8 + z * 2.4);
      return (sin1 + cos1 + sin2) / 3;
    };

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      STRANDS.forEach((strand) => {
        const t = time * strand.speed + strand.seed;
        const nodes: Point3D[] = [];

        // 1. Calculate dynamic 3D spline points
        for (let i = 0; i < strand.nodesCount; i++) {
          const ratio = i / (strand.nodesCount - 1);
          
          const basePathX = (ratio * 1.4 - 0.2) * width;
          const basePathY = (0.5 + Math.sin(t * 0.5 + ratio * Math.PI * 2) * 0.35) * height;

          const noiseX = pseudoNoise3D(ratio * 3.5, t * 0.6, strand.seed);
          const noiseY = pseudoNoise3D(t * 0.5, ratio * 3.5, strand.seed + 10);
          const noiseZ = pseudoNoise3D(ratio * 2.0, strand.seed, t * 0.4);

          const coilAngle = ratio * Math.PI * 8 * strand.curliness + t * 2;
          const coilRadius = (Math.sin(ratio * Math.PI * 3 + t) > 0.3 ? 70 : 15) * strand.loopChance * dpr;

          const px = basePathX + noiseX * (width * 0.18) + Math.cos(coilAngle) * coilRadius;
          const py = basePathY + noiseY * (height * 0.24) + Math.sin(coilAngle) * coilRadius;
          const pz = noiseZ * 120 * dpr;

          nodes.push({ x: px, y: py, z: pz });
        }

        // Calculate 2D normals for rope twist
        for (let i = 0; i < nodes.length - 1; i++) {
          const dx = nodes[i + 1].x - nodes[i].x;
          const dy = nodes[i + 1].y - nodes[i].y;
          const len = Math.hypot(dx, dy) || 1;
          nodes[i].normalX = -dy / len;
          nodes[i].normalY = dx / len;
        }
        nodes[nodes.length - 1].normalX = nodes[nodes.length - 2].normalX;
        nodes[nodes.length - 1].normalY = nodes[nodes.length - 2].normalY;

        // 2. LAYER 1: AMBIENT 3D CAST SHADOW
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(nodes[0].x + 8 * dpr, nodes[0].y + 14 * dpr);
        for (let i = 1; i < nodes.length - 2; i++) {
          const xc = (nodes[i].x + nodes[i + 1].x) / 2 + 8 * dpr;
          const yc = (nodes[i].y + nodes[i + 1].y) / 2 + 14 * dpr;
          ctx.quadraticCurveTo(nodes[i].x + 8 * dpr, nodes[i].y + 14 * dpr, xc, yc);
        }
        ctx.strokeStyle = strand.shadowColor;
        ctx.lineWidth = (strand.radius + 6) * dpr;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.filter = 'blur(8px)';
        ctx.stroke();
        ctx.restore();

        // 3. LAYER 2: CORE SPUN YARN STRAND
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        for (let i = 1; i < nodes.length - 2; i++) {
          const xc = (nodes[i].x + nodes[i + 1].x) / 2;
          const yc = (nodes[i].y + nodes[i + 1].y) / 2;
          ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, xc, yc);
        }
        ctx.strokeStyle = strand.baseColor;
        ctx.lineWidth = strand.radius * 2 * dpr;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // 4. LAYER 3: 2-PLY HELICAL TWIST PATTERN
        for (let i = 0; i < nodes.length - 1; i += 1) {
          const p1 = nodes[i];
          const p2 = nodes[i + 1];
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const steps = Math.max(Math.floor(dist / (4 * dpr)), 1);

          for (let s = 0; s < steps; s++) {
            const progress = (i + s / steps) / nodes.length;
            const curX = p1.x + (p2.x - p1.x) * (s / steps);
            const curY = p1.y + (p2.y - p1.y) * (s / steps);
            const nx = p1.normalX!;
            const ny = p1.normalY!;

            const twistPhase = progress * Math.PI * 48 + t * 4;
            const twistOffset = Math.sin(twistPhase) * (strand.radius * 0.75 * dpr);
            const twistAlpha = (Math.cos(twistPhase) + 1) / 2;

            if (twistAlpha > 0.3) {
              ctx.beginPath();
              ctx.arc(
                curX + nx * twistOffset,
                curY + ny * twistOffset,
                strand.radius * 0.45 * dpr,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = strand.twistHighlight;
              ctx.globalAlpha = twistAlpha * 0.65;
              ctx.fill();
            }
          }
        }
        ctx.globalAlpha = 1.0;

        // 5. LAYER 4: MICRO-FIBER TACTILE FUZZ
        for (let i = 2; i < nodes.length - 2; i += 2) {
          if (Math.random() < strand.fuzzDensity) {
            const p = nodes[i];
            const nx = p.normalX!;
            const ny = p.normalY!;
            const fuzzDir = Math.random() > 0.5 ? 1 : -1;
            const fuzzLen = (3 + Math.random() * 8) * dpr;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(
              p.x + nx * fuzzDir * fuzzLen + (Math.random() - 0.5) * 4 * dpr,
              p.y + ny * fuzzDir * fuzzLen + (Math.random() - 0.5) * 4 * dpr
            );
            ctx.strokeStyle = strand.baseColor;
            ctx.lineWidth = 1 * dpr;
            ctx.globalAlpha = 0.4;
            ctx.stroke();
          }
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [side, color]); // Consistently kept dependencies

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none overflow-hidden blur-[4px] opacity-30"
      style={{ zIndex: 0 }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};