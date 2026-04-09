import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import avatarImg from '../../assets/avatar.jpg';
import launcherIcon from '../../assets/launcher-icon.svg';

export const LauncherScreen = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center overflow-x-hidden"
      style={{ backgroundColor: '#000', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col" style={{ minHeight: '100vh' }}>
        {/* Top bar — same height and padding as Aura header */}
        <div className="h-16 flex items-end pb-2 px-4">
          <motion.button
            whileTap={{ scale: 0.88, opacity: 0.7 }}
            transition={{ duration: 0.12 }}
            onClick={() => navigate('/app')}
            className="ml-auto active:opacity-70"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={launcherIcon} alt="Аура" style={{ width: 45, height: 45, objectFit: 'contain' }} />
          </motion.button>
        </div>

        {/* Avatar centered in remaining space */}
        <div className="flex-1 flex items-center justify-center">
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
    </div>
  );
};
