import { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Spin } from 'antd';
import Layout from '@/layouts/Layout';
import { Home, Articles, Tools, Resources, About, Changelog, NotFound } from '@/pages';

// 页面加载中的占位组件
const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <Spin size="large" />
  </div>
);

// 包装懒加载组件
const withSuspense = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<PageLoading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(Home) },
      // 文章列表和详情都由 Articles 组件处理，通过 useParams 获取 id
      { path: 'articles', element: withSuspense(Articles) },
      { path: 'articles/:id', element: withSuspense(Articles) },
      { path: 'tools', element: withSuspense(Tools) },
      { path: 'resources', element: withSuspense(Resources) },
      { path: 'about', element: withSuspense(About) },
      { path: 'changelog', element: withSuspense(Changelog) },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
]);
