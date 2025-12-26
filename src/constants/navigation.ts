// 导航配置

// 主导航菜单项
export const NAV_ITEMS = [
  { key: '/', label: '首页' },
  { key: '/articles', label: '文章集' },
  { key: '/tools', label: '工具集' },
  { key: '/resources', label: '资源视界' },
  {
    key: 'about',
    label: '关于',
    children: [
      { key: '/about', label: '关于我' },
      { key: '/changelog', label: '网站历程' },
    ],
  },
] as const;

// AI 工具入口
export const AI_TOOLS = [
  { key: 'doubao', label: '豆包', url: 'https://www.doubao.com/' },
  { key: 'yuanbao', label: '腾讯元宝', url: 'https://yuanbao.tencent.com/' },
  { key: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
] as const;

// 广告配置
export const AD_CONFIG = {
  key: 'ad',
  url: 'https://www.google.com',
  image: 'https://img.3d66.com/new-admin/sys/yt/img5/google.gif',
  width: 100,
  height: 40,
} as const;

// 类型导出
export type NavItem = (typeof NAV_ITEMS)[number];
export type AiTool = (typeof AI_TOOLS)[number];
