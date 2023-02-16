import { useRef, useEffect, useMemo } from "react";

export default function useDebounce(cb: () => void, wait: number = 500) {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  const debounced = useMemo(() => {
    let id: number;

    return () => {
      if (id) clearTimeout(id);
      id = setTimeout(() => cbRef.current(), wait);
    };
  }, [wait]);

  return debounced;
}
