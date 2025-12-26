import { useState, useCallback } from 'react';
import { message, Slider, Checkbox } from 'antd';
import styles from './PasswordGenerator.module.css';

// 字符集定义
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*_+-=';

// 检测是否存在连续 3 个及以上相同字符
function hasConsecutiveChars(str: string): boolean {
  for (let i = 0; i < str.length - 2; i++) {
    if (str[i] === str[i + 1] && str[i] === str[i + 2]) {
      return true;
    }
  }
  return false;
}

// 获取随机字符
function getRandomChar(charset: string): string {
  return charset[Math.floor(Math.random() * charset.length)];
}

// 打乱数组（Fisher-Yates 洗牌算法）
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 生成密码
function generatePassword(length: number, includeSpecial: boolean): string {
  // 构建字符集
  let allChars = UPPERCASE + LOWERCASE + NUMBERS;
  if (includeSpecial) {
    allChars += SPECIAL;
  }

  // 最大重试次数，防止无限循环
  const maxRetries = 100;

  for (let retry = 0; retry < maxRetries; retry++) {
    // 确保至少包含各类字符
    const required: string[] = [
      getRandomChar(UPPERCASE),
      getRandomChar(LOWERCASE),
      getRandomChar(NUMBERS),
    ];

    // 填充剩余字符
    const remaining: string[] = [];
    for (let i = required.length; i < length; i++) {
      remaining.push(getRandomChar(allChars));
    }

    // 合并并打乱
    const allCharsArray = shuffleArray([...required, ...remaining]);
    const password = allCharsArray.join('');

    // 检查是否有连续相同字符
    if (!hasConsecutiveChars(password)) {
      return password;
    }
  }

  // 如果多次重试仍然无法生成，使用替换策略
  return generateWithReplacement(length, includeSpecial);
}

// 使用替换策略生成密码（备用方案）
function generateWithReplacement(length: number, includeSpecial: boolean): string {
  let allChars = UPPERCASE + LOWERCASE + NUMBERS;
  if (includeSpecial) {
    allChars += SPECIAL;
  }

  // 先确保包含必需字符
  const chars: string[] = [
    getRandomChar(UPPERCASE),
    getRandomChar(LOWERCASE),
    getRandomChar(NUMBERS),
  ];

  // 填充剩余
  for (let i = chars.length; i < length; i++) {
    chars.push(getRandomChar(allChars));
  }

  // 打乱
  const shuffled = shuffleArray(chars);

  // 修复连续相同字符
  for (let i = 0; i < shuffled.length - 2; i++) {
    if (shuffled[i] === shuffled[i + 1] && shuffled[i] === shuffled[i + 2]) {
      // 找一个不同的字符替换
      let newChar: string;
      do {
        newChar = getRandomChar(allChars);
      } while (newChar === shuffled[i]);
      shuffled[i + 2] = newChar;
    }
  }

  return shuffled.join('');
}

// 密码生成器组件
export default function PasswordGenerator() {
  const [messageApi, contextHolder] = message.useMessage();
  const [length, setLength] = useState<number>(16);
  const [includeSpecial, setIncludeSpecial] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(true);

  // 生成密码
  const handleGenerate = useCallback(() => {
    const newPassword = generatePassword(length, includeSpecial);
    setPassword(newPassword);
    setShowPassword(true);
  }, [length, includeSpecial]);

  // 复制到剪贴板
  const copyToClipboard = useCallback(() => {
    if (!password) {
      messageApi.warning('请先生成密码');
      return;
    }
    navigator.clipboard.writeText(password);
    messageApi.success('密码已复制到剪贴板');
  }, [password, messageApi]);

  // 清除密码
  const handleClear = useCallback(() => {
    setPassword('');
    messageApi.success('已清除');
  }, [messageApi]);

  // 切换密码显示/隐藏
  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className={styles.container}>
      {contextHolder}

      {/* 密码长度设置 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          密码长度：<span className={styles.lengthValue}>{length}</span> 位
        </h4>
        <Slider
          min={6}
          max={64}
          value={length}
          onChange={setLength}
          tooltip={{ formatter: (value) => `${value} 位` }}
        />
      </div>

      {/* 选项设置 */}
      <div className={styles.section}>
        <Checkbox
          checked={includeSpecial}
          onChange={(e) => setIncludeSpecial(e.target.checked)}
        >
          包含特殊字符（{SPECIAL}）
        </Checkbox>
      </div>

      {/* 操作按钮 */}
      <div className={styles.buttonGroup}>
        <button className={styles.btn} onClick={handleGenerate}>
          生成密码
        </button>
        <button className={styles.btnSecondary} onClick={handleClear}>
          清空
        </button>
      </div>

      {/* 密码显示区域 */}
      {password && (
        <div className={styles.resultSection}>
          <h4 className={styles.sectionTitle}>生成的密码</h4>
          <div className={styles.resultRow}>
            <input
              className={styles.resultInput}
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
            />
            <button
              className={styles.toggleBtn}
              onClick={toggleShowPassword}
              title={showPassword ? '隐藏密码' : '显示密码'}
            >
              {showPassword ? '隐藏' : '显示'}
            </button>
            <button className={styles.copyBtn} onClick={copyToClipboard}>
              复制
            </button>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className={styles.tips}>
        <h4>使用说明</h4>
        <ul>
          <li>密码长度范围：6-64 位</li>
          <li>必须包含至少 1 个大写字母、1 个小写字母、1 个数字</li>
          <li>不包含空格，禁止连续 3 个及以上相同字符</li>
          <li>可选择是否包含特殊字符以增强安全性</li>
        </ul>
      </div>
    </div>
  );
}
