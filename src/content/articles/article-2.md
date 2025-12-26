---
id: "2"
title: "TypeScript 高级类型技巧"
description: "深入理解 TypeScript 的条件类型、映射类型、模板字面量类型等高级特性。"
category: "TypeScript"
tags: ["TypeScript", "类型系统", "前端"]
coverImage: "https://imgo.3d66.com/www/new-admin/sys/yt/img/69368addd021d.png!type-change-p"
author: "技术博主"
publishDate: "2024-11-28"
readTime: 12
views: 856
---

## 前言

TypeScript 的类型系统非常强大，本文将深入探讨高级类型的使用技巧。

## 一、条件类型

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
```

### 1.1 infer 关键字

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

## 二、映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

## 三、模板字面量类型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<'click'>;  // 'onClick'
```

## 总结

掌握这些高级类型技巧，可以让你写出更加类型安全的代码。
