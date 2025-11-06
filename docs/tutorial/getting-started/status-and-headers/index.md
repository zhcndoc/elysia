---
title: 状态码与响应头 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 状态码与响应头 - Elysia 教程

    - - meta
      - name: 'description'
        content: 了解如何在 Elysia 中管理状态码和响应头，以有效控制 HTTP 响应。

    - - meta
      - property: 'og:description'
        content: 了解如何在 Elysia 中管理状态码和响应头，以有效控制 HTTP 响应。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 状态码

状态码是服务器处理请求的指示器。

当您访问一个不存在的页面时，您一定听说过臭名昭著的 **404 Not Found**。

那是一个 **状态码**。

默认情况下，Elysia 会对成功的请求返回 **200 OK**。

根据情况，Elysia 还返回许多其他状态码，例如：
- 400 Bad Request
- 422 Unprocessable Entity
- 500 Internal Server Error

您还可以通过在 `status` 函数中返回您的响应来返回状态码。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status }) => status(418, "我是一壶茶'"))
	.listen(3000)
```

请参阅 <DocLink href="/essential/handler#status">状态码</DocLink>。

## 重定向
同样，您还可以通过返回 `redirect` 函数将请求重定向到另一个 URL。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ redirect }) => redirect('https://elysiajs.com'))
	.listen(3000)
```

请参阅 <DocLink href="/essential/handler#redirect">重定向</DocLink>。

## 响应头
与状态码和重定向直接返回不同。

您可能会在应用程序中多次设置响应头。

因此，Elysia 提供了 `set.headers` 对象来设置响应头，而不是返回一个 `headers` 函数。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return '你好，世界'
	})
	.listen(3000)
```

因为 `headers` 是 **请求头**，Elysia 通过前缀 **set.headers** 来区分请求头和响应头。

请参阅 <DocLink href="/essential/handler#set-headers">响应头</DocLink>。

## 练习

让我们练习一下我们所学的内容。

<template #answer>

1. 要将状态码设置为 `418 我是一壶茶`，我们可以使用 `status` 函数。
2. 要将 `/docs` 重定向到 `https://elysiajs.com`，我们可以使用 `redirect` 函数。
3. 要将自定义头 `x-powered-by` 设置为 `Elysia`，我们可以使用 `set.headers` 对象。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status, set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return status(418, '你好 Elysia!')
	})
	.get('/docs', ({ redirect }) => redirect('https://elysiajs.com'))
	.listen(3000)
```

</template>

</Editor>