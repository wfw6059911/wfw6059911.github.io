import { useState, useEffect, useRef, useCallback } from 'react';
import { CloseOutlined, BellOutlined } from '@ant-design/icons';
import styles from './TimedReminder.module.css';

// 提醒间隔：60分钟（毫秒）
const REMINDER_INTERVAL = 60 * 60 * 1000;

// localStorage 键名
const STORAGE_KEY = 'timed-reminder-count';

// 获取已触发次数
const getReminderCount = (): number => {
  try {
    const count = localStorage.getItem(STORAGE_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
};

// 保存已触发次数
const setReminderCount = (count: number): void => {
  try {
    localStorage.setItem(STORAGE_KEY, String(count));
  } catch {
    // localStorage 不可用时忽略
  }
};

// 单例控制器：用于管理提醒实例的关闭
let closeCurrentReminder: (() => void) | null = null;

export default function TimedReminder() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const timerRef = useRef<number | null>(null);
  const instanceIdRef = useRef<number>(0);

  // 关闭提醒
  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  // 触发提醒（单例模式）
  const triggerReminder = useCallback(() => {
    // 如果存在旧实例，先强制关闭
    if (closeCurrentReminder) {
      closeCurrentReminder();
    }

    // 更新触发次数
    const newCount = getReminderCount() + 1;
    setReminderCount(newCount);
    setCount(newCount);

    // 生成新的实例 ID
    instanceIdRef.current = Date.now();

    // 注册当前实例的关闭函数
    closeCurrentReminder = handleClose;

    // 显示提醒
    setVisible(true);
  }, [handleClose]);

  useEffect(() => {
    // 组件挂载时，读取已有的触发次数
    setCount(getReminderCount());

    // 首次加载时立即触发一次提醒（可选，如不需要可删除这行）
    // triggerReminder();

    // 设置定时器，每60分钟触发一次
    timerRef.current = window.setInterval(() => {
      triggerReminder();
    }, REMINDER_INTERVAL);

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // 清理单例引用
      if (closeCurrentReminder === handleClose) {
        closeCurrentReminder = null;
      }
    };
  }, [triggerReminder, handleClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.overlay} data-res-type="1-7">
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <BellOutlined className={styles.icon} />
            <span className={styles.title}>定时提醒</span>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} title="关闭">
            <CloseOutlined />
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.countWrapper}>
            <span className={styles.countLabel}>已提醒次数</span>
            <span className={styles.countNumber}>{count}</span>
          </div>
          <p className={styles.message}>
            这是您的第 <strong>{count}</strong> 次定时提醒！
          </p>
          <p className={styles.hint}>
            系统每 60 分钟自动提醒一次
          </p>
        </div>
        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={handleClose}>
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}
