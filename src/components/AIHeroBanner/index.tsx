import { useState, useRef, useEffect } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './AIHeroBanner.module.css';

// 搜索引擎配置
const SEARCH_ENGINES = [
  { key: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', home: 'https://www.baidu.com' },
  { key: 'bing', name: '必应', url: 'https://www.bing.com/search?q=', home: 'https://www.bing.com' },
  { key: 'sogou', name: '搜狗', url: 'https://www.sogou.com/web?query=', home: 'https://www.sogou.com' },
  { key: '360', name: '360', url: 'https://www.so.com/s?q=', home: 'https://www.so.com' },
  { key: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/search?type=content&q=', home: 'https://www.zhihu.com' },
  { key: 'bilibili', name: '哔哩哔哩', url: 'https://search.bilibili.com/all?from_source=nav_search_new&keyword=', home: 'https://www.bilibili.com' },
];

// 热词词库
const HOT_WORDS = [
  // 3D设计
  '3D模型', 'Blender教程', 'C4D素材', 'Maya建模', '3Dmax插件',
  '渲染器', '材质贴图', 'HDR环境', 'PBR材质', '场景搭建',
  // AI创作
  'AI绘画', 'Midjourney', 'Stable Diffusion', 'ComfyUI', 'LoRA训练',
  'AI提示词', 'AIGC', 'AI视频', 'AI配音', 'AI写作',
  // 设计工具
  'Figma插件', 'PS滤镜', 'AE模板', 'PR转场', '达芬奇调色',
  '字体下载', 'UI素材', '图标库', '配色方案', '设计规范',
  // 技术开发
  'React教程', 'Vue3入门', 'TypeScript', 'Node.js', 'Python',
  'CSS动画', '前端框架', '后端开发', '数据库', 'API接口',
  // 资源素材
  '免费素材', '高清壁纸', '音效素材', '视频素材', '矢量图标',
  'PPT模板', '简历模板', '海报设计', 'Logo设计', '插画素材',
  // 学习教程
  '入门指南', '进阶技巧', '实战项目', '面试题库', '学习路线',
];

// 从词库中随机选取指定数量的热词
const getRandomHotWords = (count: number = 5): string[] => {
  const shuffled = [...HOT_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function AIHeroBanner() {
  const [searchValue, setSearchValue] = useState('');
  const [currentEngine, setCurrentEngine] = useState('baidu');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  // 随机热词
  const [randomTags, setRandomTags] = useState(() => getRandomHotWords(5));

  // 刷新热词
  const handleRefreshTags = () => {
    setRandomTags(getRandomHotWords(5));
  };

  // 获取当前引擎信息
  const currentEngineInfo = SEARCH_ENGINES.find(e => e.key === currentEngine) || SEARCH_ENGINES[0];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // 执行搜索
  const handleSearch = () => {
    // 搜索框为空时打开搜索引擎首页
    if (!searchValue.trim()) {
      window.open(currentEngineInfo.home, '_blank');
      return;
    }
    window.open(currentEngineInfo.url + encodeURIComponent(searchValue), '_blank');
  };

  // 回车键搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 选择搜索引擎
  const handleSelectEngine = (key: string) => {
    setCurrentEngine(key);
    setDropdownOpen(false);
  };

  // 点击标签填充搜索框
  const handleTagClick = (tag: string) => {
    setSearchValue(tag);
  };

  return (
    <div data-res-type="1-2" className={styles.container}>
      {/* 左侧装饰图 */}
      <img
        src="/images/indexwork/stai-banner-man.4bb70fa.png"
        alt="AI创作"
        className={styles.leftImage}
      />

      {/* 中间内容区 */}
      <div className={styles.content}>
        {/* 标题区域 */}
        <h1 className={styles.title}>
          搜索AI：一站式AI创作平台
          <span className={styles.sparkle}>✦</span>
        </h1>
        <p className={styles.subtitle}>快来开始今天的创作吧!</p>

        {/* 搜索框区域 */}
        <div className={styles.searchBox}>
          {/* 搜索引擎选择器 */}
          <div className={styles.engineSelector} ref={selectorRef}>
            <button
              className={styles.engineButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <span>{currentEngineInfo.name}</span>
              <span className={`${styles.arrow} ${dropdownOpen ? styles.arrowUp : ''}`}>▼</span>
            </button>
            {dropdownOpen && (
              <div className={styles.engineDropdown}>
                {SEARCH_ENGINES.map(engine => (
                  <div
                    key={engine.key}
                    className={`${styles.engineOption} ${currentEngine === engine.key ? styles.active : ''}`}
                    onClick={() => handleSelectEngine(engine.key)}
                  >
                    {currentEngine === engine.key && <span className={styles.checkmark}>✓</span>}
                    <span>{engine.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder={`${currentEngineInfo.name}引擎：输入搜索内容`}
            className={styles.input}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.button} onClick={handleSearch}>
            <SearchOutlined className={styles.searchIcon} />
            搜索
          </button>
        </div>

        {/* 热词推荐 */}
        <div className={styles.tags}>
          {randomTags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <button className={styles.refreshBtn} onClick={handleRefreshTags}>
          <ReloadOutlined className={styles.refreshIcon} />
          刷新热词
        </button>
      </div>

      {/* 右侧装饰图 */}
      <img
        src="/images/indexwork/stai-banner-after.0091d6a.png"
        alt="AI图标"
        className={styles.rightImage}
      />
    </div>
  );
}
