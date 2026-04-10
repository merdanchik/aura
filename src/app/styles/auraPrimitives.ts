import type { CSSProperties } from 'react';
import { C, T, R, S } from './auraTokens';

// ── Screen shell ──────────────────────────────────────────────────────────────

export const screenBg: CSSProperties = {
  position: 'fixed', inset: 0,
  background: C.appBg,
  display: 'flex', flexDirection: 'column',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

// ── Detail header ──────────────────────────────────────────────────────────────

export const detailHeader: CSSProperties = {
  display: 'flex', flexDirection: 'column',
  padding: '16px 16px 12px',
  flexShrink: 0,
};

export const detailHeaderTitle: CSSProperties = {
  color: C.textPrimary, fontSize: 28, fontWeight: 700, lineHeight: 1.05,
  marginTop: 6,
};

export const detailHeaderSubtitle: CSSProperties = {
  color: C.textQuiet, fontSize: 13, marginTop: 3,
};

export const backBtn: CSSProperties = {
  width: 32, height: 32, borderRadius: R.dot,
  background: C.borderLight, border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: C.textPrimary, cursor: 'pointer', flexShrink: 0,
  WebkitTapHighlightColor: 'transparent',
};

export const chatBtnBase = (accent: string): CSSProperties => ({
  width: 32, height: 32, borderRadius: R.dot,
  background: `${accent}18`, border: `1.5px solid ${accent}40`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 15, cursor: 'pointer', flexShrink: 0,
  WebkitTapHighlightColor: 'transparent',
});

// ── Section label ─────────────────────────────────────────────────────────────

export const secLabelStyle: CSSProperties = {
  color: C.textTertiary,
  ...T.label,
  textTransform: 'uppercase',
  marginBottom: S.cardGap,
};

// ── Divider ───────────────────────────────────────────────────────────────────

export const sectionDivider: CSSProperties = {
  height: 1,
  background: C.border,
  margin: `${S.sectionDividerV}px 0`,
};

// ── Hero block ────────────────────────────────────────────────────────────────

export const heroBlock = (accent: string): CSSProperties => ({
  borderRadius: R.card,
  background: `linear-gradient(140deg, ${accent}35 0%, ${C.surface} 70%)`,
  padding: '22px 20px 20px',
  marginBottom: 30,
  boxShadow: `0 0 48px ${accent}18, 0 4px 24px rgba(0,0,0,0.45)`,
});

export const heroTitleStyle: CSSProperties = {
  color: C.textPrimary,
  ...T.heroTitle,
  marginBottom: 12,
};

export const heroBodyStyle: CSSProperties = {
  color: C.textSecondary,
  ...T.heroBody,
  marginBottom: 16,
};

export const heroTemporalStyle: CSSProperties = {
  color: C.textTertiary,
  ...T.meta,
};

// ── Value dot rows ────────────────────────────────────────────────────────────

export const valueDot = (accent: string): CSSProperties => ({
  width: 5, height: 5, borderRadius: R.dot,
  background: accent, opacity: 0.65,
  marginTop: 6, flexShrink: 0,
});

export const valueText: CSSProperties = {
  color: C.textSecondary,
  ...T.secondary,
};

// ── Source card ───────────────────────────────────────────────────────────────

export const sourceCard: CSSProperties = {
  borderRadius: R.sourceCard,
  background: C.surface,
  padding: '16px',
  display: 'flex', gap: S.cardGap, alignItems: 'flex-start',
  boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
};

export const sourceIconImg: CSSProperties = {
  width: S.sourceIconSize, height: S.sourceIconSize,
  borderRadius: R.iconLg, objectFit: 'cover', flexShrink: 0,
};

export const sourceBadge = (accent: string): CSSProperties => ({
  width: S.sourceIconSize, height: S.sourceIconSize,
  borderRadius: R.iconLg, flexShrink: 0,
  background: `${accent}18`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: accent, fontSize: 13, fontWeight: 600, opacity: 0.9,
});

export const sourceNameStyle: CSSProperties = {
  color: C.textPrimary,
  ...T.sourceName,
  marginBottom: 6,
};

export const sourceFactsStyle: CSSProperties = {
  color: C.textSecondary,
  ...T.meta,
  marginBottom: 7,
};

// ── Chip ──────────────────────────────────────────────────────────────────────

export const chipStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  height: S.chipHeight,
  borderRadius: R.pill,
  padding: `0 ${S.chipPaddingH}px`,
  background: C.chipBg,
  color: C.textMediumEmphasis,
  ...T.chip,
  whiteSpace: 'nowrap',
};

// ── World card (WorldWidgets) ─────────────────────────────────────────────────

export const worldCard = (accent?: string): CSSProperties => ({
  borderRadius: R.sheet,
  marginBottom: S.cardGap,
  background: accent
    ? `linear-gradient(135deg, ${accent}12 0%, ${C.surface} 55%)`
    : C.surface,
  padding: `${S.cardPadding}px`,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
});
