import { useState, useEffect } from 'react';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import styles from './FloatAd.module.css';

// 获取当天日期字符串，格式：YYYY-MM-DD
const getTodayKey = () => {
  const today = new Date();
  return `floatAd_closed_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export default function FloatAd() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 检查今天是否已关闭过广告
    try {
      const todayKey = getTodayKey();
      const isClosed = localStorage.getItem(todayKey);
      if (!isClosed) {
        setVisible(true);
      }
    } catch {
      // localStorage 不可用时默认显示
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    // 记录今天已关闭
    try {
      const todayKey = getTodayKey();
      localStorage.setItem(todayKey, 'true');
    } catch {
      // 忽略 localStorage 写入错误
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.container} data-res-type="0-6">
      <button
        className={styles.closeBtn}
        onClick={handleClose}
        aria-label="关闭广告"
      >
        <CloseOutlined />
      </button>
      <img
        src="/images/nologin_float.png"
        alt="广告"
        width={140}
        height={109}
        className={styles.adImage}
      />
    </div>
  );
}
