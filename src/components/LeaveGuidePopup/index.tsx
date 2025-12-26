import { useState, useEffect, useMemo } from 'react';
import { CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import styles from './LeaveGuidePopup.module.css';

// 请假数据
const LEAVE_DATA = [
  { submitDate: '2025-12-30', useDate: '2026-01-04', type: '年假', days: 1.5, note: '法定补班日' },
  { submitDate: '2026-02-13', useDate: '2026-02-14', type: '台风假', days: 1, note: '法定补班日' },
  { submitDate: '2026-02-27', useDate: '2026-02-28', type: '加班假', days: 4, note: '法定补班日' },
];

// 格式化日期显示
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear().toString().slice(2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}号`;
};

export default function LeaveGuidePopup() {
  const [visible, setVisible] = useState(false);

  // 计算剩余假期天数
  const remainingDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return LEAVE_DATA.reduce((total, item) => {
      const useDate = new Date(item.useDate);
      useDate.setHours(0, 0, 0, 0);
      // 只统计未使用的假期（使用日期 >= 今天）
      if (useDate >= today) {
        return total + item.days;
      }
      return total;
    }, 0);
  }, []);

  useEffect(() => {
    // 监听打开请求事件
    const handleOpenRequest = () => {
      setVisible(true);
      window.dispatchEvent(new CustomEvent('leavePopup:open'));
    };

    window.addEventListener('leavePopup:requestOpen', handleOpenRequest);
    return () => {
      window.removeEventListener('leavePopup:requestOpen', handleOpenRequest);
    };
  }, []);

  // 关闭弹窗
  const handleClose = () => {
    setVisible(false);
    window.dispatchEvent(new CustomEvent('leavePopup:close'));
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} data-res-type="1-10">
      <div className={styles.modal}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <span className={styles.title}>
            <CalendarOutlined style={{ marginRight: 8 }} />
            请假攻略
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
          {/* 剩余假期 */}
          <div className={styles.remainingSection}>
            <div className={styles.remainingLabel}>2025年剩余假期</div>
            <div className={styles.remainingDays}>
              <span className={styles.daysNumber}>{remainingDays}</span>
              <span className={styles.daysUnit}>天</span>
            </div>
            <div className={styles.remainingDetail}>
              年假 1.5天 / 台风假 1天 / 加班假 4天
            </div>
          </div>

          {/* 请假明细 */}
          <div className={styles.detailSection}>
            <div className={styles.detailTitle}>请假攻略明细</div>
            <div className={styles.detailList}>
              {LEAVE_DATA.map((item, index) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const useDate = new Date(item.useDate);
                useDate.setHours(0, 0, 0, 0);
                const isUsed = useDate < today;

                return (
                  <div
                    key={index}
                    className={`${styles.detailItem} ${isUsed ? styles.used : ''}`}
                  >
                    <div className={styles.itemIndex}>{index + 1}</div>
                    <div className={styles.itemContent}>
                      <div className={styles.submitInfo}>
                        <CalendarOutlined className={styles.itemIcon} />
                        <span>{formatDate(item.submitDate)} 提出请假</span>
                        {isUsed && <span className={styles.usedTag}>已使用</span>}
                      </div>
                      <div className={styles.useInfo}>
                        {formatDate(item.useDate)}（{item.note}）使用{item.type} 1天
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
