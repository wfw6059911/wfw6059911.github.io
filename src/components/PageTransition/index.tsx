import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 路由变化时，先隐藏再显示（触发动画）
    setIsVisible(false);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 短暂延迟后显示新内容
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  return (
    <div className={`${styles.pageTransition} ${isVisible ? styles.visible : ''}`}>
      {children}
    </div>
  );
}
