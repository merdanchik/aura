import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcMusic from '../../../assets/52729efb5574f608701f92848e1b348745677960.png';
import svcKino  from '../../../assets/b39f941bc25c3069b2f4719e19fdc535f4a56625.png';
import svcBooks from '../../../assets/94e2bb438930a86c21d001934a49869c8425f73a.png';
import { C } from '../../styles/auraTokens';
import {
  screenBg, detailHeader, backBtn, chatBtnBase,
  heroBlock, heroTitleStyle, heroBodyStyle, heroTemporalStyle,
  valueDot, valueText,
  sourceCard, sourceIconImg, sourceNameStyle, sourceFactsStyle,
} from '../../styles/auraPrimitives';
import { SecLabel, Divider } from './WorldDetailShared';

const COLOR = '#5AC8F5';

const VALUES = [
  'Позволяет связать музыкальный, кинематографический и книжный контекст в одном сценарии',
  'Рекомендации учитывают текущий баланс между медиа, а не отдельные вкусы',
  'Помогает ассистенту понять полный информационный фон, а не только одну его часть',
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
    facts:   '127 прослушиваний за 2 недели, 14 лайков, 3 возврата к альбому',
    meaning: 'Доминирующая активность — намеренное слушание, не фон',
    accent:  '#BF5AF2',
  },
  {
    iconSrc: svcKino,
    name:    'Кинопоиск',
    facts:   '3 досмотра до финала, 5 добавлений в список, 2 брошено',
    meaning: 'Конкретные намерения при просмотре, список растёт',
    accent:  '#FF9F0A',
  },
  {
    iconSrc: svcBooks,
    name:    'Яндекс Книги',
    facts:   'Братья Карамазовы — вернулся после паузы три недели',
    meaning: 'Периодическое возвращение к тексту',
    accent:  '#5E5CE6',
  },
];

const EXT_SOURCES = ['Spotify', 'YouTube', 'Bookmate'];

export const ContentWorldDetail: React.FC = () => {
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
          <p style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>Контент</p>
          <p style={{ color: C.textQuiet, fontSize: 13, marginTop: 2 }}>Музыка · Кино · Книги</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.active }} />
          <span style={{ color: C.active, fontSize: 13, fontWeight: 500 }}>активен сейчас</span>
        </div>
        <button onClick={() => navigate('/app/chat/cinema')} style={chatBtnBase(COLOR)}>💬</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* Hero */}
          <div style={heroBlock(COLOR)}>
            <p style={heroTitleStyle}>Музыка и кино доминируют</p>
            <p style={heroBodyStyle}>
              Сейчас основная активность сосредоточена в музыке и кино. Книги не исчезли — остаются живым, но фоновым слоем интереса.
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
