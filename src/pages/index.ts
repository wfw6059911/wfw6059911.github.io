import { lazy } from 'react';

// 路由懒加载 - 按需加载页面组件
export const Home = lazy(() => import('./Home'));
export const Articles = lazy(() => import('./Articles'));
export const ArticleDetail = lazy(() => import('./ArticleDetail'));
export const Tools = lazy(() => import('./Tools'));
export const Resources = lazy(() => import('./Resources'));
export const About = lazy(() => import('./About'));
export const Changelog = lazy(() => import('./Changelog'));
export const NotFound = lazy(() => import('./NotFound'));
