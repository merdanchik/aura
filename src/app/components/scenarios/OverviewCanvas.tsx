import React from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import avatarImg    from '../../../assets/avatar.jpg';
import nilsFrahmImg from '../../../assets/node-nils-frahm.jpg';
import istanbulImg  from '../../../assets/node-istanbul.jpg';
import runningImg   from '../../../assets/node-running.jpg';
import booksImg     from '../../../assets/node-books.jpg';
import { WorldWidgets } from './WorldWidgets';

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

// ── Event orbs ────────────────────────────────────────────────────────────────

interface EventOrb {
  id:            string;
  label:         string;
  sub:           string;
  freshness:     string;
  img:           string | null;
  color:         string;
  chatContextId: string;
  angleDeg:      number;
  weight:        number;
}

const EVENTS: EventOrb[] = [
  {
    id: 'kind-of-blue', label: 'Kind of Blue', sub: 'Яндекс Музыка',
    freshness: '3-й день подряд',
    img: null, color: '#BF5AF2', chatContextId: 'jazz',
    angleDeg: 335, weight: 0.88,
  },
  {
    id: 'nils-frahm', label: 'Nils Frahm', sub: 'Яндекс Афиша',
    freshness: 'концерт в марте',
    img: nilsFrahmImg, color: '#BF5AF2', chatContextId: 'nils-frahm',
    angleDeg: 52, weight: 0.58,
  },
  {
    id: 'the-bear', label: 'The Bear', sub: 'Кинопоиск',
    freshness: 'серия за серией',
    img: null, color: '#FF9F0A', chatContextId: 'severance',
    angleDeg: 140, weight: 0.65,
  },
  {
    id: 'tbilisi', label: 'Тбилиси', sub: 'Яндекс Путешествия',
    freshness: 'билеты на июнь',
    img: istanbulImg, color: '#00C7BE', chatContextId: 'istanbul',
    angleDeg: 210, weight: 0.64,
  },
  {
    id: 'air-max', label: 'Nike Air Max', sub: 'Яндекс Маркет',
    freshness: '4-й просмотр',
    img: runningImg, color: '#FF6633', chatContextId: 'ramen',
    angleDeg: 272, weight: 0.52,
  },
  {
    id: 'karamazov', label: 'Карамазовы', sub: 'Яндекс Книги',
    freshness: 'вернулся после паузы',
    img: booksImg, color: '#5E5CE6', chatContextId: 'books',
    angleDeg: 175, weight: 0.46,
  },
];

// ── Visual helpers ────────────────────────────────────────────────────────────

const PHOTO_SIZE = 104;
const BASE_R     = 162;

const sizeFromWeight = (w: number) => Math.round(58 + w * 24);
const rFromWeight    = (w: number) => BASE_R + w * 12;

const glowFor = (color: string, w: number): string => {
  if (w >= 0.75)
    return `0 0 10px 2px ${color}80, 0 0 22px 4px ${color}34, 0 0 38px 7px ${color}12`;
  if (w >= 0.50)
    return `0 0 7px 1px ${color}5A, 0 0 18px 3px ${color}1E`;
  return `0 0 5px 1px ${color}36, 0 0 12px 2px ${color}0E`;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const OverviewCanvas: React.FC = () => {
  const navigate = useNavigate();
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
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, letterSpacing: 1.1, fontWeight: 700 }}>
          ВНУТРЕННИЙ МИР
        </p>
      </div>

      {/* Bottom hint */}
      <motion.div
        animate={{ opacity: [0.0, 0.38, 0.0] }}
        transition={{ duration: 3.5, delay: 1.4, repeat: 2, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: 44, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}
      >
        <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 11.5 }}>
          нажми на событие — откроется чат
        </p>
      </motion.div>

      {/* v1 link */}
      <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Link to="/legacy" style={{ color: 'rgba(255,255,255,0.07)', fontSize: 10, textDecoration: 'none' }}>v1</Link>
      </div>

      {/* Zero-size anchor at screen center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>

        {/* ── SVG arc connections ── */}
        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', zIndex: 10 }} width={0} height={0}>
          <defs>
            {EVENTS.map(ev => {
              const r = rFromWeight(ev.weight);
              const { x, y } = polar(ev.angleDeg, r);
              return (
                <linearGradient key={ev.id} id={`ag-${ev.id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={x} y2={y}>
                  <stop offset="0%"   stopColor={ev.color} stopOpacity="0.05" />
                  <stop offset="50%"  stopColor={ev.color} stopOpacity="0.32" />
                  <stop offset="100%" stopColor={ev.color} stopOpacity="0.06" />
                </linearGradient>
              );
            })}
          </defs>

          <motion.g
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            {EVENTS.map(ev => {
              const size = sizeFromWeight(ev.weight);
              const r    = rFromWeight(ev.weight);
              const { x: ex, y: ey } = polar(ev.angleDeg, r);
              const dist = Math.hypot(ex, ey);
              const nx = ex / dist, ny = ey / dist;
              const x1 = nx * (PHOTO_SIZE / 2 + 6);
              const y1 = ny * (PHOTO_SIZE / 2 + 6);
              const x2 = ex - nx * (size / 2 + 5);
              const y2 = ey - ny * (size / 2 + 5);
              const midX = (x1 + x2) / 2 + (-ny) * dist * 0.13;
              const midY = (y1 + y2) / 2 + (nx)  * dist * 0.13;
              return (
                <path
                  key={ev.id}
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke={`url(#ag-${ev.id})`}
                  strokeWidth={ev.weight >= 0.75 ? 1.6 : 1.1}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </motion.g>
        </svg>

        {/* ── Event orbs ── */}
        {EVENTS.map((ev, i) => {
          const size     = sizeFromWeight(ev.weight);
          const r        = rFromWeight(ev.weight);
          const { x, y } = polar(ev.angleDeg, r);
          const floatAmp = 2 + ev.weight * 4;
          const floatDur = 4.2 + ev.weight * 2.5;
          const labelW   = Math.max(size + 18, 88);

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
              <motion.button
                onClick={() => navigate(`/app/chat/${ev.chatContextId}`)}
                animate={{ y: [0, -floatAmp, 0] }}
                transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 }}
                whileTap={{ scale: 0.87 }}
                style={{
                  width: size, height: size,
                  borderRadius: '50%',
                  border: `1px solid ${ev.color}44`,
                  boxShadow: glowFor(ev.color, ev.weight),
                  overflow: 'hidden',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                  background: ev.img
                    ? '#111'
                    : `radial-gradient(circle at 38% 34%, ${ev.color}50 0%, ${ev.color}20 50%, ${ev.color}07 100%)`,
                }}
              >
                {ev.img && (
                  <img
                    src={ev.img}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72 }}
                  />
                )}
              </motion.button>

              {/* Labels: title / service / freshness */}
              <div style={{
                marginTop: 8, textAlign: 'center',
                width: labelW, pointerEvents: 'none',
              }}>
                <p style={{
                  color: 'rgba(255,255,255,0.86)',
                  fontSize: ev.weight >= 0.75 ? 12.5 : 11.5,
                  fontWeight: 600, lineHeight: 1.25,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ev.label}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.36)',
                  fontSize: 10.5, marginTop: 2, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ev.sub}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.22)',
                  fontSize: 10, marginTop: 2, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  fontStyle: 'italic',
                }}>
                  {ev.freshness}
                </p>
              </div>
            </div>
          );
        })}

        {/* ── Avatar: 5-layer glow system ── */}

        {/* Layer 1: Bloom */}
        <motion.div
          animate={{ opacity: [0.42, 0.18, 0.42] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 360, height: 360,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(158,128,238,0.12) 0%, rgba(128,102,218,0.04) 58%, transparent 78%)',
            filter: 'blur(48px)',
            pointerEvents: 'none', zIndex: 7,
          }}
        />

        {/* Layer 2: Ambient corona */}
        <motion.div
          animate={{ opacity: [0.55, 0.22, 0.55] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
          style={{
            position: 'absolute',
            width: 222, height: 222,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, transparent 28%, rgba(158,138,248,0.14) 44%, rgba(138,118,235,0.07) 60%, transparent 76%)',
            filter: 'blur(16px)',
            pointerEvents: 'none', zIndex: 7,
          }}
        />

        {/* Layer 3: Core */}
        <motion.div
          animate={{ opacity: [0.90, 0.44, 0.90] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 134, height: 134,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(186,168,252,0.40) 0%, rgba(158,140,244,0.18) 52%, transparent 74%)',
            filter: 'blur(7px)',
            pointerEvents: 'none', zIndex: 7,
          }}
        />

        {/* Layer 4: Photo */}
        <motion.div
          onClick={() => setShowWidgets(true)}
          whileTap={{ scale: 0.93 }}
          style={{
            position: 'absolute',
            width: PHOTO_SIZE, height: PHOTO_SIZE,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: '#111',
            border: '1.5px solid rgba(255,255,255,0.20)',
            overflow: 'hidden',
            zIndex: 9,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <img src={avatarImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82 }} />
        </motion.div>

        {/* Layer 5: Ring */}
        <motion.div
          animate={{ opacity: [1, 0.60, 1] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{
            position: 'absolute',
            width: PHOTO_SIZE, height: PHOTO_SIZE,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            boxShadow: [
              'inset 0 0 0 1.5px rgba(255,255,255,0.18)',
              '0 0 0 1px rgba(178,158,242,0.14)',
              '0 0 10px 2px rgba(168,148,240,0.22)',
              '0 0 22px 5px rgba(148,128,228,0.09)',
            ].join(', '),
            pointerEvents: 'none', zIndex: 9,
          }}
        />

      </div>

      {/* ── WorldWidgets overlay ── */}
      <AnimatePresence>
        {showWidgets && <WorldWidgets onClose={() => setShowWidgets(false)} />}
      </AnimatePresence>

    </div>
  );
};
