// Telegram WebApp bridge
// Falls back gracefully when running outside of Telegram

export const tg = typeof window !== 'undefined' && window.Telegram?.WebApp
  ? window.Telegram.WebApp
  : null;

export function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  // Go truly fullscreen — removes URL bar (Bot API 8.0+)
  if ('requestFullscreen' in tg) {
    (tg as any).requestFullscreen();
  }
  // Prevent swipe-down-to-close when scrolling up (Bot API 7.7+)
  if ('disableVerticalSwipes' in tg) {
    (tg as any).disableVerticalSwipes();
  }
}

export function setBackButton(show: boolean, onClick?: () => void) {
  if (!tg) return;
  if (show) {
    tg.BackButton.show();
    if (onClick) {
      tg.BackButton.offClick(() => {});
      tg.BackButton.onClick(onClick);
    }
  } else {
    tg.BackButton.hide();
  }
}

// Augment window type
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
          offClick: (fn: () => void) => void;
        };
        safeAreaInset?: { top: number; bottom: number; left: number; right: number };
        contentSafeAreaInset?: { top: number };
      };
    };
  }
}
