import { useMemo } from 'react';
import { Typography } from 'antd';
import { quickLinks } from '@/mock/quickLinks';
import styles from './QuickLinks.module.css';

const { Title } = Typography;

export interface QuickLink {
  id: number;
  title: string;
  image: string;
  url: string;
}

// 渐变色预设
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
  'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
];

export default function QuickLinks() {
  // 为每个卡片生成随机渐变色索引（基于id保持稳定）
  const gradientMap = useMemo(() => {
    const map: Record<number, string> = {};
    quickLinks.forEach((link) => {
      // 使用 id 作为种子，保证同一个卡片每次渲染颜色一致
      const index = link.id % GRADIENTS.length;
      map[link.id] = GRADIENTS[index];
    });
    return map;
  }, []);

  return (
    <div className={styles.container} data-res-type="1-12">
      <div className={styles.header}>
        <Title level={3} className={styles.sectionTitle}>
          3D溜溜网快链
        </Title>
      </div>

      <div className={styles.grid}>
        {quickLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkCard}
          >
            <div
              className={styles.imageWrapper}
              style={!link.image ? { background: gradientMap[link.id] } : undefined}
            >
              {link.image ? (
                <img src={link.image} alt={link.title} className={styles.image} />
              ) : (
                <div className={styles.gradientPlaceholder} />
              )}
            </div>
            <span className={styles.title}>{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
