// ── Aura Design Tokens ───────────────────────────────────────────────────────
// Single source of truth for colors, type scale, radii, and spacing.
// Import as: import { C, T, R, S } from '../styles/auraTokens';

/** Colors */
export const C = {
  appBg:           '#0D0E11',
  surface:         '#14161B',
  surfaceSecondary:'#1B1E25',
  chipBg:          '#25262B',

  textPrimary:     '#FFFFFF',
  textSecondary:   'rgba(255,255,255,0.58)',
  textTertiary:    'rgba(255,255,255,0.34)',
  textQuiet:       'rgba(255,255,255,0.38)',

  active:          '#30D158',   // green pulse
  cooling:         '#E7A93B',   // amber
  quiet:           'rgba(255,255,255,0.38)',

  border:          'rgba(255,255,255,0.06)',
  handleBar:       'rgba(255,255,255,0.10)',

  backdropBg:      'rgba(0,0,0,0.72)',
} as const;

/** Type scale — [fontSize, fontWeight, lineHeight] */
export const T = {
  screenTitle:   { fontSize: 28, fontWeight: 700, lineHeight: 1.05 },
  cardTitle:     { fontSize: 26, fontWeight: 700, lineHeight: 1.0  },
  heroTitle:     { fontSize: 24, fontWeight: 700, lineHeight: 1.15 },
  sectionTitle:  { fontSize: 18, fontWeight: 700, lineHeight: 1.1  },
  primaryText:   { fontSize: 17, fontWeight: 400, lineHeight: 1.3  },
  heroBody:      { fontSize: 16, fontWeight: 400, lineHeight: 1.55 },
  secondary:     { fontSize: 15, fontWeight: 400, lineHeight: 1.5  },
  chip:          { fontSize: 13, fontWeight: 400, lineHeight: 1    },
  meta:          { fontSize: 13, fontWeight: 400, lineHeight: 1.5  },
  metaBold:      { fontSize: 13, fontWeight: 500, lineHeight: 1    },
  label:         { fontSize: 12, fontWeight: 600, lineHeight: 1,   letterSpacing: 0.9 },
  sub:           { fontSize: 14, fontWeight: 400, lineHeight: 1.3  },
  sourceName:    { fontSize: 15, fontWeight: 600, lineHeight: 1    },
} as const;

/** Border radii */
export const R = {
  sheet:      26,
  card:       22,
  sourceCard: 16,
  iconLg:     10,
  iconSm:     8,
  pill:       999,
  dot:        '50%' as const,
} as const;

/** Spacing */
export const S = {
  cardPadding:    22,
  cardGap:        14,
  chipHeight:     28,
  chipPaddingH:   11,
  serviceIconSize:28,
  sourceIconSize: 40,
  sectionDividerV:22,
} as const;
