---
title: 生命周期 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 生命周期 - ElysiaJS

    - - meta
      - name: 'description'
        content: 生命周期事件是Elysia处理每个阶段的概念，“生命周期”或“钩子”是一个事件侦听器，用于拦截和监听这些循环的事件。钩子允许您转换通过数据管道运行的数据。借助钩子，您可以充分自定义Elysia的潜力。

    - - meta
      - property: 'og:description'
        content: 生命周期事件是Elysia处理每个阶段的概念，“生命周期”或“钩子”是一个事件侦听器，用于拦截和监听这些循环的事件。钩子允许您转换通过数据管道运行的数据。借助钩子，您可以充分自定义Elysia的潜力。
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo = new Elysia()
	.onError(({ code }) => {
		if (code === 418) return '捕获'
	})
    .get('/throw', ({ error }) => {
		// 这将被 onError 捕获
		throw error(418)
	})
	.get('/return', ({ status }) => {
		// 这将不会被 onError 捕获
		return status(418)
	})
</script>

# 生命周期

生命周期允许我们在预定义的点拦截一个重要事件，从而根据需要自定义服务器的行为。

Elysia的生命周期事件可以如下所示。
![Elysia 生命周期图](/assets/lifecycle-chart.svg)
> 点击图片放大

以下是Elysia中可用的请求生命周期：

<Deck>
    <Card title="请求" href="#request">
        通知新事件已接收
    </Card>
    <Card title="解析" href="#parse">
        解析主体到 <b>Context.body</b>
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
        将返回值映射到响应
    </Card>
    <Card title="错误处理（On Error）" href="#on-error-error-handling">
   		处理在生命周期中抛出的错误
    </Card>
    <Card title="响应后" href="#after-response">
        在响应发送到客户端后执行
    </Card>
    <Card title="追踪" href="/patterns/trace">
        审计和捕获每个事件的时间跨度
    </Card>
</Deck>

## 为什么

想象一下，我们想要返回一些HTML。

我们需要将 **"Content-Type"** 头设置为 **"text/html"** 以便浏览器渲染HTML。

如果有很多处理程序，比如 ~200 个端点，明确指定响应为HTML可能会很重复。

这可能导致大量重复代码，仅仅为了指定 **"text/html"** **"Content-Type"**。

但如果在发送响应后，我们能够检测到响应是一个HTML字符串，然后自动附加标题呢？

这就是生命周期概念发挥作用的时候。

## 钩子

我们将每个拦截生命周期事件的函数称为 **"钩子"**，因为该函数钩入了生命周期事件。

钩子可以分为两种类型：

1. 本地钩子：在特定路由上执行
2. 拦截钩子：在每个路由上执行

::: tip
钩子将接受与处理程序相同的上下文，您可以想象在特定点添加一个路由处理程序。
:::

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，您可以内联钩子到路由处理程序中：

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

响应应列出如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## 拦截钩子

将钩子注册到 **当前实例** 后的每个处理程序。

要添加拦截钩子，您可以使用 `.on` 后跟以 camelCase 形式的生命周期事件：

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

响应应列出如下：

| 路径  | Content-Type             |
| ----- | ------------------------ |
| /     | text/html; charset=utf8  |
| /hi   | text/html; charset=utf8  |
| /none | text/plain; charset=utf8 |

来自其他插件的事件也适用于路由，因此代码的顺序很重要。

::: tip
以上代码仅适用于当前实例，不适用于父实例。

请参阅 [作用域](/essential/plugin#scope) 以了解原因
:::

## 代码顺序

Elysia的生命周期代码顺序非常重要。

因为事件仅在注册后 **应用于** 路由。

如果您在插件之前放置 onError，则插件将不继承 onError 事件。

```typescript
import { Elysia } from 'elysia'

new Elysia()
 	.onBeforeHandle(() => {
        console.log('1')
    })
	.get('/', () => '你好')
    .onBeforeHandle(() => {
        console.log('2')
    })
    .listen(3000)
```

控制台应记录如下内容：

```bash
1
```

注意它没有记录 **2**，因为事件在路由之后注册，因此不会应用于该路由。

这也适用于插件。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onBeforeHandle(() => {
		console.log('1')
	})
	.use(someRouter)
	.onBeforeHandle(() => {
		console.log('2')
	})
	.listen(3000)
```

在上面的代码中，仅 **1** 将被记录，因为事件在插件之后注册。

这是因为每个事件将嵌入到路由处理程序中，以创建真正的封装作用域和静态代码分析。

唯一的例外是 `onRequest`，该请求在路由处理程序之前执行，因此它不能内联并束缚到路由处理流程中。

## 请求

对于每个新请求，执行的第一个生命周期事件是接收请求。

由于 `onRequest` 旨在仅提供最重要的上下文以减少开销，因此建议在以下场景中使用：

- 缓存
- 限速器 / IP/区域锁定
- 分析
- 提供自定义头部，例如 CORS

#### 示例

以下是强制限制某个 IP 地址的速率的伪代码。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .use(rateLimiter)
    .onRequest(({ rateLimiter, ip, set, status }) => {
        if (rateLimiter.check(ip)) return status(420, '保持冷静')
    })
    .get('/', () => '你好')
    .listen(3000)
```

如果从 `onRequest` 返回一个值，它将作为响应使用，并且其余生命周期将被跳过。

### 预上下文

上下文的 onRequest 被类型化为 `PreContext`，是一种表示 `Context` 的最小表示形式，包含如下属性：
请求: `Request`

- set: `Set`
- store
- decorators

上下文不提供 `derived` 值，因为派生是基于 `onTransform` 事件的。

## 解析

解析是Express中**主体解析器**的等价物。

一个解析主体的函数，返回值将附加到 `Context.body`，如果没有，Elysia将继续迭代由 `onParse` 分配的其他解析函数，直到主体被分配或所有解析程序都执行完毕。

默认情况下，Elysia将解析以下内容类型的主体：

- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

建议使用 `onParse` 事件提供Elysia不提供的自定义主体解析器。

#### 示例

以下是基于自定义头部检索值的示例代码。

```typescript
import { Elysia } from 'elysia'

new Elysia().onParse(({ request, contentType }) => {
    if (contentType === 'application/custom-type') return request.text()
})
```

返回的值将被分配给 Context.body。如果没有，Elysia将继续迭代 `onParse` 栈中的其他解析函数，直到主体被分配或所有解析器都执行完毕。

### 上下文

`onParse` 上下文是从 `Context` 扩展的，具有以下附加属性：

- contentType: 请求的 Content-Type 头

所有上下文是基于正常上下文的，可以像常规上下文一样在路由处理程序中使用。

### 解析器

默认情况下，Elysia将尝试提前确定主体解析函数并选择最合适的函数以加快处理速度。

Elysia能够通过读取 `body` 来确定该主体函数。

看看这个例子：

```typescript
import { Elysia, t } from 'elysia'

new Elysia().post('/', ({ body }) => body, {
    body: t.Object({
        username: t.String(),
        password: t.String()
    })
})
```

Elysia读取主体架构并发现类型完全是一个对象，因此主体很可能是JSON。Elysia会提前选择JSON主体解析函数并尝试解析主体。

这是Elysia用于选择主体解析器类型的标准

- `application/json`: 主体类型为 `t.Object`
- `multipart/form-data`: 主体类型为 `t.Object`，并且是1级深，包含 `t.File`
- `application/x-www-form-urlencoded`: 主体类型为 `t.URLEncoded`
- `text/plain`: 其他基本类型

这使Elysia能够提前优化主体解析器，减少编译时的开销。

### 显式解析器

然而，在某些情况下，如果Elysia未能选择正确的主体解析函数，我们可以通过指定 `type` 显式告知Elysia使用某个函数。

```typescript
import { Elysia } from 'elysia'

new Elysia().post('/', ({ body }) => body, {
    // application/json的简写
    parse: 'json'
})
```

允许我们在复杂情况下控制Elysia选择主体解析函数以适应我们的需求。

`type` 可以是以下之一：

```typescript
type ContentType = |
    // 'text/plain' 的简写
    | 'text'
    // 'application/json' 的简写
    | 'json'
    // 'multipart/form-data' 的简写
    | 'formdata'
    // Shorthand for 'application/x-www-form-urlencoded'
    | 'urlencoded'
    // Skip body parsing entirely
    | 'none'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

### 跳过主体解析

当您需要与第三方 HTTP 处理库集成，如 `trpc`、`orpc`，并且抛出 `Body is already used` 错误时。

这是因为 Web 标准的 Request 只能被解析一次。

Elysia 和第三方库都拥有自己的 body 解析器，因此可通过指定 `parse: 'none'` 跳过 Elysia 端的 body 解析。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.post(
		'/',
		({ request }) => library.handle(request),
		{
			parse: 'none'
		}
	)
```

### 自定义解析器

可以通过 `parser` 注册自定义解析器：

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

在**验证**过程之前执行，旨在修改上下文以符合验证或附加新值。

建议在以下情况下使用转换：

- 修改现有上下文以符合验证。
- `derive` 基于 `onTransform`，支持提供类型。

#### 示例

以下是使用转换将参数修改为数字值的示例。

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

在**验证**之前直接追加新值到上下文。它存储在与**转换**相同的栈中。

与**state**和**decorate**不同，后者在服务器启动之前分配值。**derive**在每次请求发生时分配属性。允许我们将一部分信息提取到一个属性中。

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

因为 **derive** 在每次新请求开始时分配，所以 **derive** 可以访问请求属性，如 **headers**、**query**、**body**，而 **store** 和 **decorate** 则不能。

与 **state** 和 **decorate** 不同，由 **derive** 分配的属性是唯一的，不与另一个请求共享。

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

## 处理前

在验证后和主要路由处理程序之前执行。

旨在提供自定义验证，以提供运行主要处理程序之前的特定需求。

如果返回一个值，则将跳过路由处理程序。

建议在以下情况下使用处理前：

- 限制访问检查：授权，用户登录
- 针对数据结构的自定义请求要求

#### 示例

以下是使用处理前检查用户登录状态的示例。

```typescript
import { Elysia } from 'elysia'
import { validateSession } from './user'

new Elysia()
    .get('/', () => '你好', {
        beforeHandle({ set, cookie: { session }, status }) {
            if (!validateSession(session.value)) return status(401)
        }
    })
    .listen(3000)
```

响应应列出如下：

| 是否已登录 | 响应         |
| ---------- | ------------ |
| ❌         | 未授权      |
| ✅         | 你好        |

### 守卫

当我们需要将同一个处理前应用于多个路由时，可以使用 `guard` 将相同的处理前应用于多个路由。

```typescript
import { Elysia } from 'elysia'
import { signUp, signIn, validateSession, isUserExists } from './user'

new Elysia()
    .guard(
        {
            beforeHandle({ set, cookie: { session }, status }) {
                if (!validateSession(session.value)) return status(401)
            }
        },
        (app) =>
            app
                .get('/user/:id', ({ body }) => signUp(body))
                .post('/profile', ({ body }) => signIn(body), {
                    beforeHandle: isUserExists
                })
    )
    .get('/', () => '你好')
    .listen(3000)
```

## 解析

在验证**之后**追加新值到上下文。它存储在与**处理前**相同的栈中。

解析的语法与 [derive](#derive) 相同，下面是一个从 Authorization 插件中检索 bearer 头部的示例。

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

控制台应记录如下：

```bash
1
2
3
```

与 **derive** 相同，由 **resolve** 分配的属性是唯一的，不与另一个请求共享。

### 守卫解析

因为解析在本地钩子中不可用，建议使用守卫来封装 **resolve** 事件。

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

在主要处理程序之后执行，用于将**处理前**和**路由处理程序**的返回值映射到适当的响应中。

建议在以下情况下使用处理后：

- 将请求转换为新值，例如压缩、事件流
- 根据响应值添加自定义头部，例如 **Content-Type**

#### 示例

以下是使用处理后将HTML内容类型添加到响应头的示例。

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

响应应列出如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

### 返回值

如果返回一个值，处理后将使用该返回值作为新响应值，除非该值为 **undefined**。

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

与 **beforeHandle** 不同的是，在 **afterHandle** 返回值后，后处理的迭代 **将 **不** 被跳过。**

### 上下文

`onAfterHandle` 上下文从 `Context` 扩展，并具有额外的 `response` 属性，这是返回给客户端的响应。

`onAfterHandle` 上下文是基于正常上下文的，可以像常规上下文一样在路由处理程序中使用。

## 映射响应

在**"afterHandle"** 之后执行，旨在提供自定义响应映射。

建议在以下情况下使用映射响应：

- 压缩
- 将值映射到Web标准响应

#### 示例

以下是使用mapResponse提供响应压缩的示例。

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
    .get('/text', () => '映射响应')
    .get('/json', () => ({ map: '响应' }))
    .listen(3000)
```

与 **parse** 和 **beforeHandle** 一样，在返回一个值后，下一个**mapResponse** 的迭代将被跳过。

Elysia将自动处理**mapResponse**中**set.headers**的合并过程。我们无需担心手动将**set.headers**附加到响应中。

## 错误处理（On Error）

旨在进行错误处理。当在任何生命周期中抛出错误时，它将执行。

建议在以下情况下使用错误处理：

- 提供自定义错误消息
- 作为容错或错误处理程序或重试请求
- 日志记录和分析

#### 示例

Elysia捕获所有在处理程序中抛出的错误，分类错误代码并将其传递到`onError`中间件。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('服务器正在维护')

        return '无法到达'
    })
```

通过 `onError` 我们可以捕获并将错误转换为自定义错误消息。

::: tip
重要的是，`onError` 必须在我们希望应用它的处理程序之前被调用。
:::

### 自定义404消息

例如，返回自定义404消息：

```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, status, set }) => {
        if (code === 'NOT_FOUND') return status(404, '未找到 :(')
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

Elysia错误代码包括：

"UNKNOWN" | "VALIDATION" | "NOT_FOUND" | "PARSE" | "INTERNAL_SERVER_ERROR" | "INVALID_COOKIE_SIGNATURE" | "INVALID_FILE_TYPE"

- **NOT_FOUND**
- **PARSE**
- **VALIDATION**
- **INTERNAL_SERVER_ERROR**
- **INVALID_COOKIE_SIGNATURE**
- **INVALID_FILE_TYPE**
- **UNKNOWN**
- **number**（基于HTTP状态）

默认情况下，抛出的错误代码为 `UNKNOWN`。

::: tip
如果没有返回错误响应，则错误将使用`error.name`返回。
:::

### 抛出或返回

`Elysia.error` 是返回具有特定HTTP状态代码的错误的简写。

根据您的具体需求，它可以是 **返回** 或 **抛出**。

- 如果 `status` **为抛出**，它将被 `onError` 中间件捕获。
- 如果 `status` **为返回**，它将 **不会** 被 `onError` 中间件捕获。

请看以下代码：

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .onError(({ code, error, path }) => {
        if (code === 418) return '捕获'
    })
    .get('/throw', ({ status }) => {
        // 这将被 onError 捕获
        throw status(418)
    })
    .get('/return', ({ status }) => {
        // 这将 **不会** 被 onError 捕获
        return status(418)
    })
```

<Playground
    :elysia="demo"
/>

### 自定义错误

Elysia支持在类型级别和实现级别的自定义错误。

要提供自定义错误代码，我们可以使用 `Elysia.error` 添加自定义错误代码，帮助我们轻松分类并缩小错误类型，以实现完整的类型安全和自动补全，如下所示：

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
            // 具有自动补全
            case 'MyError':
                // 具有类型缩小
                // 悬停以查看错误的类型为`CustomError`
                return error
        }
    })
    .get('/', () => {
        throw new MyError('你好，错误')
    })
```

### 本地错误

与其他生命周期相同，我们使用守卫将错误提供到[作用域](/essential/plugin.html#scope)中：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => '你好', {
        beforeHandle({ set, request: { headers }, error }) {
            if (!isSignIn(headers)) throw error(401)
        },
        error({ error }) {
            return '已处理'
        }
    })
    .listen(3000)
```

## 响应后

在响应发送到客户端后执行。

建议在以下情况下使用 **响应后**：

- 清理响应
- 日志记录和分析

#### 示例

以下是使用响应处理程序检查用户登录状态的示例。

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

`onAfterResponse` 的 `response` 不是Web标准的 `Response`，而是处理程序返回的值。

要获取从处理程序返回的头部和状态，我们可以通过上下文访问 `set`。 

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(({ set }) => {
		console.log(set.status, set.headers)
	})
	.get('/', () => '你好')
	.listen(3000)
```