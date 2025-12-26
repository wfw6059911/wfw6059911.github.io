// 文章基础类型
export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  publishDate: string;
  readTime: number; // 阅读时间（分钟）
  views?: number; // 浏览量（列表页可选）
}

// 文章详情类型（扩展基础类型）
export interface ArticleDetail extends Article {
  content: string; // Markdown 内容
  views: number; // 浏览量（详情页必需）
  likes: number; // 点赞数
  updateDate?: string; // 更新日期
}

// 资源类型
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'tool' | 'tutorial' | 'template' | 'library';
  url: string;
  coverImage: string;
  publishDate: string;
}

// 工具类型枚举
export type ToolType = 'online' | 'download' | 'extension' | 'service';
export type ModalType = 'iframe' | 'component' | 'link';

// 工具基础类型
export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  type: ToolType;
  url?: string; // 第三方工具链接（iframe/link 模式必填）
  coverImage: string;
  publishDate: string;
  modalType: ModalType; // 弹窗类型：iframe-嵌入第三方网站，component-自研组件，link-新标签页打开
  componentId?: string; // 组件模式时的组件标识（component 模式必填）
}

// 条件类型 - 根据 modalType 确定必需字段
export type ToolWithUrl = Tool & { modalType: 'iframe' | 'link'; url: string };
export type ToolWithComponent = Tool & { modalType: 'component'; componentId: string };

// 个人信息
export interface Profile {
  name: string;
  avatar: string;
  signature: string;
  bio: string;
  socialLinks: SocialLink[];
  skills: Skill[];
  experience: Experience[];
}

// 社交链接
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// 技能
export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

// 经历
export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}
