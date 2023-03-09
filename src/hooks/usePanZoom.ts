import { useCallback, useRef } from "react";
import { clamp } from "../utils/utils";

const MIN = 0.2;
const MAX = 2;

export default function usePanZoom(
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  const zoom = useRef(1);

  const handleZoom = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      const context = canvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const rect = canvasRef.current?.getBoundingClientRect() as DOMRect;
      const transform = context.getTransform();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const step = (10 / 100) * Math.sign(e.deltaY);

      const newZoom =
        Math.round(clamp(zoom.current + step, MIN, MAX) * 100) / 100;
      if (newZoom === zoom.current) return;

      const dx = ((x - transform.e) * step) / zoom.current;
      const dy = ((y - transform.f) * step) / zoom.current;

      transform.e -= dx;
      transform.f -= dy;

      context.setTransform(transform);

      zoom.current = newZoom;
    },
    [canvasRef, zoom]
  );

  return {
    handleZoom,
    zoom,
  };
}
