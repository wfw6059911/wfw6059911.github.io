# Static React

基于 React 19 + TypeScript + Vite 7 的个人技术站点，包含博客、工具、资源等模块。

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19.x |
| 类型系统 | TypeScript | 5.9.x |
| 构建工具 | Vite | 7.x |
| UI 组件库 | Ant Design | 6.x |
| 路由 | react-router-dom | 7.x |
| 状态管理 | Zustand | 5.x |
| Markdown | react-markdown + react-syntax-highlighter | - |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

## 项目结构

```
src/
├── components/     # 可复用组件 (42+)
│   └── Tools/      # 工具子组件 (11个自研工具)
├── pages/          # 页面组件 (7个)
├── layouts/        # 布局组件
├── router/         # 路由配置 (懒加载)
├── hooks/          # 自定义 Hooks
├── mock/           # Mock 数据
├── stores/         # 状态管理 (Zustand)
├── theme/          # 主题配置
├── types/          # TypeScript 类型
├── styles/         # 全局样式
├── constants/      # 常量配置
├── content/        # Markdown 文章
├── utils/          # 工具函数
└── assets/         # 静态资源
```

## 功能模块

### 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/articles` | 文章列表 |
| `/articles/:id` | 文章详情 |
| `/tools` | 工具集 |
| `/resources` | 资源列表 |
| `/about` | 关于页面 |
| `/changelog` | 网站历程 |

### 自研工具集

- 时间戳转换器
- IP 位置查询
- 图片转 ICO
- 编码/解码工具 (Base64、URL、Unicode)
- MD5 加密
- 密码生成器
- 图片生成器
- 国家代码查询
- User-Agent 解析

### 交互特性

- 桌面宠物
- 敲木鱼小游戏
- 下班倒计时
- 定时提醒
- 百度热搜弹窗
- 请假攻略弹窗

## 特性

- 响应式设计，支持桌面端和移动端
- 深色/浅色主题切换
- 代码分割与懒加载优化
- Markdown 文章渲染与代码高亮
- 模块化架构，便于扩展

## 路径别名

使用 `@` 作为 `src` 目录别名：

```typescript
import Component from '@/components/Component';
```

## 文档

- [CLAUDE.md](./CLAUDE.md) - 项目开发指南
- [MODULE_MAP.md](./MODULE_MAP.md) - 模块编号映射
- [CHANGELOG.md](./CHANGELOG.md) - 版本更新日志

## License

MIT
