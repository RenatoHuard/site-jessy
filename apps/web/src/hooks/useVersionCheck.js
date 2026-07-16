import { useState, useEffect, useRef } from 'react';

export function useVersionCheck(intervalMs = 120000) {
  const [hasUpdate, setHasUpdate] = useState(false);
  const initialVersion = useRef(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`);
        if (!res.ok) return;
        const { version } = await res.json();
        if (!initialVersion.current) {
          initialVersion.current = version;
          return;
        }
        if (version !== initialVersion.current) {
          setHasUpdate(true);
        }
      } catch {}
    };

    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return hasUpdate;
}
