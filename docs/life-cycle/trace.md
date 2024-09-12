---
title: Trace
head:
    - - meta
      - property: 'og:title'
        content: Trace - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Trace 是一个用于测量服务器性能的 API。它允许我们与每个生命周期事件的持续时间进行交互，并测量每个函数的性能，以识别服务器的性能瓶颈。

    - - meta
      - name: 'og:description'
        content: Trace 是一个用于测量服务器性能的 API。它允许我们与每个生命周期事件的持续时间进行交互，并测量每个函数的性能，以识别服务器的性能瓶颈。
---

# 追踪

性能是 Elysia 的重要方面。

我们不仅仅希望在基准测试中快速，更希望你在实际场景中拥有一个真正快速的服务器。

有很多因素可能会减慢我们的应用 - 很难识别它们，但 **trace** 可以帮助解决这个问题，通过为每个生命周期注入开始和停止代码。

Trace 允许我们为每个生命周期事件的开始和结束注入代码，块和交互函数的执行。

## 追踪
Trace 使用回调监听器来确保在继续到下一个生命周期事件之前回调函数已经完成。

要使用 `trace`，你需要在 Elysia 实例上调用 `trace` 方法，并传递一个回调函数，该函数将为每个生命周期事件执行。

你可以通过添加 `on` 前缀和生命周期名称来监听每个生命周期，例如使用 `onHandle` 来监听 `handle` 事件。

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .trace(async ({ onHandle }) => {
	    onHandle(({ begin, onStop }) => {
			onStop(({ end }) => {
        		console.log('handle took', end - begin, 'ms')
			})
	    })
    })
    .get('/', () => 'Hi')
    .listen(3000)
```

请参考 [Life Cycle Events](/essential/life-cycle#events) 获取更多信息：

![Elysia Life Cycle](/assets/lifecycle.webp)

## 子项
除了 `handle` 之外，每个事件都有子项，这是在每个生命周期事件中执行的事件的数组。

你可以使用 `onEvent` 按顺序监听每个子事件。

```ts twoslash
import { Elysia } from 'elysia'

const sleep = (time = 1000) =>
    new Promise((resolve) => setTimeout(resolve, time))

const app = new Elysia()
    .trace(async ({ onBeforeHandle }) => {
        onBeforeHandle(({ total, onEvent }) => {
            console.log('total children:', total)

            onEvent(({ onStop }) => {
                onStop(({ elapsed }) => {
                    console.log('child took', elapsed, 'ms')
                })
            })
        })
    })
    .get('/', () => 'Hi', {
        beforeHandle: [
            function setup() {},
            async function delay() {
                await sleep()
            }
        ]
    })
    .listen(3000)
```

在这个例子中，total children 将会是 `2`，因为在 `beforeHandle` 事件中有 2 个子事件。

然后我们通过使用 `onEvent` 监听每个子事件，并打印每个子事件的持续时间。

## 追踪参数
当每个生命周期被调用时

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	// 这是 trace 参数
	// 悬停以查看类型
	.trace((parameter) => {
	})
	.get('/', () => 'Hi')
	.listen(3000)
```

`trace` 接受以下参数：

### id - `number`
为每个请求随机生成的唯一 ID

### context - `Context`
Elysia 的 [Context](/essential/context)，例如 `set`, `store`, `query, `params`

### set - `Context.set`
`context.set` 的快捷方式，用于设置 headers 或 context 的状态

### store - `Singleton.store`
`context.store` 的快捷方式，用于访问上下文中的数据

### time - `number`
请求被调用的时间戳

### on[Event] - `TraceListener`
每个生命周期事件的监听器。

你可以监听以下生命周期：
-   **onRequest** - 每次新请求都会通知
-   **onParse** - 用于解析 body 的函数数组
-   **onTransform** - 在验证之前转换请求和上下文
-   **onBeforeHandle** - 在处理主处理器之前检查自定义要求，如果返回响应，可以跳过主处理器。
-   **onHandle** - 分配给路径的函数
-   **onAfterHandle** - 在将响应发送回客户端之前与响应交互
-   **onMapResponse** - 将返回值映射到 Web Standard Response
-   **onError** - 处理在处理请求期间抛出的错误
-   **onAfterResponse** - 发送响应后的清理函数

## 追踪侦听器
每个生命周期事件的监听器

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.trace(({ onBeforeHandle }) => {
		// 这是 trace 监听器
		// 悬停以查看类型
		onBeforeHandle((parameter) => {

		})
	})
	.get('/', () => 'Hi')
	.listen(3000)
```

每个生命周期监听器接受以下参数：

### name - `string`
函数的名称，如果函数是匿名的，名称将是 `anonymous`

### begin - `number`
函数开始的时间

### end - `Promise<number>`
函数结束的时间，将在函数结束时解析

### error - `Promise<Error | null>`
在生命周期中抛出的错误，将在函数结束时解析

### onStop - `callback?: (detail: TraceEndDetail) => any`
一个回调，将在生命周期结束后执行

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.trace(({ onBeforeHandle, set }) => {
		onBeforeHandle(({ onStop }) => {
			onStop(({ elapsed }) => {
				set.headers['X-Elapsed'] = elapsed.toString()
			})
		})
	})
	.get('/', () => 'Hi')
	.listen(3000)
```

建议在这个函数中修改上下文，因为存在锁定机制，以确保在继续到下一个生命周期事件之前上下文成功修改。

## 追踪结束
传递给 `onStop` 回调的参数

### end - `number`
函数结束的时间

### error - `Error | null`
在生命周期中抛出的错误

### elapsed - `number`
生命周期或 `end - begin` 的持续时间
