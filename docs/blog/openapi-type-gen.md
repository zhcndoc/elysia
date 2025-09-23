---
title: 为 Elysia 推出 OpenAPI 类型生成器
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: 为 Elysia 推出 OpenAPI 类型生成器

    - - meta
      - name: 'description'
        content: Elysia 现支持 OpenAPI 类型生成器，这是一个强大的工具，可以自动从你的 Elysia 路由和类型生成 OpenAPI 文档，无需任何手动注解。

    - - meta
      - property: 'og:description'
        content: Elysia 现支持 OpenAPI 类型生成器，这是一个强大的工具，可以自动从你的 Elysia 路由和类型生成 OpenAPI 文档，无需任何手动注解。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/openapi-type-gen/cover.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/openapi-type-gen/cover.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
title="为 Elysia 推出 OpenAPI 类型生成器"
src="/blog/openapi-type-gen/cover.webp"
alt="OpenAPI 类型生成器：Elysia 的自动 API 文档"
author="saltyaom"
date="2025年9月4日"
>

API 文档在 API 开发中起着至关重要的作用。

与团队、供应商或第三方服务的联系通常需要良好文档化的 API，以确保顺利的集成与协作。

如今大多数框架仍将手动编写 OpenAPI 注解的负担留给开发者。这不仅耗时，而且易出错，且随着 API 演进，维护起来也十分困难。

### 但 Elysia 对 OpenAPI 十分重视
我们相信 API 文档应该是轻松且自动的，让开发者专注于构建优秀的 API，而无需担心文档的问题。

这就是为什么我们从一开始就在 Elysia 中围绕 OpenAPI 构建。

- 我们确保同一份 schema 能用于数据验证、类型推断以及 OpenAPI 注解。
- 我们提供与标准 Schema（如 Zod、Valibot 等）的集成支持，并尽可能将其转换为 OpenAPI 文档。
- 我们有一个一行代码的 OpenAPI 插件，集成了漂亮的 UI —— Scalar，方便你与 API 交互。

![Scalar 预览](/blog/openapi-type-gen/scalar-preview-light.webp)

> Elysia 通过一行代码集成的 Scalar UI，来自 Elysia OpenAPI 插件

即便体验已经非常出色，我们仍希望进一步提升。

今天，我们很高兴地宣布推出 **OpenAPI 类型生成器**，它能基于你的 Elysia 代码自动生成 OpenAPI 文档，完全无需手动注解。

## OpenAPI 类型生成器

我们梦想有这样一个世界：你只写代码，文档便能自动且准确生成，且无需任何手动注解。

目前最接近的是 **Python 的 FastAPI**，它可以从 pydantic 模型生成 OpenAPI 文档。但它仅限于 pydantic，无法适配其他库或类型。

Elysia 类型生成器为 TypeScript 带来类似体验，没有这种限制。它允许你将 **任意 TypeScript 类型** 自动转化为 OpenAPI 文档，支持 **任何库**，不限于 Elysia。

![Elysia 类型生成器](/blog/openapi-type-gen/type-gen.webp)

> Elysia 自动将引用的响应体类型映射为响应 schema，无需任何手动 schema 注解，即可列出所有可能的响应状态码。

只需**一行代码**，即可从 Elysia 代码直接通过 **TypeScript 类型** 生成 OpenAPI 文档，完全无需注解。

### 这真是开创性的突破

首次实现了真正无需手动注解即可自动化完成 API 文档编写。开箱即用，兼容任何库。

<!-- 类型生成是通过分析 Elysia 实例的类型，基于 Elysia 在类型严谨性上的投资，自动生成对应的 OpenAPI 文档。 -->

它兼容现有的 Elysia 代码和 schema 定义，无需破坏性变更，也无需额外配置或类型转换工具（如 Typia）。

类型生成与现有 schema 定义共存，优先采用已有 schema，之后才从类型推断。

![使用 Drizzle 和类型生成器 Elysia 类型生成器](/blog/openapi-type-gen/drizzle-typegen.webp)

> 从 Elysia 路由处理器返回的 Drizzle 查询结果会自动推断为 OpenAPI schema。

它开箱即用兼容任何 TypeScript 库，甚至支持像 **Drizzle**、**Prisma** 这样现代复杂的类型。

### 类型严谨性
OpenAPI 类型生成器还支持多状态码的复杂场景，例如生命周期或宏下多个状态码重复。

每个状态码可返回多种值，Elysia 会将其合并为该状态码下的联合类型，准确列出所有可能返回值。

![联合响应](/blog/openapi-type-gen/union.webp)
> 自动列出联合类型中多个响应状态码。

这是一项深远的功能，几乎无法被其他框架复制。

## 采用 OpenAPI 类型生成器
要将 OpenAPI 类型生成器添加到你的项目，只需：

1. 导出一个 Elysia 实例
2. 提供根 Elysia 文件路径（若不提供，默认使用 `src/index.ts`）

```ts
import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

export const app = new Elysia() // [!code ++]
	.use(
		openapi({
			references: fromTypes() // [!code ++]
		})
	)
```

Elysia 类型生成器会自动分析你的 Elysia 实例，实时生成 OpenAPI 文档，无需构建步骤。

关于 OpenAPI 类型生成器的详细文档，请参见 [模式：OpenAPI](/patterns/openapi#openapi-from-types)。

---

### 我们相信这功能是 Elysia 独有

大多数 Web 框架都需要大量工作和手动注解来创建 API 文档。

Elysia 能为你自动完成 API 文档的编写，目前没有任何其它框架能提供接近的体验。

这都归功于 **Elysia 对端到端类型安全的出色支持**。

我们期待它能帮助你以最小的精力构建和维护高质量 API 文档。

你可以从今天开始，通过升级 `@elysiajs/openapi` 到最新版，或从 [GitHub 仓库](https://github.com/saltyaom/elysia-typegen-example) 体验我们的示例配置来尝试这一功能。
</Blog>