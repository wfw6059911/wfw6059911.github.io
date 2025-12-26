import { useState, useEffect, useMemo } from 'react';
import { CloseOutlined, TrophyOutlined } from '@ant-design/icons';
import styles from './WorkYearsPopup.module.css';

// 入职日期
const ENTRY_DATE = new Date('2018-09-05');

// 格式化入职日期
const formatEntryDate = (): string => {
  const year = ENTRY_DATE.getFullYear();
  const month = ENTRY_DATE.getMonth() + 1;
  const day = ENTRY_DATE.getDate();
  return `${year}年${month}月${day}日`;
};

export default function WorkYearsPopup() {
  const [visible, setVisible] = useState(false);

  // 计算工作年限（精确到一位小数）
  const workYears = useMemo(() => {
    const now = new Date();
    const diffMs = now.getTime() - ENTRY_DATE.getTime();
    const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    return years.toFixed(1);
  }, []);

  // 计算已工作天数
  const workDays = useMemo(() => {
    const now = new Date();
    const diffMs = now.getTime() - ENTRY_DATE.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }, []);

  // 计算下一个半年断点信息
  const nextMilestone = useMemo(() => {
    const now = new Date();
    const diffMs = now.getTime() - ENTRY_DATE.getTime();
    const currentYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

    // 下一个半年断点
    const nextYears = Math.ceil(currentYears * 2) / 2;

    // 计算达到该断点的日期
    const targetMs = ENTRY_DATE.getTime() + nextYears * 365.25 * 24 * 60 * 60 * 1000;
    const targetDate = new Date(targetMs);

    // 计算距离下一个里程碑的天数
    const daysRemaining = Math.ceil((targetMs - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years: nextYears,
      date: `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日`,
      daysRemaining
    };
  }, []);

  useEffect(() => {
    // 监听打开请求事件
    const handleOpenRequest = () => {
      setVisible(true);
      window.dispatchEvent(new CustomEvent('workYearsPopup:open'));
    };

    window.addEventListener('workYearsPopup:requestOpen', handleOpenRequest);
    return () => {
      window.removeEventListener('workYearsPopup:requestOpen', handleOpenRequest);
    };
  }, []);

  // 关闭弹窗
  const handleClose = () => {
    setVisible(false);
    window.dispatchEvent(new CustomEvent('workYearsPopup:close'));
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} data-res-type="1-11">
      <div className={styles.modal}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <span className={styles.title}>
            <TrophyOutlined style={{ marginRight: 8 }} />
            工作年限
          </span>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="关闭弹窗"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* 内容区域 */}
        <div className={styles.content}>
          {/* 工作年限 */}
          <div className={styles.yearsSection}>
            <div className={styles.yearsNumber}>
              <span className={styles.number}>{workYears}</span>
              <span className={styles.unit}>年</span>
            </div>
            <div className={styles.yearsLabel}>当前工龄</div>
          </div>

          {/* 详细信息 */}
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>入职日期</span>
              <span className={styles.infoValue}>{formatEntryDate()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>已工作</span>
              <span className={styles.infoValue}>{workDays.toLocaleString()} 天</span>
            </div>
            <div className={styles.milestoneGroup}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>下一个里程碑</span>
                <span className={styles.infoValue}>{nextMilestone.years} 年（{nextMilestone.date}）</span>
              </div>
              <div className={styles.milestoneCountdown}>
                距离里程碑还有 <span className={styles.countdownDays}>{nextMilestone.daysRemaining}</span> 天
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
