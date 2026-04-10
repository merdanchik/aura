import React from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import avatarImg    from '../../../assets/avatar.jpg';
import nilsFrahmImg from '../../../assets/node-nils-frahm.jpg';
import istanbulImg  from '../../../assets/node-istanbul.jpg';
import runningImg   from '../../../assets/node-running.jpg';
import booksImg     from '../../../assets/node-books.jpg';
import { WorldWidgets } from './WorldWidgets';
import { FAR_SCENARIOS } from './types';

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

// ── Event orbs ────────────────────────────────────────────────────────────────

interface EventOrb {
  id:            string;
  label:         string;
  sub:           string;
  img:           string | null;
  color:         string;
  chatContextId: string;
  angleDeg:      number;
  weight:        number;
  featured?:     boolean;
}

const EVENTS: EventOrb[] = [
  {
    id: 'kind-of-blue', label: 'Kind of Blue', sub: 'Яндекс Музыка',
    img: null, color: '#BF5AF2', chatContextId: 'jazz',
    angleDeg: 335, weight: 0.88, featured: true,
  },
  {
    id: 'nils-frahm', label: 'Nils Frahm', sub: 'Яндекс Афиша',
    img: nilsFrahmImg, color: '#BF5AF2', chatContextId: 'nils-frahm',
    angleDeg: 52, weight: 0.58,
  },
  {
    id: 'the-bear', label: 'The Bear', sub: 'Кинопоиск',
    img: null, color: '#FF9F0A', chatContextId: 'severance',
    angleDeg: 140, weight: 0.65,
  },
  {
    id: 'tbilisi', label: 'Тбилиси', sub: 'Яндекс Путешествия',
    img: istanbulImg, color: '#00C7BE', chatContextId: 'istanbul',
    angleDeg: 210, weight: 0.64,
  },
  {
    id: 'air-max', label: 'Nike Air Max', sub: 'Яндекс Маркет',
    img: runningImg, color: '#FF6633', chatContextId: 'ramen',
    angleDeg: 272, weight: 0.52,
  },
  {
    id: 'karamazov', label: 'Карамазовы', sub: 'Яндекс Книги',
    img: booksImg, color: '#5E5CE6', chatContextId: 'books',
    angleDeg: 175, weight: 0.46,
  },
];

// ── Visual helpers ────────────────────────────────────────────────────────────

const BASE_R         = 148;
const USER_SIZE      = 56;
const FAR_R          = 224;
const FEATURED_SIZE  = 96;

const sizeFromWeight = (w: number) => Math.round(54 + w * 22);

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
  `0 0 20px 6px ${color}BB`,
  `0 0 46px 15px ${color}55`,
  `0 0 80px 28px ${color}1E`,
].join(', ');

// ── Component ─────────────────────────────────────────────────────────────────

export const OverviewCanvas: React.FC = () => {
  const navigate      = useNavigate();
  const [showWidgets, setShowWidgets] = React.useState(false);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflow: 'hidden',
    }}>

      {/* Title */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{ color: 'rgba(255,255,255,0.16)', fontSize: 11, letterSpacing: 1.2, fontWeight: 700 }}>
          СОБЫТИЯ
        </p>
        <p style={{ color: 'rgba(255,255,255,0.08)', fontSize: 10.5, marginTop: 4, letterSpacing: 0.2 }}>
          аватар → миры
        </p>
      </div>

      {/* Bottom hint — pulses 3 times */}
      <motion.div
        animate={{ opacity: [0.0, 0.45, 0.0] }}
        transition={{ duration: 3.5, delay: 1.2, repeat: 2, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: 44, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}
      >
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11.5, letterSpacing: 0.2 }}>
          нажми на событие — откроется чат
        </p>
      </motion.div>

      {/* v1 link */}
      <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Link to="/legacy" style={{ color: 'rgba(255,255,255,0.10)', fontSize: 10, letterSpacing: 0.5, textDecoration: 'none' }}>
          v1
        </Link>
      </div>

      {/* Zero-size anchor at screen center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>

        {/* ── SVG: arc connections from center to each event ── */}
        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', zIndex: 10 }} width={0} height={0}>
          <defs>
            {EVENTS.map(ev => {
              const r = BASE_R + ev.weight * 10;
              const { x, y } = polar(ev.angleDeg, r);
              return (
                <linearGradient key={ev.id} id={`ag-${ev.id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={x} y2={y}>
                  <stop offset="0%"   stopColor={ev.color} stopOpacity={ev.featured ? '0.08' : '0.04'} />
                  <stop offset="52%"  stopColor={ev.color} stopOpacity={ev.featured ? '0.36' : '0.16'} />
                  <stop offset="100%" stopColor={ev.color} stopOpacity={ev.featured ? '0.08' : '0.04'} />
                </linearGradient>
              );
            })}
          </defs>

          <motion.g
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            {EVENTS.map(ev => {
              const size = ev.featured ? FEATURED_SIZE : sizeFromWeight(ev.weight);
              const r    = BASE_R + ev.weight * 10;
              const { x: ex, y: ey } = polar(ev.angleDeg, r);
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
                  key={ev.id}
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke={`url(#ag-${ev.id})`}
                  strokeWidth={ev.featured ? 2.0 : 0.9}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </motion.g>
        </svg>

        {/* ── Far ambient signals (decoration only) ── */}
        {FAR_SCENARIOS.map((s, i) => {
          const angle = (i / FAR_SCENARIOS.length) * 360 + 18;
          const { x, y } = polar(angle, FAR_R);
          return (
            <motion.div
              key={s.label}
              animate={{ opacity: [0.07, 0.18, 0.07] }}
              transition={{ duration: 5.5 + i * 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              style={{
                position: 'absolute',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: 22, height: 22, borderRadius: '50%',
                background: `radial-gradient(circle at center, ${s.color}22 0%, transparent 70%)`,
                boxShadow: `0 0 10px 3px ${s.color}12`,
                border: `1px solid ${s.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: 5.5, color: `${s.color}55`, fontWeight: 500 }}>{s.label}</span>
            </motion.div>
          );
        })}

        {/* ── Event orbs ── */}
        {EVENTS.map((ev, i) => {
          const size      = ev.featured ? FEATURED_SIZE : sizeFromWeight(ev.weight);
          const r         = BASE_R + ev.weight * 10;
          const { x, y }  = polar(ev.angleDeg, r);
          const floatAmp  = ev.featured ? 5 : 2 + ev.weight * 3;
          const floatDur  = ev.featured ? 5.5 : 4 + ev.weight * 2;
          const labelW    = Math.max(size + 12, 80);

          return (
            <div
              key={ev.id}
              style={{
                position: 'absolute',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                zIndex: 10,
              }}
            >
              {/* Pulsing ring for featured */}
              {ev.featured && (
                <motion.div
                  animate={{ opacity: [0.10, 0.24, 0.10], scale: [1, 1.11, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    width: FEATURED_SIZE + 28, height: FEATURED_SIZE + 28,
                    borderRadius: '50%', border: `1px solid ${ev.color}44`,
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <motion.button
                onClick={() => navigate(`/app/chat/${ev.chatContextId}`)}
                animate={{ y: [0, -floatAmp, 0] }}
                transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.85 }}
                whileTap={{ scale: 0.88 }}
                style={{
                  width: size, height: size,
                  borderRadius: '50%',
                  border: ev.featured ? `1.5px solid ${ev.color}77` : `1px solid ${ev.color}40`,
                  boxShadow: ev.featured ? featuredGlow(ev.color) : glowFor(ev.color, ev.weight),
                  overflow: 'hidden',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                  position: 'relative',
                  background: ev.img
                    ? '#111'
                    : `radial-gradient(circle at 38% 34%, ${ev.color}55 0%, ${ev.color}22 48%, ${ev.color}08 100%)`,
                }}
              >
                {ev.img && (
                  <img
                    src={ev.img}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.70 }}
                  />
                )}
              </motion.button>

              {/* Labels below orb */}
              <div style={{
                marginTop: 8, textAlign: 'center',
                width: labelW, pointerEvents: 'none',
              }}>
                <p style={{
                  color: 'rgba(255,255,255,0.80)',
                  fontSize: ev.featured ? 11.5 : 10,
                  fontWeight: 600, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ev.label}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.30)',
                  fontSize: 9, marginTop: 2, lineHeight: 1.1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ev.sub}
                </p>
              </div>
            </div>
          );
        })}

        {/* ── Central glow ── */}
        <div style={{
          position: 'absolute', width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)',
          filter: 'blur(20px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 8,
        }} />

        {/* Pulsing avatar ring */}
        <motion.div
          animate={{ opacity: [0.18, 0.36, 0.18], scale: [1, 1.05, 1] }}
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

        {/* ── Avatar — tap opens WorldWidgets ── */}
        <motion.div
          onClick={() => setShowWidgets(true)}
          whileTap={{ scale: 0.92 }}
          style={{
            position: 'absolute',
            width: USER_SIZE, height: USER_SIZE,
            borderRadius: '50%',
            background: '#111',
            border: '1.5px solid rgba(255,255,255,0.20)',
            boxShadow: '0 0 14px 4px rgba(255,255,255,0.08)',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden', zIndex: 9,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <img src={avatarImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.78 }} />
        </motion.div>

      </div>

      {/* ── WorldWidgets overlay ── */}
      <AnimatePresence>
        {showWidgets && <WorldWidgets onClose={() => setShowWidgets(false)} />}
      </AnimatePresence>

    </div>
  );
};
