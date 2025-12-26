import { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import styles from './ArticleModal.module.css';

// 动态导入以保持代码分割
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetail'));

export default function ArticleModal() {
  const { id } = useParams<{ id: string }>();
  const [isReady, setIsReady] = useState(false);

  // 关闭浮窗 - 使用浏览器原生 back() 保持原页面状态
  const handleClose = useCallback(() => {
    window.history.back();
  }, []);


  // 阻止背景滚动（补偿滚动条宽度防止抖动）
  useEffect(() => {
    // 计算滚动条宽度
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 保存原始样式
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // 隐藏滚动条并补偿宽度
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // 内容加载完成回调
  const handleContentReady = () => {
    // 使用 requestAnimationFrame 确保 DOM 渲染完成
    requestAnimationFrame(() => {
      setIsReady(true);
    });
  };

  // id 变化时重置 loading 状态
  useEffect(() => {
    setIsReady(false);
  }, [id]);

  // 使用 Portal 渲染到 body，确保在 DOM 树最外层
  return createPortal(
    <>
      {/* 遮罩背景 */}
      <div className={styles.overlay} />

      {/* 浮窗主体 */}
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* 关闭按钮 */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="关闭"
        >
          <CloseOutlined />
        </button>

        {/* Loading 状态 */}
        {!isReady && (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        )}

        {/* 文章内容 */}
        <div
          className={styles.content}
          key={id}
          style={{ visibility: isReady ? 'visible' : 'hidden' }}
        >
          <Suspense fallback={null}>
            <ArticleDetailPage onReady={handleContentReady} />
          </Suspense>
        </div>
      </div>
    </>,
    document.body
  );
}
