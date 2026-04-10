import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcMusic from '../../../assets/52729efb5574f608701f92848e1b348745677960.png';
import { C, S } from '../../styles/auraTokens';
import {
  screenBg, detailHeader, backBtn,
  heroBlock, heroTitleStyle, heroBodyStyle, heroTemporalStyle,
  valueDot, valueText,
  sourceCard, sourceIconImg, sourceNameStyle, sourceFactsStyle,
} from '../../styles/auraPrimitives';
import { SecLabel, Divider } from './WorldDetailShared';

const COLOR = '#BF5AF2';

const VALUES = [
  'Позволяет стартовать музыкальные сессии с нужным настроением без лишних вопросов',
  'Делает алгоритмы чувствительными к текущей фазе, а не к историческим вкусам',
  'Снижает барьер входа в интерфейсах автомобиля и умного дома',
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
    facts:   '3 возврата к альбому, сессии 50+ минут, 7 лайков',
    meaning: 'Высокая вовлечённость и осознанный выбор',
    accent:  COLOR,
  },
];

const EXT_SOURCES = ['Spotify', 'Last.fm'];

export const MusicWorldDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={screenBg}>

      {/* Header */}
      <div style={detailHeader}>
        <button onClick={() => navigate(-1)} style={backBtn}>
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
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* Hero */}
          <div style={heroBlock(COLOR)}>
            <p style={heroTitleStyle}>Глубокое слушание</p>
            <p style={heroBodyStyle}>
              Музыка сейчас переживается не как фоновый шум, а как осознанный сценарий с длинными сессиями и регулярным возвратом к выбранным альбомам.
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
            <p style={{ color: C.textTertiary, fontSize: 13 }}>Также подключены:</p>
            {EXT_SOURCES.map((name, i) => (
              <React.Fragment key={name}>
                <p style={{ color: C.textSecondary, fontSize: 13, fontWeight: 500 }}>{name}</p>
                {i < EXT_SOURCES.length - 1 && <p style={{ color: C.textQuaternary, fontSize: 13 }}>·</p>}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
