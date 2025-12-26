import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import VerticalAlignTopOutlined from '@ant-design/icons/VerticalAlignTopOutlined';
import ReadOutlined from '@ant-design/icons/ReadOutlined';
import FireOutlined from '@ant-design/icons/FireOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import TrophyOutlined from '@ant-design/icons/TrophyOutlined';
import { useScroll, useScrollToTop } from '@/hooks/useScroll';
import styles from './FloatButtons.module.css';

export default function FloatButtons() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // 使用自定义 Hooks
  const showBackTop = useScroll(100);
  const scrollToTop = useScrollToTop();

  // 弹窗打开状态（用于禁用点击）
  const [dailyPopupOpen, setDailyPopupOpen] = useState(false);
  const [baiduPopupOpen, setBaiduPopupOpen] = useState(false);
  const [leavePopupOpen, setLeavePopupOpen] = useState(false);
  const [workYearsPopupOpen, setWorkYearsPopupOpen] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    // 监听弹窗打开/关闭事件
    const handleDailyClose = () => setDailyPopupOpen(false);
    const handleBaiduClose = () => setBaiduPopupOpen(false);
    const handleLeaveClose = () => setLeavePopupOpen(false);
    const handleWorkYearsClose = () => setWorkYearsPopupOpen(false);
    const handleDailyOpen = () => setDailyPopupOpen(true);
    const handleBaiduOpen = () => setBaiduPopupOpen(true);
    const handleLeaveOpen = () => setLeavePopupOpen(true);
    const handleWorkYearsOpen = () => setWorkYearsPopupOpen(true);

    window.addEventListener('dailyPopup:close', handleDailyClose);
    window.addEventListener('baiduPopup:close', handleBaiduClose);
    window.addEventListener('leavePopup:close', handleLeaveClose);
    window.addEventListener('workYearsPopup:close', handleWorkYearsClose);
    window.addEventListener('dailyPopup:open', handleDailyOpen);
    window.addEventListener('baiduPopup:open', handleBaiduOpen);
    window.addEventListener('leavePopup:open', handleLeaveOpen);
    window.addEventListener('workYearsPopup:open', handleWorkYearsOpen);

    return () => {
      window.removeEventListener('dailyPopup:close', handleDailyClose);
      window.removeEventListener('baiduPopup:close', handleBaiduClose);
      window.removeEventListener('leavePopup:close', handleLeaveClose);
      window.removeEventListener('workYearsPopup:close', handleWorkYearsClose);
      window.removeEventListener('dailyPopup:open', handleDailyOpen);
      window.removeEventListener('baiduPopup:open', handleBaiduOpen);
      window.removeEventListener('leavePopup:open', handleLeaveOpen);
      window.removeEventListener('workYearsPopup:open', handleWorkYearsOpen);
    };
  }, [isHomePage]);

  // 联系客服 - 新窗口打开
  const contactService = () => {
    window.open('https://www.3d66.com/', '_blank');
  };

  // 打开每日弹窗（弹窗已打开时无效）
  const openDailyPopup = () => {
    if (dailyPopupOpen) return;
    window.dispatchEvent(new CustomEvent('dailyPopup:requestOpen'));
  };

  // 打开百度热搜弹窗（弹窗已打开时无效）
  const openBaiduPopup = () => {
    if (baiduPopupOpen) return;
    window.dispatchEvent(new CustomEvent('baiduPopup:requestOpen'));
  };

  // 打开请假攻略弹窗（弹窗已打开时无效）
  const openLeavePopup = () => {
    if (leavePopupOpen) return;
    window.dispatchEvent(new CustomEvent('leavePopup:requestOpen'));
  };

  // 打开工作年限弹窗（弹窗已打开时无效）
  const openWorkYearsPopup = () => {
    if (workYearsPopupOpen) return;
    window.dispatchEvent(new CustomEvent('workYearsPopup:requestOpen'));
  };

  return (
    <div data-res-type="0-3">
      {/* 工作年限图标 - 仅首页常驻显示 */}
      {isHomePage && (
        <Tooltip title="工作年限" placement="left">
          <button
            className={`${styles.button} ${styles.workYearsButton} ${workYearsPopupOpen ? styles.disabled : ''}`}
            onClick={openWorkYearsPopup}
            aria-label="工作年限"
          >
            <TrophyOutlined className={styles.icon} />
          </button>
        </Tooltip>
      )}

      {/* 请假攻略图标 - 仅首页常驻显示 */}
      {isHomePage && (
        <Tooltip title="请假攻略" placement="left">
          <button
            className={`${styles.button} ${styles.leaveButton} ${leavePopupOpen ? styles.disabled : ''}`}
            onClick={openLeavePopup}
            aria-label="请假攻略"
          >
            <CalendarOutlined className={styles.icon} />
          </button>
        </Tooltip>
      )}

      {/* 每日弹窗图标 - 仅首页常驻显示 */}
      {isHomePage && (
        <Tooltip title="每日60秒读懂世界" placement="left">
          <button
            className={`${styles.button} ${styles.dailyButton} ${dailyPopupOpen ? styles.disabled : ''}`}
            onClick={openDailyPopup}
            aria-label="每日60秒读懂世界"
          >
            <ReadOutlined className={styles.icon} />
          </button>
        </Tooltip>
      )}

      {/* 百度热搜图标 - 仅首页常驻显示 */}
      {isHomePage && (
        <Tooltip title="百度热搜" placement="left">
          <button
            className={`${styles.button} ${styles.baiduButton} ${baiduPopupOpen ? styles.disabled : ''}`}
            onClick={openBaiduPopup}
            aria-label="百度热搜"
          >
            <FireOutlined className={styles.icon} />
          </button>
        </Tooltip>
      )}

      {/* 联系客服 - 固定位置 */}
      <Tooltip title="联系客服" placement="left">
        <button
          className={`${styles.button} ${styles.serviceButton}`}
          onClick={contactService}
          aria-label="联系客服"
        >
          <CustomerServiceOutlined className={styles.icon} />
        </button>
      </Tooltip>

      {/* 返回顶部 - 固定位置，通过 opacity 控制显示隐藏 */}
      <Tooltip title="返回顶部" placement="left">
        <button
          className={`${styles.button} ${styles.backTopButton} ${showBackTop ? styles.visible : ''}`}
          onClick={scrollToTop}
          aria-label="返回顶部"
        >
          <VerticalAlignTopOutlined className={styles.icon} />
        </button>
      </Tooltip>
    </div>
  );
}
