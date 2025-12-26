# 模块编号约定文档

> **重要规则**: Claude 在每次回答关于修改模块的问题前，必须先查阅此文档，确保理解编号对应的模块。

## 使用方式

用户可以通过 `X-Y` 格式快速指定要修改的模块：
- 第一位数字 (X): 页面编号
- 第二位数字 (Y): 该页面内的模块编号

例如: `1-2` 表示首页的 AI 创作 Banner 模块

## 页面编号

| 编号 | 页面 | 路径 | 文件 |
|------|------|------|------|
| **0** | 全局/布局 | - | Layout.tsx |
| **1** | 首页 | / | Home.tsx |
| **2** | 文章页 | /articles | Articles.tsx |
| **3** | 工具页 | /tools | Tools.tsx |
| **4** | 资源页 | /resources | Resources.tsx |
| **5** | 关于页 | /about | About.tsx |
| **6** | 文章详情 | /articles/:id | ArticleDetail.tsx |
| **7** | 网站历程 | /changelog | Changelog.tsx |

## 模块编号

### 0-x 全局组件

| 编号 | 模块 | 组件文件 | data-res-type |
|------|------|----------|---------------|
| 0-1 | 顶部导航 | Header/index.tsx | `0-1` |
| 0-2 | 底部页脚 | Footer/index.tsx | `0-2` |
| 0-3 | 悬浮按钮 | FloatButtons/index.tsx | `0-3` |
| 0-4 | 顶部加载条 | TopLoadingBar/index.tsx | `0-4` |
| 0-5 | 搜索弹窗 | SearchModal/index.tsx | `0-5` |
| 0-6 | 悬浮广告 | FloatAd/index.tsx | `0-6` |
| 0-7 | AI桌宠 | DesktopPet/index.tsx | `0-7` |
| 0-8 | 百度热搜弹窗 | BaiduHotSearchPopup/index.tsx | `0-8` |
| 0-9 | 错误边界 | ErrorBoundary/index.tsx | `0-9` |
| 0-10 | 页面过渡 | PageTransition/index.tsx | `0-10` |
| 0-11 | 主题切换 | ThemeSwitch/index.tsx | `0-11` |

### 1-x 首页模块

| 编号 | 模块 | 组件文件 | data-res-type |
|------|------|----------|---------------|
| 1-1 | 敲木鱼 | WoodenFish/index.tsx | `1-1` |
| 1-2 | AI创作Banner | AIHeroBanner/index.tsx | `1-2` |
| 1-3 | 下班倒计时 | WorkCountdown/index.tsx | `1-3` |
| 1-4 | 最新文章 | ArticleList/index.tsx | `1-4` |
| 1-5 | 工具集 | ToolList/index.tsx | `1-5` |
| 1-6 | 资源视界 | ResourceList/index.tsx | `1-6` |
| 1-7 | 定时提醒 | TimedReminder/index.tsx | `1-7` |
| 1-8 | 视差Banner | ParallaxBanner/index.tsx | `1-8` |
| 1-9 | 每日弹窗 | DailyImagePopup/index.tsx | `1-9` |
| 1-10 | 请假攻略 | LeaveGuidePopup/index.tsx | `1-10` |
| 1-11 | 工作年限 | WorkYearsPopup/index.tsx | `1-11` |
| 1-12 | 3D溜溜网快链 | QuickLinks/index.tsx | `1-12` |

### 2-x 文章页模块

| 编号 | 模块 | 位置 | data-res-type |
|------|------|------|---------------|
| 2-1 | 页面标题 | Articles.tsx .header | `2-1` |
| 2-2 | 分类标签 | Articles.tsx Tabs | `2-2` |
| 2-3 | 文章列表 | Articles.tsx Row | `2-3` |
| 2-4 | 分页器 | Articles.tsx Pagination | `2-4` |

### 3-x 工具页模块

| 编号 | 模块 | 位置 | data-res-type |
|------|------|------|---------------|
| 3-1 | 页面标题 | Tools.tsx .header | `3-1` |
| 3-2 | 分类标签 | Tools.tsx Tabs | `3-2` |
| 3-3 | 工具列表 | Tools.tsx Row | `3-3` |
| 3-4 | 分页器 | Tools.tsx Pagination | `3-4` |

#### 3-5x 工具子组件

| 编号 | 模块 | 组件文件 | data-res-type |
|------|------|----------|---------------|
| 3-51 | 时间戳转换 | Tools/TimestampConverter/index.tsx | `3-51` |
| 3-52 | IP位置查询 | Tools/IpLocation/index.tsx | `3-52` |
| 3-53 | 图片转ICO | Tools/ImageToIco/index.tsx | `3-53` |
| 3-54 | 编码解码 | Tools/EncodeTool/index.tsx | `3-54` |
| 3-55 | MD5加密 | Tools/Md5Tool/index.tsx | `3-55` |
| 3-56 | 密码生成器 | Tools/PasswordGenerator/index.tsx | `3-56` |
| 3-57 | 图片生成器 | Tools/ImageGenerator/index.tsx | `3-57` |
| 3-58 | 国家代码 | Tools/CountryCodeTool/index.tsx | `3-58` |
| 3-59 | UA解析 | Tools/UserAgentParser/index.tsx | `3-59` |
| 3-60 | 百度热搜 | Tools/BaiduHotSearch/index.tsx | `3-60` |
| 3-61 | 游戏名称生成器 | Tools/GameNameGenerator/index.tsx | `3-61` |

### 4-x 资源页模块

| 编号 | 模块 | 位置 | data-res-type |
|------|------|------|---------------|
| 4-1 | 页面标题 | Resources.tsx .header | `4-1` |
| 4-2 | 分类标签 | Resources.tsx Tabs | `4-2` |
| 4-3 | 资源列表 | Resources.tsx Row | `4-3` |
| 4-4 | 分页器 | Resources.tsx Pagination | `4-4` |

### 5-x 关于页模块

| 编号 | 模块 | 位置 | data-res-type |
|------|------|------|---------------|
| 5-1 | 个人信息卡片 | About.tsx .profileCard | `5-1` |
| 5-2 | 关于我 | About.tsx (在5-1内) | `5-2` |
| 5-3 | 技能树 | About.tsx .skillsCard | `5-3` |
| 5-4 | 工作经历 | About.tsx .experienceCard | `5-4` |

### 6-x 文章详情模块

| 编号 | 模块 | 位置 | data-res-type |
|------|------|------|---------------|
| 6-1 | 文章头部 | ArticleDetail.tsx .header | `6-1` |
| 6-2 | 文章内容 | ArticleDetail.tsx .content | `6-2` |
| 6-3 | 代码块 | CodeBlock/index.tsx | `6-3` |

### 7-x 网站历程模块

| 编号 | 模块 | 位置 | data-res-type |
|------|------|------|---------------|
| 7-1 | 版本时间线 | Changelog.tsx | `7-1` |

## 通用组件 (无编号)

以下组件为通用复用组件，不分配固定编号：

| 组件 | 文件 | 说明 |
|------|------|------|
| ArticleCard | ArticleCard/index.tsx | 文章卡片 |
| ToolCard | ToolCard/index.tsx | 工具卡片 |
| ResourceCard | ResourceCard/index.tsx | 资源卡片 |
| InfoCard | InfoCard/index.tsx | 信息卡片 |
| ArticleModal | ArticleModal/index.tsx | 文章弹窗 |

## DOM 标识规范

每个模块的根元素都应包含 `data-res-type` 属性，值为对应的编号：

```tsx
// 示例
<div data-res-type="1-2" className={styles.banner}>
  {/* AI创作Banner内容 */}
</div>
```

## 快速查询示例

| 用户说 | 对应模块 | 文件位置 |
|--------|----------|----------|
| "修改 0-1" | 顶部导航 | Header/index.tsx |
| "修改 0-7" | AI桌宠 | DesktopPet/index.tsx |
| "修改 0-8" | 百度热搜弹窗 | BaiduHotSearchPopup/index.tsx |
| "修改 1-2" | AI创作Banner | AIHeroBanner/index.tsx |
| "修改 1-7" | 定时提醒 | TimedReminder/index.tsx |
| "修改 1-9" | 每日弹窗 | DailyImagePopup/index.tsx |
| "修改 1-12" | 3D溜溜网快链 | QuickLinks/index.tsx |
| "修改 2-3" | 文章列表 | Articles.tsx |
| "修改 3-51" | 时间戳转换工具 | Tools/TimestampConverter/index.tsx |
| "修改 3-56" | 密码生成器 | Tools/PasswordGenerator/index.tsx |
| "修改 5-3" | 关于页技能树 | About.tsx |
| "修改 6-3" | 代码块组件 | CodeBlock/index.tsx |

## 新增模块规则

当新增模块时：

1. **确定页面**: 根据模块所属页面确定第一位编号 (X)
2. **分配序号**: 在该页面已有模块后分配下一个序号 (Y)
3. **添加标识**: 在组件根元素添加 `data-res-type="X-Y"`
4. **更新文档**: 在本文档对应章节添加映射记录

示例：首页新增模块 → `1-13`
