import React from 'react';
import { secLabelStyle, sectionDivider } from '../../styles/auraPrimitives';

export const SecLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={secLabelStyle}>{children}</p>
);

export const Divider: React.FC = () => (
  <div style={sectionDivider} />
);
