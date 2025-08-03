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
    .get('/', ({ error }) => error(418, "Kirifuji Nagisa"))

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

处理程序是响应每个路由请求的函数。

接受请求信息并返回响应给客户端。

在其他框架中，处理程序也被称为 **控制器**。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // 函数 `() => 'hello world'` 是一个处理程序
    .get('/', () => 'hello world')
    .listen(3000)
```

处理程序可以是文字值，也可以内联。

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/video', file('kyuukurarin.mp4'))
    .listen(3000)
```

使用内联值总是返回相同的值，这对优化静态资源（如文件）的性能有用。

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

**上下文**只能在路由处理程序中检索。它包括：

-   **path** - 请求的路径名
-   **body** - [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)，表单或文件上传。
-   **query** - [查询字符串](https://en.wikipedia.org/wiki/Query_string)，作为 JavaScript 对象包含搜索查询的附加参数。（查询是从路径名后以 '?' 问号开头的值中提取的）
-   **params** - Elysia 的路径参数解析为 JavaScript 对象
-   **headers** - [HTTP 头部](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)，有关请求的附加信息，如 User-Agent、Content-Type、Cache Hint。
-   **request** - [Web 标准请求](https://developer.mozilla.org/en-US/docs/Web/API/Request)
-   **redirect** - 用于重定向响应的函数
-   **store** - Elysia 实例的全局可变存储
-   **cookie** - 用于与 Cookie 交互的全局可变信号存储（包括取值/设置）
-   **set** - 应用于响应的属性：
    -   **status** - [HTTP 状态](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)，如果未设置，则默认为 200。
    -   **headers** - 响应头部
    -   **redirect** - 作为路径重定向的响应
-   **error** - 返回自定义状态码的函数
-   **server** - Bun 服务器实例

## 设置

**set** 是一个可变属性，通过 `Context.set` 访问。

- **set.status** - 设置自定义状态码
- **set.headers** - 附加自定义头部
- **set.redirect** - 附加重定向

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set, status }) => {
		set.headers = { 'X-Teapot': 'true' }

		return status(418, 'I am a teapot')
	})
	.listen(3000)
```

### 状态
通过以下方法返回自定义状态码：

- **status** 函数（推荐）
- **set.status**（遗留）

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/error', ({ error }) => error(418, 'I am a teapot'))
	.get('/set.status', ({ set }) => {
		set.status = 418
		return 'I am a teapot'
	})
	.listen(3000)
```

### 状态函数
专门的 `status` 函数用于返回带有响应的状态码。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))
    .listen(3000)
```

<Playground :elysia="handler2" />

建议在主处理程序中使用 `status`，因为它更有推断能力：

- 允许 TypeScript 检查返回值是否正确类型为响应模式
- 基于状态码的类型缩小的自动补全
- 使用端到端类型安全的错误处理的类型缩小 ([Eden](/eden/overview))

### set.status
如果没有提供，设置默认状态码。

建议在只需返回特定状态码的插件中使用此方法，同时允许用户返回自定义值。例如，HTTP 201/206 或 403/405 等。

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

与 `status` 函数不同，`set.status` 无法推断返回值类型，因此不能检查返回值是否正确类型为响应模式。

::: tip
HTTP 状态指示响应类型。如果路由处理程序成功执行而没有错误，Elysia 将返回状态码 200。
:::

你还可以使用状态码的常见名称而不是使用数字来设置状态码。

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

### set.headers
允许我们附加或删除呈现为对象的响应头。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return 'a mimir'
    })
    .listen(3000)
```

::: warning
头部的名称应该是小写，以强制保持 HTTP 头部和自动补全的一致性，例如使用 `set-cookie` 而不是 `Set-Cookie`。
:::

### 重定向
将请求重定向到另一个资源。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ redirect }) => {
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
    })
    .get('/custom-status', ({ redirect }) => {
        // 你还可以设置自定义状态以重定向
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
    })
    .listen(3000)
```

在使用重定向时，返回的值不是必需的，将被忽略，因为响应将来自另一个资源。

## 服务器
服务器实例可以通过 `Context.server` 访问，与服务器进行交互。

服务器可能是可空的，因为它可能在不同的环境中运行（测试）。

如果服务器正在运行（分配），则 `server` 将可用（不为 null）。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/port', ({ server }) => {
		return server?.port
	})
	.listen(3000)
```

### 请求 IP
我们可以使用 `server.requestIP` 方法获取请求 IP

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/ip', ({ server, request }) => {
		return server?.requestIP(request)
	})
	.listen(3000)
```

## 响应

Elysia 是建立在 Web 标准请求/响应之上的。

为遵循 Web 标准，从路由处理程序返回的值将被 Elysia 映射到 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)。

让你专注于业务逻辑而不是样板代码。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // 等价于 "new Response('hi')"
    .get('/', () => 'hi')
    .listen(3000)
```

如果你更喜欢显式的 Response 类，Elysia 也会自动处理。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => new Response('hi'))
    .listen(3000)
```

::: tip
使用原始值或 `Response` 性能几乎相同（+ - 0.1%），因此选择你更喜欢的，无论性能如何。
:::

## 表单数据
我们可以通过直接从处理程序返回 `form` 实用程序来返回 `FormData`。

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
或者，您可以通过直接返回 `file` 而不使用 `form` 来返回单个文件。

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
	.get('/', file('nagi.web'))
	.listen(3000)
```

## 处理

由于 Elysia 建立在 Web 标准请求之上，我们可以使用 `Elysia.handle` 以编程方式对其进行测试。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle** 是一个处理发送到服务器的实际请求的函数。

::: tip
与单元测试的模拟不同，**你可以预计它会像实际请求一样表现** 发送到服务器中。

但对于模拟或创建单元测试也很有用。
:::

## 流
通过使用带有 `yield` 关键字的生成器函数返回响应流。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

在这个例子中，我们可以通过使用 `yield` 关键字流式传输响应。

## 服务器发送事件 (SSE)

Elysia 通过提供一个 `sse` 工具函数来支持 [服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)。

```typescript twoslash
import { Elysia, sse } from 'elysia'

new Elysia()
	.get('/sse', function* () {
		yield sse('hello world')
		yield sse({
			event: 'message',
			data: {
				message: 'This is a message',
				timestamp: new Date().toISOString()
			},
		})
	})
```

当一个值被包装在 `sse` 中时，Elysia 会自动将响应头设置为 `text/event-stream` 并将数据格式化为 SSE 事件。

### 设置头部
Elysia 将在第一个块被输出之前延迟返回响应头。

这使我们可以在响应开始流式传输之前设置头部。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		// 这将设置头部
		set.headers['x-name'] = 'Elysia'
		yield 1
		yield 2

		// 这将无效
		set.headers['x-id'] = '1'
		yield 3
	})
```

一旦第一个块被输出，Elysia 将发送头部和第一个块在同一响应中。

在第一个块被输出后设置的头部将无效。

### 条件流
如果响应被返回而没有 `yield`，Elysia 将自动将流转换为普通响应。

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

这使我们能够根据需要有条件地流式传输响应或返回普通响应。

### 中止
在流式传输响应时，请求可能在响应完全流式传输之前被取消是常见的。

Elysia 将自动停止生成器函数，当请求被取消时。

### Eden
[Eden](/eden/overview) 将把流响应解释为 `AsyncGenerator`，允许我们使用 `for await` 循环来消费这个流。

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

## 扩展上下文

由于 Elysia 仅提供基本信息，我们可以定制上下文以满足我们的特定需求，例如：
- 将用户 ID 提取为变量
- 注入一个公共模式库
- 添加数据库连接

我们可以通过使用以下 API 来扩展 Elysia 的上下文以自定义上下文：

-   [state](#state) - 一个全局可变状态
-   [decorate](#decorate) - 分配给 **上下文** 的附加属性
-   [derive](#derive) / [resolve](#resolve) - 从现有属性创建新值

### 何时扩展上下文
你应该仅在以下情况扩展上下文：
- 属性是全局可变状态，并通过 [state](#state) 在多个路由之间共享
- 属性与请求或响应相关联使用 [decorate](#decorate)
- 属性来源于现有属性的派生使用 [derive](#derive) / [resolve](#resolve)

否则，我们建议将值或函数单独定义，而不是扩展上下文。

::: tip
建议将与请求和响应相关的属性，或频繁使用的函数分配到上下文中，以实现关注点分离。
:::

## 状态

**状态** 是一个全局可变对象或状态，在 Elysia 应用程序中共享。

一旦调用 **state**，值将被添加到 **store** 属性中 **一次调用时**，并可以在处理程序中使用。

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
- 当你需要在多个路由之间共享一个原始可变值时
- 如果你想使用一个非原始或 `wrapper` 值或类，且时常改变内部状态时，请使用 [decorate](#decorate) 替代。

### 关键要点
- **store** 是整个 Elysia 应用程序的单一真实来源的可变对象的表现。
- **state** 是一个为 **store** 分配初始值的函数，该值以后可以被修改。
- 请确保在处理程序中使用之前先分配值。
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    // ❌ TypeError: counter doesn't exist in store
    .get('/error', ({ store }) => store.counter)
    .state('counter', 0)
    // ✅ 因为我们在之前分配了 counter，现在可以访问它
    .get('/', ({ store }) => store.counter)
```

<Playground :elysia="demo2" />

::: tip
请注意，在分配之前我们不能使用状态值。

Elysia 会自动将状态值注册到商店中，无需显式类型或额外的 TypeScript 泛型。
:::

## 装饰

**decorate** 在 **调用时** 直接为 **上下文** 分配附加属性。

```typescript twoslash
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    // ✅ 来自前一行的定义
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

### 何时使用
- 将常量或只读值对象分配给 **上下文**
- 可能包含内部可变状态的非原始值或类
- 附加函数、单例或不变属性到所有处理程序。

### 关键要点
- 与 **state** 不同，装饰的值 **不应该** 被修改，尽管这是可能的
- 请确保在处理程序中使用之前先分配值。

## 派生
从 **上下文** 中现有属性中检索值并分配新属性。

派生在请求发生 **于转换生命周期** 时分配，我们可以“派生” <small>从现有属性创建新属性</small>。

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

因为 **derive** 在新请求开始时被调用，**derive** 可以访问请求属性如 **headers**、**query**、**body**，而 **store** 和 **decorate** 则不能。

### 何时使用
- 从现有属性创建新属性，而无需验证或类型检查
- 当你需要在没有验证的情况下访问请求属性，如 **headers**、**query**、**body**

### 关键要点
- 与 **state** 和 **decorate** 不同，**derive** 是在新请求开始时分配的，而不是在调用时分配。
- **derive** 在转换，或者在验证之前被调用，Elysia 无法安全确认请求属性的类型，导致其结果为 **unknown**。如果你想从类型化的请求属性中分配新值，可能想要使用 [resolve](#resolve) 替代。

## 解析
与 [derive](#derive) 相同，resolve 允许我们向上下文分配新属性。

解析在 **beforeHandle** 生命周期或 **验证之后** 被调用，使我们能够安全地 **派生** 请求属性。

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
- 从现有属性创建新属性，并保持类型完整性（经过类型检查）
- 当你需要在验证时访问请求属性，如 **headers**、**query**、**body**

### 关键要点
- **resolve** 在 **beforeHandle**，或验证之后被调用，Elysia 可以安全确认请求属性的类型，结果为 **typed**。

### 来自 resolve/derive 的错误
由于 resolve 和 derive 基于 **transform** 和 **beforeHandle** 生命周期，我们可以从 resolve 和 derive 返回错误。如果 **derive** 返回错误，Elysia 将提前退出并将错误作为响应返回。

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

## 模式

**state**、**decorate** 为向上下文分配属性提供了类似的 API 模式，如下所示：

-   键值
-   对象
-   重映射

而 **derive** 只能与 **重映射** 一起使用，因为它依赖于现有值。

### 键值

我们可以使用 **state** 和 **decorate** 通过键值模式分配值。

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

这种模式在设置单个属性时可读性不错。

### 对象

将多个属性分配给对象在一次赋值中更具包容性。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate({
        logger: new Logger(),
        trace: new Trace(),
        telemetry: new Telemetry()
    })
```

对象提供了一个较少重复的 API，用于设置多个值。

### 重映射

重映射是一个函数重新分配。

允许我们从现有值创建新值，如重命名或删除属性。

通过提供一个函数，并返回一个完全新对象以重新分配值。

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
    // ✅ 从状态重映射创建
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ 从状态重映射排除
    .get('/version', ({ store }) => store.version)
```

<Playground :elysia="demo4" />

使用状态重映射从现有值创建新的初始值是个好主意。

但是，需要注意的是，Elysia 不提供反应性，因为重映射仅分配初始值。

::: tip
使用重映射，Elysia 将把返回的对象视为新属性，移除对象中任何缺失的属性。
:::

## 附加

为了提供更顺畅的体验，一些插件可能具有大量属性值，这可能使逐一重映射感到不知所措。

**Affix** 函数由 **prefix** 和 **suffix** 组成，允许我们重映射实例的所有属性。

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

<Playground :elysia="demo5" />

这样，我们可以轻松批量重映射插件的属性，防止插件的名称冲突。

默认情况下，**affix** 会自动处理运行时、类型级别代码，同时将属性重映射为驼峰命名约定。

在某些情况下，我们还可以重映射插件的 `all` 属性：

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup.prefix('all', 'setup')) // [!code ++]
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

## 引用和数值

要修改状态，建议使用 **引用** 进行修改，而不是使用实际值。

在从 JavaScript 访问属性时，如果我们将对象属性中的原始值定义为新值，则链接丢失，值被视为新单独的值。

例如：

```typescript
const store = {
    counter: 0
}

store.counter++
console.log(store.counter) // ✅ 1
```

我们可以使用 **store.counter** 来访问和修改属性。

但是，如果我们将计数器定义为新值

```typescript
const store = {
    counter: 0
}

let counter = store.counter

counter++
console.log(store.counter) // ❌ 0
console.log(counter) // ✅ 1
```

一旦将原始值重新定义为新变量，引用 **“链接”** 将丢失，导致意外行为。

这也适用于 `store`，因为它是一个全局可变对象。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    // ✅ 使用引用，值共享
    .get('/', ({ store }) => store.counter++)
    // ❌ 在原始值上创建新变量，链接丢失
    .get('/error', ({ store: { counter } }) => counter)
```

<Playground :elysia="demo7" />

## TypeScript
Elysia 根据商店、装饰器、模式等各种因素自动类型上下文。

建议让 Elysia 自动类型上下文，而不是手动定义一个。

但是，Elysia 也提供了一些实用类型以帮助你定义处理程序类型。
- [InferContext](#infercontext)
- [InferHandle](#inferhandler)

### InferContext
Infer context 是一个实用类型，帮助你根据 Elysia 实例定义上下文类型。

```typescript twoslash
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Context = InferContext<typeof setup>

const handler = ({ store }: Context) => store.a
```

### InferHandler
Infer handler 是一个实用类型，帮助你根据 Elysia 实例、路径和模式定义处理程序类型。

```typescript twoslash
import { Elysia, type InferHandler } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Handler = InferHandler<
	// 基于的 Elysia 实例
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

与 `InferContext` 不同，`InferHandler` 需要路径和模式来定义处理程序类型，并可以安全地确保返回值的类型安全。
