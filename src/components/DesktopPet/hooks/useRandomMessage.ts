import { useState, useCallback, useEffect, useRef } from 'react';
import { SPEECH_MESSAGES, AUTO_MESSAGE_INTERVAL, BUBBLE_DISPLAY_DURATION } from '../constants';

interface Message {
  text: string;
  emoji: string;
}

/**
 * 随机对话 Hook
 * 管理气泡消息的显示和隐藏
 */
export function useRandomMessage() {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIndexRef = useRef<number>(-1);

  // 显示随机消息（避免连续重复）
  const showRandomMessage = useCallback(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 随机选择消息（避免与上次相同）
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * SPEECH_MESSAGES.length);
    } while (randomIndex === lastIndexRef.current && SPEECH_MESSAGES.length > 1);

    lastIndexRef.current = randomIndex;
    setCurrentMessage(SPEECH_MESSAGES[randomIndex]);
    setIsVisible(true);

    // 自动隐藏
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, BUBBLE_DISPLAY_DURATION);
  }, []);

  // 点击触发消息
  const triggerMessage = useCallback(() => {
    showRandomMessage();
    // 重置自动消息定时器
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current);
    }
    autoTimeoutRef.current = setTimeout(showRandomMessage, AUTO_MESSAGE_INTERVAL);
  }, [showRandomMessage]);

  // 自动定时显示消息
  useEffect(() => {
    // 首次显示延迟 5 秒
    autoTimeoutRef.current = setTimeout(showRandomMessage, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
    };
  }, [showRandomMessage]);

  return {
    currentMessage,
    isVisible,
    triggerMessage,
  };
}
