# static-react 项目指南

## 项目概述

这是一个基于 React 19 + TypeScript + Vite 7 的个人技术站点，包含文章、工具、资源等模块。

## 技术栈

- **框架**: React 19 + TypeScript 5.9
- **构建工具**: Vite 7
- **UI 框架**: Ant Design 6
- **路由**: react-router-dom 7
- **状态管理**: Zustand 5
- **样式**: CSS Modules
- **Markdown**: react-markdown + react-syntax-highlighter
- **其他**: gray-matter、remark-gfm、solarlunar

## 项目结构

```
src/
├── components/     # 可复用组件 (42+)
│   └── Tools/      # 工具子组件 (11个)
├── pages/          # 页面组件 (7个)
├── layouts/        # 布局组件
├── router/         # 路由配置 (懒加载)
├── hooks/          # 自定义 Hooks (3个)
├── mock/           # Mock 数据 (5个文件)
├── stores/         # 状态管理 (Zustand)
├── theme/          # 主题配置
├── types/          # TypeScript 类型定义
├── styles/         # 全局样式
├── assets/         # 静态资源
├── constants/      # 常量配置
├── content/        # 文章内容 (Markdown)
└── utils/          # 工具函数
```

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本 (tsc + vite build)
npm run lint     # 代码检查
npm run preview  # 预览构建结果
```

## 路径别名

使用 `@` 作为 `src` 目录的别名：

```typescript
import Component from '@/components/Component';
```

## 核心组件

### 页面组件 (src/pages/)

| 文件 | 说明 |
|------|------|
| Home.tsx | 首页 |
| Articles.tsx | 文章列表 |
| ArticleDetail.tsx | 文章详情 |
| Tools.tsx | 工具集 |
| Resources.tsx | 资源列表 |
| About.tsx | 关于页面 |
| Changelog.tsx | 网站历程 |
| NotFound.tsx | 404 页面 |

### 工具组件 (src/components/Tools/)

| 组件 | 说明 |
|------|------|
| TimestampConverter | 时间戳转换 |
| IpLocation | IP 位置查询 |
| ImageToIco | 图片转 ICO |
| EncodeTool | 编码/解码 (Base64、URL、Unicode) |
| Md5Tool | MD5 加密 |
| PasswordGenerator | 密码生成器 |
| ImageGenerator | 图片生成器 |
| CountryCodeTool | 国家代码查询 |
| UserAgentParser | User-Agent 解析 |
| ImageCompressor | 图片压缩 |
| BaiduHotSearch | 百度热搜 |

### 交互组件

| 组件 | 说明 |
|------|------|
| DesktopPet | 桌面宠物 |
| WoodenFish | 敲木鱼 |
| WorkCountdown | 下班倒计时 |
| TimedReminder | 定时提醒 |
| DrinkWaterReminder | 喝水提醒 |

## 开发规范

### 组件规范

- 组件使用函数式组件 + Hooks
- 每个组件独立文件夹，包含 `index.tsx` 和 `*.module.css`
- 使用 CSS Modules 进行样式隔离

### 页面规范

- 页面组件使用扁平结构，直接放在 `src/pages/` 目录下
- 页面文件命名：`PageName.tsx`（大驼峰）
- 页面样式命名：`PageName.module.css`（与页面文件名一致）
- 示例：`About.tsx` + `About.module.css`

### 样式规范

- 组件样式使用 `ComponentName.module.css`
- 页面样式使用 `PageName.module.css`
- 全局样式放在 `src/styles/globals.css`
- 主题配置在 `src/theme/themeConfig.ts`

### 类型规范

- 公共类型定义放在 `src/types/index.ts`
- 组件 Props 类型在组件文件内定义

## 强制规范 (重要)

**以下规则 Claude 必须严格遵守，违反时应立即停止并询问用户。**

### 文件命名

- 组件：`ComponentName/index.tsx`
- 页面：`PageName.tsx`
- 样式：与组件/页面同名的 `.module.css`
- **新建文件前必须询问用户确认**

### 禁止行为

- 禁止在 `utils/` 目录放置组件
- 禁止使用 `any` 类型
- 禁止创建超过 300 行的文件（超过时应拆分）

### 目录约束

| 目录 | 允许放置 | 禁止放置 |
|-----|---------|---------|
| `components/` | React 组件 | 工具函数、常量 |
| `pages/` | 页面组件 | 可复用组件 |
| `utils/` | 工具函数 | 组件、常量 |
| `hooks/` | 自定义 Hooks | 组件、工具函数 |
| `constants/` | 常量配置 | 组件、函数 |

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/articles` | Articles | 文章列表 |
| `/articles/:id` | ArticleDetail | 文章详情 |
| `/tools` | Tools | 工具列表 |
| `/resources` | Resources | 资源列表 |
| `/about` | About | 关于页面 |
| `/changelog` | Changelog | 网站历程 |

## 关键特性

### 主题系统
- 支持浅色/深色主题切换
- 使用 Ant Design ConfigProvider 配置
- 状态持久化到 localStorage

### 性能优化
- 代码分割 (vendor-react、vendor-antd 分离)
- 路由懒加载 (Suspense + lazy)
- CSS 代码分割
- 生产环境禁用 sourcemap

### 响应式设计
- 使用 Ant Design 栅格系统
- 支持桌面端和移动端
- 视差滚动效果

## 注意事项

- Mock 数据在 `src/mock/` 目录，后续可替换为真实 API
- 支持深色/浅色主题切换
- 使用 Ant Design 的 ConfigProvider 进行主题配置

## 版本记录规则 (重要)

**强制规则**: 当 Claude 完成功能新增、修改、修复等任务后，必须：

1. **更新 CHANGELOG.md**: 在文件顶部添加新版本记录
   - 新功能使用 `feat`
   - Bug 修复使用 `fix`
   - 样式调整使用 `style`
   - 代码重构使用 `refactor`
   - 文档更新使用 `docs`

2. **同步更新网站历程页面**: 修改 `src/pages/Changelog.tsx` 中的 `changelogData` 数组
   - 在数组开头添加新版本对象
   - 保持与 CHANGELOG.md 内容一致

3. **版本号规则**:
   - 主版本号 (x.0.0): 重大架构变更
   - 次版本号 (0.x.0): 新功能添加
   - 修订号 (0.0.x): Bug 修复、小调整

### 示例

```markdown
<!-- CHANGELOG.md -->
## [v1.4.0] - 2025-12-18

### feat
- 新增 xxx 功能
```

```tsx
// src/pages/Changelog.tsx - changelogData 数组开头添加
{
  version: 'v1.4.0',
  date: '2025-12-18',
  type: 'feature',
  title: '功能标题',
  changes: ['新增 xxx 功能'],
},
```

详细更新日志请查阅: [CHANGELOG.md](./CHANGELOG.md)

## 模块编号规则 (重要)

**强制规则 1**: 当用户使用 `X-Y` 格式（如 `1-2`、`0-1`）指定模块时，Claude 必须：

1. **首先查阅** `MODULE_MAP.md` 文档，确认编号对应的模块
2. **定位文件**: 根据文档找到对应的组件文件
3. **执行修改**: 在正确的模块上进行操作

**强制规则 2**: 当 MODULE_MAP.md 中**找不到**用户所说的模块编号时，Claude 必须：

1. **立即停止**: 不要猜测或尝试自行查找
2. **反馈用户**: 明确告知"在 MODULE_MAP.md 中未找到编号 X-Y 对应的模块"
3. **等待指示**: 等待用户提供正确的编号或进一步说明

**强制规则 3**: 当新增功能或模块时，Claude 必须：

1. **分配编号**: 根据所属页面分配下一个可用的模块编号（如首页新模块为 `1-7`）
2. **更新文档**: 在 `MODULE_MAP.md` 中添加新模块的映射记录
3. **添加 DOM 标识**: 在新模块的根元素上添加 `data-res-type` 属性
4. **通知用户**: 告知用户新模块的编号，方便后续引用

### 编号格式说明

- 格式: `页面编号-模块编号`
- 示例: `1-2` = 首页(1) + 轮播图(2) = HeroCarousel 组件

### DOM 标识

所有模块根元素都带有 `data-res-type` 属性，值为对应编号：

```tsx
<div data-res-type="1-2">...</div>
```

### 新增模块示例

```tsx
// 新增首页模块时
export default function NewFeature() {
  return (
    <div data-res-type="1-7">  {/* 自动分配下一个编号 */}
      {/* 模块内容 */}
    </div>
  );
}
```

详细映射表请查阅: [MODULE_MAP.md](./MODULE_MAP.md)
