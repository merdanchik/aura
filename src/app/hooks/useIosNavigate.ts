import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';

/**
 * Module-level history stack — shared across all components,
 * survives component remounts, resets on full page reload.
 */
const navHistory: string[] = [];

/**
 * iOS-like navigation hook using the View Transitions API.
 *
 *  go(path)      — forward slide (right → center), pushes current path to stack
 *  back(path?)   — backward slide (left ← center), pops stack or uses explicit path
 *  replace(path) — no animation, same-level swap (e.g. world dot switching)
 */
export function useIosNavigate() {
  const rNavigate = useNavigate();
  const { pathname } = useLocation();

  const go = useCallback((path: string) => {
    navHistory.push(pathname);
    document.documentElement.dataset.navDir = 'forward';
    rNavigate(path, { viewTransition: true });
  }, [rNavigate, pathname]);

  const back = useCallback((path?: string) => {
    const popped = navHistory.pop();
    const target = path ?? popped ?? '/';
    document.documentElement.dataset.navDir = 'back';
    rNavigate(target, { replace: true, viewTransition: true });
  }, [rNavigate]);

  const replace = useCallback((path: string) => {
    rNavigate(path, { replace: true });
  }, [rNavigate]);

  return { go, back, replace };
}
