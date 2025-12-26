import { Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { Tool } from '@/types';
import ToolCard from '@/components/ToolCard';
import { getColSpan } from '@/utils/grid';
import styles from './ToolList.module.css';

const { Title } = Typography;

interface ToolListProps {
  tools: Tool[];
  showMore?: boolean;
  columns?: number;
}

export default function ToolList({ tools, showMore = false, columns = 3 }: ToolListProps) {
  const colSpan = getColSpan(columns);

  return (
    <div className={styles.container} data-res-type="1-5">
      <div className={styles.header}>
        <Title level={3} className={styles.sectionTitle}>
          最新工具
        </Title>
        {showMore && (
          <Link to="/tools" className={styles.moreLink}>
            查看更多 &rarr;
          </Link>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {tools.map(tool => (
          <Col {...colSpan} key={tool.id}>
            <ToolCard tool={tool} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
