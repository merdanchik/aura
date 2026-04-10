import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcMarket from '../../../assets/873668dc7d9e7bd9c16444667bc68a762e2b3499.png';

const COLOR = '#FF6633';

// ── Data ─────────────────────────────────────────────────────────────────────

const INTENT_STATS = [
  { label: 'Возвратов',   value: '8',  sub: 'к одному товару' },
  { label: 'В корзине',   value: '3',  sub: 'не оформлено' },
  { label: 'Сравнений',   value: '12', sub: 'за неделю' },
];

const EXPERIENCES = [
  {
    emoji: '👟', title: 'Вернулся к карточке',
    desc: 'Nike Air Max — четвёртый просмотр за неделю. Цена не изменилась.',
    time: '3 ч назад', svc: 'Яндекс Маркет', svcColor: COLOR,
  },
  {
    emoji: '🛒', title: 'Добавил в корзину',
    desc: 'Зимняя куртка — лежит пятый день, заказ не оформлен.',
    time: '2 дня назад', svc: 'Яндекс Маркет', svcColor: COLOR,
  },
  {
    emoji: '⚖️', title: 'Сравнивал три варианта',
    desc: 'Samsung Galaxy S24 / iPhone 15 / Pixel 8 — финал не выбрал.',
    time: '4 дня назад', svc: 'Яндекс Маркет', svcColor: COLOR,
  },
  {
    emoji: '📦', title: 'Проверил доставку',
    desc: 'Прошлый заказ — пришёл вчера. Открыл приложение, больше ничего не добавил.',
    time: 'вчера', svc: 'Яндекс Маркет', svcColor: COLOR,
  },
];

const SOURCES = [
  {
    iconSrc: svcMarket, name: 'Яндекс Маркет', accentColor: COLOR,
    signals: [
      { emoji: '🔁', text: '8 возвратов к одному товару',      sub: 'зависшее намерение — нужен триггер, не напоминание' },
      { emoji: '🛒', text: '3 товара в корзине, не оформлено', sub: 'высокое намерение, низкая конверсия' },
      { emoji: '⚖️', text: '12 сравнений за неделю',            sub: 'думает, а не импульсно покупает' },
      { emoji: '🔔', text: 'Ценовые алерты не срабатывали',    sub: 'ждёт снижения или другого внешнего сигнала' },
    ],
  },
  {
    iconEmoji: '✉️', name: 'Яндекс Почта', accentColor: 'rgba(255,255,255,0.3)',
    signals: [
      { emoji: '📦', text: 'Заказы и статусы доставки', sub: 'история покупок, трекинг' },
    ],
  },
];

const EXT_SOURCES = ['Wildberries', 'Ozon'];

const BENEFITS = [
  {
    icon: '⏰',
    title: 'Правильный момент, а не случайный',
    desc: 'Знает, что ты смотришь четвёртый раз — это не случайно. Предложит помощь, когда ты уже почти решил',
  },
  {
    icon: '🎯',
    title: 'Намерение отличается от импульса',
    desc: 'Видит: ты думаешь, сравниваешь, возвращаешься — это не импульс. Значит, нужен контекст, а не скидка',
  },
  {
    icon: '📉',
    title: 'Ценовой момент не пропустит',
    desc: 'Когда цена снизится или появится подходящее предложение — предупредит в нужный момент',
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

export const ShoppingWorldDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '52px 16px 14px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/scenarios')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer', flexShrink: 0,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>Шопинг</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 2 }}>Поиск · Сравнение · Решение</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR, boxShadow: `0 0 6px 1px ${COLOR}88` }} />
          <span style={{ color: COLOR, fontSize: 11, fontWeight: 500 }}>наблюдает</span>
        </div>

        <button
          onClick={() => navigate('/app/chat/ramen')}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `${COLOR}1A`, border: `1.5px solid ${COLOR}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, cursor: 'pointer', flexShrink: 0,
            WebkitTapHighlightColor: 'transparent',
          }}
        >💬</button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '20px 16px 48px' }}>

          {/* ── Hero ── */}
          <div style={{
            borderRadius: 18,
            background: `linear-gradient(140deg, ${COLOR}14 0%, rgba(22,22,24,0.96) 60%)`,
            border: `1px solid ${COLOR}30`,
            padding: '18px 18px 16px',
            marginBottom: 24,
          }}>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
              Намерение без триггера
            </p>
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13, lineHeight: 1.55, marginBottom: 16 }}>
              Одни и те же кроссовки — четвёртый раз за неделю. Цена не изменилась. Aura видит: решение почти принято.
            </p>

            {/* Intent stats */}
            <div style={{ display: 'flex', gap: 8 }}>
              {INTENT_STATS.map((s, i) => (
                <div key={i} style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '10px 0',
                  textAlign: 'center',
                }}>
                  <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 3 }}>{s.sub}</p>
                  <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 9.5, marginTop: 1 }}>{s.label}</p>
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
                  }}>
                    {exp.emoji}
                  </div>
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

          {/* ── Unified sources block ── */}
          <SecLabel>Источники</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
            {SOURCES.map(src => (
              <div key={src.name} style={{
                borderRadius: 16, background: '#1C1C1E',
                border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden',
              }}>
                {/* Service header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  {'iconSrc' in src ? (
                    <img src={src.iconSrc as string} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(255,255,255,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 17,
                    }}>{src.iconEmoji as string}</div>
                  )}
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, flex: 1 }}>{src.name}</p>
                  <p style={{ color: src.accentColor, fontSize: 10, fontWeight: 600 }}>
                    {src.signals.length} {src.signals.length === 1 ? 'сигнал' : 'сигнала'}
                  </p>
                </div>
                {/* Signals */}
                {src.signals.map((sig, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px',
                    borderBottom: i < src.signals.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontSize: 16, lineHeight: 1.5, flexShrink: 0 }}>{sig.emoji}</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: 12.5, fontWeight: 500, lineHeight: 1.3 }}>{sig.text}</p>
                      <p style={{ color: 'rgba(255,255,255,0.34)', fontSize: 11, marginTop: 2 }}>{sig.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* External services */}
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
