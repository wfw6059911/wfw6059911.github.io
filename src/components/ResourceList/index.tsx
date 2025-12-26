import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Resource } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import styles from './ResourceList.module.css';

const { Title } = Typography;

interface ResourceListProps {
  resources: Resource[];
  showMore?: boolean;
}

export default function ResourceList({ resources, showMore = false }: ResourceListProps) {
  // 取前5个资源：1个大卡片 + 4个小卡片
  const displayResources = resources.slice(0, 5);
  const largeResource = displayResources[0];
  const smallResources = displayResources.slice(1, 5);

  return (
    <div className={styles.container} data-res-type="1-6">
      <div className={styles.header}>
        <Title level={3} className={styles.sectionTitle}>
          最新视界
        </Title>
        {showMore && (
          <Link to="/resources" className={styles.moreLink}>
            查看更多 &rarr;
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {/* 左侧大卡片 */}
        {largeResource && (
          <div className={styles.largeCard}>
            <ResourceCard resource={largeResource} size="large" />
          </div>
        )}

        {/* 右侧小卡片 2x2 */}
        <div className={styles.smallCards}>
          {smallResources.map(resource => (
            <div key={resource.id} className={styles.smallCard}>
              <ResourceCard resource={resource} size="small" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
