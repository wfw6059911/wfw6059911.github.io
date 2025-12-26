import { Resource } from '@/types';

// 资源列表数据
export const resources: Resource[] = [
  {
    id: '1',
    title: '站酷ZCOOL-设计师互动平台-打开站酷,发现更好的设计!',
    description: '站酷ZCOOL,中国设计师互动平台.深耕设计领域十八年,站酷聚集了1800万设计师、摄影师、插画师、艺术家、创意人,设计创意群体中具有较高的影响力与号召力.',
    category: '网站素材',
    type: 'tool',
    url: 'https://www.zcool.com.cn/',
    coverImage: '/images/resources/5.webp',
    publishDate: '2025-12-05',
  },
  {
    id: '2',
    title: '千图网-免费在线设计图片素材网站-正版商用素材图库模板大全',
    description: '千图网(www.58pic.com) 是专注正版商用图片素材在线设计与下载的网站！提供矢量图素材、背景图片、psd素材、字体模板、设计素材、PPT模板、视频素材、插画绘画、海报设计模板、网站设计素材等下载服务。',
    category: '网站素材',
    type: 'template',
    url: 'https://www.58pic.com/',
    coverImage: '/images/resources/2.webp',
    publishDate: '2025-11-30',
  },
  {
    id: '3',
    title: '花瓣网-最新图片采集_最新素材采集',
    description: '花瓣网最新采集栏目为推荐了最新采集相关的图片素材资源，其中涵盖众多设计师收藏采集的相关图片素材资源。花瓣网, 设计师寻找灵感的天堂！',
    category: '网站素材',
    type: 'tutorial',
    url: 'https://huaban.com/',
    coverImage: '/images/resources/3.webp',
    publishDate: '2025-11-25',
  },
  {
    id: '4',
    title: '摄图网-正版高清图片免费下载_商用设计素材图库',
    description: '摄图网是一家专注于正版摄影高清图片素材免费下载的图库作品网站,提供手绘插画,海报,ppt模板,科技,城市,商务,建筑,风景,美食,家居,外景,背景等好看的图片设计素材大全可供下载。摄图摄影师5000+入驻并进行交流成长，百万图片量和设计师在这里找到满意的图片素材和设计灵感!',
    category: '网站素材',
    type: 'tool',
    url: 'https://699pic.com/',
    coverImage: '/images/resources/4.webp',
    publishDate: '2025-11-20',
  },
  {
    id: '5',
    title: '千库网_免费png图片背景素材下载,商用版权设计素材图库',
    description: '千库网是一家正版高清原创版权素材免费下载图库网站,5880万+正版可商用海报模版,PPT模板,png素材,背景图片,免抠元素,人像摄影图,音频视频素材,艺术字等版权图库素材大全供会员免费下载,千库网提供在线编辑设计与热门设计AI工具为用户提供一站式智能商务办公解决方案,版权图库认准千库网588ku.com',
    category: '网站素材',
    type: 'library',
    url: 'https://588ku.com/',
    coverImage: '/images/resources/1.webp',
    publishDate: '2025-11-15',
  }
];

// 资源分类
export const resourceCategories = [
  { key: 'all', label: '全部' },
  { key: '前端开发', label: '前端开发' },
  { key: '博客论坛', label: '博客论坛' },
  { key: '网站素材', label: '网站素材' },
  { key: '社会链接', label: '社会链接' },
  { key: '其它', label: '其它' },
];