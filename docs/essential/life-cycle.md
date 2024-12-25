---
title: 生命周期 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 生命周期 - ElysiaJS

    - - meta
      - name: 'description'
        content: 生命周期事件是 Elysia 处理过程每个阶段的概念，“生命周期”或“钩子”是一个事件监听器，用于拦截并监听在周期性事件中。钩子使您能够转化通过数据管道运行的数据。借助钩子，您可以充分定制 Elysia 的潜力。

    - - meta
      - property: 'og:description'
        content: 生命周期事件是 Elysia 处理过程每个阶段的概念，“生命周期”或“钩子”是一个事件监听器，用于拦截并监听在周期性事件中。钩子使您能够转化通过数据管道运行的数据。借助钩子，您可以充分定制 Elysia 的潜力。
---

<script setup>
import Card from '../../components/nearl/card.vue'
import Deck from '../../components/nearl/card-deck.vue'
</script>

# 生命周期

生命周期允许我们在预定义的点拦截一个重要事件，使我们能够根据需要自定义服务器的行为。

Elysia 的生命周期事件可以如下图示：
![Elysia 生命周期图](/assets/lifecycle.webp)

以下是 Elysia 中可用的请求生命周期：

<Deck>
    <Card title="请求" href="#request">
        通知新事件已接收
    </Card>
    <Card title="解析" href="#parse">
        解析正文到 <b>Context.body</b>
    </Card>
    <Card title="转化" href="#transform">
        在验证之前修改 <b>Context</b>
    </Card>
    <Card title="处理前" href="#before-handle">
        路由处理器之前进行自定义验证
    </Card>
    <Card title="处理后" href="#after-handle">
        将返回值转化为新值
    </Card>
    <Card title="映射响应" href="#map-response">
        将返回值映射为响应
    </Card>
    <Card title="出错时" href="#on-error">
        捕获抛出的错误
    </Card>
    <Card title="响应后" href="#after-response">
        在响应发送给客户端后执行
    </Card>
    <Card title="追踪" href="/patterns/trace">
        审核并捕获每个事件的时间跨度
    </Card>
</Deck>

## 为什么
想象一下我们想要返回一些 HTML。

我们需要将**"Content-Type"** 头设置为 **"text/html"**，以便浏览器能够渲染 HTML。

如果有很多处理器（比如 ~200 个端点），明确指定响应为 HTML 可能会是重复的。

这可能导致大量重复代码，仅仅是为了指定 **"text/html"** 的 **"Content-Type"**。

但是如果在发送响应后，我们可以检测到响应是一个 HTML 字符串，然后自动添加该头部呢？

这就是生命周期的概念发挥作用的地方。

## 钩子

我们将拦截生命周期事件的每个函数称为 **"钩子"**，因为该函数钩入了生命周期事件。

钩子可以分为两种类型：

1. 本地钩子：在特定路由上执行
2. 拦截器钩子：在每个路由上执行

::: tip
钩子将接受与处理程序相同的 Context，您可以想象在特定时点添加路由处理程序。
:::

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，您可以将钩子内联到路由处理程序中：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好, 世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好, 世界</h1>')
    .listen(3000)
```

响应应列出如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## 拦截器钩子

将钩子登记到 **当前实例** 的每个处理程序中。

要添加一个拦截器钩子，您可以使用 `.on` 后跟生命周期事件（驼峰命名）：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/none', () => '<h1>你好, 世界</h1>')
    .onAfterHandle(({ response, set }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>你好, 世界</h1>')
    .get('/hi', () => '<h1>你好, 世界</h1>')
    .listen(3000)
```

响应应列出如下：

| 路径  | Content-Type             |
| ----- | ------------------------ |
| /     | text/html; charset=utf8  |
| /hi   | text/html; charset=utf8  |
| /none | text/plain; charset=utf8 |

来自其他插件的事件也适用于该路由，因此代码的顺序很重要。

::: tip
上面的代码仅适用于当前实例，不会适用于父实例。

有关原因，请查看 [作用域](/essential/plugin#scope)。
:::

## 代码顺序

Elysia 的生命周期代码顺序非常重要。

Elysia 的生命周期事件存储为队列，即先进先出。因此，Elysia **总是** 尊重从上到下的代码顺序，之后是生命周期事件的顺序。

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
每个新请求接收的第一个生命周期事件是 `onRequest`。

由于 `onRequest` 旨在提供最至关重要的上下文以减少开销，因此建议在以下情况下使用：
- 缓存
- 速率限制器/IP/区域锁定
- 分析
- 提供自定义头，例如 CORS

#### 示例
下面是一个伪代码示例，用于对某个 IP 地址实施速率限制。
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .use(rateLimiter)
    .onRequest(({ rateLimiter, ip, set, error }) => {
        if(rateLimiter.check(ip))
            return error(420, '请保持冷静')
    })
    .get('/', () => 'hi')
    .listen(3000)
```

如果从 `onRequest` 返回一个值，它将作为响应使用，生命周期的其余部分将被跳过。

### 预上下文
`onRequest` 的上下文被类型化为 `PreContext`，这是 `Context` 的最小表示，包含以下属性：
请求: `Request`
- set: `Set`
- store
- decorators

上下文不提供 `derived` 值，因为导出是基于 `onTransform` 事件。

## 解析
解析相当于 Express 中的 **body parser**。

一个解析正文的函数，返回值将追加到 `Context.body`，如果没有，Elysia 将继续迭代由 `onParse` 分配的其他解析函数，直到分配正文或所有解析函数都被执行。

默认情况下，Elysia 将对以下内容类型的正文进行解析：
- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

建议使用 `onParse` 事件提供 Elysia 不提供的自定义正文解析器。

#### 示例
下面是一个示例代码，根据自定义头部检索值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

返回的值将分配给 Context.body。如果没有，Elysia 将继续迭代 `onParse` 队列中的其他解析函数，直到分配正文或所有解析函数都被执行。

### 上下文
`onParse` 的上下文扩展自 `Context`，附加属性如下：
- contentType: 请求的Content-Type头部

所有上下文均基于正常上下文，可以像正常上下文一样在路由处理程序中使用。

### 解析器

默认情况下，Elysia 将尝试提前确定正文解析函数，并选择最合适的函数以加快处理速度。

Elysia 能够通过读取 `body` 来确定该正文函数。

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

Elysia 读取正文模式并发现，类型完全是一个对象，因此该正文很可能是 JSON。Elysia 然后提前选择 JSON 正文解析函数并尝试解析正文。

这是 Elysia 用来选择正文解析器类型的标准：

- `application/json`: 正文类型为 `t.Object`
- `multipart/form-data`: 正文类型为 `t.Object`，并且嵌套深度为 1 层，包含 `t.File`
- `application/x-www-form-urlencoded`: 正文类型为 `t.URLEncoded`
- `text/plain`: 其他原始类型

这使得 Elysia 能够提前优化正文解析器，并减少编译时的开销。

### 显式解析器
然而，在某些场景中，如果 Elysia未能选择正确的正文解析函数，我们可以通过指定 `type` 明确告诉 Elysia 使用某个特定函数。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        // application/json 的简写形式
        parse: 'json'
    })
```

这使我们能够控制 Elysia 选择正文解析函数以适应复杂场景的需求。

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

您可以使用 `parser` 提供注册自定义解析器：

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ request, contentType }) => {
		if(contentType === "application/elysia")
			return request.text()
	})
	.post('/', ({ body }) => body, {
        parse: ['custom', 'json']
    })
```

## 转化
在 **验证** 过程之前执行，旨在变异上下文以符合验证或附加新值。

建议在以下情况下使用转化：
- 变异现有上下文以符合验证。
- `derive` 基于 `onTransform` 并支持提供类型。

#### 示例
下面是一个使用转化的示例，将参数变异为数值型。

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

## 导出
旨在直接在验证过程之前将新值附加到上下文中，存储在与 **transform** 相同的队列中。

与 **state** 和 **decorate** 不同，后者是在服务器启动之前分配值。 **derive** 是在每个请求发生时分配属性，允许我们将一部分信息提取到一个属性中。

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

由于 **derive** 在新的请求开始时被分配，**derive** 可以访问 Request 属性，如 **headers**、**query**、**body**，而 **store** 和 **decorate** 则不能。

与 **state** 和 **decorate** 不同，通过 **derive** 分配的属性是唯一的，并不会与其他请求共享。

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

在验证后和主要路由处理器之前执行。

旨在提供特定要求的自定义验证，在运行主处理程序之前。

如果返回了一个值，路由处理程序将被跳过。

建议在以下情况下使用处理前：

-   访问限制检查：授权，用户登录
-   数据结构上的自定义请求要求

#### 示例

下面是一个使用处理前检查用户登录的示例。

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

响应应列出如下：

| 是否已登录 | 响应         |
| ---------- | ------------ |
| ❌         | 未经授权     |
| ✅         | 你好         |

### 守卫

当我们需要将相同的处理前应用于多个路由时，可以使用 `guard` 将相同的处理前应用到多个路由。

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

一个 “安全”的版本 [derive](#derive)。

旨在在验证过程后将新值附加到上下文中，存储在与 **beforeHandle** 相同的队列中。

解决语法与 [derive](#derive) 相同，下面是一个示例，通过授权插件获取 bearer 头。

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

与 **derive** 相同，通过 **resolve** 分配的属性是唯一的，并不会与其他请求共享。

### 守卫解决

由于解决在本地钩子中不可用，因此建议使用守卫来封装 **resolve** 事件。

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

在主处理器之后执行，用于将 **before handle** 和 **route handler** 的返回值映射为适当的响应。

建议在以下情况下使用处理后：

-   将请求转换为新值，例如：压缩、事件流
-   根据响应值添加自定义头，例如 **Content-Type**

#### 示例

下面是一个使用处理后的示例，将HTML内容类型添加到响应头。

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好, 世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['content-type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>你好, 世界</h1>')
    .listen(3000)
```

响应应列出如下：

| 路径 | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

### 返回值

如果返回一个值，处理后将使用返回值作为新的响应值，除非该值为 **undefined**。

以上示例可以重写为以下内容：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>你好, 世界</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response)) {
                set.headers['content-type'] = 'text/html; charset=utf8'
                return new Response(response)
            }
        }
    })
    .get('/hi', () => '<h1>你好, 世界</h1>')
    .listen(3000)
```

与 **beforeHandle** 不同，在 **afterHandle** 返回一个值后，处理后的迭代 **将**不会被跳过。

### 上下文

`onAfterHandle` 的上下文扩展自 `Context`，附加属性为 `response`，是返回给客户端的响应。

`onAfterHandle` 的上下文基于正常上下文，并且可以像正常上下文一样在路由处理程序中使用。

## 映射响应

在 **"afterHandle"** 之后执行，旨在提供自定义响应映射。

建议在以下情况下使用映射响应：

-   压缩
-   将值映射为Web标准响应

#### 示例

下面是一个使用映射响应进行响应压缩的示例。

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
    .get('/text', () => 'mapResponse')
    .get('/json', () => ({ map: 'response' }))
    .listen(3000)
```

与 **parse** 和 **beforeHandle** 类似，处理后如果返回了一个值，接下来的 **mapResponse** 的迭代将被跳过。

Elysia 将自动处理 **mapResponse** 的 **set.headers** 合并过程。我们无需担心手动将 **set.headers** 附加到响应中。

## 出错时

**出错时** 是唯一一个不是在每个请求上始终执行的生命周期事件，而是仅在任何其他生命周期中至少抛出一次错误时执行。

旨在捕获和解决意外错误，建议在以下情况下使用出错时：

-   提供自定义错误消息
-   失败安全或错误处理或重试请求
-   日志记录和分析

#### 示例

Elysia捕获处理程序中抛出的所有错误，分类错误代码，并将其传送到 `onError` 中间件。

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
重要的是 `onError` 必须在我们希望应用它的处理程序之前调用。
:::

### 自定义 404 消息
例如，返回自定义 404 消息：

```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND')
            return error(404, '找不到 :(')
    })
    .post('/', () => {
        throw new NotFoundError()
    })
    .listen(3000)
```

### 上下文

`onError` 的上下文扩展自 `Context`，附加属性如下：

-   error: 抛出的错误对象
-   code: 错误代码

### 错误代码

Elysia 错误代码由以下组成：

-   NOT_FOUND
-   INTERNAL_SERVER_ERROR
-   VALIDATION
-   PARSE
-   UNKNOWN

默认情况下，抛出的错误代码为 `unknown`。

::: tip
如果没有返回错误响应，错误将使用 `error.name` 返回。
:::

### 自定义错误

Elysia 在类型层面和实现层面都支持自定义错误。

要提供自定义错误代码，我们可以使用 `Elysia.error` 添加自定义错误代码，帮助我们轻松分类并缩小错误类型，实现完全的类型安全和自动补全，如下所示：

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
            // 自动补全
            case 'MyError':
                // 类型缩小
                // 悬停查看错误类型为 `CustomError`
                return error
        }
    })
    .get('/', () => {
        throw new MyError('Hello Error')
    })
```

`error` 的属性基于 `error` 的属性，所述属性将用于分类错误代码。

### 本地错误

与其他生命周期一样，我们可以通过 [作用域](/essential/plugin.html#scope) 在守卫中提供错误：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => '你好', {
        beforeHandle({ set, request: { headers }, error }) {
            if (!isSignIn(headers))
                throw error(401)
        },
        error({ error }) {
            return '已处理'
        }
    })
    .listen(3000)
```

## 响应后
在响应发送给客户端后执行。

建议在以下情况下使用 **响应后**：
- 清理响应
- 日志记录和分析

#### 示例
下面是一个使用响应处理程序检查用户登录的示例。

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