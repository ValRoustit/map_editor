import { useRef, useEffect, useCallback } from "react";

export default function useDebounceCb(
  cb: (...args: any[]) => void,
  wait = 500
) {
  const cbRef = useRef(cb);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  const debounced = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => cbRef.current(...args), wait);
    },
    [wait]
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return debounced;
}
