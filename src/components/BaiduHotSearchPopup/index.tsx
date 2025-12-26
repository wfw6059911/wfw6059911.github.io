import { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import BaiduHotSearch from '@/components/Tools/BaiduHotSearch';
import styles from './BaiduHotSearchPopup.module.css';

// localStorage 键名
const STORAGE_KEY = 'baidu-hot-search-popup-closed';

// 获取今天的日期字符串
const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 检查今天是否已关闭
const isClosedToday = () => {
  try {
    const closedDate = localStorage.getItem(STORAGE_KEY);
    return closedDate === getTodayString();
  } catch {
    return false;
  }
};

// 设置今天已关闭
const setClosedToday = () => {
  try {
    localStorage.setItem(STORAGE_KEY, getTodayString());
  } catch {
    // localStorage 不可用时忽略
  }
};

export default function BaiduHotSearchPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 检查是否应该显示弹窗
    if (!isClosedToday()) {
      setVisible(true);
    }

    // 监听打开请求事件（来自 FloatButtons）
    const handleOpenRequest = () => {
      setVisible(true);
      window.dispatchEvent(new CustomEvent('baiduPopup:open'));
    };

    window.addEventListener('baiduPopup:requestOpen', handleOpenRequest);
    return () => {
      window.removeEventListener('baiduPopup:requestOpen', handleOpenRequest);
    };
  }, []);

  // 关闭弹窗
  const handleClose = () => {
    setClosedToday();
    setVisible(false);
    // 通知 FloatButtons 显示悬浮图标
    window.dispatchEvent(new CustomEvent('baiduPopup:close'));
  };

  if (!visible) return null;

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <span className={styles.title}>百度热搜</span>
        <button className={styles.closeBtn} onClick={handleClose} title="关闭">
          <CloseOutlined />
        </button>
      </div>
      <div className={styles.content}>
        <BaiduHotSearch />
      </div>
    </div>
  );
}
