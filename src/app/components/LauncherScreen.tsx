import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import avatarImg from '../../assets/avatar.jpg';


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
// TIMELINE SLIDER — scrollable ruler, fixed center line
// ═══════════════════════════════════════════════════════════════════════════

const GOLD = '#C9A227';
const STEP = 36;   // px between months on the ruler
const SUBS = 3;    // subtick count between months
const EXTRA = 8;   // phantom month slots on each side for visual fill

interface TimelineSliderProps {
  periods: typeof PERIODS;
  selectedIndex: number;
  onChange: (i: number) => void;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({ periods, selectedIndex, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // offset: ruler translation. -i*STEP puts month i under the center line.
  const [offset, setOffset] = useState(-(periods.length - 1) * STEP);
  const [isDragging, setIsDragging] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const MIN_OFFSET = -(periods.length - 1) * STEP;
  const nearestIndex = Math.max(0, Math.min(periods.length - 1, Math.round(-offset / STEP)));
  const snappedOffset = -nearestIndex * STEP;

  const onPointerDown = (e: React.PointerEvent) => {
    clearTimeout(hideTimer.current);
    containerRef.current?.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setShowCircle(true);
    startX.current = e.clientX;
    startOffset.current = offset;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    const next = Math.max(MIN_OFFSET, Math.min(0, startOffset.current + delta));
    setOffset(next);
    const idx = Math.max(0, Math.min(periods.length - 1, Math.round(-next / STEP)));
    if (idx !== selectedIndex) onChange(idx);
  };

  const onPointerUp = () => {
    setIsDragging(false);
    setOffset(snappedOffset);
    onChange(nearestIndex);
    hideTimer.current = setTimeout(() => setShowCircle(false), 700);
  };

  // Ticks only for real data range — no phantom months
  const ticks: { f: number; isMonth: boolean; isActive: boolean }[] = [];
  for (let i = 0; i < periods.length; i++) {
    ticks.push({ f: i, isMonth: true, isActive: i === nearestIndex });
    if (i < periods.length - 1) {
      for (let s = 1; s <= SUBS; s++) {
        ticks.push({ f: i + s / (SUBS + 1), isMonth: false, isActive: false });
      }
    }
  }

  const R = 26, circum = 2 * Math.PI * R;
  const progress = selectedIndex / (periods.length - 1);
  const arcLen = circum * progress;

  // Vertical layout (container = 110px):
  // Circle SVG top=8 → visual circle bottom at 8+62=70
  // Gold line: top=70, height=18 → bottom at 88
  // White dot: centered at 88 (= ruler top)
  // Ruler strip: bottom=0, height=22 → y=88..110
  const RULER_H = 22;
  const LINE_TOP = 70;
  const DOT_Y = 88; // = LINE_TOP + 18 = 110 - RULER_H

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height: 110, userSelect: 'none', touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Floating circle — appears on drag, disappears after release */}
      <AnimatePresence>
        {showCircle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 5 }}
          >
            {/* SVG 72px: circle visual spans y=10..62, so bottom at top+62=70 = LINE_TOP ✓ */}
            <svg width={72} height={72} style={{ overflow: 'visible' }}>
              <circle cx={36} cy={36} r={R} stroke="rgba(255,255,255,0.13)" strokeWidth={1.5} fill="none" />
              {progress > 0 && (
                <circle cx={36} cy={36} r={R}
                  stroke={GOLD} strokeWidth={1.5} fill="none"
                  strokeDasharray={`${arcLen} ${circum - arcLen}`}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                />
              )}
              <text x={36} y={33} textAnchor="middle" fontSize={12} fontWeight={600}
                fill="white" fontFamily="Inter,-apple-system,sans-serif">{periods[selectedIndex].short}</text>
              <text x={36} y={47} textAnchor="middle" fontSize={9}
                fill="rgba(255,255,255,0.45)" fontFamily="Inter,-apple-system,sans-serif">{periods[selectedIndex].year}</text>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed golden center line — connects circle bottom to white dot */}
      <div style={{
        position: 'absolute', left: '50%', top: LINE_TOP,
        width: 1.5, height: DOT_Y - LINE_TOP, backgroundColor: GOLD,
        transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 3,
      }} />
      {/* Fixed white dot at ruler top */}
      <div style={{
        position: 'absolute', left: '50%', top: DOT_Y,
        width: 9, height: 9, borderRadius: '50%', backgroundColor: 'white',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 4,
      }} />

      {/* Scrollable ruler — anchored at CSS 50% so it always aligns with gold line */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: RULER_H, overflow: 'hidden' }}>
        {/* Inner div starts at CSS 50% of container, then translated by offset */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        }}>
          {ticks.map((tick, i) => {
            const h = tick.isMonth ? (tick.isActive ? 20 : 12) : 7;
            const color = tick.isActive ? GOLD
              : tick.isMonth ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)';
            const x = tick.f * STEP; // relative to the 50% anchor
            return (
              <div key={i} style={{
                position: 'absolute', left: x, bottom: 0,
                width: tick.isMonth ? 1.5 : 1, height: h,
                backgroundColor: color,
                transform: 'translateX(-50%)', borderRadius: 1,
              }} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════

export const LauncherScreen = () => {
  const navigate = useNavigate();

  // State
  const [periodIndex, setPeriodIndex] = useState(PERIODS.length - 1); // Apr '25
  const period = PERIODS[periodIndex].id;
  const [config] = useState<LayoutConfig>(DEFAULT_CONFIG);

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

  // ── Canvas center for positioning ──────────────────────────────────────
  const cx = canvasSize.w / 2;
  const cy = canvasSize.h / 2;

  return (
    <div
      className="flex flex-col items-center overflow-x-hidden"
      style={{ backgroundColor: '#050508', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", height: '100dvh' }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col" style={{ height: '100%' }}>

        {/* ── TOP BAR — spacer ── */}
        <div className="h-16 flex-shrink-0" />

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
            {/* Avatar — tap to open Aura */}
            <div
              onClick={() => navigate('/app')}
              style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}
            >
              <img src={avatarImg} alt="Профиль" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Glowing ring — transparent band via radial-gradient + blur */}
            <div style={{
              position: 'absolute',
              width: 180, height: 180,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(
                circle,
                transparent 54%,
                rgba(255,255,255,0.7) 59%,
                rgba(255,255,255,0.4) 64%,
                transparent 68%
              )`,
              filter: 'blur(10px)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* ── TIMELINE SLIDER ── */}
        <TimelineSlider periods={PERIODS} selectedIndex={periodIndex} onChange={setPeriodIndex} />

        <div style={{ height: 16, flexShrink: 0 }} />

      </div>
    </div>
  );
};
