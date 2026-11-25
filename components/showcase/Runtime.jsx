import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const Runtime = createContext({ reducedMotion: false, visible: true, animate: true });

export function ShowcaseRuntime({ children, reducedMotion = false, active = true }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const value = useMemo(() => ({ reducedMotion, visible: visible && active, animate: !reducedMotion && visible && active }), [reducedMotion, visible, active]);
  return <Runtime.Provider value={value}>{children}</Runtime.Provider>;
}

export const useShowcaseMotion = () => useContext(Runtime);
