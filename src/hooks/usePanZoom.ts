import { useCallback, useState } from "react";
import useDebounceCb from "./useDebounceCb";
import useThrottleRAF from "./useThrottleRAF";

export default function usePanZoom(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  drawCanvas: () => void
) {
  const [zoom, setZoom] = useState(0);

  const throttledGridRender = useThrottleRAF(drawCanvas, 120);

  const debouncedSetZoom = useDebounceCb(setZoom, 500);

  const handleWheelZoom = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      const context = canvasRef.current?.getContext("2d")!;
      const transform = context.getTransform();
      const rect = canvasRef.current?.getBoundingClientRect()!;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const step = (10 / 100) * Math.sign(e.deltaY);
      const newZoom = transform.a * (1 + step);
      transform.a = newZoom;
      transform.d = newZoom;

      const dx = (x - transform.e) * step;
      const dy = (y - transform.f) * step;

      transform.e -= dx;
      transform.f -= dy;

      context.setTransform(transform);

      throttledGridRender();
      debouncedSetZoom(newZoom);
    },
    [debouncedSetZoom]
  );

  return {
    handleWheelZoom,
    zoom,
  };
}
