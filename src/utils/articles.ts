// 文章加载工具 - 从 Markdown 文件加载文章数据

import { Article } from '@/types';

// 文章详情类型
export interface ArticleDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  publishDate: string;
  readTime: number;
  views: number;
  content: string;
}

// 简单的 Front Matter 解析器
function parseFrontMatter(markdown: string): { data: Record<string, unknown>; content: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: markdown };
  }

  const [, frontMatter, content] = match;
  const data: Record<string, unknown> = {};

  // 解析 YAML 格式的 front matter
  frontMatter.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value: string | string[] | number = line.slice(colonIndex + 1).trim();

    // 移除引号
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // 解析数组
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, ''));
    }

    // 解析数字
    if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
      value = Number(value);
    }

    data[key] = value;
  });

  return { data, content: content.trim() };
}

// 使用 Vite 的 import.meta.glob 导入所有文章
const articleModules = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
});

// 缓存已加载的文章
let articlesCache: ArticleDetail[] | null = null;

// 加载所有文章
export async function loadAllArticles(): Promise<ArticleDetail[]> {
  if (articlesCache) {
    return articlesCache;
  }

  const articles: ArticleDetail[] = [];

  for (const path in articleModules) {
    try {
      const raw = (await articleModules[path]()) as string;
      const { data, content } = parseFrontMatter(raw);

      articles.push({
        id: String(data.id || ''),
        title: String(data.title || ''),
        description: String(data.description || ''),
        category: String(data.category || ''),
        tags: Array.isArray(data.tags) ? data.tags : [],
        coverImage: String(data.coverImage || ''),
        author: String(data.author || ''),
        publishDate: String(data.publishDate || ''),
        readTime: Number(data.readTime) || 0,
        views: Number(data.views) || 0,
        content,
      });
    } catch (error) {
      // 仅在开发环境输出错误日志
      if (import.meta.env.DEV) {
        console.error(`加载文章失败: ${path}`, error);
      }
    }
  }

  // 按发布日期排序（最新的在前）
  articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  articlesCache = articles;
  return articles;
}

// 获取文章列表（用于列表页）
export async function getArticleList(): Promise<Article[]> {
  const articles = await loadAllArticles();
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description,
    category: article.category,
    tags: article.tags,
    coverImage: article.coverImage,
    author: article.author,
    publishDate: article.publishDate,
    readTime: article.readTime,
  }));
}

// 根据 ID 获取文章详情
export async function getArticleById(id: string): Promise<ArticleDetail | undefined> {
  const articles = await loadAllArticles();
  return articles.find((article) => article.id === id);
}

// 获取文章分类列表
export async function getArticleCategories(): Promise<{ key: string; label: string }[]> {
  const articles = await loadAllArticles();
  const categories = new Set<string>();

  articles.forEach((article) => {
    if (article.category) {
      categories.add(article.category);
    }
  });

  return [{ key: 'all', label: '全部' }, ...Array.from(categories).map((cat) => ({ key: cat, label: cat }))];
}

// 清除缓存（用于热更新）
export function clearArticlesCache(): void {
  articlesCache = null;
}
