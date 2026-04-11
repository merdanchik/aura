import React from 'react';
import { motion, useMotionValue, useTransform, animate as motionAnimate } from 'motion/react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { Switch } from './ui/switch';

import heartSvg    from '../../assets/heart.svg';
import heartLayer0 from '../../assets/heart-layer-0.svg';
import heartLayer1 from '../../assets/heart-layer-1.svg';
import heartLayer2 from '../../assets/heart-layer-2.svg';
import heartLayer3 from '../../assets/heart-layer-3.svg';
import heartLayer4 from '../../assets/heart-layer-4.svg';
import heartLayer5 from '../../assets/heart-layer-5.svg';

const HEART_LAYERS = [heartLayer0, heartLayer1, heartLayer2, heartLayer3, heartLayer4, heartLayer5];

const BEAT_SCALE      = [1, 1.055, 1.02, 1.045, 0.985, 1.0];
const BEAT_TIMES      = [0, 0.14,  0.26, 0.40,  0.65,  1.0];
const BEAT_DUR        = 0.87;
const BEAT_REST       = 0.45;
const BEAT_SCALE_GRAY = BEAT_SCALE.map(v => 1 + (v - 1) * 0.45);

const HeartAura: React.FC<{ overallScore: number; globalTrustScore: number; size?: number }> = ({
  overallScore, globalTrustScore, size = 330,
}) => {
  const s       = overallScore / 100;
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
      <motion.div className="absolute pointer-events-none" style={{ inset: -20, background: glow1Bg, filter: 'blur(28px)' }} />
      <motion.div className="absolute pointer-events-none" style={{ inset: -20, background: glow2Bg, filter: 'blur(20px)' }} />

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

export const HeartPage: React.FC = () => {
  const { overallScore, globalTrustScore, strongAura, toggleStrongAura } = useAura();
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: '#000000',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 8px) 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.55)', padding: 0,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ChevronLeft size={24} style={{ transform: 'translateY(-1.5px)' }} />
          <span style={{ fontSize: 17, fontWeight: 500 }}>Назад</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: strongAura ? '#BF5AF2' : '#636366', fontSize: 13, fontWeight: 500 }}>Сильная аура</span>
          <Switch
            checked={strongAura}
            onCheckedChange={toggleStrongAura}
            className="h-[31px] w-[51px] data-[state=checked]:bg-[#BF5AF2] data-[state=unchecked]:bg-[#3A3A3C] border-0 [&>[data-slot=switch-thumb]]:size-[27px] [&>[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[22px] [&>[data-slot=switch-thumb]]:shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>

      {/* Heart — centred in remaining space */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HeartAura overallScore={overallScore} globalTrustScore={globalTrustScore} size={330} />
      </div>
    </div>
  );
};
