import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { SCENARIOS } from './types';
import { ContentWorldDetail }  from './ContentWorldDetail';
import { TravelWorldDetail }   from './TravelWorldDetail';
import { MusicWorldDetail }    from './MusicWorldDetail';
import { CinemaWorldDetail }   from './CinemaWorldDetail';
import { ShoppingWorldDetail } from './ShoppingWorldDetail';

// ── Placeholder block ────────────────────────────────────────────────────────
const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    style={{
      marginBottom: 12,
      borderRadius: 16,
      background: '#1C1C1E',
      padding: '16px 16px',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <p style={{ color: 'rgba(255,255,255,0.36)', fontSize: 11, fontWeight: 600, letterSpacing: 0.7, marginBottom: 10, textTransform: 'uppercase' }}>
      {title}
    </p>
    {children}
  </div>
);

// ── Skeleton line ────────────────────────────────────────────────────────────
const SkeletonLine: React.FC<{ width?: string }> = ({ width = '100%' }) => (
  <div style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)', width, marginBottom: 8 }} />
);

const SkeletonCircle: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
);

// ── Main component ───────────────────────────────────────────────────────────
export const ScenarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Content world has its own rich detail screen
  if (id === 'content')  return <ContentWorldDetail />;
  if (id === 'travel')   return <TravelWorldDetail />;
  if (id === 'music')    return <MusicWorldDetail />;
  if (id === 'cinema')   return <CinemaWorldDetail />;
  if (id === 'shopping') return <ShoppingWorldDetail />;

  const scenario = SCENARIOS.find(s => s.id === id) ?? SCENARIOS[0];
  const currentIndex = SCENARIOS.indexOf(scenario);

  // ── Swipe left/right to switch scenario ──────────────────────────────────
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
        ? (currentIndex + 1) % SCENARIOS.length          // swipe left → next
        : (currentIndex - 1 + SCENARIOS.length) % SCENARIOS.length; // swipe right → prev
      navigate(`/scenarios/${SCENARIOS[nextIndex].id}`, { replace: true });
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
        background: '#000',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          padding: '52px 12px 12px',
          gap: 8, flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate('/scenarios')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: 'none', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{ flex: 1 }}>
          <p style={{ color: scenario.color, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
            {scenario.label}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginTop: 2 }}>
            скоро
          </p>
        </div>

        {/* Chat button */}
        <button
          onClick={() => navigate(`/app/chat/${scenario.chatContextId}`)}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `${scenario.color}22`,
            border: `1.5px solid ${scenario.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: scenario.color, fontSize: 15, cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          💬
        </button>
      </div>

      {/* ── Scenario dots indicator ── */}
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 16, flexShrink: 0 }}>
        {SCENARIOS.map((s, i) => (
          <div
            key={s.id}
            onClick={() => navigate(`/scenarios/${s.id}`, { replace: true })}
            style={{
              width: i === currentIndex ? 18 : 6,
              height: 6, borderRadius: 3,
              background: i === currentIndex ? scenario.color : 'rgba(255,255,255,0.18)',
              transition: 'width 0.2s, background 0.2s',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px' }}>

        {/* Summary */}
        <Block title="Обзор">
          <SkeletonLine width="92%" />
          <SkeletonLine width="78%" />
          <SkeletonLine width="85%" />
          <SkeletonLine width="60%" />
        </Block>

        {/* Timeline */}
        <Block title="События">
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 2, alignSelf: 'stretch', background: `${scenario.color}30`, borderRadius: 1, flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <SkeletonLine width="50%" />
                <SkeletonLine width="80%" />
              </div>
            </div>
          ))}
        </Block>

        {/* Service contributors */}
        <Block title="Сервисы">
          <div style={{ display: 'flex', gap: 10 }}>
            {[1, 2, 3, 4].map(n => <SkeletonCircle key={n} />)}
          </div>
        </Block>

        {/* Benefits */}
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
