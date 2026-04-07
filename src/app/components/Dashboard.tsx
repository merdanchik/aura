import React, { useState } from 'react';
import { useAura } from '../context/AuraContext';
import { AuraRings, AuraRingsMini } from './AuraRings';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Service icons
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

const PRIMARY_SERVICES = ['music', 'kinopoisk', 'books', 'market', 'split'];

export const Dashboard = () => {
  const { services, globalTrustScore, globalKnowledgeScore, overallScore, theme, triggerEvent } = useAura();
  const navigate = useNavigate();
  const isTrustCritical = globalTrustScore < 50;
  const [servicesExpanded, setServicesExpanded] = useState(false);

  const trustDotGradient = globalTrustScore < 40
    ? 'linear-gradient(135deg, #FF3B30, #FF6961)'
    : globalTrustScore < 70
      ? 'linear-gradient(135deg, #FF9500, #FFCC00)'
      : 'linear-gradient(135deg, #30D158, #4ADE80)';

  return (
    <div className="px-4 pb-10 pt-2">
      {/* Main rings card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl overflow-hidden mb-4 relative"
      >
        {/* Glow effect */}
        {(() => {
          const trustGlow = globalTrustScore < 40 ? 'rgba(255,59,48,0.22)' : globalTrustScore < 70 ? 'rgba(255,149,0,0.18)' : 'rgba(48,209,88,0.18)';
          return <>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 65% 55%, ${trustGlow} 0%, transparent 60%)`, filter: 'blur(24px)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 35% 45%, rgba(94,92,230,0.18) 0%, transparent 60%)', filter: 'blur(24px)' }} />
          </>;
        })()}
        <div className="flex flex-col items-center pt-6 pb-2 relative z-10">
          {/* Rings */}
          <div className="relative">
            <AuraRings knowledge={globalKnowledgeScore} trust={globalTrustScore} size={220} />
            {/* Center score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[48px] text-white" style={{ fontWeight: 700, lineHeight: 1 }}>
                {Math.round(overallScore)}
              </p>
              <p className="text-[12px] text-[#98989D] mt-1" style={{ fontWeight: 500 }}>из 100</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 pb-5 pt-1">
          <div>
            <p className="text-[13px] text-[#98989D]" style={{ fontWeight: 500 }}>Знания</p>
            <p className="text-[28px]" style={{ fontWeight: 700, color: '#BF5AF2' }}>
              {Math.round(globalKnowledgeScore)}/100
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#98989D]" style={{ fontWeight: 500 }}>Доверие</p>
            <p className="text-[28px]" style={{ fontWeight: 700, color: globalTrustScore < 40 ? '#FF3B30' : globalTrustScore < 70 ? '#FF9500' : '#30D158' }}>
              {Math.round(globalTrustScore)}/100
            </p>
          </div>
        </div>
      </motion.div>


      {/* Services + Relationship merged — MOVED UP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5"
      >
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">
          Сервисы
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
          {Object.values(services)
            .filter(s => servicesExpanded || PRIMARY_SERVICES.includes(s.id))
            .map((service, idx, arr) => {
              const isLast = idx === arr.length - 1 && servicesExpanded;
              const allDone = service.actions.length > 0 && service.actions.every(a => a.completed);
              const k = allDone ? 100 : service.knowledgeScore;
              const t = allDone ? 100 : (service.trustScore ?? 0);
              const sTrust = allDone ? 100 : (service.trustScore ?? globalTrustScore);
              const combined = service.trustScore !== null ? (k + t) / 2 : k;

              let label = 'новая';
              let labelColor = '#636366';
              if (combined >= 70) { label = 'глубокая'; labelColor = '#BF5AF2'; }
              else if (combined >= 45) { label = 'близкая'; labelColor = '#30D158'; }
              else if (combined >= 25) { label = 'знакомая'; labelColor = '#FF9500'; }
              else if (service.trustScore !== null && t < 30) { label = 'сложная'; labelColor = '#FF3B30'; }

              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/[0.05] transition-colors text-left"
                >
                  <img
                    src={serviceIconMap[service.id]}
                    alt={service.name}
                    className="w-11 h-11 rounded-[12px] object-cover flex-shrink-0"
                  />
                  <div className={`flex-1 min-w-0 flex items-center gap-3 ${!isLast ? 'border-b border-white/[0.08] pb-3.5 -mb-3.5' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[17px] text-white truncate" style={{ fontWeight: 500 }}>{service.name}</p>
                      <p className="text-[13px] mt-0.5" style={{ color: labelColor, fontWeight: 500 }}>{label}</p>
                    </div>
                    <AuraRingsMini knowledge={k} trust={sTrust} size={38} className="flex-shrink-0" singleRing={service.trustScore === null} />
                    <ChevronRight className="w-4 h-4 text-[#48484A] flex-shrink-0" />
                  </div>
                </motion.button>
              );
            })}

          {/* Expand button */}
          <button
            onClick={() => setServicesExpanded(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-3.5 border-t border-white/[0.08] active:bg-white/[0.05] transition-colors"
          >
            <span className="text-[15px] text-[#98989D]" style={{ fontWeight: 500 }}>
              {servicesExpanded ? 'Скрыть' : 'Ещё сервисы'}
            </span>
            <motion.div animate={{ rotate: servicesExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-4 h-4 text-[#48484A]" />
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Memories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mt-5"
      >
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">
          Воспоминания
        </p>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scrollbar-hide pb-1">
          {[
            {
              title: 'Вечер с Кинопоиском',
              label: 'Кинопоиск',
              date: 'Сегодня',
              bg: '#1a0500',
              blobs: [
                { x: '20%', y: '20%', color: 'rgba(220,60,0,0.75)', size: '70%' },
                { x: '60%', y: '50%', color: 'rgba(120,20,0,0.5)', size: '60%' },
                { x: '10%', y: '70%', color: 'rgba(255,100,0,0.3)', size: '50%' },
              ],
            },
            {
              title: 'Дождливые пятницы',
              label: 'Музыка',
              date: 'Октябрь 2024',
              bg: '#001a0a',
              blobs: [
                { x: '50%', y: '15%', color: 'rgba(0,200,80,0.6)', size: '65%' },
                { x: '10%', y: '50%', color: 'rgba(180,220,0,0.4)', size: '55%' },
                { x: '60%', y: '65%', color: 'rgba(0,140,60,0.5)', size: '50%' },
              ],
            },
            {
              title: 'Ночные сессии',
              label: 'Электроника',
              date: 'Ноябрь 2024',
              bg: '#08001f',
              blobs: [
                { x: '30%', y: '25%', color: 'rgba(160,60,255,0.7)', size: '70%' },
                { x: '65%', y: '55%', color: 'rgba(80,0,200,0.5)', size: '55%' },
                { x: '15%', y: '65%', color: 'rgba(220,100,255,0.3)', size: '45%' },
              ],
            },
            {
              title: 'Осенний марафон',
              label: 'Книги',
              date: 'Сентябрь 2024',
              bg: '#1a0c00',
              blobs: [
                { x: '60%', y: '20%', color: 'rgba(255,140,0,0.65)', size: '65%' },
                { x: '15%', y: '45%', color: 'rgba(200,80,0,0.5)', size: '55%' },
                { x: '50%', y: '70%', color: 'rgba(255,200,0,0.3)', size: '45%' },
              ],
            },
          ].map((mem, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[155px] h-[200px] rounded-2xl flex flex-col justify-between p-4 relative overflow-hidden"
              style={{ backgroundColor: mem.bg }}
            >
              {mem.blobs.map((blob, j) => (
                <div
                  key={j}
                  className="absolute pointer-events-none"
                  style={{
                    left: blob.x, top: blob.y,
                    width: blob.size, height: blob.size,
                    background: `radial-gradient(circle, ${blob.color} 0%, transparent 68%)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
              <p className="text-[11px] text-white/70 font-semibold tracking-widest uppercase relative z-10">
                {mem.label}
              </p>
              <div className="relative z-10">
                <p className="text-[15px] text-white leading-tight" style={{ fontWeight: 700 }}>{mem.title}</p>
                <p className="text-[12px] text-white/50 mt-1">{mem.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="mt-5"
      >
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">
          Инсайты
        </p>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scrollbar-hide pb-1">
          {[
            {
              category: 'ВКУС · МУЗЫКА',
              icon: '🎵',
              text: `Электроника в 2× чаще по пятницам после 22:00`,
              accent: '#E03366',
            },
            {
              category: 'ОТКРЫТИЕ · КИНОПОИСК',
              icon: '🎬',
              text: 'Аниме расширило профиль знания',
              accent: '#FF6600',
            },
            {
              category: 'ПРИВЫЧКА · МАРКЕТ',
              icon: '🛍️',
              text: 'Чаще покупаете по воскресеньям',
              accent: '#FFCC00',
            },
            {
              category: 'ПАТТЕРН · СПЛИТ',
              icon: '💳',
              text: globalTrustScore > 50 ? 'Платите вовремя — доверие растёт' : 'Просрочки снижают ауру',
              accent: '#30D158',
            },
            {
              category: 'ОТКРЫТИЕ · КНИГИ',
              icon: '📚',
              text: 'Читаете больше нон-фикшна по утрам',
              accent: '#0077FF',
            },
          ].map((insight, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[160px] rounded-2xl p-3.5 flex flex-col gap-2.5"
              style={{ backgroundColor: '#1C1C1E' }}
            >
              <div className="text-[24px] leading-none">{insight.icon}</div>
              <p className="text-[10px] font-semibold tracking-wider leading-tight" style={{ color: insight.accent }}>
                {insight.category}
              </p>
              <p className="text-[14px] text-white leading-snug" style={{ fontWeight: 600 }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Simulation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-5 mb-6"
      >
        <h2 className="text-[22px] text-white px-1 mb-3" style={{ fontWeight: 700 }}>
          Симуляция
        </h2>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
          <button
            onClick={() => triggerEvent('overdue')}
            disabled={isTrustCritical}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 active:bg-white/[0.05] transition-colors text-left disabled:opacity-40"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[17px] text-white" style={{ fontWeight: 400 }}>Просрочка по Сплиту</p>
              <p className="text-[13px] text-[#98989D] mt-0.5">Симулировать падение доверия</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#48484A] flex-shrink-0" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};