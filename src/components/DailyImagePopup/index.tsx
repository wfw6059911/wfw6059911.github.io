import { useState, useEffect } from 'react';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './DailyImagePopup.module.css';

const STORAGE_KEY = 'dailyImagePopup_closedDate';
const IMAGE_URL = 'https://api.03c3.cn/api/zb';

// 判断今天是否已关闭
const isTodayClosed = (): boolean => {
  try {
    const closedDate = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    return closedDate === today;
  } catch {
    return false;
  }
};

export default function DailyImagePopup() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查今天是否已关闭
    if (!isTodayClosed()) {
      setVisible(true);
    }

    // 监听打开请求事件（来自 FloatButtons）
    const handleOpenRequest = () => {
      setVisible(true);
      window.dispatchEvent(new CustomEvent('dailyPopup:open'));
    };

    window.addEventListener('dailyPopup:requestOpen', handleOpenRequest);
    return () => {
      window.removeEventListener('dailyPopup:requestOpen', handleOpenRequest);
    };
  }, []);

  // 关闭弹窗
  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    } catch {
      // 忽略 localStorage 写入错误（隐私模式等）
    }
    setVisible(false);
    // 通知 FloatButtons 显示悬浮图标
    window.dispatchEvent(new CustomEvent('dailyPopup:close'));
    // 通知其他弹窗可以显示了
    window.dispatchEvent(new CustomEvent('dailyPopup:closed'));
  };

  // 图片加载完成
  const handleImageLoad = () => {
    setLoading(false);
  };

  // 图片加载失败
  const handleImageError = () => {
    setLoading(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} data-res-type="1-9">
      <div className={styles.modal}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <span className={styles.title}>每日60秒读懂世界</span>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="关闭弹窗"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* 内容区域 - 支持滚动 */}
        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <LoadingOutlined style={{ fontSize: 32 }} />
              <p>加载中...</p>
            </div>
          )}

          <img
            src={IMAGE_URL}
            alt="每日推荐"
            className={styles.image}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: loading ? 0 : 1, position: loading ? 'absolute' : 'relative' }}
          />
        </div>
      </div>
    </div>
  );
}
