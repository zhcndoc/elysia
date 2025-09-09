---
title: 为 Elysia 推出 OpenAPI 类型生成器
sidebar: false
editLink: false
search: false
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

OpenAPI 是用于记录 RESTful API 的注释标准。

它提供了一种描述 API 结构和行为的标准方式，使开发者更容易理解和使用这些接口。

如今大多数网络框架通常需要大量手动注释和努力才能创建 API 文档，这既繁琐又容易出错。Elysia 拥有对 OpenAPI 的卓越支持，采用自有的 schema 既可以用于数据验证、类型推断，也可作为 OpenAPI 注解的唯一可信来源。

Elysia 还提供了可交互的文档展示，使用 Scalar 或 Swagger UI，只需一行代码即可通过 OpenAPI 插件实现。

<img src=/blog/openapi-type-gen/scalar-preview-light.webp alt="Scalar 预览" class="border border-gray-100" />

> Elysia 运行的 Scalar UI，来自 Elysia OpenAPI 插件

即使拥有如此卓越的体验，我们仍希望更进一步。

今天，我们很高兴地宣布发布 **OpenAPI 类型生成器**，它能从你的 Elysia 服务器自动生成 OpenAPI 文档，无需任何手动注解。

## OpenAPI 类型生成器

只需 **一行代码**，你现在就可以无需任何手动 schema 注解，从你的 Elysia 服务器生成 OpenAPI 文档。

![Elysia 类型生成器](/blog/openapi-type-gen/type-gen.webp)

> Elysia 会自动将引用的响应体类型生成响应 schema，列出所有可能的响应状态码，无需手动 schema 注解。

让你只需一行代码就拥有完整且准确的 API 文档，无需手动注解。

类型生成通过分析你的 Elysia 实例类型来生成相应的 OpenAPI 文档，这得益于 Elysia 对强类型安全性和完整性的投入。

它能与现有的 Elysia 代码库和 schema 定义协同工作，无需任何破坏性变更或额外配置（如类型转换工具 Typia），并优先使用已有的 schema 定义，缺失时才回退到从类型推断。

![使用 Drizzle 和类型生成器 Elysia 类型生成器](/blog/openapi-type-gen/drizzle-typegen.webp)

> 从 Elysia 路由处理器返回的 Drizzle 查询结果会自动推断为 OpenAPI schema。

它还兼容来自现代库如 **Drizzle**、Prisma 的复杂类型，只需从路由处理器返回对应值即可。

## 采用 OpenAPI 类型生成器
要在你的代码中使用此功能，只需：

1. 导出一个 Elysia 实例
2. 提供类型生成器的文件路径

```ts
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { fromTypes } from '@elysiajs/openapi/gen' // [!code ++]

export const app = new Elysia() // [!code ++]
	.use(
		openapi({
			references: fromTypes('src/index.ts') // [!code ++]
		})
	)
```

Elysia 类型生成器会自动分析你的 Elysia 实例，并实时生成 OpenAPI 文档。

关于 OpenAPI 类型生成器的文档，详见 [模式：OpenAPI](/patterns/openapi#openapi-from-types)。

---

### 我们相信此功能为 Elysia 独有

多数网络框架（不仅限 JavaScript 生态）创建高质量 API 文档时需要大量手动注解，且难以维护。Elysia 开箱即用，提供完整且准确的 API 文档。

这得益于 **Elysia 对端到端类型安全性的出色支持**。

我们期待看到它如何帮助你用最小的精力构建和维护高质量 API 文档。

你可以今天就通过升级 `@elysiajs/openapi` 至最新版，或从 [GitHub 仓库](https://github.com/saltyaom/elysia-typegen-example) 体验我们的示例配置来尝试此功能。
</Blog>