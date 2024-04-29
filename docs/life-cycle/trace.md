---
title: Trace
head:
    - - meta
      - property: 'og:title'
        content: Trace - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: Trace 是一个用于测量服务器性能的 API。它允许我们与每个生命周期事件的持续时间进行交互，并测量每个函数的性能，以识别服务器的性能瓶颈。

    - - meta
      - name: 'og:description'
        content: Trace 是一个用于测量服务器性能的 API。它允许我们与每个生命周期事件的持续时间进行交互，并测量每个函数的性能，以识别服务器的性能瓶颈。
---

# Trace

Trace 是一个用于测量服务器性能的 API。

Trace 允许我们与每个生命周期事件的持续时间进行交互，并测量每个函数的性能，以识别服务器的性能瓶颈。

![Trace 使用示例](/assets/trace.webp)

性能是 Elysia 的重要方面。

我们不仅仅希望在基准测试中快速，更希望你在实际场景中拥有一个真正快速的服务器。

有许多因素可能导致应用程序变慢，很难识别它们，但是 **trace** 可以帮助解决这个问题

## Trace

Trace 可以测量每个函数的生命周期执行时间，以审核每个周期的性能瓶颈。

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .trace(async ({ handle }) => {
        const { time, end } = await handle

        console.log('beforeHandle took', (await end) - time)
    })
    .get('/', () => 'Hi')
    .listen(3000)
```

你可以追踪以下生命周期：

-   **request** - 获取每个新请求的通知
-   **parse** - 用于解析请求主体的函数数组
-   **transform** - 在验证之前转换请求和上下文
-   **beforeHandle** - 在主处理程序之前的自定义要求，如果返回响应，可以跳过主处理程序。
-   **handle** - 分配给路径的函数
-   **afterHandle** - 将返回值映射到适当的响应
-   **error** - 处理处理请求过程中抛出的错误
-   **response** - 将响应发送回客户端

有关更多信息，请参阅[生命周期事件](/essential/life-cycle#events)：

![Elysia 生命周期](/assets/lifecycle.webp)

## Children

你可以通过使用生命周期事件的 **children** 属性来深入了解并测量每个生命周期事件的每个函数

```ts twoslash
import { Elysia } from 'elysia'

const sleep = (time = 1000) =>
    new Promise((resolve) => setTimeout(resolve, time))

const app = new Elysia()
    .trace(async ({ beforeHandle }) => {
        const { children } = await beforeHandle

        for (const child of children) {
            const { time: start, end, name } = await child

            console.log(name, 'took', (await end) - start, 'ms')
        }
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

::: tip
除了 `handle` 之外，每个生命周期都支持子级
:::

## Name

通过索引来测量函数可能很难追溯到函数代码，这就是为什么 trace 提供了一个 **name** 属性，以便通过名称轻松识别函数。

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.trace(async ({ beforeHandle }) => {
        const { children } = await beforeHandle

		for (const child of children) {
			const { name } = await child

			console.log(name)
            // setup
            // anonymous
		}
	})
	.get('/', () => 'Hi', {
		beforeHandle: [
			function setup() {},
			() => {}
		]
	})
	.listen(3000)
```

::: tip
如果你使用箭头函数或匿名函数，**name** 将变为 **“anonymous”**
:::

## Set

在 trace 回调中，你可以访问请求的 `Context`，并可以修改请求本身的值，例如使用 `set.headers` 更新标头。

这在你需要支持类似 Server-Timing 的 API 时非常有用。

![Trace 使用示例](/assets/server-timing.webp)

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .trace(async ({ handle, set }) => {
        const { time, end } = await handle

        set.headers['Server-Timing'] = `handle;dur=${(await end) - time}`
    })
    .get('/', () => 'Hi')
    .listen(3000)
```

::: tip
在 `trace` 中使用 `set` 可能会影响性能，因为 Elysia 将执行推迟到下一个微任务。
:::

## Skip

有时，`beforeHandle` 或处理程序可能会抛出错误，跳过某些生命周期的执行。

默认情况下，如果发生这种情况，每个生命周期都将自动解析，并且你可以使用 `skip` 属性跟踪 API 是否执行或未执行

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .trace(async ({ handle, set }) => {
        const { time, end, skip } = await handle

        console.log(skip)
    })
    .get('/', () => 'Hi', {
        beforeHandle() {
            throw new Error("I'm a teapot")
        }
    })
    .listen(3000)
```
