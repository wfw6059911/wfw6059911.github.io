import { create } from 'zustand';
import { Article } from '@/types';

interface ArticleStore {
  // 数据
  articles: Article[];
  categories: { key: string; label: string }[];

  // 列表页状态
  activeCategory: string;
  currentPage: number;
  scrollPosition: number;

  // 加载状态
  isLoaded: boolean;

  // Actions
  setArticles: (articles: Article[]) => void;
  setCategories: (categories: { key: string; label: string }[]) => void;
  setActiveCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  setScrollPosition: (position: number) => void;
  setLoaded: (loaded: boolean) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  // 初始数据
  articles: [],
  categories: [],

  // 初始状态
  activeCategory: 'all',
  currentPage: 1,
  scrollPosition: 0,
  isLoaded: false,

  // Actions
  setArticles: (articles) => set({ articles }),
  setCategories: (categories) => set({ categories }),
  setActiveCategory: (category) => set({ activeCategory: category, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setScrollPosition: (position) => set({ scrollPosition: position }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}));
