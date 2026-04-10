import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcTravel from '../../../assets/travel.png';
import svcTaxi   from '../../../assets/taxi.png';

const COLOR = '#00C7BE';

// ── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    emoji: '✈️', title: 'Ищет билеты',
    desc: 'Москва → Тбилиси, июнь — смотрел уже 4 раза за неделю',
    time: '3 ч назад', svc: 'Яндекс Путешествия', svcColor: COLOR,
  },
  {
    emoji: '🏨', title: 'Сохранил отель',
    desc: 'Fabrika Hostel & Suites — добавил в избранное, смотрел дважды',
    time: 'вчера', svc: 'Яндекс Путешествия', svcColor: COLOR,
  },
  {
    emoji: '🗺️', title: 'Проложил маршрут',
    desc: 'Аэропорт Тбилиси → Старый город, метро + пешком 12 мин',
    time: '2 дня назад', svc: 'Яндекс Карты', svcColor: '#FF9F0A',
  },
  {
    emoji: '🌤️', title: 'Проверял погоду',
    desc: 'Тбилиси, 2–15 июня — +28°C, без дождей. Открывал три раза.',
    time: '3 дня назад', svc: 'Яндекс Погода', svcColor: '#5AC8F5',
  },
  {
    emoji: '📌', title: 'Отметил место',
    desc: 'Кафе Литерат — добавлено «Хочу посетить» по рекомендации',
    time: '5 дней назад', svc: 'Яндекс Карты', svcColor: '#FF9F0A',
  },
];

const SOURCES = [
  {
    iconSrc: svcTravel, name: 'Яндекс Путешествия', accentColor: COLOR,
    facts: [
      '11 поисков направлений за последние 2 недели',
      '3 отеля в избранном — Тбилиси, июнь',
      '4 проверки билетов — одно направление, разные даты',
    ],
  },
  {
    iconEmoji: '🗺️', name: 'Яндекс Карты', accentColor: '#FF9F0A',
    facts: [
      '7 мест сохранено — рестораны, районы, маршруты',
    ],
  },
  {
    iconEmoji: '☁️', name: 'Яндекс Погода', accentColor: '#5AC8F5',
    facts: [
      'Тбилиси 2–15 июня: +28°C без дождей — 3 просмотра',
      'повторный просмотр = сигнал реального намерения',
    ],
  },
  {
    iconSrc: svcTaxi, name: 'Яндекс Такси', accentColor: '#FFCC00',
    facts: [
      'маршрут до аэропорта — проверял стоимость поездки',
    ],
  },
];

const EXT_SOURCES = ['Авиасейлс', 'Booking', 'Airbnb'];

const BENEFITS = [
  {
    icon: '🗺️',
    title: 'Планирование без фрагментации',
    desc: 'Поиск, избранное, маршруты и погода собраны в одном контексте — не нужно переключаться между 5 приложениями',
  },
  {
    icon: '🔗',
    title: 'Поиск, выбор, бронь — без разрывов',
    desc: 'Нашёл отель — Aura помнит. Вернулся через три дня — контекст не потерян',
  },
  {
    icon: '🎯',
    title: 'Мечта или реальный план — Aura понимает разницу',
    desc: 'Смотришь мечтательно или уже выбираешь даты — рекомендации подстраиваются под фазу',
  },
  {
    icon: '✈️',
    title: 'Уместная помощь в поездке',
    desc: 'Когда ты уже там — навигация, транспорт, заведения поблизости без нового поиска',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const SecLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 600, letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 12 }}>
    {children}
  </p>
);

const Divider: React.FC = () => (
  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
);

// ── Main ──────────────────────────────────────────────────────────────────────

export const TravelWorldDetail: React.FC = () => {
  const navigate = useNavigate();

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
        borderBottom: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0,
      }}>
        <button onClick={() => navigate('/scenarios')} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer', flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>Путешествия</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 2 }}>Маршруты · Места · Логистика</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR, boxShadow: `0 0 6px 1px ${COLOR}88` }} />
          <span style={{ color: COLOR, fontSize: 11, fontWeight: 500 }}>планирует</span>
        </div>
        <button onClick={() => navigate('/app/chat/baikal')} style={{
          width: 32, height: 32, borderRadius: '50%',
          background: `${COLOR}1A`, border: `1.5px solid ${COLOR}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, cursor: 'pointer', flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}>💬</button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '20px 16px 48px' }}>

          {/* ── Hero ── */}
          <div style={{
            borderRadius: 18,
            background: `linear-gradient(140deg, ${COLOR}14 0%, rgba(22,22,24,0.96) 60%)`,
            border: `1px solid ${COLOR}30`, padding: '18px 18px 16px', marginBottom: 24,
          }}>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
              В режиме поездки
            </p>
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13, lineHeight: 1.55, marginBottom: 16 }}>
              Тбилиси, июнь. Маршрут формируется — есть конкретное направление, дата и первые сохранения. Переход от мечты к плану.
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { label: 'Мечта',        fill: 1.0  },
                { label: 'Планирование', fill: 0.65 },
                { label: 'Бронирование', fill: 0.20 },
                { label: 'Поездка',      fill: 0.0  },
              ].map((phase, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 5 }}>
                    <div style={{ width: `${phase.fill * 100}%`, height: '100%', borderRadius: 2, background: COLOR, opacity: phase.fill > 0 ? 1 : 0 }} />
                  </div>
                  <p style={{ color: phase.fill > 0.3 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.20)', fontSize: 9, fontWeight: 500, lineHeight: 1.2 }}>
                    {phase.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Experiences ── */}
          <SecLabel>Что происходило</SecLabel>
          <div style={{ marginBottom: 4 }}>
            {EXPERIENCES.map((exp, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `${exp.svcColor}14`, border: `1px solid ${exp.svcColor}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, flexShrink: 0,
                  }}>{exp.emoji}</div>
                  {i < EXPERIENCES.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 14, background: 'rgba(255,255,255,0.07)', marginTop: 4 }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 14 }}>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{exp.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.46)', fontSize: 12.5, marginTop: 2, lineHeight: 1.4 }}>{exp.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                    <span style={{
                      background: `${exp.svcColor}14`, border: `1px solid ${exp.svcColor}30`,
                      borderRadius: 8, padding: '2px 9px', color: exp.svcColor, fontSize: 11, fontWeight: 500,
                    }}>{exp.svc}</span>
                    <span style={{ color: 'rgba(255,255,255,0.26)', fontSize: 11 }}>{exp.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* ── Sources ── */}
          <SecLabel>Источники</SecLabel>
          <div style={{ marginBottom: 10 }}>
            {SOURCES.map(src => (
              <div key={src.name} style={{
                borderRadius: 14, background: '#1C1C1E',
                border: `1px solid ${src.accentColor}1E`,
                padding: '14px 16px', marginBottom: 10,
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                {'iconSrc' in src ? (
                  <img src={src.iconSrc as string} style={{ width: 38, height: 38, borderRadius: 9, objectFit: 'cover', flexShrink: 0, marginTop: 1 }} />
                ) : (
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, marginTop: 1 }}>
                    {(src as any).iconEmoji}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{src.name}</p>
                  {src.facts.map((fact, i) => (
                    <p key={i} style={{
                      color: 'rgba(255,255,255,0.52)', fontSize: 12, lineHeight: 1.55,
                      borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      paddingTop: i > 0 ? 5 : 0,
                    }}>{fact}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <p style={{ color: 'rgba(255,255,255,0.26)', fontSize: 11 }}>Также подключены:</p>
            {EXT_SOURCES.map((name, i) => (
              <React.Fragment key={name}>
                <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, fontWeight: 500 }}>{name}</p>
                {i < EXT_SOURCES.length - 1 && <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>·</p>}
              </React.Fragment>
            ))}
          </div>

          <Divider />

          {/* ── Benefits ── */}
          <SecLabel>Что это даёт</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{
                background: '#1C1C1E', borderRadius: 14, padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: 13, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.35 }}>{b.icon}</span>
                <div>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{b.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
