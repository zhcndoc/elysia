---
title: 处理程序 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 处理程序 - ElysiaJS

    - - meta
      - name: 'description'
        content: 处理程序是响应每个路由请求的函数。接受请求信息并返回响应给客户端。处理程序可以通过 Elysia.get / Elysia.post 注册。

    - - meta
      - property: 'og:description'
        content: 处理程序是响应每个路由请求的函数。接受请求信息并返回响应给客户端。处理程序可以通过 Elysia.get / Elysia.post 注册。
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import Tab from '../components/fern/tab.vue'
import { Elysia } from 'elysia'

const handler1 = new Elysia()
    .get('/', ({ path }) => path)

const handler2 = new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))

const demo1 = new Elysia()
    .state('version', 1)
    .get('/a', ({ store: { version } }) => version)
    .get('/b', ({ store }) => store)
    .get('/c', () => 'still ok')

const demo2 = new Elysia()
    // @ts-expect-error
    .get('/error', ({ store }) => store.counter)
    .state('version', 1)
    .get('/', ({ store: { version } }) => version)

const demo3 = new Elysia()
    .derive(({ headers }) => {
        const auth = headers['authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer ?? '12345')

const demo4 = new Elysia()
    .state('counter', 0)
    .state('version', 1)
    .state(({ version, ...store }) => ({
        ...store,
        elysiaVersion: 1
    }))
    // ✅ 从状态重映射创建
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ 从状态重映射排除
    .get('/version', ({ store }) => store.version)

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const demo5 = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)

const demo6 = new Elysia()
    .use(setup.prefix('all', 'setup'))
    .get('/', ({ setupCarbon }) => setupCarbon)

const demo7 = new Elysia()
    .state('counter', 0)
    // ✅ 使用引用，共享值
    .get('/', ({ store }) => store.counter++)
    // ❌ 在原始值上创建新变量，链接丢失
    .get('/error', ({ store: { counter } }) => counter)
</script>

# 处理程序

**Handler** - 接受 HTTP 请求并返回响应的函数。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // 函数 `() => 'hello world'` 是一个处理程序
    .get('/', () => 'hello world')
    .listen(3000)
```

处理程序可以是文字值，也可以是内联值。

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/video', file('kyuukurarin.mp4'))
    .listen(3000)
```

使用**内联值**始终返回相同的值，这有助于优化静态资源（如文件）的性能。

这使得 Elysia 可以提前编译响应以优化性能。

::: tip
提供内联值并不是缓存。

静态资源值、头部和状态可以使用生命周期动态改变。
:::

## 上下文

**上下文**包含每个请求唯一的请求信息，除了 `store` <small>(全局可变状态)</small>，不被共享。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', (context) => context.path)
            // ^ 这是上下文
```

**上下文**只能在路由处理程序中访问。它包括：

#### 属性
-   [**body**](/essential/validation.html#body) - [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)，表单或文件上传。
-   [**query**](/essential/validation.html#query) - [查询字符串](https://en.wikipedia.org/wiki/Query_string)，包含额外搜索参数的 JavaScript 对象。（查询从路径名后“?”号开始提取）
-   [**params**](/essential/validation.html#params) - Elysia 的路径参数，解析为 JavaScript 对象
-   [**headers**](/essential/validation.html#headers) - [HTTP 头部](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)，请求的附加信息，如 User-Agent、Content-Type、缓存提示等。
-   [**cookie**](#cookie) - 一个全局可变信号存储，用于交互 Cookie（包括获取和设置）
-   [**store**](#state) - Elysia 实例的全局可变存储

#### 工具函数
-   [**redirect**](#redirect) - 重定向响应的函数
-   [**status**](#status) - 返回自定义状态码的函数
-   [**set**](#set) - 应用于响应的属性：
    -   [**headers**](#set.headers) - 响应头部

#### 其他属性
-   [**request**](#request) - [Web 标准 Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
-   [**server**](#server-bun-only) - Bun 服务器实例
-   **path** - 请求的路径名

## status
返回自定义状态码的函数，并支持类型缩小。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))
    .listen(3000)
```

<Playground :elysia="handler2" />

建议使用**永不抛出**（never-throw）方式返回**status**，而非抛出错误，因为它：
- 允许 TypeScript 检查返回值是否符合响应模式的类型
- 基于状态码支持自动补全的类型缩小
- 支持端到端类型安全的错误处理的类型缩小（参考 [Eden](/eden/overview)）

<!--### status
我们可以通过以下两种方式返回自定义状态码：

- **status** 函数（推荐）
- **set.status**（遗留）

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/error', ({ status }) => status(418, '我是茶壶'))
	.get('/set.status', ({ set }) => {
		set.status = 418
		return '我是茶壶'
	})
	.listen(3000)
```
-->

## Set

**set** 是一个可变属性，代表通过 `Context.set` 访问的响应。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set, status }) => {
		set.headers = { 'X-Teapot': 'true' }

		return status(418, '我是茶壶')
	})
	.listen(3000)
```

### set.headers
允许我们附加或删除响应头，以对象形式表示。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return 'a mimir'
    })
    .listen(3000)
```

::: tip
Elysia 为区分大小写提供了小写自动补全以保持一致性，例如使用 `set-cookie` 而非 `Set-Cookie`。
:::

<details>

<summary>
redirect <Badge type="warning">遗留</Badge>
</summary>

将请求重定向到其他资源。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ redirect }) => {
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
    })
    .get('/custom-status', ({ redirect }) => {
        // 你还可以设置自定义状态码来重定向
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
    })
    .listen(3000)
```

使用重定向时，返回值不是必须的且会被忽略，因为响应来自其他资源。

</details>

<details>

<summary>
	set.status <Badge type="warning">遗留</Badge>
</summary>

设置默认状态码（如果未提供）。

建议在只需返回特定状态码，但允许用户返回自定义值的插件中使用，例如 HTTP 201/206 或 403/405 等。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(({ set }) => {
        set.status = 418

        return 'Kirifuji Nagisa'
    })
    .get('/', () => 'hi')
    .listen(3000)
```

与 `status` 函数不同，`set.status` 无法推断返回值类型，因此无法检查返回值是否符合响应模式。

::: tip
HTTP 状态码指示响应类型。如果路由处理程序成功执行且无错误，Elysia 将返回状态码 200。
:::

你也可以使用状态码的常用名字替代数字来设置状态码。

```typescript twoslash
// @errors 2322
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status
          // ^?
        return 'Kirifuji Nagisa'
    })
    .listen(3000)
```

</details>

## Cookie
Elysia 提供一个可变信号用以交互 Cookie。

无需显式的 get/set，你可以直接访问 cookie 名称并读取或更新其值。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/set', ({ cookie: { name } }) => {
		// 读取
        name.value

        // 设置
        name.value = "新值"
	})
```

更多信息见 [模版：Cookie](/essentials/cookie)。

## Redirect
将请求重定向到其他资源。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ redirect }) => {
		return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
	})
	.get('/custom-status', ({ redirect }) => {
		// 你也可以设置自定义状态码来重定向
		return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
	})
	.listen(3000)
```

使用重定向时，返回值不是必须且会被忽略，因为响应来自其他资源。

## 表单数据
可以通过直接从处理程序返回 `form` 工具来返回 `FormData`。

```typescript
import { Elysia, form, file } from 'elysia'

new Elysia()
	.get('/', () => form({
		name: 'Tea Party',
		images: [file('nagi.web'), file('mika.webp')]
	}))
	.listen(3000)
```

这种模式非常有用，即使需要返回文件或多部分表单数据。

### 返回单个文件
或者，你也可以直接返回单个文件，不用包裹在 `form`。

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
	.get('/', file('nagi.web'))
	.listen(3000)
```

## 流
通过使用带 `yield` 关键字的生成器函数返回响应流。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

在此示例中，我们使用 `yield` 关键字实现响应的流式传输。

## 服务器发送事件 (SSE)

Elysia 通过提供 `sse` 工具支持 [服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)。

```typescript twoslash
import { Elysia, sse } from 'elysia'

new Elysia()
	.get('/sse', function* () {
		yield sse('hello world')
		yield sse({
			event: 'message',
			data: {
				message: '这是一个消息',
				timestamp: new Date().toISOString()
			},
		})
	})
```

当值被包裹在 `sse` 中时，Elysia 会自动将响应头设置为 `text/event-stream`，并格式化数据为 SSE 事件。

### 服务器发送事件中的头部

头部只能在第一个数据块（chunk）被 `yield` 之前设置。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		// 这会设置头部
		set.headers['x-name'] = 'Elysia'
		yield 1
		yield 2

		// 这不会生效
		set.headers['x-id'] = '1'
		yield 3
	})
```

一旦第一个数据块被 `yield`，Elysia 会将头部发送给客户端，因此之后更改头部没有效果。

### 条件流
如果响应返回而没有 `yield`，Elysia 将自动把流转换为普通响应。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		if (Math.random() > 0.5) return 'ok'

		yield 1
		yield 2
		yield 3
	})
```

这让我们能够根据条件选择流式传输响应或返回普通响应。

### 自动取消
在响应流完成之前，如果用户取消请求，Elysia 会自动停止生成器函数。

### Eden
[Eden](/eden/overview) 会将流式响应解释为 `AsyncGenerator`，允许我们用 `for await` 循环消费流。

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
```

## Request
Elysia 基于 [Web 标准 Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)，支持 Node、Bun、Deno、Cloudflare Worker、Vercel Edge Function 等多种运行时。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/user-agent', ({ request }) => {
		return request.headers.get('user-agent')
	})
	.listen(3000)
```

允许你在必要时访问底层请求信息。

## Server <Badge type="warning">仅 Bun 支持</Badge>
服务器实例为 Bun 服务器实例，允许访问服务器信息，如端口号或请求 IP。

仅当使用 `listen` 运行 HTTP 服务器时，服务器实例才可用。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/port', ({ server }) => {
		return server?.port
	})
	.listen(3000)
```

### 请求 IP <Badge type="warning">仅 Bun 支持</Badge>
可以通过 `server.requestIP` 方法获取请求 IP。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/ip', ({ server, request }) => {
		return server?.requestIP(request)
	})
	.listen(3000)
```

<!--## Response

Elysia 基于 Web 标准 Request/Response 构建。

当处理程序返回值时，Elysia 会将其映射为 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)。

让你专注于业务逻辑，而不是样板代码。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // 等同于 "new Response('hi')"
    .get('/', () => 'hi')
    .listen(3000)
```

如果你偏好显式使用 Response 类，Elysia 也支持。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => new Response('hi'))
    .listen(3000)
```

::: tip
使用原始值或 `Response` 性能几乎相同（+- 0.1%），可根据喜好选择。
::-->

<!--## Handle

Elysia 基于 Web 标准 Request，可通过 `Elysia.handle` 编程式测试。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle** 处理实际发往服务器的请求。

::: tip
不同于单元测试的模拟，**你可以预期它像真实请求一样行为**。

也适合模拟和单元测试。
::-->

## 扩展上下文 <Badge type="warning">高级概念</Badge>

由于 Elysia 只提供基本信息，我们可根据具体需求自定义 Context，例如：
- 抽取用户 ID 作为变量
- 注入通用仓库
- 添加数据库连接

我们可用以下 API 扩展 Elysia 的上下文：

-   [state](#state) - 一个全局可变状态
-   [decorate](#decorate) - 分配给 **上下文** 的附加属性
-   [derive](#derive) / [resolve](#resolve) - 从现有属性派生新值

### 何时扩展上下文
你应仅在以下场景扩展上下文：
- 属性为全局可变状态，且通过 [state](#state) 多路由共享
- 属性与请求或响应相关，使用 [decorate](#decorate)
- 属性源自现有属性，使用 [derive](#derive) / [resolve](#resolve) 派生

否则建议独立定义值或函数，而非扩展上下文。

::: tip
建议将请求响应相关属性或常用函数分配到上下文，便于关注点分离。
:::

## 状态

**状态** 是整个 Elysia 应用共享的全局可变对象。

调用 **state** 后，值会**首次调用时**添加进 **store** 属性，并可在处理程序中访问。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .get('/a', ({ store: { version } }) => version)
                // ^?
    .get('/b', ({ store }) => store)
    .get('/c', () => 'still ok')
    .listen(3000)
```

<Playground :elysia="demo1" />

### 何时使用
- 需在多个路由共享一个原始可变值
- 需要使用非原始或封装类，且内部状态经常变化的，建议用 [decorate](#decorate)

### 关键要点
- **store** 是整个 Elysia 应用的单一真实可变对象源
- **state** 为 **store** 分配初始值，之后可修改
- 确保先赋值后再在处理程序访问
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    // ❌ TypeError: store 中不存在 counter
    .get('/error', ({ store }) => store.counter)
    .state('counter', 0)
    // ✅ 先赋值后访问
    .get('/', ({ store }) => store.counter)
```

<Playground :elysia="demo2" />

::: tip
切勿在赋值前访问状态值。

Elysia 自动将状态值注册到 store，无需显式类型或额外泛型。
:::

### 引用和值 <Badge type="warning">注意点</Badge>

修改状态建议用**引用**而非赋值原始值。

若将对象属性的原始值定义为新变量，引用丢失，值被视为独立。

例如：

```typescript
const store = {
    counter: 0
}

store.counter++
console.log(store.counter) // ✅ 1
```

使用 **store.counter** 可访问并修改属性。

但如果定义新变量 counter：

```typescript
const store = {
    counter: 0
}

let counter = store.counter

counter++
console.log(store.counter) // ❌ 0
console.log(counter) // ✅ 1
```

重新定义原始值变量导致引用“断开”，导致意料外的行为。

同理适用于全局可变对象 store。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    // ✅ 使用引用，共享值
    .get('/', ({ store }) => store.counter++)
    // ❌ 创建新变量，丢失引用，行为异常
    .get('/error', ({ store: { counter } }) => counter)
```

<Playground :elysia="demo7" />

## 装饰

**decorate** 直接**调用时**分配附加属性到 **Context**。

```typescript twoslash
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    // ✅ 来自上一行定义
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

### 何时使用
- 常量或只读值对象分配给上下文
- 含有内部可变状态的非原始值或类
- 向所有处理程序提供额外函数、单例或不可变属性

### 关键要点
- 与 **state** 不同，装饰的值**不应**被修改（尽管可行）
- 确保先分配后使用

## 派生

###### ⚠️ 派生不保证类型完整，推荐使用 [resolve](#resolve)。

从上下文现有属性中获取值，分配新属性。

派生在请求发生时的**转换生命周期**调用，允许“派生”（从已有属性创建新属性）。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

<Playground :elysia="demo3" />

由于 **derive** 在请求开始时调用，可访问请求属性如 **headers**、**query**、**body**，但不可访问 **store** 和 **decorate**。

### 何时使用
- 从现有属性创建新属性，无需验证或类型检查
- 需访问未验证请求属性，如 **headers**、**query**、**body**

### 关键要点
- 与 **state** 和 **decorate** 不同，派生在请求开始时赋值，而非调用时
- **derive** 在转换阶段调用（验证前），Elysia 无法安全确认请求属性类型，因此视为 **unknown**。若需基于已验证属性赋值，请用 [resolve](#resolve)。

## 解析
类似 [derive](#derive)，但保证类型完整性。

解析允许分配新属性到上下文。

解析在 **beforeHandle** 生命周期或验证后调用，允许安全地**解析**请求属性。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		headers: t.Object({
			bearer: t.String({
				pattern: '^Bearer .+$'
			})
		})
	})
	.resolve(({ headers }) => {
		return {
			bearer: headers.bearer.slice(7)
		}
	})
	.get('/', ({ bearer }) => bearer)
```

### 何时使用
- 从现有属性派生新属性，保证类型完整（类型检查）
- 在验证后访问请求属性，如 **headers**、**query**、**body**

### 关键要点
- **resolve** 在 **beforeHandle** 或验证后调用，Elysia 安全识别请求属性类型，结果为已类型化。

### derive/resolve 报错
derive 和 resolve 基于转换和 beforeHandle 生命周期，允许返回错误。若 derive 返回错误，Elysia 会提前退出并以错误响应。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers, status }) => {
        const auth = headers['authorization']

        if(!auth) return status(400)

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

## 模式 <Badge type="info">高级概念</Badge>

**state** 与 **decorate** 提供类似模式的 API 来赋值给上下文：

-   key-value
-   对象
-   重映射

其中 **derive** 仅能用重映射模式，因为它依赖已有值。

### key-value

使用 **state** 和 **decorate**，通过键值对赋值。

```typescript
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .state('counter', 0)
    .decorate('logger', new Logger())
```

该模式设置单个属性时较易读。

### 对象

以对象形式一次分配多个属性更为包容。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate({
        logger: new Logger(),
        trace: new Trace(),
        telemetry: new Telemetry()
    })
```

对象参数减少重复调用，方便赋值多个属性。

### 重映射

重映射为函数重新分配属性。

允许基于已有值创建新值，如重命名或删除属性。

通过提供函数，返回全新对象重新分配值。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    .state('version', 1)
    .state(({ version, ...store }) => ({
        ...store,
        elysiaVersion: 1
    }))
    // ✅ 通过状态重映射新增属性
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ 未包含 version，无法访问
    .get('/version', ({ store }) => store.version)
```

<Playground :elysia="demo4" />

用状态重映射创建新初始值是好方法，但 Elysia 不支持响应式，重映射只分配初始值。

::: tip
使用重映射，Elysia 会以返回对象作为新属性，任何未包含属性会被移除。
:::

## Affix <Badge type="info">高级概念</Badge>

为提供更流畅体验，一些插件可能含大量属性，逐一重映射较为繁琐。

**Affix** 函数由 **prefix** 和 **suffix** 组成，允许批量重映射实例所有属性。

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup)
    .prefix('decorator', 'setup')
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

<Playground :elysia="demo5" />

这样能轻松批量重映射插件属性，防止名称冲突。

默认情况下，**affix** 会自动处理运行时和类型级代码，使用驼峰命名重映射属性。

某些情况下，也能重映射插件的 `all` 属性：

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup)
    .prefix('all', 'setup') // [!code ++]
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

<!--## TypeScript
Elysia 会根据 store、装饰器、模式等自动推断上下文类型。

建议使用 Elysia 自动推断，而非手动定义。

但 Elysia 也提供工具类型，辅助定义处理程序类型：
- [InferContext](#infercontext)
- [InferHandle](#inferhandler)

### InferContext
InferContext 是一个辅助类型，帮助根据 Elysia 实例推断上下文类型。

```typescript twoslash
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Context = InferContext<typeof setup>

const handler = ({ store }: Context) => store.a
```

### InferHandler
InferHandler 是辅助类型，基于 Elysia 实例、路径及模式定义处理程序类型。

```typescript twoslash
import { Elysia, type InferHandler } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Handler = InferHandler<
	// 所基于的 Elysia 实例
	typeof setup,
	// 路径
	'/path',
	// 模式
	{
		body: string
		response: {
			200: string
		}
	}
>

const handler: Handler = ({ body }) => body

const app = new Elysia()
	.get('/', handler)
```

不同于 `InferContext`，`InferHandler` 需要路径和模式以定义处理程序类型，并且可以安全确保返回类型的类型安全。-->