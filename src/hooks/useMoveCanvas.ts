import { useCallback, useRef, useState } from "react";
import useAnimationFrame from "./useAnimationFrame";
import useDebounceCb from "./useDebounceCb";

export default function useMoveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  drawCanvas: () => void
) {
  const offSet = useRef({ x: 0, y: 0 });
  // const [offSet, setOffset] = useState({ x: 0, y: 0 }); ?
  // const [grab, setGrab] = useState(false); ?
  const grab = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });

  const setAnimate = useAnimationFrame(drawCanvas);

  const setAnimateDebounced = useDebounceCb(setAnimate);

  const handleGrab = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    grab.current = true;
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!grab.current) return;

      setAnimate(true);
      const context = canvasRef.current?.getContext("2d")!;
      const scale = context.getTransform().a;

      const dx = (mousePos.current.x - e.clientX) / scale;
      const dy = (mousePos.current.y - e.clientY) / scale;

      context.translate(-dx, -dy);

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      offSet.current = { x: dx, y: dy };
      setAnimateDebounced(false);
    },
    [setAnimate, setAnimateDebounced]
  );

  return {
    offSet: offSet.current,
    handleGrab,
    handleMove,
    handleRelease: () => (grab.current = false),
  };
}
