import { Typography, Row, Col, Card, Avatar, Progress, Timeline, Tag, Space } from 'antd';
import GithubOutlined from '@ant-design/icons/GithubOutlined';
import ReadOutlined from '@ant-design/icons/ReadOutlined';
import WechatOutlined from '@ant-design/icons/WechatOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import TrophyOutlined from '@ant-design/icons/TrophyOutlined';
import { profile } from '@/mock/profile';
import styles from './About.module.css';

const { Title, Paragraph, Text } = Typography;

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  GithubOutlined: <GithubOutlined />,
  ReadOutlined: <ReadOutlined />,
  WechatOutlined: <WechatOutlined />,
  MailOutlined: <MailOutlined />,
};

// 技能分类颜色
const skillCategoryColors: Record<string, string> = {
  编程语言: '#667eea',
  前端框架: '#764ba2',
  后端: '#f093fb',
  样式: '#10b981',
  工具: '#f59e0b',
};

export default function AboutPage() {
  // 按分类分组技能
  const skillsByCategory = profile.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof profile.skills>);

  return (
    <div className={styles.container}>
      {/* 个人信息卡片 */}
      <Card className={styles.profileCard} data-res-type="5-1">
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} md={8} className={styles.avatarSection}>
            <Avatar src={profile.avatar} size={160} className={styles.avatar} />
            <Title level={2} className={styles.name}>
              {profile.name}
            </Title>
            <Text type="secondary" className={styles.signature}>
              {profile.signature}
            </Text>

            {/* 社交链接 */}
            <Space size="middle" className={styles.socialLinks}>
              {profile.socialLinks.map(link => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  title={link.platform}
                >
                  {iconMap[link.icon] || <ReadOutlined />}
                </a>
              ))}
            </Space>
          </Col>

          <Col xs={24} md={16} data-res-type="5-2">
            <Title level={4}>关于我</Title>
            <Paragraph className={styles.bio}>{profile.bio}</Paragraph>
          </Col>
        </Row>
      </Card>

      {/* 技能树 */}
      <Card className={styles.skillsCard} data-res-type="5-3">
        <Title level={3} className={styles.sectionTitle}>
          <TrophyOutlined /> 技能树
        </Title>

        <Row gutter={[32, 24]}>
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <Col xs={24} md={12} key={category}>
              <div className={styles.skillCategory}>
                <Tag
                  color={skillCategoryColors[category] || '#667eea'}
                  className={styles.categoryTag}
                >
                  {category}
                </Tag>
                <div className={styles.skillList}>
                  {skills.map(skill => (
                    <div key={skill.name} className={styles.skillItem}>
                      <div className={styles.skillHeader}>
                        <Text>{skill.name}</Text>
                        <Text type="secondary">{skill.level}%</Text>
                      </div>
                      <Progress
                        percent={skill.level}
                        showInfo={false}
                        strokeColor={{
                          '0%': '#667eea',
                          '100%': '#764ba2',
                        }}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 工作经历 */}
      <Card className={styles.experienceCard} data-res-type="5-4">
        <Title level={3} className={styles.sectionTitle}>
          工作经历
        </Title>

        <Timeline
          items={profile.experience.map(exp => ({
            color: '#667eea',
            content: (
              <div className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <Title level={5} className={styles.experienceTitle}>
                    {exp.title}
                  </Title>
                  <Tag color="purple">{exp.period}</Tag>
                </div>
                <Text type="secondary" className={styles.company}>
                  {exp.company}
                </Text>
                <Paragraph className={styles.experienceDesc}>
                  {exp.description}
                </Paragraph>
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  );
}
