---
title: 流
head:
  - - meta
    - property: 'og:title'
      content: 流 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 在 Elysia 中返回响应流时，我们可以使用生成器函数，它将自动转换为流响应，通过返回使用 yield。

  - - meta
    - property: 'og:description'
      content: 在 Elysia 中返回响应流时，我们可以使用生成器函数，它将自动转换为流响应，通过返回使用 yield。
---

# 流
要使用带有 `yield` 关键字的生成器函数，直接返回一个响应流。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

在这个例子中，我们可以通过使用 `yield` 关键字来流式发送响应。

## 设置头信息
Elysia 将推迟返回响应头，直到第一个块被产生。

这使我们能够在响应被流式传输之前设置头信息。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		// This will set headers
		set.headers['x-name'] = 'Elysia'
		yield 1
		yield 2

		// This will do nothing
		set.headers['x-id'] = '1'
		yield 3
	})
```

一旦第一个块被产生，Elysia 将发送头信息和第一个块在同一个响应中。

在第一个块被产生后设置头信息将不起作用。

## 条件流
如果响应没有 yield 返回，Elysia 将自动将流转换为正常响应。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		if (Math.random() > 0.5) return 'ok'

		yield 1
		yield 2
		yield 3
	})
```

这使我们能够根据需要条件性地流式发送响应或返回正常响应。

## 中止
在流式发送响应时，请求在响应完全流式发送之前被取消是常见的。

如果请求被取消，Elysia 将自动停止生成器函数。

## Eden
Eden 将流响应解释为 `AsyncGenerator`，允许我们使用 `for await` 循环来消费流。

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
```
