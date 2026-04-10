import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { SCENARIOS, FAR_SCENARIOS } from './types';
import avatarImg from '../../../assets/avatar.jpg';

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

// Visual config per scenario
const VISUAL: Record<string, { weight: number; angleDeg: number }> = {
  music:    { weight: 0.85, angleDeg: 330 },
  cinema:   { weight: 0.92, angleDeg: 50  },
  shopping: { weight: 0.62, angleDeg: 145 },
  travel:   { weight: 0.78, angleDeg: 228 },
};

const BASE_R    = 142;  // base orbit radius
const USER_SIZE = 56;   // core circle diameter
const FAR_R     = 218;  // radius for far/secondary worlds

// Orb diameter from weight: 62–88px
const sizeFromWeight = (w: number) => Math.round(62 + w * 30);

// 3-tier glow system
const glowFor = (color: string, w: number) => {
  const a = Math.round(w * 20);
  const b = Math.round(w * 40);
  const c = Math.round(w * 72);
  return [
    `0 0 ${a}px ${Math.round(a / 3)}px ${color}CC`,
    `0 0 ${b}px ${Math.round(b / 3)}px ${color}66`,
    `0 0 ${c}px ${Math.round(c / 2)}px ${color}1A`,
  ].join(', ');
};

export const OverviewCanvas: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: '#000',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div style={{ position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{ color: 'rgba(255,255,255,0.20)', fontSize: 11, letterSpacing: 1.0, fontWeight: 600 }}>
          СЦЕНАРИИ
        </p>
      </div>

      {/* Centered zero-size anchor */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>

        {/* ── SVG connection arcs ── */}
        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none' }} width={0} height={0}>
          <defs>
            {SCENARIOS.map(s => {
              const v = VISUAL[s.id];
              const { x, y } = polar(v.angleDeg, BASE_R + v.weight * 10);
              return (
                <linearGradient
                  key={`grad-${s.id}`}
                  id={`arc-grad-${s.id}`}
                  gradientUnits="userSpaceOnUse"
                  x1={0} y1={0} x2={x} y2={y}
                >
                  <stop offset="0%"   stopColor={s.color} stopOpacity="0.04" />
                  <stop offset="50%"  stopColor={s.color} stopOpacity="0.20" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.05" />
                </linearGradient>
              );
            })}
          </defs>

          <motion.g
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            {SCENARIOS.map(s => {
              const v = VISUAL[s.id];
              const size = sizeFromWeight(v.weight);
              const r = BASE_R + v.weight * 10;
              const { x: ex, y: ey } = polar(v.angleDeg, r);
              const dist = Math.hypot(ex, ey);
              const nx = ex / dist, ny = ey / dist;
              const x1 = nx * (USER_SIZE / 2 + 5);
              const y1 = ny * (USER_SIZE / 2 + 5);
              const x2 = ex - nx * (size / 2 + 5);
              const y2 = ey - ny * (size / 2 + 5);
              // Perpendicular offset for gentle curve
              const midX = (x1 + x2) / 2 + (-ny) * dist * 0.15;
              const midY = (y1 + y2) / 2 + (nx)  * dist * 0.15;
              return (
                <path
                  key={s.id}
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke={`url(#arc-grad-${s.id})`}
                  strokeWidth={1.2}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </motion.g>
        </svg>

        {/* ── Far / secondary worlds ── */}
        {FAR_SCENARIOS.map((s, i) => {
          const angle = (i / FAR_SCENARIOS.length) * 360 + 20;
          const { x, y } = polar(angle, FAR_R);
          return (
            <motion.div
              key={s.label}
              animate={{ opacity: [0.12, 0.26, 0.12] }}
              transition={{ duration: 5.5 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              style={{
                position: 'absolute',
                width: 30, height: 30,
                borderRadius: '50%',
                background: `radial-gradient(circle at center, ${s.color}28 0%, transparent 72%)`,
                boxShadow: `0 0 16px 5px ${s.color}18`,
                border: `1px solid ${s.color}22`,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 7, color: `${s.color}77`, fontWeight: 500, textAlign: 'center', lineHeight: 1.2, padding: '0 2px' }}>
                {s.label}
              </span>
            </motion.div>
          );
        })}

        {/* ── Main world orbs ── */}
        {SCENARIOS.map((s, i) => {
          const v = VISUAL[s.id];
          const size = sizeFromWeight(v.weight);
          const r = BASE_R + v.weight * 10;
          const { x, y } = polar(v.angleDeg, r);
          const floatAmp = 3 + v.weight * 4;
          const floatDur = 4.2 + v.weight * 2.5;
          return (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              <motion.button
                onClick={() => navigate(`/scenarios/${s.id}`)}
                animate={{ y: [0, -floatAmp, 0] }}
                transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  width: size, height: size,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 38% 34%, ${s.color}55 0%, ${s.color}1E 50%, ${s.color}08 100%)`,
                  border: `1.5px solid ${s.color}60`,
                  boxShadow: glowFor(s.color, v.weight),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                }}
              >
                <span style={{
                  fontSize: Math.round(9 + v.weight * 3),
                  fontWeight: 700,
                  color: s.color,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  padding: '0 6px',
                }}>
                  {s.label}
                </span>
              </motion.button>
            </div>
          );
        })}

        {/* ── Central user anchor ── */}

        {/* Bloom — outermost diffuse glow */}
        <div
          style={{
            position: 'absolute',
            width: 180, height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)',
            filter: 'blur(20px)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient ring — breathing */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: USER_SIZE + 22, height: USER_SIZE + 22,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 0 24px 6px rgba(255,255,255,0.04)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Core circle + avatar */}
        <div
          style={{
            position: 'absolute',
            width: USER_SIZE, height: USER_SIZE,
            borderRadius: '50%',
            background: '#111',
            border: '1.5px solid rgba(255,255,255,0.18)',
            boxShadow: '0 0 14px 4px rgba(255,255,255,0.06)',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden',
          }}
        >
          <img
            src={avatarImg}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
          />
        </div>

      </div>
    </div>
  );
};
