import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Tabs, Row, Col, Pagination, Empty, Spin } from 'antd';
import { getArticleList, getArticleCategories } from '@/utils/articles';
import { useArticleStore } from '@/stores/articleStore';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import styles from './Articles.module.css';

const { Title, Paragraph } = Typography;

export default function ArticlesPage() {
  const { id } = useParams<{ id: string }>();

  // 从 store 获取状态
  const {
    articles,
    categories,
    activeCategory,
    currentPage,
    scrollPosition,
    isLoaded,
    setArticles,
    setCategories,
    setActiveCategory,
    setCurrentPage,
    setScrollPosition,
    setLoaded,
  } = useArticleStore();

  const pageSize = 30;

  // 加载文章数据（只在首次加载时请求）
  useEffect(() => {
    if (isLoaded) return;

    const loadData = async () => {
      const [articleList, categoryList] = await Promise.all([
        getArticleList(),
        getArticleCategories(),
      ]);
      setArticles(articleList);
      setCategories(categoryList);
      setLoaded(true);
    };
    loadData();
  }, [isLoaded, setArticles, setCategories, setLoaded]);

  // 恢复滚动位置
  useEffect(() => {
    if (isLoaded && scrollPosition > 0 && !id) {
      window.scrollTo(0, scrollPosition);
    }
  }, [isLoaded, scrollPosition, id]);

  // 离开页面时保存滚动位置
  useEffect(() => {
    return () => {
      setScrollPosition(window.scrollY);
    };
  }, [setScrollPosition]);

  // 筛选文章（使用 useMemo 缓存计算结果）
  const filteredArticles = useMemo(
    () =>
      activeCategory === 'all'
        ? articles
        : articles.filter(a => a.category === activeCategory),
    [articles, activeCategory]
  );

  // 分页（使用 useMemo 缓存计算结果）
  const paginatedArticles = useMemo(
    () =>
      filteredArticles.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredArticles, currentPage, pageSize]
  );

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} data-res-type="2-1">
        <Title level={2} className={styles.title}>
          文章集
        </Title>
        <Paragraph type="secondary">
          分享技术见解，记录成长历程
        </Paragraph>
      </div>

      {/* 分类标签 */}
      <div data-res-type="2-2">
        <Tabs
          activeKey={activeCategory}
          onChange={handleCategoryChange}
          items={categories.map(cat => ({
            key: cat.key,
            label: cat.label,
          }))}
          className={styles.tabs}
        />
      </div>

      {/* 文章列表 */}
      {!isLoaded ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : paginatedArticles.length > 0 ? (
        <>
          <Row gutter={[24, 24]} data-res-type="2-3">
            {paginatedArticles.map(article => (
              <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={article.id}>
                <ArticleCard article={article} />
              </Col>
            ))}
          </Row>

          {/* 分页 */}
          <div className={styles.pagination} data-res-type="2-4">
            <Pagination
              current={currentPage}
              total={filteredArticles.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="暂无文章" />
      )}

      {/* 文章详情弹窗 - 当有 id 参数时显示 */}
      {id && <ArticleModal />}
    </div>
  );
}
