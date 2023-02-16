import { useCallback, useEffect, useRef } from "react";
import { hexGrid } from "./draw_utils";
import useAnimationFrame from "../hooks/useAnimationFrame";
import useThrottleRAF from "../hooks/useThrottleRAF";

// export interface CanvasProps extends HTMLProps<HTMLCanvasElement> {
//   draw: Draw;
// }

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grab = useRef(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const zoom = useRef(1);

  const drawGrid = useCallback((context: CanvasRenderingContext2D) => {
    hexGrid(context, 100);
  }, []);

  const throttledGridRender = useThrottleRAF(
    () => drawGrid(canvasRef.current?.getContext("2d")!),
    120
  );

  const setAnimate = useAnimationFrame(() =>
    drawGrid(canvasRef.current?.getContext("2d")!)
  );

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")!;
    const id = requestAnimationFrame(() => drawGrid(ctx));

    return () => cancelAnimationFrame(id);
  }, []);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext("2d")!;
    const transform = context.getTransform();
    const rect = canvasRef.current?.getBoundingClientRect()!;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const step = (10 / 100) * Math.sign(e.deltaY);
    zoom.current = transform.a * (1 + step);
    transform.a = zoom.current;
    transform.d = zoom.current;

    const dx = (x - transform.e) * step;
    const dy = (y - transform.f) * step;

    transform.e -= dx;
    transform.f -= dy;

    context.setTransform(transform);

    throttledGridRender();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    grab.current = true;
    setAnimate(true);
    mouseX.current = e.clientX;
    mouseY.current = e.clientY;
  };

  const handleMouseStop = () => {
    grab.current = false;
    setAnimate(false);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!grab.current) return;

      const context = canvasRef.current?.getContext("2d")!;

      const dx = (mouseX.current - e.clientX) / zoom.current;
      const dy = (mouseY.current - e.clientY) / zoom.current;

      context.translate(-dx, -dy);

      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    },
    []
  );

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="500"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseStop}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseStop}
      onWheel={handleWheel}
    />
  );
}
