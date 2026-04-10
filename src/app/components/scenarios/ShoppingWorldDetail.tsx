import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcMarket from '../../../assets/873668dc7d9e7bd9c16444667bc68a762e2b3499.png';
import { C } from '../../styles/auraTokens';
import {
  screenBg, detailHeader, backBtn,
  heroBlock, heroTitleStyle, heroBodyStyle, heroTemporalStyle,
  valueDot, valueText,
  sourceCard, sourceIconImg, sourceBadge, sourceNameStyle, sourceFactsStyle,
} from '../../styles/auraPrimitives';
import { SecLabel, Divider } from './WorldDetailShared';

const COLOR = '#FF6633';

const VALUES = [
  'Открывает более агрессивный и точный checkout flow без лишних шагов',
  'Позволяет предлагать универсальный Сплит в нужный момент принятия решения',
  'Фокусирует рекомендации на добивке конкретного намерения, а не на холодном поиске',
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
    iconSrc: svcMarket,
    name:    'Яндекс Маркет',
    facts:   '8 возвратов к товару, 12 сравнений, 3 в корзине',
    meaning: 'Глубокий research перед финальной транзакцией',
    accent:  COLOR,
  },
];

const EXT_SOURCES = ['Wildberries', 'Ozon'];

export const ShoppingWorldDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={screenBg}>

      {/* Header */}
      <div style={detailHeader}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>Шопинг</p>
          <p style={{ color: C.textQuiet, fontSize: 13, marginTop: 2 }}>Поиск · Сравнение · Решение</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR }} />
          <span style={{ color: COLOR, fontSize: 13, fontWeight: 500 }}>наблюдает</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* Hero */}
          <div style={heroBlock(COLOR)}>
            <p style={heroTitleStyle}>Решение созревает</p>
            <p style={heroBodyStyle}>
              Пользователь перешёл от случайного поиска к активному выбору. Решение о покупке почти сформировано, но ещё требует сравнения альтернатив.
            </p>
            <p style={heroTemporalStyle}>Основано на активности за последние 10 дней</p>
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
