import { useState } from 'react';
import { message } from 'antd';
import styles from './EncodeTool.module.css';

// 编码解码工具组件
export default function EncodeTool() {
  const [messageApi, contextHolder] = message.useMessage();
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Base64 编码（支持中文）
  const base64Encode = () => {
    if (!input) return;
    try {
      setError('');
      // 使用 TextEncoder 处理中文
      const bytes = new TextEncoder().encode(input);
      const binary = Array.from(bytes)
        .map((byte) => String.fromCharCode(byte))
        .join('');
      setOutput(btoa(binary));
    } catch {
      setError('编码失败，请检查输入内容');
    }
  };

  // Base64 解码（支持中文）
  const base64Decode = () => {
    if (!input) return;
    try {
      setError('');
      const binary = atob(input);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
    } catch {
      setError('解码失败，请确保输入的是有效的 Base64 字符串');
    }
  };

  // URL 编码
  const urlEncode = () => {
    if (!input) return;
    try {
      setError('');
      setOutput(encodeURIComponent(input));
    } catch {
      setError('URL 编码失败');
    }
  };

  // URL 解码
  const urlDecode = () => {
    if (!input) return;
    try {
      setError('');
      setOutput(decodeURIComponent(input));
    } catch {
      setError('URL 解码失败，请确保输入的是有效的 URL 编码字符串');
    }
  };

  // 中文转 Unicode
  const toUnicode = () => {
    if (!input) return;
    try {
      setError('');
      const result = input
        .split('')
        .map((char) => {
          const code = char.charCodeAt(0);
          if (code > 127) {
            return '\\u' + code.toString(16).padStart(4, '0');
          }
          return char;
        })
        .join('');
      setOutput(result);
    } catch {
      setError('Unicode 编码失败');
    }
  };

  // Unicode 转中文
  const fromUnicode = () => {
    if (!input) return;
    try {
      setError('');
      const result = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      );
      setOutput(result);
    } catch {
      setError('Unicode 解码失败，请确保输入格式正确（如 \\u4f60\\u597d）');
    }
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!output) {
      messageApi.warning('没有可复制的内容');
      return;
    }
    navigator.clipboard.writeText(output);
    messageApi.success('已复制到剪贴板');
  };

  // 清除内容
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    messageApi.success('已清除');
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>输入内容</h4>
        <textarea
          className={styles.textarea}
          placeholder="请输入要编码或解码的内容"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.btn} onClick={base64Encode}>
          Base64 编码
        </button>
        <button className={styles.btn} onClick={base64Decode}>
          Base64 解码
        </button>
        <button className={styles.btn} onClick={urlEncode}>
          URL 编码
        </button>
        <button className={styles.btn} onClick={urlDecode}>
          URL 解码
        </button>
        <button className={styles.btn} onClick={toUnicode}>
          中文转 Unicode
        </button>
        <button className={styles.btn} onClick={fromUnicode}>
          Unicode 转中文
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>输出结果</h4>
        <textarea
          className={styles.textarea}
          placeholder="转换结果将显示在这里"
          value={output}
          readOnly
          rows={5}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={copyToClipboard}>
          复制结果
        </button>
        <button className={styles.btnSecondary} onClick={clearAll}>
          清除
        </button>
      </div>

      <div className={styles.tips}>
        <h4>使用说明</h4>
        <ul>
          <li>Base64 编码/解码：支持中文字符</li>
          <li>URL 编码/解码：对特殊字符进行安全编码</li>
          <li>Unicode 编码/解码：中文与 \uXXXX 格式互转</li>
          <li>点击"复制结果"可将输出内容复制到剪贴板</li>
        </ul>
      </div>
    </div>
  );
}
