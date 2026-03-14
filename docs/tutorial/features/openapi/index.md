---
title: OpenAPI - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI - Elysia 教程

    - - meta
      - name: 'description'
        content: Elysia 是基于 OpenAPI 构建的，开箱即支持 OpenAPI 文档。

    - - meta
      - property: 'og:description'
        content: Elysia 是基于 OpenAPI 构建的，开箱即支持 OpenAPI 文档。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/patterns/openapi">

# OpenAPI

Elysia 是基于 OpenAPI 构建的，开箱即支持 OpenAPI 文档。

我们可以使用 <DocLink href="/patterns/openapi">OpenAPI 插件</DocLink> 来展示 API 文档。

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi()) // [!code ++]
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number()
			})
		}
	)
	.listen(3000)
```

添加后，我们可以在 <a href="/playground/preview" target="_blank">**/openapi**</a> 访问我们的 API 文档。

## Detail
我们可以通过 `detail` 字段提供符合 OpenAPI 3.0 规范的 API 文档（带自动补全）：

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number()
			}),
			detail: { // [!code ++]
				summary: '创建用户', // [!code ++]
				description: '根据年龄创建用户', // [!code ++]
				tags: ['用户'], // [!code ++]
			} // [!code ++]
		}
	)
	.listen(3000)
```

## 参考模型
我们也可以定义可重用的模式，使用 <DocLink href="https://elysiajs.com/essential/validation.html#reference-model">参考模型</DocLink>：

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.model({
		age: t.Object({ // [!code ++]
			age: t.Number() // [!code ++]
		}) // [!code ++]
	})
	.post(
		'/',
		({ body }) => body,
		{
			age: t.Object({ // [!code --]
				age: t.Number() // [!code --]
			}), // [!code --]
			body: 'age',  // [!code ++]
			detail: {
				summary: '创建用户',
				description: '根据年龄创建用户',
				tags: ['用户'],
			}
		}
	)
	.listen(3000)
```

当我们定义一个参考模型时，它将显示在 OpenAPI 文档的 **组件** 部分。

## 类型生成
<DocLink href="/blog/openapi-type-gen.html">OpenAPI 类型生成</DocLink> 可以自动为您的 API 生成文档，**无需手动注释**，直接从 TypeScript 类型推断。<small>无需 Zod、TypeBox、手动接口声明等。</small>

**此功能是 Elysia 独有的**，其他 JavaScript 框架中不可用。

例如，如果您使用 Drizzle ORM 或 Prisma，Elysia 可以直接从查询中推断出模式。

![Drizzle](/blog/openapi-type-gen/drizzle-typegen.webp)

> 从 Elysia 路由处理程序返回的 Drizzle 查询将被自动推断为 OpenAPI 模式。

要使用 <DocLink href="/blog/openapi-type-gen.html">OpenAPI 类型生成</DocLink>，只需在 `openapi` 插件之前使用 `fromTypes` 插件。

```typescript
import { Elysia } from 'elysia'

import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi({
		references: fromTypes() // [!code ++]
	}))
	.get('/', { hello: 'world' })
	.listen(3000)
```

### 浏览器环境

遗憾的是，该功能需要 **fs** 模块来读取您的源代码，无法在此 Web Playground 使用。因为 Elysia 是直接在您的浏览器中运行（而非独立服务器）。

您可以在本地尝试此功能，使用 <a href="https://github.com/SaltyAom/elysia-typegen-example" target="_blank">Type Gen 示例仓库</a>：

```bash
git clone https://github.com/SaltyAom/elysia-typegen-example && \
cd elysia-typegen-example && \
bun install && \
bun run dev
```

## 作业

让我们使用预览页面 **GET '/openapi'**，看看我们的 API 文档效果。

这个 API 文档是从你的代码自动生成的。

尝试修改代码，看看文档如何变化！

</Editor>