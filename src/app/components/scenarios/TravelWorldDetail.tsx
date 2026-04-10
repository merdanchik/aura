import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcTravel from '../../../assets/travel.png';

const COLOR = '#00C7BE';

// ── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  'Собирает поиск, избранное и маршруты в одном контексте без переключения между приложениями',
  'Различает мечту и реальный план — рекомендации подстраиваются под фазу',
  'Сохраняет контекст между сессиями — вернулся через три дня, всё на месте',
];

interface Source {
  iconSrc?: string;
  initials?: string;
  name:    string;
  facts:   string;
  meaning: string;
  accent:  string;
}

const SOURCES: Source[] = [
  {
    iconSrc: svcTravel,
    name:    'Яндекс Путешествия',
    facts:   '11 поисков за 2 недели, 3 отеля в избранном, 4 проверки билетов',
    meaning: 'Конкретное направление — не мечта',
    accent:  COLOR,
  },
  {
    initials: 'КА',
    name:     'Яндекс Карты',
    facts:    '7 мест сохранено — рестораны, районы, маршруты',
    meaning:  'Маршрут формируется',
    accent:   '#FF9F0A',
  },
  {
    initials: 'ПГ',
    name:     'Яндекс Погода',
    facts:    'Тбилиси 2–15 июня — 3 просмотра',
    meaning:  'Повторный просмотр = сигнал реального намерения',
    accent:   '#5AC8F5',
  },
];

const EXT_SOURCES = ['Авиасейлс', 'Booking', 'Airbnb'];

// ── Sub-components ────────────────────────────────────────────────────────────

const SecLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    color: 'rgba(255,255,255,0.34)', fontSize: 12, fontWeight: 600,
    letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 14,
  }}>
    {children}
  </p>
);

const Divider: React.FC = () => (
  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '22px 0' }} />
);

// ── Main ──────────────────────────────────────────────────────────────────────

export const TravelWorldDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromWorlds = (location.state as any)?.fromWorlds;

  const goBack = () => navigate('/scenarios', fromWorlds ? { state: { showWorlds: true } } : undefined);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '52px 16px 14px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <button onClick={goBack} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer', flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>Путешествия</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginTop: 2 }}>Маршруты · Места · Логистика</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR }} />
          <span style={{ color: COLOR, fontSize: 13, fontWeight: 500 }}>планирует</span>
        </div>
        <button onClick={() => navigate('/app/chat/baikal')} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: `${COLOR}18`, border: `1.5px solid ${COLOR}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, cursor: 'pointer', flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}>💬</button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* ── Hero / State ── */}
          <div style={{
            borderRadius: 22,
            background: `linear-gradient(140deg, ${COLOR}16 0%, rgba(16,16,20,0.99) 64%)`,
            border: `1px solid ${COLOR}22`,
            padding: '22px 20px 20px',
            marginBottom: 30,
          }}>
            <p style={{ color: '#fff', fontSize: 24, fontWeight: 700, lineHeight: 1.15, marginBottom: 12 }}>
              План становится конкретным
            </p>
            <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 16, lineHeight: 1.55, marginBottom: 16 }}>
              Тбилиси, июнь. Уже есть направление, даты и первые сохранения — план движется к конкретной поездке.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.34)', fontSize: 13 }}>
              Основано на активности за последние 2 недели
            </p>
          </div>

          {/* ── Что это даёт ── */}
          <SecLabel>Что это даёт</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 4 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: COLOR, opacity: 0.65,
                  marginTop: 6, flexShrink: 0,
                }} />
                <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 15, lineHeight: 1.5 }}>{v}</p>
              </div>
            ))}
          </div>

          <Divider />

          {/* ── Источники ── */}
          <SecLabel>Источники</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {SOURCES.map(src => (
              <div key={src.name} style={{
                borderRadius: 16, background: '#14161B',
                padding: '16px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                {src.iconSrc ? (
                  <img src={src.iconSrc} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `${src.accent}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: src.accent, fontSize: 13, fontWeight: 600, opacity: 0.9,
                  }}>{src.initials}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{src.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: 13, lineHeight: 1.5, marginBottom: 7 }}>{src.facts}</p>
                  <p style={{ color: src.accent, fontSize: 13, fontWeight: 500, opacity: 0.80 }}>{src.meaning}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>Также подключены:</p>
            {EXT_SOURCES.map((name, i) => (
              <React.Fragment key={name}>
                <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, fontWeight: 500 }}>{name}</p>
                {i < EXT_SOURCES.length - 1 && <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 13 }}>·</p>}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
