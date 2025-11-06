---
title: 扩展上下文 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 扩展上下文 - ElysiaJS

    - - meta
      - name: 'description'
        content: 学习如何使用 Decorate、State、Resolve 和 Derive 来扩展 Elysia 的上下文，以增强您的网络应用程序。

    - - meta
      - property: 'og:description'
        content: 学习如何使用 Decorate、State、Resolve 和 Derive 来扩展 Elysia 的上下文，以增强您的网络应用程序。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# 扩展上下文

Elysia 提供了一个上下文，它配备了小工具，帮助您入门。

您可以通过以下方式扩展 Elysia 的上下文：
1. <DocLink href="/essential/handler.html#decorate">Decorate</DocLink>
2. <DocLink href="/essential/handler.html#state">State</DocLink>
3. <DocLink href="/essential/handler.html#resolve">Resolve</DocLink>
4. <DocLink href="/essential/handler.html#derive">Derive</DocLink>

## Decorate
**单例**，且是**不可变**的，跨所有请求共享。

```typescript
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

装饰后的值将在上下文中作为只读属性可用，详见 <DocLink href="/essential/handler.html#decorate">Decorate</DocLink>。

## State
一个**可变**的引用，跨所有请求共享。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.state('count', 0)
	.get('/', ({ store }) => {
		store.count++

		return store.count
	})
```

状态将在每个请求共享的 **context.store** 中可用，详见 <DocLink href="/essential/handler.html#state">State</DocLink>。

## Resolve / Derive

<DocLink href="/essential/handler.html#decorate">Decorate</DocLink> 的值注册为单例。

而 <DocLink href="/essential/handler.html#resolve">Resolve</DocLink> 和 <DocLink href="/essential/handler.html#derive">Derive</DocLink> 允许您每个请求抽象一个上下文值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.derive(({ headers: { authorization } }) => ({
		authorization
	}))
	.get('/', ({ authorization }) => authorization)
```

任何**返回的值都会在上下文中可用**，除了状态，它将直接发送给客户端，并中止后续处理程序。

两个 <DocLink href="/essential/handler.html#resolve">resolve</DocLink> 和 <DocLink href="/essential/handler.html#derive">derive</DocLink> 的语法相似，但使用场景不同。

在底层，两者是一个语法糖 <small>(具有类型安全)</small> 的生命周期：
- <DocLink href="/essential/handler.html#derive">derive</DocLink> 基于 <DocLink href="/essential/life-cycle.html#transform">transform</DocLink>
- <DocLink href="/essential/handler.html#resolve">resolve</DocLink> 基于 <DocLink href="/essential/life-cycle.html#before-handle">before handle</DocLink>

由于 <DocLink href="/essential/handler.html#resolve">derive</DocLink> 基于 <DocLink href="/essential/life-cycle.html#transform">transform</DocLink>，这意味着数据尚未验证且未强制/转换。如果您需要经过验证的数据，最好使用 <DocLink href="/essential/handler.html#resolve">resolve</DocLink>。

## 作用域
<DocLink href="/essential/handler.html#state">State</DocLink> 和 <DocLink href="/essential/handler.html#decorate">Decorate</DocLink> 是跨所有请求和实例共享的。

<br />

<DocLink href="/essential/handler.html#resolve">Resolve</DocLink> 和 <DocLink href="/essential/handler.html#derive">Derive</DocLink> 是每个请求都有的，并具有封装作用域 <small>(因为它们基于生命周期事件)</small>。

如果您想使用来自插件的解析/派生值，您需要声明一个 <DocLink href="/essential/plugin.html#scope">Scope</DocLink>。

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
	.derive(
		{ as: 'scoped' }, // [!代码 ++]
		({ headers: { authorization } }) => ({
			authorization
		})
	)

new Elysia()
	.use(plugin)
	.get('/', ({ authorization }) => authorization)
	.listen(3000)
```

## 练习

让我们尝试扩展 Elysia 的上下文。

<template #answer>

我们可以使用 <DocLink href="/essential/handler.html#resolve">resolve</DocLink> 从查询中提取年龄。

```typescript
import { Elysia, t } from 'elysia'

class Logger {
	log(info: string) {
		console.log(info)
	}
}

new Elysia()
	.decorate('logger', new Logger())
	.onRequest(({ request, logger }) => {
		logger.log(`Request to ${request.url}`)
	})
	.guard({
		query: t.Optional(
			t.Object({
				age: t.Number({ min: 15 })
			})
		)
	})
	.resolve(({ query: { age }, status }) => {
		if(!age) return status(401)

		return { age }
	})
	.get('/profile', ({ age }) => age)
	.listen(3000)
```

</template>

</Editor>