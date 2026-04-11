import React from 'react';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { AuraRingsMini } from '../AuraRings';
import { StatusBadge } from './WorldDetailShared';
import type { WorldDetailData } from './worldsData';

const SEC_LABEL: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: '#98989D',
  letterSpacing: '0.08em', textTransform: 'uppercase',
  paddingLeft: 4, marginBottom: 10,
};

const CARD: React.CSSProperties = {
  backgroundColor: '#1C1C1E',
  borderRadius: 16,
  overflow: 'hidden',
};

const ROW_DIVIDER: React.CSSProperties = {
  borderBottom: '0.5px solid rgba(255,255,255,0.08)',
};

interface Props {
  data: WorldDetailData;
}

export const WorldDetailLayout: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000000',
      overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* Hero — full bleed */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top) + 12px) 20px 28px',
        background: `linear-gradient(160deg, ${data.color}30 0%, transparent 80%)`,
        marginBottom: 16,
      }}>
        {/* Status + close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <StatusBadge color={data.color} text={data.statusText} />
          <button
            onClick={() => navigate(-1 as any)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontSize: 14,
              WebkitTapHighlightColor: 'transparent',
            }}
          >✕</button>
        </div>
        {/* Title */}
        <p style={{ fontSize: 40, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.0, marginBottom: 8 }}>
          {data.title}
        </p>
        {/* Subtitle */}
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
          {data.subtitle}
        </p>
      </div>

      <div style={{ padding: '0 16px 60px' }}>

          {/* Insight card */}
          <div style={{ backgroundColor: '#1C1C1E', borderRadius: 16, padding: '16px 20px 20px', marginBottom: 28 }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.25, marginBottom: 8 }}>
              {data.heroTitle}
            </p>
            <p style={{ fontSize: 15, color: '#98989D', lineHeight: 1.55, marginBottom: 12 }}>
              {data.heroBody}
            </p>
            <p style={{ fontSize: 12, color: '#48484A' }}>
              {data.heroTemporal}
            </p>
          </div>

          {/* Инсайты */}
          <p style={SEC_LABEL}>Инсайты</p>
          <div style={{
            display: 'flex', gap: 12,
            overflowX: 'auto',
            marginLeft: -16, marginRight: -16,
            paddingLeft: 16, paddingRight: 16,
            paddingBottom: 4,
            marginBottom: 28,
          }}>
            {data.insights.map((ins, i) => (
              <div
                key={i}
                onClick={() => navigate(`/chat/${ins.contextId}`)}
                style={{
                  flexShrink: 0, width: 160,
                  backgroundColor: '#1C1C1E',
                  borderRadius: 16,
                  padding: '14px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 24, lineHeight: 1, textAlign: 'center' }}>{ins.icon}</div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', color: ins.accent, textTransform: 'uppercase', lineHeight: 1.3, textAlign: 'center' }}>
                  {ins.category}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.35, textAlign: 'center' }}>
                  {ins.text}
                </p>
              </div>
            ))}
          </div>

          {/* Источники */}
          <p style={SEC_LABEL}>Источники</p>
          <div style={{ ...CARD, marginBottom: 28 }}>
            {data.sources.map((src, i) => (
              <div
                key={src.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  ...(i < data.sources.length - 1 ? ROW_DIVIDER : {}),
                }}
              >
                {src.iconSrc
                  ? <img src={src.iconSrc} alt="" style={{
                      width: 44, height: 44, borderRadius: 12,
                      objectFit: 'cover', flexShrink: 0,
                    }} />
                  : <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      backgroundColor: `${src.accent}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: src.accent, fontSize: 14, fontWeight: 600,
                    }}>
                      {src.initials}
                    </div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 17, fontWeight: 500, color: '#FFFFFF', marginBottom: 2 }}>
                    {src.name}
                  </p>
                  <p style={{ fontSize: 13, color: '#636366', marginBottom: 2 }}>
                    {src.facts}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: src.accent }}>
                    {src.meaning}
                  </p>
                </div>
                <AuraRingsMini knowledge={72} trust={65} size={32} />
              </div>
            ))}

            {/* + Добавить источник */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderTop: '0.5px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                backgroundColor: `${data.color}14`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={18} color={data.color} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 500, color: data.color }}>
                Добавить источник
              </p>
            </div>
          </div>

          {/* Что это даёт */}
          <p style={SEC_LABEL}>Что это даёт</p>
          <div style={{ ...CARD }}>
            {data.values.map((v, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px',
                  ...(i < data.values.length - 1 ? ROW_DIVIDER : {}),
                }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  backgroundColor: data.color,
                  flexShrink: 0, marginTop: 6,
                }} />
                <p style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 1.5 }}>
                  {v}
                </p>
              </div>
            ))}
          </div>

        </div>
    </div>
  );
};
