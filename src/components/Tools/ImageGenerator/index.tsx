import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import styles from './ImageGenerator.module.css';

// 图片格式类型
type ImageFormat = 'png' | 'jpeg' | 'webp';
type TextAlign = 'left' | 'center' | 'right';
type TextBaseline = 'top' | 'middle' | 'bottom';

// 绘制圆角矩形路径（提取到组件外部避免重复创建）
const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// 创建棋盘格图案（缓存复用）
let checkerboardPattern: CanvasPattern | null = null;
const getCheckerboardPattern = (ctx: CanvasRenderingContext2D): CanvasPattern | null => {
  if (checkerboardPattern) return checkerboardPattern;

  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 20;
  patternCanvas.height = 20;
  const patternCtx = patternCanvas.getContext('2d');
  if (!patternCtx) return null;

  patternCtx.fillStyle = '#ffffff';
  patternCtx.fillRect(0, 0, 20, 20);
  patternCtx.fillStyle = '#e0e0e0';
  patternCtx.fillRect(0, 0, 10, 10);
  patternCtx.fillRect(10, 10, 10, 10);

  checkerboardPattern = ctx.createPattern(patternCanvas, 'repeat');
  return checkerboardPattern;
};

// 预设尺寸配置
const PRESET_SIZES = [
  { label: '头像', width: 200, height: 200, description: '社交媒体头像' },
  { label: '缩略图', width: 150, height: 150, description: '列表缩略图' },
  { label: '横幅', width: 1200, height: 400, description: '网站横幅' },
  { label: '封面', width: 1200, height: 630, description: 'Open Graph 图片' },
  { label: '手机壁纸', width: 1080, height: 1920, description: '竖屏壁纸' },
  { label: '桌面壁纸', width: 1920, height: 1080, description: '16:9 壁纸' },
  { label: '文章封面', width: 800, height: 450, description: '博客文章封面' },
];

// 格式选项
const FORMAT_OPTIONS: { label: string; value: ImageFormat; supportQuality: boolean }[] = [
  { label: 'PNG', value: 'png', supportQuality: false },
  { label: 'JPEG', value: 'jpeg', supportQuality: true },
  { label: 'WebP', value: 'webp', supportQuality: true },
];

// 预设颜色
const PRESET_COLORS = [
  'transparent',
  '#ffffff',
  '#f5f5f5',
  '#e0e0e0',
  '#333333',
  '#000000',
  '#ff4d4f',
  '#ff7a45',
  '#ffc53d',
  '#73d13d',
  '#40a9ff',
  '#9254de',
  '#f759ab',
  '#667eea',
];

// 字体选项
const FONT_FAMILIES = [
  { label: '默认', value: 'sans-serif' },
  { label: '宋体', value: 'SimSun, serif' },
  { label: '黑体', value: 'SimHei, sans-serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", sans-serif' },
  { label: '等宽字体', value: 'monospace' },
  { label: 'Arial', value: 'Arial, sans-serif' },
];

// 图片生成器工具组件
export default function ImageGenerator() {
  // 尺寸
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // 格式
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState<number>(90);

  // 背景
  const [backgroundColor, setBackgroundColor] = useState<string>('#f0f0f0');

  // 圆角
  const [borderRadius, setBorderRadius] = useState<number>(0);

  // 文字
  const [text, setText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('#333333');
  const [fontSize, setFontSize] = useState<number>(48);
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const [textBaseline, setTextBaseline] = useState<TextBaseline>('middle');

  // 状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 处理预设尺寸选择
  const handlePresetSelect = useCallback((preset: typeof PRESET_SIZES[0]) => {
    setSelectedPreset(preset.label);
    setWidth(preset.width);
    setHeight(preset.height);
  }, []);

  // 处理宽度变化
  const handleWidthChange = useCallback((value: number) => {
    const clampedValue = Math.min(4096, Math.max(1, value || 1));
    setWidth(clampedValue);
    setSelectedPreset('');
  }, []);

  // 处理高度变化
  const handleHeightChange = useCallback((value: number) => {
    const clampedValue = Math.min(4096, Math.max(1, value || 1));
    setHeight(clampedValue);
    setSelectedPreset('');
  }, []);

  // 处理格式变化
  const handleFormatChange = useCallback((newFormat: ImageFormat) => {
    setFormat(newFormat);
    // 如果切换到非 PNG 格式且当前是透明背景，自动切换为白色
    if (newFormat !== 'png' && backgroundColor === 'transparent') {
      setBackgroundColor('#ffffff');
    }
  }, [backgroundColor]);

  // 处理背景颜色变化
  const handleBackgroundChange = useCallback((color: string) => {
    // 如果选择透明背景但格式不是 PNG，提示并切换格式
    if (color === 'transparent' && format !== 'png') {
      setFormat('png');
    }
    setBackgroundColor(color);
  }, [format]);

  // 使用 useMemo 缓存文字行数组，避免重复计算
  const allLines = useMemo(() => {
    const sizeText = `${width} × ${height}`;
    const textLines = text.trim() ? text.split('\n') : [];
    return [sizeText, ...textLines];
  }, [width, height, text]);

  // 绘制画布
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸（使用固定预览尺寸，保持比例）
    const maxPreviewSize = 400;
    const scale = Math.min(maxPreviewSize / width, maxPreviewSize / height, 1);
    const previewWidth = Math.round(width * scale);
    const previewHeight = Math.round(height * scale);
    const scaledRadius = Math.round(borderRadius * scale);

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // 清除画布
    ctx.clearRect(0, 0, previewWidth, previewHeight);

    // 应用圆角裁剪
    if (scaledRadius > 0) {
      drawRoundRect(ctx, 0, 0, previewWidth, previewHeight, scaledRadius);
      ctx.clip();
    }

    // 绘制背景
    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, previewWidth, previewHeight);
    } else {
      // 使用缓存的棋盘格图案（性能优化）
      const pattern = getCheckerboardPattern(ctx);
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, previewWidth, previewHeight);
      }
    }

    // 计算缩放后的字体大小
    const scaledFontSize = Math.round(fontSize * scale);

    // 绘制所有内容
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';

    // 计算文字位置
    let x = previewWidth / 2;
    if (textAlign === 'left') x = 20 * scale;
    if (textAlign === 'right') x = previewWidth - 20 * scale;

    const lineHeight = scaledFontSize * 1.4;
    const totalHeight = allLines.length * lineHeight;

    let startY: number;
    if (textBaseline === 'top') {
      startY = 20 * scale + scaledFontSize / 2;
    } else if (textBaseline === 'bottom') {
      startY = previewHeight - totalHeight - 20 * scale + lineHeight / 2;
    } else {
      startY = (previewHeight - totalHeight) / 2 + lineHeight / 2;
    }

    // 统一使用文字颜色绘制所有内容
    ctx.fillStyle = textColor;
    ctx.font = `${scaledFontSize}px ${fontFamily}`;

    allLines.forEach((line, index) => {
      ctx.fillText(line, x, startY + index * lineHeight);
    });
  }, [width, height, backgroundColor, borderRadius, allLines, textColor, fontSize, fontFamily, textAlign, textBaseline]);

  // 监听参数变化，实时重绘
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // 生成并下载图片
  const handleDownload = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 创建实际尺寸的 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('无法创建 Canvas 上下文');
      }

      // 清除画布
      ctx.clearRect(0, 0, width, height);

      // 应用圆角裁剪
      if (borderRadius > 0) {
        drawRoundRect(ctx, 0, 0, width, height, borderRadius);
        ctx.clip();
      }

      // 绘制背景
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // 绘制所有内容（使用已缓存的 allLines）
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';

      let x = width / 2;
      if (textAlign === 'left') x = 20;
      if (textAlign === 'right') x = width - 20;

      const lineHeight = fontSize * 1.4;
      const totalHeight = allLines.length * lineHeight;

      let startY: number;
      if (textBaseline === 'top') {
        startY = 20 + fontSize / 2;
      } else if (textBaseline === 'bottom') {
        startY = height - totalHeight - 20 + lineHeight / 2;
      } else {
        startY = (height - totalHeight) / 2 + lineHeight / 2;
      }

      // 统一使用文字颜色绘制所有内容
      ctx.fillStyle = textColor;
      ctx.font = `${fontSize}px ${fontFamily}`;

      allLines.forEach((line, index) => {
        ctx.fillText(line, x, startY + index * lineHeight);
      });

      // 生成图片
      const mimeType = `image/${format}`;
      const qualityValue = format === 'png' ? undefined : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('图片生成失败');
            setLoading(false);
            return;
          }

          // 创建下载链接
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          // 生成文件名
          const timestamp = new Date().toISOString().slice(0, 10);
          const ext = format === 'jpeg' ? 'jpg' : format;
          link.download = `image_${width}x${height}_${timestamp}.${ext}`;

          // 触发下载
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 释放 URL
          URL.revokeObjectURL(url);

          setSuccess(true);
          setLoading(false);
        },
        mimeType,
        qualityValue
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成图片失败');
      setLoading(false);
    }
  }, [width, height, backgroundColor, borderRadius, allLines, textColor, fontSize, fontFamily, textAlign, textBaseline, format, quality]);

  // 重置
  const handleReset = useCallback(() => {
    setWidth(800);
    setHeight(600);
    setSelectedPreset('');
    setFormat('png');
    setQuality(90);
    setBackgroundColor('#f0f0f0');
    setBorderRadius(0);
    setText('');
    setTextColor('#333333');
    setFontSize(48);
    setFontFamily('sans-serif');
    setTextAlign('center');
    setTextBaseline('middle');
    setError('');
    setSuccess(false);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* 设置面板 */}
        <div className={styles.settingsPanel}>
          {/* 尺寸设置 */}
          <div className={styles.settingSection}>
            <h4 className={styles.sectionTitle}>尺寸设置</h4>
            <div className={styles.presetSizes}>
              {PRESET_SIZES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`${styles.presetBtn} ${selectedPreset === preset.label ? styles.active : ''}`}
                  onClick={() => handlePresetSelect(preset)}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className={styles.sizeInputs}>
              <div className={styles.inputGroup}>
                <label>宽度</label>
                <input
                  type="number"
                  min={1}
                  max={4096}
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className={styles.numberInput}
                />
                <span className={styles.unit}>px</span>
              </div>
              <span className={styles.sizeX}>×</span>
              <div className={styles.inputGroup}>
                <label>高度</label>
                <input
                  type="number"
                  min={1}
                  max={4096}
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className={styles.numberInput}
                />
                <span className={styles.unit}>px</span>
              </div>
            </div>
          </div>

          {/* 格式设置 */}
          <div className={styles.settingSection}>
            <h4 className={styles.sectionTitle}>输出格式</h4>
            <div className={styles.formatOptions}>
              {FORMAT_OPTIONS.map((opt) => (
                <label key={opt.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="format"
                    value={opt.value}
                    checked={format === opt.value}
                    onChange={() => handleFormatChange(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {format !== 'png' && (
              <div className={styles.qualitySlider}>
                <label>
                  图片质量: <span className={styles.qualityValue}>{quality}%</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            )}
          </div>

          {/* 背景设置 */}
          <div className={styles.settingSection}>
            <h4 className={styles.sectionTitle}>背景颜色</h4>
            <div className={styles.colorPicker}>
              <input
                type="color"
                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                onChange={(e) => handleBackgroundChange(e.target.value)}
                className={styles.colorInput}
                disabled={backgroundColor === 'transparent'}
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => handleBackgroundChange(e.target.value)}
                className={styles.colorTextInput}
                placeholder="#ffffff"
              />
            </div>
            <div className={styles.presetColors}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorSwatch} ${backgroundColor === color ? styles.active : ''} ${color === 'transparent' ? styles.transparent : ''}`}
                  style={{ backgroundColor: color === 'transparent' ? undefined : color }}
                  onClick={() => handleBackgroundChange(color)}
                  title={color === 'transparent' ? '透明 (仅PNG)' : color}
                />
              ))}
            </div>
            {backgroundColor === 'transparent' && format !== 'png' && (
              <div className={styles.warning}>透明背景仅支持 PNG 格式，已自动切换</div>
            )}
            {/* 圆角设置 */}
            <div className={styles.optionRow} style={{ marginTop: 12 }}>
              <label>圆角</label>
              <input
                type="range"
                min={0}
                max={Math.min(width, height) / 2}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.sliderValue}>{borderRadius}px</span>
            </div>
          </div>

          {/* 文字设置 */}
          <div className={styles.settingSection}>
            <h4 className={styles.sectionTitle}>文字设置</h4>
            <textarea
              className={styles.textInput}
              placeholder="输入要显示的文字（支持多行）"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
            <div className={styles.textOptions}>
              <div className={styles.optionRow}>
                <label>文字颜色</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className={styles.colorInput}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className={styles.colorTextInputSmall}
                />
              </div>
              <div className={styles.optionRow}>
                <label>字体大小</label>
                <input
                  type="range"
                  min={12}
                  max={200}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className={styles.slider}
                />
                <span className={styles.sliderValue}>{fontSize}px</span>
              </div>
              <div className={styles.optionRow}>
                <label>字体</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className={styles.select}
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.alignOptions}>
                <div className={styles.alignGroup}>
                  <label>水平</label>
                  <div className={styles.alignBtns}>
                    {(['left', 'center', 'right'] as TextAlign[]).map((align) => (
                      <button
                        key={align}
                        type="button"
                        className={`${styles.alignBtn} ${textAlign === align ? styles.active : ''}`}
                        onClick={() => setTextAlign(align)}
                      >
                        {align === 'left' ? '左' : align === 'center' ? '中' : '右'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.alignGroup}>
                  <label>垂直</label>
                  <div className={styles.alignBtns}>
                    {(['top', 'middle', 'bottom'] as TextBaseline[]).map((baseline) => (
                      <button
                        key={baseline}
                        type="button"
                        className={`${styles.alignBtn} ${textBaseline === baseline ? styles.active : ''}`}
                        onClick={() => setTextBaseline(baseline)}
                      >
                        {baseline === 'top' ? '上' : baseline === 'middle' ? '中' : '下'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 预览区域 */}
        <div className={styles.previewPanel}>
          <h4 className={styles.sectionTitle}>实时预览</h4>
          <div className={styles.canvasWrapper}>
            <canvas ref={canvasRef} className={styles.canvas} />
          </div>
          <div className={styles.previewInfo}>
            <span>
              {width} × {height} px
            </span>
            <span>{format.toUpperCase()}</span>
            {format !== 'png' && <span>质量: {quality}%</span>}
            {borderRadius > 0 && <span>圆角: {borderRadius}px</span>}
          </div>

          {/* 错误提示 */}
          {error && <div className={styles.error}>{error}</div>}

          {/* 成功提示 */}
          {success && <div className={styles.success}>图片已生成并开始下载</div>}

          {/* 操作按钮 */}
          <div className={styles.actions}>
            <button className={styles.btn} onClick={handleDownload} disabled={loading}>
              {loading ? '生成中...' : '生成并下载'}
            </button>
            <button className={styles.btnSecondary} onClick={handleReset}>
              重置
            </button>
          </div>

          {/* 使用说明 */}
          <div className={styles.tips}>
            <h4>使用说明</h4>
            <ul>
              <li>支持自定义图片尺寸，最大 4096×4096 像素</li>
              <li>PNG 格式支持透明背景，适合图标和 Logo</li>
              <li>JPEG/WebP 格式可调节质量，适合照片类图片</li>
              <li>支持自定义背景颜色和文字内容</li>
              <li>纯前端处理，图片不会上传到服务器</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
