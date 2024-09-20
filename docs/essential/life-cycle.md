---
title: 生命周期
head:
    - - meta
      - property: 'og:title'
        content: 生命周期 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 生命周期事件是 Elysia 处理过程中每个阶段的概念，"生命周期 "或 "钩子 "是一个事件监听器，用于拦截和监听这些循环事件。钩子允许你转换数据管道中运行的数据。有了钩子，你就可以定制 Elysia，充分发挥其潜力。

    - - meta
      - property: 'og:description'
        content: 生命周期事件是 Elysia 处理过程中每个阶段的概念，"生命周期 "或 "钩子 "是一个事件监听器，用于拦截和监听这些循环事件。钩子允许你转换数据管道中运行的数据。有了钩子，你就可以定制 Elysia，充分发挥其潜力。
---

<script setup>
import Card from '../../components/nearl/card.vue'
import Deck from '../../components/nearl/card-deck.vue'
</script>

# 生命周期

生命周期允许我们在预定义的点拦截一个重要事件，以便根据需要自定义服务器的行为。

Elysia 的生命周期事件可以如图所示：
![Elysia 生命周期图](/assets/lifecycle.webp)

以下是 Elysia 中可用的请求生命周期：

<Deck>
    <Card title="请求" href="request">
        通知接收到新的事件
    </Card>
    <Card title="解析" href="parse">
        将身体解析成<b>Context.body</b>
    </Card>
    <Card title="转换" href="transform">
        在验证之前修改<b>Context</b>
    </Card>
    <Card title="处理前" href="before-handle">
        在路由处理前进行自定义验证
    </Card>
    <Card title="处理后" href="after-handle">
        将返回的值转换成新值
    </Card>
    <Card title="映射响应" href="map-response">
        将返回的值映射成响应
    </Card>
    <Card title="错误" href="on-error">
        捕获抛出错误时
    </Card>
    <Card title="响应后" href="on-response">
        在响应发送给客户端后执行
    </Card>
    <Card title="追踪" href="trace">
        审计和捕获每个事件的时延
    </Card>
</Deck>

## 为什么
想象一下，我们想要返回一些HTML。

我们需要设置 **"Content-Type"** 头为 **"text/html"**，以便浏览器能够渲染 HTML。

显式指定响应是 HTML 可能会在有很多处理程序的情况下重复，比如说 ~200 个端点。

这可能导致大量重复代码，只是为了指定 **"text/html"**、**"Content-Type"**。

但是，如果我们发送响应后，我们能够检测到响应是HTML字符串，然后自动追加头部吗？

这时生命周期的概念就派上用场了。

## 钩子

我们将每个拦截生命周期事件的函数称为 **"钩子"**，因为函数钩住了生命周期事件。

钩子可以分为以下两种类型：

1. 本地钩子：在特定路由上执行
2. 拦截器钩子：在每个路由上执行

::: tip
钩子将接受与处理程序相同的上下文，你可以想象是在添加一个路由处理程序，但是在特定的点上。
:::

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，你可以将钩子内联到路由处理程序中：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好世界</h1>')
    .listen(3000)
```

响应应该列出如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## 拦截器钩子

注册钩子到当前实例的每个处理程序之后。

要添加拦截器钩子，你可以使用 `.on` 后面是驼峰式命名的生命周期事件：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .onAfterHandle(({ response, set }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>你好世界</h1>')
    .get('/hi', () => '<h1>你好世界</h1>')
    .listen(3000)
```

响应应该列出如下：

| 路径  | Content-Type             |
| ----- | ------------------------ |
| /     | text/html; charset=utf8  |
| /hi   | text/html; charset=utf8  |
| /none | text/plain; charset=utf8 |

来自其他插件的的事件也会应用到路由上，因此代码的顺序很重要。

::: tip
上面的代码只会应用到当前实例，不应用到父实例。

查看[作用域](/essential/plugin#scope)来了解为什么
:::

## 代码顺序

Elysia 的生命周期代码的顺序非常重要。

Elysia 的生命周期事件存储为队列，即先进先出。因此，Elysia 总是尊重代码从上到下的顺序和生命周期事件的顺序。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log(1)
    })
    .onAfterHandle(() => {
        console.log(3)
    })
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log(2)
        }
    })
    .listen(3000)
```

控制台应该记录如下：

```bash
1
2
3
```

## 请求
对于每个新请求接收到的事件，第一个生命周期事件被执行。

因为 `onRequest` 是为了提供最重要的上下文以减少开销设计的，所以推荐在以下情况下使用：
- 缓存
- 速率限制器/IP/区域锁定
- 分析
- 提供自定义头部，例如 CORS

#### 例子
下面是一个伪代码，用于在特定 IP 地址上执行速率限制。
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .use(rateLimiter)
    .onRequest(({ rateLimiter, ip, set, error }) => {
        if(rateLimiter.check(ip))
            return error(420, 'Enhance your calm')
    })
    .get('/', () => '<h1>你好世界</h1>')
    .listen(3000)
```

如果 `onRequest` 返回了值，它将用作响应，生命周期的其余部分将被跳过。

### 预上下文
`onRequest` 上下文是基于 `Context`，具有以下属性：
request: `Request`
- set: `Set`
- store
- decorators

上下文不提供 `derived` 值，因为 `derive` 是基于 `onTransform` 事件的。

## 解析
解析相当于 Express 中的 **body parser**。

一个函数来解析体，返回的值将被附加到 `Context.body`，如果没有，Elysia 将继续迭代通过由 `onParse` 分配的额外解析器函数，直到身体被分配或所有解析器都被执行。

默认情况下，Elysia 将解析具有内容类型的体：
- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

建议使用 `onParse` 事件来提供一个 Elysia 不提供的自定义 body 解析器。

#### 例子
下面是一个例子代码，用于根据自定义头部检索值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

返回的值将被分配到 Context.body。如果没有，Elysia 将继续迭代通过额外的 `onParse` 解析器栈直到身体被分配或所有解析器都被执行。

### 上下文
`onParse` 上下文是基于 `Context`，具有以下额外属性：
- contentType: 请求的 Content-Type头部

所有上下文是基于正常上下文，可以像正常上下文在路由处理程序中一样使用。

### 显式体

默认情况下，Elysia 试图在接收到请求之前确定体解析函数，并选择最合适的函数来加快这个过程。

Elysia 能够根据体函数来确定内容类型的选择。

看看这个例子：
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

Elysia 阅读了体模式，发现类型完全是对象，所以可能是 JSON。因此，Elysia 选择了 JSON 体解析函数，并在接收体之前尝试解析。

这里是 Elysia 用来选择体解析函数的准则：

- `application/json`: 类型为 `t.Object`
- `multipart/form-data`: 类型为 `t.Object`，并且是一层深，带有 `t.File`
- `application/x-www-form-urlencoded`: 类型为 `t.URLEncoded`
- `text/plain`: 其他原始类型

这允许 Elysia 在编译时优化体解析器，并减少编译时的开销。

### 显式内容类型
然而，在某些情况下，如果 Elysia 无法选择正确的体解析函数，我们可以显式地告诉 Elysia 使用某种函数，通过指定 `type`

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        // 简写形式application/json
        type: 'json',
    })
```

允许我们控制 Elysia 的行为，为选择体解析器函数提供我们的需求在复杂的情况下。

`type` 可以是以下之一：
```typescript
type ContentType = |
    // 'text/plain' 的快捷方式
    | 'text'
    // 'application/json' 的快捷方式
    | 'json'
    // 'multipart/form-data' 的快捷方式
    | 'formdata'
    // 'application/x-www-form-urlencoded' 的快捷方式
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

## 转换
在验证过程之前执行，设计用来改变上下文以符合验证或追加新值。

建议在以下情况下使用转换：
- 改变现有上下文以符合验证。
- `derive` 是基于 `onTransform` 事件，支持提供类型。

#### 例子
下面是一个使用转换来转换参数为数值值的例子。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id

            if(!Number.isNaN(id))
                params.id = id
        }
    })
    .listen(3000)
```

## 派生
设计来在验证过程之前将新值追加到上下文中，存储在与**转换**相同的栈中。

不像**状态**和**装饰**在服务器启动之前分配值，**派生**在每个请求开始时分配一个属性。允许我们将信息的一部分提取成一个属性。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['Authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

因为**派生**是在一个新的请求开始时分配的，**派生**可以访问请求属性，如 **headers**, **query**, **body**，而 **store** 和 **decorate** 不能。

### 队列
`derive` 和 `transform` 存储在同一个队列中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onTransform(() => {
        console.log(1)
    })
    .derive(() => {
        console.log(2)

        return {}
    })
```

控制台应该记录如下：

```bash
1
2
```

同 `derive`，由 `derive` 分配的属性是唯一的，不与其他请求共享。

## 处理前

在验证和主要路由处理程序之前执行。

设计用来提供特定的需求之前的自定义验证。

如果返回了值，路由处理程序将被跳过。

建议在以下情况下使用处理前：

- 受限访问检查：授权，用户登录
- 自定义基于数据结构的要求

#### 例子
下面是使用处理前检查用户登录的例子。

```typescript
import { Elysia } from 'elysia'
import { validateSession } from './user'

new Elysia()
    .get('/', () => 'hi', {
        beforeHandle({ set, cookie: { session }, error }) {
            if (!validateSession(session.value))
                return error(401)
        }
    })
    .listen(3000)
```

响应应该列出如下：

| 是否登录 | 响应   |
| ------- | ------ |
| ❌       | 未授权 |
| ✅       | 你好   |

### 守卫

当我们需要在多个路由上应用相同的处理前时，我们可以使用[守卫](#守卫)来应用相同的处理前到多个路由。

```typescript
import { Elysia } from 'elysia'
import {
    signUp,
    signIn,
    validateSession,
    isUserExists
} from './user'

new Elysia()
    .guard(
        {
            beforeHandle({ set, cookie: { session }, error }) {
                if (!validateSession(session.value))
                    return error(401)
            }
        },
        (app) =>
            app
                .get('/user/:id', ({ body }) => signUp(body))
                .post('/profile', ({ body }) => signIn(body), {
                    beforeHandle: isUserExists
                })
    )
    .get('/', () => 'hi')
    .listen(3000)
```

## 解决

一个"安全"版本的[派生](/life-cycle/before-handle#derive)。

设计来在验证过程之前将新值追加到上下文中，存储在与**处理前**相同的栈中。

解决语法与[派生](/life-cycle/before-handle#derive)相同，下面是一个从 Authorization 插件检索 bearer 头部的例子。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}')
            })
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1]
                    }
                })
                .get('/', ({ bearer }) => bearer)
    )
    .listen(3000)
```

使用 `resolve` 和 `onBeforeHandle` 存储在同一个队列中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log(1)
    })
    .resolve(() => {
        console.log(2)

        return {}
    })
    .onBeforeHandle(() => {
        console.log(3)
    })
```

控制台应该记录如下：

```bash
1
2
3
```

同 `derive`，由 `resolve` 分配的属性是唯一的，不与其他请求共享。

### 守卫解决

由于解决在本地钩子不可用，建议使用守卫来封装 `resolve` 事件。

```typescript
import { Elysia } from 'elysia'
import { isSignIn, findUserById } from './user'

new Elysia()
    .guard(
        {
            beforeHandle: isSignIn
        },
        (app) =>
            app
                .resolve(({ cookie: { session } }) => ({
                    userId: findUserById(session.value)
                }))
                .get('/profile', ({ userId }) => userId)
    )
    .listen(3000)
```

## 处理后

在主要处理程序之后执行，用于映射处理程序返回的值到一个合适的响应。

建议在以下情况下使用处理后：
- 将请求转换成新值，例如压缩，事件流
- 根据响应值添加自定义头部，例如 **Content-Type**

#### 例子
下面是一个使用处理后添加 HTML 内容类型到响应头部的例子。

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['content-type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好世界</h1>')
    .listen(3000)
```

响应应该列出如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

### 返回值

如果处理后返回了值，返回的值将被用作新的响应值，除非返回的是 **undefined**

上面的例子可以被重写为如下：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response)) {
                set.headers['content-type'] = 'text/html; charset=utf8'
                return new Response(response)
            }
        }
    })
    .get('/hi', () => '<h1>你好世界</h1>')
    .listen(3000)
```

与**处理前**不同，处理后返回值后，下一轮**处理后**的迭代**不会**被跳过。

### 上下文

`onAfterHandle` 上下文是基于 `Context`，具有附加的 `response` 属性，是返回给客户端响应。

`onAfterHandle` 上下文是基于正常的上下文，可以像正常的上下文在路由处理程序中一样使用。

## 映射响应

在 **"处理后"** 之后执行，设计来提供自定义响应映射。

建议在以下情况下使用映射响应：

- 提供响应压缩
- 将值映射到 Web 标准响应

#### 例子
下面是一个使用映射响应来提供响应压缩的例子。

```typescript
import { Elysia } from 'elysia'

const encoder = new TextEncoder()

new Elysia()
    .mapResponse(({ response, set }) => {
        const isJson = typeof response === 'object'

        const text = isJson
            ? JSON.stringify(response)
            : response?.toString() ?? ''

        set.headers['Content-Encoding'] = 'gzip'

        return new Response(
            Bun.gzipSync(encoder.encode(text)),
            {
                headers: {
                    'Content-Type': `${
                        isJson ? 'application/json' : 'text/plain'
                    }; charset=utf-8`
                }
            }
        )
    })
    .get('/text', () => '映射响应')
    .get('/json', () => ({ 映射: '响应' }))
    .listen(3000)
```

像**解析**和**处理前**一样，一旦映射响应返回了值，下一轮**映射响应**的迭代将被跳过。

Elysia 将自动处理 **set.headers** 的合并过程。我们不需要担心手动将 **set.headers** 附加到响应。

## 错误

**错误**是唯一不在每次请求时执行的生命周期事件，但仅当在至少一个其他生命周期中至少抛出一个错误时才会被执行。

设计用来捕获和解决一个不期望的错误，推荐在以下情况下使用错误：

- 提供自定义错误消息
- 失败安全或错误处理器或重试请求
- 记录和分析

#### 例子
Elysia 捕捉了在处理程序中抛出的所有错误，将错误分类并通过 `onError` 管道。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('服务器正在维护中')

        return '无法到达'
    })
```

使用 `onError` 我们可以捕获并将错误转换成自定义错误消息。

::: tip
重要的是 `onError` 必须在我们要应用的处理器之前被调用。
:::

### 自定义 404 消息
例如，返回自定义 404 消息：

```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND')
            return error(404, '未找到 :(')
    })
    .post('/', () => {
        throw new NotFoundError()
    })
    .listen(3000)
```

### 上下文

`onError` 上下文是基于 `Context`，具有附加的属性 `error` 和 `code`。

### 错误代码

Elysia 错误代码包括：

-   NOT_FOUND
-   INTERNAL_SERVER_ERROR
-   VALIDATION
-   解析
-   UNKNOWN

默认情况下，抛出的错误代码是 `unknown`。

::: tip
如果没有返回错误响应，错误将使用 `error.name` 返回。
:::

### 自定义错误

Elysia 支持在类型级别和实现级别上的自定义错误。

要提供自定义错误代码，我们可以使用 `Elysia.error` 来添加自定义错误代码，帮助我们轻松地分类和缩小错误类型，带来完整的类型安全和自动完成，如下：

```typescript twoslash
import { Elysia } from 'elysia'

class MyError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .error({
        MyError
    })
    .onError(({ code, error }) => {
        switch (code) {
            // 带有自动完成
            case 'MyError':
                // 带有类型缩小
                // 悬停查看 error 被类型化为 `CustomError`
                return error
        }
    })
    .get('/', () => {
        throw new MyError('Hello Error')
    })
```

`error` 代码的属性是基于 `error` 的属性，这些属性将被用于分类错误代码。

### 本地错误

与其它生命周期一样，我们可以通过守卫将错误应用到[范围](/essential/scope)中：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hello', {
        beforeHandle({ set, request: { headers }, error }) {
            if (!isSignIn(headers))
                return error(401)
        },
        error({ error }) {
            return 'Handled'
        }
    })
    .listen(3000)
```

## 响应后
在将响应发送给客户端后执行。

建议在以下情况下使用**响应后**：
- 清理响应
- 记录和分析

#### 例子
下面是一个使用响应后检查用户登录的例子。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(() => {
		console.log('响应', performance.now())
	})
	.listen(3000)
```

控制台应该记录如下：

```bash
响应 0.0000
响应 0.0001
响应 0.0002
```