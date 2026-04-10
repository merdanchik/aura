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
  'Позволяет бесшовно склеивать контекст пользователя при переходе между медиа-сервисами',
  'Балансирует рекомендации, не перегружая один формат за счёт других',
  'Даёт ассистенту полный информационный профиль для точного поддержания разговора',
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
    facts:   '127 прослушиваний, 14 лайков',
    meaning: 'Активное ежедневное потребление',
    accent:  '#BF5AF2',
  },
  {
    iconSrc: svcKino,
    name:    'Кинопоиск',
    facts:   '3 досмотра, 5 в вишлисте',
    meaning: 'Растущий интерес к долгим форматам',
    accent:  '#FF9F0A',
  },
  {
    iconSrc: svcBooks,
    name:    'Яндекс Книги',
    facts:   'Возврат к чтению после паузы',
    meaning: 'Фоновое, но устойчивое погружение',
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
              Сейчас внимание распределено между несколькими форматами. Музыка и кино формируют основной интерес, а книги остаются живым фоновым слоем после недавней паузы.
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
