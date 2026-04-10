import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

interface WorldWidget {
  id:          string;
  label:       string;
  sub:         string;
  color:       string;
  status:      string;
  statusColor: string;
  insight:     string;
  stats:       string[];
}

const WORLDS: WorldWidget[] = [
  {
    id: 'content', label: 'Контент', sub: 'Музыка · Кино · Книги',
    color: '#5AC8F5', status: 'активен сейчас', statusColor: '#30D158',
    insight: 'Исследователь историй — сейчас доминируют музыка и кино',
    stats: ['127 прослушиваний', '14 лайков', '3 досмотра до конца'],
  },
  {
    id: 'music', label: 'Музыка', sub: 'Слушает · Открывает · Собирает',
    color: '#BF5AF2', status: 'в потоке', statusColor: '#30D158',
    insight: 'Kind of Blue — третий раз за неделю. Намеренное слушание.',
    stats: ['3 возврата к альбому', 'сессии 50+ мин', '7 лайков за вечер'],
  },
  {
    id: 'cinema', label: 'Кино', sub: 'Фильмы · Сериалы · Список',
    color: '#FF9F0A', status: 'накапливает', statusColor: '#FF9F0A',
    insight: 'Вишлист растёт быстрее, чем смотрит — 27 фильмов',
    stats: ['3 досмотра до конца', '2 брошено', '10 дней паузы'],
  },
  {
    id: 'shopping', label: 'Шопинг', sub: 'Поиск · Сравнение · Решение',
    color: '#FF6633', status: 'наблюдает', statusColor: '#FF6633',
    insight: 'Nike Air Max — 4-й просмотр. Решение почти принято.',
    stats: ['8 возвратов к товару', '3 в корзине', '12 сравнений'],
  },
  {
    id: 'travel', label: 'Путешествия', sub: 'Маршруты · Места · Логистика',
    color: '#00C7BE', status: 'планирует', statusColor: '#00C7BE',
    insight: 'Тбилиси, июнь — переход от мечты к конкретному плану',
    stats: ['3 отеля в избранном', '4 проверки билетов', '7 мест на карте'],
  },
];

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
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '10px 20px 16px',
        }}>
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
          {WORLDS.map(w => (
            <div
              key={w.id}
              onClick={() => { onClose(); navigate(`/scenarios/${w.id}`); }}
              style={{
                borderRadius: 16, marginBottom: 10,
                background: '#1C1C1E',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                display: 'flex',
                activeOpacity: 0.7,
              }}
            >
              {/* Left color bar */}
              <div style={{ width: 3, background: w.color, flexShrink: 0, borderRadius: '3px 0 0 3px' }} />

              {/* Content */}
              <div style={{ flex: 1, padding: '12px 14px 13px' }}>
                {/* Top row: name + status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{w.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10.5 }}>{w.sub}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: w.statusColor }} />
                    <span style={{ color: w.statusColor, fontSize: 10, fontWeight: 600 }}>{w.status}</span>
                  </div>
                </div>

                {/* Key insight */}
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, lineHeight: 1.45, marginBottom: 9 }}>
                  {w.insight}
                </p>

                {/* Stats pills */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {w.stats.map((stat, i) => (
                    <span key={i} style={{
                      background: `${w.color}12`,
                      border: `1px solid ${w.color}28`,
                      borderRadius: 7, padding: '2px 8px',
                      color: `${w.color}CC`, fontSize: 10, fontWeight: 500,
                    }}>
                      {stat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chevron */}
              <div style={{
                display: 'flex', alignItems: 'center', paddingRight: 16,
                color: 'rgba(255,255,255,0.18)', fontSize: 18, fontWeight: 300,
              }}>›</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
