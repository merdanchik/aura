import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import avatarImg from '../../assets/avatar.jpg';
import { useAura } from '../context/AuraContext';
import { AuraRings } from './AuraRings';


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
const nodeSize = (w: number) => Math.round(12 + w * 20);

// Avatar half-size + clearance gap for collision
const AVATAR_R = 55;
const AVATAR_GAP = 16;

// Radial bands: non-overlapping so nodes from different bands don't start adjacent
const BANDS = {
  inner: [108, 148] as const,
  mid:   [155, 192] as const,
  outer: [196, 228] as const,
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

  // Distribute angles evenly around circle (then shuffle assignment + jitter)
  // This ensures no two nodes start in the same angular zone
  const n = visible.length;
  const angleSlot = (Math.PI * 2) / n;
  const slots = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {          // Fisher-Yates with seeded RNG
    const j = Math.floor(rng() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const angles: number[] = new Array(n);
  slots.forEach((originalIdx, slotIdx) => {
    angles[originalIdx] = slotIdx * angleSlot + (rng() - 0.5) * angleSlot * 0.55;
  });

  const placed: PlacedNode[] = visible.map(({ node, ew }, i) => {
    const band = ew > 0.75 ? BANDS.inner : ew > 0.45 ? BANDS.mid : BANDS.outer;
    const r = Math.min(band[0] + rng() * (band[1] - band[0]), maxR - nodeSize(node.weight));
    return {
      id: node.id,
      x: Math.cos(angles[i]) * r,
      y: Math.sin(angles[i]) * r,
      size: nodeSize(node.weight),
      effectiveWeight: ew,
      type: node.type,
    };
  });

  // Collision repulsion (heavy nodes move less)
  if (config.collisions) {
    for (let k = 0; k < 16; k++) {
      for (let i = 0; i < placed.length; i++) {
        for (let j = i + 1; j < placed.length; j++) {
          const a = placed[i], b = placed[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          const textExtra = (a.type === 'text' ? 40 : 0) + (b.type === 'text' ? 40 : 0);
          const minD = a.size + b.size + 28 + textExtra;
          if (d < minD) {
            const push = (minD - d) * 0.52;
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

  // Clamp — extra margin for text nodes (label wider than placed.size)
  const hw = cW / 2 - 24, hh = cH / 2 - 24;
  placed.forEach(n => {
    const extra = n.type === 'text' ? 48 : 0;
    n.x = Math.max(-(hw - n.size - extra), Math.min(hw - n.size - extra, n.x));
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

// Capsule → pure floating text: мысль в пространстве, не кнопка
const CapsuleNodeEl: React.FC<{
  node: InterestNode; placed: PlacedNode; intensity: number;
}> = ({ node, placed, intensity }) => {
  const dy    = (7 + intensity * 9) * (0.4 + nodeSeed(node.id, 0) * 0.8);
  const dx    = (3 + intensity * 4) * (nodeSeed(node.id, 13) > 0.5 ? 1 : -1) * (0.3 + nodeSeed(node.id, 14) * 0.7);
  const dur   = 5.5 + nodeSeed(node.id, 1) * 5;
  const delay = nodeSeed(node.id, 2) * 3.5;
  const fs    = Math.round(13 + placed.effectiveWeight * 8);
  const glow  = `0 0 ${Math.round(12 + placed.effectiveWeight * 14)}px ${node.color}70,
                 0 0 ${Math.round(28 + placed.effectiveWeight * 28)}px ${node.color}30`;

  return (
    <motion.div
      animate={{ y: [0, -dy, 0], x: [0, dx, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
    >
      <span style={{
        fontSize: fs,
        fontWeight: placed.effectiveWeight > 0.65 ? 600 : 500,
        color: node.color,
        letterSpacing: 0.4,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textShadow: glow,
      }}>
        {node.label}
      </span>
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

// Orb: media/symbol orb — glass sphere feel, layered glow, label absolutely below
const OrbNodeEl: React.FC<{
  node: InterestNode; placed: PlacedNode; intensity: number;
}> = ({ node, placed, intensity }) => {
  const sz      = placed.size * 2;
  const fs      = Math.round(sz * 0.50);
  const dy      = (5 + intensity * 8) * (0.4 + nodeSeed(node.id, 7) * 0.9);
  const breathe = 3 + nodeSeed(node.id, 10) * 2.5; // slow scale pulse period
  const dur     = 5.5 + nodeSeed(node.id, 8) * 5;
  const delay   = nodeSeed(node.id, 9) * 4;
  const labelFs = Math.round(9 + placed.effectiveWeight * 4);
  const glowInner = Math.round(8 + placed.effectiveWeight * 10);
  const glowMid   = Math.round(18 + placed.effectiveWeight * 20);
  const glowOuter = Math.round(32 + placed.effectiveWeight * 28);
  const glowAmbient = Math.round(glowOuter * 2.2);
  const glow = `0 0 ${glowInner}px  ${node.color}86,
                0 0 ${glowMid}px    ${node.color}46,
                0 0 ${glowOuter}px  ${node.color}1C,
                0 0 ${glowAmbient}px ${node.color}0A`;

  const dx = (3 + intensity * 5) * (0.3 + nodeSeed(node.id, 12) * 0.7);

  return (
    <motion.div
      animate={{ y: [0, -dy, 0], x: [0, dx * (nodeSeed(node.id, 13) > 0.5 ? 1 : -1), 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ position: 'relative', width: sz, height: sz }}
    >
      {/* Orb body — glow via box-shadow (no overflow:hidden — would clip shadow) */}
      <motion.div
        animate={{ opacity: [1, 0.72 + nodeSeed(node.id, 11) * 0.2, 1] }}
        transition={{ duration: breathe, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
        style={{
          width: sz, height: sz, borderRadius: '50%',
          background: `radial-gradient(circle at 36% 30%,
            ${node.color}3A 0%,
            ${node.color}18 45%,
            ${node.color}08 75%,
            transparent 100%)`,
          boxShadow: glow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: fs, lineHeight: 1, userSelect: 'none' }}>
          {node.emoji}
        </span>
      </motion.div>

      {/* Whisper label — anchored below orb, outside its box */}
      <span style={{
        position: 'absolute',
        top: sz + 5,
        left: '50%', transform: 'translateX(-50%)',
        fontSize: labelFs,
        fontWeight: 400,
        color: `${node.color}A0`,
        letterSpacing: 0.4,
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}>
        {node.label}
      </span>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: LayoutConfig = {
  seed: 42,
  density: 0.80,
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
          /* Outer div owns the CSS centering — motion.div only handles opacity/scale */
          <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
            >
              <svg width={72} height={72} style={{ overflow: 'visible', display: 'block' }}>
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
          </div>
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
// AURA HEADER — profile card, live from AuraContext
// ═══════════════════════════════════════════════════════════════════════════

const AuraHeader: React.FC = () => {
  const { globalKnowledgeScore, globalTrustScore, overallScore } = useAura();
  const navigate = useNavigate();
  const score = Math.round(overallScore);

  return (
    <div
      onClick={() => navigate('/app')}
      style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px 12px',
        cursor: 'pointer',
      }}
    >
      {/* Rings with score number in center */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <AuraRings knowledge={globalKnowledgeScore} trust={globalTrustScore} size={82} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: -0.5 }}>{score}</span>
        </div>
      </div>

      {/* Name + handle */}
      <div>
        <p style={{ fontSize: 26, fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: 5 }}>
          Саша. Д.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1 }}>
          @englishcanal
          <span style={{ margin: '0 5px', color: 'rgba(255,255,255,0.2)' }}>•</span>
          публичный профиль
        </p>
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
      className="flex flex-col items-center"
      style={{ backgroundColor: '#050508', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", height: '100dvh', overflow: 'hidden' }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col" style={{ height: '100%' }}>

        {/* ── TOP — profile card ── */}
        <AuraHeader />

        {/* ── CANVAS — interest map ── */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{ minHeight: 0 }}
        >
          {/* Stage lighting: warm center glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 46%, rgba(255,255,255,0.066) 0%, rgba(140,120,255,0.022) 38%, transparent 65%)',
          }} />
          {/* Vignette: darkens edges, focuses eye on center */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 50%, transparent 48%, rgba(3,3,6,0.35) 72%, rgba(3,3,6,0.70) 100%)',
          }} />

          {/* Ambient color hazes — large blurred clouds behind top nodes, dreamlike depth */}
          <AnimatePresence>
            {layout.slice(0, 5).map(placed => {
              const node = nodeMap[placed.id];
              if (!node) return null;
              const sz = 160 + placed.effectiveWeight * 120;
              return (
                <motion.div
                  key={`haze-${node.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: placed.effectiveWeight * 0.55, x: placed.x, y: placed.y }}
                  exit={{ opacity: 0 }}
                  transition={{
                    x: { type: 'spring', stiffness: 55, damping: 20 },
                    y: { type: 'spring', stiffness: 55, damping: 20 },
                    opacity: { duration: 1.6 },
                  }}
                  style={{
                    position: 'absolute',
                    left: cx - sz / 2, top: cy - sz / 2,
                    width: sz, height: sz,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${node.color}1A 0%, ${node.color}0A 50%, transparent 72%)`,
                    filter: 'blur(38px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />
              );
            })}
          </AnimatePresence>

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
                    opacity: 0.28 + placed.effectiveWeight * 0.72,
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
                  {node.type === 'text'   && <CapsuleNodeEl node={node} placed={placed} intensity={config.animIntensity} />}
                  {node.type === 'blob'   && <BlobNodeEl    node={node} placed={placed} blurPx={config.blurBlobs} intensity={config.animIntensity} />}
                  {node.type === 'symbol' && <OrbNodeEl     node={node} placed={placed} intensity={config.animIntensity} />}
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
            {/* Glow layer 1: tight halo via box-shadow — no banding artifact */}
            <div style={{
              position: 'absolute', width: 110, height: 110,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.10), 0 0 16px 5px rgba(255,255,255,0.22), 0 0 32px 8px rgba(180,160,255,0.18)',
              pointerEvents: 'none',
            }} />
            {/* Glow layer 2: soft mid bloom */}
            <div style={{
              position: 'absolute', width: 260, height: 260,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, transparent 32%, rgba(190,168,255,0.22) 50%, rgba(160,140,255,0.09) 65%, transparent 76%)',
              filter: 'blur(22px)',
              pointerEvents: 'none',
            }} />
            {/* Glow layer 3: outer ambient haze */}
            <div style={{
              position: 'absolute', width: 360, height: 360,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, transparent 30%, rgba(130,110,220,0.12) 50%, rgba(100,80,200,0.05) 65%, transparent 75%)',
              filter: 'blur(44px)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* ── TIMELINE SLIDER ── */}
        <TimelineSlider periods={PERIODS} selectedIndex={periodIndex} onChange={setPeriodIndex} />

        <div style={{ height: 68, flexShrink: 0 }} />

      </div>
    </div>
  );
};
