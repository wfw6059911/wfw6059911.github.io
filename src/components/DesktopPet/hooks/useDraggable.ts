import { useState, useCallback, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DraggableOptions {
  initialPosition?: Position;
  bounds?: 'viewport' | 'none';
  storageKey?: string;
  elementWidth?: number;
  elementHeight?: number;
}

/**
 * 拖拽功能 Hook
 * 支持边界限制和位置持久化
 */
export function useDraggable(options: DraggableOptions = {}) {
  const {
    bounds = 'viewport',
    storageKey = 'desktopPet_position',
    elementWidth = 80,
    elementHeight = 100,
  } = options;

  // 从 localStorage 读取位置
  const getInitialPosition = (): Position => {
    if (typeof window === 'undefined') {
      return { x: 100, y: 100 };
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 验证位置是否在视口内
        if (
          parsed.x >= 0 &&
          parsed.x <= window.innerWidth - elementWidth &&
          parsed.y >= 0 &&
          parsed.y <= window.innerHeight - elementHeight
        ) {
          return parsed;
        }
      } catch {
        // 忽略解析错误
      }
    }

    // 默认位置：左下角
    return {
      x: 40,
      y: window.innerHeight - elementHeight - 40,
    };
  };

  const [position, setPosition] = useState<Position>(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    posX: number;
    posY: number;
  } | null>(null);

  // 开始拖拽
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: position.x,
        posY: position.y,
      };
    },
    [position]
  );

  // 拖拽中
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      let newX = dragStartRef.current.posX + deltaX;
      let newY = dragStartRef.current.posY + deltaY;

      // 边界限制
      if (bounds === 'viewport') {
        newX = Math.max(0, Math.min(newX, window.innerWidth - elementWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - elementHeight));
      }

      setPosition({ x: newX, y: newY });
    },
    [isDragging, bounds, elementWidth, elementHeight]
  );

  // 结束拖拽
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      // 保存位置到 localStorage
      localStorage.setItem(storageKey, JSON.stringify(position));
    }
  }, [isDragging, position, storageKey]);

  // 绑定全局事件
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 窗口大小变化时检查边界
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - elementWidth),
        y: Math.min(prev.y, window.innerHeight - elementHeight),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [elementWidth, elementHeight]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
}
