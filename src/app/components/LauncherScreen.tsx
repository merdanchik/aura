import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import avatarImg from '../../assets/avatar.jpg';
import launcherIcon from '../../assets/launcher-icon.svg';

export const LauncherScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#000',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Centered avatar */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <motion.img
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          src={avatarImg}
          alt="Профиль"
          style={{ width: 260, height: 260, borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>

      {/* Aura app icon — mirrors avatar position in Aura header */}
      <motion.button
        whileTap={{ scale: 0.88, opacity: 0.7 }}
        transition={{ duration: 0.12 }}
        onClick={() => navigate('/app')}
        style={{ position: 'absolute', top: 18, right: 16, zIndex: 10, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <img src={launcherIcon} alt="Аура" style={{ width: 45, height: 45, objectFit: 'contain' }} />
      </motion.button>
    </div>
  );
};
