import { Profile } from '@/types';

// 个人信息数据
export const profile: Profile = {
  name: 'oooo',
  avatar: 'https://img.3d66.com/new-admin/sys/yt/img/headerimg.jpg',
  signature: '热爱技术，专注分享',
  bio: '全栈开发工程师，专注于 React、Node.js、TypeScript 技术栈。热衷于探索新技术，分享实战经验，帮助更多开发者成长。',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com',
      icon: 'GithubOutlined',
    },
    {
      platform: '掘金',
      url: 'https://juejin.cn',
      icon: 'ReadOutlined',
    },
    {
      platform: '微信公众号',
      url: '#',
      icon: 'WechatOutlined',
    },
    {
      platform: '邮箱',
      url: 'mailto:example@email.com',
      icon: 'MailOutlined',
    },
  ],
  skills: [
    { name: 'JavaScript', level: 95, category: '编程语言' },
    { name: 'TypeScript', level: 90, category: '编程语言' },
    { name: 'React', level: 92, category: '前端框架' },
    { name: 'Next.js', level: 88, category: '前端框架' },
    { name: 'Node.js', level: 85, category: '后端' },
    { name: 'CSS/Sass', level: 88, category: '样式' },
    { name: 'Git', level: 90, category: '工具' },
    { name: 'Docker', level: 75, category: '工具' },
  ],
  experience: [
    {
      title: '高级前端工程师',
      company: '某科技公司',
      period: '2022 - 至今',
      description: '负责核心产品的前端架构设计与开发，带领团队完成多个重要项目。',
    },
    {
      title: '前端工程师',
      company: '某互联网公司',
      period: '2020 - 2022',
      description: '参与公司 B 端产品开发，负责组件库建设和性能优化。',
    },
    {
      title: '初级开发工程师',
      company: '某创业公司',
      period: '2018 - 2020',
      description: '全栈开发，负责公司官网和后台管理系统的开发维护。',
    },
  ],
};
