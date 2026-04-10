import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

import svcMusic      from '../../../assets/52729efb5574f608701f92848e1b348745677960.png';
import svcKino       from '../../../assets/b39f941bc25c3069b2f4719e19fdc535f4a56625.png';
import svcBooks      from '../../../assets/94e2bb438930a86c21d001934a49869c8425f73a.png';
import svcMarket     from '../../../assets/873668dc7d9e7bd9c16444667bc68a762e2b3499.png';
import svcAfisha     from '../../../assets/afisha.png';
import svcTravel     from '../../../assets/travel.png';
import svcSpotify    from '../../../assets/spotify.png';
import svcIvi        from '../../../assets/ivi.png';
import svcKion       from '../../../assets/kion.png';
import svcWildberries from '../../../assets/wildberries.png';
import svcOzon       from '../../../assets/ozon.png';
import svcYMaps      from '../../../assets/yandex-maps.png';
import svcYWeather   from '../../../assets/yandex-weather.png';

import { C, S, R } from '../../styles/auraTokens';
import { worldCard, chipStyle } from '../../styles/auraPrimitives';

// ── Freshness ─────────────────────────────────────────────────────────────────

type Freshness = 'active' | 'cooling' | 'quiet';

const FRESHNESS: Record<Freshness, { color: string; label: string }> = {
  active:  { color: C.active,  label: 'активно'  },
  cooling: { color: C.cooling, label: 'остывает' },
  quiet:   { color: C.quiet,   label: 'тихо'     },
};

// ── Service definitions ───────────────────────────────────────────────────────

interface ServiceDef {
  icon?:    string;
  initials: string;
  color:    string;
}

const SERVICES: Record<string, ServiceDef> = {
  'Яндекс Музыка':      { icon: svcMusic,   initials: 'ЯМ', color: '#BF5AF2' },
  'Кинопоиск':          { icon: svcKino,    initials: 'КП', color: '#FF9F0A' },
  'Яндекс Книги':       { icon: svcBooks,   initials: 'КН', color: '#5E5CE6' },
  'Яндекс Маркет':      { icon: svcMarket,  initials: 'МК', color: '#FF6633' },
  'Яндекс Афиша':       { icon: svcAfisha,  initials: 'АФ', color: '#FF9F0A' },
  'Яндекс Путешествия': { icon: svcTravel,  initials: 'ПТ', color: '#00C7BE' },
  'Spotify':        { icon: svcSpotify,     initials: 'Sp', color: '#1DB954' },
  'ivi':            { icon: svcIvi,         initials: 'iv', color: '#E8273E' },
  'KION':           { icon: svcKion,        initials: 'Ki', color: '#7B61FF' },
  'Wildberries':    { icon: svcWildberries, initials: 'WB', color: '#CB11AB' },
  'Ozon':           { icon: svcOzon,        initials: 'Oz', color: '#005BFF' },
  'Яндекс Карты':   { icon: svcYMaps,       initials: 'КА', color: '#FF6633' },
  'Яндекс Погода':  { icon: svcYWeather,    initials: 'ПГ', color: '#5AC8F5' },
};

const ServiceBadge: React.FC<{ name: string }> = ({ name }) => {
  const def = SERVICES[name] ?? { initials: name.slice(0, 2), color: C.textQuiet };
  if (def.icon) {
    return (
      <img
        src={def.icon} alt={name} title={name}
        style={{ width: S.serviceIconSize, height: S.serviceIconSize, borderRadius: R.iconSm, objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div title={name} style={{
      width: S.serviceIconSize, height: S.serviceIconSize, borderRadius: R.iconSm,
      background: `${def.color}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700, color: def.color,
      flexShrink: 0, letterSpacing: -0.3,
    }}>
      {def.initials}
    </div>
  );
};

// ── Data ──────────────────────────────────────────────────────────────────────

interface WorldWidget {
  id:        string;
  label:     string;
  sub:       string;
  freshness: Freshness;
  insight:   string;
  chips:     string[];
  services:  string[];
}

const WORLDS: WorldWidget[] = [
  {
    id: 'content', label: 'Контент', sub: 'Музыка · Кино · Книги',
    freshness: 'active',
    insight: 'Внимание распределено между форматами: музыка и кино доминируют, книги остаются в фоне',
    chips: ['127 прослушиваний', '3 досмотра', '14 лайков'],
    services: ['Яндекс Музыка', 'Кинопоиск', 'Яндекс Книги'],
  },
  {
    id: 'music', label: 'Музыка', sub: 'Слушает · Открывает · Собирает',
    freshness: 'active',
    insight: 'Музыка перешла из фона в устойчивый сценарий намеренного слушания',
    chips: ['3 возврата к альбому', 'сессии 50+ мин', '7 лайков'],
    services: ['Яндекс Музыка', 'Spotify', 'Яндекс Афиша'],
  },
  {
    id: 'cinema', label: 'Кино', sub: 'Фильмы · Сериалы · Список',
    freshness: 'cooling',
    insight: 'Интерес к просмотру есть, но готовность тратить время пока нестабильна',
    chips: ['3 досмотра до конца', '2 брошено', '10 дней пауза'],
    services: ['Кинопоиск', 'ivi', 'KION'],
  },
  {
    id: 'shopping', label: 'Шопинг', sub: 'Поиск · Сравнение · Решение',
    freshness: 'cooling',
    insight: 'Сценарий покупки уже активен: идёт сравнение, но решение ещё зреет',
    chips: ['8 возвратов к товару', '3 в корзине', '12 сравнений'],
    services: ['Яндекс Маркет', 'Wildberries', 'Ozon'],
  },
  {
    id: 'travel', label: 'Путешествия', sub: 'Маршруты · Места · Логистика',
    freshness: 'active',
    insight: 'Сценарий сдвинулся от вдохновения к конкретному планированию поездки',
    chips: ['3 отеля в избранном', '4 проверки билетов', '7 мест'],
    services: ['Яндекс Путешествия', 'Яндекс Карты', 'Яндекс Погода'],
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
          background: C.backdropBg,
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
          background: C.appBg,
          borderRadius: `${R.sheet}px ${R.sheet}px 0 0`,
          maxHeight: '91vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -2px 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 30, height: 3, borderRadius: 2, background: C.handleBar }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px 18px',
        }}>
          <p style={{ color: C.textPrimary, fontSize: 28, fontWeight: 700, lineHeight: 1.05 }}>
            Жизненные миры
          </p>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: C.borderLight,
              color: C.textSecondary, cursor: 'pointer',
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
                onClick={() => {
                  onClose();
                  navigate(`/scenarios/${w.id}`, { state: { fromWorlds: true } });
                }}
                style={worldCard}
              >
                {/* Row 1: title + status */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}>
                  <span style={{ color: C.textPrimary, fontSize: 26, fontWeight: 700, lineHeight: 1.0 }}>
                    {w.label}
                  </span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    flexShrink: 0, marginLeft: 12, marginTop: 6,
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: fr.color, flexShrink: 0 }} />
                    <span style={{ color: fr.color, fontSize: 14, fontWeight: 500, lineHeight: 1 }}>
                      {fr.label}
                    </span>
                  </div>
                </div>

                {/* Row 2: subtitle */}
                <p style={{
                  color: C.textQuiet, fontSize: 14,
                  lineHeight: 1.3, marginBottom: 14,
                }}>
                  {w.sub}
                </p>

                {/* Row 3: insight */}
                <p style={{
                  color: C.textHighEmphasis, fontSize: 17,
                  lineHeight: 1.3, marginBottom: 18,
                }}>
                  {w.insight}
                </p>

                {/* Row 4: chips */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                  {w.chips.map((chip, i) => (
                    <span key={i} style={chipStyle}>{chip}</span>
                  ))}
                </div>

                {/* Row 5: connected services */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {w.services.map(svc => <ServiceBadge key={svc} name={svc} />)}
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: S.serviceIconSize, height: S.serviceIconSize, borderRadius: R.pill,
                      background: C.bgLight,
                      color: C.textSecondary,
                      fontSize: 16, lineHeight: 1,
                      cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >+</button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
