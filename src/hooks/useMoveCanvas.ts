import { useCallback, useRef, useState } from "react";
import useAnimationFrame from "./useAnimationFrame";
import useDebounceCb from "./useDebounceCb";

const initOffSet = { x: 0, y: 0 };

export default function useMoveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  drawCanvas: () => void
) {
  const [offSet, setOffset] = useState(initOffSet);
  const [grab, setGrab] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });

  const setAnimate = useAnimationFrame(drawCanvas);

  const setAnimateDebounced = useDebounceCb(setAnimate);

  const handleGrab = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setGrab(true);
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!grab) return;

      setAnimate(true);
      const context = canvasRef.current?.getContext("2d")!;
      const scale = context.getTransform().a;

      const dx = (mousePos.current.x - e.clientX) / scale;
      const dy = (mousePos.current.y - e.clientY) / scale;

      context.translate(-dx, -dy);

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      setOffset({ x: dx, y: dy }); // deboumce later
      setAnimateDebounced(false);
    },
    [grab, setAnimate, setAnimateDebounced]
  );

  const handleRelease = useCallback(() => {
    setGrab(false);
  }, [setGrab]);

  return {
    offSet,
    handleGrab,
    handleMove,
    handleRelease,
  };
}
