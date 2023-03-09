import { useRef, useEffect, useMemo } from "react";

export default function useThrottle(cb: () => void, wait = 500) {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  const throttled = useMemo(() => {
    let prevCall = 0;

    return () => {
      const now = new Date().getTime();
      if (now - prevCall < wait) return;
      prevCall = now;
      cbRef.current();
    };
  }, [wait]);

  return throttled;
}
