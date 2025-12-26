import { useState } from 'react';
import { Typography, Tabs, Row, Col, Empty, Pagination } from 'antd';
import { resources, resourceCategories } from '@/mock/resources';
import ResourceCard from '@/components/ResourceCard';
import styles from './Resources.module.css';

const { Title, Paragraph } = Typography;

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;

  // 筛选资源
  const filteredResources = resources.filter(r => {
    return activeCategory === 'all' || r.category === activeCategory;
  });

  // 分页
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} data-res-type="4-1">
        <Title level={2} className={styles.title}>
          资源视界
        </Title>
        <Paragraph type="secondary">
          精选开发工具、教程资源，助力高效开发
        </Paragraph>
      </div>

      {/* 分类标签 */}
      <div data-res-type="4-2">
        <Tabs
          activeKey={activeCategory}
          onChange={handleCategoryChange}
          items={resourceCategories.map(cat => ({
            key: cat.key,
            label: cat.label,
          }))}
          className={styles.tabs}
        />
      </div>

      {/* 资源列表 - 网格布局 */}
      {paginatedResources.length > 0 ? (
        <>
          <Row gutter={[24, 24]} data-res-type="4-3">
            {paginatedResources.map(resource => (
              <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={resource.id}>
                <div className={styles.cardWrapper}>
                  <ResourceCard resource={resource} size="small" />
                </div>
              </Col>
            ))}
          </Row>

          {/* 分页 */}
          <div className={styles.pagination} data-res-type="4-4">
            <Pagination
              current={currentPage}
              total={filteredResources.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="暂无资源" className={styles.empty} />
      )}
    </div>
  );
}
