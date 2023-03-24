import { useRef, useEffect, useMemo } from "react";

export default function useThrottleRAF(cb: () => void, fps = 60) {
  const frameRef = useRef(0);

  const wait = useMemo(() => {
    return Math.floor(1000 / fps);
  }, [fps]);

  const throttledRAF = useMemo(() => {
    let prevCall = 0;

    const wrapperCb = (now: number) => {
      if (now - prevCall < wait) return;
      prevCall = now;

      cb();
    };

    return () => {
      frameRef.current = requestAnimationFrame(wrapperCb);
    };
  }, [cb, wait]);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return throttledRAF;
}
