import { Layout, Typography } from 'antd';
import HeartFilled from '@ant-design/icons/HeartFilled';
import styles from './Footer.module.css';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className={styles.footer} data-res-type="0-2">
      <div className={styles.container}>
        <Text type="secondary">
          &copy; {currentYear} 博客园. Made with <HeartFilled style={{ color: '#f093fb' }} /> using{' '}
          <Link href="https://react.dev" target="_blank">
            React
          </Link>{' '}
          &{' '}
          <Link href="https://vitejs.dev" target="_blank">
            Vite
          </Link>{' '}
          &{' '}
          <Link href="https://ant.design" target="_blank">
            Ant Design
          </Link>
        </Text>
      </div>
    </AntFooter>
  );
}
