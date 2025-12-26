import { useEffect, useRef, useState } from 'react';
import styles from './ParallaxBanner.module.css';

interface LayerConfig {
  image: string;
  speed: number;
}

interface ParallaxBannerProps {
  /** 自定义图层配置，默认使用内置 banner 图 */
  layers?: LayerConfig[];
  /** 自定义类名 */
  className?: string;
}

// 检测是否为移动设备（用于性能优化）
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 'ontouchstart' in window;
};

// 本地 banner 图片列表（按层级顺序，前面的图层在底层）
const BANNER_IMAGES = [
  '/images/banner/13.webp', // 最底层
  '/images/banner/17.webp',
  '/images/banner/1.webp',
  '/images/banner/2.webp',
  '/images/banner/21.webp',
  '/images/banner/10.webp',
  '/images/banner/11.webp',
  '/images/banner/3.webp',
  '/images/banner/8.webp',
  '/images/banner/12.webp',
  '/images/banner/15.webp',
  '/images/banner/18.webp',
  '/images/banner/16.webp',
  '/images/banner/19.webp',
  '/images/banner/20.webp',
  '/images/banner/9.webp',
  '/images/banner/5.webp',
  '/images/banner/6.webp',
  '/images/banner/7.webp',
  '/images/banner/14.webp',
  '/images/banner/4.webp', // 最顶层
];

// 生成默认图层配置：每层速度递增，产生视差效果
const DEFAULT_LAYERS: LayerConfig[] = BANNER_IMAGES.map((image, index) => ({
  image,
  // 速度从 0.002 递增到 0.03，移动幅度较小
  speed: 0.002 + (index / (BANNER_IMAGES.length - 1)) * 0.028,
}));

// 移动端简化层数（只保留前 5 层和最后 3 层，约 8 层）
const MOBILE_LAYERS: LayerConfig[] = [
  ...DEFAULT_LAYERS.slice(0, 5),
  ...DEFAULT_LAYERS.slice(-3),
];

export default function ParallaxBanner({
  layers = DEFAULT_LAYERS,
  className = '',
}: ParallaxBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  // 直接初始化，避免 useEffect 导致的二次渲染
  const [isMobile, setIsMobile] = useState(() => isMobileDevice());

  // 仅监听 resize 事件
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 移动端使用简化层数
  const activeLayers = isMobile ? MOBILE_LAYERS : layers;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // 移动端禁用视差动画，提升性能
    if (isMobile) return;

    let mouseX = 0;
    let currentX = 0;
    let animationId: number | null = null;
    let isHovering = false;

    // 动画循环：缓动效果
    const animate = () => {
      // 缓动公式：每帧向目标靠近 10%
      currentX += (mouseX - currentX) * 0.1;

      // 应用位移到所有层
      layerRefs.current.forEach((layer, index) => {
        if (layer && activeLayers[index]) {
          const x = currentX * activeLayers[index].speed;
          layer.style.transform = `translate3d(${x}px, 0, 0)`;
        }
      });

      // 如果鼠标离开且位置已接近中心，停止动画
      if (!isHovering && Math.abs(currentX) < 0.5) {
        currentX = 0;
        layerRefs.current.forEach((layer) => {
          if (layer) layer.style.transform = 'translate3d(0, 0, 0)';
        });
        animationId = null;
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    // 启动动画（如果尚未运行）
    const startAnimation = () => {
      if (animationId === null) {
        animationId = requestAnimationFrame(animate);
      }
    };

    // 鼠标进入时开始动画
    const handleMouseEnter = () => {
      isHovering = true;
      startAnimation();
    };

    // 记录鼠标位置（相对于容器中心）
    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - (rect.left + rect.width / 2);
    };

    // 鼠标离开时回到中心
    const handleMouseLeave = () => {
      isHovering = false;
      mouseX = 0;
    };

    // 在容器上监听鼠标事件
    wrapper.addEventListener('mouseenter', handleMouseEnter);
    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    // 清理
    return () => {
      wrapper.removeEventListener('mouseenter', handleMouseEnter);
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId !== null) cancelAnimationFrame(animationId);
    };
  }, [activeLayers, isMobile]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${className}`}
      data-res-type="1-8"
    >
      {/* 第一层作为占位层，撑开容器高度 */}
      {activeLayers.length > 0 && (
        <div
          ref={(el) => { layerRefs.current[0] = el; }}
          className={`${styles.layer} ${styles.placeholder}`}
          style={{ zIndex: 0 }}
        >
          <img src={activeLayers[0].image} alt="" className={styles.layerImage} />
        </div>
      )}
      {/* 其余图层从 index 1 开始 */}
      {activeLayers.slice(1).map((layer, index) => (
        <div
          key={layer.image}
          ref={(el) => { layerRefs.current[index + 1] = el; }}
          className={styles.layer}
          style={{ zIndex: index + 1 }}
        >
          <img src={layer.image} alt="" className={styles.layerImage} />
        </div>
      ))}
    </div>
  );
}
