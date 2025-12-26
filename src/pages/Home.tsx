import { useState, useEffect, lazy, Suspense } from 'react';
import { Row, Col } from 'antd';
import AIHeroBanner from '@/components/AIHeroBanner';
import ArticleList from '@/components/ArticleList';
import ToolList from '@/components/ToolList';
import ResourceList from '@/components/ResourceList';
import WorkCountdown from '@/components/WorkCountdown';
import WoodenFish from '@/components/WoodenFish';
import QuickLinks from '@/components/QuickLinks';
import ParallaxBanner from '@/components/ParallaxBanner';
import { getArticleList } from '@/utils/articles';
import { Article, Tool, Resource } from '@/types';

// 弹窗组件懒加载 - 首屏不需要立即显示
const BaiduHotSearchPopup = lazy(() => import('@/components/BaiduHotSearchPopup'));
const TimedReminder = lazy(() => import('@/components/TimedReminder'));
const DailyImagePopup = lazy(() => import('@/components/DailyImagePopup'));
const LeaveGuidePopup = lazy(() => import('@/components/LeaveGuidePopup'));
const WorkYearsPopup = lazy(() => import('@/components/WorkYearsPopup'));

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // 加载数据 - 动态导入 Mock 数据，减少首屏 JS 体积
  useEffect(() => {
    getArticleList().then(setArticles);
    import('@/mock/tools').then((m) => setTools(m.tools.slice(0, 12)));
    import('@/mock/resources').then((m) => setResources(m.resources.slice(0, 5)));
  }, []);

  // 首页显示 6 篇文章
  const latestArticles = articles.slice(0, 6);

  return (
    <div>
      {/* 敲木鱼（隐藏入口，由 1-3 木鱼图片触发） */}
      <WoodenFish hideEntry />

      {/* 视差 Banner */}
      <ParallaxBanner />

      {/* 顶部区域：网站统计 + 下班倒计时卡片 */}
      <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
        <Col xs={24} xl={18}>
          <AIHeroBanner />
        </Col>
        <Col xs={24} xl={6}>
          <WorkCountdown />
        </Col>
      </Row>

      {/* 3D溜溜网快链 - 2行12列 */}
      <QuickLinks />

      {/* 工具集 - 12个（2行） */}
      <ToolList tools={tools} showMore columns={6} />

      {/* 最新文章 - 6个一行 */}
      <ArticleList articles={latestArticles} showMore columns={6} />

      {/* 资源视界 - 1大+4小布局 */}
      <ResourceList resources={resources} showMore />

      {/* 弹窗组件区域 - 懒加载，不阻塞首屏渲染 */}
      <Suspense fallback={null}>
        <BaiduHotSearchPopup />
        <TimedReminder />
        <DailyImagePopup />
        <LeaveGuidePopup />
        <WorkYearsPopup />
      </Suspense>
    </div>
  );
}
