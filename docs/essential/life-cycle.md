---
title: 生命周期
head:
    - - meta
      - property: 'og:title'
        content: 生命周期 - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 生命周期事件是 Elysia 处理过程中每个阶段的概念，"生命周期 "或 "钩子 "是一个事件监听器，用于拦截和监听这些循环事件。钩子允许您转换数据管道中运行的数据。有了钩子，您就可以定制 Elysia，充分发挥其潜力。

    - - meta
      - property: 'og:description'
        content: 生命周期事件是 Elysia 处理过程中每个阶段的概念，"生命周期 "或 "钩子 "是一个事件监听器，用于拦截和监听这些循环事件。钩子允许您转换数据管道中运行的数据。有了钩子，您就可以定制 Elysia，充分发挥其潜力。
---

# 生命周期

在 Express 中也称为中间件，在 Fastify 中称为 Hook。

假设我们要返回 HTML 文本。

我们需要将 `Content-Type` 头设置为 `text/html`，以便浏览器渲染 HTML。

如果有很多处理程序（例如约 200 个端点），明确指定响应为 HTML 可能会造成重复。

我们可以看到，只指定响应为 HTML 的代码是重复的。

但如果在发送响应后，我们可以检测响应是否为 HTML 字符串，然后自动添加标题呢？

这就是生命周期概念发挥作用的时候了。

---

生命周期允许我们拦截重要事件，并自定义 Elysia 的行为，例如自动添加 HTML 头信息。

Elysia 的生命周期事件可如下图所示。

![Elysia Life Cycle Graph](/assets/lifecycle.webp)

您不必一次性理解和记住所有事件，我们将在下一章逐一介绍。

## Events

大部分要用到的事件都会在蓝色区域中突出显示，但我们还是要总结一下：

Elysia 会对每个请求执行以下操作：

1. **Request**
    - 收到新事件时发出通知，只提供最基本的上下文以减少开销
    - 适用于：
        - 缓存
        - 分析
2. **Parse**
    - 解析正文并添加到 `Context.body` 中
    - 适用于：
        - 提供自定义正文解析器
3. **Transform**
    - 在验证前修改 `Context`
    - 适用于：
        - 修改现有上下文以符合验证要求
        - 添加新上下文（派生）
4. **Validation**（不可拦截）
    - 严格验证 `Elysia.t` 提供的传入请求
5. **Before Handle**
    - 在路由处理程序之前进行自定义验证
    - **如果返回值，则跳过路由处理程序**
    - 适用于：
        - 为访问路由提供自定义要求，如用户会话、授权。
6. **Handle**（路由处理程序）
    - 每个路由的回调函数
7. **After Handle**
    - 将返回值映射到响应中
    - 适用于：
        - 添加自定义标题或将值转换为新的响应
8. **Error**
    - 捕捉抛出的错误
    - 适用于：
        - 提供自定义错误响应
        - 捕获错误响应
9. **Response**
    - 在向客户端发送响应后执行
    - 适用于：
        - 清除响应
        - 分析

这些事件旨在帮助您将代码解耦为更小的可重用片段，而不是在处理程序中使用冗长、重复的代码。

## Hook

我们把拦截生命周期事件的每个函数都称为 **Hook**，因为函数钩住了生命周期事件。

**Hook** 可分为两种类型：

1. 本地 **Hook**：在特定路径上执行
2. 拦截器 **Hook**：在每个路由上执行

::: tip
Hook 将接受与处理程序相同的上下文，你可以想象添加一个路由处理程序，但在特定的点上。
:::

## 本地 Hook

本地钩子在特定路由上执行。

要使用本地钩子，可以将钩子内嵌到路由处理程序中：

```typescript twoslash
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

响应应列出如下：

| Path | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## 拦截器 Hook

将钩子注册到随后出现的**当前实例**的每个处理程序中。

要添加拦截器钩子，可以使用 `.on` 驼峰式命名法，后跟生命周期事件：

```typescript twoslash
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/none', () => '<h1>Hello World</h1>')
    .onAfterHandle(({ response, set }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>Hello World</h1>')
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

响应应列出如下：

| Path  | Content-Type             |
| ----- | ------------------------ |
| /     | text/html; charset=utf8  |
| /hi   | text/html; charset=utf8  |
| /none | text/plain; charset=utf8 |

其他插件的事件也会应用到路由中，因此代码的顺序非常重要。

## 代码顺序

Elysia 生命周期代码的顺序非常重要。

Elysia 的生命周期事件以队列形式存储，也就是先入先出。因此，Elysia 将**始终**遵守从上到下的代码顺序，然后是生命周期事件的顺序。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log('1')
    })
    .onAfterHandle(() => {
        console.log('3')
    })
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('2')
        }
    })
    .listen(3000)
```

控制台应记录如下：

```bash
1
2
3
```
