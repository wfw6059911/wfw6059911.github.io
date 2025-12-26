import { useState, useEffect, memo } from 'react';
import { Card, Tag, Typography } from 'antd';
import { Tool } from '@/types';
import { getToolComponent } from '@/components/Tools';
import { getToolGradient } from '@/mock/tools';
import styles from './ToolCard.module.css';

const { Paragraph } = Typography;

interface ToolCardProps {
  tool: Tool;
}

// 工具卡片组件（样式与文章卡片一致，支持弹窗功能）
const ToolCard = memo(function ToolCard({ tool }: ToolCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  // 获取该工具的渐变色
  const gradient = getToolGradient(tool.id);

  // 获取打开方式标签文案
  const getModalTypeLabel = (modalType: string) => {
    switch (modalType) {
      case 'component':
        return '本地';
      case 'iframe':
        return '窗口';
      case 'link':
        return '链接';
      default:
        return '';
    }
  };

  // 弹窗关闭时重置 iframe 状态
  useEffect(() => {
    if (!modalVisible) {
      setIframeLoading(true);
    }
  }, [modalVisible]);

  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    // link 模式：直接在新标签页打开，不阻止默认行为
    if (tool.modalType === 'link') {
      return;
    }
    // 其他模式：弹窗打开
    e.preventDefault();
    setModalVisible(true);
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // iframe 加载完成
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  // iframe 加载错误
  const handleIframeError = () => {
    setIframeLoading(false);
  };

  // 获取组件形式的工具
  const ToolComponent = tool.modalType === 'component' && tool.componentId
    ? getToolComponent(tool.componentId)
    : null;

  return (
    <>
      <a
        href={tool.url || '#'}
        onClick={handleClick}
        className={styles.link}
        {...(tool.modalType === 'link' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <Card hoverable className={styles.card}>
          <div
            className={styles.cover}
            style={{ background: gradient }}
          >
            <Tag color="purple" className={styles.category}>
              {tool.category}
            </Tag>
            {tool.modalType && (
              <Tag className={styles.modalTypeTag}>
                {getModalTypeLabel(tool.modalType)}
              </Tag>
            )}
            <h3 className={styles.coverTitle}>{tool.title}</h3>
          </div>
          <div className={styles.content}>
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              className={styles.description}
            >
              {tool.description}
            </Paragraph>
          </div>
        </Card>
      </a>

      {/* 弹窗 */}
      {modalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>{tool.title}</span>
              <div className={styles.modalActions}>
                {/* iframe 模式显示新窗口打开按钮 */}
                {tool.modalType === 'iframe' && tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalNewWindow}
                    title="在新窗口打开"
                  >
                    ↗
                  </a>
                )}
                <button className={styles.modalClose} onClick={handleCloseModal}>
                  ×
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              {/* iframe 模式 */}
              {tool.modalType === 'iframe' && tool.url && (
                <div className={styles.iframeWrapper}>
                  {/* 底层提示（当 iframe 被拒绝时会显示） */}
                  <div className={styles.iframeFallback}>
                    <div className={styles.fallbackIcon}>🔒</div>
                    <p className={styles.fallbackText}>
                      该网站禁止在框架中打开
                    </p>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fallbackButton}
                    >
                      在新窗口中打开 ↗
                    </a>
                  </div>
                  {/* iframe */}
                  <iframe
                    src={tool.url}
                    className={styles.modalIframe}
                    title={tool.title}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                  {/* 加载中提示 */}
                  {iframeLoading && (
                    <div className={styles.iframeLoading}>
                      <div className={styles.loadingSpinner} />
                      <span>加载中...</span>
                    </div>
                  )}
                </div>
              )}
              {/* 组件模式 */}
              {tool.modalType === 'component' && ToolComponent && (
                <div className={styles.modalComponentWrapper}>
                  <ToolComponent />
                </div>
              )}
              {/* 组件未找到 */}
              {tool.modalType === 'component' && !ToolComponent && (
                <div className={styles.modalError}>
                  工具组件未找到: {tool.componentId}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ToolCard;
