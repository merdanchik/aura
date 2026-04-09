import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { ServiceId, useAura } from '../context/AuraContext';
import { AuraRings } from './AuraRings';
import { motion, AnimatePresence } from 'motion/react';

import iconMusic from "figma:asset/52729efb5574f608701f92848e1b348745677960.png";
import iconKinopoisk from "figma:asset/b39f941bc25c3069b2f4719e19fdc535f4a56625.png";
import iconBooks from "figma:asset/94e2bb438930a86c21d001934a49869c8425f73a.png";
import iconMarket from "figma:asset/873668dc7d9e7bd9c16444667bc68a762e2b3499.png";
import iconSplit from "figma:asset/1f449fc2f45163f28ee9045765bf74d1029f8916.png";
import iconTaxi from "../../assets/taxi.png";
import iconPay from "../../assets/pay.png";
import iconScooters from "../../assets/scooters.png";
import iconFood from "../../assets/food.png";
import iconAfisha from "../../assets/afisha.png";
import iconTravel from "../../assets/travel.png";

const serviceIconMap: Record<string, string> = {
  music: iconBooks,
  kinopoisk: iconKinopoisk,
  books: iconMusic,
  market: iconMarket,
  split: iconSplit,
  taxi: iconTaxi,
  pay: iconPay,
  scooters: iconScooters,
  food: iconFood,
  afisha: iconAfisha,
  travel: iconTravel,
};

function getStatusText(score: number): { title: string; subtitle: React.ReactNode } {
  if (score >= 90) return { title: 'Идеальная персонализация',    subtitle: 'Вкусы полностью изучены.' };
  if (score >= 70) return { title: 'Отличная персонализация',     subtitle: 'Рекомендации становятся очень точными.' };
  if (score >= 50) return { title: 'Хорошая персонализация',      subtitle: 'Вкусы изучены, рекомендации точные.' };
  if (score >= 35) return { title: 'Мы начинаем вас понимать',   subtitle: 'Продолжайте — алгоритм учится.' };
  if (score >= 20) return { title: 'Мы мало знаем о вас',        subtitle: <>Выполните действия,<br />чтобы усилить ауру.</> };
  return                  { title: 'Мы почти не знаем вас',      subtitle: <>Выполните действия,<br />чтобы усилить ауру.</> };
}

// Derive a dark gradient background from the service's brand color
function heroGradient(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const mid = `#${((1 << 24) | (Math.round(r * 0.32) << 16) | (Math.round(g * 0.32) << 8) | Math.round(b * 0.32)).toString(16).slice(1)}`;
  const dark = `#${((1 << 24) | (Math.round(r * 0.14) << 16) | (Math.round(g * 0.14) << 8) | Math.round(b * 0.14)).toString(16).slice(1)}`;
  return `radial-gradient(ellipse at 50% 38%, ${mid} 0%, ${dark} 58%, #060606 100%)`;
}

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services } = useAura();

  const service = services[id as ServiceId];

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return <div className="p-6 text-center text-[#98989D]">Сервис не найден</div>;
  }

  const allDone = service.actions.length > 0 && service.actions.every(a => a.completed);
  const displayKnowledge = allDone ? 100 : service.knowledgeScore;
  const displayTrust = allDone ? 100 : (service.trustScore ?? 0);
  const hasTrust = service.trustScore !== null;
  const trustColor = displayTrust < 40 ? '#FF3B30' : displayTrust < 70 ? '#FF9500' : '#30D158';

  const scoreForStatus = hasTrust ? (displayKnowledge + displayTrust) / 2 : displayKnowledge;
  const { title: statusTitle, subtitle: statusSubtitle } = getStatusText(scoreForStatus);

  const k = service.knowledgeScore;
  const t = service.trustScore ?? 0;
  const combined = hasTrust ? (k + t) / 2 : k;
  let relLabel = 'новая';
  let relColor = 'rgba(255,255,255,0.38)';
  if (combined >= 70)       { relLabel = 'глубокая';  relColor = '#BF5AF2'; }
  else if (combined >= 45)  { relLabel = 'близкая';   relColor = '#30D158'; }
  else if (combined >= 25)  { relLabel = 'знакомая';  relColor = '#FF9500'; }
  else if (hasTrust && t < 30) { relLabel = 'сложная'; relColor = '#FF3B30'; }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="pb-12"
    >
      {/* ── Hero — extends behind sticky header (65px) ── */}
      <div
        style={{
          background: heroGradient(service.color),
          borderRadius: '0 0 28px 28px',
          marginTop: -65,
          paddingTop: 93,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 34,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top-edge shine */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 38%)',
        }} />

        {/* Hero body: rings LEFT, content RIGHT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>

          {/* Left: Rings + icon */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <AuraRings
              knowledge={displayKnowledge}
              trust={displayTrust}
              size={148}
              singleRing={!hasTrust}
            />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img
                src={serviceIconMap[service.id]}
                alt={service.name}
                style={{ width: 58, height: 58, borderRadius: 14, objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Right: label + title + subtitle + scores */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Relationship label */}
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: relColor, marginBottom: 5 }}>
              {relLabel}
            </p>

            {/* Status title — animates on change */}
            <AnimatePresence mode="wait">
              <motion.p
                key={statusTitle}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22 }}
                style={{ fontSize: 20, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 6 }}
              >
                {statusTitle}
              </motion.p>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={statusTitle + '-sub'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, delay: 0.05 }}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.46)', lineHeight: 1.45, marginBottom: 18 }}
              >
                {statusSubtitle}
              </motion.p>
            </AnimatePresence>

            {/* Scores */}
            <div style={{ display: 'flex', gap: 16 }}>
              {hasTrust && (
                <div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>Доверие</p>
                  <p style={{ fontSize: 26, fontWeight: 600, color: trustColor, lineHeight: 1 }}>
                    {displayTrust}/100
                  </p>
                </div>
              )}
              <div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>Знания</p>
                <p style={{ fontSize: 26, fontWeight: 600, color: '#BF5AF2', lineHeight: 1 }}>
                  {displayKnowledge}/100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions list ── */}
      <div className="px-4 mt-6">
        {service.actions.length === 0 ? (
          <p style={{ color: '#636366', textAlign: 'center', fontSize: 15, padding: '24px 0' }}>
            Нет доступных действий
          </p>
        ) : (
          <div>
            {service.actions.map((action, idx) => {
              const isLast = idx === service.actions.length - 1;
              return (
                <button
                  key={action.id}
                  onClick={() => !action.completed && navigate(`/service/${service.id}/chat/${action.id}`)}
                  className="w-full text-left active:opacity-60 transition-opacity"
                  style={{ cursor: action.completed ? 'default' : 'pointer' }}
                >
                  <div style={{
                    paddingTop: 15,
                    paddingBottom: 15,
                    borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.16)',
                  }}>
                    <p style={{
                      fontSize: 17,
                      fontWeight: 400,
                      color: action.completed ? '#48484A' : 'white',
                      textDecoration: action.completed ? 'line-through' : 'none',
                      lineHeight: 1.3,
                    }}>
                      {action.title}
                    </p>
                    <p style={{ fontSize: 13, color: action.completed ? '#3A3A3C' : '#636366', marginTop: 3, lineHeight: 1.4 }}>
                      {action.description}
                    </p>
                    {!action.completed && (action.knowledgeBoost || action.trustBoost) && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                        {action.knowledgeBoost && (
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            padding: '3px 8px', borderRadius: 10,
                            backgroundColor: 'rgba(191,90,242,0.14)',
                            color: '#BF5AF2',
                          }}>
                            +{action.knowledgeBoost} знания
                          </span>
                        )}
                        {action.trustBoost && (
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            padding: '3px 8px', borderRadius: 10,
                            backgroundColor: 'rgba(48,209,88,0.14)',
                            color: '#30D158',
                          }}>
                            +{action.trustBoost} доверие
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
