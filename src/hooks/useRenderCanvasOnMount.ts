import { useEffect } from "react";

export default function useRenderCanvasOnMount(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cb: () => void
) {
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
    const id = requestAnimationFrame(cb);

    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
