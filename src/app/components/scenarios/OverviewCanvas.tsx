import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { SCENARIOS, FAR_SCENARIOS } from './types';
import avatarImg from '../../../assets/avatar.jpg';

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

// ── Visual config ─────────────────────────────────────────────────────────────
// content is featured: closer orbit, largest size, strongest glow
// other worlds: reduced weight for clearer hierarchy

interface WorldVisual {
  weight:    number;
  angleDeg:  number;
  r?:        number;    // override orbit radius; default = BASE_R + weight * 10
  featured?: boolean;
}

const VISUAL: Record<string, WorldVisual> = {
  //            weight  angle   orbit   featured
  content:  { weight: 0.98, angleDeg: 335, r: 118, featured: true },
  music:    { weight: 0.68, angleDeg:  65                          },
  cinema:   { weight: 0.76, angleDeg: 155                          },
  shopping: { weight: 0.50, angleDeg: 220                          },
  travel:   { weight: 0.64, angleDeg: 278                          },
};

const BASE_R        = 148;
const USER_SIZE     = 56;
const FAR_R         = 224;
const FEATURED_SIZE = 108;

// Regular orb: 60–80px
const sizeFromWeight = (w: number) => Math.round(60 + w * 24);

// Regular world glow (toned down for contrast with featured)
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

// Featured world glow — noticeably stronger
const featuredGlow = (color: string) => [
  `0 0 22px 7px ${color}CC`,
  `0 0 50px 16px ${color}66`,
  `0 0 90px 30px ${color}22`,
].join(', ');

// ── Component ─────────────────────────────────────────────────────────────────

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
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, letterSpacing: 1.0, fontWeight: 600 }}>
          СЦЕНАРИИ
        </p>
      </div>

      {/* Zero-size anchor at screen center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>

        {/* ── SVG arcs ── */}
        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none' }} width={0} height={0}>
          <defs>
            {SCENARIOS.map(s => {
              const v = VISUAL[s.id];
              if (!v) return null;
              const r = v.r ?? (BASE_R + v.weight * 10);
              const { x, y } = polar(v.angleDeg, r);
              // Featured arc: higher opacity stops
              const s0 = v.featured ? '0.08' : '0.04';
              const s1 = v.featured ? '0.38' : '0.17';
              const s2 = v.featured ? '0.08' : '0.04';
              return (
                <linearGradient key={s.id} id={`ag-${s.id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={x} y2={y}>
                  <stop offset="0%"   stopColor={s.color} stopOpacity={s0} />
                  <stop offset="52%"  stopColor={s.color} stopOpacity={s1} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={s2} />
                </linearGradient>
              );
            })}
          </defs>

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
        </svg>

        {/* ── Far / secondary worlds — dimmer than before for contrast ── */}
        {FAR_SCENARIOS.map((s, i) => {
          const angle = (i / FAR_SCENARIOS.length) * 360 + 18;
          const { x, y } = polar(angle, FAR_R);
          return (
            <motion.div
              key={s.label}
              animate={{ opacity: [0.08, 0.20, 0.08] }}
              transition={{ duration: 5.5 + i * 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              style={{
                position: 'absolute',
                width: 26, height: 26,
                borderRadius: '50%',
                background: `radial-gradient(circle at center, ${s.color}22 0%, transparent 70%)`,
                boxShadow: `0 0 12px 4px ${s.color}14`,
                border: `1px solid ${s.color}18`,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 6.5, color: `${s.color}66`, fontWeight: 500, textAlign: 'center', lineHeight: 1.2, padding: '0 2px' }}>
                {s.label}
              </span>
            </motion.div>
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
                  // Featured: label + domain hint inside orb
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

        {/* Bloom */}
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

        {/* Ambient breathing ring */}
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
            pointerEvents: 'none',
          }}
        />

        {/* Core + avatar */}
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
          <img src={avatarImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
        </div>

      </div>
    </div>
  );
};
