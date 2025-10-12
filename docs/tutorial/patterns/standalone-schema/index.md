---
title: 独立模式 - Elysia 教程
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 独立模式 - Elysia 教程

    - - meta
      - name: 'description'
        content: 学习如何在 Elysia 中使用独立模式来定义可重用的验证模式，这些模式与特定路由的模式共存。

    - - meta
      - property: 'og:description'
        content: 学习如何在 Elysia 中使用独立模式来定义可重用的验证模式，这些模式与特定路由的模式共存。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 独立模式

当我们使用 <DocLink href="/essential/validation.html#guard">保护器</DocLink> 定义一个模式时，模式将被添加到一个路由。但如果该路由提供了一个模式，它将被 **覆盖**：

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		body: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/user',
		({ body }) => body,
		{
			// 这将覆盖保护器模式
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

如果我们想要一个模式与路由模式 **共存**，我们可以将其定义为 **独立模式**：

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		body: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/user',
		// body 将同时拥有 age 和 name 属性
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

## 模式库的互操作性

独立模式之间的模式可以来自不同的验证库。

例如，你可以使用 **zod** 定义独立模式，而使用 **Elysia.t** 定义本地模式，两者可以互换使用。

## 任务

通过使用独立模式来使请求体中的 `age` 和 `name` 属性变为必需。

<template #answer>

我们可以通过在保护器选项中添加 `schema: 'standalone'` 来定义独立模式。

```typescript
import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		body: z.object({
			age: z.number()
		})
	})
	.post(
		'/user',
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

</template>

</Editor>