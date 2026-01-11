---
url: 'https://elysiajs.com/tutorial.md'
---

# 欢迎来到 Elysia

很高兴您能来到这里！这个游乐场将帮助您以互动的方式开始使用 Elysia。

与传统的后端框架不同，**Elysia 也可以在浏览器中运行**！尽管它不支持所有功能，但它是学习和实验的完美环境。

您可以通过点击左侧边栏的  来查看 API 文档。

## 什么是 Elysia

Elysia 是一个以人为本的框架。

好的，认真说，Elysia 是一个关注开发者体验和性能的后端 TypeScript 框架。

Elysia 与其他框架的不同之处在于：

1. 具有可与 Golang 相媲美的卓越性能。
2. 提供卓越的 TypeScript 支持，具有 **类型安全性**。
3. 从底层围绕 OpenAPI 构建。
4. 提供像 tRPC 一样的端到端类型安全。
5. 使用 Web 标准，让您能够在 Cloudflare Workers、Deno、Bun、Node.js 等任意地方运行代码。
6. 当然，它是 **优先为人设计的**。

尽管 Elysia 有一些重要概念，但一旦掌握，许多人发现与之合作非常愉快和直观。

## 如何使用这个游乐场

游乐场分为 3 个部分：

1. 左侧是文档和任务（您正在阅读的内容）。
2. 右上角是代码编辑器。
3. 右下角是预览、输出和控制台。

## 任务

作为第一个任务，让我们修改代码，使服务器响应 `"Hello Elysia!"` 而不是 `"Hello World!"`。

请随意查看代码编辑器和预览部分，以熟悉环境。

\<template #answer>

您可以通过将 `.get` 方法中的内容从 `'Hello World!'` 改为 `'Hello Elysia!'` 来改变响应。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello World!') // [!code --]
	.get('/', 'Hello Elysia!') // [!code ++]
	.listen(3000)
```

这将使 Elysia 在您访问 `/` 时响应 `"Hello Elysia!"`。
