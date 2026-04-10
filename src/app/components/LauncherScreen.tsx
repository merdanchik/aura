import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import avatarImg from '../../assets/avatar.jpg';
import { useAura } from '../context/AuraContext';
import { AuraRings } from './AuraRings';

// Node images
import imgRadiohead from '../../assets/node-radiohead.jpg';
import imgJokic     from '../../assets/node-jokic.jpg';
import imgLeclerc   from '../../assets/node-leclerc.jpg';
import imgBooks     from '../../assets/node-books.jpg';
import imgCoffee    from '../../assets/node-coffee.jpg';
import imgSushi     from '../../assets/node-sushi.jpg';
import imgWimbledon from '../../assets/node-wimbledon.jpg';
import imgRamen     from '../../assets/node-ramen.jpg';
import imgRunning   from '../../assets/node-running.jpg';
import imgEuro      from '../../assets/node-euro.jpg';
import imgNickCave  from '../../assets/node-nick-cave.jpg';
import imgRome      from '../../assets/node-rome.jpg';
import imgIstanbul  from '../../assets/node-istanbul.jpg';
import imgNilsFrahm from '../../assets/node-nils-frahm.jpg';
import imgAusOpen   from '../../assets/node-aus-open.jpg';


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
  emoji?: string;                          // symbol nodes fallback
  image?: string;                          // symbol nodes — photo instead of emoji
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
// Module-level var: persists across SPA navigation, resets on full page reload
let _sessionPeriodIndex: number | null = null;

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
    // Album discovered gradually → now obsession
    id: 'jazz', label: 'Kind of Blue', type: 'text', weight: 0.85, color: '#BF5AF2',
    periods: ['*'],
    periodWeight: { '2024-07': 0.32, '2024-08': 0.4, '2024-09': 0.58, '2024-10': 0.78, '2024-11': 0.85, '2024-12': 0.88, '2025-01': 0.88, '2025-02': 0.85, '2025-03': 0.9, '2025-04': 0.95 },
  },
  {
    // Trip to Tokyo, peak October
    id: 'tokyo', label: 'Shinjuku', type: 'text', weight: 0.72, color: '#FF6633',
    periods: ['2024-09', '2024-10', '2024-11', '2024-12'],
    periodWeight: { '2024-09': 0.38, '2024-10': 0.72, '2024-11': 0.64, '2024-12': 0.42 },
  },
  {
    // Marcus Aurelius Meditations — new year reading
    id: 'stoicism', label: 'Медитации', type: 'text', weight: 0.6, color: '#5E5CE6',
    periods: ['2025-01', '2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-01': 0.3, '2025-02': 0.46, '2025-03': 0.56, '2025-04': 0.6 },
  },
  {
    // Specific memory: late-night drives
    id: 'night-drives', label: 'МКАД в 3:00', type: 'text', weight: 0.52, color: '#34C759',
    periods: ['2024-11', '2024-12', '2025-01'],
    periodWeight: { '2024-11': 0.38, '2024-12': 0.52, '2025-01': 0.42 },
  },
  {
    // Melnikov — Russian constructivist architect obsession
    id: 'architecture', label: 'Мельников', type: 'text', weight: 0.5, color: '#0A84FF',
    periods: ['2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-02': 0.32, '2025-03': 0.44, '2025-04': 0.5 },
  },
  {
    // Tarkovsky's Mirror — specific film
    id: 'cinema', label: 'Зеркало', type: 'text', weight: 0.65, color: '#FF9F0A',
    periods: ['*'],
    periodWeight: { '2024-07': 0.65, '2024-08': 0.58, '2024-09': 0.6, '2024-10': 0.55, '2025-03': 0.5, '2025-04': 0.5 },
  },

  // ── Symbol nodes ─────────────────────────────────────────────────────────
  {
    // Specific artist — not just "music"
    id: 'music-blob', label: 'Radiohead', type: 'symbol', weight: 0.95,
    color: '#FF375F', image: imgRadiohead,
    periods: ['*'],
  },
  {
    // Osaka, not just "travel" — sub-trip from Tokyo
    id: 'travel-blob', label: 'Осака', type: 'text', weight: 0.72,
    color: '#FF9F0A',
    periods: ['2024-09', '2024-10', '2024-11', '2024-12'],
    periodWeight: { '2024-09': 0.4, '2024-10': 0.72, '2024-11': 0.65, '2024-12': 0.4 },
  },
  {
    // Specific product moment
    id: 'tech-blob', label: 'Vision Pro', type: 'text', weight: 0.62,
    color: '#0A84FF',
    periods: ['2025-01', '2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-01': 0.32, '2025-02': 0.48, '2025-03': 0.58, '2025-04': 0.62 },
  },
  {
    // Nikola Jokić — NBA season Oct–Apr, offseason in summer
    id: 'basketball', label: 'Jokić', type: 'symbol', weight: 0.82, color: '#FF9500', image: imgJokic,
    periods: ['2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04'],
    periodWeight: { '2024-10': 0.62, '2024-11': 0.72, '2024-12': 0.78, '2025-01': 0.82, '2025-02': 0.85, '2025-03': 0.88, '2025-04': 0.92 },
  },
  {
    // Monaco GP — post-race hype fades by autumn, reborn with new F1 season in spring
    id: 'f1', label: 'Монако GP', type: 'symbol', weight: 0.78, color: '#FF3B30', image: imgLeclerc,
    periods: ['2024-07', '2024-08', '2024-09', '2024-10'],
    periodWeight: { '2024-07': 0.92, '2024-08': 0.82, '2024-09': 0.65, '2024-10': 0.48 },
  },
  {
    // F1 new season — Bahrain/Australia opener, spring excitement
    id: 'f1-2025', label: 'Гран-при', type: 'symbol', weight: 0.72, color: '#FF3B30', image: imgLeclerc,
    periods: ['2025-03', '2025-04'],
    periodWeight: { '2025-03': 0.62, '2025-04': 0.78 },
  },
  {
    // Hesse's Siddhartha — specific book
    id: 'books', label: 'Сиддхартха', type: 'symbol', weight: 0.58, color: '#30D158', image: imgBooks,
    periods: ['2025-01', '2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-01': 0.38, '2025-02': 0.5, '2025-03': 0.55, '2025-04': 0.58 },
  },
  {
    // Specific ritual
    id: 'coffee', label: 'Эспрессо в 6:00', type: 'symbol', weight: 0.42, color: '#C4945A', image: imgCoffee,
    periods: ['*'],
  },
  {
    // Famous Tokyo sushi bar
    id: 'sushi', label: 'Sukiyabashi', type: 'symbol', weight: 0.48, color: '#FF6633', image: imgSushi,
    periods: ['2024-08', '2024-09', '2024-10', '2024-11'],
    periodWeight: { '2024-08': 0.38, '2024-09': 0.48, '2024-10': 0.44, '2024-11': 0.34 },
  },

  // ── Additional period-specific experiences ────────────────────────────────
  {
    // Summer trip, Lake Baikal
    id: 'baikal', label: 'Байкал, июль', type: 'text', weight: 0.78, color: '#00C7BE',
    periods: ['2024-07', '2024-08'],
    periodWeight: { '2024-07': 0.82, '2024-08': 0.55 },
  },
  {
    // Wimbledon 2024 final, July
    id: 'wimbledon', label: 'Уимблдон', type: 'symbol', weight: 0.6, color: '#34C759', image: imgWimbledon,
    periods: ['2024-07'],
  },
  {
    // Air — Moon Safari, the summer album
    id: 'moon-safari', label: 'Moon Safari', type: 'text', weight: 0.7, color: '#FF9F0A',
    periods: ['2024-07', '2024-08', '2024-09'],
    periodWeight: { '2024-07': 0.75, '2024-08': 0.65, '2024-09': 0.42 },
  },
  {
    // UEFA Euro 2024, final July 14
    id: 'euro2024', label: 'Евро 2024', type: 'symbol', weight: 0.68, color: '#0A84FF', image: imgEuro,
    periods: ['2024-07'],
  },
  {
    // Specific vinyl record found at a bar
    id: 'vinyl', label: 'Blue Note 1568', type: 'text', weight: 0.5, color: '#BF5AF2',
    periods: ['2024-08', '2024-09'],
    periodWeight: { '2024-08': 0.5, '2024-09': 0.38 },
  },
  {
    // Ichiran — solo ramen booth, Tokyo
    id: 'ramen', label: 'Ichiran', type: 'symbol', weight: 0.65, color: '#FF6633', image: imgRamen,
    periods: ['2024-10', '2024-11'],
    periodWeight: { '2024-10': 0.7, '2024-11': 0.52 },
  },
  {
    // Japanese aesthetic philosophy, post-Tokyo
    id: 'wabi-sabi', label: 'Wabi-sabi', type: 'text', weight: 0.55, color: '#C4945A',
    periods: ['2024-10', '2024-11', '2024-12'],
    periodWeight: { '2024-10': 0.48, '2024-11': 0.58, '2024-12': 0.42 },
  },
  {
    // Joseph Brodsky — late autumn poetry phase
    id: 'brodsky', label: 'Бродский', type: 'text', weight: 0.55, color: '#5E5CE6',
    periods: ['2024-12', '2025-01', '2025-02'],
    periodWeight: { '2024-12': 0.44, '2025-01': 0.58, '2025-02': 0.48 },
  },
  {
    // Morning run habit, new year discipline
    id: 'sunrise-run', label: '5:45 утра', type: 'symbol', weight: 0.58, color: '#34C759', image: imgRunning,
    periods: ['2025-02', '2025-03', '2025-04'],
    periodWeight: { '2025-02': 0.38, '2025-03': 0.52, '2025-04': 0.6 },
  },
  {
    // Garage Museum of Contemporary Art, Moscow
    id: 'garage', label: 'Гараж', type: 'text', weight: 0.52, color: '#FF9F0A',
    periods: ['2025-03', '2025-04'],
    periodWeight: { '2025-03': 0.45, '2025-04': 0.55 },
  },

  // ── New diverse experiences ───────────────────────────────────────────────
  {
    // Istanbul summer trip — Bosphorus, Aug–Sep
    id: 'istanbul', label: 'Стамбул', type: 'symbol', weight: 0.74, color: '#FF6633', image: imgIstanbul,
    periods: ['2024-08', '2024-09'],
    periodWeight: { '2024-08': 0.68, '2024-09': 0.78 },
  },
  {
    // Nabokov — The Gift, autumn reading
    id: 'nabokov', label: 'Дар', type: 'text', weight: 0.56, color: '#5E5CE6',
    periods: ['2024-10', '2024-11'],
    periodWeight: { '2024-10': 0.44, '2024-11': 0.58 },
  },
  {
    // Nick Cave concert — dark autumn
    id: 'nick-cave', label: 'Nick Cave', type: 'symbol', weight: 0.7, color: '#FF375F', image: imgNickCave,
    periods: ['2024-11', '2024-12'],
    periodWeight: { '2024-11': 0.72, '2024-12': 0.52 },
  },
  {
    // Bach Goldberg Variations — winter listening ritual
    id: 'bach-goldberg', label: 'Гольдберг', type: 'text', weight: 0.58, color: '#BF5AF2',
    periods: ['2024-12', '2025-01'],
    periodWeight: { '2024-12': 0.62, '2025-01': 0.52 },
  },
  {
    // Rome trip, Trastevere — late autumn November-December
    id: 'rome', label: 'Рим', type: 'symbol', weight: 0.76, color: '#FF9F0A', image: imgRome,
    periods: ['2024-11', '2024-12'],
    periodWeight: { '2024-11': 0.68, '2024-12': 0.82 },
  },
  {
    // New Year's Eve — December only
    id: 'new-year', label: '31 декабря', type: 'text', weight: 0.65, color: '#FF375F',
    periods: ['2024-12'],
    periodWeight: { '2024-12': 0.78 },
  },
  {
    // Epiphany ice swim — January only
    id: 'ice-swim', label: 'Прорубь', type: 'text', weight: 0.55, color: '#00C7BE',
    periods: ['2025-01'],
    periodWeight: { '2025-01': 0.68 },
  },
  {
    // Severance S2 — winter watch
    id: 'severance', label: 'Severance', type: 'text', weight: 0.62, color: '#0A84FF',
    periods: ['2025-01', '2025-02'],
    periodWeight: { '2025-01': 0.65, '2025-02': 0.55 },
  },
  {
    // Australian Open — January tennis
    id: 'aus-open', label: 'Australian Open', type: 'symbol', weight: 0.66, color: '#34C759', image: imgAusOpen,
    periods: ['2025-01'],
    periodWeight: { '2025-01': 0.74 },
  },
  {
    // Nils Frahm — winter/spring piano
    id: 'nils-frahm', label: 'Nils Frahm', type: 'symbol', weight: 0.64, color: '#BF5AF2', image: imgNilsFrahm,
    periods: ['2025-02', '2025-03'],
    periodWeight: { '2025-02': 0.68, '2025-03': 0.55 },
  },
  {
    // Kandinsky — Tretyakov spring exhibition
    id: 'kandinsky', label: 'Кандинский', type: 'text', weight: 0.54, color: '#FF9F0A',
    periods: ['2025-03', '2025-04'],
    periodWeight: { '2025-03': 0.48, '2025-04': 0.58 },
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

// Radial bands — explicit gaps between zones create readable orbital structure
// inner→mid gap 18px, mid→outer gap 7px
const BANDS = {
  inner: [92,  130] as const,   // top-3 nodes only, ew ≥ 0.78
  mid:   [148, 195] as const,   // ew 0.42–0.78
  outer: [202, 238] as const,   // background, ew < 0.42
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

  const count = Math.max(8, Math.round(active.length * config.density));
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
    // Inner capped at 3 top nodes — prevents cluster of small nodes near avatar
    const innerEligible = i < 3 && ew > 0.78;
    const band = innerEligible ? BANDS.inner : ew > 0.42 ? BANDS.mid : BANDS.outer;
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
    const extra = n.type === 'text' ? 70 : n.type === 'symbol' ? 14 : 0;
    const minD = AVATAR_R + n.size + AVATAR_GAP + extra;
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

// Text-led node — text is the object, presence field gives it body in space
const CapsuleNodeEl: React.FC<{
  node: InterestNode; placed: PlacedNode; intensity: number;
}> = ({ node, placed, intensity }) => {
  const dy    = (7 + intensity * 9) * (0.4 + nodeSeed(node.id, 0) * 0.8);
  const dx    = (3 + intensity * 4) * (nodeSeed(node.id, 13) > 0.5 ? 1 : -1) * (0.3 + nodeSeed(node.id, 14) * 0.7);
  const dur   = 5.5 + nodeSeed(node.id, 1) * 5;
  const delay = nodeSeed(node.id, 2) * 3.5;
  const fs    = Math.round(13 + placed.effectiveWeight * 8);
  const ew    = placed.effectiveWeight;

  // 3-tier glow on text
  const glow = ew > 0.75
    ? `0 0 14px ${node.color}78, 0 0 26px ${node.color}32`
    : ew > 0.42
    ? `0 0 10px ${node.color}50, 0 0 20px ${node.color}18`
    : `0 0 7px ${node.color}2E`;

  // Soft oval bloom — only for HIGH/MED; LOW stays as pure text
  // No rect, no border, no hard geometry — blurred ellipse pools light around text
  const hasBloom   = ew > 0.42;
  const bloomCtr   = ew > 0.75 ? '1E' : '12';   // hex alpha at ellipse center
  const bloomEdge  = ew > 0.75 ? '08' : '04';   // hex alpha at ellipse edge
  const bloomBlur  = ew > 0.75 ? 12 : 8;        // blur — more for inner-orbit nodes

  return (
    <motion.div
      animate={{ y: [0, -dy, 0], x: [0, dx, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
    >
      {/* inline-block wrapper so % dimensions reference text width */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Soft oval bloom — sits behind text, no hard edge */}
        {hasBloom && (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width:  'calc(100% + 44px)',   // extends ~22px each side
            height: 'calc(100% + 28px)',   // extends ~14px above/below
            borderRadius: '50%',           // rect → oval, proportional to text shape
            background: `radial-gradient(ellipse at center, ${node.color}${bloomCtr} 0%, ${node.color}${bloomEdge} 55%, transparent 80%)`,
            filter: `blur(${bloomBlur}px)`,
            pointerEvents: 'none',
          }} />
        )}
        <span style={{
          position: 'relative',            // above bloom in stacking order
          fontSize: fs,
          fontWeight: ew > 0.65 ? 600 : 500,
          color: node.color,
          letterSpacing: 0.4,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          textShadow: glow,
          display: 'block',
        }}>
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

// ── Color sampling utilities ─────────────────────────────────────────────────
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rf = r/255, gf = g/255, bf = b/255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rf)      h = ((gf - bf) / d + (gf < bf ? 6 : 0)) / 6;
  else if (max === gf) h = ((bf - rf) / d + 2) / 6;
  else                 h = ((rf - gf) / d + 4) / 6;
  return [h * 360, s, l];
}
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2 = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  return '#' + [hue2(h + 1/3), hue2(h), hue2(h - 1/3)]
    .map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}
function sampleImageColor(src: string, cb: (hex: string) => void) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = c.height = 12;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, 12, 12);
    const d = ctx.getImageData(0, 0, 12, 12).data;
    let r = 0, g = 0, b = 0, n = d.length / 4;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; }
    r = r/n; g = g/n; b = b/n;
    const [h, s, l] = rgbToHsl(r, g, b);
    // Boost saturation heavily, normalise lightness to mid-range so glow pops
    cb(hslToHex(h, Math.min(1, s * 3 + 0.25), Math.max(0.42, Math.min(0.60, l))));
  };
  img.src = src;
}

// Orb: media/symbol orb — glass sphere feel, layered glow, label absolutely below
const OrbNodeEl: React.FC<{
  node: InterestNode; placed: PlacedNode; intensity: number;
}> = ({ node, placed, intensity }) => {
  const sz      = placed.size * 2;
  const fs      = Math.round(sz * 0.50);
  const dy      = (5 + intensity * 8) * (0.4 + nodeSeed(node.id, 7) * 0.9);
  const breathe = 3 + nodeSeed(node.id, 10) * 2.5;
  const dur     = 5.5 + nodeSeed(node.id, 8) * 5;
  const delay   = nodeSeed(node.id, 9) * 4;
  const labelFs = Math.round(9 + placed.effectiveWeight * 4);

  // Sample dominant color from image for glow
  const [glowColor, setGlowColor] = React.useState(node.color);
  React.useEffect(() => {
    if (node.image) sampleImageColor(node.image, setGlowColor);
  }, [node.image]);

  // 3-tier glow — no ambient layer (was 70–132px per node = main source of glow mud)
  // Max outer radius 36px; avatar core at 74px always larger → avatar stays dominant
  const ewG = placed.effectiveWeight;
  const glow = ewG > 0.75
    ? `0 0 10px 2px ${glowColor}88, 0 0 22px 4px ${glowColor}38, 0 0 36px 6px ${glowColor}14`
    : ewG > 0.42
    ? `0 0 7px 1px ${glowColor}60, 0 0 16px 3px ${glowColor}1E`
    : `0 0 5px 1px ${glowColor}38, 0 0 10px 2px ${glowColor}0D`;

  const dx = (3 + intensity * 5) * (0.3 + nodeSeed(node.id, 12) * 0.7);

  return (
    <motion.div
      animate={{ y: [0, -dy, 0], x: [0, dx * (nodeSeed(node.id, 13) > 0.5 ? 1 : -1), 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ position: 'relative', width: sz, height: sz }}
    >
      {/* Glow ring — separate from image so overflow:hidden on image-clip can't cut it */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        boxShadow: glow,
        pointerEvents: 'none',
      }} />

      {/* Orb body */}
      <motion.div
        animate={{ opacity: [1, 0.72 + nodeSeed(node.id, 11) * 0.2, 1] }}
        transition={{ duration: breathe, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          overflow: 'hidden',   // safe here — glow is on sibling div above
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: node.image ? 'none'
            : `radial-gradient(circle at 36% 30%, ${glowColor}3A 0%, ${glowColor}08 75%, transparent 100%)`,
        }}
      >
        {node.image ? (
          <img
            src={node.image}
            alt={node.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: fs, lineHeight: 1, userSelect: 'none' }}>
            {node.emoji}
          </span>
        )}
      </motion.div>

      {/* Connector dot — visual pin between orb and label */}
      <div style={{
        position: 'absolute',
        top: sz + 3,
        left: '50%', transform: 'translateX(-50%)',
        width: 2, height: 2, borderRadius: '50%',
        background: `${node.color}55`,
        pointerEvents: 'none',
      }} />

      {/* Label — anchored below orb as attached satellite */}
      <span style={{
        position: 'absolute',
        top: sz + 9,
        left: '50%', transform: 'translateX(-50%)',
        fontSize: Math.round(10 + placed.effectiveWeight * 5),
        fontWeight: 400,
        color: `${node.color}B8`,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textShadow: '0 1px 5px rgba(0,0,0,0.75)',
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
  density: 0.90,
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
  const [offset, setOffset] = useState(() => -selectedIndex * STEP);
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
  const [periodIndex, setPeriodIndex] = useState(() =>
    _sessionPeriodIndex !== null ? _sessionPeriodIndex : PERIODS.length - 1
  );
  const period = PERIODS[periodIndex].id;

  // Persist selected period across SPA navigation (not across page reloads)
  React.useEffect(() => {
    _sessionPeriodIndex = periodIndex;
  }, [periodIndex]);
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
            {layout.slice(0, 5).map((placed, i) => {
              const node = nodeMap[placed.id];
              if (!node) return null;
              const sz = 160 + placed.effectiveWeight * 120;
              const breatheLo = placed.effectiveWeight * 0.28;
              const breatheHi = placed.effectiveWeight * 0.55;
              return (
                <motion.div
                  key={`haze-${node.id}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [breatheLo, breatheHi, breatheLo],
                    x: placed.x,
                    y: placed.y,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    x: { type: 'spring', stiffness: 55, damping: 20 },
                    y: { type: 'spring', stiffness: 55, damping: 20 },
                    opacity: { duration: 5.5 + i * 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.85 },
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
                  onClick={() => navigate('/app/chat/' + node.id)}
                  style={{
                    position: 'absolute',
                    left: cx - placed.size,
                    top:  cy - placed.size,
                    width:  placed.size * 2,
                    height: placed.size * 2,
                    zIndex: Math.round(placed.effectiveWeight * 10),
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  {node.type === 'text'   && <CapsuleNodeEl node={node} placed={placed} intensity={config.animIntensity} />}
                  {node.type === 'blob'   && <BlobNodeEl    node={node} placed={placed} blurPx={config.blurBlobs} intensity={config.animIntensity} />}
                  {node.type === 'symbol' && <OrbNodeEl     node={node} placed={placed} intensity={config.animIntensity} />}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Central user node — 5-layer avatar rendering system */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}>
            {/* ── Layer 1: BLOOM — barely-there atmospheric depth, not a spot ── */}
            {/* opacity 0.38 ceiling (was 0.65), alpha 0.13→0.05 (was 0.24→0.11), blur 52px (was 46) */}
            <motion.div
              animate={{ opacity: [0.42, 0.18, 0.42] }}
              transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
              style={{
                position: 'absolute', width: 400, height: 400,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(158,128,238,0.14) 0%, rgba(128,102,218,0.05) 44%, transparent 70%)',
                filter: 'blur(52px)',
                pointerEvents: 'none',
              }}
            />

            {/* ── Layer 2: AMBIENT HAZE — only readable on black, not a distinct shape ── */}
            {/* opacity 0.55 ceiling (was 1.0), alpha 0.16→0.08 (was 0.32→0.16), blur 18px (was 14) */}
            <motion.div
              animate={{ opacity: [0.55, 0.22, 0.55] }}
              transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
              style={{
                position: 'absolute', width: 248, height: 248,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, transparent 30%, rgba(158,138,248,0.16) 46%, rgba(138,118,235,0.08) 60%, transparent 74%)',
                filter: 'blur(18px)',
                pointerEvents: 'none',
              }}
            />

            {/* ── Layer 3: CORE GLOW — lavender, not white-hot; clean falloff behind photo ── */}
            {/* center rgba(186,168,252,0.42) was near-white rgba(242,232,255,0.60); opacity 0.80 (was 1.0) */}
            <motion.div
              animate={{ opacity: [0.90, 0.45, 0.90] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
              style={{
                position: 'absolute', width: 148, height: 148,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(186,168,252,0.48) 0%, rgba(158,140,244,0.23) 44%, transparent 72%)',
                filter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            />

            {/* ── Layer 4: PHOTO — clean, no shadow ── */}
            <div
              onClick={() => navigate('/app')}
              style={{
                position: 'relative',
                width: 110, height: 110, borderRadius: '50%',
                overflow: 'hidden', cursor: 'pointer',
              }}
            >
              <img src={avatarImg} alt="Профиль" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* ── Layer 5: EDGE RING — restrained; defines form without competing ── */}
            {/* stroke 0.18 (was 0.24), narrow glow 0.20 (was 0.32), falloff 0.09 (was 0.14) */}
            <motion.div
              animate={{ opacity: [1, 0.62, 1] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute', width: 110, height: 110,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                boxShadow: [
                  'inset 0 0 0 1.5px rgba(255,255,255,0.21)',   // crisp inner stroke
                  '0 0 0 1px rgba(178,158,242,0.16)',            // thin outer separation
                  '0 0 10px 2px rgba(168,148,240,0.23)',         // narrow outer glow
                  '0 0 20px 4px rgba(148,128,228,0.10)',         // soft falloff
                ].join(', '),
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* ── TIMELINE SLIDER ── */}
        <TimelineSlider periods={PERIODS} selectedIndex={periodIndex} onChange={setPeriodIndex} />

        <div style={{ height: 68, flexShrink: 0 }} />

      </div>
    </div>
  );
};
