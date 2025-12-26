import { useState, useEffect } from 'react';
import styles from './IpLocation.module.css';

interface IpInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  org?: string;
  timezone?: string;
  error?: string;
}

const CACHE_KEY = 'ip_location_cache';

// IP 位置查询工具组件
export default function IpLocation() {
  const [inputIp, setInputIp] = useState<string>('');
  const [queryResult, setQueryResult] = useState<IpInfo | null>(null);
  const [currentIp, setCurrentIp] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLoading, setCurrentLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // 获取当前用户 IP（优先读取缓存）
  useEffect(() => {
    loadCurrentIp();
  }, []);

  // 从缓存加载或请求 IP
  const loadCurrentIp = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached) as IpInfo;
        setCurrentIp(data);
        setCurrentLoading(false);
        return;
      }
    } catch {
      // 缓存读取失败，继续请求
    }
    fetchCurrentIp();
  };

  // 保存到缓存
  const saveToCache = (data: IpInfo) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // 缓存写入失败，忽略
    }
  };

  // 获取当前用户 IP 信息（强制请求）
  const fetchCurrentIp = async () => {
    setCurrentLoading(true);
    try {
      // 使用 ip-api.com，支持中文返回
      const response = await fetch('http://ip-api.com/json/?lang=zh-CN&fields=status,message,country,regionName,city,isp,org,query,timezone');
      if (!response.ok) throw new Error('请求失败');
      const data = await response.json();
      if (data.status === 'fail') throw new Error(data.message);
      const ipInfo: IpInfo = {
        ip: data.query,
        country: data.country,
        region: data.regionName,
        city: data.city,
        isp: data.isp || data.org,
        timezone: data.timezone,
      };
      setCurrentIp(ipInfo);
      saveToCache(ipInfo);
    } catch {
      // 备用 API（英文）
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const ipInfo: IpInfo = {
          ip: data.ip,
          country: data.country_name,
          region: data.region,
          city: data.city,
          isp: data.org,
          timezone: data.timezone,
        };
        setCurrentIp(ipInfo);
        saveToCache(ipInfo);
      } catch {
        setCurrentIp({ ip: '获取失败', error: '无法获取当前 IP' });
      }
    }
    setCurrentLoading(false);
  };

  // 查询指定 IP
  const queryIp = async () => {
    if (!inputIp.trim()) {
      setQueryResult({ ip: inputIp, error: '请输入有效的 IP 地址' });
      return;
    }

    // 简单验证 IP 格式
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(inputIp.trim())) {
      setQueryResult({ ip: inputIp, error: 'IP 地址格式不正确' });
      return;
    }

    setLoading(true);
    setQueryResult(null);

    try {
      // 使用 ip-api.com，支持中文返回
      const response = await fetch(`http://ip-api.com/json/${inputIp.trim()}?lang=zh-CN&fields=status,message,country,regionName,city,isp,org,query,timezone`);
      if (!response.ok) throw new Error('请求失败');
      const data = await response.json();

      if (data.status === 'fail') {
        setQueryResult({ ip: inputIp, error: data.message || '查询失败' });
      } else {
        setQueryResult({
          ip: data.query,
          country: data.country,
          region: data.regionName,
          city: data.city,
          isp: data.isp || data.org,
          timezone: data.timezone,
        });
      }
    } catch {
      setQueryResult({ ip: inputIp, error: '查询失败，请稍后重试' });
    }

    setLoading(false);
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // 复制失败时不做处理
    }
  };

  // 格式化位置信息
  const formatLocation = (info: IpInfo) => {
    const parts = [info.country, info.region, info.city].filter(Boolean);
    return parts.join(' · ') || '未知';
  };

  return (
    <div className={styles.container}>
      {/* 当前用户 IP */}
      <div className={styles.currentIp}>
        <div className={styles.currentHeader}>
          <span className={styles.currentLabel}>您的 IP 地址</span>
          <button
            className={styles.refreshBtn}
            onClick={fetchCurrentIp}
            disabled={currentLoading}
          >
            {currentLoading ? '获取中...' : '刷新'}
          </button>
        </div>
        {currentLoading ? (
          <div className={styles.loading}>正在获取...</div>
        ) : currentIp?.error ? (
          <div className={styles.error}>{currentIp.error}</div>
        ) : (
          <div className={styles.currentInfo}>
            <div className={styles.ipValue}>
              {currentIp?.ip}
              <button
                className={styles.copyBtn}
                onClick={() => copyToClipboard(currentIp?.ip || '')}
              >
                {copySuccess ? '复制成功' : '复制'}
              </button>
            </div>
            <div className={styles.locationInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>归属地：</span>
                <span className={styles.infoValue}>{formatLocation(currentIp!)}</span>
              </div>
              {currentIp?.isp && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>运营商：</span>
                  <span className={styles.infoValue}>{currentIp.isp}</span>
                </div>
              )}
              {currentIp?.timezone && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>时区：</span>
                  <span className={styles.infoValue}>{currentIp.timezone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* IP 查询 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>IP 地址查询</h4>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="输入要查询的 IP 地址，如 8.8.8.8"
            value={inputIp}
            onChange={(e) => setInputIp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && queryIp()}
          />
          <button
            className={styles.btn}
            onClick={queryIp}
            disabled={loading}
          >
            {loading ? '查询中...' : '查询'}
          </button>
        </div>

        {/* 查询结果 */}
        {queryResult && (
          <div className={styles.result}>
            {queryResult.error ? (
              <div className={styles.resultError}>{queryResult.error}</div>
            ) : (
              <div className={styles.resultInfo}>
                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>IP 地址：</span>
                  <span className={styles.resultValue}>{queryResult.ip}</span>
                </div>
                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>归属地：</span>
                  <span className={styles.resultValue}>{formatLocation(queryResult)}</span>
                </div>
                {queryResult.isp && (
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>运营商：</span>
                    <span className={styles.resultValue}>{queryResult.isp}</span>
                  </div>
                )}
                {queryResult.timezone && (
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>时区：</span>
                    <span className={styles.resultValue}>{queryResult.timezone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className={styles.tips}>
        <h4>使用说明</h4>
        <ul>
          <li>自动显示您当前的公网 IP 地址及归属地</li>
          <li>IP 信息会缓存到本地，下次访问直接读取</li>
          <li>点击"刷新"按钮可重新获取最新 IP 信息</li>
          <li>支持查询任意 IPv4 地址的归属地信息</li>
        </ul>
      </div>
    </div>
  );
}
