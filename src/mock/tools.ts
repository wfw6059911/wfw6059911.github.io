import { Tool } from '@/types';

// 渐变色变量池 - 可自定义修改
export const toolGradients: string[] = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  // 紫蓝渐变
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',  // 粉红渐变
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',  // 蓝青渐变
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',  // 绿青渐变
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',  // 粉黄渐变
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',  // 淡紫粉渐变
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',  // 浅粉渐变
  'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',  // 绿黄渐变
  'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',  // 紫白渐变
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',  // 紫蓝淡渐变
  'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',  // 橙红渐变
  'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',  // 主题渐变
];

// 根据工具 ID 获取固定渐变色（保证同一工具颜色不变）
export const getToolGradient = (toolId: string): string => {
  // 使用简单哈希算法，确保同一 ID 返回相同渐变色
  let hash = 0;
  for (let i = 0; i < toolId.length; i++) {
    hash = ((hash << 5) - hash) + toolId.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % toolGradients.length;
  return toolGradients[index];
};

// 工具列表原始数据（仅保留本地自研工具）
const toolsData: Tool[] = [
  {
    id: '0',
    title: '时间戳转换',
    description: '时间戳与日期时间互转工具',
    category: '开发工具',
    type: 'online',
    coverImage: 'https://images.pexels.com/photos/2397363/pexels-photo-2397363.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishDate: '2024-12-10',
    modalType: 'component',
    componentId: 'timestamp-converter',
  },
  {
    id: '2',
    title: 'IP位置查询',
    description: '查询IP地址归属地，显示当前用户IP及所在位置信息',
    category: '效率工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-11',
    modalType: 'component',
    componentId: 'ip-location',
  },
  {
    id: '3',
    title: '图片转ICO',
    description: '在线图片转ICO工具，支持多尺寸favicon图标生成，纯前端处理无需上传',
    category: '图片工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-23',
    modalType: 'component',
    componentId: 'image-to-ico',
  },
  {
    id: '4',
    title: '编码解码',
    description: 'Base64/URL 编码解码工具，支持中文字符，纯前端处理',
    category: '开发工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-24',
    modalType: 'component',
    componentId: 'encode-tool',
  },
  {
    id: '5',
    title: 'MD5加密',
    description: '将文本转换为32位MD5哈希值，支持大小写格式输出',
    category: '开发工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-24',
    modalType: 'component',
    componentId: 'md5-tool',
  },
  {
    id: '6',
    title: '全球国家/地区查询',
    description: '查询全球国家或地区的国际域名缩写、英文名和电话代码',
    category: '效率工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-24',
    modalType: 'component',
    componentId: 'country-code-tool',
  },
  {
    id: '7',
    title: '图片生成器',
    description: '自定义尺寸、格式、背景和文字的图片生成工具，支持 PNG/JPEG/WebP 格式',
    category: '图片工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-24',
    modalType: 'component',
    componentId: 'image-generator',
  },
  {
    id: '8',
    title: '随机密码',
    description: '生成安全随机密码，支持自定义长度和特殊字符，确保密码复杂度',
    category: '开发工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-24',
    modalType: 'component',
    componentId: 'password-generator',
  },
  {
    id: '9',
    title: 'UA 解析',
    description: '解析 User-Agent 字符串，识别浏览器、操作系统、设备类型和渲染引擎',
    category: '开发工具',
    type: 'online',
    coverImage: '',
    publishDate: '2024-12-24',
    modalType: 'component',
    componentId: 'user-agent-parser',
  },
  {
    id: '10',
    title: '游戏名称生成器',
    description: '多风格游戏角色名称生成，支持武侠、仙侠、科幻、都市、魔幻、二次元风格',
    category: '效率工具',
    type: 'online',
    coverImage: '',
    publishDate: '2025-12-25',
    modalType: 'component',
    componentId: 'game-name-generator',
  },
];

// 导出按 id 正序排列的工具列表
export const tools: Tool[] = [...toolsData].sort((a, b) => Number(a.id) - Number(b.id));

// 工具分类
export const toolCategories = [
  { key: 'all', label: '全部' },
  { key: '开发工具', label: '开发工具' },
  { key: '图片工具', label: '图片工具' },
  { key: '效率工具', label: '效率工具' },
];
