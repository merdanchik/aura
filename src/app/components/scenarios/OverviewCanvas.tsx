import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { SCENARIOS, FAR_SCENARIOS } from './types';

// Polar → Cartesian from center of container
function polar(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180); // -90 so 0° = top
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

const MAIN_R    = 148; // px from center to main world circles
const FAR_R     = 210; // px from center to far/secondary circles
const MAIN_SIZE = 72;  // diameter of main world circle
const FAR_SIZE  = 32;  // diameter of far circle
const USER_SIZE = 60;  // diameter of user circle

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
      {/* Centered stage */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 0, height: 0,           // zero-size anchor; children use their own offsets
        }}
      >
        {/* Far / secondary scenarios — semi-transparent, no tap */}
        {FAR_SCENARIOS.map((s, i) => {
          const angle = (i / FAR_SCENARIOS.length) * 360 + 22; // offset from main
          const { x, y } = polar(angle, FAR_R);
          return (
            <div
              key={s.label}
              style={{
                position: 'absolute',
                width: FAR_SIZE, height: FAR_SIZE,
                borderRadius: '50%',
                background: `${s.color}18`,
                border: `1.5px solid ${s.color}44`,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 8, color: `${s.color}99`, fontWeight: 500, textAlign: 'center', lineHeight: 1.2, padding: '0 2px' }}>
                {s.label}
              </span>
            </div>
          );
        })}

        {/* Connector lines — SVG layer behind circles */}
        <svg
          style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none' }}
          width={0} height={0}
        >
          {SCENARIOS.map((s, i) => {
            const { x, y } = polar((i / SCENARIOS.length) * 360, MAIN_R);
            const edgeOffset = MAIN_SIZE / 2 + 4;
            const dist = Math.hypot(x, y);
            const nx = x / dist, ny = y / dist;
            return (
              <line
                key={s.id}
                x1={nx * (USER_SIZE / 2 + 4)} y1={ny * (USER_SIZE / 2 + 4)}
                x2={x - nx * edgeOffset}      y2={y - ny * edgeOffset}
                stroke={`${s.color}30`} strokeWidth={1}
              />
            );
          })}
        </svg>

        {/* Main world circles */}
        {SCENARIOS.map((s, i) => {
          const { x, y } = polar((i / SCENARIOS.length) * 360, MAIN_R);
          return (
            <motion.button
              key={s.id}
              onClick={() => navigate(`/scenarios/${s.id}`)}
              whileTap={{ scale: 0.93 }}
              style={{
                position: 'absolute',
                width: MAIN_SIZE, height: MAIN_SIZE,
                borderRadius: '50%',
                background: `${s.color}18`,
                border: `2px solid ${s.color}88`,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: s.color, textAlign: 'center', lineHeight: 1.3 }}>
                {s.label}
              </span>
            </motion.button>
          );
        })}

        {/* User circle — center */}
        <div
          style={{
            position: 'absolute',
            width: USER_SIZE, height: USER_SIZE,
            borderRadius: '50%',
            background: '#1C1C1E',
            border: '2px solid rgba(255,255,255,0.14)',
            transform: 'translate(-50%, -50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 20, opacity: 0.4 }}>👤</span>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, letterSpacing: 0.8, fontWeight: 500 }}>
          СЦЕНАРИИ
        </p>
      </div>
    </div>
  );
};
