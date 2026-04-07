import React from 'react';
import { useParams } from 'react-router';
import { ServiceId, useAura } from '../context/AuraContext';
import { AuraRings } from './AuraRings';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

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

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { services, performAction, undoAction, getServiceTheme, globalTrustScore } = useAura();

  const service = services[id as ServiceId];

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return (
      <div className="p-6 text-center text-[#98989D]">Сервис не найден</div>
    );
  }

  const sTheme = getServiceTheme(service.id);
  const allDone = service.actions.length > 0 && service.actions.every(a => a.completed);
  const isPale = service.knowledgeScore < 50 && !allDone;
  const sTrust = service.trustScore ?? globalTrustScore;
  const displayKnowledge = allDone ? 100 : service.knowledgeScore;
  const displayTrust = allDone ? 100 : sTrust;

  const k = service.knowledgeScore;
  const t = service.trustScore ?? 0;
  const combined = service.trustScore !== null ? (k + t) / 2 : k;
  let relLabel = 'новая';
  let relColor = '#636366';
  if (combined >= 70) { relLabel = 'глубокая'; relColor = '#BF5AF2'; }
  else if (combined >= 45) { relLabel = 'близкая'; relColor = '#30D158'; }
  else if (combined >= 25) { relLabel = 'знакомая'; relColor = '#FF9500'; }
  else if (service.trustScore !== null && t < 30) { relLabel = 'сложная'; relColor = '#FF3B30'; }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="pb-10"
    >
      {/* Header — sticky, Apple Fitness compact style */}
      <div className="sticky top-[65px] z-40 px-4 pt-2 pb-2">
      <div className="rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl" style={{ backgroundColor: 'rgba(28,28,30,0.75)' }}>
        {/* subtle glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 75% 50%, ${sTrust < 40 ? 'rgba(255,59,48,0.22)' : sTrust < 70 ? 'rgba(255,149,0,0.18)' : 'rgba(48,209,88,0.18)'} 0%, transparent 65%)`, filter: 'blur(16px)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(94,92,230,0.16) 0%, transparent 65%)', filter: 'blur(16px)' }} />
        <div className="flex items-center gap-4 relative z-10">
          {/* Left: text + stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[17px] text-white leading-snug" style={{ fontWeight: 600 }}>
                {isPale ? 'Мы мало знаем о вас' : 'Хорошая персонализация'}
              </p>
            </div>
            <p className="text-[12px] font-semibold mb-1" style={{ color: relColor }}>{relLabel}</p>
            <p className="text-[13px] text-[#98989D] leading-snug">
              {isPale ? 'Выполните действия, чтобы усилить ауру.' : 'Вкусы изучены, рекомендации точные.'}
            </p>
            <div className="flex gap-4 mt-3">
              <div>
                <p className="text-[11px] text-[#98989D] uppercase tracking-wide font-medium">Знания</p>
                <p className="text-[20px] font-bold" style={{ color: '#BF5AF2' }}>{service.knowledgeScore}</p>
              </div>
              {service.trustScore !== null && (
                <div>
                  <p className="text-[11px] text-[#98989D] uppercase tracking-wide font-medium">Доверие</p>
                  <p className="text-[20px] font-bold" style={{ color: service.trustScore < 40 ? '#FF3B30' : '#30D158' }}>{service.trustScore}</p>
                </div>
              )}
            </div>
          </div>
          {/* Right: rings with icon in center */}
          <div className="flex-shrink-0 relative">
            <AuraRings knowledge={displayKnowledge} trust={displayTrust} size={100} singleRing={service.trustScore === null} />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={serviceIconMap[service.id]} alt={service.name} className="w-9 h-9 rounded-[10px] object-cover" />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Scrollable content */}
      <div className="px-4">
      {/* Actions */}
      <h2 className="text-[22px] text-white px-1 mb-3 mt-4" style={{ fontWeight: 700 }}>
        Действия
      </h2>

      {service.actions.length === 0 ? (
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#1C1C1E' }}>
          <p className="text-[15px] text-[#98989D]">Нет доступных действий</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
          <AnimatePresence>
            {service.actions.map((action, idx) => {
              const isLast = idx === service.actions.length - 1;
              return (
                <motion.button
                  key={action.id}
                  onClick={() => action.completed ? undoAction(service.id, action.id) : performAction(service.id, action.id)}
                  className="w-full flex items-start gap-3.5 px-4 py-4 text-left transition-colors active:bg-white/[0.05]"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all"
                    style={{
                      backgroundColor: action.completed ? sTheme.primary : 'transparent',
                      borderColor: action.completed ? sTheme.primary : '#48484A',
                    }}
                  >
                    {action.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <div className={`flex-1 ${!isLast ? 'border-b border-white/[0.08] pb-4 -mb-4' : ''}`}>
                    <p className={`text-[17px] ${action.completed ? 'line-through text-[#98989D]' : 'text-white'}`} style={{ fontWeight: 400 }}>
                      {action.title}
                    </p>
                    <p className="text-[13px] text-[#98989D] mt-0.5 leading-snug">
                      {action.description}
                    </p>
                    {!action.completed && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {action.knowledgeBoost && (
                          <div className="inline-flex items-center text-[12px] px-2.5 py-1 rounded-full" style={{ fontWeight: 600, backgroundColor: sTheme.primary + '20', color: sTheme.primary }}>
                            +{action.knowledgeBoost}% к знанию
                          </div>
                        )}
                        {action.trustBoost && (
                          <div className="inline-flex items-center text-[12px] px-2.5 py-1 rounded-full" style={{ fontWeight: 600, backgroundColor: 'rgba(48,209,88,0.15)', color: '#30D158' }}>
                            +{action.trustBoost}% к доверию
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      </div>
    </motion.div>
  );
};