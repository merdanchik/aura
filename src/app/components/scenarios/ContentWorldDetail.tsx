import React from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

const COLOR = '#5AC8F5';

// ── Temporal state ───────────────────────────────────────────────────────────

type WorldState = 'active' | 'cooling' | 'quiet';

interface StatusConfig {
  dotColor: string;
  dotGlow:  string;
  label:    string;
  recency:  string;
}

interface DomainBar {
  label: string;
  fill:  number;
  color: string;
}

interface HeroConfig {
  headline:  string;
  body:      string;
  bars:      DomainBar[];
}

interface Experience {
  emoji:    string;
  title:    string;
  desc:     string;
  time:     string;
  svc:      string;
  svcColor: string;
}

interface Signal {
  emoji: string;
  text:  string;
  sub:   string;
}

interface StateData {
  status:      StatusConfig;
  hero:        HeroConfig;
  experiences: Experience[];
  signals:     Signal[];
}

const STATE_DATA: Record<WorldState, StateData> = {
  active: {
    status: {
      dotColor: '#30D158',
      dotGlow:  '0 0 6px 1px #30D15888',
      label:    'активен сейчас',
      recency:  '2 ч назад',
    },
    hero: {
      headline: 'Исследователь историй',
      body:     'Сейчас доминируют музыка и кино. Книги в фоне — вернулся к тексту после паузы.',
      bars: [
        { label: 'Музыка', fill: 0.82, color: '#BF5AF2' },
        { label: 'Кино',   fill: 0.71, color: '#FF9F0A' },
        { label: 'Книги',  fill: 0.36, color: '#5E5CE6' },
      ],
    },
    experiences: [
      { emoji: '🎵', title: 'Всё ещё на повторе',        desc: 'Kind of Blue — третий день подряд',              time: '2 ч назад',    svc: 'Яндекс Музыка', svcColor: '#BF5AF2' },
      { emoji: '🎬', title: 'Добавил в «Буду смотреть»', desc: 'Anatomie d\'une chute (2023)',                    time: 'вчера',        svc: 'Кинопоиск',     svcColor: '#FF9F0A' },
      { emoji: '📖', title: 'Вернулся к книге',           desc: 'Братья Карамазовы — после паузы три недели',     time: '3 дня назад',  svc: 'Яндекс Книги',  svcColor: '#5E5CE6' },
      { emoji: '🎬', title: 'Досмотрел до конца',         desc: 'The Bear — сезон 3, последние две серии сразу',  time: '5 дней назад', svc: 'Кинопоиск',     svcColor: '#FF9F0A' },
      { emoji: '🎵', title: 'Собрал плейлист',            desc: '«Для долгой поездки» — 14 треков, джаз+ambient', time: 'неделю назад', svc: 'Яндекс Музыка', svcColor: '#BF5AF2' },
    ],
    signals: [
      { emoji: '🎵', text: '127 прослушиваний',        sub: 'за последние 2 недели' },
      { emoji: '❤️', text: '14 лайков и сохранений',   sub: 'треки, фильмы, главы книг' },
      { emoji: '👁️', text: '3 досмотра до финала',     sub: 'полные просмотры без пауз' },
      { emoji: '📌', text: '5 добавлений в списки',     sub: '«Буду смотреть», «Хочу прочитать»' },
      { emoji: '🔄', text: 'Повторное слушание',        sub: '2 альбома — вернулся сам, без рекомендации' },
    ],
  },

  cooling: {
    status: {
      dotColor: '#FF9F0A',
      dotGlow:  '0 0 6px 1px #FF9F0A88',
      label:    'остывает',
      recency:  '4 дня назад',
    },
    hero: {
      headline: 'Замедление после волны',
      body:     'Активный период позади. Музыка ещё звучит фоном, кино отошло. Книга брошена.',
      bars: [
        { label: 'Музыка', fill: 0.48, color: '#BF5AF2' },
        { label: 'Кино',   fill: 0.29, color: '#FF9F0A' },
        { label: 'Книги',  fill: 0.14, color: '#5E5CE6' },
      ],
    },
    experiences: [
      { emoji: '🎵', title: 'Слушал в фоне',            desc: 'Ambient mix — без фокуса, скорее привычка',       time: '4 дня назад',  svc: 'Яндекс Музыка', svcColor: '#BF5AF2' },
      { emoji: '🎬', title: 'Прервал на середине',       desc: 'Oppenheimer — поставил на паузу, не вернулся',    time: '5 дней назад', svc: 'Кинопоиск',     svcColor: '#FF9F0A' },
      { emoji: '🎵', title: 'Запустил старый плейлист',  desc: '«Рабочее» — ничего нового не искал',             time: 'неделю назад', svc: 'Яндекс Музыка', svcColor: '#BF5AF2' },
      { emoji: '📖', title: 'Книга на паузе',            desc: 'Братья Карамазовы — не открывал 10 дней',        time: '10 дней назад',svc: 'Яндекс Книги',  svcColor: '#5E5CE6' },
    ],
    signals: [
      { emoji: '🎵', text: '31 прослушивание',          sub: 'за последние 2 недели' },
      { emoji: '👁️', text: '1 брошенный просмотр',      sub: 'менее 50% фильма' },
      { emoji: '📌', text: '0 новых добавлений',        sub: 'списки не пополнялись' },
      { emoji: '⏱️', text: 'Средняя сессия 14 мин',     sub: 'vs 47 мин в активной фазе' },
    ],
  },

  quiet: {
    status: {
      dotColor: '#636366',
      dotGlow:  '0 0 4px 1px #63636666',
      label:    'в спячке',
      recency:  '3 нед. назад',
    },
    hero: {
      headline: 'Мир на паузе',
      body:     'Контент почти не потребляется. Aura помнит вкусы — ждёт возвращения.',
      bars: [
        { label: 'Музыка', fill: 0.14, color: '#BF5AF2' },
        { label: 'Кино',   fill: 0.07, color: '#FF9F0A' },
        { label: 'Книги',  fill: 0.04, color: '#5E5CE6' },
      ],
    },
    experiences: [
      { emoji: '🎵', title: 'Случайный трек',           desc: 'Авторадио в машине — не Яндекс',                 time: '3 нед. назад', svc: 'Яндекс Музыка', svcColor: '#BF5AF2' },
      { emoji: '🎬', title: 'Ничего не смотрел',         desc: 'Вишлист не менялся',                             time: '3 нед. назад', svc: 'Кинопоиск',     svcColor: '#FF9F0A' },
      { emoji: '📖', title: 'Книга закрыта',             desc: 'Братья Карамазовы — страница 214, не двигается', time: '3 нед. назад', svc: 'Яндекс Книги',  svcColor: '#5E5CE6' },
      { emoji: '💤', title: 'Сигналов нет',              desc: 'Лайков, сохранений, добавлений — ноль',          time: '3 нед. назад', svc: 'Aura',          svcColor: '#636366' },
    ],
    signals: [
      { emoji: '😶', text: '3 прослушивания',           sub: 'за последние 2 недели' },
      { emoji: '🚫', text: 'Нет лайков',                sub: 'ни одного за 3 недели' },
      { emoji: '🔕', text: 'Рекомендации проигнорированы', sub: 'показаны, не нажаты' },
      { emoji: '📉', text: 'Активность −94%',           sub: 'относительно пика 4 нед. назад' },
    ],
  },
};

const STATE_ORDER: WorldState[] = ['active', 'cooling', 'quiet'];

const STATE_LABELS: Record<WorldState, string> = {
  active:  'Активен',
  cooling: 'Остывает',
  quiet:   'Тихо',
};

const STATE_COLORS: Record<WorldState, string> = {
  active:  '#30D158',
  cooling: '#FF9F0A',
  quiet:   '#636366',
};

// ── Static data (unchanged across states) ────────────────────────────────────

const YANDEX_CONTRIBUTORS = [
  { name: 'Яндекс Музыка', role: 'прослушивания, лайки, плейлисты' },
  { name: 'Кинопоиск',     role: 'просмотры, вишлист, рейтинги' },
  { name: 'Яндекс Книги',  role: 'чтение, прогресс, закладки' },
];

const EXT_CONTRIBUTORS = [
  { name: 'Spotify',  role: 'треки, плейлисты' },
  { name: 'YouTube',  role: 'видео, подписки' },
  { name: 'Bookmate', role: 'книги, прогресс' },
];

const BENEFITS = [
  { icon: '🎯', title: 'Рекомендации знают контекст',  desc: 'Видит, что ты сейчас в медленной волне — не предложит попсу' },
  { icon: '🔗', title: 'Связность между сервисами',    desc: 'Книга перетекает в подкаст, фильм — в похожий, без повторного поиска' },
  { icon: '▶️', title: 'Следующий шаг уже готов',      desc: 'Что смотреть, слушать или читать — без поиска с нуля' },
  { icon: '🧠', title: 'Реальный вкусовой профиль',    desc: 'Не «жанры», а поведение: темп, настроение, глубина погружения' },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const SecLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11, fontWeight: 600, letterSpacing: 0.9, textTransform: 'uppercase', marginBottom: 12 }}>
    {children}
  </p>
);

const Divider: React.FC = () => (
  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
);

// ── Main ─────────────────────────────────────────────────────────────────────

export const ContentWorldDetail: React.FC = () => {
  const navigate = useNavigate();
  const [worldState, setWorldState] = React.useState<WorldState>('active');

  const data      = STATE_DATA[worldState];
  const stColor   = STATE_COLORS[worldState];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* ── A. Header ── */}
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
          <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>Контент</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 2 }}>Музыка · Кино · Книги</p>
        </div>

        {/* Freshness badge — animates when state changes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={worldState}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: data.status.dotColor,
              boxShadow: data.status.dotGlow,
            }} />
            <span style={{ color: data.status.dotColor, fontSize: 11, fontWeight: 500 }}>
              {data.status.label}
            </span>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => navigate('/app/chat/cinema')}
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

          {/* ── B. Hero summary ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-${worldState}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                borderRadius: 18,
                background: `linear-gradient(140deg, ${stColor}12 0%, rgba(28,28,30,0.9) 65%)`,
                border: `1px solid ${stColor}28`,
                padding: '18px 18px 16px',
                marginBottom: 24,
              }}
            >
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
                {data.hero.headline}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13, lineHeight: 1.55, marginBottom: 16 }}>
                {data.hero.body}
              </p>

              {/* Domain activity mini-bars */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {data.hero.bars.map(d => (
                  <div key={d.label} style={{ flex: 1 }}>
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 5 }}>
                      <div style={{ width: `${d.fill * 100}%`, height: '100%', borderRadius: 2, background: d.color }} />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 500 }}>{d.label}</p>
                  </div>
                ))}
              </div>

              {/* ── Demo switcher ── */}
              <div style={{
                display: 'flex', gap: 6,
                borderTop: '1px solid rgba(255,255,255,0.07)',
                paddingTop: 14,
              }}>
                {STATE_ORDER.map(s => {
                  const active = worldState === s;
                  const c = STATE_COLORS[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setWorldState(s)}
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: 8,
                        border: active ? `1px solid ${c}66` : '1px solid rgba(255,255,255,0.08)',
                        background: active ? `${c}1E` : 'rgba(255,255,255,0.04)',
                        color: active ? c : 'rgba(255,255,255,0.32)',
                        fontSize: 11,
                        fontWeight: active ? 600 : 500,
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        transition: 'background 0.18s, border-color 0.18s, color 0.18s',
                      }}
                    >
                      {STATE_LABELS[s]}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── C. Experiences ── */}
          <SecLabel>Что происходило</SecLabel>
          <AnimatePresence mode="wait">
            <motion.div
              key={`exp-${worldState}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: 4 }}
            >
              {data.experiences.map((exp, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: `${exp.svcColor}14`,
                      border: `1px solid ${exp.svcColor}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 17, flexShrink: 0,
                    }}>
                      {exp.emoji}
                    </div>
                    {i < data.experiences.length - 1 && (
                      <div style={{ width: 1, flex: 1, minHeight: 14, background: 'rgba(255,255,255,0.07)', marginTop: 4 }} />
                    )}
                  </div>

                  <div style={{ flex: 1, paddingBottom: 14 }}>
                    <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{exp.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.46)', fontSize: 12.5, marginTop: 2, lineHeight: 1.4 }}>{exp.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                      <span style={{
                        background: `${exp.svcColor}14`,
                        border: `1px solid ${exp.svcColor}30`,
                        borderRadius: 8, padding: '2px 9px',
                        color: exp.svcColor, fontSize: 11, fontWeight: 500,
                      }}>
                        {exp.svc}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.26)', fontSize: 11 }}>{exp.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <Divider />

          {/* ── D. Signals ── */}
          <SecLabel>Откуда Aura это знает</SecLabel>
          <AnimatePresence mode="wait">
            <motion.div
              key={`sig-${worldState}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                borderRadius: 16,
                background: '#1C1C1E',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
                marginBottom: 4,
              }}
            >
              {data.signals.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 16px',
                  borderBottom: i < data.signals.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{s.emoji}</span>
                  <div>
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{s.text}</p>
                    <p style={{ color: 'rgba(255,255,255,0.34)', fontSize: 11, marginTop: 1 }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <Divider />

          {/* ── E. Service contributors (static) ── */}
          <SecLabel>Кто подпитывает этот мир</SecLabel>

          <p style={{ color: 'rgba(255,255,255,0.26)', fontSize: 11, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Яндекс
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {YANDEX_CONTRIBUTORS.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#1C1C1E', borderRadius: 12, padding: '11px 14px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: COLOR, flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{c.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.34)', fontSize: 11 }}>{c.role}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.26)', fontSize: 11, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Внешние сервисы
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            {EXT_CONTRIBUTORS.map((c, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 11, padding: '8px 13px',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, fontWeight: 500 }}>{c.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10.5, marginTop: 1 }}>{c.role}</p>
              </div>
            ))}
          </div>

          <Divider />

          {/* ── F. Benefits (static) ── */}
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
