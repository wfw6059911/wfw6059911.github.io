---
id: "3"
title: "Next.js 14 App Router 实践"
description: "学习 Next.js 14 的 App Router 架构，掌握服务端组件和流式渲染。"
category: "Next.js"
tags: ["Next.js", "React", "SSR"]
coverImage: "https://imgo.3d66.com/www/new-admin/sys/yt/img/69369cb311384.png!type-change-p"
author: "技术博主"
publishDate: "2024-11-25"
readTime: 10
views: 1245
---

## 什么是 App Router？

Next.js 14 引入了全新的 App Router，这是一个基于 React Server Components 的路由系统。

## 核心概念

### 1. 服务端组件 vs 客户端组件

```tsx
// 服务端组件（默认）
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}

// 客户端组件
function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. 文件系统路由

```
app/
├── page.tsx          # /
├── about/
│   └── page.tsx      # /about
└── blog/
    └── [slug]/
        └── page.tsx  # /blog/:slug
```

## 最佳实践

1. 尽可能使用服务端组件
2. 只在需要交互的地方使用客户端组件
3. 利用 Suspense 实现流式渲染
