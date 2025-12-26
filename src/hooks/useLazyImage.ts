import { useState, useEffect, useRef } from 'react';

/**
 * 图片懒加载 Hook
 * 使用 Intersection Observer 实现图片在进入视口时才加载
 */
export function useLazyImage(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: '50px', // 提前 50px 开始加载
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 当进入视口时，预加载图片
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); // 加载失败也标记为已完成
    img.src = src;
  }, [isInView, src]);

  return {
    ref,
    isLoaded,
    isInView,
    // 只有在视口内且已加载时才显示图片
    shouldShowImage: isInView && isLoaded,
    // 图片 URL（仅在视口内时返回）
    imageSrc: isInView ? src : undefined,
  };
}

export default useLazyImage;
