import { Typography, Timeline, Tag, Card } from 'antd';
import {
  RocketOutlined,
  BugOutlined,
  ToolOutlined,
  StarOutlined,
} from '@ant-design/icons';
import styles from './Changelog.module.css';

const { Title, Text, Paragraph } = Typography;

// 版本历程数据
const changelogData = [
  {
    version: 'v1.8.1',
    date: '2025-12-26',
    type: 'fix',
    title: '弹窗显示顺序优化',
    changes: [
      '优化弹窗显示顺序，每日60秒读懂世界弹窗优先显示，关闭后再显示木鱼弹窗',
      '解决每天首次打开时两个弹窗同时弹出的问题',
    ],
  },
  {
    version: 'v1.8.0',
    date: '2025-12-25',
    type: 'feature',
    title: '游戏名称生成器',
    changes: [
      '新增游戏名称生成器工具，支持 6 种风格（武侠、仙侠、科幻、都市、魔幻、二次元）',
      '支持性别偏好选择（男性、女性、中性）',
      '名称长度可配置 2-6 字，批量生成 5-50 个名称',
      '纯前端生成，无需网络请求',
    ],
  },
  {
    version: 'v1.7.9',
    date: '2025-12-25',
    type: 'refactor',
    title: '优化工具集布局',
    changes: [
      '移除工具集中的"百度热搜"工具卡片，保留侧边栏百度热搜弹窗功能',
    ],
  },
  {
    version: 'v1.7.8',
    date: '2025-12-24',
    type: 'feature',
    title: 'User-Agent 解析工具',
    changes: [
      '新增 User-Agent 解析工具，支持解析浏览器、操作系统、设备类型、渲染引擎',
      '自动获取当前浏览器 UA，支持手动输入任意 UA 字符串',
      '可检测常见搜索引擎爬虫（Googlebot、百度蜘蛛等）',
    ],
  },
  {
    version: 'v1.7.7',
    date: '2025-12-24',
    type: 'feature',
    title: '随机密码生成工具',
    changes: [
      '新增随机密码生成工具，支持 6-64 位长度自定义',
      '必须包含大写字母、小写字母和数字，可选特殊字符',
      '禁止连续 3 个及以上相同字符，确保密码安全性',
    ],
  },
  {
    version: 'v1.7.6',
    date: '2025-12-24',
    type: 'feature',
    title: '图片生成器工具',
    changes: [
      '新增图片生成器工具，支持自定义尺寸、格式（PNG/JPEG/WebP）、背景颜色和文字内容',
      '支持透明背景（仅PNG格式）、图片质量调节、多种预设尺寸',
      '纯前端 Canvas 生成，无需上传服务器',
    ],
  },
  {
    version: 'v1.7.5',
    date: '2025-12-24',
    type: 'feature',
    title: '编码解码工具增强',
    changes: [
      '编码解码工具新增 Unicode 转换功能，支持中文与 \\uXXXX 格式互转',
    ],
  },
  {
    version: 'v1.7.4',
    date: '2025-12-24',
    type: 'feature',
    title: '全球国家/地区查询工具',
    changes: [
      '新增全球国家/地区查询工具，支持查询域名缩写、中英文名称和电话代码',
      '支持实时搜索过滤，可按任意字段模糊匹配',
      '内置 245 个国家和地区的完整数据',
    ],
  },
  {
    version: 'v1.7.3',
    date: '2025-12-24',
    type: 'feature',
    title: 'MD5加密工具',
    changes: [
      '新增 MD5 加密工具，支持 32 位小写和大写格式输出',
    ],
  },
  {
    version: 'v1.7.2',
    date: '2025-12-24',
    type: 'feature',
    title: '编码解码工具',
    changes: [
      '新增编码解码工具，支持 Base64/URL 编码解码，支持中文字符',
    ],
  },
  {
    version: 'v1.7.1',
    date: '2025-12-24',
    type: 'feature',
    title: 'IP查询中文显示',
    changes: [
      'IP位置查询工具改用 ip-api.com API，支持中文显示归属地',
    ],
  },
  {
    version: 'v1.7.0',
    date: '2025-12-24',
    type: 'refactor',
    title: '工具集精简',
    changes: [
      '移除所有外部链接跳转工具，仅保留本地自研工具',
      '保留：时间戳转换、百度热搜、IP位置查询、图片转ICO',
    ],
  },
  {
    version: 'v1.6.9',
    date: '2025-12-24',
    type: 'feature',
    title: '快链无图渐变背景',
    changes: [
      '3D溜溜网快链（1-12）卡片无图片时显示随机渐变背景色',
    ],
  },
  {
    version: 'v1.6.8',
    date: '2025-12-24',
    type: 'refactor',
    title: '首屏加载性能优化',
    changes: [
      '弹窗组件改为 React.lazy 懒加载',
      'Mock 数据改为动态 import 加载',
      '桌宠组件延迟1秒加载',
      '每日图片添加 loading="lazy"',
    ],
  },
  {
    version: 'v1.6.7',
    date: '2025-12-24',
    type: 'style',
    title: '快链卡片样式优化',
    changes: [
      '卡片固定为128×95px，两端对齐布局',
      '文案添加默认底色，移除图片悬停放大效果',
    ],
  },
  {
    version: 'v1.6.6',
    date: '2025-12-24',
    type: 'style',
    title: '快链布局优化',
    changes: [
      '3D溜溜网快链（1-12）布局调整为一排12个，自适应宽度',
    ],
  },
  {
    version: 'v1.6.5',
    date: '2025-12-24',
    type: 'feature',
    title: '3D溜溜网快链',
    changes: [
      '首页新增「3D溜溜网快链」版块（1-12）',
      '展示常用链接入口，2行×12列布局',
      '点击快链在新窗口打开外部链接',
    ],
  },
  {
    version: 'v1.6.4',
    date: '2025-12-24',
    type: 'style',
    title: '刷新热词按钮优化',
    changes: [
      'AI创作Banner 刷新热词按钮添加刷新图标',
    ],
  },
  {
    version: 'v1.6.3',
    date: '2025-12-24',
    type: 'feature',
    title: '搜索引擎快捷访问',
    changes: [
      'AI创作Banner 搜索框为空时点击搜索按钮，新开窗口打开对应搜索引擎首页',
    ],
  },
  {
    version: 'v1.6.2',
    date: '2025-12-24',
    type: 'feature',
    title: '搜索框动态提示',
    changes: [
      'AI创作Banner 搜索框 placeholder 动态显示当前搜索引擎名称',
      '移除百度翻译工具（功能已废弃）',
    ],
  },
  {
    version: 'v1.6.1',
    date: '2025-12-23',
    type: 'feature',
    title: '图片转ICO工具',
    changes: [
      '新增图片转ICO工具，纯前端实现',
      '支持jpg、png、gif、webp、bmp格式转换',
      '可选6种尺寸，多尺寸打包到单个ICO文件',
      '支持拖拽上传，实时预览',
    ],
  },
  {
    version: 'v1.6.0',
    date: '2025-12-23',
    type: 'feature',
    title: '搜索引擎扩展',
    changes: [
      'AI创作Banner 搜索引擎新增知乎、哔哩哔哩',
    ],
  },
  {
    version: 'v1.5.9',
    date: '2025-12-23',
    type: 'feature',
    title: '热词推荐增强',
    changes: [
      'AI创作Banner 热词推荐功能增强',
      '新增60+热词词库（3D设计、AI创作、设计工具等）',
      '每次页面刷新随机展示5个热词',
      '新增"刷新热词"按钮，支持手动刷新',
    ],
  },
  {
    version: 'v1.5.8',
    date: '2025-12-23',
    type: 'feature',
    title: '多引擎搜索',
    changes: [
      'AI创作Banner 搜索功能启用，支持多搜索引擎切换',
      '支持百度、必应、搜狗、360 四大搜索引擎',
      '点击标签可快速填充搜索框',
    ],
  },
  {
    version: 'v1.5.7',
    date: '2025-12-23',
    type: 'bugfix',
    title: '请假攻略天数修正',
    changes: [
      '修复请假攻略明细中的天数显示，攻略建议统一为使用1天，与上方假期余额独立',
    ],
  },
  {
    version: 'v1.5.6',
    date: '2025-12-23',
    type: 'feature',
    title: '里程碑倒计时 & 弹窗优化',
    changes: [
      '工作年限弹窗新增里程碑倒计时，显示"距离里程碑还有XX天"',
      '优化所有弹窗关闭行为：只能通过关闭按钮关闭，点击遮罩层不再关闭',
    ],
  },
  {
    version: 'v1.5.5',
    date: '2025-12-22',
    type: 'enhancement',
    title: '代码规范化',
    changes: [
      '更新 CLAUDE.md 文档，补充 constants/content/stores/utils 目录说明',
      '新增页面规范说明，明确 pages 目录结构和命名规则',
      '统一 pages 样式文件命名规范（PageName.module.css）',
      '修复 Header 组件未使用导入警告',
    ],
  },
  {
    version: 'v1.5.4',
    date: '2025-12-22',
    type: 'feature',
    title: '工作年限统计',
    changes: [
      '新增工作年限统计弹窗，显示入职以来的工作年限',
      '侧边栏新增奖杯图标入口，位于请假攻略按钮上方',
      '大字号展示工龄（精确到一位小数），并显示入职日期和已工作天数',
      '显示下一个半年里程碑及其达到日期',
    ],
  },
  {
    version: 'v1.5.3',
    date: '2025-12-22',
    type: 'feature',
    title: '请假攻略',
    changes: [
      '新增请假攻略功能，侧边栏日历图标入口',
      '弹窗显示剩余假期天数（自动计算已过期假期）',
      '请假明细列表展示提交日期、使用日期和假期类型',
    ],
  },
  {
    version: 'v1.5.2',
    date: '2025-12-22',
    type: 'bugfix',
    title: '木鱼动画修复',
    changes: [
      '修复敲木鱼时木鱼图片闪烁问题，改用动画类重置方式触发动画',
    ],
  },
  {
    version: 'v1.5.1',
    date: '2025-12-22',
    type: 'bugfix',
    title: '代码质量优化',
    changes: [
      '修复 DesktopPet 组件 setTimeout 内存泄漏问题',
      '优化 WorkCountdown 定时器频率（50ms → 1000ms）',
      'Tools 页面添加 useMemo 缓存优化',
      'BaiduHotSearch 纯函数提取到组件外部',
      '移除 Header 组件废弃的注释代码',
      '清理 ParallaxBanner BANNER_IMAGES 数组格式',
    ],
  },
  {
    version: 'v1.5.0',
    date: '2025-12-19',
    type: 'enhancement',
    title: '性能优化',
    changes: [
      '新增 ErrorBoundary 错误边界组件，防止应用崩溃',
      '新增图片懒加载 Hook，优化首屏加载速度',
      'Home/Articles 页面使用 useMemo 缓存计算结果',
      'Header 滚动监听添加节流优化',
      '视差 Banner 移动端自动降级，提升性能',
      '百度热搜 API 新增 30 分钟响应缓存',
      'Vite 打包配置优化：代码分割、chunk 策略',
      '修复 TopLoadingBar 嵌套 setTimeout 内存泄漏',
    ],
  },
  {
    version: 'v1.4.0',
    date: '2025-12-18',
    type: 'feature',
    title: 'AI 桌宠',
    changes: [
      '新增 AI 桌宠组件，可爱萌系的 AI 助手机器人',
      '眼睛跟随鼠标移动，实时追踪效果',
      '支持拖拽到屏幕任意位置，位置自动保存',
      '点击互动显示随机对话气泡',
      '定时自动弹出有趣的提示消息',
    ],
  },
  {
    version: 'v1.3.9',
    date: '2025-12-18',
    type: 'enhancement',
    title: '首页导航优化',
    changes: [
      '首页导航右侧主题切换和广告图默认隐藏',
      '页面滚动后（导航有背景时）淡入显示',
      '使用 CSS 过渡动画实现平滑切换效果',
      '此行为仅限首页，其他页面始终显示',
    ],
  },
  {
    version: 'v1.3.8',
    date: '2025-12-18',
    type: 'feature',
    title: 'AI创作Banner',
    changes: [
      '首页 1-2 模块重构为「AI创作Banner」',
      '全新设计：标题、副标题、搜索框、标签展示',
      '左右两侧添加装饰图片，提升视觉效果',
      '支持响应式布局，移动端自动隐藏装饰图',
    ],
  },
  {
    version: 'v1.3.7',
    date: '2025-12-18',
    type: 'feature',
    title: '网站统计面板',
    changes: [
      '首页轮播图区域替换为「网站统计」面板',
      '采用新拟态 (Neumorphism) 设计风格',
      '展示文章数、工具数、资源数、运行天数',
      '数字加载时有递增动画效果',
    ],
  },
  {
    version: 'v1.3.6',
    date: '2025-12-18',
    type: 'bugfix',
    title: '导航样式修复',
    changes: [
      '修复非首页导航透明背景导致字体不可见的问题',
      '导航根据页面路由智能判断：首页保持透明效果，其他页面显示有背景的导航',
      '非首页内容区域添加顶部间距，避免被固定导航遮挡',
    ],
  },
  {
    version: 'v1.3.5',
    date: '2025-12-18',
    type: 'feature',
    title: '每日弹窗',
    changes: [
      '新增首页每日弹窗组件，展示每日推荐图片',
      '支持用户关闭后当日不再弹出，凌晨自动重置',
      '对接 api.03c3.cn 接口获取图片内容',
    ],
  },
  {
    version: 'v1.3.4',
    date: '2025-12-17',
    type: 'feature',
    title: '视差 Banner',
    changes: [
      '新增视差 Banner 组件，鼠标移动时产生丝滑视差效果',
      '支持自定义高度、背景图、移动速度等参数',
      '使用 requestAnimationFrame + GPU 加速实现流畅动画',
    ],
  },
  {
    version: 'v1.3.3',
    date: '2025-12-17',
    type: 'enhancement',
    title: '工具集布局调整',
    changes: [
      '首页工具集模块改为2行显示，共展示12个工具',
    ],
  },
  {
    version: 'v1.3.2',
    date: '2025-12-17',
    type: 'feature',
    title: '代码高亮增强',
    changes: [
      '文章详情页代码高亮区域新增语言类型显示',
      '文章详情页代码高亮区域新增复制代码功能',
      '新增 CodeBlock 组件，支持更多编程语言',
    ],
  },
  {
    version: 'v1.3.1',
    date: '2025-12-17',
    type: 'enhancement',
    title: '导航动画优化',
    changes: [
      '优化导航下拉菜单箭头动画效果',
      '鼠标经过时箭头缓动旋转 180 度',
    ],
  },
  {
    version: 'v1.3.0',
    date: '2025-12-17',
    type: 'feature',
    title: '关于页面重构',
    changes: [
      '新增"网站历程"页面，展示版本迭代记录',
      '重构导航菜单，"关于"改为下拉菜单',
      '支持"关于我"和"网站历程"二级导航',
      '新增 CHANGELOG.md 更新日志文件',
      '首页调整：工具集与最新文章模块位置互换',
    ],
  },
  {
    version: 'v1.2.0',
    date: '2025-12-15',
    type: 'feature',
    title: '文章系统重构',
    changes: [
      '文章详情改为弹窗展示',
      '优化文章列表布局',
      '新增 Markdown 渲染支持',
    ],
  },
  {
    version: 'v1.1.0',
    date: '2025-12-10',
    type: 'feature',
    title: '首页功能增强',
    changes: [
      '新增敲木鱼趣味功能',
      '新增下班倒计时组件',
      '新增定时提醒弹窗',
      '新增百度热搜弹窗',
    ],
  },
  {
    version: 'v1.0.0',
    date: '2025-12-01',
    type: 'release',
    title: '正式发布',
    changes: [
      '首页轮播图、文章列表、工具集、资源视界',
      '文章集页面支持分类筛选',
      '工具集页面支持分类筛选',
      '资源视界页面支持分类筛选',
      '关于我页面展示个人信息',
      '支持深色/浅色主题切换',
    ],
  },
  {
    version: 'v0.2.0',
    date: '2025-11-20',
    type: 'enhancement',
    title: '功能优化',
    changes: [
      '优化页面加载性能',
      '增加路由懒加载',
      '优化移动端适配',
    ],
  },
  {
    version: 'v0.1.0',
    date: '2025-11-10',
    type: 'feature',
    title: '项目初始化',
    changes: [
      '搭建 React 19 + TypeScript + Vite 7 项目框架',
      '集成 Ant Design 6 组件库',
      '配置路由系统',
      '设计基础页面结构',
    ],
  },
];

// 获取版本类型对应的图标和颜色
const getTypeConfig = (type: string) => {
  switch (type) {
    case 'feature':
      return { icon: <StarOutlined />, color: 'blue', label: '新功能' };
    case 'enhancement':
      return { icon: <ToolOutlined />, color: 'green', label: '优化' };
    case 'bugfix':
      return { icon: <BugOutlined />, color: 'orange', label: '修复' };
    case 'release':
      return { icon: <RocketOutlined />, color: 'purple', label: '发布' };
    default:
      return { icon: <StarOutlined />, color: 'default', label: '更新' };
  }
};

export default function Changelog() {
  return (
    <div className={styles.container} data-res-type="7-1">
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          网站历程
        </Title>
        <Paragraph className={styles.description}>
          记录网站的成长轨迹，每一次更新都是为了更好的体验
        </Paragraph>
      </div>

      <Timeline
        mode="alternate"
        className={styles.timeline}
        items={changelogData.map((item) => {
          const typeConfig = getTypeConfig(item.type);
          return {
            icon: typeConfig.icon,
            color: typeConfig.color,
            title: item.date,
            content: (
              <Card className={styles.versionCard} hoverable>
                <div className={styles.versionHeader}>
                  <div className={styles.versionInfo}>
                    <Text strong className={styles.version}>
                      {item.version}
                    </Text>
                    <Tag color={typeConfig.color}>{typeConfig.label}</Tag>
                  </div>
                </div>
                <Title level={5} className={styles.versionTitle}>
                  {item.title}
                </Title>
                <ul className={styles.changeList}>
                  {item.changes.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
              </Card>
            ),
          };
        })}
      />
    </div>
  );
}
