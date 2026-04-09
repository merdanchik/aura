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
      {/* Aura app icon — top right */}
      <div style={{ position: 'absolute', top: 72, right: 24 }}>
        <motion.button
          whileTap={{ scale: 0.88, opacity: 0.7 }}
          transition={{ duration: 0.12 }}
          onClick={() => navigate('/app')}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 15,
            backgroundColor: '#1C1C1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img src={launcherIcon} alt="Аура" style={{ width: 50, height: 50, objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: 11, color: 'white', fontWeight: 400, letterSpacing: 0.2 }}>Аура</span>
        </motion.button>
      </div>

      {/* Centered avatar */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.img
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          src={avatarImg}
          alt="Профиль"
          style={{ width: 260, height: 260, borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};
