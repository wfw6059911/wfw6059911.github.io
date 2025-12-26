import { useState, useEffect } from 'react';
import { Card } from 'antd';
import solarLunar from 'solarlunar';
import { WOODEN_FISH_OPEN_EVENT } from '@/components/WoodenFish';
import styles from './WorkCountdown.module.css';

// 默认上下班时间配置
const WORK_START_HOUR = 9;
const WORK_START_MINUTE = 30;
const WORK_END_HOUR = 18;
const WORK_END_MINUTE = 30;

// 薪资配置
const DAILY_SALARY = 800; // 日薪
const PAY_DAY = 15; // 发薪日

// 获取农历日期
const getLunarDate = () => {
  const now = new Date();
  const lunar = solarLunar.solar2lunar(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  return `${lunar.gzYear}年 ${lunar.monthCn}${lunar.dayCn} ${lunar.ncWeek}`;
};

// 下班倒计时组件
export default function WorkCountdown() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [lunarDate, setLunarDate] = useState('');
  const [countdown, setCountdown] = useState<string>('');
  const [status, setStatus] = useState<'before' | 'working' | 'after'>('working');
  const [earnedToday, setEarnedToday] = useState<string>('0.00');
  const [daysToPayday, setDaysToPayday] = useState<number>(0);

  useEffect(() => {
    // 计算离发薪日还有多少天
    const calculateDaysToPayday = () => {
      const now = new Date();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let targetDate: Date;
      if (currentDay < PAY_DAY) {
        targetDate = new Date(currentYear, currentMonth, PAY_DAY);
      } else {
        targetDate = new Date(currentYear, currentMonth + 1, PAY_DAY);
      }

      const diffTime = targetDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysToPayday(diffDays);
    };

    calculateDaysToPayday();
    setLunarDate(getLunarDate());
  }, []);

  useEffect(() => {
    // 每天工作时长（毫秒）
    const workDuration =
      (WORK_END_HOUR * 60 + WORK_END_MINUTE - (WORK_START_HOUR * 60 + WORK_START_MINUTE)) * 60 * 1000;
    // 每毫秒赚多少钱
    const salaryPerMs = DAILY_SALARY / workDuration;

    const updateTime = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // 更新当前时间
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setCurrentDate(`${year}年${month}月${day}日`);
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      // 今天的上班和下班时间
      const workStart = new Date(today);
      workStart.setHours(WORK_START_HOUR, WORK_START_MINUTE, 0, 0);

      const workEnd = new Date(today);
      workEnd.setHours(WORK_END_HOUR, WORK_END_MINUTE, 0, 0);

      if (now < workStart) {
        setStatus('before');
        const diff = workStart.getTime() - now.getTime();
        setCountdown(formatTime(diff));
        setEarnedToday('0.000');
      } else if (now >= workStart && now < workEnd) {
        setStatus('working');
        const diff = workEnd.getTime() - now.getTime();
        setCountdown(formatTime(diff));
        const workedMs = now.getTime() - workStart.getTime();
        const earned = workedMs * salaryPerMs;
        setEarnedToday(earned.toFixed(3));
      } else {
        setStatus('after');
        setCountdown('00:00:00');
        setEarnedToday(DAILY_SALARY.toFixed(3));
      }
    };

    const formatTime = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    updateTime();
    // 1秒更新一次即可，无需 50ms 高频刷新
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 根据状态显示不同文案
  const getStatusText = () => {
    switch (status) {
      case 'before':
        return '距离上班还剩';
      case 'working':
        return '距离下班还剩';
      case 'after':
        return '已下班啦';
    }
  };

  // 点击木鱼图片，触发敲木鱼弹窗
  const handleWoodenFishClick = () => {
    window.dispatchEvent(new CustomEvent(WOODEN_FISH_OPEN_EVENT));
  };

  return (
    <Card className={styles.card} data-res-type="1-3">
      {/* 顶部标签 */}
      <div className={styles.tagWrapper}>
        <span className={styles.tag}>当前时间</span>
      </div>

      {/* 日期时间显示 */}
      <div className={styles.dateTimeSection}>
        <div className={styles.mainTime}>
          <span className={styles.date}>{currentDate}</span>
          <span className={styles.time}>{currentTime}</span>
        </div>
        <div className={styles.lunarDate}>农历：{lunarDate}</div>
      </div>

      {/* 倒计时区域 */}
      <div className={styles.countdownSection}>
        <div className={styles.woodenFishWrapper} onClick={handleWoodenFishClick}>
          <img
            src="https://imgo.3d66.com/www/new-admin/sys/yt/img/693b870bdb36e.png!type-change-p"
            alt="木鱼"
            className={styles.woodenFish}
          />
        </div>
        <div className={styles.countdownContent}>
          <span className={styles.countdownLabel}>{getStatusText()}</span>
          <span className={styles.countdownTime}>{countdown}</span>
        </div>
        <div className={styles.catWrapper}>
          <img
            src="https://img.3d66.com/new-admin/sys/yt/img5/kapibala2.png"
            alt="搬砖猫"
            className={styles.cat}
          />
        </div>
      </div>

      {/* 底部信息卡片 */}
      <div className={styles.infoCards}>
        <div className={`${styles.infoCard} ${styles.earningCard}`}>
          <span className={styles.infoLabel}>今日已赚</span>
          <span className={styles.infoValue}>¥{earnedToday}</span>
          <span className={styles.infoDesc}>实时计算中</span>
        </div>
        <div className={`${styles.infoCard} ${styles.paydayCard}`}>
          <span className={styles.infoLabel}>离发薪日</span>
          <span className={styles.infoValue}>{daysToPayday}天</span>
          <span className={styles.infoDesc}>倒计时已启动</span>
        </div>
      </div>
    </Card>
  );
}
