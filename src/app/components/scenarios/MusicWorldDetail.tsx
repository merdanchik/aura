import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcMusic  from '../../../assets/52729efb5574f608701f92848e1b348745677960.png';
import svcAfisha from '../../../assets/afisha.png';

const COLOR = '#BF5AF2';

// ── Data ─────────────────────────────────────────────────────────────────────

const GENRE_BARS = [
  { label: 'Джаз',      fill: 0.82, color: COLOR },
  { label: 'Ambient',   fill: 0.58, color: '#5AC8F5' },
  { label: 'Classical', fill: 0.41, color: '#5E5CE6' },
];

const EXPERIENCES = [
  {
    emoji: '🎵', title: 'Три часа без паузы',
    desc: 'Kind of Blue — третий раз за неделю. Не фон — намеренное слушание.',
    time: '2 ч назад', svc: 'Яндекс Музыка', svcColor: COLOR,
  },
  {
    emoji: '❤️', title: 'Семь лайков за вечер',
    desc: 'Nils Frahm, Sakamoto, Pärt — новый кластер открытий за один сеанс.',
    time: 'вчера', svc: 'Яндекс Музыка', svcColor: COLOR,
  },
  {
    emoji: '📋', title: 'Собрал плейлист «Ночь»',
    desc: '11 треков — только медленное и без слов.',
    time: '3 дня назад', svc: 'Яндекс Музыка', svcColor: COLOR,
  },
  {
    emoji: '🎪', title: 'Добавил концерт',
    desc: 'Nils Frahm в Москве, март — отметил «хочу пойти».',
    time: '5 дней назад', svc: 'Яндекс Афиша', svcColor: '#FF9F0A',
  },
];

const SOURCES = [
  {
    iconSrc: svcMusic, name: 'Яндекс Музыка', accentColor: COLOR,
    facts: [
      '127 прослушиваний за последние 2 недели',
      '7 лайков за один вечер — кластерное открытие',
      '3 возврата к Kind of Blue — собственный выбор, не рекомендация',
      'сессии по 50+ минут — в 2× длиннее обычного',
    ],
  },
  {
    iconSrc: svcAfisha, name: 'Яндекс Афиша', accentColor: '#FF9F0A',
    facts: [
      'Nils Frahm — добавлен в «Хочу пойти», март, Москва',
      'первый концертный план за последний месяц',
    ],
  },
];

const EXT_SOURCES = ['Spotify', 'Last.fm'];

const BENEFITS = [
  {
    icon: '🎯', title: 'Рекомендации в момент открытия',
    desc: 'Видит, что ты в периоде активного поиска — предложит новое, а не привычное',
  },
  {
    icon: '🔗', title: 'От трека до события',
    desc: 'Нашёл артиста в стриминге — Aura покажет ближайший концерт без отдельного поиска',
  },
  {
    icon: '🧠', title: 'Вкус меняется — Aura не теряет нить',
    desc: 'Фиксирует сдвиги: джаз после рок-фазы — не случайность, а новый паттерн',
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

export const MusicWorldDetail: React.FC = () => {
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
          <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>Музыка</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 2 }}>Слушает · Открывает · Собирает</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30D158', boxShadow: '0 0 6px 1px #30D15888' }} />
          <span style={{ color: '#30D158', fontSize: 11, fontWeight: 500 }}>в потоке</span>
        </div>
        <button onClick={() => navigate('/app/chat/jazz')} style={{
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
            background: `linear-gradient(140deg, ${COLOR}18 0%, rgba(22,22,24,0.96) 60%)`,
            border: `1px solid ${COLOR}30`, padding: '18px 18px 16px', marginBottom: 24,
          }}>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
              Глубокое слушание
            </p>
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 13, lineHeight: 1.55, marginBottom: 18 }}>
              Не фоновый шум — намеренные сессии. Kind of Blue в третий раз за неделю: сигнал открытия, не привычка.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {GENRE_BARS.map(d => (
                <div key={d.label} style={{ flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ width: `${d.fill * 100}%`, height: '100%', borderRadius: 2, background: d.color }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 10, fontWeight: 500 }}>{d.label}</p>
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
                      color: 'rgba(255,255,255,0.52)',
                      fontSize: 12, lineHeight: 1.55,
                      borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      paddingTop: i > 0 ? 5 : 0,
                      marginBottom: 0,
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
