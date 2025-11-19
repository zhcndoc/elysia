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
import TutorialBadge from '../components/arona/badge.vue'

import { Elysia } from 'elysia'

const demo = new Elysia()
	.onError(({ code }) => {
		if (code === 418) return '捕获'
	})
    .get('/throw', ({ status }) => {
		// This will be caught by onError
		throw status(418)
	})
	.get('/return', ({ status }) => {
		// 这将不会被 onError 捕获
		return status(418)
	})
</script>

# 生命周期 <TutorialBadge href="/tutorial/getting-started/life-cycle" />

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

假设我们想返回一些 HTML。

通常，我们会设置 **"Content-Type"** 头为 **"text/html"**，以便浏览器能够渲染它。

但是手动为每个路由设置这个头信息很繁琐。

那么，如果框架能够自动检测响应是 HTML 并自动为您设置头部怎么办？这就是生命周期概念的由来。

## 钩子

每个拦截 **生命周期事件** 的函数称为 **钩子**。

<small>（函数“钩入”(hook) 生命周期事件）</small>

钩子分为两种类型：

1. [本地钩子 (Local Hook)](#local-hook)：在特定路由上执行
2. [拦截钩子 (Interceptor Hook)](#interceptor-hook)：在钩子注册后**每个路由**执行

::: tip
钩子接收与处理程序相同的上下文，你可以把它想象成在特定点添加的路由处理程序。
:::

## 本地钩子

本地钩子在特定路由上执行。

要使用本地钩子，你可以将钩子内联到路由处理程序中：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ responseValue, set }) {
            if (isHtml(responseValue))
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

钩子注册后，会作用于**当前实例**的每个处理程序。

要添加拦截钩子，可以使用 `.on` 加上驼峰形式的生命周期事件：

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/none', () => '<h1>Hello World</h1>')
    .onAfterHandle(({ responseValue, set }) => {
        if (isHtml(responseValue))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>你好，世界</h1>')
    .get('/hi', () => '<h1>你好，世界</h1>')
    .listen(3000)
```

响应应列出如下：

| 路径  | Content-Type                |
| ----- | -------------------------- |
| /none | text/**plain**; charset=utf8 |
| /     | text/**html**; charset=utf8  |
| /hi   | text/**html**; charset=utf8  |

其它插件的事件也会应用到路由上，所以代码顺序很重要。

<!--::: tip
上述代码仅对当前实例生效，不会应用到父实例。

详见 [scope](/essential/plugin#scope) 了解原因
:::-->

## 代码顺序

事件只会应用到**注册之后**的路由。

如果你在插件之前放置 onError，插件将不会继承 onError 事件。

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

控制台应输出如下内容：

```bash
1
```

注意没有输出 **2**，因为事件是在路由之后注册的，所以不会作用于该路由。

这同样适用于插件：

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

这个例子中，只会打印 **1**，因为事件是在插件之后注册的。

除了 `onRequest` 事件外，所有事件都遵循此规则。
<small>因为 onRequest 发生在请求时，不知道应用到哪个路由，所以它是全局事件。</small>

## 请求 (Request)

生命周期中第一个执行的事件是在接收到每个新请求时触发。

由于 `onRequest` 仅提供最重要的上下文以减少额外开销，建议用于以下场景：

- 缓存
- 速率限制 / IP或地区限制
- 分析统计
- 提供自定义头部，例如 CORS

#### 示例

以下是强制限制某个 IP 地址访问速率的伪代码。

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

如果 `onRequest` 返回了一个值，它将被用作响应，其余的生命周期将被跳过。

### 预上下文 (Pre-context)

`onRequest` 的上下文被类型化为 `PreContext`，它是 `Context` 的最小表示，包含以下属性：

请求: `Request`

- set: `Set`
- store
- decorators

上下文不提供派生值 (`derived`)，因为它基于 `onTransform` 事件。

## 解析 (Parse)

解析是 Express 中**主体解析器**的等价物。

一个用于解析请求主体的函数，返回值将赋值给 `Context.body`。如果没有返回，Elysia 会继续尝试下一个由 `onParse` 注册的解析函数，直到主体被赋值或所有解析器都执行完毕。

默认情况下，Elysia 解析以下内容类型的请求体：

- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

建议通过 `onParse` 事件提供 Elysia 默认不支持的自定义主体解析器。

#### 示例

以下是基于自定义头部类型解析请求体的示例代码。

```typescript
import { Elysia } from 'elysia'

new Elysia().onParse(({ request, contentType }) => {
    if (contentType === 'application/custom-type') return request.text()
})
```

返回值会赋值给 `Context.body`。如果没有返回，Elysia 将继续迭代 `onParse` 栈中的其他解析函数，直到请求体被赋值或所有解析器执行完成。

### 上下文

`onParse` 的上下文基于 `Context` 扩展，包含以下新增属性：

- contentType: 请求的 Content-Type 头部

所有上下文基于标准上下文，可在路由处理程序中像普通上下文一样使用。

### 解析器

默认情况下，Elysia 会尝试提前识别请求体的类型，并选择最合适的解析器以提高性能。

Elysia 会读取路由的 `body` 类型定义来推断请求体类型。

例如：

```typescript
import { Elysia, t } from 'elysia'

new Elysia().post('/', ({ body }) => body, {
    body: t.Object({
        username: t.String(),
        password: t.String()
    })
})
```

Elysia 读取请求体的架构并发现是对象类型，则猜测请求体是 JSON，便会提前使用 JSON 解析器尝试解析请求体。

Elysia 用于选择解析器的规则如下：

- `application/json`：当体类型为 `t.Object`
- `multipart/form-data`：体类型为一级深度包含 `t.File` 的 `t.Object`
- `application/x-www-form-urlencoded`：体类型为 `t.URLEncoded`
- `text/plain`：其他基本类型

这使 Elysia 能够提前优化体解析性能，减少编译时开销。

### 显式解析器

在某些情况下，若 Elysia 未能正确选择解析器，可通过显式指定 `parse` 类型指定使用哪个解析器。

```typescript
import { Elysia } from 'elysia'

new Elysia().post('/', ({ body }) => body, {
    // application/json 的简写
    parse: 'json'
})
```

这样可以在复杂场景中控制 Elysia 选择合适的解析器。

`parse` 可使用以下类型：

```typescript
type ContentType = |
    // 'text/plain' 简写
    | 'text'
    // 'application/json' 简写
    | 'json'
    // 'multipart/form-data' 简写
    | 'formdata'
    // 'application/x-www-form-urlencoded' 简写
    | 'urlencoded'
    // 跳过解析
    | 'none'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

### 跳过主体解析

当你需要集成第三方 HTTP 处理库（如 `trpc`、`orpc`），并遇到抛出 `Body is already used` 错误时，可以跳过 Elysia 的请求体解析。

这是因为 Web 标准中请求体只能被读取一次。

Elysia 和第三方库都有各自的解析器，可以通过指定 `parse: 'none'` 来跳过 Elysia 端的解析。

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

可通过 `parser` 方法注册自定义解析器：

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

## 转换 (Transform)

在**验证之前**执行，目的是修改上下文以适配验证或附加新值。

建议在以下场景使用转换：

- 修改已有上下文以符合验证要求
- 通过 `derive` 基于 `onTransform` 支持提供类型

#### 示例

以下示例展示了如何使用转换将参数修改为数字类型。

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

## 派生 (Derive)

在**验证之前**将新值附加到上下文。它与**转换**存在于同一个调用栈。

与**state**和**decorate**不同，后者在服务器启动前分配值。**derive** 在每次请求时分配属性。它允许将部分信息提取到单独的属性中。

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

因为 **derive** 会在每个请求开始时赋值，所以能够访问请求属性，比如 **headers**、**query**、**body**，而 **store** 和 **decorate** 则不能。

不同于 **state** 和 **decorate**，由 **derive** 分配的属性是唯一的，不会与其它请求共享。

::: tip
你可能大多数情况下更想使用 [resolve](#resolve)。

Resolve 类似 derive 但在验证之后执行。这使得 resolve 更安全，因为我们可以先验证传入数据，再用它派生新属性。
:::

### 队列

`derive` 和 `transform` 存储在同一个队列。

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

控制台应输出：

```bash
1
2
```

## 处理前 (Before Handle)

在验证之后，主路由处理程序执行之前调用。

目的是提供自定义验证，满足运行主处理程序之前的特殊需求。

建议在以下场景使用处理前：

- 访问权限检查：授权、用户登录
- 针对数据结构的自定义请求要求

#### 示例

以下示例展示了如何通过处理前校验用户登录状态。

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

### 守卫 (Guard)

当需要将相同的处理前应用于多个路由时，可以使用 `guard` 来批量应用该处理前。

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

## 解析 (Resolve)

在验证**之后**向上下文添加新值。它和**处理前**位于同一个调用栈。

解析的语法与 [derive](#derive) 相同，以下示例展示从 Authorization 插件获取 bearer token。

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

`resolve` 和 `onBeforeHandle` 存储在同一个队列中。

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

控制台应输出：

```bash
1
2
3
```

同 **derive**，由 **resolve** 分配的属性是私有的，不会被其他请求共享。

### 守卫解析

由于 **resolve** 不适用于本地钩子，建议用守卫封装 **resolve** 事件。

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

## 处理后 (After Handle)

在主处理程序后执行，用于将**处理前**和路由处理程序的返回值映射到合适的响应。

建议在以下情况使用处理后：

- 转换请求结果，例如压缩、事件流
- 根据响应内容添加自定义头部，如 **Content-Type**

#### 示例

以下示例展示了如何使用处理后给响应添加 HTML 内容类型头。

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

如果 `afterHandle` 返回了值，则该值将作为新的响应值使用，除非该值为 **undefined**。

上述示例也可以改写为如下形式：

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

与 **beforeHandle** 不同的是，在 **afterHandle** 返回新值后，后续的处理后迭代 **不会被跳过**。

### 上下文

`onAfterHandle` 的上下文继承自 `Context`，并额外包含 `response` 属性，即返回给客户端的响应。

它基于标准上下文，可在路由处理程序中像普通上下文一样使用。

## 映射响应 (Map Response)

在 **afterHandle** 之后执行，用于自定义响应映射。

建议在以下场景使用映射响应：

- 响应压缩
- 映射值到符合 Web 标准的响应对象

#### 示例

以下示例使用 `mapResponse` 实现响应压缩。

```typescript
import { Elysia } from 'elysia'

const encoder = new TextEncoder()

new Elysia()
    .mapResponse(({ responseValue, set }) => {
        const isJson = typeof responseValue === 'object'

        const text = isJson
            ? JSON.stringify(responseValue)
            : (responseValue?.toString() ?? '')

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

与 **parse** 和 **beforeHandle** 类似，一旦返回一个值，后续的 **mapResponse** 迭代将被跳过。

Elysia 会自动处理 **set.headers** 和 Response 的合并，我们无需手动拼接头部。

## 错误处理（On Error）

设计用于处理错误。生命周期中的任何阶段发生异常时都会触发。

建议在以下场景使用 `onError`：

- 自定义错误消息
- 容错处理、错误处理或请求重试
- 记录和分析错误

#### 示例

Elysia 会捕获处理程序中抛出的所有错误，基于错误代码进行处理，并传递到 `onError` 中间件中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('服务器正在维护')

        return '无法到达'
    })
```

通过 `onError` 我们可以捕获并将错误转换为自定义消息。

::: tip
重要的是，`onError` 必须在对应处理程序之前注册。
:::

### 自定义404消息

例如，自定义返回 404 消息：

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

`onError` 的上下文继承自 `Context`，包含以下附加属性：

- **error**：抛出的错误对象
- **code**：*错误代码*

### 错误代码

Elysia 的错误代码包括：

- **NOT_FOUND**
- **PARSE**
- **VALIDATION**
- **INTERNAL_SERVER_ERROR**
- **INVALID_COOKIE_SIGNATURE**
- **INVALID_FILE_TYPE**
- **UNKNOWN**
- **number**（HTTP 状态码）

默认情况下，抛出的错误代码为 `UNKNOWN`。

::: tip
如果没有返回错误响应，将使用 `error.name` 返回错误信息。
:::

### 本地错误

与其他生命周期类似，可以通过守卫在[作用域](/essential/plugin.html#scope)内提供错误处理：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => '你好', {
        beforeHandle({ set, request: { headers }, error }) {
            if (!isSignIn(headers)) throw error(401)
        },
        error() {
            return 'Handled'
        }
    })
    .listen(3000)
```

## 响应后 (After Response)

在响应发送到客户端后执行。

建议在以下场景使用响应后：

- 清理资源
- 日志记录和分析

#### 示例

以下示例使用响应后处理程序打印响应时间。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onAfterResponse(() => {
        console.log('响应', performance.now())
    })
    .listen(3000)
```

控制台应输出：

```bash
响应 0.0000
响应 0.0001
响应 0.0002
```

### Response

与 [映射响应](#map-response) 类似，`onAfterResponse` 接受一个 `responseValue`。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(({ responseValue }) => {
		console.log(responseValue)
	})
	.get('/', () => '你好')
	.listen(3000)
```

`onAfterResponse` 的 `response` 并非 Web 标准的 `Response`，而是处理程序返回的值。

要获取返回的头部和状态，可以通过上下文的 `set` 访问：

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(({ set }) => {
		console.log(set.status, set.headers)
	})
	.get('/', () => '你好')
	.listen(3000)
```