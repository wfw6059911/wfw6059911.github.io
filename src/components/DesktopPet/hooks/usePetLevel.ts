import { useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'desktopPet_level';
const MAX_LEVEL = 100;
const AUTO_EXP_INTERVAL = 60000; // 每分钟自动增加经验

interface LevelData {
  level: number;
  exp: number;
}

/**
 * 计算升级所需经验值
 * 每级需要的经验 = 等级 * 10
 */
function getExpToNextLevel(level: number): number {
  return level * 10;
}

/**
 * 桌宠等级 Hook
 * 管理等级和经验值，支持本地存储和自动升级
 */
export function usePetLevel() {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);

  // 使用 ref 存储最新值，避免定时器闭包问题
  const levelRef = useRef(level);
  const expRef = useRef(exp);

  // 同步更新 ref
  useEffect(() => {
    levelRef.current = level;
    expRef.current = exp;
  }, [level, exp]);

  // 从 localStorage 读取等级数据
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: LevelData = JSON.parse(saved);
        const loadedLevel = Math.min(data.level, MAX_LEVEL);
        setLevel(loadedLevel);
        setExp(data.exp);
        levelRef.current = loadedLevel;
        expRef.current = data.exp;
      } catch {
        // 忽略解析错误
      }
    }
  }, []);

  // 保存等级数据到 localStorage
  const saveData = useCallback((newLevel: number, newExp: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ level: newLevel, exp: newExp }));
  }, []);

  // 增加经验值的核心逻辑
  const gainExp = useCallback((currentLevel: number, currentExp: number) => {
    if (currentLevel >= MAX_LEVEL) return { level: currentLevel, exp: currentExp };

    const newExp = currentExp + 1;
    const expNeeded = getExpToNextLevel(currentLevel);

    if (newExp >= expNeeded) {
      // 升级
      const newLevel = Math.min(currentLevel + 1, MAX_LEVEL);
      const remainingExp = newLevel >= MAX_LEVEL ? 0 : newExp - expNeeded;
      return { level: newLevel, exp: remainingExp, levelUp: true };
    } else {
      return { level: currentLevel, exp: newExp, levelUp: false };
    }
  }, []);

  // 增加经验值（点击触发）
  const addExp = useCallback(() => {
    const result = gainExp(levelRef.current, expRef.current);
    setLevel(result.level);
    setExp(result.exp);
    saveData(result.level, result.exp);
    return result.levelUp;
  }, [gainExp, saveData]);

  // 自动增加经验（每分钟 +1）
  useEffect(() => {
    const timer = setInterval(() => {
      const result = gainExp(levelRef.current, expRef.current);
      setLevel(result.level);
      setExp(result.exp);
      saveData(result.level, result.exp);
    }, AUTO_EXP_INTERVAL);

    return () => clearInterval(timer);
  }, [gainExp, saveData]);

  // 计算当前等级进度百分比
  const progress = level >= MAX_LEVEL ? 100 : Math.floor((exp / getExpToNextLevel(level)) * 100);

  return {
    level,
    exp,
    maxLevel: MAX_LEVEL,
    progress,
    expToNext: getExpToNextLevel(level),
    addExp,
    isMaxLevel: level >= MAX_LEVEL,
  };
}
