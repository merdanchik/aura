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
  size:          number;
}

const EVENTS: EventOrb[] = [
  {
    id: 'kind-of-blue', label: 'Kind of Blue', sub: 'Яндекс Музыка',
    freshness: '3-й день подряд',
    img: null, color: '#BF5AF2', chatContextId: 'jazz',
    angleDeg: 335, size: 76,
  },
  {
    id: 'nils-frahm', label: 'Nils Frahm', sub: 'Яндекс Афиша',
    freshness: 'концерт в марте',
    img: nilsFrahmImg, color: '#BF5AF2', chatContextId: 'nils-frahm',
    angleDeg: 50, size: 58,
  },
  {
    id: 'the-bear', label: 'The Bear', sub: 'Кинопоиск',
    freshness: 'серия за серией',
    img: null, color: '#FF9F0A', chatContextId: 'severance',
    angleDeg: 138, size: 62,
  },
  {
    id: 'tbilisi', label: 'Тбилиси', sub: 'Яндекс Путешествия',
    freshness: 'билеты на июнь',
    img: istanbulImg, color: '#00C7BE', chatContextId: 'istanbul',
    angleDeg: 208, size: 62,
  },
  {
    id: 'air-max', label: 'Nike Air Max', sub: 'Яндекс Маркет',
    freshness: '4-й просмотр за неделю',
    img: runningImg, color: '#FF6633', chatContextId: 'ramen',
    angleDeg: 270, size: 56,
  },
  {
    id: 'karamazov', label: 'Карамазовы', sub: 'Яндекс Книги',
    freshness: 'вернулся после паузы',
    img: booksImg, color: '#5E5CE6', chatContextId: 'books',
    angleDeg: 174, size: 54,
  },
];

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_R    = 144;
const USER_SIZE = 56;

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
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, letterSpacing: 1.1, fontWeight: 700 }}>
          ВНУТРЕННИЙ МИР
        </p>
        <p style={{ color: 'rgba(255,255,255,0.09)', fontSize: 10, marginTop: 4 }}>
          аватар → миры · событие → чат
        </p>
      </div>

      {/* Bottom hint */}
      <motion.div
        animate={{ opacity: [0.0, 0.4, 0.0] }}
        transition={{ duration: 3.5, delay: 1.2, repeat: 2, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: 44, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}
      >
        <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11 }}>
          нажми на событие — откроется чат
        </p>
      </motion.div>

      {/* v1 link */}
      <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Link to="/legacy" style={{ color: 'rgba(255,255,255,0.08)', fontSize: 10, textDecoration: 'none' }}>v1</Link>
      </div>

      {/* Zero-size anchor at screen center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>

        {/* ── SVG arc connections ── */}
        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', zIndex: 10 }} width={0} height={0}>
          <defs>
            {EVENTS.map(ev => {
              const r = BASE_R + (ev.size / 76) * 10;
              const { x, y } = polar(ev.angleDeg, r);
              return (
                <linearGradient key={ev.id} id={`ag-${ev.id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={x} y2={y}>
                  <stop offset="0%"   stopColor={ev.color} stopOpacity="0.06" />
                  <stop offset="50%"  stopColor={ev.color} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={ev.color} stopOpacity="0.06" />
                </linearGradient>
              );
            })}
          </defs>

          <g>
            {EVENTS.map(ev => {
              const r = BASE_R + (ev.size / 76) * 10;
              const { x: ex, y: ey } = polar(ev.angleDeg, r);
              const dist = Math.hypot(ex, ey);
              const nx = ex / dist, ny = ey / dist;
              const x1 = nx * (USER_SIZE / 2 + 4);
              const y1 = ny * (USER_SIZE / 2 + 4);
              const x2 = ex - nx * (ev.size / 2 + 4);
              const y2 = ey - ny * (ev.size / 2 + 4);
              const midX = (x1 + x2) / 2 + (-ny) * dist * 0.12;
              const midY = (y1 + y2) / 2 + (nx)  * dist * 0.12;
              return (
                <path
                  key={ev.id}
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke={`url(#ag-${ev.id})`}
                  strokeWidth={1.2}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        </svg>

        {/* ── Event orbs ── */}
        {EVENTS.map((ev, i) => {
          const r         = BASE_R + (ev.size / 76) * 10;
          const { x, y }  = polar(ev.angleDeg, r);
          const floatAmp  = 3 + i * 0.4;
          const floatDur  = 4.5 + i * 0.7;
          const labelW    = Math.max(ev.size + 16, 82);

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
                whileTap={{ scale: 0.88 }}
                style={{
                  width: ev.size, height: ev.size,
                  borderRadius: '50%',
                  border: `1px solid ${ev.color}44`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.45), 0 0 0 1px ${ev.color}18`,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                  background: ev.img
                    ? '#111'
                    : `radial-gradient(circle at 38% 34%, ${ev.color}44 0%, ${ev.color}18 50%, ${ev.color}06 100%)`,
                }}
              >
                {ev.img && (
                  <img
                    src={ev.img}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                  />
                )}
              </motion.button>

              {/* Labels: title → sub → freshness */}
              <div style={{
                marginTop: 7, textAlign: 'center',
                width: labelW, pointerEvents: 'none',
              }}>
                <p style={{
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: ev.size >= 70 ? 11 : 10,
                  fontWeight: 600, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ev.label}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.30)',
                  fontSize: 9, marginTop: 1.5, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ev.sub}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.20)',
                  fontSize: 9, marginTop: 1.5, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  fontStyle: 'italic',
                }}>
                  {ev.freshness}
                </p>
              </div>
            </div>
          );
        })}

        {/* ── Avatar — tap opens WorldWidgets ── */}
        <div
          style={{
            position: 'absolute',
            width: USER_SIZE + 18, height: USER_SIZE + 18,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 8,
          }}
        />

        <motion.div
          onClick={() => setShowWidgets(true)}
          whileTap={{ scale: 0.92 }}
          style={{
            position: 'absolute',
            width: USER_SIZE, height: USER_SIZE,
            borderRadius: '50%',
            background: '#111',
            border: '1.5px solid rgba(255,255,255,0.22)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden', zIndex: 9,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <img src={avatarImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.80 }} />
        </motion.div>

      </div>

      {/* ── WorldWidgets overlay ── */}
      <AnimatePresence>
        {showWidgets && <WorldWidgets onClose={() => setShowWidgets(false)} />}
      </AnimatePresence>

    </div>
  );
};
