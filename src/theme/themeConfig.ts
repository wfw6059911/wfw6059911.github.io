import type { ThemeConfig } from 'antd';

// 浅色主题配置
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#667eea',
    colorLink: '#667eea',
    colorBgLayout: '#f5f7fa',
    colorBgContainer: '#ffffff',
    fontFamily: "'Inter', 'Alibaba PuHuiTi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
    },
    Menu: {
      itemSelectedBg: 'rgba(102, 126, 234, 0.1)',
      itemSelectedColor: '#667eea',
    },
    Card: {
      boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
  },
};

// 深色主题配置
export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#764ba2',
    colorLink: '#a78bfa',
    colorBgLayout: '#0f0f0f',
    colorBgContainer: '#1a1a1a',
    colorText: '#e5e5e5',
    colorTextSecondary: '#a3a3a3',
    fontFamily: "'Inter', 'Alibaba PuHuiTi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
  },
  components: {
    Layout: {
      headerBg: '#1a1a1a',
      headerHeight: 64,
    },
    Menu: {
      itemSelectedBg: 'rgba(118, 75, 162, 0.2)',
      itemSelectedColor: '#a78bfa',
      darkItemBg: '#1a1a1a',
      darkItemColor: '#e5e5e5',
      darkItemSelectedBg: 'rgba(118, 75, 162, 0.2)',
      darkItemSelectedColor: '#a78bfa',
    },
    Card: {
      boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.3)',
    },
  },
};

// 渐变色配置
export const gradientConfig = {
  primary: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
  hero: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
};
