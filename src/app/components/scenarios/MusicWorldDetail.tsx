import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcMusic  from '../../../assets/52729efb5574f608701f92848e1b348745677960.png';
import svcAfisha from '../../../assets/afisha.png';

const COLOR = '#BF5AF2';

// ── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  'Позволяет начать с релевантного сценария без дополнительных вопросов',
  'Делает рекомендации точнее по текущей фазе, а не по старым вкусам',
  'Помогает ассистенту говорить в правильном музыкальном контексте',
];

interface Source {
  iconSrc: string;
  name:    string;
  facts:   string;
  meaning: string;
  accent:  string;
}

const SOURCES: Source[] = [
  {
    iconSrc: svcMusic,
    name:    'Яндекс Музыка',
    facts:   '127 прослушиваний за 2 недели, 14 лайков, 3 возврата к Kind of Blue',
    meaning: 'Устойчивое повторное внимание — не фон, а выбор',
    accent:  COLOR,
  },
  {
    iconSrc: svcAfisha,
    name:    'Яндекс Афиша',
    facts:   'Nils Frahm — в «Хочу пойти», март, Москва · первый концертный план за месяц',
    meaning: 'Интерес выходит за пределы стриминга',
    accent:  '#FF9F0A',
  },
];

const EXT_SOURCES = ['Spotify', 'Last.fm'];

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

export const MusicWorldDetail: React.FC = () => {
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
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>Музыка</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginTop: 2 }}>Слушает · Открывает · Собирает</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30D158' }} />
          <span style={{ color: '#30D158', fontSize: 13, fontWeight: 500 }}>в потоке</span>
        </div>
        <button onClick={() => navigate('/app/chat/jazz')} style={{
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
              Глубокое слушание
            </p>
            <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 16, lineHeight: 1.55, marginBottom: 16 }}>
              Не просто слушает — уходит в повторяющиеся длинные сессии.
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
                <img
                  src={src.iconSrc} alt=""
                  style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                />
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
