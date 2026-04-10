import React from 'react';
import { C } from '../../styles/auraTokens';
import { secLabelStyle, sectionDivider } from '../../styles/auraPrimitives';

export const SecLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={secLabelStyle}>{children}</p>
);

export const Divider: React.FC = () => (
  <div style={sectionDivider} />
);

export const StatusBadge: React.FC<{ color: string; text: string }> = ({ color, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
    <span style={{ color, fontSize: 13, fontWeight: 500 }}>{text}</span>
  </div>
);
