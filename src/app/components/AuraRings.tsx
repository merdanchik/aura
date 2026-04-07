import React, { useId } from 'react';
import { motion } from 'motion/react';

interface AuraRingsProps {
  knowledge: number; // 0-100
  trust: number;     // 0-100
  size?: number;
  className?: string;
}

export const AuraRings: React.FC<AuraRingsProps> = ({ knowledge, trust, size = 200, className }) => {
  const uid = useId().replace(/:/g, '');
  const center = size / 2;
  const strokeWidth = size * 0.09;
  const gap = size * 0.025;

  const outerR = center - strokeWidth / 2 - 4;
  const innerR = outerR - strokeWidth - gap;

  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;

  const outerDash = (knowledge / 100) * outerC;
  const innerDash = (trust / 100) * innerC;

  const trustColor = trust < 40 ? '#FF3B30' : trust < 70 ? '#FF9500' : '#30D158';
  const trustEnd = trust < 40 ? '#FF6961' : trust < 70 ? '#FFCC00' : '#4ADE80';
  const trustTrack = trust < 40 ? '#FF3B3025' : trust < 70 ? '#FF950025' : '#30D15825';

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer track */}
        <circle cx={center} cy={center} r={outerR} fill="none" stroke="#5E5CE625" strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Outer ring */}
        <motion.circle
          cx={center} cy={center} r={outerR}
          fill="none"
          stroke={`url(#kg${uid})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={outerC}
          variants={{
            hidden: { strokeDashoffset: outerC },
            visible: { strokeDashoffset: outerC - outerDash },
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Inner track */}
        <circle cx={center} cy={center} r={innerR} fill="none" stroke={trustTrack} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Inner ring */}
        <motion.circle
          cx={center} cy={center} r={innerR}
          fill="none"
          stroke={`url(#tg${uid})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={innerC}
          variants={{
            hidden: { strokeDashoffset: innerC },
            visible: { strokeDashoffset: innerC - innerDash },
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Glow caps — small bright circles at the end of each arc */}
        {knowledge > 5 && (
          <motion.circle
            r={strokeWidth / 2 - 1}
            fill={`url(#kg${uid})`}
            filter={`url(#glow${uid})`}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 0.6 },
            }}
            transition={{ duration: 0.4, delay: 1.2 }}
            cx={center + outerR * Math.cos(((knowledge / 100) * 360 - 90) * (Math.PI / 180))}
            cy={center + outerR * Math.sin(((knowledge / 100) * 360 - 90) * (Math.PI / 180))}
          />
        )}

        <defs>
          <linearGradient id={`kg${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5E5CE6" />
            <stop offset="100%" stopColor="#BF5AF2" />
          </linearGradient>
          <linearGradient id={`tg${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={trustColor} />
            <stop offset="100%" stopColor={trustEnd} />
          </linearGradient>
          <filter id={`glow${uid}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
};

/** Small inline ring for list items */
export const AuraRingsMini: React.FC<AuraRingsProps> = ({ knowledge, trust, size = 36, className }) => {
  const center = size / 2;
  const sw = 3.5;
  const gap = 1.5;
  const outerR = center - sw / 2 - 1;
  const innerR = outerR - sw - gap;
  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;

  const trustColor = trust < 40 ? '#FF3B30' : trust < 70 ? '#FF9500' : '#30D158';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle cx={center} cy={center} r={outerR} fill="none" stroke="#5E5CE618" strokeWidth={sw} />
      <circle
        cx={center} cy={center} r={outerR}
        fill="none" stroke="#5E5CE6" strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={outerC}
        strokeDashoffset={outerC - (knowledge / 100) * outerC}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <circle cx={center} cy={center} r={innerR} fill="none" stroke={`${trustColor}20`} strokeWidth={sw} />
      <circle
        cx={center} cy={center} r={innerR}
        fill="none" stroke={trustColor} strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={innerC}
        strokeDashoffset={innerC - (trust / 100) * innerC}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
};

/** Weekly rings strip — 7 days like Apple Fitness */
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Generate pseudo-historical data per day based on current scores
function weekData(knowledge: number, trust: number) {
  const today = new Date().getDay(); // 0=Sun .. 6=Sat
  const todayIdx = today === 0 ? 6 : today - 1; // Mon=0
  return DAYS.map((d, i) => {
    if (i > todayIdx) return { day: d, k: 0, t: 0, future: true };
    // slight daily variation
    const seed = (i * 17 + 3) % 13;
    const kVar = Math.max(5, Math.min(100, knowledge + (seed - 6) * 3));
    const tVar = Math.max(5, Math.min(100, trust + ((seed * 3 + 7) % 13 - 6) * 3));
    return { day: d, k: i === todayIdx ? knowledge : kVar, t: i === todayIdx ? trust : tVar, future: false };
  });
}

interface WeekStripProps {
  knowledge: number;
  trust: number;
}

export const WeekStrip: React.FC<WeekStripProps> = ({ knowledge, trust }) => {
  const data = weekData(knowledge, trust);
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="flex items-end justify-center gap-2.5">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <AuraRingsMini
            knowledge={d.future ? 0 : d.k}
            trust={d.future ? 0 : d.t}
            size={28}
            className={d.future ? 'opacity-25' : ''}
          />
          <span
            className="text-[10px]"
            style={{
              fontWeight: i === todayIdx ? 700 : 400,
              color: i === todayIdx ? '#1C1C1E' : '#8E8E93',
            }}
          >
            {d.day}
          </span>
        </div>
      ))}
    </div>
  );
};