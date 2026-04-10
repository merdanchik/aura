import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

// ── Freshness ─────────────────────────────────────────────────────────────────

type Freshness = 'active' | 'cooling' | 'quiet';

const FRESHNESS: Record<Freshness, { color: string; label: string }> = {
  active:  { color: '#61D46E',                label: 'активно'  },
  cooling: { color: '#F5B544',                label: 'остывает' },
  quiet:   { color: 'rgba(255,255,255,0.38)', label: 'тихо'     },
};

// ── Data ──────────────────────────────────────────────────────────────────────

interface WorldWidget {
  id:        string;
  label:     string;
  sub:       string;
  color:     string;
  freshness: Freshness;
  insight:   string;
  chips:     string[];
}

const WORLDS: WorldWidget[] = [
  {
    id: 'content', label: 'Контент', sub: 'Музыка · Кино · Книги',
    color: '#5AC8F5', freshness: 'active',
    insight: 'Доминируют музыка и кино, книги в фоне',
    chips: ['127 прослушиваний', '3 досмотра', '14 лайков'],
  },
  {
    id: 'music', label: 'Музыка', sub: 'Слушает · Открывает · Собирает',
    color: '#BF5AF2', freshness: 'active',
    insight: 'Kind of Blue — третий раз за неделю',
    chips: ['3 возврата к альбому', 'сессии 50+ мин', '7 лайков'],
  },
  {
    id: 'cinema', label: 'Кино', sub: 'Фильмы · Сериалы · Список',
    color: '#FF9F0A', freshness: 'cooling',
    insight: 'Вишлист растёт быстрее, чем смотрит — 27 фильмов',
    chips: ['3 досмотра до конца', '2 брошено', '10 дней пауза'],
  },
  {
    id: 'shopping', label: 'Шопинг', sub: 'Поиск · Сравнение · Решение',
    color: '#FF6633', freshness: 'cooling',
    insight: 'Air Max — 4-й просмотр, решение почти принято',
    chips: ['8 возвратов к товару', '3 в корзине', '12 сравнений'],
  },
  {
    id: 'travel', label: 'Путешествия', sub: 'Маршруты · Места · Логистика',
    color: '#00C7BE', freshness: 'active',
    insight: 'Тбилиси, июнь — план уже формируется',
    chips: ['3 отеля в избранном', '4 проверки билетов', '7 мест'],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { onClose: () => void }

export const WorldWidgets: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)',
        }}
      />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 34, stiffness: 400 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#0C0C0E',
          borderRadius: '22px 22px 0 0',
          maxHeight: '88vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 2 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.14)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 16px' }}>
          <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, flex: 1 }}>Жизненные миры</p>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              WebkitTapHighlightColor: 'transparent',
            }}
          >✕</button>
        </div>

        {/* World cards */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, padding: '0 16px 44px' }}>
          {WORLDS.map(w => {
            const fr = FRESHNESS[w.freshness];
            return (
              <div
                key={w.id}
                onClick={() => { onClose(); navigate(`/scenarios/${w.id}`); }}
                style={{
                  borderRadius: 22,
                  marginBottom: 12,
                  background: '#17181C',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  display: 'flex',
                }}
              >
                {/* Left accent — thin, moderate opacity */}
                <div style={{ width: 3, background: w.color, opacity: 0.38, flexShrink: 0 }} />

                {/* Content */}
                <div style={{ flex: 1, padding: '18px 18px' }}>

                  {/* Row 1: title + freshness */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#fff', fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>
                      {w.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginLeft: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: fr.color }} />
                      <span style={{ color: fr.color, fontSize: 13, fontWeight: 500 }}>{fr.label}</span>
                    </div>
                  </div>

                  {/* Row 2: subtitle */}
                  <p style={{
                    color: 'rgba(255,255,255,0.42)', fontSize: 13, fontWeight: 400,
                    lineHeight: 1.3, marginBottom: 14,
                  }}>
                    {w.sub}
                  </p>

                  {/* Row 3: insight */}
                  <p style={{
                    color: 'rgba(255,255,255,0.86)', fontSize: 15, fontWeight: 400,
                    lineHeight: 1.35, marginBottom: 14,
                  }}>
                    {w.insight}
                  </p>

                  {/* Row 4: signal chips */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {w.chips.map((chip, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center',
                        height: 28,
                        borderRadius: 999,
                        padding: '0 10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.72)',
                        fontSize: 12, fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}>
                        {chip}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
