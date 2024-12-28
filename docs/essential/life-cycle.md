---
title: 生命周期 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 生命周期 - ElysiaJS

    - - meta
      - name: 'description'
        content: 生命周期事件是 Elysia 处理每个阶段的概念，“生命周期”或“钩子”是一个事件监听器，用于拦截并监听这些循环的事件。钩子允许您转换通过数据管道运行的数据。通过钩子，您可以充分自定义 Elysia。

    - - meta
      - property: 'og:description'
        content: 生命周期事件是 Elysia 处理每个阶段的概念，“生命周期”或“钩子”是一个事件监听器，用于拦截并监听这些循环的事件。钩子允许您转换通过数据管道运行的数据。通过钩子，您可以充分自定义 Elysia。
---

<script setup>
import Card from '../../components/nearl/card.vue'
import Deck from '../../components/nearl/card-deck.vue'
import Playground from '../../components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo = new Elysia()
	.onError(({ code }) => {
		if (code === 418) return '捕获'
	})
	.get('/return', ({ error }) => {
		// 这将不会被 onError 捕获
		return error(418)
	})
	.get('/throw', ({ error }) => {
		// 这将不会被 onError 捕获
		throw error(418)
	})
</script>

# 生命周期

生命周期允许我们在预定义的点上拦截一个重要事件，从而根据需要自定义我们的服务器行为。

Elysia 的生命周期事件可以表示如下。
![Elysia 生命周期图](/assets/lifecycle.webp)

以下是 Elysia 中可用的请求生命周期：

<Deck>
    <Card title="请求" href="#request">
        通知接收到新事件
    </Card>
    <Card title="解析" href="#parse">
        将主体解析为 <b>Context.body</b>
    </Card>
    <Card title="转换" href="#transform">
        在验证之前修改 <b>Context</b>
    </Card>
    <Card title="处理前" href="#before-handle">
        路由处理程序之前的自定义验证
    </Card>
    <Card title="处理后" href="#after-handle">
        将返回值转换为新值
    </Card>
    <Card title="映射响应" href="#map-response">
        将返回值映射为响应
    </Card>
    <Card title="错误处理" href="#on-error-error-handling">
   		处理生命周期中抛出的错误
    </Card>
    <Card title="响应后" href="#after-response">
        在响应发送给客户端后执行
    </Card>
    <Card title="追踪" href="/patterns/trace">
        审计并捕获每个事件的时间跨度
    </Card>
</Deck>

## 为什么

想象一下，我们希望返回一些 HTML。

我们需要将 **"Content-Type"** 标头设置为 **"text/html"** 以便浏览器可以渲染 HTML。

如果有很多处理程序，比如大约 200 个端点，明确指定响应是 HTML 可能会显得重复。

这可能会导致大量重复代码，仅用于指定 **"text/html"** **"Content-Type"**。

但如果在我们发送响应后，可以检测到响应是 HTML 字符串，然后自动附加标头呢？

这就是生命周期的概念派上用场的地方。

## 钩子

我们将每个拦截生命周期事件的函数称为 **"钩子"**，因为函数钩入了生命周期事件。

钩子可以分为两种类型：

1. 本地钩子：在特定路由上执行
2. 拦截器钩子：在每个路由上执行

::: tip
钩子将接受与处理程序相同的上下文，您可以想象在特定点添加一个路由处理程序。
:::

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，您可以将钩子内联到路由处理程序中：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好，世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

响应应列示如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## 拦截器钩子

将钩子注册到 **当前实例** 的每个处理程序中，后续处理器。

要添加一个拦截器钩子，您可以使用 `.on` 后跟一个以 camelCase 表示的生命周期事件：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/none', () => '<h1>你好，世界</h1>')
    .onAfterHandle(({ response, set }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>你好，世界</h1>')
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

响应应列示如下：

| 路径  | Content-Type             |
| ----- | ------------------------ |
| /     | text/html; charset=utf8  |
| /hi   | text/html; charset=utf8  |
| /none | text/plain; charset=utf8 |

来自其他插件的事件也适用于路由，因此代码的顺序很重要。

::: tip
上述代码将只适用于当前实例，而不适用于父级。

请看 [作用域](/essential/plugin#scope) 了解原因。
:::

## 代码顺序

Elysia 生命周期代码的顺序非常重要。

Elysia 的生命周期事件以队列的形式存储，也就是先进先出。因此，Elysia 将 **始终** 遵循从上到下的代码顺序，随后是生命周期事件的顺序。

```typescript
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

## 请求

针对每个新请求执行的第一个生命周期事件是接收到的请求。

由于 `onRequest` 旨在提供最关键的上下文以减少开销，因此建议在以下场景中使用：

- 缓存
- 速率限制器 / IP/区域锁定
- 分析
- 提供自定义标头，例如 CORS

#### 示例

以下是伪代码，用于强制对某一特定 IP 地址的速率限制。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .use(rateLimiter)
    .onRequest(({ rateLimiter, ip, set, error }) => {
        if (rateLimiter.check(ip)) return error(420, '保持冷静')
    })
    .get('/', () => 'hi')
    .listen(3000)
```

如果从 `onRequest` 返回一个值，它将被用作响应，生命周期的其余部分将被跳过。

### 预上下文

上下文的 onRequest 被类型化为 `PreContext`，是 `Context` 的最小表示，属性包括：
请求: `Request`

- set: `Set`
- store
- decorators

上下文不提供 `derived` 值，因为派生是基于 `onTransform` 事件的。

## 解析

解析相当于 Express 中的 **主体解析器**。

一个解析主体的函数，返回值将附加到 `Context.body`，如果没有，Elysia 将继续遍历由 `onParse` 指定的附加解析函数，直到主体被分配或者所有解析器都被执行。

默认情况下，Elysia 将解析内容类型为以下的主体：

- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

建议使用 `onParse` 事件提供 Elysia 不提供的自定义主体解析器。

#### 示例

以下是一个示例代码，根据自定义标头检索值。

```typescript
import { Elysia } from 'elysia'

new Elysia().onParse(({ request, contentType }) => {
    if (contentType === 'application/custom-type') return request.text()
})
```

返回的值将分配给 Context.body。如果没有，Elysia 将继续遍历 **onParse** 堆栈中的附加解析函数，直到主体被分配或所有解析器都执行完毕。

### 上下文

`onParse` 上下文是从 `Context` 扩展的，具有以下额外属性：

- contentType: 请求的 Content-Type 头

所有上下文基于正常上下文，可以在路由处理程序中像正常上下文那样使用。

### 解析器

默认情况下，Elysia 将尝试提前确定主体解析函数，并选择最合适的函数以加快处理过程。

Elysia 通过读取 `body` 来确定主体函数。

看看这个示例：

```typescript
import { Elysia, t } from 'elysia'

new Elysia().post('/', ({ body }) => body, {
    body: t.Object({
        username: t.String(),
        password: t.String()
    })
})
```

Elysia 读取主体模式并发现类型完全是一个对象，因此主体很可能将是 JSON。Elysia 随后提前选择 JSON 主体解析器函数并尝试解析主体。

以下是 Elysia 用于选择主体解析器类型的标准：

- `application/json`：主体类型为 `t.Object`
- `multipart/form-data`：主体类型为 `t.Object`，并且是嵌套了一层的 `t.File`
- `application/x-www-form-urlencoded`：主体类型为 `t.URLEncoded`
- `text/plain`：其他原始类型

这使得 Elysia 能够提前优化主体解析器，并减少编译时的开销。

### 显式解析器

但是，在某些情况下，如果 Elysia 未能选择正确的主体解析函数，我们可以通过指定 `type` 显式告诉 Elysia 使用某个函数。

```typescript
import { Elysia } from 'elysia'

new Elysia().post('/', ({ body }) => body, {
    // application/json 的简写
    parse: 'json'
})
```

允许我们在复杂情况下控制 Elysia 选择主体解析函数的行为，以满足我们的需求。

`type` 可能是以下之一：

```typescript
type ContentType = |
    // 'text/plain' 的简写
    | 'text'
    // 'application/json' 的简写
    | 'json'
    // 'multipart/form-data' 的简写
    | 'formdata'
    // 'application/x-www-form-urlencoded' 的简写
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

### 自定义解析器

您可以使用 `parser` 注册一个自定义解析器：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .parser('custom', ({ request, contentType }) => {
        if (contentType === 'application/elysia') return request.text()
    })
    .post('/', ({ body }) => body, {
        parse: ['custom', 'json']
    })
```

## 转换

在 **验证** 过程之前执行，旨在改变上下文以符合验证或附加新值。

建议将转换用于以下目的：

- 变更现有上下文以符合验证。
- `derive` 基于 `onTransform`，支持提供类型。

#### 示例

以下是使用转换将参数变为数值的示例。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id

            if (!Number.isNaN(id)) params.id = id
        }
    })
    .listen(3000)
```

## 派生

在 **验证** 之前直接向上下文添加新值。它存储在与 **transform** 相同的堆栈中。

与 **state** 和 **decorate** 不同，后者是在服务器启动之前分配值。**derive** 在每个请求发生时给属性赋值。允许我们将一部分信息提取到属性中。

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

因为 **derive** 在每次新请求开始时分配，**derive** 可以访问请求属性，如 **headers**、**query**、**body**，而 **store** 和 **decorate** 则不能。

与 **state** 和 **decorate** 不同，由 **derive** 分配的属性是唯一的，不会与另一个请求共享。

### 队列

`derive` 和 `transform` 存储在同一队列中。

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

控制台应记录如下：

```bash
1
2
```

## 处理前

在验证之后、主路由处理程序之前执行。

旨在提供自定义验证以在运行主处理程序之前提供特定要求。

如果返回一个值，路由处理程序将被跳过。

建议在以下情况下使用处理前：

- 访问检查：授权、用户登录
- 数据结构的自定义请求要求

#### 示例

以下是使用处理前检查用户登录的示例。

```typescript
import { Elysia } from 'elysia'
import { validateSession } from './user'

new Elysia()
    .get('/', () => 'hi', {
        beforeHandle({ set, cookie: { session }, error }) {
            if (!validateSession(session.value)) return error(401)
        }
    })
    .listen(3000)
```

响应应列示如下：

| 是否登录   | 响应         |
| ---------- | ------------ |
| ❌         | 未授权       |
| ✅         | 你好         |

### 防护

当我们需要将相同的处理前应用于多个路由时，我们可以使用 `guard` 将相同的处理前应用于多个路由。

```typescript
import { Elysia } from 'elysia'
import { signUp, signIn, validateSession, isUserExists } from './user'

new Elysia()
    .guard(
        {
            beforeHandle({ set, cookie: { session }, error }) {
                if (!validateSession(session.value)) return error(401)
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

## 解析

在验证之后向上下文添加新值。与 **beforeHandle** 存储在同一堆栈中。

解析的语法与 [derive](#derive) 相同，以下是一个从 Authorization 插件检索 bearer 头的示例。

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

使用 `resolve` 和 `onBeforeHandle` 存储在同一队列中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log('1')
    })
    .resolve(() => {
        console.log('2')

        return {}
    })
    .onBeforeHandle(() => {
        console.log('3')
    })
```

控制台应记录如下：

```bash
1
2
3
```

与 **derive** 相同，由 **resolve** 分配的属性是唯一的，不会与另一个请求共享。

### 防护解析

由于解析在本地钩子中不可用，建议使用防护来封装 **resolve** 事件。

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

在主处理程序之后执行，用于将 **处理前** 和 **路由处理程序** 返回的值映射到适当的响应中。

建议在以下情况下使用处理后：

- 将请求转换为新值，例如压缩、事件流
- 基于响应值添加自定义标头，例如 **Content-Type**

#### 示例

以下是使用处理后将 HTML 内容类型添加到响应标头的示例。

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好，世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['content-type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

响应应列示如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

### 返回值

如果一个值是从处理后返回的，处理后将使用返回值作为新的响应值，除非该值是 **undefined**。

上述示例可以重写如下：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好，世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response)) {
                set.headers['content-type'] = 'text/html; charset=utf8'
                return new Response(response)
            }
        }
    })
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

与 **beforeHandle** 不同，从 **afterHandle** 返回值后，**处理后** 的迭代 **不会** 被跳过。

### 上下文

`onAfterHandle` 上下文是从 `Context` 扩展的，具有附加属性 `response`，即返回给客户端的响应。

`onAfterHandle` 上下文基于正常上下文，可以在路由处理程序中像正常上下文那样使用。

## 映射响应

在 **"afterHandle"** 之后执行，旨在提供自定义响应映射。

建议在以下情况下使用映射响应：

- 压缩
- 将值映射到 Web 标准响应

#### 示例

以下是使用 mapResponse 提供响应压缩的示例。

```typescript
import { Elysia } from 'elysia'

const encoder = new TextEncoder()

new Elysia()
    .mapResponse(({ response, set }) => {
        const isJson = typeof response === 'object'

        const text = isJson
            ? JSON.stringify(response)
            : (response?.toString() ?? '')

        set.headers['Content-Encoding'] = 'gzip'

        return new Response(Bun.gzipSync(encoder.encode(text)), {
            headers: {
                'Content-Type': `${
                    isJson ? 'application/json' : 'text/plain'
                }; charset=utf-8`
            }
        })
    })
    .get('/text', () => 'mapResponse')
    .get('/json', () => ({ map: 'response' }))
    .listen(3000)
```

像 **parse** 和 **beforeHandle** 一样，返回一个值后，**mapResponse** 的下一个迭代将被跳过。

Elysia 将自动处理 **mapResponse** 的 **set.headers** 合并过程。我们无须担心手动将 **set.headers** 附加到响应中。

## 错误处理 (错误处理)

设计用于错误处理。当在任何生命周期中抛出异常时将执行该事件。

建议在以下情况下使用错误处理：

- 提供自定义错误消息
- 失败安全或错误处理或重试请求
- 日志记录和分析

#### 示例

Elysia 捕获处理程序中抛出的所有错误，对错误代码进行分类，并将其传递给 `onError` 中间件。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('服务器正在维护')

        return '不可达'
    })
```

使用 `onError` 我们可以捕获并将错误转换为自定义错误消息。

::: tip
重要的是，`onError` 必须在我们想要应用它的处理程序之前调用。
:::

### 自定义 404 消息

例如，返回自定义 404 消息：

```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') return error(404, '未找到 :(')
    })
    .post('/', () => {
        throw new NotFoundError()
    })
    .listen(3000)
```

### 上下文

`onError` 上下文是从 `Context` 扩展的，具有以下附加属性：

- **error**: 被抛出的值
- **code**: *错误代码*

### 错误代码

Elysia 错误代码包括：

- **NOT_FOUND**
- **INTERNAL_SERVER_ERROR**
- **VALIDATION**
- **PARSE**
- **UNKNOWN**
- **number** （基于 HTTP 状态）

默认情况下，抛出的错误代码为 `UNKNOWN`。

::: tip
如果没有返回错误响应，则会使用 `error.name` 返回错误。
:::

### 抛出或返回

`Elysia.error` 是返回特定 HTTP 状态码错误的简写。

根据您的具体需求，可以选择是 **返回** 还是 **抛出**。

- 如果 `error` 是 **抛出**，它将被 `onError` 中间件捕获。
- 如果 `error` 是 **返回**，它将 **不会** 被 `onError` 中间件捕获。

请参见以下代码：

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .onError(({ code, error, path }) => {
        if (code === 418) return '捕获'
    })
    .get('/throw', ({ error }) => {
        // 这将不会被 onError 捕获
        throw error(418)
    })
    .get('/return', () => {
        // 这将不会被 onError 捕获
        return error(418)
    })
```

<Playground
    :elysia="demo"
/>

### 自定义错误

Elysia 支持在类型层面和实现层面提供自定义错误。

为了提供自定义错误代码，我们可以使用 `Elysia.error` 添加自定义错误代码，帮助我们轻松分类并缩小错误类型，以实现完整的类型安全和自动完成，如下所示：

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
            // 具有自动完成
            case 'MyError':
                // 通过类型缩小
                // 悬停以查看错误的类型为 `CustomError`
                return error
        }
    })
    .get('/', () => {
        throw new MyError('你好，错误')
    })
```

`error` 代码的属性基于 `error` 的属性，所述属性将用于分类错误代码。

### 本地错误

与其他生命周期相同，我们可以通过使用防护将错误提供到[作用域](/essential/plugin.html#scope)中：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => '你好', {
        beforeHandle({ set, request: { headers }, error }) {
            if (!isSignIn(headers)) throw error(401)
        },
        error({ error }) {
            return '处理'
        }
    })
    .listen(3000)
```

## 响应后

在响应发送给客户端之后执行。

建议在以下情况下使用 **响应后**：

- 清理响应
- 日志记录和分析

#### 示例

以下是使用响应处理程序检查用户登录的示例。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onAfterResponse(() => {
        console.log('响应', performance.now())
    })
    .listen(3000)
```

控制台应记录如下：

```bash
响应 0.0000
响应 0.0001
响应 0.0002
```

### 响应

类似于 [映射响应](#map-resonse)，`afterResponse` 也接受一个 `response` 值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(({ response }) => {
		console.log(response)
	})
	.get('/', () => '你好')
	.listen(3000)
```

从 `onAfterResponse` 获取的 `response` 不是 Web 标准的 `Response`，而是处理程序返回的值。

要获取从处理程序返回的标头和状态，我们可以从上下文中访问 `set`。 

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(({ set }) => {
		console.log(set.status, set.headers)
	})
	.get('/', () => '你好')
	.listen(3000)
```