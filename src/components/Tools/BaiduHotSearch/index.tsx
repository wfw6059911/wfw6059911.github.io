import { useState, useEffect, useCallback } from 'react';
import styles from './BaiduHotSearch.module.css';

// 热搜项类型
interface HotSearchItem {
  index: number;
  title: string;
  desc?: string;
  pic?: string;
  hot: string;
  hotTag?: string; // 热、新、沸 等标签
  url: string;
}

// API 响应中的热搜内容项类型（2025年新结构）
interface BaiduHotContentItem {
  word?: string;
  query?: string;
  url?: string;
  hotTag?: string; // 热度等级：0-3
  newHotName?: string; // 标签名称：热、新 等
  isTop?: boolean; // 是否置顶
  index?: number;
}

// API 响应类型（2025年新结构：content 多了一层嵌套）
interface BaiduHotApiResponse {
  data?: {
    cards?: Array<{
      content?: Array<{
        content?: BaiduHotContentItem[];
      }>;
    }>;
  };
}

// 请求超时时间（毫秒）
const REQUEST_TIMEOUT = 10000;
// 缓存有效期（30 分钟）
const CACHE_DURATION = 30 * 60 * 1000;
const CACHE_KEY = 'baidu-hot-search-cache';

// 百度热搜 API 地址
const BAIDU_API_URL = 'https://top.baidu.com/api/board?platform=wise&tab=realtime';
// 是否为生产环境
const isProduction = import.meta.env.PROD;
// CORS 代理服务（生产环境使用）
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// 缓存结构
interface CacheData {
  data: HotSearchItem[];
  timestamp: number;
}

// 获取缓存数据
const getCachedData = (): HotSearchItem[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp }: CacheData = JSON.parse(cached);
      // 检查缓存是否过期
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch {
    // 缓存读取失败，忽略
  }
  return null;
};

// 设置缓存数据
const setCachedData = (data: HotSearchItem[]) => {
  try {
    const cacheData: CacheData = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // 缓存写入失败，忽略
  }
};

// 格式化热度数字（纯函数，移到组件外部避免重复创建）
const formatHot = (hot: string) => {
  const num = parseInt(hot);
  if (isNaN(num)) return hot;
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

// 获取标签样式（纯函数，移到组件外部）
const getTagClass = (tag?: string) => {
  if (!tag) return '';
  if (tag === '热' || tag === '沸') return styles.tagHot;
  if (tag === '新') return styles.tagNew;
  return styles.tagDefault;
};

// 百度热搜工具组件
export default function BaiduHotSearch() {
  const [list, setList] = useState<HotSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取热搜数据（使用百度官方 API，通过 Vite 代理）
  const fetchHotSearch = useCallback(async (forceRefresh = false) => {
    // 优先使用缓存数据
    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        setList(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    // 创建 AbortController 用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      // 根据环境选择请求方式
      // 开发环境使用 Vite 代理，生产环境使用 CORS 代理
      const apiUrl = isProduction
        ? `${CORS_PROXY}${encodeURIComponent(BAIDU_API_URL)}`
        : '/api/baidu-hot/api/board?platform=wise&tab=realtime';

      const res = await fetch(apiUrl, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      let data: BaiduHotApiResponse;
      try {
        data = await res.json();
      } catch {
        throw new Error('数据解析失败');
      }

      // 2025年新结构：cards[0].content[0].content
      const content = data?.data?.cards?.[0]?.content?.[0]?.content;
      if (content && Array.isArray(content)) {
        // 转换为组件需要的格式
        const formattedList: HotSearchItem[] = content.map((item: BaiduHotContentItem, idx: number) => ({
          index: idx,
          title: item.word || item.query || '未知',
          desc: '',
          pic: '',
          hot: item.hotTag || '0',
          hotTag: item.newHotName || '',
          url: item.url || `https://www.baidu.com/s?wd=${encodeURIComponent(item.word || item.query || '')}`,
        }));
        setList(formattedList);
        // 缓存数据
        setCachedData(formattedList);
      } else {
        setError('获取数据失败');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('请求超时，请稍后重试');
        } else {
          setError(err.message || '网络请求失败，请稍后重试');
        }
      } else {
        setError('网络请求失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotSearch();
  }, [fetchHotSearch]);

  // 获取排名样式
  const getRankClass = (index: number) => {
    if (index === 0) return styles.rankTop;
    if (index <= 2) return styles.rankHigh;
    return styles.rankNormal;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerTitle}>热搜榜</span>
          <span className={styles.headerSub}>/ 全部类型</span>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={() => fetchHotSearch(true)}
          disabled={loading}
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button className={styles.retryBtn} onClick={() => fetchHotSearch(true)}>
            重试
          </button>
        </div>
      )}

      {loading && !list.length && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>加载中...</span>
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <div className={styles.empty}>暂无数据</div>
      )}

      <div className={styles.list}>
        {list.map((item, idx) => (
          <a
            key={item.url || `hot-${idx}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
          >
            <div className={styles.itemLeft}>
              <span className={`${styles.rank} ${getRankClass(idx)}`}>
                {idx === 0 ? '置顶' : idx}
              </span>
              {item.pic && (
                <img
                  src={item.pic}
                  alt=""
                  className={styles.itemPic}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>
                  {item.title}
                  {item.hotTag && (
                    <span className={`${styles.tag} ${getTagClass(item.hotTag)}`}>
                      {item.hotTag}
                    </span>
                  )}
                </div>
                {item.desc && (
                  <div className={styles.itemDesc}>{item.desc}</div>
                )}
              </div>
            </div>
            <div className={styles.itemRight}>
              <span className={styles.hotNum}>{formatHot(item.hot)}</span>
              <span className={styles.hotLabel}>热搜指数</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
