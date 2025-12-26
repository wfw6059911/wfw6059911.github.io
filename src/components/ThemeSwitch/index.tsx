import SunOutlined from '@ant-design/icons/SunOutlined';
import MoonOutlined from '@ant-design/icons/MoonOutlined';
import styles from './ThemeSwitch.module.css';

interface ThemeSwitchProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeSwitch({ isDark, onToggle }: ThemeSwitchProps) {
  return (
    <button
      className={`${styles.switch} ${isDark ? styles.switchDark : ''}`}
      onClick={onToggle}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      <span className={`${styles.knob} ${isDark ? styles.knobDark : ''}`}>
        {isDark ? (
          <MoonOutlined className={`${styles.icon} ${styles.moonIcon}`} />
        ) : (
          <SunOutlined className={`${styles.icon} ${styles.sunIcon}`} />
        )}
      </span>
    </button>
  );
}
