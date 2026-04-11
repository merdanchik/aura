import React, { useState } from 'react';
import { useAura } from '../context/AuraContext';
import { AuraRings, AuraRingsMini } from './AuraRings';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, ChevronDown, Shield, CheckCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate as motionAnimate } from 'motion/react';
import { Switch } from './ui/switch';

// Service icons
import iconMusic from "../../assets/yandex-music.png";
import iconKinopoisk from "../../assets/kinopoisk.png";
import iconBooks from "../../assets/yandex-books.png";
import iconMarket from "../../assets/yandex-market.png";
import iconSplit from "../../assets/1f449fc2f45163f28ee9045765bf74d1029f8916.png";
import iconTaxi from "../../assets/taxi.png";
import iconPay from "../../assets/pay.png";
import iconScooters from "../../assets/scooters.png";
import iconFood from "../../assets/food.png";
import iconAfisha from "../../assets/yandex-afisha.png";
import iconTravel from "../../assets/yandex-travel.png";
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

const WORLDS_DATA = [
  { id: 'content',  label: 'Спорт',         sub: 'Гонки · Баскетбол · Матчи',       color: '#5AC8F5', freshnessColor: '#30D158', freshnessLabel: 'активно'  },
  { id: 'music',    label: 'Музыка',        sub: 'Слушает · Открывает · Собирает',  color: '#BF5AF2', freshnessColor: '#30D158', freshnessLabel: 'активно'  },
  { id: 'cinema',   label: 'Кино',          sub: 'Фильмы · Сериалы · Список',       color: '#FF9F0A', freshnessColor: '#E7A93B', freshnessLabel: 'остывает' },
  { id: 'shopping', label: 'Шопинг',        sub: 'Поиск · Сравнение · Решение',     color: '#FF6633', freshnessColor: '#E7A93B', freshnessLabel: 'остывает' },
  { id: 'travel',   label: 'Путешествия',   sub: 'Маршруты · Места · Логистика',    color: '#00C7BE', freshnessColor: '#30D158', freshnessLabel: 'активно'  },
];

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
            <AuraRings knowledge={globalKnowledgeScore} trust={globalTrustScore} size={80} />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={avatarImg} alt="Александр" className="w-8 h-8 rounded-full object-cover" />
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
  label: string; isNew: boolean; bg: string; tilt: number;
};

const KNOW_CARDS: KnowCard[] = [
  {
    category: 'Кино', sub: 'Кинопоиск',
    value: '72', unit: '%', label: 'Смотрит исторические драмы',
    isNew: true, tilt: -2.1,
    bg: 'radial-gradient(ellipse at 75% 28%, rgba(190,60,15,0.72) 0%, transparent 58%), radial-gradient(ellipse at 22% 78%, rgba(110,25,8,0.55) 0%, transparent 52%), #1C0804',
  },
  {
    category: 'Еда', sub: 'Яндекс Еда · 67 заказов',
    value: '91', unit: '%', label: 'Любит японскую кухню',
    isNew: false, tilt: 3.7,
    bg: 'radial-gradient(ellipse at 65% 28%, rgba(15,130,55,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(8,80,35,0.5) 0%, transparent 52%), #030F06',
  },
  {
    category: 'Паттерн', sub: 'Все сервисы',
    value: '94', unit: '%', label: 'Активен после 23:00',
    isNew: false, tilt: -4.4,
    bg: 'radial-gradient(ellipse at 68% 25%, rgba(110,45,210,0.68) 0%, transparent 58%), radial-gradient(ellipse at 28% 72%, rgba(65,20,145,0.52) 0%, transparent 52%), #0A0418',
  },
  {
    category: 'Паттерн', sub: 'Яндекс Такси',
    value: '96', unit: '%', label: 'Едет рано утром',
    isNew: false, tilt: 1.8,
    bg: 'radial-gradient(ellipse at 68% 28%, rgba(185,105,0,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(115,58,0,0.5) 0%, transparent 52%), #180C00',
  },
  {
    category: 'Контекст', sub: 'Яндекс Такси · адреса',
    value: '99', unit: '%', label: 'Живёт в Москве',
    isNew: false, tilt: -3.2,
    bg: 'radial-gradient(ellipse at 68% 28%, rgba(12,125,125,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(8,75,75,0.5) 0%, transparent 52%), #021416',
  },
  {
    category: 'Репутация', sub: 'Все сервисы',
    value: 'топ 8', unit: '%', label: 'Надёжный пассажир',
    isNew: false, tilt: 4.6,
    bg: 'radial-gradient(ellipse at 65% 25%, rgba(175,135,15,0.65) 0%, transparent 58%), radial-gradient(ellipse at 25% 72%, rgba(120,80,8,0.5) 0%, transparent 52%), #160E00',
  },
  {
    category: 'Поведение', sub: 'Яндекс Еда',
    value: '78', unit: '%', label: 'Ужинает после десяти',
    isNew: false, tilt: -1.5,
    bg: 'radial-gradient(ellipse at 62% 28%, rgba(30,40,160,0.7) 0%, transparent 58%), radial-gradient(ellipse at 28% 72%, rgba(15,20,100,0.55) 0%, transparent 52%), #040412',
  },
  {
    category: 'Паттерн', sub: 'Яндекс Музыка',
    value: '47', unit: '×', label: 'Одна песня на репите 74 раза',
    isNew: false, tilt: -3.8,
    bg: 'radial-gradient(ellipse at 68% 28%, rgba(180,30,110,0.68) 0%, transparent 58%), radial-gradient(ellipse at 25% 70%, rgba(110,15,70,0.52) 0%, transparent 52%), #150008',
  },
  {
    category: 'Поведение', sub: 'Кинопоиск',
    value: '8', unit: '', label: 'Смотрит трейлеры без фильма',
    isNew: false, tilt: 1.3,
    bg: 'radial-gradient(ellipse at 70% 28%, rgba(195,55,10,0.68) 0%, transparent 58%), radial-gradient(ellipse at 24% 72%, rgba(120,25,5,0.52) 0%, transparent 52%), #180300',
  },
  {
    category: 'Привычка', sub: 'Яндекс Сплит',
    value: '99', unit: '%', label: 'Платит в последний день',
    isNew: false, tilt: 2.9,
    bg: 'radial-gradient(ellipse at 65% 28%, rgba(200,40,40,0.68) 0%, transparent 58%), radial-gradient(ellipse at 26% 72%, rgba(130,15,15,0.52) 0%, transparent 52%), #1A0202',
  },
];

const CARD_W = 194;
const CARD_H = 252;
const PEEK = 14;

const SwipeCard = ({
  card, stackDepth, isTop, onDismiss,
}: {
  card: KnowCard; stackDepth: number; isTop: boolean; onDismiss: () => void;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [card.tilt - 5, card.tilt + 5]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
      // snap x back, then cycle card to bottom — it shrinks/fades into stack
      motionAnimate(x, 0, { duration: 0.25, ease: [0.25, 1, 0.5, 1] } as any);
      onDismiss();
    } else {
      motionAnimate(x, 0, { type: 'spring', stiffness: 400, damping: 28 } as any);
    }
  };

  // depth capped at 2 for position; cards beyond depth 2 are invisible behind the stack
  const vDepth = Math.min(stackDepth, 2);
  const isHidden = stackDepth > 2;

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={{
        y: vDepth * PEEK,
        scale: 1 - vDepth * 0.06,
        opacity: isHidden ? 0 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        position: 'absolute', top: 0,
        left: `calc(50% - ${CARD_W / 2}px)`,
        width: CARD_W,
        x,
        rotate,
        zIndex: 20 - stackDepth,
        transformOrigin: 'bottom center',
        cursor: isTop ? 'grab' : 'default',
      }}
    >
      <div style={{
        background: card.bg,
        height: CARD_H,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 10px 32px rgba(0,0,0,0.7)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 38%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px 14px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <p style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{card.category}</p>
            {card.isNew && <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 600 }}>NEW</span>}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 19, fontWeight: 700, color: 'white', lineHeight: 1.2, textAlign: 'center' }}>{card.label}</p>
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.3 }}>{card.sub}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SwipeCardStack = () => {
  const [order, setOrder] = useState(() => KNOW_CARDS.map((_, i) => i));
  const containerH = CARD_H + 2 * PEEK + 8;

  const handleDismiss = () => setOrder(prev => [...prev.slice(1), prev[0]]);

  return (
    <div style={{ position: 'relative', height: containerH }}>
      {[...order].reverse().map((cardIdx, reverseIdx) => {
        const stackDepth = order.length - 1 - reverseIdx;
        return (
          <SwipeCard
            key={cardIdx}
            card={KNOW_CARDS[cardIdx]}
            stackDepth={stackDepth}
            isTop={stackDepth === 0}
            onDismiss={handleDismiss}
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
  const { globalTrustScore, globalKnowledgeScore, overallScore, strongAura, toggleStrongAura } = useAura();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Мой профиль');

  React.useEffect(() => {
    const saved = sessionStorage.getItem('dashboardScroll');
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved)));
      sessionStorage.removeItem('dashboardScroll');
    }
  }, []);

  const navigateToChat = (path: string) => {
    sessionStorage.setItem('dashboardScroll', String(window.scrollY));
    navigate(path);
  };

  const trustDotGradient = globalTrustScore < 40
    ? 'linear-gradient(135deg, #FF3B30, #FF6961)'
    : globalTrustScore < 70
      ? 'linear-gradient(135deg, #FF9500, #FFCC00)'
      : 'linear-gradient(135deg, #30D158, #4ADE80)';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: '#000000',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch' as any,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}><div>
      {/* ── Header: back + avatar + strong aura toggle ── */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 8px) 16px 12px' }}>
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={() => navigate(-1 as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.55)', padding: 0,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <ChevronLeft size={20} />
            <span style={{ fontSize: 17, fontWeight: 500 }}>На главную</span>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={avatarImg} alt="Аватар" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>Александр</p>
            <p style={{ color: '#636366', fontSize: 12, marginTop: 3 }}>Аура ID · 4821</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: strongAura ? '#BF5AF2' : '#636366', fontSize: 13, fontWeight: 500 }}>Сильная аура</span>
            <Switch
              checked={strongAura}
              onCheckedChange={toggleStrongAura}
              className="h-[31px] w-[51px] data-[state=checked]:bg-[#BF5AF2] data-[state=unchecked]:bg-[#3A3A3C] border-0 [&>[data-slot=switch-thumb]]:size-[27px] [&>[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[22px] [&>[data-slot=switch-thumb]]:shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
      </div>
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

      {/* Rings + Scores */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-7 px-1 mb-7"
        style={{ transform: 'translateX(-12px)' }}
      >
        <div className="relative flex-shrink-0">
          <AuraRings knowledge={globalKnowledgeScore} trust={globalTrustScore} size={77} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[16px] text-white" style={{ fontWeight: 700, lineHeight: 1 }}>
              {Math.round(overallScore)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div>
            <p className="text-[13px] text-[#98989D]" style={{ fontWeight: 500 }}>Знания</p>
            <p className="text-[21px]" style={{ fontWeight: 700, color: '#BF5AF2', lineHeight: 1.1 }}>
              {Math.round(globalKnowledgeScore)}/100
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#98989D]" style={{ fontWeight: 500 }}>Доверие</p>
            <p className="text-[21px]" style={{ fontWeight: 700, color: globalTrustScore < 40 ? '#FF3B30' : globalTrustScore < 70 ? '#FF9500' : '#30D158', lineHeight: 1.1 }}>
              {Math.round(globalTrustScore)}/100
            </p>
          </div>
        </div>
      </motion.div>

      {/* Жизненные миры */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5"
      >
        <p className="text-[13px] text-[#98989D] px-1 mb-3 tracking-widest font-semibold uppercase">
          Жизненные миры
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
          {WORLDS_DATA.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => navigate(`/${w.id}`)}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/[0.05] transition-colors text-left"
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: w.color, flexShrink: 0 }} />
              <div className={`flex-1 min-w-0 flex items-center gap-2 ${idx < WORLDS_DATA.length - 1 ? 'border-b border-white/[0.08] pb-3.5 -mb-3.5' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] text-white truncate" style={{ fontWeight: 500 }}>{w.label}</p>
                  <p className="text-[13px] mt-0.5 truncate" style={{ color: '#636366' }}>{w.sub}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: w.freshnessColor, flexShrink: 0 }}>{w.freshnessLabel}</span>
                <ChevronRight className="w-4 h-4 text-[#48484A] flex-shrink-0" />
              </div>
            </button>
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
        <div className="flex items-center justify-between px-1 mb-7">
          <p className="text-[13px] text-[#98989D] tracking-widest font-semibold uppercase">Что Яндекс знает обо мне</p>
          <p className="text-[13px] flex-shrink-0" style={{ color: '#30D158', fontWeight: 600 }}>47 фактов</p>
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
        <button
          className="w-full text-left rounded-[22px] overflow-hidden active:opacity-70 transition-opacity"
          style={{ backgroundColor: '#1C1C1E' }}
          onClick={() => navigateToChat('/chat/incident-scooters')}
        >
          <div className="flex items-center gap-4 px-5 py-4">
            <p style={{ fontSize: 34, lineHeight: 1 }}>⚠️</p>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.45)' }}>Яндекс Самокаты</p>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, backgroundColor: 'rgba(255,59,48,0.25)', color: '#FF3B30', fontWeight: 600, letterSpacing: 0.5 }}>НОВОЕ</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'white', lineHeight: 1.3 }}>Незавершённая поездка на самокате</p>
            </div>
          </div>
        </button>
      </motion.div>

    </div>
      )}
    </div></div>
  );
};