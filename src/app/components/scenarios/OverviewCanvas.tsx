import React from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SCENARIOS, FAR_SCENARIOS } from './types';
import avatarImg from '../../../assets/avatar.jpg';

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

// ── Visual config ─────────────────────────────────────────────────────────────
interface WorldVisual {
  weight:    number;
  angleDeg:  number;
  r?:        number;
  featured?: boolean;
}

const VISUAL: Record<string, WorldVisual> = {
  content:  { weight: 0.98, angleDeg: 335, r: 118, featured: true },
  music:    { weight: 0.68, angleDeg:  65 },
  cinema:   { weight: 0.76, angleDeg: 155 },
  shopping: { weight: 0.50, angleDeg: 220 },
  travel:   { weight: 0.64, angleDeg: 278 },
};

const BASE_R        = 148;
const USER_SIZE     = 56;
const FAR_R         = 224;
const FEATURED_SIZE = 108;
const PREVIEW_SIZE  = 62;   // preview-state size for activated far signals

// Far signals that respond to tap
const INTERACTIVE_SIGNALS = ['Книги', 'Еда'];

const sizeFromWeight = (w: number) => Math.round(60 + w * 24);

const glowFor = (color: string, w: number) => {
  const a = Math.round(w * 13);
  const b = Math.round(w * 28);
  const c = Math.round(w * 50);
  return [
    `0 0 ${a}px ${Math.round(a / 3)}px ${color}AA`,
    `0 0 ${b}px ${Math.round(b / 3)}px ${color}44`,
    `0 0 ${c}px ${Math.round(c / 2)}px ${color}14`,
  ].join(', ');
};

const featuredGlow = (color: string) => [
  `0 0 22px 7px ${color}CC`,
  `0 0 50px 16px ${color}66`,
  `0 0 90px 30px ${color}22`,
].join(', ');

const previewGlow = (color: string) => [
  `0 0 14px 4px ${color}BB`,
  `0 0 32px 10px ${color}55`,
  `0 0 60px 18px ${color}1E`,
].join(', ');

// ── Component ─────────────────────────────────────────────────────────────────
export const OverviewCanvas: React.FC = () => {
  const navigate = useNavigate();

  // Which far signal is in preview state (null = none)
  const [activeSignal, setActiveSignal] = React.useState<string | null>(null);

  const handleSignalTap = (label: string) => {
    setActiveSignal(prev => (prev === label ? null : label));
  };

  // Compute position of the currently active far signal (for SVG arc)
  const activeFar     = FAR_SCENARIOS.find(s => s.label === activeSignal) ?? null;
  const activeFarIdx  = activeFar ? FAR_SCENARIOS.indexOf(activeFar) : -1;
  const activeFarPos  = activeFar
    ? polar((activeFarIdx / FAR_SCENARIOS.length) * 360 + 18, FAR_R)
    : null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: '#000',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Title + orientation */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{ color: 'rgba(255,255,255,0.20)', fontSize: 11, letterSpacing: 1.2, fontWeight: 700 }}>
          AURA · СЦЕНАРИИ
        </p>
        <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 11, marginTop: 4, letterSpacing: 0.2 }}>
          твои жизненные миры
        </p>
      </div>

      {/* Bottom hint */}
      <motion.div
        animate={{ opacity: [0.0, 0.55, 0.0] }}
        transition={{ duration: 3.5, delay: 1.2, repeat: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: 44, left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, letterSpacing: 0.3 }}>
          нажми на мир чтобы войти
        </p>
      </motion.div>

      {/* v1 link */}
      <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Link
          to="/legacy"
          style={{ color: 'rgba(255,255,255,0.12)', fontSize: 10, letterSpacing: 0.5, textDecoration: 'none' }}
        >
          v1
        </Link>
      </div>

      {/* Full-screen backdrop — dismisses preview on tap outside */}
      <AnimatePresence>
        {activeSignal && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setActiveSignal(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 20 }}
          />
        )}
      </AnimatePresence>

      {/* Zero-size anchor at screen center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>

        {/* ── SVG: main world arcs + active signal arc ── */}
        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', zIndex: 10 }} width={0} height={0}>
          <defs>
            {/* Main world gradients */}
            {SCENARIOS.map(s => {
              const v = VISUAL[s.id];
              if (!v) return null;
              const r = v.r ?? (BASE_R + v.weight * 10);
              const { x, y } = polar(v.angleDeg, r);
              return (
                <linearGradient key={s.id} id={`ag-${s.id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={x} y2={y}>
                  <stop offset="0%"   stopColor={s.color} stopOpacity={v.featured ? '0.08' : '0.04'} />
                  <stop offset="52%"  stopColor={s.color} stopOpacity={v.featured ? '0.38' : '0.17'} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={v.featured ? '0.08' : '0.04'} />
                </linearGradient>
              );
            })}

            {/* Active signal arc gradient */}
            {activeFar && activeFarPos && (
              <linearGradient id="ag-preview" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={activeFarPos.x} y2={activeFarPos.y}>
                <stop offset="0%"   stopColor={activeFar.color} stopOpacity="0.06" />
                <stop offset="55%"  stopColor={activeFar.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={activeFar.color} stopOpacity="0.06" />
              </linearGradient>
            )}
          </defs>

          {/* Main world arcs */}
          <motion.g
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            {SCENARIOS.map(s => {
              const v = VISUAL[s.id];
              if (!v) return null;
              const size = v.featured ? FEATURED_SIZE : sizeFromWeight(v.weight);
              const r    = v.r ?? (BASE_R + v.weight * 10);
              const { x: ex, y: ey } = polar(v.angleDeg, r);
              const dist = Math.hypot(ex, ey);
              const nx = ex / dist, ny = ey / dist;
              const x1 = nx * (USER_SIZE / 2 + 5);
              const y1 = ny * (USER_SIZE / 2 + 5);
              const x2 = ex - nx * (size / 2 + 5);
              const y2 = ey - ny * (size / 2 + 5);
              const midX = (x1 + x2) / 2 + (-ny) * dist * 0.14;
              const midY = (y1 + y2) / 2 + (nx)  * dist * 0.14;
              return (
                <path
                  key={s.id}
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke={`url(#ag-${s.id})`}
                  strokeWidth={v.featured ? 2.2 : 0.9}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </motion.g>

          {/* Preview arc — appears when a far signal is activated */}
          <AnimatePresence>
            {activeFar && activeFarPos && (() => {
              const { x: ex, y: ey } = activeFarPos;
              const dist = Math.hypot(ex, ey);
              const nx = ex / dist, ny = ey / dist;
              const x1 = nx * (USER_SIZE / 2 + 4);
              const y1 = ny * (USER_SIZE / 2 + 4);
              const x2 = ex - nx * (PREVIEW_SIZE / 2 + 4);
              const y2 = ey - ny * (PREVIEW_SIZE / 2 + 4);
              const midX = (x1 + x2) / 2 + (-ny) * dist * 0.12;
              const midY = (y1 + y2) / 2 + (nx)  * dist * 0.12;
              return (
                <motion.path
                  key="preview-arc"
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke="url(#ag-preview)"
                  strokeWidth={1.5}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              );
            })()}
          </AnimatePresence>
        </svg>

        {/* ── Far / secondary worlds ── */}
        {FAR_SCENARIOS.map((s, i) => {
          const angle = (i / FAR_SCENARIOS.length) * 360 + 18;
          const { x, y } = polar(angle, FAR_R);
          const isInteractive = INTERACTIVE_SIGNALS.includes(s.label);
          const isActive      = activeSignal === s.label;

          return (
            <div
              key={s.label}
              style={{
                position: 'absolute',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                zIndex: isActive ? 30 : 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onClick={isInteractive ? (e) => { e.stopPropagation(); handleSignalTap(s.label); } : undefined}
            >
              <AnimatePresence mode="wait">
                {isActive ? (
                  /* ── Preview state ── */
                  <motion.div
                    key="preview"
                    initial={{ scale: 0.35, opacity: 0 }}
                    animate={{ scale: 1,    opacity: 1 }}
                    exit={{   scale: 0.35, opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                      width:  PREVIEW_SIZE,
                      height: PREVIEW_SIZE,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 38% 34%, ${s.color}55 0%, ${s.color}22 50%, ${s.color}08 100%)`,
                      border: `1.5px solid ${s.color}77`,
                      boxShadow: previewGlow(s.color),
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: 8, color: `${s.color}88`, marginTop: 3, lineHeight: 1 }}>
                      сигнал слабый
                    </p>
                  </motion.div>
                ) : (
                  /* ── Far signal state ── */
                  <motion.div
                    key="signal"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                      opacity: isInteractive ? [0.12, 0.30, 0.12] : [0.08, 0.20, 0.08],
                    }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={
                      isInteractive
                        ? { duration: 3.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }
                        : { duration: 5.5 + i * 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }
                    }
                    style={{
                      width:  26,
                      height: 26,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at center, ${s.color}${isInteractive ? '30' : '22'} 0%, transparent 70%)`,
                      boxShadow: `0 0 12px 4px ${s.color}${isInteractive ? '20' : '14'}`,
                      border: `1px solid ${s.color}${isInteractive ? '2A' : '18'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: isInteractive ? 'pointer' : 'default',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{
                      fontSize: 6.5,
                      color: `${s.color}${isInteractive ? '88' : '66'}`,
                      fontWeight: 500,
                      textAlign: 'center',
                      lineHeight: 1.2,
                      padding: '0 2px',
                    }}>
                      {s.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* ── Main world orbs ── */}
        {SCENARIOS.map((s, i) => {
          const v = VISUAL[s.id];
          if (!v) return null;
          const size     = v.featured ? FEATURED_SIZE : sizeFromWeight(v.weight);
          const r        = v.r ?? (BASE_R + v.weight * 10);
          const { x, y } = polar(v.angleDeg, r);
          const floatAmp = v.featured ? 5 : 2 + v.weight * 3;
          const floatDur = v.featured ? 5.5 : 4 + v.weight * 2;

          return (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                zIndex: 10,
              }}
            >
              {/* Pulsing ambient ring — featured only */}
              {v.featured && (
                <motion.div
                  animate={{ opacity: [0.10, 0.26, 0.10], scale: [1, 1.12, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    width: FEATURED_SIZE + 30, height: FEATURED_SIZE + 30,
                    borderRadius: '50%',
                    border: `1px solid ${s.color}44`,
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <motion.button
                onClick={() => navigate(`/scenarios/${s.id}`)}
                animate={{ y: [0, -floatAmp, 0] }}
                transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.85 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  width: size, height: size,
                  borderRadius: '50%',
                  background: v.featured
                    ? `radial-gradient(circle at 38% 34%, ${s.color}60 0%, ${s.color}26 48%, ${s.color}0A 100%)`
                    : `radial-gradient(circle at 38% 34%, ${s.color}3C 0%, ${s.color}12 55%, ${s.color}04 100%)`,
                  border: v.featured
                    ? `1.5px solid ${s.color}88`
                    : `1px solid ${s.color}38`,
                  boxShadow: v.featured ? featuredGlow(s.color) : glowFor(s.color, v.weight),
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                {v.featured ? (
                  <div style={{ textAlign: 'center', padding: '0 10px' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: 8.5, color: `${s.color}99`, marginTop: 4, lineHeight: 1.3 }}>
                      музыка · кино · книги
                    </p>
                  </div>
                ) : (
                  <span style={{
                    fontSize: Math.round(8.5 + v.weight * 2.5),
                    fontWeight: 600,
                    color: s.color,
                    textAlign: 'center',
                    lineHeight: 1.2,
                    padding: '0 6px',
                  }}>
                    {s.label}
                  </span>
                )}
              </motion.button>
            </div>
          );
        })}

        {/* ── Central user anchor ── */}
        <div style={{
          position: 'absolute', width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)',
          filter: 'blur(20px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 8,
        }} />

        <motion.div
          animate={{ opacity: [0.18, 0.38, 0.18], scale: [1, 1.05, 1] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: USER_SIZE + 22, height: USER_SIZE + 22,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 0 24px 6px rgba(255,255,255,0.04)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 8,
          }}
        />

        <div style={{
          position: 'absolute',
          width: USER_SIZE, height: USER_SIZE,
          borderRadius: '50%',
          background: '#111',
          border: '1.5px solid rgba(255,255,255,0.18)',
          boxShadow: '0 0 14px 4px rgba(255,255,255,0.06)',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden', zIndex: 9,
        }}>
          <img src={avatarImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
        </div>

      </div>
    </div>
  );
};
