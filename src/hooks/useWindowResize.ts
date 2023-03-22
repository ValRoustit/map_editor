import { useLayoutEffect } from "react";

export default function useWindowResize(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cb: () => void
) {
  useLayoutEffect(() => {
    function handleResize() {
      if (!canvasRef.current) return;
      const context = canvasRef.current.getContext("2d");
      const transform = context?.getTransform();

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      context?.setTransform(transform);

      cb();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, cb]);
}
