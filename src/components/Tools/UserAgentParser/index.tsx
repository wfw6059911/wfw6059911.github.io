import { useState, useEffect } from 'react';
import { message } from 'antd';
import styles from './UserAgentParser.module.css';

// UA 解析结果接口
interface ParsedUA {
  浏览器: string;
  操作系统: string;
  设备类型: string;
  渲染引擎: string;
  是否机器人: string;
}

// 解析浏览器信息
function parseBrowser(ua: string): string {
  const browsers: [RegExp, string][] = [
    [/Edg(?:e|A|iOS)?\/(\d+[\d.]*)/i, 'Edge'],
    [/OPR\/(\d+[\d.]*)/i, 'Opera'],
    [/(?:Chrome|CriOS)\/(\d+[\d.]*)/i, 'Chrome'],
    [/(?:Firefox|FxiOS)\/(\d+[\d.]*)/i, 'Firefox'],
    [/Safari\/(\d+[\d.]*)/i, 'Safari'],
    [/MSIE\s(\d+[\d.]*)/i, 'IE'],
    [/Trident.*rv:(\d+[\d.]*)/i, 'IE'],
    [/(?:UCBrowser|UCWEB)\/(\d+[\d.]*)/i, 'UC浏览器'],
    [/QQBrowser\/(\d+[\d.]*)/i, 'QQ浏览器'],
    [/MicroMessenger\/(\d+[\d.]*)/i, '微信浏览器'],
    [/(?:SamsungBrowser)\/(\d+[\d.]*)/i, '三星浏览器'],
    [/(?:Vivaldi)\/(\d+[\d.]*)/i, 'Vivaldi'],
    [/(?:Brave)\/(\d+[\d.]*)/i, 'Brave'],
  ];

  // 特殊处理：Safari 需要排除 Chrome/Chromium
  for (const [regex, name] of browsers) {
    const match = ua.match(regex);
    if (match) {
      // 如果是 Safari，需要确认不是 Chrome 系列
      if (name === 'Safari' && /Chrome|Chromium|CriOS|Edg|OPR/i.test(ua)) {
        continue;
      }
      return `${name} ${match[1]}`;
    }
  }

  return '未知浏览器';
}

// 解析操作系统信息
function parseOS(ua: string): string {
  const osPatterns: [RegExp, string, (match: RegExpMatchArray) => string][] = [
    [/Windows NT 10\.0/i, 'Windows', () => 'Windows 10/11'],
    [/Windows NT 6\.3/i, 'Windows', () => 'Windows 8.1'],
    [/Windows NT 6\.2/i, 'Windows', () => 'Windows 8'],
    [/Windows NT 6\.1/i, 'Windows', () => 'Windows 7'],
    [/Windows NT 6\.0/i, 'Windows', () => 'Windows Vista'],
    [/Windows NT 5\.1/i, 'Windows', () => 'Windows XP'],
    [/Mac OS X (\d+[._]\d+(?:[._]\d+)?)/i, 'macOS', (m) => `macOS ${m[1].replace(/_/g, '.')}`],
    [/iPhone OS (\d+[._]\d+)/i, 'iOS', (m) => `iOS ${m[1].replace(/_/g, '.')}`],
    [/iPad.*OS (\d+[._]\d+)/i, 'iPadOS', (m) => `iPadOS ${m[1].replace(/_/g, '.')}`],
    [/Android (\d+[\d.]*)/i, 'Android', (m) => `Android ${m[1]}`],
    [/Linux/i, 'Linux', () => 'Linux'],
    [/Ubuntu/i, 'Ubuntu', () => 'Ubuntu'],
    [/CrOS/i, 'Chrome OS', () => 'Chrome OS'],
    [/Windows Phone/i, 'Windows Phone', () => 'Windows Phone'],
  ];

  for (const [regex, , formatter] of osPatterns) {
    const match = ua.match(regex);
    if (match) {
      return formatter(match);
    }
  }

  return '未知系统';
}

// 解析设备类型
function parseDevice(ua: string): string {
  if (/Mobile|Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return '手机';
  }
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    return '平板';
  }
  if (/Smart-?TV|GoogleTV|AppleTV|HbbTV|PTVAPP|POV_TV|NetCast\.TV/i.test(ua)) {
    return '智能电视';
  }
  if (/Xbox|PlayStation|Nintendo/i.test(ua)) {
    return '游戏主机';
  }
  return '桌面设备';
}

// 解析渲染引擎
function parseEngine(ua: string): string {
  const engines: [RegExp, string][] = [
    [/AppleWebKit\/(\d+[\d.]*)/i, 'WebKit'],
    [/Gecko\/(\d+)/i, 'Gecko'],
    [/Trident\/(\d+[\d.]*)/i, 'Trident'],
    [/Presto\/(\d+[\d.]*)/i, 'Presto'],
    [/EdgeHTML\/(\d+[\d.]*)/i, 'EdgeHTML'],
  ];

  for (const [regex, name] of engines) {
    const match = ua.match(regex);
    if (match) {
      // Chrome/Edge 使用 Blink（基于 WebKit）
      if (name === 'WebKit' && /Chrome|Edg/i.test(ua)) {
        const chromeMatch = ua.match(/Chrome\/(\d+)/i);
        if (chromeMatch) {
          return `Blink (Chrome ${chromeMatch[1]})`;
        }
      }
      return `${name} ${match[1]}`;
    }
  }

  return '未知引擎';
}

// 检测是否为机器人/爬虫
function parseBot(ua: string): string {
  const bots: [RegExp, string][] = [
    [/Googlebot/i, 'Googlebot'],
    [/bingbot/i, 'Bingbot'],
    [/Baiduspider/i, '百度蜘蛛'],
    [/YandexBot/i, 'YandexBot'],
    [/DuckDuckBot/i, 'DuckDuckBot'],
    [/Slurp/i, 'Yahoo Slurp'],
    [/facebookexternalhit/i, 'Facebook'],
    [/Twitterbot/i, 'Twitterbot'],
    [/LinkedInBot/i, 'LinkedInBot'],
    [/bot|crawler|spider|crawling/i, '其他爬虫'],
  ];

  for (const [regex, name] of bots) {
    if (regex.test(ua)) {
      return `是 (${name})`;
    }
  }

  return '否';
}

// 解析 UA 字符串
function parseUserAgent(ua: string): ParsedUA {
  return {
    浏览器: parseBrowser(ua),
    操作系统: parseOS(ua),
    设备类型: parseDevice(ua),
    渲染引擎: parseEngine(ua),
    是否机器人: parseBot(ua),
  };
}

// User-Agent 解析工具组件
export default function UserAgentParser() {
  const [messageApi, contextHolder] = message.useMessage();
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<ParsedUA | null>(null);
  const currentUA = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  // 页面加载时自动解析当前浏览器 UA
  useEffect(() => {
    if (currentUA) {
      setInput(currentUA);
      setResult(parseUserAgent(currentUA));
    }
  }, [currentUA]);

  // 解析 UA
  const handleParse = () => {
    if (!input.trim()) {
      messageApi.warning('请输入 User-Agent 字符串');
      return;
    }
    setResult(parseUserAgent(input));
    messageApi.success('解析完成');
  };

  // 使用当前浏览器 UA
  const useCurrentUA = () => {
    setInput(currentUA);
    setResult(parseUserAgent(currentUA));
    messageApi.success('已获取当前浏览器 UA');
  };

  // 复制 UA
  const copyUA = () => {
    if (!input) {
      messageApi.warning('没有可复制的内容');
      return;
    }
    navigator.clipboard.writeText(input);
    messageApi.success('UA 已复制到剪贴板');
  };

  // 复制解析结果
  const copyResult = () => {
    if (!result) {
      messageApi.warning('请先解析 UA');
      return;
    }
    const text = Object.entries(result)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    messageApi.success('解析结果已复制到剪贴板');
  };

  // 清除
  const clearAll = () => {
    setInput('');
    setResult(null);
    messageApi.success('已清除');
  };

  return (
    <div className={styles.container}>
      {contextHolder}

      {/* 当前 UA 展示 */}
      <div className={styles.currentUA}>
        <div className={styles.currentUALabel}>当前浏览器 User-Agent</div>
        <div className={styles.currentUAValue}>{currentUA}</div>
      </div>

      {/* 输入区域 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>输入 User-Agent</h4>
        <textarea
          className={styles.textarea}
          placeholder="请输入要解析的 User-Agent 字符串"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
      </div>

      {/* 操作按钮 */}
      <div className={styles.buttonGroup}>
        <button className={styles.btn} onClick={handleParse}>
          解析 UA
        </button>
        <button className={styles.btn} onClick={useCurrentUA}>
          使用当前浏览器
        </button>
        <button className={styles.btnSecondary} onClick={copyUA}>
          复制 UA
        </button>
        <button className={styles.btnSecondary} onClick={clearAll}>
          清除
        </button>
      </div>

      {/* 解析结果 */}
      {result && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <h4 className={styles.sectionTitle}>解析结果</h4>
            <button className={styles.copyBtn} onClick={copyResult}>
              复制结果
            </button>
          </div>
          <div className={styles.resultGrid}>
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className={styles.resultItem}>
                <div className={styles.resultLabel}>{key}</div>
                <div className={styles.resultValue}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className={styles.tips}>
        <h4>使用说明</h4>
        <ul>
          <li>页面加载时自动获取并解析当前浏览器的 UA</li>
          <li>支持粘贴任意 UA 字符串进行解析</li>
          <li>可识别主流浏览器、操作系统、设备类型和渲染引擎</li>
          <li>可检测常见搜索引擎爬虫（Googlebot、百度蜘蛛等）</li>
        </ul>
      </div>
    </div>
  );
}
