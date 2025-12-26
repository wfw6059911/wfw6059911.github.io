import { memo } from 'react';
import RightOutlined from '@ant-design/icons/RightOutlined';
import { Resource } from '@/types';
import styles from './ResourceCard.module.css';

interface ResourceCardProps {
  resource: Resource;
  size?: 'large' | 'small';
}

const ResourceCard = memo(function ResourceCard({ resource, size = 'small' }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${size === 'large' ? styles.large : styles.small}`}
      style={{ backgroundImage: `url(${resource.coverImage})` }}
    >
      {/* 渐变遮罩 */}
      <div className={styles.overlay} />

      {/* 内容区域 */}
      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{resource.title}</h3>
          <p className={styles.description}>{resource.description}</p>
        </div>
        <div className={styles.arrow}>
          <RightOutlined />
        </div>
      </div>
    </a>
  );
});

export default ResourceCard;
