import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { C, R } from '../../styles/auraTokens';
import { WORLDS } from './types';
import { WORLD_DATA } from './worldsData';
import { WorldDetailLayout } from './WorldDetailLayout';

// ── Placeholder block ────────────────────────────────────────────────────────
const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{
    marginBottom: 12,
    borderRadius: R.sourceCard,
    background: C.surface,
    padding: '16px',
    border: `1px solid ${C.border}`,
  }}>
    <p style={{ color: C.textTertiary, fontSize: 11, fontWeight: 600, letterSpacing: 0.7, marginBottom: 10, textTransform: 'uppercase' }}>
      {title}
    </p>
    {children}
  </div>
);

const SkeletonLine: React.FC<{ width?: string }> = ({ width = '100%' }) => (
  <div style={{ height: 12, borderRadius: 6, background: C.bgLight, width, marginBottom: 8 }} />
);

const SkeletonCircle: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: C.bgLight, flexShrink: 0 }} />
);

// ── Main component ───────────────────────────────────────────────────────────
export const WorldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Known world → render shared layout with data
  const data = id ? WORLD_DATA[id] : null;
  if (data) return <WorldDetailLayout data={data} />;

  // Unknown id → skeleton placeholder with swipe navigation
  const world = WORLDS.find(w => w.id === id) ?? WORLDS[0];
  const currentIndex = WORLDS.indexOf(world);

  const touchX = useRef(0);
  const touchY = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 52) {
      const nextIndex = dx < 0
        ? (currentIndex + 1) % WORLDS.length
        : (currentIndex - 1 + WORLDS.length) % WORLDS.length;
      navigate(`/${WORLDS[nextIndex].id}`, { replace: true });
    }
  };

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'fixed', inset: 0,
        background: C.appBg,
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 12px 12px', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: C.borderLight, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.textPrimary, cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ color: world.color, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
            {world.label}
          </p>
          <p style={{ color: C.textQuaternary, fontSize: 12, marginTop: 2 }}>скоро</p>
        </div>
      </div>

      {/* World dots indicator */}
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 16, flexShrink: 0 }}>
        {WORLDS.map((w, i) => (
          <div
            key={w.id}
            onClick={() => navigate(`/${w.id}`, { replace: true })}
            style={{
              width: i === currentIndex ? 18 : 6,
              height: 6, borderRadius: 3,
              background: i === currentIndex ? world.color : C.borderLight,
              transition: 'width 0.2s, background 0.2s',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px' }}>
        <Block title="Обзор">
          <SkeletonLine width="92%" />
          <SkeletonLine width="78%" />
          <SkeletonLine width="85%" />
          <SkeletonLine width="60%" />
        </Block>
        <Block title="События">
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 2, alignSelf: 'stretch', background: `${world.color}30`, borderRadius: 1, flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <SkeletonLine width="50%" />
                <SkeletonLine width="80%" />
              </div>
            </div>
          ))}
        </Block>
        <Block title="Сервисы">
          <div style={{ display: 'flex', gap: 10 }}>
            {[1, 2, 3, 4].map(n => <SkeletonCircle key={n} />)}
          </div>
        </Block>
        <Block title="Польза">
          {[1, 2].map(n => (
            <div key={n} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <SkeletonCircle size={28} />
              <div style={{ flex: 1 }}>
                <SkeletonLine width="70%" />
                <SkeletonLine width="50%" />
              </div>
            </div>
          ))}
        </Block>
      </div>
    </motion.div>
  );
};
