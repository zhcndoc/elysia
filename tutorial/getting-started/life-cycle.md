---
url: 'https://elysiajs.com/tutorial/getting-started/life-cycle.md'
---

# 生命周期

生命周期 **钩子** 是在请求-响应周期中的特定事件上执行的函数。

它们允许你在特定的时刻运行自定义逻辑

* request - 当收到请求时
* beforeHandle - 在执行处理器之前
* afterResponse - 在发送响应之后，等等。
* error - 当发生错误时

这对于日志记录、身份验证等任务非常有用。

要注册生命周期钩子，你可以将其传递给路由方法的第三个参数：

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/1', () => '你好，Elysia！')
	.get('/auth', () => {
		console.log('这是在 "beforeHandle" 之后执行的')

		return '哦，你真幸运！'
	}, {
		beforeHandle({ request, status }) {
			console.log('这是在处理器之前执行的')

			if(Math.random() <= 0.5)
				return status(418)
		}
	})
	.get('/2', () => '你好，Elysia！')
```

当 `beforeHandle` 返回一个值时，它将跳过处理器并返回该值。

这对于像身份验证这样的事情非常有用，当用户未进行身份验证时，你想返回 `401 Unauthorized` 响应。

请参见 生命周期，处理之前 以获得更详细的说明。

## 钩子

一个拦截 **生命周期事件** 的函数。 因为一个函数 **“钩住”** 了生命周期事件

钩子可以分为两种类型：

1. 本地钩子 - 在特定路由上执行
2. 拦截器钩子 - 在每个路由上执行 **在钩子注册后**

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，你可以将钩子内联到路由处理器中：

```typescript
// 类似于之前的代码片段
import { Elysia } from 'elysia'

new Elysia()
	.get('/1', () => '你好，Elysia！')
	.get('/auth', () => {
		console.log('在 "beforeHandle" 之后运行')

		return '哦，你真幸运！'
	}, {
		// 这是一个本地钩子
		beforeHandle({ request, status }) {
			console.log('在处理器之前运行')

			if(Math.random() <= 0.5)
				return status(418)
		}
	})
	.get('/2', () => '你好，Elysia！')
```

## 拦截器钩子

在每个 **钩子被调用后到来的处理器** 中注册钩子，仅针对当前实例。

要添加拦截器钩子，你可以使用 `.on` 后跟一个生命周期事件：

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/1', () => '你好，Elysia！')
	.onBeforeHandle(({ request, status }) => {
		console.log('这是在处理器之前执行的')

		if(Math.random() <= 0.5)
			return status(418)
	})
	// "beforeHandle" 被应用
	.get('/auth', () => {
		console.log('这是在 "beforeHandle" 之后执行的')

		return '哦，你真幸运！'
	})
	// "beforeHandle" 也被应用
	.get('/2', () => '你好，Elysia！')
```

与本地钩子不同，拦截器钩子会将钩子添加到钩子注册后到来的每个路由。

## 实践

让我们将两种类型的钩子付诸实践。

\<template #answer>

我们可以使用 `beforeHandle` 在请求到达处理器之前拦截请求，并使用 `status` 方法返回响应。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onBeforeHandle(({ query: { name }, status }) => {
		if(!name) return status(401)
	})
	.get('/auth', ({ query: { name = 'anon' } }) => {
		return `你好 ${name}！`
	})
	.get('/profile', ({ query: { name = 'anon' } }) => {
		return `你好 ${name}！`
	})
	.listen(3000)
```
