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
        content: Elysia 是围绕 OpenAPI 构建的，并支持开箱即用的 OpenAPI 文档。

    - - meta
      - property: 'og:description'
        content: Elysia 是围绕 OpenAPI 构建的，并支持开箱即用的 OpenAPI 文档。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# OpenAPI

Elysia 是围绕 OpenAPI 构建的，并支持开箱即用的 OpenAPI 文档。

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

## 详情
我们可以通过一个遵循 OpenAPI 3.0 规范的 `detail` 字段提供文档 API（支持自动补全）：

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
<DocLink href="/blog/openapi-type-gen.html">OpenAPI 类型生成</DocLink> 可以自动文档化您的 API **而无需手动注释**，直接从 TypeScript 类型推断。<small>无需 Zod、TypeBox、手动接口声明等。</small>

**此功能仅适用于 Elysia**，在其他 JavaScript 框架中不可用。

例如，如果您使用 Drizzle ORM 或 Prisma，Elysia 可以直接从查询中推断出模式。

![Drizzle](/blog/openapi-type-gen/drizzle-typegen.webp)

> 从 Elysia 路由处理程序返回 Drizzle 查询将被自动推断为 OpenAPI 模式。

要使用 <DocLink href="/blog/openapi-type-gen.html">OpenAPI 类型生成</DocLink>，只需在 `openapi` 插件之前应用 `fromTypes` 插件。

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

不幸的是，此功能需要一个 **fs** 模块来读取您的源代码，因此在此网页游乐场中不可用。由于 Elysia 直接在您的浏览器中运行（而不是在分离的服务器上）。

您可以在本地尝试此功能，使用 <a href="https://github.com/SaltyAom/elysia-typegen-example" target="_blank">Type Gen 示例仓库</a>：

```bash
git clone https://github.com/SaltyAom/elysia-typegen-example && \
cd elysia-typegen-example && \
bun install && \
bun run dev
```

## 作业

让我们使用预览来 **GET '/hono'** 以检查我们的 Hono 路由是否正常工作。

尝试修改代码，看看它如何改变！

</Editor>