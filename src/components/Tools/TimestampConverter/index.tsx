import { useState, useEffect } from 'react';
import styles from './TimestampConverter.module.css';

// 时间戳转换工具组件
export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>('');
  const [datetime, setDatetime] = useState<string>('');
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  // 实时更新当前时间戳
  useEffect(() => {
    const updateCurrentTimestamp = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    };
    updateCurrentTimestamp();
    const timer = setInterval(updateCurrentTimestamp, 1000);
    return () => clearInterval(timer);
  }, []);

  // 时间戳转日期时间
  const timestampToDatetime = () => {
    if (!timestamp) return;
    try {
      const ts = parseInt(timestamp);
      // 判断是秒还是毫秒
      const date = ts > 9999999999 ? new Date(ts) : new Date(ts * 1000);
      const formatted = formatDate(date);
      setDatetime(formatted);
    } catch {
      setDatetime('无效的时间戳');
    }
  };

  // 日期时间转时间戳
  const datetimeToTimestamp = () => {
    if (!datetime) return;
    try {
      const date = new Date(datetime);
      if (isNaN(date.getTime())) {
        setTimestamp('无效的日期时间');
        return;
      }
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    } catch {
      setTimestamp('无效的日期时间');
    }
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 获取当前时间
  const setCurrentTime = () => {
    const now = new Date();
    setTimestamp(Math.floor(now.getTime() / 1000).toString());
    setDatetime(formatDate(now));
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.container}>
      <div className={styles.currentTime}>
        <span className={styles.label}>当前时间戳：</span>
        <span className={styles.value}>{currentTimestamp}</span>
        <button
          className={styles.copyBtn}
          onClick={() => copyToClipboard(currentTimestamp.toString())}
        >
          复制
        </button>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>时间戳 → 日期时间</h4>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="输入时间戳（秒/毫秒）"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
          <button className={styles.btn} onClick={timestampToDatetime}>
            转换
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>日期时间 → 时间戳</h4>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="输入日期时间，如 2024-12-10 12:00:00"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
          <button className={styles.btn} onClick={datetimeToTimestamp}>
            转换
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={setCurrentTime}>
          获取当前时间
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => { setTimestamp(''); setDatetime(''); }}
        >
          清空
        </button>
      </div>

      <div className={styles.tips}>
        <h4>使用说明</h4>
        <ul>
          <li>支持 10 位（秒）和 13 位（毫秒）时间戳</li>
          <li>日期时间格式：YYYY-MM-DD HH:mm:ss</li>
          <li>点击"复制"可将内容复制到剪贴板</li>
        </ul>
      </div>
    </div>
  );
}
