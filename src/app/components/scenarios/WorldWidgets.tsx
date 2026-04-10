import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

// ── Freshness ─────────────────────────────────────────────────────────────────

type Freshness = 'active' | 'cooling' | 'quiet';

const FRESHNESS: Record<Freshness, { color: string; label: string }> = {
  active:  { color: '#63D46B',                label: 'активно'  },
  cooling: { color: '#E7A93B',                label: 'остывает' },
  quiet:   { color: 'rgba(255,255,255,0.40)', label: 'тихо'     },
};

// ── Data ──────────────────────────────────────────────────────────────────────

interface WorldWidget {
  id:        string;
  label:     string;
  sub:       string;
  freshness: Freshness;
  insight:   string;
  chips:     string[];
}

const WORLDS: WorldWidget[] = [
  {
    id: 'content', label: 'Контент', sub: 'Музыка · Кино · Книги',
    freshness: 'active',
    insight: 'Доминируют музыка и кино, книги в фоне',
    chips: ['127 прослушиваний', '3 досмотра', '14 лайков'],
  },
  {
    id: 'music', label: 'Музыка', sub: 'Слушает · Открывает · Собирает',
    freshness: 'active',
    insight: 'Не просто слушает — уходит в длинные сессии',
    chips: ['3 возврата к альбому', 'сессии 50+ мин', '7 лайков'],
  },
  {
    id: 'cinema', label: 'Кино', sub: 'Фильмы · Сериалы · Список',
    freshness: 'cooling',
    insight: 'Список растёт быстрее, чем успевает смотреть',
    chips: ['3 досмотра до конца', '2 брошено', '10 дней пауза'],
  },
  {
    id: 'shopping', label: 'Шопинг', sub: 'Поиск · Сравнение · Решение',
    freshness: 'cooling',
    insight: 'Решение почти созрело, но ещё сравнивает',
    chips: ['8 возвратов к товару', '3 в корзине', '12 сравнений'],
  },
  {
    id: 'travel', label: 'Путешествия', sub: 'Маршруты · Места · Логистика',
    freshness: 'active',
    insight: 'План уже движется к конкретной поездке',
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
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.72)',
          WebkitBackdropFilter: 'blur(14px)',
          backdropFilter: 'blur(14px)',
        }}
      />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 36, stiffness: 420 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#0E0F12',
          borderRadius: '26px 26px 0 0',
          maxHeight: '91vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -2px 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 30, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.10)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px 18px',
        }}>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1.05 }}>
            Жизненные миры
          </p>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600,
              WebkitTapHighlightColor: 'transparent',
            }}
          >✕</button>
        </div>

        {/* Cards */}
        <div style={{
          flex: 1, overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          padding: '0 16px 48px',
        }}>
          {WORLDS.map(w => {
            const fr = FRESHNESS[w.freshness];
            return (
              <div
                key={w.id}
                onClick={() => { onClose(); navigate(`/scenarios/${w.id}`); }}
                style={{
                  borderRadius: 26,
                  marginBottom: 16,
                  minHeight: 156,
                  background: '#15161A',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '22px',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Row 1: title + status */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                  <span style={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1.0 }}>
                    {w.label}
                  </span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    flexShrink: 0, marginLeft: 12, marginTop: 6,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: fr.color, flexShrink: 0,
                    }} />
                    <span style={{ color: fr.color, fontSize: 15, fontWeight: 600, lineHeight: 1 }}>
                      {fr.label}
                    </span>
                  </div>
                </div>

                {/* Row 2: subtitle */}
                <p style={{
                  color: 'rgba(255,255,255,0.26)', fontSize: 15, fontWeight: 400,
                  lineHeight: 1.3, marginBottom: 14,
                }}>
                  {w.sub}
                </p>

                {/* Row 3: insight */}
                <p style={{
                  color: 'rgba(255,255,255,0.92)', fontSize: 18, fontWeight: 400,
                  lineHeight: 1.28, marginBottom: 20,
                }}>
                  {w.insight}
                </p>

                {/* Row 4: chips */}
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {w.chips.map((chip, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center',
                      height: 30,
                      borderRadius: 999,
                      padding: '0 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.64)',
                      fontSize: 13, fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
