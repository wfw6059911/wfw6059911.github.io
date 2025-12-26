import { memo } from 'react';
import { Card, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { useLazyImage } from '@/hooks/useLazyImage';
import styles from './ArticleCard.module.css';

const { Title, Paragraph } = Typography;

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = memo(function ArticleCard({ article }: ArticleCardProps) {
  const { ref, shouldShowImage, imageSrc } = useLazyImage(article.coverImage);

  return (
    <Link to={`/articles/${article.id}`}>
      <Card hoverable className={styles.card}>
        <div
          ref={ref}
          className={`${styles.cover} ${!shouldShowImage ? styles.loading : ''}`}
          style={shouldShowImage ? { backgroundImage: `url(${imageSrc})` } : undefined}
        >
          <Tag color="blue" className={styles.category}>
            {article.category}
          </Tag>
        </div>
        <div className={styles.content}>
          <Title level={5} className={styles.title} ellipsis={{ rows: 2 }}>
            {article.title}
          </Title>
          <Paragraph
            type="secondary"
            ellipsis={{ rows: 2 }}
            className={styles.description}
          >
            {article.description}
          </Paragraph>
        </div>
      </Card>
    </Link>
  );
});

export default ArticleCard;
