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
import TutorialBadge from '../components/arona/badge.vue'
import { Elysia } from 'elysia'

const handler1 = new Elysia()
    .get('/', ({ path }) => path)

const handler2 = new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))
</script>

# 处理程序 <TutorialBadge href="/tutorial/getting-started/handler-and-context" />

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

## status <TutorialBadge href="/tutorial/getting-started/status-and-headers" />
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

## 扩展上下文 <Badge type="warning">高级概念</Badge>

Elysia 默认提供一个最小的上下文，允许我们使用状态、装饰、派生和解析来扩展上下文以满足我们的特定需求。

有关如何扩展上下文的更多信息，请参见 [扩展上下文](/patterns/extends-context)。
