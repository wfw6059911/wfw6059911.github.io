import { useState, useEffect, useCallback } from 'react';
import { Modal, Input, List, Typography, Tag, Empty } from 'antd';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import { getArticleList } from '@/utils/articles';
import { Article } from '@/types';
import { resources } from '@/mock/resources';
import { Link } from 'react-router-dom';

const { Text } = Typography;

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'article' | 'resource';
  url: string;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // 加载文章数据
  useEffect(() => {
    getArticleList().then(setArticles);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setKeyword(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const lowerValue = value.toLowerCase();

    // 搜索文章
    const articleResults: SearchResult[] = articles
      .filter(a =>
        a.title.toLowerCase().includes(lowerValue) ||
        a.description.toLowerCase().includes(lowerValue)
      )
      .map(a => ({
        id: a.id,
        title: a.title,
        type: 'article' as const,
        url: `/articles/${a.id}`,
      }));

    // 搜索资源
    const resourceResults: SearchResult[] = resources
      .filter(r =>
        r.title.toLowerCase().includes(lowerValue) ||
        r.description.toLowerCase().includes(lowerValue)
      )
      .map(r => ({
        id: r.id,
        title: r.title,
        type: 'resource' as const,
        url: `/resources/${r.id}`,
      }));

    setResults([...articleResults, ...resourceResults]);
  }, [articles]);

  const handleClose = () => {
    setKeyword('');
    setResults([]);
    onClose();
  };

  return (
    <div data-res-type="0-5">
      <Modal
        title="搜索"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={600}
        maskClosable={false}
        keyboard={false}
      >
      <Input
        placeholder="搜索文章、资源..."
        prefix={<SearchOutlined />}
        size="large"
        value={keyword}
        onChange={e => handleSearch(e.target.value)}
        autoFocus
        allowClear
      />

      <div style={{ marginTop: 16, maxHeight: 400, overflow: 'auto' }}>
        {keyword && results.length === 0 ? (
          <Empty description="未找到相关内容" />
        ) : (
          <List
            dataSource={results}
            renderItem={item => (
              <List.Item>
                <Link to={item.url} onClick={handleClose} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.type === 'article' ? (
                      <FileTextOutlined style={{ color: '#667eea' }} />
                    ) : (
                      <AppstoreOutlined style={{ color: '#764ba2' }} />
                    )}
                    <Text>{item.title}</Text>
                    <Tag color={item.type === 'article' ? 'blue' : 'purple'}>
                      {item.type === 'article' ? '文章' : '资源'}
                    </Tag>
                  </div>
                </Link>
              </List.Item>
            )}
          />
        )}
      </div>
    </Modal>
    </div>
  );
}
