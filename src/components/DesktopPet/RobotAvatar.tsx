interface RobotAvatarProps {
  eyeOffsetX: number; // 眼珠 X 偏移 (-1 到 1)
  eyeOffsetY: number; // 眼珠 Y 偏移 (-1 到 1)
  isClicked: boolean; // 是否处于点击状态
}

/**
 * SVG 机器人形象组件
 * 可爱萌系的 AI 助手机器人
 */
export default function RobotAvatar({ eyeOffsetX, eyeOffsetY, isClicked }: RobotAvatarProps) {
  // 眼珠最大移动范围
  const maxEyeMove = 4;
  const pupilX = eyeOffsetX * maxEyeMove;
  const pupilY = eyeOffsetY * maxEyeMove;

  return (
    <svg width="80" height="100" viewBox="0 0 80 100" style={{ overflow: 'visible' }}>
      <defs>
        {/* 头部渐变 */}
        <linearGradient id="petBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>

        {/* 发光效果 */}
        <filter id="petGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 阴影效果 */}
        <filter id="petShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 天线 */}
      <line x1="40" y1="15" x2="40" y2="5" stroke="url(#petBodyGradient)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="4" r="4" fill="#f093fb" filter="url(#petGlow)">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* 头部 */}
      <ellipse cx="40" cy="42" rx="32" ry="30" fill="url(#petBodyGradient)" filter="url(#petShadow)" />

      {/* 头部高光 */}
      <ellipse cx="30" cy="30" rx="12" ry="8" fill="white" opacity="0.15" />

      {/* 眼眶 */}
      <ellipse cx="28" cy="40" rx="11" ry="13" fill="white" />
      <ellipse cx="52" cy="40" rx="11" ry="13" fill="white" />

      {/* 眼珠 - 根据鼠标位置移动 */}
      <circle cx={28 + pupilX} cy={40 + pupilY} r="6" fill="#333">
        <animate attributeName="r" values="6;5.5;6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={52 + pupilX} cy={40 + pupilY} r="6" fill="#333">
        <animate attributeName="r" values="6;5.5;6" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* 眼睛高光 */}
      <circle cx={26 + pupilX * 0.5} cy={38 + pupilY * 0.5} r="2" fill="white" />
      <circle cx={50 + pupilX * 0.5} cy={38 + pupilY * 0.5} r="2" fill="white" />

      {/* 腮红 */}
      <ellipse cx="12" cy="52" rx="7" ry="4" fill="#ffb6c1" opacity="0.5" />
      <ellipse cx="68" cy="52" rx="7" ry="4" fill="#ffb6c1" opacity="0.5" />

      {/* 嘴巴 - 点击时变成惊讶表情 */}
      {isClicked ? (
        <ellipse cx="40" cy="60" rx="5" ry="6" fill="#ff6b6b" />
      ) : (
        <path d="M 32 58 Q 40 66 48 58" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}

      {/* 身体 */}
      <ellipse cx="40" cy="88" rx="22" ry="14" fill="url(#petBodyGradient)" filter="url(#petShadow)" />

      {/* 身体高光 */}
      <ellipse cx="34" cy="84" rx="8" ry="5" fill="white" opacity="0.1" />

      {/* 呼吸灯 */}
      <circle cx="40" cy="88" r="5" fill="#00ff88" opacity="0.9">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* 呼吸灯外圈 */}
      <circle cx="40" cy="88" r="7" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.3">
        <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />
        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
