import { useRef, useState, useCallback, useEffect } from 'react';
import { Tooltip } from 'antd';
import RobotAvatar from './RobotAvatar';
import SpeechBubble from './SpeechBubble';
import { useMouseTracker } from './hooks/useMouseTracker';
import { useDraggable } from './hooks/useDraggable';
import { useRandomMessage } from './hooks/useRandomMessage';
import { usePetLevel } from './hooks/usePetLevel';
import styles from './DesktopPet.module.css';

/**
 * AI 桌宠组件
 * 可爱的 AI 助手机器人，支持眼睛追踪、拖拽、点击互动和气泡对话
 */
export default function DesktopPet() {
  const containerRef = useRef<HTMLDivElement>(null);
  // 存储所有定时器，用于组件卸载时清理
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // 眼睛追踪鼠标
  const eyeOffset = useMouseTracker(containerRef);

  // 拖拽功能
  const { position, isDragging, handleMouseDown } = useDraggable({
    elementWidth: 80,
    elementHeight: 120, // 增加高度以容纳等级显示
  });

  // 对话气泡
  const { currentMessage, isVisible, triggerMessage } = useRandomMessage();

  // 等级系统
  const { level, progress, addExp } = usePetLevel();

  // 点击动画状态
  const [isClicked, setIsClicked] = useState(false);

  // 经验漂浮动画
  const [expFloats, setExpFloats] = useState<number[]>([]);
  const floatIdRef = useRef(0);

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
    };
  }, []);

  // 显示经验漂浮
  const showExpFloat = useCallback(() => {
    const id = floatIdRef.current++;
    setExpFloats((prev) => [...prev, id]);
    // 动画结束后移除
    const timer = setTimeout(() => {
      setExpFloats((prev) => prev.filter((fid) => fid !== id));
      timersRef.current.delete(timer);
    }, 1000);
    timersRef.current.add(timer);
  }, []);

  // 点击处理
  const handleClick = useCallback(() => {
    // 触发点击动画
    setIsClicked(true);
    const timer = setTimeout(() => {
      setIsClicked(false);
      timersRef.current.delete(timer);
    }, 300);
    timersRef.current.add(timer);

    // 增加经验值
    addExp();

    // 显示经验漂浮
    showExpFloat();

    // 显示对话
    triggerMessage();
  }, [triggerMessage, addExp, showExpFloat]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
      data-res-type="0-7"
    >
      {/* 经验漂浮动画 */}
      {expFloats.map((id) => (
        <span key={id} className={styles.expFloat}>
          经验+1
        </span>
      ))}

      {/* 气泡对话 */}
      <SpeechBubble message={currentMessage} isVisible={isVisible} />

      {/* 机器人本体 */}
      <Tooltip title={`V${level} | 点击互动升级`} placement="left">
        <div
          className={`${styles.robot} ${isClicked ? styles.clicked : ''} ${!isDragging && !isClicked ? styles.idle : ''}`}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
        >
          <RobotAvatar eyeOffsetX={eyeOffset.x} eyeOffsetY={eyeOffset.y} isClicked={isClicked} />
        </div>
      </Tooltip>

      {/* 等级显示 */}
      <div className={styles.levelContainer}>
        <span className={styles.levelText}>V{level}</span>
        <div className={styles.expBar}>
          <div className={styles.expFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
