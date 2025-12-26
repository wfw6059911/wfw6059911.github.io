// 文章详情页侧边栏 Mock 数据

// 相关推荐文章
export interface RecommendArticle {
  id: string;
  title: string;
  views: number;
  likes: number;
}

// 精选内容
export interface FeaturedContent {
  id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
}

// 相关推荐数据
export const recommendArticles: RecommendArticle[] = [
  { id: '101', title: '深度解析AI编程技术：从原理到实践，...', views: 79, likes: 3 },
  { id: '102', title: '学习 LiteLLM 的防护栏机制', views: 41, likes: 0 },
  { id: '103', title: '如何用Trae SOLO 手搓一个微信?', views: 60, likes: 0 },
  { id: '104', title: '【数据操作与可视化】Pandas数据处理...', views: 33, likes: 0 },
  { id: '105', title: '提升你的Prompt让TRAE SOLO写更神...', views: 38, likes: 1 },
];

// 精选内容数据
export const featuredContents: FeaturedContent[] = [
  { id: '201', title: 'uni-app 也能远程调试？使用 PageSpy ...', author: '不如摸鱼去', views: 145, likes: 2 },
  { id: '202', title: '【Virtual World 03】上帝之手', author: '大怪v', views: 80, likes: 1 },
  { id: '203', title: 'JavaScript流式输出技术详解与实践', author: 'UIUV', views: 276, likes: 28 },
  { id: '204', title: 'H5 图片路径不统一，导致线上部分图片...', author: 'Naomi_', views: 32, likes: 0 },
  { id: '205', title: '玩转小程序AR-实战篇', author: '深红', views: 67, likes: 1 },
];

// 获取相关推荐
export const getRecommendArticles = (): RecommendArticle[] => {
  return recommendArticles;
};

// 获取精选内容
export const getFeaturedContents = (): FeaturedContent[] => {
  return featuredContents;
};
