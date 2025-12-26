import { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { Link, useLocation } from 'react-router-dom';
import ThemeSwitch from '../ThemeSwitch';
import SearchModal from '../SearchModal';
import { NAV_ITEMS, AI_TOOLS } from '@/constants/navigation';
import styles from './Header.module.css';

// 节流函数（带 trailing 调用，确保最后一次事件不会丢失）
function throttle<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let lastCall = 0;
  let trailingTimeout: ReturnType<typeof setTimeout> | null = null;

  return ((...args: unknown[]) => {
    const now = Date.now();

    // 清除之前的 trailing 调用
    if (trailingTimeout) {
      clearTimeout(trailingTimeout);
      trailingTimeout = null;
    }

    if (now - lastCall >= delay) {
      // 间隔已过，立即执行
      lastCall = now;
      fn(...args);
    } else {
      // 间隔内，安排 trailing 调用确保最后一次事件被处理
      trailingTimeout = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
        trailingTimeout = null;
      }, delay - (now - lastCall));
    }
  }) as T;
}

const { Header: AntHeader } = Layout;

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

// 菜单项类型定义
interface MenuItem {
  key: string;
  label: React.ReactNode;
  isAd?: boolean;
  children?: { key: string; label: React.ReactNode }[];
}

// 构建菜单项（使用配置）
const menuItems: MenuItem[] = [
  ...NAV_ITEMS.map(item => {
    // 处理有子菜单的导航项
    if ('children' in item && item.children) {
      return {
        key: item.key,
        label: item.label,
        children: item.children.map(child => ({
          key: child.key,
          label: child.label,
        })),
      };
    }
    return { key: item.key, label: item.label };
  }),
  {
    key: 'ai',
    label: 'AI入口',
    children: AI_TOOLS.map(item => ({
      key: item.key,
      label: (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.label}
        </a>
      ),
    })),
  },
];

export default function Header({ isDark, onThemeToggle }: HeaderProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 判断是否在首页
  const isHomePage = pathname === '/';

  // 监听滚动（使用节流优化性能）
  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 50);
    }, 100); // 100ms 节流间隔

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化检查
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 缓存选中的菜单项
  const selectedKey = useMemo(() =>
    menuItems.find(item =>
      item.key === pathname || (item.key !== '/' && pathname.startsWith(item.key))
    )?.key || '/',
    [pathname]
  );

  // 关闭移动端菜单
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // 缓存桌面端菜单项
  const desktopMenuItems = useMemo(() =>
    menuItems.map(item => ({
      key: item.key,
      label: item.isAd ? item.label : (item.children ? (
        <span className={styles.submenuLabel}>
          {item.label}
          <DownOutlined className={styles.submenuArrow} />
        </span>
      ) : <Link to={item.key}>{item.label}</Link>),
      children: item.children?.map(child => ({
        key: child.key,
        label: typeof child.label === 'string' ? <Link to={child.key}>{child.label}</Link> : child.label,
      })),
      className: item.isAd ? styles.adMenuItem : (item.children ? styles.hasSubmenu : undefined),
    })),
    []
  );

  // 缓存移动端菜单项
  const mobileMenuItems = useMemo(() =>
    menuItems.filter(item => !item.isAd).map(item => ({
      key: item.key,
      label: item.children ? item.label : (
        <Link to={item.key} onClick={closeMobileMenu}>
          {item.label}
        </Link>
      ),
      children: item.children?.map(child => ({
        key: child.key,
        label: typeof child.label === 'string' ? (
          <Link to={child.key} onClick={closeMobileMenu}>
            {child.label}
          </Link>
        ) : child.label,
      })),
    })),
    [closeMobileMenu]
  );

  return (
    <>
      <AntHeader className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${!isHomePage ? styles.notHome : ''}`} data-res-type="0-1">
        <div className={styles.container}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            {/* <img src="https://img.3d66.com/new-admin/sys/yt/img6/logo.webp" alt="Logo" width={36} height={36} className={styles.logoImage} /> */}
            <span className={styles.logoText}>博客园</span>
          </Link>

          {/* 桌面端导航 */}
          <div className={styles.desktopNav}>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={desktopMenuItems}
              style={{ border: 'none', background:   'transparent' }}
            />
          </div>

          {/* 右侧操作区 */}
          <div className={styles.actions}>
            {/* 首页默认隐藏，滚动后显示；其他页面始终显示 */}
            <div className={`${styles.scrollShowItems} ${isHomePage && !isScrolled ? styles.hidden : ''}`}>
              <ThemeSwitch isDark={isDark} onToggle={onThemeToggle} />

              {/* 谷歌图片广告 - 暂时隐藏 */}
              {/* <a href={AD_CONFIG.url} target="_blank" rel="noopener noreferrer" className={styles.headerAd}>
                <img src={AD_CONFIG.image} alt="广告" width={AD_CONFIG.width} height={AD_CONFIG.height} />
              </a> */}
            </div>

            {/* 移动端菜单按钮 */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className={styles.mobileMenuBtn}
            />
          </div>
        </div>
      </AntHeader>

      {/* 搜索弹窗 */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={mobileMenuItems}
          style={{ border: 'none' }}
        />
      </Drawer>
    </>
  );
}
