import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcMusic  from '../../../assets/52729efb5574f608701f92848e1b348745677960.png';
import svcAfisha from '../../../assets/afisha.png';
import { C, S } from '../../styles/auraTokens';
import {
  screenBg, detailHeader, backBtn, chatBtnBase,
  heroBlock, heroTitleStyle, heroBodyStyle, heroTemporalStyle,
  valueDot, valueText,
  sourceCard, sourceIconImg, sourceNameStyle, sourceFactsStyle,
} from '../../styles/auraPrimitives';
import { SecLabel, Divider } from './WorldDetailShared';

const COLOR = '#BF5AF2';

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

export const MusicWorldDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromWorlds = (location.state as any)?.fromWorlds;

  const goBack = () => navigate('/scenarios', fromWorlds ? { state: { showWorlds: true } } : undefined);

  return (
    <div style={screenBg}>

      {/* Header */}
      <div style={detailHeader}>
        <button onClick={goBack} style={backBtn}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>Музыка</p>
          <p style={{ color: C.textQuiet, fontSize: 13, marginTop: 2 }}>Слушает · Открывает · Собирает</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.active }} />
          <span style={{ color: C.active, fontSize: 13, fontWeight: 500 }}>в потоке</span>
        </div>
        <button onClick={() => navigate('/app/chat/jazz')} style={chatBtnBase(COLOR)}>💬</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* Hero */}
          <div style={heroBlock(COLOR)}>
            <p style={heroTitleStyle}>Глубокое слушание</p>
            <p style={heroBodyStyle}>
              Не просто слушает в фоне — уходит в намеренные, повторяющиеся длинные сессии.
            </p>
            <p style={heroTemporalStyle}>Основано на активности за последние 2 недели</p>
          </div>

          {/* Что это даёт */}
          <SecLabel>Что это даёт</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 4 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={valueDot(COLOR)} />
                <p style={valueText}>{v}</p>
              </div>
            ))}
          </div>

          <Divider />

          {/* Источники */}
          <SecLabel>Источники</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {SOURCES.map(src => (
              <div key={src.name} style={sourceCard}>
                <img src={src.iconSrc} alt="" style={sourceIconImg} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={sourceNameStyle}>{src.name}</p>
                  <p style={sourceFactsStyle}>{src.facts}</p>
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
