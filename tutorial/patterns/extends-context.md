---
url: 'https://elysiajs.com/tutorial/patterns/extends-context.md'
---

# 扩展上下文

Elysia 提供了一个上下文，它配备了小工具，帮助您入门。

您可以通过以下方式扩展 Elysia 的上下文：

1. Decorate
2. State
3. Resolve
4. Derive

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

装饰后的值将在上下文中作为只读属性可用，详见 Decorate。

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

状态将在每个请求共享的 **context.store** 中可用，详见 State。

## Resolve / Derive

Decorate 的值注册为单例。

而 Resolve 和 Derive 允许您每个请求抽象一个上下文值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.derive(({ headers: { authorization } }) => ({
		authorization
	}))
	.get('/', ({ authorization }) => authorization)
```

任何**返回的值都会在上下文中可用**，除了状态，它将直接发送给客户端，并中止后续处理程序。

两个 resolve 和 derive 的语法相似，但使用场景不同。

在底层，两者是一个语法糖 (具有类型安全) 的生命周期：

* derive 基于 transform
* resolve 基于 before handle

由于 derive 基于 transform，这意味着数据尚未验证且未强制/转换。如果您需要经过验证的数据，最好使用 resolve。

## 作用域

State 和 Decorate 是跨所有请求和实例共享的。

Resolve 和 Derive 是每个请求都有的，并具有封装作用域 (因为它们基于生命周期事件)。

如果您想使用来自插件的解析/派生值，您需要声明一个 Scope。

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

\<template #answer>

我们可以使用 resolve 从查询中提取年龄。

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
