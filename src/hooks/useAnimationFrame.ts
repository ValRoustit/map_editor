import { useRef, useEffect, useState } from "react";

export default function useAnimationFrame(cb: () => void) {
  const [animate, setAnimate] = useState(false);
  const cbRef = useRef(cb);
  const frameRef = useRef(0);

  useEffect(() => {
    const render = () => {
      cbRef.current();
      frameRef.current = requestAnimationFrame(render);
    };

    if (animate) render();

    return () => cancelAnimationFrame(frameRef.current);
  }, [animate]);

  return setAnimate;
}
