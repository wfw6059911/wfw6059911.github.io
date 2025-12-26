import { useState, useEffect, useCallback, useRef } from 'react';

interface MouseOffset {
  x: number; // -1 到 1 的归一化值
  y: number; // -1 到 1 的归一化值
}

/**
 * 鼠标追踪 Hook
 * 计算鼠标相对于元素中心的偏移，用于控制眼睛跟随效果
 */
export function useMouseTracker(elementRef: React.RefObject<HTMLElement | null>) {
  const [offset, setOffset] = useState<MouseOffset>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // 使用 requestAnimationFrame 节流
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!elementRef.current) return;

        // 获取元素中心点
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 计算鼠标相对于中心的偏移
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // 计算距离，用于归一化
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 300; // 最大响应距离

        // 归一化到 -1 ~ 1 范围
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const angle = Math.atan2(deltaY, deltaX);

        setOffset({
          x: Math.cos(angle) * normalizedDistance,
          y: Math.sin(angle) * normalizedDistance,
        });
      });
    },
    [elementRef]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  return offset;
}
