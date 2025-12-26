---
id: "4"
title: "CSS Grid 布局完全指南"
description: "从零开始掌握 CSS Grid 布局，创建复杂的响应式网格系统。"
category: "CSS"
tags: ["CSS", "布局", "响应式"]
coverImage: "https://imgo.3d66.com/www/new-admin/sys/yt/img/69369cc420df3.png!type-change-p"
author: "技术博主"
publishDate: "2024-11-20"
readTime: 15
views: 1580
---

## 前言

CSS Grid 是一个强大的二维布局系统，让复杂的网页布局变得简单直观。

## 一、Grid 基础概念

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px 200px;
  gap: 20px;
}

.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
```

## 二、常用属性

```css
/* 弹性单位 */
grid-template-columns: 1fr 2fr 1fr;

/* 自动填充 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* 对齐方式 */
.container {
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
}
```

## 三、实战案例

### 响应式卡片布局

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
```

### 圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
}
```

## 总结

CSS Grid 让复杂布局变得简单，配合 Flexbox 使用可以应对几乎所有的布局需求！
