import { useState, useMemo } from 'react';
import { Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { countryData, type CountryData } from './data';
import styles from './CountryCodeTool.module.css';

// 表格列配置
const columns: ColumnsType<CountryData> = [
  {
    title: '域名缩写',
    dataIndex: 'domainCode',
    key: 'domainCode',
    width: 100,
  },
  {
    title: '国家或地区',
    dataIndex: 'countryName',
    key: 'countryName',
    width: 150,
  },
  {
    title: '英文名',
    dataIndex: 'englishName',
    key: 'englishName',
  },
  {
    title: '电话代码',
    dataIndex: 'phoneCode',
    key: 'phoneCode',
    width: 120,
  },
];

export default function CountryCodeTool() {
  const [searchValue, setSearchValue] = useState('');

  // 实时过滤数据
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return countryData;
    const keyword = searchValue.toLowerCase().trim();
    return countryData.filter(
      (item) =>
        item.domainCode.toLowerCase().includes(keyword) ||
        item.countryName.includes(keyword) ||
        item.englishName.toLowerCase().includes(keyword) ||
        item.phoneCode.includes(keyword)
    );
  }, [searchValue]);

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <Input
          placeholder="输入域名缩写、国家名、英文名或电话代码搜索..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
          size="large"
          className={styles.searchInput}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 20,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 500 }}
        size="middle"
        className={styles.table}
      />
    </div>
  );
}
