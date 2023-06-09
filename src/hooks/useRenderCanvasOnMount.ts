import { useEffect } from "react";

export default function useRenderCanvasOnMount(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cb: () => void
) {
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();

      canvasRef.current.width = window.innerWidth - rect.left;
      canvasRef.current.height = window.innerHeight - rect.top;
    }
    const id = requestAnimationFrame(cb);

    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
