import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import svcMusic  from '../../../assets/52729efb5574f608701f92848e1b348745677960.png';
import svcKino   from '../../../assets/b39f941bc25c3069b2f4719e19fdc535f4a56625.png';
import svcBooks  from '../../../assets/94e2bb438930a86c21d001934a49869c8425f73a.png';
import svcMarket from '../../../assets/873668dc7d9e7bd9c16444667bc68a762e2b3499.png';
import svcSplit  from '../../../assets/1f449fc2f45163f28ee9045765bf74d1029f8916.png';
import svcAfisha from '../../../assets/afisha.png';
import svcTravel from '../../../assets/travel.png';
import svcTaxi   from '../../../assets/taxi.png';
import svcIvi    from '../../../assets/partner-ivi.jpg';
import svcLamoda from '../../../assets/partner-lamoda.jpg';

// ── Freshness ─────────────────────────────────────────────────────────────────

type Freshness = 'active' | 'cooling' | 'quiet';

const FRESHNESS: Record<Freshness, { color: string; label: string }> = {
  active:  { color: '#30D158', label: 'активно'  },
  cooling: { color: '#FF9F0A', label: 'остывает' },
  quiet:   { color: '#636366', label: 'тихо'     },
};

// ── Data ──────────────────────────────────────────────────────────────────────

interface ServiceDot { img: string; name: string }

interface WorldWidget {
  id:            string;
  label:         string;
  sub:           string;
  color:         string;
  freshness:     Freshness;
  freshnessNote: string;
  insight:       string;
  stats:         string[];
  services:      ServiceDot[];
  extraCount:    number;
}

const WORLDS: WorldWidget[] = [
  {
    id: 'content', label: 'Контент', sub: 'Музыка · Кино · Книги',
    color: '#5AC8F5', freshness: 'active',
    freshnessNote: 'активно сейчас',
    insight: 'Исследователь историй — доминируют музыка и кино',
    stats: ['127 прослушиваний', '14 лайков', '3 досмотра'],
    services: [
      { img: svcMusic, name: 'Яндекс Музыка' },
      { img: svcKino,  name: 'Кинопоиск'     },
      { img: svcBooks, name: 'Яндекс Книги'  },
    ],
    extraCount: 2,
  },
  {
    id: 'music', label: 'Музыка', sub: 'Слушает · Открывает · Собирает',
    color: '#BF5AF2', freshness: 'active',
    freshnessNote: 'активен на этой неделе',
    insight: 'Kind of Blue — третий раз за неделю. Намеренное слушание.',
    stats: ['3 возврата к альбому', 'сессии 50+ мин', '7 лайков'],
    services: [
      { img: svcMusic,  name: 'Яндекс Музыка' },
      { img: svcAfisha, name: 'Яндекс Афиша'  },
    ],
    extraCount: 2,
  },
  {
    id: 'cinema', label: 'Кино', sub: 'Фильмы · Сериалы · Список',
    color: '#FF9F0A', freshness: 'cooling',
    freshnessNote: 'остывает — 10 дней без просмотра',
    insight: 'Вишлист растёт быстрее, чем смотрит — 27 фильмов',
    stats: ['3 досмотра до конца', '2 брошено', '10 дней пауза'],
    services: [
      { img: svcKino, name: 'Кинопоиск' },
      { img: svcIvi,  name: 'ivi'        },
    ],
    extraCount: 2,
  },
  {
    id: 'shopping', label: 'Шопинг', sub: 'Поиск · Сравнение · Решение',
    color: '#FF6633', freshness: 'cooling',
    freshnessNote: 'остывает — без новых действий',
    insight: 'Nike Air Max — 4-й просмотр. Решение почти принято.',
    stats: ['8 возвратов к товару', '3 в корзине', '12 сравнений'],
    services: [
      { img: svcMarket, name: 'Яндекс Маркет' },
      { img: svcLamoda, name: 'Lamoda'         },
      { img: svcSplit,  name: 'Яндекс Сплит'  },
    ],
    extraCount: 1,
  },
  {
    id: 'travel', label: 'Путешествия', sub: 'Маршруты · Места · Логистика',
    color: '#00C7BE', freshness: 'active',
    freshnessNote: 'активен — план формируется',
    insight: 'Тбилиси, июнь — переход от мечты к конкретному плану',
    stats: ['3 отеля в избранном', '4 проверки билетов', '7 мест'],
    services: [
      { img: svcTravel, name: 'Яндекс Путешествия' },
      { img: svcTaxi,   name: 'Яндекс Такси'       },
    ],
    extraCount: 2,
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
                  borderRadius: 16, marginBottom: 10,
                  background: '#1C1C1E',
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  display: 'flex',
                }}
              >
                {/* Left color bar */}
                <div style={{ width: 3, background: w.color, flexShrink: 0, borderRadius: '3px 0 0 3px' }} />

                {/* Content */}
                <div style={{ flex: 1, padding: '12px 12px 12px 14px' }}>

                  {/* Top row: name + freshness badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
                      <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{w.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.24)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.sub}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: fr.color }} />
                      <span style={{ color: fr.color, fontSize: 10, fontWeight: 600 }}>{fr.label}</span>
                    </div>
                  </div>

                  {/* Insight */}
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11.5, lineHeight: 1.45, marginBottom: 3 }}>
                    {w.insight}
                  </p>

                  {/* Freshness note */}
                  <p style={{ color: fr.color, fontSize: 10, fontWeight: 500, opacity: 0.72, marginBottom: 9 }}>
                    {w.freshnessNote}
                  </p>

                  {/* Stats pills */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
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

                  {/* Domains / services row */}
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: 9,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {/* Service icons */}
                    {w.services.map((svc, i) => (
                      <img
                        key={i} src={svc.img} alt={svc.name}
                        style={{
                          width: 20, height: 20, borderRadius: 5,
                          objectFit: 'cover',
                          border: '1px solid rgba(255,255,255,0.08)',
                          flexShrink: 0,
                        }}
                      />
                    ))}
                    {/* Overflow count */}
                    {w.extraCount > 0 && (
                      <span style={{ color: 'rgba(255,255,255,0.26)', fontSize: 10, fontWeight: 500 }}>
                        +{w.extraCount}
                      </span>
                    )}

                    <div style={{ flex: 1 }} />

                    {/* Add service chip */}
                    <button
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 7, padding: '3px 9px',
                        color: 'rgba(255,255,255,0.32)', fontSize: 10, fontWeight: 500,
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        flexShrink: 0,
                      }}
                    >+ сервис</button>
                  </div>

                </div>

                {/* Chevron */}
                <div style={{
                  display: 'flex', alignItems: 'center', paddingRight: 14,
                  color: 'rgba(255,255,255,0.18)', fontSize: 18, fontWeight: 300,
                }}>›</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
