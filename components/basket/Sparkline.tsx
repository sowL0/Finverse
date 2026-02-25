'use client';

import { useEffect, useRef } from 'react';

interface SparklineProps {
  data: number[];
  color: string;       // hex e.g. '#22c55e'
  fill?: boolean;
  height?: number;
  className?: string;
}

export function Sparkline({ data, color, fill = false, height = 44, className }: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 4;

    const toX = (i: number) => (i / (data.length - 1)) * w;
    const toY = (v: number) => h - pad - ((v - min) / range) * (h - pad * 2);

    const pts: [number, number][] = data.map((v, i) => [toX(i), toY(v)]);

    // Fill
    if (fill) {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.lineTo(pts[pts.length - 1][0], h);
      ctx.lineTo(pts[0][0], h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color + '55');
      grad.addColorStop(1, color + '00');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Line
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.strokeStyle = color;
    ctx.lineWidth = fill ? 2 : 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // End dot
    if (fill) {
      const [lx, ly] = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }, [data, color, fill, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height }}
      className={className}
    />
  );
}
