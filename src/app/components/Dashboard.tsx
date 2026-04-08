import React, { useState } from 'react';
import { useAura } from '../context/AuraContext';
import { AuraRings, AuraRingsMini } from './AuraRings';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronDown, Zap, Shield, CheckCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate as motionAnimate } from 'motion/react';
import { Switch } from './ui/switch';

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
import avatarImg from "../../assets/avatar.jpg";
import heartLayer0 from "../../assets/heart-layer-0.svg";
import heartLayer1 from "../../assets/heart-layer-1.svg";
import heartLayer2 from "../../assets/heart-layer-2.svg";
import heartLayer3 from "../../assets/heart-layer-3.svg";
import heartLayer4 from "../../assets/heart-layer-4.svg";
import heartLayer5 from "../../assets/heart-layer-5.svg";
import iconLamoda from "../../assets/partner-lamoda.jpg";
import iconIvi from "../../assets/partner-ivi.jpg";
import iconMvideo from "../../assets/partner-mvideo.jpg";

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

// ─── Heart Aura ──────────────────────────────────────────────────────────────

const HEART_LAYERS = [heartLayer0, heartLayer1, heartLayer2, heartLayer3, heartLayer4, heartLayer5];

// async pulse config per layer: [scaleMax, durationSec, delaySec]
const HEART_PULSE: [number, number, number][] = [
  [1.07, 2.6, 0.0],
  [1.05, 3.1, 0.7],
  [1.06, 2.9, 1.5],
  [1.04, 3.4, 0.3],
  [1.05, 2.7, 1.1],
  [1.03, 3.0, 0.9],
];

const HeartAura = ({ overallScore, globalTrustScore, size = 330 }: { overallScore: number; globalTrustScore: number; size?: number }) => {
  const s = overallScore / 100;
  const isStrong = overallScore >= 60;

  const hue = useMotionValue(0);
  const clipRV = useMotionValue(0);

  React.useEffect(() => {
    if (!isStrong) {
      const a = motionAnimate(hue, 0, { duration: 1 });
      return () => a.stop();
    }
    const speed = 6 + (1 - s) * 4;
    const a = motionAnimate(hue, [0, 360], { duration: speed, repeat: Infinity, ease: 'linear' });
    return () => a.stop();
  }, [isStrong, s]);

  React.useEffect(() => {
    const a = motionAnimate(clipRV, overallScore * 0.62, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
    return () => a.stop();
  }, [overallScore]);

  const colorBrightness = 0.85 + s * 0.15;
  const imgFilter = useTransform(hue, h =>
    `saturate(2.2) brightness(${colorBrightness.toFixed(2)}) hue-rotate(${h.toFixed(0)}deg)`
  );

  const glowAlpha = 0.07 + s * 0.18;
  const glow1Bg = useTransform(hue, h =>
    `radial-gradient(ellipse at 55% 55%, hsla(${h + 20}, 80%, 55%, ${glowAlpha}) 0%, transparent 58%)`
  );
  const glow2Bg = useTransform(hue, h =>
    `radial-gradient(ellipse at 40% 42%, hsla(${(h + 150) % 360}, 70%, 50%, ${glowAlpha * 0.6}) 0%, transparent 52%)`
  );

  // Soft feathered mask: colored zone solid in center, fades out over 28% at the edge
  const maskStyle = useTransform(clipRV, v => {
    const outer = v.toFixed(1);
    const inner = Math.max(0, v - 28).toFixed(1);
    return `radial-gradient(circle at 50% 48%, black 0%, black ${inner}%, transparent ${outer}%)`;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05, duration: 0.5 }}
      style={{ width: size, height: size, margin: '0 auto', position: 'relative' }}
    >
      {/* glow */}
      <motion.div className="absolute pointer-events-none" style={{ inset: -20, background: glow1Bg, filter: 'blur(28px)' }} />
      <motion.div className="absolute pointer-events-none" style={{ inset: -20, background: glow2Bg, filter: 'blur(20px)' }} />

      {/* Grayscale base — always visible */}
      {HEART_LAYERS.map((src, i) => (
        <img
          key={`g${i}`}
          src={src}
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: size, height: size,
            objectFit: 'contain',
            filter: 'saturate(0.08) brightness(0.45)',
            zIndex: i + 1,
          }}
        />
      ))}

      {/* Colored layers — soft radial mask animated via MotionValue */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          maskImage: maskStyle as any,
          WebkitMaskImage: maskStyle as any,
          zIndex: 10,
        }}
      >
        {HEART_LAYERS.map((src, i) => {
          const [scaleMax, duration, delay] = HEART_PULSE[i];
          const wMax = size * scaleMax;
          return (
            <motion.img
              key={`c${i}`}
              src={src}
              aria-hidden={i > 0}
              alt={i === 0 ? 'Аура' : undefined}
              animate={{ width: [size, wMax, size], height: [size, wMax, size] }}
              transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay, repeatType: 'loop' }}
              style={{
                position: 'absolute',
                left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                objectFit: 'contain',
                filter: imgFilter as any,
                zIndex: i + 1,
              }}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
};

// ─── Friends Tab ─────────────────────────────────────────────────────────────

const FriendsTab = () => {
  const { globalKnowledgeScore, globalTrustScore } = useAura();
  const [toggles, setToggles] = useState({
    music: true,
    cinema: true,
    wishlist: false,
    location: false,
  });
  const toggle = (key: keyof typeof toggles) => setToggles(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="px-4 pb-10 pt-2">
      {/* ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl p-4 mb-5 relative overflow-hidden"
        style={{ backgroundColor: 'rgba(28,28,30,0.9)' }}
      >
        {/* Glow layers — same as ServiceDetail */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(48,209,88,0.18) 0%, transparent 65%)', filter: 'blur(16px)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(94,92,230,0.16) 0%, transparent 65%)', filter: 'blur(16px)' }} />

        <div className="flex items-center gap-4 relative z-10">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <p className="text-[22px] text-white leading-tight mb-0.5" style={{ fontWeight: 700 }}>Александр</p>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: '#30D158' }} />
              <p className="text-[12px] font-semibold" style={{ color: '#30D158' }}>верифицирован</p>
            </div>
            <p className="text-[13px] text-[#98989D] leading-snug">Публичный профиль</p>
            <div className="flex items-center gap-1 mt-3">
              <MapPin className="w-3.5 h-3.5" style={{ color: '#636366' }} />
              <p className="text-[11px] text-[#636366] uppercase tracking-wide font-medium">Москва</p>
            </div>
          </div>
          {/* Right — rings with avatar in center */}
          <div className="flex-shrink-0 relative">
            <AuraRings knowledge={globalKnowledgeScore} trust={globalTrustScore} size={100} />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={avatarImg} alt="Александр" className="w-10 h-10 rounded-full object-cover" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interest tags */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">Интересы</p>
        <div className="flex flex-wrap gap-2">
          {['Баскетбол', 'F1', 'Мексиканская еда', 'Электроника'].map(tag => (
            <span
              key={tag}
              className="px-3.5 py-1.5 rounded-full text-[14px]"
              style={{ backgroundColor: '#1C1C1E', color: '#EBEBF5', fontWeight: 500 }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Privacy toggles */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">Видимость</p>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
          {([
            { key: 'music', label: 'Музыкальные вкусы' },
            { key: 'cinema', label: 'Кино и сериалы' },
            { key: 'wishlist', label: 'Вишлист' },
            { key: 'location', label: 'Местонахождение' },
          ] as const).map(({ key, label }, idx, arr) => (
            <div
              key={key}
              className={`flex items-center justify-between px-4 py-4 ${idx < arr.length - 1 ? 'border-b border-white/[0.08]' : ''}`}
            >
              <p className="text-[17px] text-white" style={{ fontWeight: 400 }}>{label}</p>
              <Switch
                checked={toggles[key]}
                onCheckedChange={() => toggle(key)}
                className="h-[31px] w-[51px] data-[state=checked]:bg-[#34C759] data-[state=unchecked]:bg-[#3A3A3C] border-0 [&>[data-slot=switch-thumb]]:size-[27px] [&>[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[22px] [&>[data-slot=switch-thumb]]:shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Partners Tab ─────────────────────────────────────────────────────────────

const PartnersTab = () => {
  const [mvideoState, setMvideoState] = useState<'pending' | 'granted' | 'denied'>('pending');

  return (
    <div className="px-4 pb-10 pt-2">
      {/* Notice */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl p-4 mb-5 flex items-start gap-3"
        style={{ backgroundColor: 'rgba(94,92,230,0.1)', border: '1px solid rgba(94,92,230,0.22)' }}
      >
        <Shield className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: '#5E5CE6' }} />
        <p className="text-[14px] leading-snug" style={{ color: 'rgba(235,235,245,0.7)', fontWeight: 400 }}>
          Партнеры видят только то, что вы разрешили. Каждый запрос — отдельное согласие.
        </p>
      </motion.div>

      {/* Accesses */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">Активные доступы</p>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>

          {/* Lamoda */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
            <img src={iconLamoda} alt="Ламода" className="w-11 h-11 rounded-[12px] object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[17px] text-white" style={{ fontWeight: 500 }}>Ламода</p>
              <p className="text-[13px] mt-0.5" style={{ color: '#636366' }}>доступ к: размер, стиль</p>
            </div>
            <span className="text-[12px] px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: '#30D158', backgroundColor: 'rgba(48,209,88,0.1)', fontWeight: 500 }}>активен</span>
          </div>

          {/* Ivi */}
          <div className={`flex items-center gap-3 px-4 py-3.5 ${mvideoState === 'pending' ? 'border-b border-white/[0.08]' : ''}`}>
            <img src={iconIvi} alt="Иви" className="w-11 h-11 rounded-[12px] object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[17px] text-white" style={{ fontWeight: 500 }}>Иви</p>
              <p className="text-[13px] mt-0.5" style={{ color: '#636366' }}>доступ к: кино, жанры</p>
            </div>
            <span className="text-[12px] px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: '#30D158', backgroundColor: 'rgba(48,209,88,0.1)', fontWeight: 500 }}>активен</span>
          </div>

          {/* Mvideo */}
          <AnimatePresence>
            {mvideoState === 'pending' && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className="px-4 py-3.5"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={iconMvideo} alt="М.Видео" className="w-11 h-11 rounded-[12px] object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] text-white" style={{ fontWeight: 500 }}>М.Видео</p>
                    <span className="text-[12px] px-2.5 py-0.5 rounded-full inline-block mt-0.5" style={{ color: '#FF9500', backgroundColor: 'rgba(255,149,0,0.1)', fontWeight: 500 }}>
                      запрашивает доступ
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMvideoState('granted')}
                    className="flex-1 py-2.5 rounded-xl text-[15px] text-white active:opacity-70 transition-opacity"
                    style={{ backgroundColor: '#2C2C2E', fontWeight: 500 }}
                  >
                    Дать
                  </button>
                  <button
                    onClick={() => setMvideoState('denied')}
                    className="flex-1 py-2.5 rounded-xl text-[15px] active:opacity-70 transition-opacity"
                    style={{ backgroundColor: '#2C2C2E', color: '#FF3B30', fontWeight: 500 }}
                  >
                    Нет
                  </button>
                </div>
              </motion.div>
            )}
            {mvideoState === 'granted' && (
              <motion.div
                key="granted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <img src={iconMvideo} alt="М.Видео" className="w-11 h-11 rounded-[12px] object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] text-white" style={{ fontWeight: 500 }}>М.Видео</p>
                  <p className="text-[13px] mt-0.5" style={{ color: '#636366' }}>доступ выдан</p>
                </div>
                <span className="text-[12px] px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: '#30D158', backgroundColor: 'rgba(48,209,88,0.1)', fontWeight: 500 }}>активен</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
};

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TABS = ['Мой профиль', 'Друзья', 'Партнеры'] as const;
type TabType = typeof TABS[number];

export const Dashboard = () => {
  const { services, globalTrustScore, globalKnowledgeScore, overallScore, theme, triggerEvent } = useAura();
  const navigate = useNavigate();
  const isTrustCritical = globalTrustScore < 50;
  const [servicesExpanded, setServicesExpanded] = useState(() => sessionStorage.getItem('servicesExpanded') === 'true');
  const [activeTab, setActiveTab] = useState<TabType>('Мой профиль');

  const toggleExpanded = (v: boolean) => {
    setServicesExpanded(v);
    sessionStorage.setItem('servicesExpanded', String(v));
  };

  const trustDotGradient = globalTrustScore < 40
    ? 'linear-gradient(135deg, #FF3B30, #FF6961)'
    : globalTrustScore < 70
      ? 'linear-gradient(135deg, #FF9500, #FFCC00)'
      : 'linear-gradient(135deg, #30D158, #4ADE80)';

  return (
    <div>
      {/* ── Tab bar ── */}
      <div className="px-4 pt-3 pb-0">
        <div className="flex relative">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 text-[15px] relative transition-colors"
              style={{ fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#FFFFFF' : '#636366' }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                  style={{ backgroundColor: '#FFFFFF' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="h-[0.5px] w-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'Друзья' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <FriendsTab />
          </motion.div>
        )}
        {activeTab === 'Партнеры' && (
          <motion.div
            key="partners"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <PartnersTab />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Мой профиль content (existing) ── */}
      {activeTab === 'Мой профиль' && (
    <div className="px-4 pb-10 pt-2">
      {/* Heart — large, first */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex justify-center mb-3"
      >
        <HeartAura overallScore={overallScore} globalTrustScore={globalTrustScore} size={429} />
      </motion.div>

      {/* Rings + Scores — no background, just flex row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 px-1 mb-4"
      >
        {/* Rings */}
        <div className="relative flex-shrink-0">
          <AuraRings knowledge={globalKnowledgeScore} trust={globalTrustScore} size={77} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[18px] text-white" style={{ fontWeight: 700, lineHeight: 1 }}>
              {Math.round(overallScore)}
            </p>
          </div>
        </div>
        {/* Scores */}
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] text-[#98989D]" style={{ fontWeight: 500 }}>Знания</p>
            <p className="text-[18px]" style={{ fontWeight: 700, color: '#BF5AF2', lineHeight: 1.2 }}>
              {Math.round(globalKnowledgeScore)}/100
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#98989D]" style={{ fontWeight: 500 }}>Доверие</p>
            <p className="text-[18px]" style={{ fontWeight: 700, color: globalTrustScore < 40 ? '#FF3B30' : globalTrustScore < 70 ? '#FF9500' : '#30D158', lineHeight: 1.2 }}>
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
            onClick={() => toggleExpanded(!servicesExpanded)}
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

      {/* История отношений */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="mt-5"
      >
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">
          История отношений
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
          {[
            { icon: iconKinopoisk, title: 'Князь Андрей', sub: 'Кинопоиск · Оценка 10 · Только что', right: '10 +', rightColor: '#30D158' },
            { icon: iconBooks, title: 'Яндекс Музыка', sub: '3 года · 1 200+ часов', right: 'глубоко', rightColor: '#BF5AF2' },
            { icon: iconTaxi, title: 'Яндекс Такси', sub: '214 поездок · рейтинг 4.9', right: 'надёжно', rightColor: '#30D158' },
          ].map((item, idx, arr) => (
            <div key={idx} className={`flex items-center gap-3 px-4 py-3.5 ${idx < arr.length - 1 ? 'border-b border-white/[0.08]' : ''}`}>
              <img src={item.icon} alt={item.title} className="w-11 h-11 rounded-[12px] object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[17px] text-white truncate" style={{ fontWeight: 500 }}>{item.title}</p>
                <p className="text-[13px] text-[#636366] mt-0.5 truncate">{item.sub}</p>
              </div>
              <p className="text-[15px] flex-shrink-0" style={{ color: item.rightColor, fontWeight: 600 }}>{item.right}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Что Яндекс знает обо мне — grid cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-5"
      >
        <div className="flex items-baseline justify-between px-1 mb-3">
          <h2 className="text-[22px] text-white" style={{ fontWeight: 700 }}>Что Яндекс знает обо мне</h2>
          <p className="text-[15px] flex-shrink-0 ml-3" style={{ color: '#30D158', fontWeight: 600 }}>47 фактов</p>
        </div>

        {(() => {
          const cards = [
            { icon: '🎬', category: 'Кино', title: 'Интерес к историческим драмам', sub: 'Кинопоиск · оценка 10', pct: '72%', pctColor: '#FF9F45', isNew: true,  bg: '#1a0800', glow: 'rgba(220,80,0,0.65)' },
            { icon: '🍱', category: 'Еда',  title: 'Предпочитает японскую кухню',   sub: 'Яндекс Еда · 67 заказов', pct: '91%', pctColor: '#30D158', isNew: false, bg: '#001a0a', glow: 'rgba(0,190,80,0.65)' },
            { icon: '🌙', category: 'Паттерн', title: 'Активен в экосистеме после 23:00', sub: 'Все сервисы · активность', pct: '94%', pctColor: '#BF5AF2', isNew: false, bg: '#08001c', glow: 'rgba(130,60,255,0.65)' },
            { icon: '🚕', category: 'Паттерн', title: 'Утренние поездки по одному маршруту', sub: 'Яндекс Такси · 214 поездок', pct: '96%', pctColor: '#FF9500', isNew: false, bg: '#180e00', glow: 'rgba(255,160,0,0.6)' },
            { icon: '📍', category: 'Контекст', title: 'Живёт в Москве', sub: 'Яндекс Такси · адреса', pct: '99%', pctColor: '#40C8E0', isNew: false, bg: '#001418', glow: 'rgba(0,170,210,0.6)' },
            { icon: '⭐', category: 'Репутация', title: 'Топ-8% по надёжности', sub: 'Все сервисы · рейтинг', pct: '100%', pctColor: '#FFD60A', isNew: false, bg: '#181200', glow: 'rgba(255,210,0,0.6)' },
            { icon: '⚠️', category: 'Репутация', title: 'Незавершённая поездка на самокате', sub: 'Яндекс Самокаты · инцидент', pct: '100%', pctColor: '#FF453A', isNew: true, bg: '#180600', glow: 'rgba(255,70,40,0.6)', wide: true },
          ];

          return (
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between${card.wide ? ' col-span-2' : ''}`}
                  style={{ backgroundColor: card.bg, minHeight: card.wide ? 120 : 168 }}
                >
                  {/* ambient glow */}
                  <div className="absolute pointer-events-none" style={{ inset: 0, background: `radial-gradient(ellipse at 50% 60%, ${card.glow} 0%, transparent 68%)` }} />

                  {/* top row */}
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.category}</p>
                    {card.isNew && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(48,209,88,0.18)', color: '#30D158', fontWeight: 700 }}>новое</span>
                    )}
                  </div>

                  {/* icon */}
                  {!card.wide && (
                    <div className="relative z-10 text-[36px] leading-none my-1">{card.icon}</div>
                  )}

                  {/* bottom */}
                  <div className={`relative z-10 ${card.wide ? 'flex items-center gap-4 mt-2' : ''}`}>
                    {card.wide && <div className="text-[32px] leading-none flex-shrink-0">{card.icon}</div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white/80 leading-snug" style={{ fontWeight: 500 }}>{card.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.sub}</p>
                    </div>
                    <p className={`${card.wide ? 'flex-shrink-0 text-[28px]' : 'text-[28px] mt-2'} leading-none`} style={{ color: card.pctColor, fontWeight: 700 }}>{card.pct}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
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
      )}
    </div>
  );
};