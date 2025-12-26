import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TopLoadingBar.module.css';

// 判断是否是弹窗关闭场景（从详情页返回列表页或首页）
function isModalClose(prevPath: string, currentPath: string): boolean {
  const detailPattern = /^\/articles\/\d+$/;
  // 从文章详情返回：到列表页 或 到首页
  return detailPattern.test(prevPath) && (currentPath === '/articles' || currentPath === '/');
}

export default function TopLoadingBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    // 路由变化时触发进度条
    if (currentPath !== prevPath) {
      prevPathRef.current = currentPath;

      // 弹窗关闭场景不显示进度条
      if (isModalClose(prevPath, currentPath)) {
        return;
      }

      // 开始加载
      setIsVisible(true);
      setProgress(0);

      // 模拟进度（使用数组管理所有定时器，避免内存泄漏）
      const timers: ReturnType<typeof setTimeout>[] = [];

      timers.push(setTimeout(() => setProgress(30), 50));
      timers.push(setTimeout(() => setProgress(60), 150));
      timers.push(setTimeout(() => setProgress(80), 300));
      timers.push(setTimeout(() => setProgress(100), 400));
      // 完成后隐藏（避免嵌套 setTimeout）
      timers.push(
        setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 600) // 400 + 200
      );

      return () => {
        timers.forEach(clearTimeout);
      };
    }
    return undefined;
  }, [location.pathname]);

  if (!isVisible && progress === 0) {
    return null;
  }

  return (
    <div className={styles.loadingBar} data-res-type="0-4">
      <div
        className={styles.progress}
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
