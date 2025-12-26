import { useState, useMemo } from 'react';
import { Typography, Tabs, Row, Col, Pagination, Empty } from 'antd';
import { tools, toolCategories } from '@/mock/tools';
import ToolCard from '@/components/ToolCard';
import styles from './Tools.module.css';

const { Title, Paragraph } = Typography;

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;

  // 筛选工具（使用 useMemo 缓存计算结果）
  const filteredTools = useMemo(() =>
    activeCategory === 'all'
      ? tools
      : tools.filter(t => t.category === activeCategory),
    [activeCategory]
  );

  // 分页（使用 useMemo 缓存计算结果）
  const paginatedTools = useMemo(() =>
    filteredTools.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    ),
    [filteredTools, currentPage, pageSize]
  );

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} data-res-type="3-1">
        <Title level={2} className={styles.title}>
          工具集
        </Title>
        <Paragraph type="secondary">
          精选常用开发工具，提升工作效率
        </Paragraph>
      </div>

      {/* 分类标签 */}
      <div data-res-type="3-2">
        <Tabs
          activeKey={activeCategory}
          onChange={handleCategoryChange}
          items={toolCategories.map(cat => ({
            key: cat.key,
            label: cat.label,
          }))}
          className={styles.tabs}
        />
      </div>

      {/* 工具列表 */}
      {paginatedTools.length > 0 ? (
        <>
          <Row gutter={[24, 24]} data-res-type="3-3">
            {paginatedTools.map(tool => (
              <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={tool.id}>
                <ToolCard tool={tool} />
              </Col>
            ))}
          </Row>

          {/* 分页 */}
          <div className={styles.pagination} data-res-type="3-4">
            <Pagination
              current={currentPage}
              total={filteredTools.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="暂无工具" className={styles.empty} />
      )}
    </div>
  );
}
