import React, { useState } from 'react';
import { useAura } from '../context/AuraContext';
import { AuraRings, AuraRingsMini } from './AuraRings';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronDown, Shield, CheckCircle, MapPin } from 'lucide-react';
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
import heartSvg from "../../assets/heart.svg";
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

// lub-dub cardiac keyframes
const BEAT_SCALE  = [1, 1.055, 1.02, 1.045, 0.985, 1.0];
const BEAT_TIMES  = [0, 0.14, 0.26, 0.40, 0.65, 1.0];
const BEAT_DUR    = 0.87;
const BEAT_REST   = 0.45;
const BEAT_SCALE_GRAY = BEAT_SCALE.map(v => 1 + (v - 1) * 0.45);

const HeartAura = ({ overallScore, globalTrustScore, size = 330 }: { overallScore: number; globalTrustScore: number; size?: number }) => {
  const s = overallScore / 100;
  const isStrong = overallScore >= 60;

  const hue      = useMotionValue(0);
  const clipRV   = useMotionValue(0);
  const beatGlow = useMotionValue(0);

  React.useEffect(() => {
    if (!isStrong) { const a = motionAnimate(hue, 0, { duration: 1 }); return () => a.stop(); }
    const a = motionAnimate(hue, [0, 360], { duration: 6 + (1 - s) * 4, repeat: Infinity, ease: 'linear' });
    return () => a.stop();
  }, [isStrong, s]);

  React.useEffect(() => {
    const a = motionAnimate(clipRV, overallScore * 0.82, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
    return () => a.stop();
  }, [overallScore]);

  React.useEffect(() => {
    const peak = 0.10 + s * 0.16;
    const a = motionAnimate(beatGlow, [0, peak, peak * 0.35, peak * 0.80, 0],
      { duration: BEAT_DUR, repeat: Infinity, repeatDelay: BEAT_REST });
    return () => a.stop();
  }, [s]);

  const colorFilter = useTransform(hue, h =>
    `saturate(2.2) brightness(${(0.85 + s * 0.15).toFixed(2)}) hue-rotate(${h.toFixed(0)}deg)`
  );

  // Soft ambient glow — no beat flash, just gentle hue shift
  const glowAlpha = 0.07 + s * 0.18;
  const glow1Bg = useTransform(hue, h =>
    `radial-gradient(ellipse at 55% 55%, hsla(${h + 20}, 80%, 55%, ${glowAlpha.toFixed(3)}) 0%, transparent 58%)`
  );
  const glow2Bg = useTransform(hue, h =>
    `radial-gradient(ellipse at 40% 42%, hsla(${(h + 150) % 360}, 70%, 50%, ${(glowAlpha * 0.6).toFixed(3)}) 0%, transparent 52%)`
  );

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
      {/* Soft ambient glow — static opacity, slow hue shift */}
      <motion.div className="absolute pointer-events-none" style={{ inset: -20, background: glow1Bg, filter: 'blur(28px)' }} />
      <motion.div className="absolute pointer-events-none" style={{ inset: -20, background: glow2Bg, filter: 'blur(20px)' }} />

      {/* Grayscale base — 1 element (was 6), single beat wrapper */}
      <motion.div
        animate={{ scale: BEAT_SCALE_GRAY }}
        transition={{ duration: BEAT_DUR, repeat: Infinity, repeatDelay: BEAT_REST, times: BEAT_TIMES }}
        style={{ position: 'absolute', left: '50%', top: '50%', x: '-50%' as any, y: '-50%' as any,
                 width: size, height: size, willChange: 'transform', zIndex: 1 }}
      >
        <img src={heartSvg} aria-hidden
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'saturate(0.08) brightness(0.45)' }}
        />
      </motion.div>

      {/* Colored layers — masked, single beat + filter wrapper (was 6 elements) */}
      <motion.div style={{ position: 'absolute', inset: 0, maskImage: maskStyle as any, WebkitMaskImage: maskStyle as any, zIndex: 10 }}>
        <motion.div
          animate={{ scale: BEAT_SCALE }}
          transition={{ duration: BEAT_DUR, repeat: Infinity, repeatDelay: BEAT_REST, times: BEAT_TIMES }}
          style={{ position: 'absolute', left: '50%', top: '50%', x: '-50%' as any, y: '-50%' as any,
                   width: size, height: size, filter: colorFilter as any, willChange: 'transform, filter' }}
        >
          {HEART_LAYERS.map((src, i) => (
            <img key={i} src={src} aria-hidden={i > 0} alt={i === 0 ? 'Аура' : undefined}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: i + 1 }}
            />
          ))}
        </motion.div>
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

// ─── Know Cards (Что Яндекс знает) ──────────────────────────────────────────

type KnowCard = {
  category: string; sub: string; value: string; unit: string;
  label: string; isNew: boolean; bg: string;
};

const KNOW_CARDS: KnowCard[] = [
  {
    category: 'Кино', sub: 'Кинопоиск',
    value: '72', unit: '%', label: 'Исторические драмы',
    isNew: true,
    bg: 'radial-gradient(ellipse at 75% 28%, rgba(190,60,15,0.72) 0%, transparent 58%), radial-gradient(ellipse at 22% 78%, rgba(110,25,8,0.55) 0%, transparent 52%), #1C0804',
  },
  {
    category: 'Еда', sub: 'Яндекс Еда · 67 заказов',
    value: '91', unit: '%', label: 'Японская кухня',
    isNew: false,
    bg: 'radial-gradient(ellipse at 65% 28%, rgba(15,130,55,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(8,80,35,0.5) 0%, transparent 52%), #030F06',
  },
  {
    category: 'Паттерн', sub: 'Все сервисы',
    value: '94', unit: '%', label: 'Активен после 23:00',
    isNew: false,
    bg: 'radial-gradient(ellipse at 68% 25%, rgba(110,45,210,0.68) 0%, transparent 58%), radial-gradient(ellipse at 28% 72%, rgba(65,20,145,0.52) 0%, transparent 52%), #0A0418',
  },
  {
    category: 'Паттерн', sub: 'Яндекс Такси',
    value: '96', unit: '%', label: 'Утренние поездки',
    isNew: false,
    bg: 'radial-gradient(ellipse at 68% 28%, rgba(185,105,0,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(115,58,0,0.5) 0%, transparent 52%), #180C00',
  },
  {
    category: 'Контекст', sub: 'Яндекс Такси · адреса',
    value: '99', unit: '%', label: 'Живёт в Москве',
    isNew: false,
    bg: 'radial-gradient(ellipse at 68% 28%, rgba(12,125,125,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(8,75,75,0.5) 0%, transparent 52%), #021416',
  },
  {
    category: 'Репутация', sub: 'Все сервисы',
    value: 'топ 8', unit: '%', label: 'По надёжности',
    isNew: false,
    bg: 'radial-gradient(ellipse at 65% 25%, rgba(175,135,15,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(120,80,8,0.5) 0%, transparent 52%), #160E00',
  },
];

const CARD_H = 245;
const PEEK = 14;

const SwipeCard = ({
  card, stackDepth, isTop, onDismiss,
}: {
  card: KnowCard; stackDepth: number; isTop: boolean; onDismiss: () => void;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-9, 9]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
      motionAnimate(x, info.offset.x > 0 ? 650 : -650, { duration: 0.32, ease: [0.25, 1, 0.5, 1] } as any);
      setTimeout(onDismiss, 290);
    } else {
      motionAnimate(x, 0, { type: 'spring', stiffness: 400, damping: 28 } as any);
    }
  };

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={{ y: stackDepth * PEEK, scale: 1 - stackDepth * 0.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        x: isTop ? x : undefined,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - stackDepth,
        transformOrigin: 'top center',
        cursor: isTop ? 'grab' : 'default',
      }}
    >
      <div style={{
        background: card.bg,
        height: CARD_H,
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 10px 32px rgba(0,0,0,0.7)',
      }}>
        {/* top shine */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 38%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 28px 18px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
          {/* category + badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{card.category}</p>
            {card.isNew && <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 600 }}>NEW</span>}
          </div>
          {/* center: label above value */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 14, textAlign: 'center' }}>{card.label}</p>
            <p style={{ fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.52)', lineHeight: 1, letterSpacing: -0.5 }}>
              {card.value}{card.unit}
            </p>
          </div>
          {/* sub */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.3 }}>{card.sub}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SwipeCardStack = () => {
  const [topIdx, setTopIdx] = useState(0);
  const remaining = KNOW_CARDS.slice(topIdx);
  const visible = remaining.slice(0, 3);

  const containerH = CARD_H + Math.min(visible.length - 1, 2) * PEEK + 6;

  if (remaining.length === 0) {
    return (
      <div style={{ height: containerH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#636366', fontSize: 15 }}>Все факты изучены</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: containerH }}>
      {[...visible].reverse().map((card, reverseIdx) => {
        const stackDepth = visible.length - 1 - reverseIdx;
        return (
          <SwipeCard
            key={KNOW_CARDS.indexOf(card)}
            card={card}
            stackDepth={stackDepth}
            isTop={stackDepth === 0}
            onDismiss={() => setTopIdx(i => i + 1)}
          />
        );
      })}
    </div>
  );
};

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TABS = ['Мой профиль', 'Друзья', 'Партнеры'] as const;
type TabType = typeof TABS[number];

export const Dashboard = () => {
  const { services, globalTrustScore, globalKnowledgeScore, overallScore } = useAura();
  const navigate = useNavigate();
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
        className="flex justify-center -mb-5"
      >
        <HeartAura overallScore={overallScore} globalTrustScore={globalTrustScore} size={429} />
      </motion.div>

      {/* Rings + Scores — golden-ratio spacing, nudged left */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-7 px-1 mb-4"
        style={{ transform: 'translateX(-10px)' }}
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
            <p className="text-[11px] text-[#98989D]" style={{ fontWeight: 500 }}>Знания</p>
            <p className="text-[24px]" style={{ fontWeight: 700, color: '#BF5AF2', lineHeight: 1.15 }}>
              {Math.round(globalKnowledgeScore)}/100
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#98989D]" style={{ fontWeight: 500 }}>Доверие</p>
            <p className="text-[24px]" style={{ fontWeight: 700, color: globalTrustScore < 40 ? '#FF3B30' : globalTrustScore < 70 ? '#FF9500' : '#30D158', lineHeight: 1.15 }}>
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
              contextId: 'mem-kinopoisk',
              bg: '#150400',
              shadow: [
                'inset 0 2px 42px 28px rgba(100,15,0,0.98)',
                'inset 0 0 32px 18px rgba(200,50,0,0.82)',
                'inset 0 6px 24px 8px rgba(255,85,20,0.62)',
                'inset 0 1px 20px 5px rgba(255,175,100,0.42)',
              ].join(', '),
            },
            {
              title: 'Дождливые пятницы',
              label: 'Музыка',
              date: 'Октябрь 2024',
              contextId: 'mem-music',
              bg: '#001508',
              shadow: [
                'inset 0 2px 42px 28px rgba(0,70,20,0.98)',
                'inset 0 0 32px 18px rgba(0,155,55,0.82)',
                'inset 0 6px 24px 8px rgba(20,220,80,0.60)',
                'inset 0 1px 20px 5px rgba(160,255,195,0.40)',
              ].join(', '),
            },
            {
              title: 'Ночные сессии',
              label: 'Электроника',
              date: 'Ноябрь 2024',
              contextId: 'mem-electronic',
              bg: '#060018',
              shadow: [
                'inset 0 2px 42px 28px rgba(38,8,98,0.98)',
                'inset 0 0 32px 18px rgba(98,28,218,0.82)',
                'inset 0 6px 24px 8px rgba(158,78,255,0.65)',
                'inset 0 1px 20px 5px rgba(210,178,255,0.42)',
              ].join(', '),
            },
            {
              title: 'Осенний марафон',
              label: 'Книги',
              date: 'Сентябрь 2024',
              contextId: 'mem-books',
              bg: '#150900',
              shadow: [
                'inset 0 2px 42px 28px rgba(98,42,0,0.98)',
                'inset 0 0 32px 18px rgba(178,88,0,0.82)',
                'inset 0 6px 24px 8px rgba(228,138,10,0.62)',
                'inset 0 1px 20px 5px rgba(255,210,118,0.42)',
              ].join(', '),
            },
          ].map((mem, i) => (
            <div
              key={i}
              onClick={() => navigate(`/chat/${mem.contextId}`)}
              className="flex-shrink-0 w-[155px] h-[200px] rounded-2xl flex flex-col justify-between p-4 active:opacity-70 transition-opacity items-center text-center"
              style={{ backgroundColor: mem.bg, boxShadow: mem.shadow, cursor: 'pointer' }}
            >
              <p className="text-[11px] text-white/60 font-semibold tracking-widest uppercase w-full">
                {mem.label}
              </p>
              <div className="flex flex-col items-center justify-center flex-1">
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
              text: 'Электроника в 2× чаще по пятницам после 22:00',
              accent: '#E03366',
              contextId: 'ins-music',
            },
            {
              category: 'ОТКРЫТИЕ · КИНОПОИСК',
              icon: '🎬',
              text: 'Аниме расширило профиль знания',
              accent: '#FF6600',
              contextId: 'ins-kinopoisk',
            },
            {
              category: 'ПРИВЫЧКА · МАРКЕТ',
              icon: '🛍️',
              text: 'Чаще покупаете по воскресеньям',
              accent: '#FFCC00',
              contextId: 'ins-market',
            },
            {
              category: 'ПАТТЕРН · СПЛИТ',
              icon: '💳',
              text: 'Платите вовремя — доверие растёт',
              accent: '#30D158',
              contextId: 'ins-split',
            },
            {
              category: 'ОТКРЫТИЕ · КНИГИ',
              icon: '📚',
              text: 'Читаете больше нон-фикшна по утрам',
              accent: '#0077FF',
              contextId: 'ins-books',
            },
          ].map((insight, i) => (
            <div
              key={i}
              onClick={() => navigate(`/chat/${insight.contextId}`)}
              className="flex-shrink-0 w-[160px] rounded-2xl p-3.5 flex flex-col gap-2.5 active:opacity-70 transition-opacity"
              style={{ backgroundColor: '#1C1C1E', cursor: 'pointer' }}
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

      {/* Что Яндекс знает обо мне — swipe stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-5"
      >
        <div className="flex items-baseline justify-between px-1 mb-4">
          <h2 className="text-[22px] text-white" style={{ fontWeight: 700 }}>Что Яндекс знает обо мне</h2>
          <p className="text-[15px] flex-shrink-0 ml-3" style={{ color: '#30D158', fontWeight: 600 }}>47 фактов</p>
        </div>
        <SwipeCardStack />
      </motion.div>

      {/* Инциденты */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="mt-6"
      >
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">
          Инциденты
        </p>
        <div className="rounded-[22px] relative overflow-hidden" style={{
          background: 'radial-gradient(ellipse at 38% 50%, rgba(195,30,30,0.7) 0%, transparent 55%), radial-gradient(ellipse at 72% 35%, rgba(115,10,10,0.5) 0%, transparent 50%), #1A0202',
        }}>
          <div className="absolute pointer-events-none" style={{ inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 38%)' }} />
          <div className="relative z-10 flex items-center gap-4 px-5 py-5">
            <p style={{ fontSize: 38, lineHeight: 1 }}>⚠️</p>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.58)' }}>Инцидент</p>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 600, letterSpacing: 0.5 }}>НОВОЕ</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'white', lineHeight: 1.3 }}>Незавершённая поездка на самокате</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>Яндекс Самокаты</p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
      )}
    </div>
  );
};