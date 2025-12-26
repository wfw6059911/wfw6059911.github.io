import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Divider, Card, Empty, QRCode } from 'antd';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '@/components/CodeBlock';
import { getArticleById, ArticleDetail } from '@/utils/articles';
import {
  getRecommendArticles,
  getFeaturedContents,
  RecommendArticle,
  FeaturedContent,
} from '@/mock/articleDetail';
import styles from './ArticleDetail.module.css';

const { Title, Paragraph, Text } = Typography;

interface ArticleDetailPageProps {
  onReady?: () => void;
}

export default function ArticleDetailPage({ onReady }: ArticleDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const articleId = id as string;
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ArticleDetail | undefined>(undefined);

  // 获取数据
  const recommendArticles: RecommendArticle[] = getRecommendArticles();
  const featuredContents: FeaturedContent[] = getFeaturedContents();

  // 加载文章数据
  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      const data = await getArticleById(articleId);
      setArticle(data);
      setLoading(false);
    };
    loadArticle();
  }, [articleId]);

  // 组件渲染完成后通知父组件
  useEffect(() => {
    if (onReady && !loading) {
      onReady();
    }
  }, [onReady, loading]);

  // 文章不存在或加载中
  if (!article) {
    if (loading) {
      return <div className={styles.container} />;
    }
    return (
      <div className={styles.container}>
        <Empty description="文章不存在" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* 左侧主内容区 */}
        <main className={styles.mainContent}>
          {/* 文章标题 */}
          <Title level={1} className={styles.title}>
            {article.title}
          </Title>

          {/* 文章元信息 */}
          <div className={styles.meta}>
            <span className={styles.author}>{article.author}</span>
            <span className={styles.date}>{article.publishDate}</span>
            <span className={styles.views}>
              <EyeOutlined /> {article.views.toLocaleString()}
            </span>
            <span className={styles.readTime}>
              <ClockCircleOutlined /> 阅读{article.readTime}分钟
            </span>
          </div>

          {/* 文章摘要 */}
          <blockquote className={styles.description}>
            {article.description}
          </blockquote>

          {/* 文章正文 */}
          <article className={styles.content}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 代码块渲染
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const isCodeBlock = match && codeString.includes('\n');

                  if (isCodeBlock) {
                    return <CodeBlock language={match[1]} code={codeString} />;
                  }

                  return (
                    <code className={styles.inlineCode} {...props}>
                      {children}
                    </code>
                  );
                },
                // 图片渲染
                img({ src, alt }) {
                  return (
                    <span className={styles.imageWrapper}>
                      <img src={src} alt={alt || ''} className={styles.image} />
                    </span>
                  );
                },
                // 标题渲染
                h1: ({ children }) => (
                  <Title level={1} className={styles.heading1}>
                    {children}
                  </Title>
                ),
                h2: ({ children }) => (
                  <Title level={2} className={styles.heading2}>
                    {children}
                  </Title>
                ),
                h3: ({ children }) => (
                  <Title level={3} className={styles.heading3}>
                    {children}
                  </Title>
                ),
                // 段落渲染
                p: ({ children }) => (
                  <Paragraph className={styles.paragraph}>{children}</Paragraph>
                ),
                // 列表渲染
                ul: ({ children }) => (
                  <ul className={styles.list}>{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className={styles.orderedList}>{children}</ol>
                ),
                li: ({ children }) => (
                  <li className={styles.listItem}>{children}</li>
                ),
                // 引用块渲染
                blockquote: ({ children }) => (
                  <blockquote className={styles.blockquote}>{children}</blockquote>
                ),
                // 链接渲染
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // 强调
                strong: ({ children }) => (
                  <strong className={styles.strong}>{children}</strong>
                ),
                // 分隔线
                hr: () => <Divider className={styles.divider} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </article>
        </main>

        {/* 右侧边栏 */}
        <aside className={styles.sidebar}>
          {/* 相关推荐 */}
          <Card className={styles.sidebarCard} title="相关推荐" variant="borderless">
            <ul className={styles.recommendList}>
              {recommendArticles.map((item) => (
                <li key={item.id} className={styles.recommendItem}>
                  <Link
                    to={`/articles/${item.id}`}
                    className={styles.recommendLink}
                  >
                    <Text ellipsis className={styles.recommendTitle}>
                      {item.title}
                    </Text>
                    <div className={styles.recommendMeta}>
                      <span>{item.views}阅读</span>
                      <span>·</span>
                      <span>{item.likes}点赞</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* 精选内容 */}
          <Card className={styles.sidebarCard} title="精选内容" variant="borderless">
            <ul className={styles.featuredList}>
              {featuredContents.map((item) => (
                <li key={item.id} className={styles.featuredItem}>
                  <Link
                    to={`/articles/${item.id}`}
                    className={styles.featuredLink}
                  >
                    <Text ellipsis className={styles.featuredTitle}>
                      {item.title}
                    </Text>
                    <div className={styles.featuredMeta}>
                      <span className={styles.featuredAuthor}>{item.author}</span>
                      <span>·</span>
                      <span>{item.views}阅读</span>
                      <span>·</span>
                      <span>{item.likes}点赞</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* 技术圈子 */}
          <Card className={styles.sidebarCard} title="找对属于你的技术圈子" variant="borderless">
            <div className={styles.qrcodeWrapper}>
              <div className={styles.qrcodeInfo}>
                <Text>回复「进群」加入官方微信群</Text>
              </div>
              <QRCode value="https://example.com/wechat" size={80} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
