import { useRef, useEffect, useMemo } from "react";

export default function useThrottleRAF(cb: () => void) {
  const frameRef = useRef(0);

  const throttledRAF = useMemo(() => {
    let prevTimeStamp = 0;

    const wrapperCb = (now: number) => {
      if (prevTimeStamp === now) return;

      prevTimeStamp = now;
      cb();
    };

    return () => {
      frameRef.current = requestAnimationFrame(wrapperCb);
    };
  }, [cb]);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return throttledRAF;
}
