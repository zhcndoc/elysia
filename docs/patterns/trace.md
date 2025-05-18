---
title: Trace - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Trace - ElysiaJS

    - - meta
      - name: 'description'
        content: Trace 是一个用于测量服务器性能的 API。它使我们能够与每个生命周期事件的持续时间进行交互，并测量每个函数的性能，以识别服务器的性能瓶颈。

    - - meta
      - name: 'og:description'
        content: Trace 是一个用于测量服务器性能的 API。它使我们能够与每个生命周期事件的持续时间进行交互，并测量每个函数的性能，以识别服务器的性能瓶颈。
---

# Trace

性能是 Elysia 一个重要的方面。

我们不仅希望在基准测试中快速运行，我们希望您在真实场景中拥有一个真正快速的服务器。

有许多因素可能会减慢我们的应用程序 - 并且很难识别它们，但 **trace** 可以通过在每个生命周期中注入开始和停止代码来帮助解决这个问题。

Trace 允许我们在每个生命周期事件的前后注入代码，从而阻止并与函数的执行进行交互。

## Trace
Trace 使用回调监听器以确保回调函数在移动到下一个生命周期事件之前完成。

要使用 `trace`，您需要在 Elysia 实例上调用 `trace` 方法，并传递一个将在每个生命周期事件中执行的回调函数。

您可以通过在生命周期名称前添加 `on` 前缀来监听每个生命周期，例如 `onHandle` 以监听 `handle` 事件。

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

有关更多信息，请参见 [生命周期事件](/essential/life-cycle#events)：

![Elysia 生命周期](/assets/lifecycle-chart.svg)

## 子事件
每个事件除了 `handle` 之外都有一个子事件，这是在每个生命周期事件内部执行的事件数组。

您可以使用 `onEvent` 来按顺序监听每个子事件。

```ts twoslash
import { Elysia } from 'elysia'

const sleep = (time = 1000) =>
    new Promise((resolve) => setTimeout(resolve, time))

const app = new Elysia()
    .trace(async ({ onBeforeHandle }) => {
        onBeforeHandle(({ total, onEvent }) => {
            console.log('总子事件:', total)

            onEvent(({ onStop }) => {
                onStop(({ elapsed }) => {
                    console.log('子事件耗时', elapsed, 'ms')
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

在此示例中，总子事件将为 `2`，因为在 `beforeHandle` 事件中有 2 个子事件。

然后，我们使用 `onEvent` 监听每个子事件，并打印每个子事件的持续时间。

## Trace 参数
每个生命周期被调用时

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
为每个请求随机生成的唯一 id

### context - `Context`
Elysia 的 [上下文](/essential/handler.html#context)，例如 `set`、`store`、`query``、`params`

### set - `Context.set`
`context.set` 的快捷方式，用于设置上下文的头部或状态

### store - `Singleton.store`
`context.store` 的快捷方式，用于访问上下文中的数据

### time - `number`
请求被调用的时间戳

### on[Event] - `TraceListener`
每个生命周期事件的事件监听器。

您可以监听以下生命周期：
-   **onRequest** - 通知每个新请求
-   **onParse** - 用于解析主体的函数数组
-   **onTransform** - 在验证之前转换请求和上下文
-   **onBeforeHandle** - 在主处理器之前检查的自定义要求，可以在返回响应时跳过主处理器。
-   **onHandle** - 分配给路径的函数
-   **onAfterHandle** - 在将响应发回客户端之前与响应进行交互
-   **onMapResponse** - 将返回值映射到 Web 标准响应
-   **onError** - 处理在处理请求期间抛出的错误
-   **onAfterResponse** - 在响应发送之后的清理函数

## Trace 监听器
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

每个生命周期监听器接受以下内容

### name - `string`
函数的名称，如果函数是匿名的，则名称将为 `anonymous`

### begin - `number`
函数开始执行的时间

### end - `Promise<number>`
函数结束时的时间，当函数结束时将解析

### error - `Promise<Error | null>`
在生命周期中抛出的错误，将在函数结束时解析

### onStop - `callback?: (detail: TraceEndDetail) => any`
在生命周期结束时将执行的回调

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

建议在此函数中修改上下文，因为有一个锁机制以确保上下文在移动到下一个生命周期事件之前成功修改。

## TraceEndDetail
传递给 `onStop` 回调的参数

### end - `number`
函数结束时的时间

### error - `Error | null`
在生命周期中抛出的错误

### elapsed - `number`
生命周期的经过时间或 `end - begin`
