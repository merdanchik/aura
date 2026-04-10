import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcTravel from '../../../assets/travel.png';
import { C } from '../../styles/auraTokens';
import {
  screenBg, detailHeader, backBtn, chatBtnBase,
  heroBlock, heroTitleStyle, heroBodyStyle, heroTemporalStyle,
  valueDot, valueText,
  sourceCard, sourceIconImg, sourceBadge, sourceNameStyle, sourceFactsStyle,
} from '../../styles/auraPrimitives';
import { SecLabel, Divider } from './WorldDetailShared';

const COLOR = '#00C7BE';

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

export const TravelWorldDetail: React.FC = () => {
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
          <p style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>Путешествия</p>
          <p style={{ color: C.textQuiet, fontSize: 13, marginTop: 2 }}>Маршруты · Места · Логистика</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR }} />
          <span style={{ color: COLOR, fontSize: 13, fontWeight: 500 }}>планирует</span>
        </div>
        <button onClick={() => navigate('/app/chat/baikal')} style={chatBtnBase(COLOR)}>💬</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* Hero */}
          <div style={heroBlock(COLOR)}>
            <p style={heroTitleStyle}>План становится конкретным</p>
            <p style={heroBodyStyle}>
              Тбилиси, июнь. Уже есть направление, даты и первые сохранения — план движется к конкретной поездке.
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
                {src.iconSrc
                  ? <img src={src.iconSrc} alt="" style={sourceIconImg} />
                  : <div style={sourceBadge(src.accent)}>{src.initials}</div>
                }
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
