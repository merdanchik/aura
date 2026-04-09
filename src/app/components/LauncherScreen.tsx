import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import avatarImg from '../../assets/avatar.jpg';
import launcherIcon from '../../assets/launcher-icon.svg';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — data model
// ═══════════════════════════════════════════════════════════════════════════

type NodeType = 'text' | 'blob' | 'symbol';

interface InterestNode {
  id: string;
  label: string;
  type: NodeType;
  weight: number;                          // 0–1 base weight → stable size
  color: string;
  emoji?: string;                          // symbol nodes
  gradient?: [string, string];             // blob nodes
  periods: string[];                       // '*' = always active
  periodWeight?: Record<string, number>;   // per-period weight override
}

interface LayoutConfig {
  seed: number;
  density: number;        // 0–1, fraction of nodes to show
  blurBlobs: number;      // blur px on blob nodes
  animIntensity: number;  // float animation amplitude 0–1
  collisions: boolean;
}

interface PlacedNode {
  id: string;
  x: number;              // px offset from canvas center
  y: number;
  size: number;           // half-size in px — STABLE (from baseWeight)
  effectiveWeight: number;// period-adjusted weight
  type: NodeType;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════════════════════

const PERIODS = [
  { id: '2024-07', short: 'Июл', year: "'24" },
  { id: '2024-08', short: 'Авг', year: "'24" },
  { id: '2024-09', short: 'Сен', year: "'24" },
  { id: '2024-10', short: 'Окт', year: "'24" },
  { id: '2024-11', short: 'Ноя', year: "'24" },
  { id: '2024-12', short: 'Дек', year: "'24" },
  { id: '2025-01', short: 'Янв', year: "'25" },
  { id: '2025-02', short: 'Фев', year: "'25" },
  { id: '2025-03', short: 'Мар', year: "'25" },
  { id: '2025-04', short: 'Апр', year: "'25" },
];

const NODES: InterestNode[] = [
  // ── Text nodes ──────────────────────────────────────────────────────────
  {
    id: 'jazz', label: 'Джаз', type: 'text', weight: 0.85, color: '#BF5AF2',
    periods: ['*'],
    periodWeight: { '2024-07': 0.32, '2024-08': 0.4, '2024-09': 0.58, '2024-10': 0.78, '2024-11': 0.85, '2024-12': 0.88, '2025-01': 0.88, '2025-02': 0.85, '2025-03': 0.9, '2025-04': 0.95 },
  },
  {
    id: 'tokyo', label: 'Токио', type: 'text', weight: 0.72, color: '#FF6633',
    periods: ['2024-09', '2024-10', '2024-11', '2024-12'],
    periodWeight: { '2024-09': 0.38, '2024-10': 0.72, '2024-11': 0.64, '2024-12': 0.42 },
  },
  {
    id: 'stoicism', label: 'Стоицизм', type: 'text', weight: 0.6, color: '#5E5CE6',
    periods: ['2025-01', '2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-01': 0.3, '2025-02': 0.46, '2025-03': 0.56, '2025-04': 0.6 },
  },
  {
    id: 'night-drives', label: 'Ночные поездки', type: 'text', weight: 0.52, color: '#34C759',
    periods: ['2024-11', '2024-12', '2025-01'],
    periodWeight: { '2024-11': 0.38, '2024-12': 0.52, '2025-01': 0.42 },
  },
  {
    id: 'architecture', label: 'Архитектура', type: 'text', weight: 0.5, color: '#0A84FF',
    periods: ['2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-02': 0.32, '2025-03': 0.44, '2025-04': 0.5 },
  },
  {
    id: 'cinema', label: 'Авторское кино', type: 'text', weight: 0.65, color: '#FF9F0A',
    periods: ['*'],
    periodWeight: { '2024-07': 0.65, '2024-08': 0.58, '2024-09': 0.6, '2024-10': 0.55, '2025-03': 0.5, '2025-04': 0.5 },
  },

  // ── Blob → converted to text/symbol ─────────────────────────────────────
  {
    id: 'music-blob', label: 'Музыка', type: 'symbol', weight: 0.95,
    color: '#FF375F', emoji: '🎵',
    periods: ['*'],
  },
  {
    id: 'travel-blob', label: 'Путешествия', type: 'text', weight: 0.72,
    color: '#FF9F0A',
    periods: ['2024-09', '2024-10', '2024-11', '2024-12'],
    periodWeight: { '2024-09': 0.4, '2024-10': 0.72, '2024-11': 0.65, '2024-12': 0.4 },
  },
  {
    id: 'tech-blob', label: 'Технологии', type: 'text', weight: 0.62,
    color: '#0A84FF',
    periods: ['2025-01', '2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-01': 0.32, '2025-02': 0.48, '2025-03': 0.58, '2025-04': 0.62 },
  },

  // ── Symbol nodes ─────────────────────────────────────────────────────────
  {
    id: 'basketball', label: 'Баскетбол', type: 'symbol', weight: 0.82, color: '#FF9500', emoji: '🏀',
    periods: ['*'],
  },
  {
    id: 'f1', label: 'F1', type: 'symbol', weight: 0.78, color: '#FF3B30', emoji: '🏎️',
    periods: ['*'],
    periodWeight: { '2024-07': 0.92, '2024-08': 0.88, '2024-09': 0.72, '2024-10': 0.6, '2024-11': 0.55, '2024-12': 0.52, '2025-01': 0.55, '2025-02': 0.62, '2025-03': 0.72, '2025-04': 0.82 },
  },
  {
    id: 'books', label: 'Книги', type: 'symbol', weight: 0.58, color: '#30D158', emoji: '📚',
    periods: ['2025-01', '2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-01': 0.38, '2025-02': 0.5, '2025-03': 0.55, '2025-04': 0.58 },
  },
  {
    id: 'coffee', label: 'Кофе', type: 'symbol', weight: 0.42, color: '#C4945A', emoji: '☕',
    periods: ['*'],
  },
  {
    id: 'sushi', label: 'Суши', type: 'symbol', weight: 0.48, color: '#FF6633', emoji: '🍣',
    periods: ['2024-08', '2024-09', '2024-10', '2024-11'],
    periodWeight: { '2024-08': 0.38, '2024-09': 0.48, '2024-10': 0.44, '2024-11': 0.34 },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT ENGINE — pure functions, easy to swap
// ═══════════════════════════════════════════════════════════════════════════

function seededRng(seed: number) {
  let s = seed;
  return (): number => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Stable node size based on base weight (never changes between periods)
const nodeSize = (w: number) => Math.round(18 + w * 34);

// Avatar half-size + clearance gap for collision
const AVATAR_R = 55;
const AVATAR_GAP = 16;

// Radial bands: [minPx, maxPx] from center — pushed out to avoid avatar overlap
const BANDS = {
  inner: [105, 145] as const,
  mid:   [138, 178] as const,
  outer: [168, 205] as const,
};

function computeLayout(
  nodes: InterestNode[],
  period: string,
  config: LayoutConfig,
  cW: number,
  cH: number,
): PlacedNode[] {
  const rng = seededRng(config.seed);

  // Filter active + compute effective weight
  const active = nodes
    .filter(n => n.periods.includes('*') || n.periods.includes(period))
    .map(n => ({ node: n, ew: n.periodWeight?.[period] ?? n.weight }))
    .sort((a, b) => b.ew - a.ew);

  const count = Math.max(4, Math.round(active.length * config.density));
  const visible = active.slice(0, count);

  const maxR = cW * 0.5;

  // Polar placement
  const placed: PlacedNode[] = visible.map(({ node, ew }) => {
    const band = ew > 0.75 ? BANDS.inner : ew > 0.45 ? BANDS.mid : BANDS.outer;
    const r = Math.min(band[0] + rng() * (band[1] - band[0]), maxR - nodeSize(node.weight));
    const angle = rng() * Math.PI * 2;
    return {
      id: node.id,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: nodeSize(node.weight),
      effectiveWeight: ew,
      type: node.type,
    };
  });

  // Collision repulsion (heavy nodes move less)
  if (config.collisions) {
    for (let k = 0; k < 7; k++) {
      for (let i = 0; i < placed.length; i++) {
        for (let j = i + 1; j < placed.length; j++) {
          const a = placed[i], b = placed[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          const minD = a.size + b.size + 12;
          if (d < minD) {
            const push = (minD - d) * 0.38;
            const nx = dx / d, ny = dy / d;
            const tot = a.effectiveWeight + b.effectiveWeight || 1;
            placed[i].x -= nx * push * (b.effectiveWeight / tot);
            placed[i].y -= ny * push * (b.effectiveWeight / tot);
            placed[j].x += nx * push * (a.effectiveWeight / tot);
            placed[j].y += ny * push * (a.effectiveWeight / tot);
          }
        }
      }
    }
  }

  // Push nodes away from avatar (center = 0,0)
  placed.forEach(n => {
    const d = Math.hypot(n.x, n.y) || 0.01;
    const minD = AVATAR_R + n.size + AVATAR_GAP;
    if (d < minD) {
      n.x = (n.x / d) * minD;
      n.y = (n.y / d) * minD;
    }
  });

  // Clamp to safe canvas area
  const hw = cW / 2 - 18, hh = cH / 2 - 18;
  placed.forEach(n => {
    n.x = Math.max(-(hw - n.size), Math.min(hw - n.size, n.x));
    n.y = Math.max(-(hh - n.size), Math.min(hh - n.size, n.y));
  });

  return placed;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

// Deterministic pseudo-random from node id — stable float params
function nodeSeed(id: string, offset = 0): number {
  let h = offset * 2654435761;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 2246822519);
  h ^= h >>> 16;
  return (Math.abs(h) & 0x7fffffff) / 0x7fffffff;
}

// ═══════════════════════════════════════════════════════════════════════════
// NODE RENDERERS — render + motion layer, each type isolated
// ═══════════════════════════════════════════════════════════════════════════

const TextNodeEl: React.FC<{
  node: InterestNode; placed: PlacedNode; intensity: number;
}> = ({ node, placed, intensity }) => {
  const dy    = (8 + intensity * 11) * (0.5 + nodeSeed(node.id, 0) * 0.8);
  const dur   = 4.2 + nodeSeed(node.id, 1) * 4.5;
  const delay = nodeSeed(node.id, 2) * 3;
  const fs    = Math.round(10 + placed.effectiveWeight * 6);
  const glow  = Math.round(4 + placed.effectiveWeight * 12);

  return (
    <motion.div
      animate={{ y: [0, -dy, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
    >
      <div style={{
        paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
        borderRadius: 20,
        backgroundColor: `${node.color}16`,
        border: `1px solid ${node.color}48`,
        boxShadow: `0 0 ${glow}px ${node.color}38`,
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(4px)',
      }}>
        <span style={{ fontSize: fs, fontWeight: placed.effectiveWeight > 0.7 ? 600 : 500, color: node.color, letterSpacing: 0.3 }}>
          {node.label}
        </span>
      </div>
    </motion.div>
  );
};

// Border-radius keyframe sequences for blob morphing
const BLOB_SEQ = [
  ['50% 40% 60% 50% / 45% 52% 48% 55%', '60% 50% 42% 58% / 55% 44% 56% 46%', '44% 58% 52% 46% / 48% 58% 44% 52%'],
  ['55% 45% 50% 60% / 52% 48% 55% 45%', '42% 60% 58% 40% / 46% 56% 44% 54%', '58% 44% 46% 56% / 55% 42% 58% 46%'],
];

const BlobNodeEl: React.FC<{
  node: InterestNode; placed: PlacedNode; blurPx: number; intensity: number;
}> = ({ node, placed, blurPx, intensity }) => {
  const seq = BLOB_SEQ[Math.abs(node.id.charCodeAt(0) + node.id.charCodeAt(1 % node.id.length)) % BLOB_SEQ.length];
  const morphDur = 3 + (1 - intensity) * 4.5;
  const dx  = (5 + intensity * 9) * (0.5 + nodeSeed(node.id, 3) * 0.9);
  const dy  = (7 + intensity * 12) * (0.5 + nodeSeed(node.id, 4) * 0.9);
  const dur = 5.5 + nodeSeed(node.id, 5) * 5;
  const del = nodeSeed(node.id, 6) * 4;
  const sz  = placed.size * 2;
  const [g1, g2] = node.gradient ?? [node.color, node.color];

  return (
    <motion.div
      animate={{ x: [0, dx, 0, -dx * 0.6, 0], y: [0, -dy, 0, dy * 0.7, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: del }}
      style={{ width: sz, height: sz }}
    >
      <motion.div
        animate={{ borderRadius: [...seq, seq[0]] }}
        transition={{ duration: morphDur, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: sz, height: sz,
          background: `radial-gradient(ellipse at 38% 38%, ${g1} 0%, ${g2} 100%)`,
          opacity: 0.55 + placed.effectiveWeight * 0.35,
          filter: `blur(${blurPx}px)`,
        }}
      />
    </motion.div>
  );
};

const SymbolNodeEl: React.FC<{
  node: InterestNode; placed: PlacedNode; intensity: number;
}> = ({ node, placed, intensity }) => {
  const sz    = placed.size * 2;
  const fs    = Math.round(sz * 0.46);
  const dy    = (6 + intensity * 9) * (0.5 + nodeSeed(node.id, 7) * 0.8);
  const dur   = 4.8 + nodeSeed(node.id, 8) * 4.5;
  const delay = nodeSeed(node.id, 9) * 3.5;
  const glow  = Math.round(5 + placed.effectiveWeight * 11);

  return (
    <motion.div
      animate={{ y: [0, -dy, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        width: sz, height: sz, borderRadius: '50%',
        backgroundColor: `${node.color}16`,
        border: `1.5px solid ${node.color}3A`,
        boxShadow: `0 0 ${glow}px ${node.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: fs, lineHeight: 1, userSelect: 'none' }}>{node.emoji}</span>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: LayoutConfig = {
  seed: 42,
  density: 1.0,
  blurBlobs: 7,
  animIntensity: 0.7,
  collisions: true,
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════

export const LauncherScreen = () => {
  const navigate = useNavigate();

  // State
  const [period, setPeriod] = useState('2025-04');
  const [config, setConfig] = useState<LayoutConfig>(DEFAULT_CONFIG);
  const [showDebug, setShowDebug] = useState(false);

  // Canvas size tracking
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 360, h: 520 });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setCanvasSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Layout computed as pure function — changes on period/config/canvas
  const layout = useMemo(
    () => computeLayout(NODES, period, config, canvasSize.w, canvasSize.h),
    [period, config, canvasSize],
  );

  const nodeMap = useMemo(() => Object.fromEntries(NODES.map(n => [n.id, n])), []);

  // Timeline scroll to present on mount
  const timelineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    timelineRef.current?.scrollTo({ left: 9999, behavior: 'instant' });
  }, []);

  const updateConfig = (patch: Partial<LayoutConfig>) =>
    setConfig(c => ({ ...c, ...patch }));

  // ── Canvas center for positioning ──────────────────────────────────────
  const cx = canvasSize.w / 2;
  const cy = canvasSize.h / 2;

  return (
    <div
      className="min-h-screen flex flex-col items-center overflow-x-hidden"
      style={{ backgroundColor: '#050508', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col" style={{ minHeight: '100vh' }}>

        {/* ── TOP BAR — Aura button. DO NOT TOUCH. ── */}
        <div className="h-16 flex items-end pb-2 px-4 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.88, opacity: 0.7 }}
            transition={{ duration: 0.12 }}
            onClick={() => navigate('/app')}
            className="ml-auto active:opacity-70"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={launcherIcon} alt="Аура" style={{ width: 45, height: 45, objectFit: 'contain' }} />
          </motion.button>
        </div>

        {/* ── CANVAS — interest map ── */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{ minHeight: 0 }}
        >
          {/* Stage lighting: soft radial glow at center */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 48%, rgba(255,255,255,0.032) 0%, transparent 62%)',
          }} />

          {/* Interest nodes */}
          <AnimatePresence>
            {layout.map(placed => {
              const node = nodeMap[placed.id];
              if (!node) return null;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.25, x: 0, y: 0 }}
                  animate={{
                    opacity: 0.55 + placed.effectiveWeight * 0.45,
                    scale: 0.82 + placed.effectiveWeight * 0.22,
                    x: placed.x,
                    y: placed.y,
                  }}
                  exit={{ opacity: 0, scale: 0.2 }}
                  transition={{
                    x:       { type: 'spring', stiffness: 75, damping: 17 },
                    y:       { type: 'spring', stiffness: 75, damping: 17 },
                    opacity: { duration: 0.55 },
                    scale:   { type: 'spring', stiffness: 130, damping: 22 },
                  }}
                  style={{
                    position: 'absolute',
                    left: cx - placed.size,
                    top:  cy - placed.size,
                    width:  placed.size * 2,
                    height: placed.size * 2,
                    zIndex: Math.round(placed.effectiveWeight * 10),
                    pointerEvents: 'none',
                  }}
                >
                  {node.type === 'text'   && <TextNodeEl   node={node} placed={placed} intensity={config.animIntensity} />}
                  {node.type === 'blob'   && <BlobNodeEl   node={node} placed={placed} blurPx={config.blurBlobs} intensity={config.animIntensity} />}
                  {node.type === 'symbol' && <SymbolNodeEl node={node} placed={placed} intensity={config.animIntensity} />}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Central user node */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}>
            {/* Soft ambient ring */}
            <div style={{
              position: 'absolute', inset: -10, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <img
              src={avatarImg}
              alt="Профиль"
              style={{
                width: 150, height: 150,
                objectFit: 'cover',
                borderRadius: '50%',
                maskImage: 'radial-gradient(circle, black 52%, rgba(0,0,0,0.6) 65%, transparent 78%)',
                WebkitMaskImage: 'radial-gradient(circle, black 52%, rgba(0,0,0,0.6) 65%, transparent 78%)',
              }}
            />
          </div>
        </div>

        {/* ── TIMELINE BAR ── */}
        <div style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            ref={timelineRef}
            style={{ overflowX: 'auto', display: 'flex', padding: '10px 12px 4px', gap: 2, scrollbarWidth: 'none' }}
          >
            {PERIODS.map(p => {
              const active = p.id === period;
              return (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  style={{
                    flexShrink: 0, padding: '6px 11px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    backgroundColor: active ? 'rgba(191,90,242,0.18)' : 'transparent',
                    transition: 'background-color 0.18s',
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#BF5AF2' : 'rgba(255,255,255,0.35)', lineHeight: 1.2, margin: 0 }}>
                    {p.short}
                  </p>
                  <p style={{ fontSize: 9, color: active ? 'rgba(191,90,242,0.7)' : 'rgba(255,255,255,0.2)', margin: 0, marginTop: 1 }}>
                    {p.year}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Debug toggle row */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px 16px 10px' }}>
            <button
              onClick={() => setShowDebug(v => !v)}
              style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: 0.5 }}
            >
              {showDebug ? '▲ DEBUG' : '▼ DEBUG'}
            </button>
          </div>

          {/* Debug panel */}
          <AnimatePresence>
            {showDebug && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px 14px' }}
              >
                {/* Numeric sliders */}
                {([
                  { key: 'seed'          as const, label: 'Seed',    min: 1,   max: 999, step: 1    },
                  { key: 'density'       as const, label: 'Density', min: 0.3, max: 1,   step: 0.05 },
                  { key: 'blurBlobs'     as const, label: 'Blur',    min: 0,   max: 22,  step: 1    },
                  { key: 'animIntensity' as const, label: 'Anim',    min: 0,   max: 1,   step: 0.05 },
                ]).map(({ key, label, min, max, step }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 46, flexShrink: 0 }}>{label}</span>
                    <input
                      type="range" min={min} max={max} step={step}
                      value={config[key] as number}
                      onChange={e => updateConfig({ [key]: key === 'seed' || key === 'blurBlobs' ? parseInt(e.target.value) : parseFloat(e.target.value) })}
                      style={{ flex: 1, accentColor: '#BF5AF2', height: 2 }}
                    />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 30, textAlign: 'right', flexShrink: 0 }}>
                      {(config[key] as number).toFixed(key === 'seed' || key === 'blurBlobs' ? 0 : 2)}
                    </span>
                  </div>
                ))}
                {/* Collision toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 46, flexShrink: 0 }}>Collide</span>
                  <button
                    onClick={() => updateConfig({ collisions: !config.collisions })}
                    style={{
                      fontSize: 11, padding: '3px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.14)',
                      backgroundColor: config.collisions ? 'rgba(191,90,242,0.18)' : 'transparent',
                      color: config.collisions ? '#BF5AF2' : 'rgba(255,255,255,0.35)',
                      cursor: 'pointer',
                    }}
                  >
                    {config.collisions ? 'ON' : 'OFF'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
