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

<Editor :code="code" :testcases="testcases" doc="/patterns/extends-context">

# 扩展上下文

Elysia 提供了一个上下文，它配备了小工具，帮助您入门。

您可以使用以下方式扩展 Elysia 的上下文：
1. <DocLink href="/essential/handler.html#decorate">装饰（Decorate）</DocLink>
2. <DocLink href="/essential/handler.html#state">状态（State）</DocLink>
3. <DocLink href="/essential/handler.html#resolve">解析（Resolve）</DocLink>
4. <DocLink href="/essential/handler.html#derive">派生（Derive）</DocLink>

## Decorate
**单例**，且**不可变**的属性，所有请求共享。

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

装饰后的值将在上下文中作为只读属性可用，详见 <DocLink href="/essential/handler.html#decorate">装饰（Decorate）</DocLink>。

## State
一个**可变的**引用，所有请求共享。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.state('count', 0)
	.get('/', ({ store }) => {
		store.count++

		return store.count
	})
```

状态将在每个请求共享的 **context.store** 中可用，详见 <DocLink href="/essential/handler.html#state">状态（State）</DocLink>。

## Resolve / Derive

<DocLink href="/essential/handler.html#decorate">装饰（Decorate）</DocLink> 的值注册为单例。

而 <DocLink href="/essential/handler.html#resolve">解析（Resolve）</DocLink> 和 <DocLink href="/essential/handler.html#derive">派生（Derive）</DocLink> 允许您为每个请求抽象一个上下文值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.derive(({ headers: { authorization } }) => ({
		authorization
	}))
	.get('/', ({ authorization }) => authorization)
```

任何**返回的值都会在上下文中可用**，除了状态（status），它会直接发送给客户端，并中止后续处理器。

两个 <DocLink href="/essential/handler.html#resolve">解析（resolve）</DocLink> 和 <DocLink href="/essential/handler.html#derive">派生（derive）</DocLink> 的语法相似，但使用场景不同。

在底层，两者是一个语法糖 <small>（具有类型安全）</small> 的生命周期：
- <DocLink href="/essential/handler.html#derive">派生（derive）</DocLink> 基于 <DocLink href="/essential/life-cycle.html#transform">转换（transform）</DocLink>
- <DocLink href="/essential/handler.html#resolve">解析（resolve）</DocLink> 基于 <DocLink href="/essential/life-cycle.html#before-handle">处理前（before handle）</DocLink>

由于 <DocLink href="/essential/handler.html#resolve">解析（resolve）</DocLink> 是基于 <DocLink href="/essential/life-cycle.html#transform">转换（transform）</DocLink> 的，这意味着数据尚未验证，也未进行强制转换/转换。如果你需要验证过的数据，建议使用 <DocLink href="/essential/handler.html#resolve">解析（resolve）</DocLink>。

## 作用域
<DocLink href="/essential/handler.html#state">状态（State）</DocLink> 和 <DocLink href="/essential/handler.html#decorate">装饰（Decorate）</DocLink> 是跨所有请求和实例共享的。

<br />

<DocLink href="/essential/handler.html#resolve">解析（Resolve）</DocLink> 和 <DocLink href="/essential/handler.html#derive">派生（Derive）</DocLink> 是每个请求的，且有封装作用域 <small>（因为它们基于生命周期事件）</small>。

如果您想使用来自插件的解析/派生值，您需要声明一个 <DocLink href="/essential/plugin.html#scope">作用域（Scope）</DocLink>。

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

我们可以使用 <DocLink href="/essential/handler.html#resolve">解析（resolve）</DocLink> 从查询中提取年龄。

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
		logger.log(`请求地址 ${request.url}`)
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