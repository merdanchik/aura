import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { C } from '../../styles/auraTokens';
import {
  screenBg, detailHeader,
  detailHeaderTitle, detailHeaderSubtitle,
  heroBlock, heroTitleStyle, heroBodyStyle, heroTemporalStyle,
  valueDot, valueText,
  sourceCard, sourceIconImg, sourceBadge, sourceNameStyle, sourceFactsStyle,
} from '../../styles/auraPrimitives';
import { SecLabel, Divider, StatusBadge } from './WorldDetailShared';
import type { WorldDetailData } from './worldsData';

interface Props {
  data: WorldDetailData;
}

export const WorldDetailLayout: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromWorlds = (location.state as any)?.fromWorlds;

  const goBack = () => navigate('/', fromWorlds ? { state: { showWorlds: true } } : undefined);

  return (
    <div style={screenBg}>

      {/* Header */}
      <div style={detailHeader}>
        {/* Навигация */}
        <button onClick={goBack} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          color: data.color, padding: 0,
          WebkitTapHighlightColor: 'transparent',
        }}>
          <ChevronLeft size={15} />
          <span style={{ fontSize: 15, fontWeight: 500 }}>Жизненные миры</span>
        </button>
        {/* Заголовок */}
        <p style={detailHeaderTitle}>{data.title}</p>
        {/* Подзаголовок + статус */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={detailHeaderSubtitle}>{data.subtitle}</p>
          <StatusBadge color={data.color} text={data.statusText} />
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* Hero */}
          <div style={heroBlock(data.color)}>
            <p style={heroTitleStyle}>{data.heroTitle}</p>
            <p style={heroBodyStyle}>{data.heroBody}</p>
            <p style={heroTemporalStyle}>{data.heroTemporal}</p>
          </div>

          {/* Что это даёт */}
          <SecLabel>Что это даёт</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 4 }}>
            {data.values.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={valueDot(data.color)} />
                <p style={valueText}>{v}</p>
              </div>
            ))}
          </div>

          <Divider />

          {/* Источники */}
          <SecLabel>Источники</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {data.sources.map(src => (
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

          {/* Также подключены */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <p style={{ color: C.textTertiary, fontSize: 13 }}>Также подключены:</p>
            {data.extSources.map((name, i) => (
              <React.Fragment key={name}>
                <p style={{ color: C.textSecondary, fontSize: 13, fontWeight: 500 }}>{name}</p>
                {i < data.extSources.length - 1 && (
                  <p style={{ color: C.textQuaternary, fontSize: 13 }}>·</p>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
