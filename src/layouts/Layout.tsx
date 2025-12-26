import { useEffect, useState, lazy, Suspense } from 'react';
import { Outlet, useLocation, useNavigationType, useMatch } from 'react-router-dom';
import { Layout as AntLayout, ConfigProvider, theme } from 'antd';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatButtons from '@/components/FloatButtons';
import TopLoadingBar from '@/components/TopLoadingBar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { lightTheme, darkTheme } from '@/theme/themeConfig';
import { useTheme } from '@/hooks/useTheme';

// 桌宠延迟加载 - 非首屏必要元素
const DesktopPet = lazy(() => import('@/components/DesktopPet'));

const { Content } = AntLayout;

export default function Layout() {
  const { isDark, toggleTheme, mounted } = useTheme();
  const location = useLocation();
  const navigationType = useNavigationType();
  const isArticleDetail = useMatch('/articles/:id'); // 检测是否是文章详情页
  const isHomePage = location.pathname === '/'; // 判断是否首页

  // 延迟渲染桌宠，给首屏更多渲染时间
  const [showPet, setShowPet] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowPet(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 设置 html data-theme 属性
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  // 路由变化时的滚动处理
  useEffect(() => {
    // POP = 浏览器后退/前进，让浏览器自动恢复滚动位置
    // 文章详情弹窗模式下不做任何滚动操作（保持列表页位置）
    if (navigationType === 'POP' || isArticleDetail) {
      return;
    }
    // 仅 PUSH/REPLACE 导航时滚动到顶部
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, navigationType, isArticleDetail]);

  // 防止闪烁
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        <Outlet />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        ...(isDark ? darkTheme : lightTheme),
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntLayout style={{ minHeight: '100vh' }}>
        <TopLoadingBar />
        <Header isDark={isDark} onThemeToggle={toggleTheme} />
        <Content
          style={{
            padding: '0px 24px 200px',
            paddingTop: isHomePage ? 0 : 120,
            maxWidth: 1800,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Content>
        <Footer />
        <FloatButtons />
        {showPet && (
          <Suspense fallback={null}>
            <DesktopPet />
          </Suspense>
        )}
      </AntLayout>
    </ConfigProvider>
  );
}
