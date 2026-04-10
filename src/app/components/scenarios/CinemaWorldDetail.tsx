import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import svcKino from '../../../assets/b39f941bc25c3069b2f4719e19fdc535f4a56625.png';
import { C } from '../../styles/auraTokens';
import {
  screenBg, detailHeader, backBtn,
  heroBlock, heroTitleStyle, heroBodyStyle, heroTemporalStyle,
  valueDot, valueText,
  sourceCard, sourceIconImg, sourceBadge, sourceNameStyle, sourceFactsStyle,
} from '../../styles/auraPrimitives';
import { SecLabel, Divider } from './WorldDetailShared';

const COLOR = '#FF9F0A';

const VALUES = [
  'Помогает предлагать короткие форматы или фильмы на один вечер вместо тяжелых сериалов',
  'Улучшает тайминг пушей и напоминаний о недосмотренном',
  'Снижает когнитивную нагрузку при выборе контента на главной странице',
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
    iconSrc: svcKino,
    name:    'Кинопоиск',
    facts:   '27 фильмов в вишлисте, 3 досмотра до конца, 2 брошено',
    meaning: 'Интерес копится, но конверсия в просмотр рваная',
    accent:  COLOR,
  },
];

const EXT_SOURCES = ['Netflix', 'IMDb'];

export const CinemaWorldDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={screenBg}>

      {/* Header */}
      <div style={detailHeader}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>Кино</p>
          <p style={{ color: C.textQuiet, fontSize: 13, marginTop: 2 }}>Фильмы · Сериалы · Список</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR }} />
          <span style={{ color: COLOR, fontSize: 13, fontWeight: 500 }}>накапливает</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div style={{ padding: '22px 16px 52px' }}>

          {/* Hero */}
          <div style={heroBlock(COLOR)}>
            <p style={heroTitleStyle}>Список растёт</p>
            <p style={heroBodyStyle}>
              Сценарий просмотра показывает высокий первичный интерес, но переход в реальное длинное смотрение остаётся нестабильным и часто прерывается.
            </p>
            <p style={heroTemporalStyle}>Основано на активности за последний месяц</p>
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
