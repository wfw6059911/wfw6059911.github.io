import { Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import { getColSpan } from '@/utils/grid';
import styles from './ArticleList.module.css';

const { Title } = Typography;

interface ArticleListProps {
  articles: Article[];
  showMore?: boolean;
  columns?: number;
}

export default function ArticleList({ articles, showMore = false, columns = 3 }: ArticleListProps) {
  const colSpan = getColSpan(columns);

  return (
    <div className={styles.container} data-res-type="1-4">
      <div className={styles.header}>
        <Title level={3} className={styles.sectionTitle}>
          最新文章
        </Title>
        {showMore && (
          <Link to="/articles" className={styles.moreLink}>
            查看更多 &rarr;
          </Link>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {articles.map(article => (
          <Col {...colSpan} key={article.id}>
            <ArticleCard article={article} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
