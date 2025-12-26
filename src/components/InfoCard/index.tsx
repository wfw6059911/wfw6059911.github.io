import { Card, Avatar, Typography, Space, Tooltip } from 'antd';
import GithubOutlined from '@ant-design/icons/GithubOutlined';
import ReadOutlined from '@ant-design/icons/ReadOutlined';
import WechatOutlined from '@ant-design/icons/WechatOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import { profile } from '@/mock/profile';
import styles from './InfoCard.module.css';

const { Title, Text, Paragraph } = Typography;

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  GithubOutlined: <GithubOutlined />,
  ReadOutlined: <ReadOutlined />,
  WechatOutlined: <WechatOutlined />,
  MailOutlined: <MailOutlined />,
};

export default function InfoCard() {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Avatar src={profile.avatar} size={80} className={styles.avatar} />
        <Title level={4} className={styles.name}>
          {profile.name}
        </Title>
        <Text type="secondary" className={styles.signature}>
          {profile.signature}
        </Text>
      </div>

      <Paragraph className={styles.bio}>{profile.bio}</Paragraph>

      <div className={styles.socialLinks}>
        <Space size="middle">
          {profile.socialLinks.map(link => (
            <Tooltip key={link.platform} title={link.platform}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {iconMap[link.icon] || <ReadOutlined />}
              </a>
            </Tooltip>
          ))}
        </Space>
      </div>
    </Card>
  );
}
