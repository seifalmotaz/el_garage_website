import { useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

const DRAG_THRESHOLD = 5;

export const useDragClickableCards = () => {
  const router = useRouter();
  const startX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const pathname = usePathname();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (Math.abs(e.clientX - startX.current) > DRAG_THRESHOLD) {
      isDragging.current = true;
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent, link: string) => {
      e.preventDefault();
      if (!isDragging.current) {
        if (link === pathname) window.location.reload();
        else router.push(link);
      }
    },
    [router],
  );

  return { handleMouseDown, handleMouseMove, handleClick };
};
