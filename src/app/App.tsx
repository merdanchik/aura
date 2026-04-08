import React from 'react';
import { RouterProvider, createBrowserRouter, Outlet, useNavigate, useLocation } from 'react-router';
import { AuraProvider } from './context/AuraContext';
import { Dashboard } from './components/Dashboard';
import { ServiceDetail } from './components/ServiceDetail';
import { ChevronLeft } from 'lucide-react';
import { useAura, ServiceId } from './context/AuraContext';
import { motion, AnimatePresence } from 'motion/react';
import { Switch } from './components/ui/switch';
import avatarImg from "../assets/avatar.jpg";
const Shell = () => {
  return (
    <AuraProvider>
      <ShellInner />
    </AuraProvider>
  );
};

const ShellInner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { globalTrustScore, triggerEvent, theme, services, strongAura, toggleStrongAura } = useAura();
  const [alertDismissed, setAlertDismissed] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const isRoot = location.pathname === '/';
  const splitTrust = services['split' as ServiceId]?.trustScore ?? 100;
  const isTrustCritical = splitTrust < 50;

  // Extract service name from path
  const serviceMatch = location.pathname.match(/^\/service\/(.+)$/);
  const serviceName = serviceMatch ? services[serviceMatch[1] as ServiceId]?.name : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: '#000000', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <header className="w-full max-w-md mx-auto sticky top-0 z-50 backdrop-blur-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <div className="h-16 flex items-end pb-2 px-4 relative">
          {isRoot && (
            <span className="text-[28px] text-white leading-tight" style={{ fontWeight: 700 }}>Аура</span>
          )}
          {!isRoot && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 active:opacity-50 transition-opacity -ml-1.5"
              style={{ color: theme.primary }}
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
              {serviceName && (
                <span className="text-[22px] text-white leading-tight" style={{ fontWeight: 700 }}>
                  {serviceName}
                </span>
              )}
            </button>
          )}
          <div className="relative ml-auto">
            <button onClick={() => setShowMenu(v => !v)} className="active:opacity-70 transition-opacity">
              <img
                src={avatarImg}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                style={strongAura ? { boxShadow: '0 0 0 2px #30D158' } : undefined}
              />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showMenu && (
                <>
                  {/* backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -6 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute right-0 top-10 z-50 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                    style={{ backgroundColor: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)', minWidth: 220 }}
                  >
                    <div className="flex items-center justify-between px-4 py-4">
                      <div>
                        <p className="text-[15px] text-white" style={{ fontWeight: 500 }}>Сильная аура</p>
                        <p className="text-[12px] text-[#636366] mt-0.5">Все показатели → 99</p>
                      </div>
                      <Switch
                        checked={strongAura}
                        onCheckedChange={() => { toggleStrongAura(); }}
                        className="h-[31px] w-[51px] data-[state=checked]:bg-[#30D158] data-[state=unchecked]:bg-[#3A3A3C] border-0 [&>[data-slot=switch-thumb]]:size-[27px] [&>[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[22px] [&>[data-slot=switch-thumb]]:shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Thin gradient accent line */}
        <div
          className="h-[0.5px] w-full"
          style={{ background: `linear-gradient(to right, transparent, ${theme.primary}60, transparent)` }}
        />
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-md mx-auto relative">
        <Outlet />
      </main>

      {/* Trust alert */}
      <AnimatePresence>
        {isTrustCritical && !alertDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[calc(448px-32px)] z-50"
          >
            <div className="rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-4 border border-white/10" style={{ backgroundColor: '#1C1C1E' }}>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg" style={{ fontWeight: 700 }}>!</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] text-white" style={{ fontWeight: 600 }}>Просрочка по Сплиту</p>
                  <p className="text-[13px] text-[#98989D] mt-0.5 leading-snug">
                    Аура Доверия снижена. Оплатите задолженность для восстановления.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => { triggerEvent('recovery'); setAlertDismissed(true); }}
                      className="flex-1 text-white text-[15px] py-2.5 rounded-xl active:opacity-70 transition-all"
                      style={{ fontWeight: 600, backgroundColor: theme.primary }}
                    >
                      Оплатить
                    </button>
                    <button
                      onClick={() => setAlertDismissed(true)}
                      className="flex-1 text-[#98989D] text-[15px] py-2.5 rounded-xl active:opacity-70 transition-all"
                      style={{ fontWeight: 600, backgroundColor: '#2C2C2E' }}
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: Shell,
    children: [
      { index: true, Component: Dashboard },
      { path: "service/:id", Component: ServiceDetail },
    ],
  },
], { basename: import.meta.env.BASE_URL });

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}