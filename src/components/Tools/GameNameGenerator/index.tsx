import { useState, useCallback } from 'react';
import { message, Radio, InputNumber } from 'antd';
import {
  NAME_DATA,
  STYLE_LABELS,
  GENDER_LABELS,
  SYMBOL_LABELS,
  SYMBOL_DATA,
  type NameStyle,
  type Gender,
  type SymbolStyle,
} from './nameData';
import styles from './GameNameGenerator.module.css';

// 随机获取数组中的一个元素
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 生成单个基础名称
function generateBaseName(
  style: NameStyle,
  gender: Gender,
  length: number
): string {
  const data = NAME_DATA[style][gender];
  const { prefix, middle, suffix } = data;

  // 根据长度组合名称
  switch (length) {
    case 2:
      return getRandomItem(prefix) + getRandomItem(suffix);
    case 3:
      return (
        getRandomItem(prefix) + getRandomItem(middle) + getRandomItem(suffix)
      );
    case 4:
      return (
        getRandomItem(prefix) +
        getRandomItem(middle) +
        getRandomItem(middle) +
        getRandomItem(suffix)
      );
    case 5:
      return (
        getRandomItem(prefix) +
        getRandomItem(middle) +
        getRandomItem(suffix) +
        getRandomItem(middle) +
        getRandomItem(suffix)
      );
    case 6:
      return (
        getRandomItem(prefix) +
        getRandomItem(middle) +
        getRandomItem(middle) +
        getRandomItem(suffix) +
        getRandomItem(middle) +
        getRandomItem(suffix)
      );
    default:
      return (
        getRandomItem(prefix) + getRandomItem(middle) + getRandomItem(suffix)
      );
  }
}

// 添加符号装饰
function addSymbolDecoration(name: string, symbolStyle: SymbolStyle): string {
  if (symbolStyle === 'none') {
    return name;
  }

  const symbolData = SYMBOL_DATA[symbolStyle];

  // 包裹风格使用 wrap 符号
  if (symbolStyle === 'wrap') {
    const [left, right] = getRandomItem(symbolData.wrap);
    return `${left}${name}${right}`;
  }

  // 其他风格随机选择装饰方式：前缀、后缀、或包裹
  const decorationType = Math.floor(Math.random() * 3);

  switch (decorationType) {
    case 0: // 前缀
      return `${getRandomItem(symbolData.prefix)}${name}`;
    case 1: // 后缀
      return `${name}${getRandomItem(symbolData.suffix)}`;
    case 2: // 包裹
      const [left, right] = getRandomItem(symbolData.wrap);
      return `${left}${name}${right}`;
    default:
      return name;
  }
}

// 生成单个名称（含符号装饰）
function generateSingleName(
  style: NameStyle,
  gender: Gender,
  length: number,
  symbolStyle: SymbolStyle
): string {
  const baseName = generateBaseName(style, gender, length);
  return addSymbolDecoration(baseName, symbolStyle);
}

// 批量生成名称（去重）
function generateNames(
  style: NameStyle,
  gender: Gender,
  length: number,
  count: number,
  symbolStyle: SymbolStyle
): string[] {
  const nameSet = new Set<string>();
  const maxAttempts = count * 10; // 防止无限循环
  let attempts = 0;

  while (nameSet.size < count && attempts < maxAttempts) {
    const name = generateSingleName(style, gender, length, symbolStyle);
    nameSet.add(name);
    attempts++;
  }

  return Array.from(nameSet);
}

export default function GameNameGenerator() {
  const [messageApi, contextHolder] = message.useMessage();

  // 配置状态
  const [style, setStyle] = useState<NameStyle>('wuxia');
  const [gender, setGender] = useState<Gender>('male');
  const [nameLength, setNameLength] = useState<number>(4);
  const [count, setCount] = useState<number>(5);
  const [symbolStyle, setSymbolStyle] = useState<SymbolStyle>('none');

  // 结果状态
  const [names, setNames] = useState<string[]>([]);

  // 生成名称
  const handleGenerate = useCallback(() => {
    const newNames = generateNames(
      style,
      gender,
      nameLength,
      count,
      symbolStyle
    );
    setNames(newNames);
    messageApi.success(`已生成 ${newNames.length} 个名称`);
  }, [style, gender, nameLength, count, symbolStyle, messageApi]);

  // 复制单个名称
  const handleCopy = useCallback(
    (name: string) => {
      navigator.clipboard.writeText(name);
      messageApi.success(`已复制: ${name}`);
    },
    [messageApi]
  );

  // 复制全部名称
  const handleCopyAll = useCallback(() => {
    if (names.length === 0) {
      messageApi.warning('请先生成名称');
      return;
    }
    navigator.clipboard.writeText(names.join('\n'));
    messageApi.success('已复制全部名称');
  }, [names, messageApi]);

  // 清空结果
  const handleClear = useCallback(() => {
    setNames([]);
  }, []);

  return (
    <div className={styles.container} data-res-type="3-61">
      {contextHolder}

      {/* 配置区域 */}
      <div className={styles.configSection}>
        {/* 风格选择 */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>名称风格</h4>
          <Radio.Group
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            {(Object.keys(STYLE_LABELS) as NameStyle[]).map((s) => (
              <Radio.Button key={s} value={s}>
                {STYLE_LABELS[s]}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        {/* 性别选择 */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>性别偏好</h4>
          <Radio.Group
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            {(Object.keys(GENDER_LABELS) as Gender[]).map((g) => (
              <Radio.Button key={g} value={g}>
                {GENDER_LABELS[g]}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        {/* 符号装饰 */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>符号装饰</h4>
          <Radio.Group
            value={symbolStyle}
            onChange={(e) => setSymbolStyle(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            {(Object.keys(SYMBOL_LABELS) as SymbolStyle[]).map((s) => (
              <Radio.Button key={s} value={s}>
                {SYMBOL_LABELS[s]}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        {/* 长度和数量配置 */}
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>名称长度（字）</label>
            <InputNumber
              min={2}
              max={6}
              value={nameLength}
              onChange={(value) => setNameLength(value || 4)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>生成数量（个）</label>
            <InputNumber
              min={1}
              max={100}
              value={count}
              onChange={(value) => setCount(value || 5)}
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={styles.buttonGroup}>
          <button className={styles.btn} onClick={handleGenerate}>
            生成名称
          </button>
          <button className={styles.btnSecondary} onClick={handleClear}>
            清空
          </button>
          <button className={styles.btnSecondary} onClick={handleCopyAll}>
            复制全部
          </button>
        </div>
      </div>

      {/* 结果展示区域 */}
      {names.length > 0 && (
        <div className={styles.resultSection}>
          <h4 className={styles.sectionTitle}>
            生成结果 ({names.length} 个)
          </h4>
          <div className={styles.nameGrid}>
            {names.map((name, index) => (
              <div key={index} className={styles.nameCard}>
                <span className={styles.nameText}>{name}</span>
                <button
                  className={styles.copyBtn}
                  onClick={() => handleCopy(name)}
                  title="复制"
                >
                  复制
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className={styles.tips}>
        <h4>使用说明</h4>
        <ul>
          <li>支持 6 种风格：武侠、仙侠、科幻、都市、魔幻、二次元</li>
          <li>支持 6 种符号装饰：藏文、花朵、星星、皇冠、包裹等</li>
          <li>名称长度可配置 2-6 个字</li>
          <li>符号可直接用于王者荣耀、原神等游戏</li>
        </ul>
      </div>
    </div>
  );
}
