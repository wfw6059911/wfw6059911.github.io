import { useState, useEffect, useRef, useCallback } from 'react';
import { ReloadOutlined, CaretRightOutlined, PauseOutlined, CloseOutlined, PictureOutlined } from '@ant-design/icons';
import styles from './WoodenFish.module.css';

// 重置动画的工具函数
const resetAnimation = (element: HTMLElement | null, animationClass: string) => {
  if (!element) return;
  element.classList.remove(animationClass);
  // 强制回流以重置动画
  void element.offsetWidth;
  element.classList.add(animationClass);
};

// 背景图片列表
const BG_IMAGES = [
  'https://img.3d66.com/new-admin/sys/yt/img/1.jpg',
  'https://img.3d66.com/new-admin/sys/yt/img2/2.jpg',
  'https://img.3d66.com/new-admin/sys/yt/img2/3.jpg',
  'https://img.3d66.com/new-admin/sys/yt/img2/4.jpg',
  'https://img.3d66.com/new-admin/sys/yt/img2/5.jpg',
];
// 锤子图片
const STICK_IMAGE = 'https://img.3d66.com/new-admin/sys/yt/img/4-2.webp';
// 广告图片
const AD_IMAGE = 'https://imgo.3d66.com/www/new-admin/sys/yt/img/693bc5dad5b8e.png!type-change-p';

// 木鱼皮肤列表
const FISH_SKINS = [
  'https://img.3d66.com/new-admin/sys/yt/img/4-1.webp', // 默认木鱼
  'https://imgo.3d66.com/www/new-admin/sys/yt/img/693b870bdb36e.png!type-change-p', // 皮肤1
  'https://imgo.3d66.com/www/new-admin/sys/yt/img/693b873c16a66.png!type-change-p', // 皮肤2
  'https://img_test.3d66.com/new-admin/sys/yt/img3/6.png', // 皮肤3
];

// 功德+1 漂浮文案
interface FloatingText {
  id: number;
  x: number;
}

// 获取当天日期字符串
const getTodayKey = () => {
  const today = new Date();
  return `woodenFish_closed_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// 检查 DailyImagePopup 今天是否已关闭
const isDailyPopupClosedToday = (): boolean => {
  try {
    const closedDate = localStorage.getItem('dailyImagePopup_closedDate');
    return closedDate === new Date().toDateString();
  } catch {
    return true; // 出错时默认已关闭，允许 WoodenFish 显示
  }
};

// 自定义事件名
export const WOODEN_FISH_OPEN_EVENT = 'woodenFishOpen';

interface WoodenFishProps {
  hideEntry?: boolean; // 是否隐藏入口（广告图）
}

// 敲木鱼组件
export default function WoodenFish({ hideEntry = false }: WoodenFishProps) {
  const [count, setCount] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [showAd, setShowAd] = useState(false); // 是否显示广告图
  const [modalOpen, setModalOpen] = useState(false); // 弹窗是否打开
  const [skinIndex, setSkinIndex] = useState(0);
  const [bgImage, setBgImage] = useState(BG_IMAGES[0]); // 当前背景图
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const textIdRef = useRef(0);
  const fishRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 随机选择背景图
    const randomIndex = Math.floor(Math.random() * BG_IMAGES.length);
    setBgImage(BG_IMAGES[randomIndex]);

    // 读取保存的计数和皮肤
    try {
      const savedCount = localStorage.getItem('woodenFish_count');
      if (savedCount) {
        setCount(parseInt(savedCount, 10));
      }
      const savedSkin = localStorage.getItem('woodenFish_skin');
      if (savedSkin) {
        const index = parseInt(savedSkin, 10);
        if (index >= 0 && index < FISH_SKINS.length) {
          setSkinIndex(index);
        }
      }
    } catch {
      // 忽略 localStorage 读取错误
    }

    // 弹窗显示逻辑
    const todayKey = getTodayKey();
    let isClosed = false;
    try {
      isClosed = localStorage.getItem(todayKey) === 'true';
    } catch {
      // 忽略错误
    }

    if (isClosed) {
      // 今天已关闭过，显示广告图
      setShowAd(true);
      return undefined;
    }

    // 今天未关闭过，检查 DailyImagePopup 状态
    if (isDailyPopupClosedToday()) {
      // DailyImagePopup 今天已关闭，直接打开木鱼弹窗
      setModalOpen(true);
      return undefined;
    }

    // DailyImagePopup 尚未关闭，等待其关闭事件
    const handleDailyPopupClosed = () => {
      setModalOpen(true);
    };
    window.addEventListener('dailyPopup:closed', handleDailyPopupClosed, { once: true });

    // 清理函数
    return () => {
      window.removeEventListener('dailyPopup:closed', handleDailyPopupClosed);
    };
  }, []);

  // 监听外部触发打开弹窗的事件
  useEffect(() => {
    const handleOpenEvent = () => {
      setModalOpen(true);
    };
    window.addEventListener(WOODEN_FISH_OPEN_EVENT, handleOpenEvent);
    return () => {
      window.removeEventListener(WOODEN_FISH_OPEN_EVENT, handleOpenEvent);
    };
  }, []);

  // 保存计数
  useEffect(() => {
    try {
      localStorage.setItem('woodenFish_count', String(count));
    } catch {
      // 忽略 localStorage 写入错误
    }
  }, [count]);

  // 敲击木鱼
  const knock = useCallback(() => {
    setCount(prev => prev + 1);
    // 通过重置动画类来触发动画，避免使用 key 导致图片闪烁
    resetAnimation(stickRef.current, styles.stickKnock);
    resetAnimation(fishRef.current, styles.fishKnock);

    // 添加漂浮文字
    const newText: FloatingText = {
      id: textIdRef.current++,
      x: Math.random() * 40 - 20,
    };
    setFloatingTexts(prev => [...prev, newText]);

    // 移除漂浮文字
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 1500);
  }, []);

  // 自动敲击
  useEffect(() => {
    if (isAuto) {
      autoIntervalRef.current = setInterval(knock, 800);
    } else {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    }
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [isAuto, knock]);

  // 重置计数
  const handleReset = () => {
    setCount(0);
    setIsAuto(false);
  };

  // 切换自动模式
  const toggleAuto = () => {
    setIsAuto(prev => !prev);
  };

  // 关闭弹窗，显示广告图
  const handleClose = () => {
    try {
      const todayKey = getTodayKey();
      localStorage.setItem(todayKey, 'true');
    } catch {
      // 忽略 localStorage 写入错误
    }
    setModalOpen(false);
    setShowAd(true);
    setIsAuto(false);
  };

  // 点击广告图，打开弹窗
  const handleAdClick = () => {
    setModalOpen(true);
  };

  // 随机切换背景图
  const changeBg = () => {
    const randomIndex = Math.floor(Math.random() * BG_IMAGES.length);
    setBgImage(BG_IMAGES[randomIndex]);
  };

  // 切换皮肤
  const changeSkin = (index: number) => {
    setSkinIndex(index);
    try {
      localStorage.setItem('woodenFish_skin', String(index));
    } catch {
      // 忽略 localStorage 写入错误
    }
  };

  return (
    <div data-res-type="1-1">
      {/* 广告图 - 右下角（hideEntry 时隐藏入口） */}
      {!hideEntry && showAd && !modalOpen && (
        <div className={styles.adContainer} onClick={handleAdClick}>
          <img src={AD_IMAGE} alt="敲木鱼" className={styles.adImage} />
        </div>
      )}

      {/* 弹窗 */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {/* 背景图 */}
            <div
              className={styles.background}
              style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* 关闭按钮 */}
            <button className={styles.closeBtn} onClick={handleClose} aria-label="关闭">
              <CloseOutlined />
            </button>

            {/* 主要内容 */}
            <div className={styles.content}>
              {/* 标题 */}
              <div className={styles.title}>木鱼敲敲 烦恼消消</div>

              {/* 木鱼区域 */}
              <div className={styles.fishArea} onClick={knock}>
                {/* 漂浮文字 */}
                {floatingTexts.map(text => (
                  <div
                    key={text.id}
                    className={styles.floatingText}
                    style={{ left: `calc(50% + ${text.x}px)` }}
                  >
                    功德+1
                  </div>
                ))}

                {/* 敲击棒 */}
                <div ref={stickRef} className={styles.stick}>
                  <img src={STICK_IMAGE} alt="敲击棒" />
                </div>

                {/* 木鱼 */}
                <div ref={fishRef} className={styles.fish}>
                  <img src={FISH_SKINS[skinIndex]} alt="木鱼" />
                </div>
              </div>

              {/* 控制区 */}
              <div className={styles.controls}>
                <button className={styles.controlBtn} onClick={handleReset} title="重置">
                  <ReloadOutlined />
                </button>
                <button className={styles.controlBtn} onClick={changeBg} title="切换背景">
                  <PictureOutlined />
                </button>
                <span className={styles.count}>{count}</span>
                <button
                  className={`${styles.controlBtn} ${isAuto ? styles.active : ''}`}
                  onClick={toggleAuto}
                  title={isAuto ? '停止' : '自动'}
                >
                  {isAuto ? <PauseOutlined /> : <CaretRightOutlined />}
                </button>
              </div>

              {/* 皮肤选择器 */}
              <div className={styles.skinSelector}>
                {FISH_SKINS.map((skin, index) => (
                  <button
                    key={skin}
                    className={`${styles.skinBtn} ${skinIndex === index ? styles.skinActive : ''}`}
                    onClick={() => changeSkin(index)}
                    title={`皮肤${index + 1}`}
                  >
                    <img src={skin} alt={`皮肤${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
