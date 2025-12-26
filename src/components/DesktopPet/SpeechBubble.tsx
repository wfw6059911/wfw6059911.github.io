import styles from './DesktopPet.module.css';

interface SpeechBubbleProps {
  message: {
    text: string;
    emoji: string;
  } | null;
  isVisible: boolean;
}

/**
 * 气泡对话组件
 */
export default function SpeechBubble({ message, isVisible }: SpeechBubbleProps) {
  if (!message || !isVisible) return null;

  return (
    <div className={styles.speechBubble}>
      <span className={styles.bubbleEmoji}>{message.emoji}</span>
      <span className={styles.bubbleText}>{message.text}</span>
      <div className={styles.bubbleTail} />
    </div>
  );
}
