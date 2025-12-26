import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './ImageToIco.module.css';

// ICO 尺寸配置
const ICO_SIZES = [
  { size: 16, label: '16×16', description: '浏览器标签图标' },
  { size: 32, label: '32×32', description: '标准图标' },
  { size: 48, label: '48×48', description: 'Windows 图标' },
  { size: 64, label: '64×64', description: '大图标' },
  { size: 128, label: '128×128', description: '高清图标' },
  { size: 256, label: '256×256', description: '超高清图标' },
];

// 支持的图片格式
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
const ACCEPT_STRING = '.jpg,.jpeg,.png,.gif,.webp,.bmp';

// 格式化文件大小（纯函数，移到组件外部）
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// 图片转 ICO 工具组件
export default function ImageToIco() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 组件卸载时清理预览 URL，防止内存泄漏
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // 处理文件上传
  const handleFileChange = useCallback((file: File) => {
    setError('');
    setSuccess(false);

    // 验证文件类型
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError('不支持的图片格式，请上传 jpg、png、gif、webp 或 bmp 格式的图片');
      return;
    }

    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('图片文件过大，请上传 10MB 以内的图片');
      return;
    }

    // 清理之前的预览 URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // 创建预览 URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);

    // 获取图片尺寸
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = previewUrl;
  }, [imagePreview]);

  // 处理文件输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  // 处理拖拽
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  // 切换尺寸选择
  const toggleSize = useCallback((size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  }, []);

  // 全选
  const selectAll = useCallback(() => {
    setSelectedSizes(ICO_SIZES.map(item => item.size));
  }, []);

  // 清空选择
  const clearAll = useCallback(() => {
    setSelectedSizes([]);
  }, []);

  // 加载图片（只加载一次）
  const loadImage = useCallback((file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const imgUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(imgUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(imgUrl);
        reject(new Error('图片加载失败'));
      };
      img.src = imgUrl;
    });
  }, []);

  // 将已加载的图片缩放到指定尺寸并返回 PNG 数据
  const resizeImageToPng = useCallback((img: HTMLImageElement, targetSize: number): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      // 创建 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }

      // 清除画布（透明背景）
      ctx.clearRect(0, 0, targetSize, targetSize);

      // 计算缩放比例，保持宽高比并居中
      const scale = Math.min(targetSize / img.width, targetSize / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (targetSize - scaledWidth) / 2;
      const offsetY = (targetSize - scaledHeight) / 2;

      // 启用图像平滑
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 绘制缩放后的图片
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      // 获取 PNG 数据
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('无法生成图片数据'));
          return;
        }
        blob.arrayBuffer().then(buffer => {
          resolve(new Uint8Array(buffer));
        });
      }, 'image/png');
    });
  }, []);

  // 生成 ICO 文件
  const generateIco = useCallback(async (): Promise<Blob> => {
    if (!imageFile || selectedSizes.length === 0) {
      throw new Error('请先上传图片并选择尺寸');
    }

    // 只加载一次图片，复用于所有尺寸
    const img = await loadImage(imageFile);

    // 生成各尺寸的 PNG 数据
    const pngDataArray: Uint8Array[] = [];
    for (const size of selectedSizes) {
      const data = await resizeImageToPng(img, size);
      pngDataArray.push(data);
    }

    // 计算文件总大小
    const headerSize = 6; // ICONDIR
    const entrySize = 16 * selectedSizes.length; // ICONDIRENTRY 数组
    const imageDataSize = pngDataArray.reduce((sum, data) => sum + data.length, 0);
    const totalSize = headerSize + entrySize + imageDataSize;

    // 创建 ArrayBuffer
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    // 写入 ICONDIR
    view.setUint16(0, 0, true);                    // 保留字段
    view.setUint16(2, 1, true);                    // 类型: 1 = ICO
    view.setUint16(4, selectedSizes.length, true); // 图像数量

    // 写入 ICONDIRENTRY 数组
    let dataOffset = headerSize + entrySize;
    let entryOffset = 6;

    for (let i = 0; i < selectedSizes.length; i++) {
      const size = selectedSizes[i];
      const pngData = pngDataArray[i];

      // 宽度和高度 (256 用 0 表示)
      view.setUint8(entryOffset, size === 256 ? 0 : size);      // 宽度
      view.setUint8(entryOffset + 1, size === 256 ? 0 : size);  // 高度
      view.setUint8(entryOffset + 2, 0);                        // 调色板颜色数
      view.setUint8(entryOffset + 3, 0);                        // 保留字段
      view.setUint16(entryOffset + 4, 1, true);                 // 颜色平面数
      view.setUint16(entryOffset + 6, 32, true);                // 每像素位数
      view.setUint32(entryOffset + 8, pngData.length, true);    // 图像数据大小
      view.setUint32(entryOffset + 12, dataOffset, true);       // 图像数据偏移

      entryOffset += 16;
      dataOffset += pngData.length;
    }

    // 写入 PNG 图像数据
    let writeOffset = headerSize + entrySize;
    const uint8Array = new Uint8Array(buffer);

    for (const pngData of pngDataArray) {
      uint8Array.set(pngData, writeOffset);
      writeOffset += pngData.length;
    }

    // 返回 Blob
    return new Blob([buffer], { type: 'image/x-icon' });
  }, [imageFile, selectedSizes, loadImage, resizeImageToPng]);

  // 下载 ICO 文件
  const handleDownload = async () => {
    if (selectedSizes.length === 0) {
      setError('请至少选择一个尺寸');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const icoBlob = await generateIco();

      // 创建下载链接
      const url = URL.createObjectURL(icoBlob);
      const link = document.createElement('a');
      link.href = url;

      // 生成文件名
      const originalName = imageFile?.name.replace(/\.[^/.]+$/, '') || 'favicon';
      link.download = `${originalName}.ico`;

      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 释放 URL
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成 ICO 失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置
  const handleReset = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    setImageDimensions(null);
    setSelectedSizes([16]);
    setError('');
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {/* 上传区域 */}
      <div
        className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${imageFile ? styles.hasImage : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !imageFile && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_STRING}
          onChange={handleInputChange}
          className={styles.fileInput}
        />
        {!imageFile ? (
          <div className={styles.uploadHint}>
            <div className={styles.uploadIcon}>📁</div>
            <div className={styles.uploadText}>拖拽图片到此处或点击上传</div>
            <div className={styles.uploadFormats}>支持 jpg、png、gif、webp、bmp 格式</div>
          </div>
        ) : (
          <div className={styles.previewContainer}>
            <img src={imagePreview} alt="预览" className={styles.previewImage} />
          </div>
        )}
      </div>

      {/* 图片信息、尺寸选择、尺寸预览 */}
      {imageFile && (
        <div className={styles.settingsArea}>
          {/* 图片信息 */}
          <div className={styles.imageInfo}>
            <h4 className={styles.sectionTitle}>图片信息</h4>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>文件名：</span>
              <span className={styles.infoValue}>{imageFile.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>尺寸：</span>
              <span className={styles.infoValue}>
                {imageDimensions ? `${imageDimensions.width} × ${imageDimensions.height}` : '加载中...'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>大小：</span>
              <span className={styles.infoValue}>{formatFileSize(imageFile.size)}</span>
            </div>
          </div>

          {/* 尺寸选择 */}
          <div className={styles.sizesPanel}>
            <h4 className={styles.sectionTitle}>
              ICO 尺寸选择
              <span className={styles.sizeActions}>
                <button type="button" className={styles.textBtn} onClick={selectAll}>全选</button>
                <button type="button" className={styles.textBtn} onClick={clearAll}>清空</button>
              </span>
            </h4>
            <div className={styles.sizeList}>
              {ICO_SIZES.map(item => (
                <label key={item.size} className={styles.sizeItem}>
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(item.size)}
                    onChange={() => toggleSize(item.size)}
                    className={styles.checkbox}
                  />
                  <span className={styles.sizeLabel}>{item.label}</span>
                  <span className={styles.sizeDesc}>{item.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 尺寸预览 */}
          <div className={styles.sizePreview}>
            <h4 className={styles.sectionTitle}>尺寸预览</h4>
            {selectedSizes.length > 0 ? (
              <div className={styles.previewGrid}>
                {selectedSizes.map(size => (
                  <div key={size} className={styles.previewItem}>
                    <img
                      src={imagePreview}
                      alt={`${size}×${size}`}
                      className={styles.generatedImage}
                      style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                    />
                    <span className={styles.previewSize}>{size}×{size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.previewEmpty}>请选择尺寸</div>
            )}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && <div className={styles.error}>{error}</div>}

      {/* 成功提示 */}
      {success && <div className={styles.success}>ICO 文件已生成并开始下载</div>}

      {/* 操作按钮 */}
      {imageFile && (
        <div className={styles.actions}>
          <button
            className={styles.btn}
            onClick={handleDownload}
            disabled={loading || selectedSizes.length === 0}
          >
            {loading ? '生成中...' : '生成并下载 ICO'}
          </button>
          <button className={styles.btnSecondary} onClick={handleReset}>
            重新选择
          </button>
        </div>
      )}

      {/* 使用说明 */}
      <div className={styles.tips}>
        <h4>使用说明</h4>
        <ul>
          <li>支持 jpg、png、gif、webp、bmp 格式图片</li>
          <li>可同时生成多种尺寸，打包到一个 ICO 文件中</li>
          <li>非正方形图片会自动居中缩放，短边补透明背景</li>
          <li>16×16 和 32×32 是最常用的 favicon 尺寸</li>
          <li>纯前端处理，图片不会上传到服务器</li>
        </ul>
      </div>
    </div>
  );
}
