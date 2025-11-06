---
title: 处理器与上下文 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 处理器与上下文 - Elysia 教程

    - - meta
      - name: 'description'
        content: 处理器是一个资源或路由函数，用于向客户端发送数据。上下文包含有关每个请求的信息。

    - - meta
      - property: 'og:description'
        content: 处理器是一个资源或路由函数，用于向客户端发送数据。上下文包含有关每个请求的信息。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import { Cog } from 'lucide-vue-next'
import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 处理器与上下文

**处理器** - 一个资源或路由函数，用于向客户端发送数据。

```ts
import { Elysia } from 'elysia'

new Elysia()
    // `() => 'hello world'` 是一个处理器
    .get('/', () => 'hello world')
    .listen(3000)
```

处理器也可以是一个字面值，见 <DocLink href="/essential/handler">处理器</DocLink>

```ts
import { Elysia } from 'elysia'

new Elysia()
    // `'hello world'` 是一个处理器
    .get('/', 'hello world')
    .listen(3000)
```

使用内联值对于静态资源如 **文件** 是有用的。

## 上下文

包含有关每个请求的信息。它作为处理器的唯一参数传递。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', (context) => context.path)
            // ^ 这是一个上下文
```

**上下文** 存储关于请求的信息，例如：
- <DocLink href="/essential/validation#body">body</DocLink> - 客户端发送到服务器的数据，如表单数据、JSON 负载。
- <DocLink href="/essential/validation#query">query</DocLink> - 作为对象的查询字符串。<small>(查询是从路径名以 '?' 问号开始的值中提取的)</small>
- <DocLink href="/essential/validation#params">params</DocLink> - 解析为对象的路径参数
- <DocLink href="/essential/validation#headers">headers</DocLink> - HTTP 头，关于请求的附加信息，如 "Content-Type"。

请参见 <DocLink href="/essential/handler#context">上下文</DocLink>。

## 预览

您可以通过查看 **编辑器** 部分来预览结果。

在预览窗口的 **左上角** 应该有一个小导航器。

您可以使用它在路径和方法之间切换以查看响应。

您还可以点击 <Cog class="inline -translate-y-0.5" :size="18" stroke-width="2" /> 来编辑请求体和头部。

## 练习

让我们尝试提取上下文参数：

<template #answer>

1. 我们可以从回调函数的第一个值中提取 `body`、`query` 和 `headers`。
2. 然后我们可以像 `{ body, query, headers }` 这样返回它们。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.post('/', ({ body, query, headers }) => {
		return {
			query,
			body,
			headers
		}
	})
	.listen(3000)
```

</template>

</Editor>