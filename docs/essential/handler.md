---
title: Handler
head:
    - - meta
      - property: 'og:title'
        content: Handler - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Handler 是一个响应每个路由请求的函数。接受请求信息并向客户端返回响应。Handler 可通过 Elysia.get / Elysia.post 注册。

    - - meta
      - property: 'og:description'
        content: Handler 是一个响应每个路由请求的函数。接受请求信息并向客户端返回响应。Handler 可通过 Elysia.get / Elysia.post 注册。
---

<script setup>
import Playground from '../../components/nearl/playground.vue'
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
    // ✅ Create from state remap
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ Excluded from state remap
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
    // ✅ Using reference, value is shared
    .get('/', ({ store }) => store.counter++)
    // ❌ Creating a new variable on primitive value, the link is lost
    .get('/error', ({ store: { counter } }) => counter)
</script>

# Handler

处理器是一个函数，它响应每个路由的请求。

接受请求信息并向客户端返回响应。

或者，在其它框架中，处理器也被称为**控制器**。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // the function `() => 'hello world'` is a handler
    .get('/', () => 'hello world')
    .listen(3000)
```

Handler 可能是一个文字值，并且可以内联。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/video', Bun.file('kyuukurarin.mp4'))
    .listen(3000)
```

使用内联值始终返回相同的值，这对于优化文件等静态资源的性能很有用。

这使得 Elysia 能够提前编译响应以优化性能。

::: tip
提供内联值不是缓存。

静态资源值、标头和状态可以使用生命周期动态改变。
:::

## Context

**上下文**包含一个请求信息，这是每个请求唯一的，除了 `store` <small>(全局可变状态)</small>之外，不会被共享。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', (context) => context.path)
            // ^ This is a context
```

**Context** 只能在路由处理程序中检索，由以下部分组成：

-   **path** - 请求的路径名
-   **body** - [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)，表单或文件上传。
-   **query** - [查询字符串](https://en.wikipedia.org/wiki/Query_string)，包括作为 JavaScript 对象的搜索查询附加参数。后的值中提取的，从 '?' 问号开始）
-   **params** - 解析为 JavaScript 对象的 Elysia 路径参数
-   **headers** - [HTTP 头](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)，关于请求的附加信息，如 User-Agent、Content-Type、Cache Hint。
-   **request** - [Web 标准请求](https://developer.mozilla.org/en-US/docs/Web/API/Request)
-   **redirect** - 重定向响应的函数
-   **store** - Elysia 实例的全局可变存储
-   **cookie** - 用于与 Cookie 交互（包括 get/set）的全局可变信号存储
-   **set** - 应用于响应的属性：
    -   **status** - [HTTP 状态](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)，如果没有设置，默认为 200。
    -   **headers** - 响应头
    -   **redirect** - 作为路径重定向的响应
-   **error** - 返回自定义状态码的函数
-   **server**  - Bun 服务器实例

## Set

**set** 是一个可变属性，可通过 `Context.set` 形成一个可访问的响应。

- **set.status** - 设置自定义状态码
- **set.headers** - 附加自定义请求头
- **set.redirect** - 追加重定向
```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set, error }) => {
		set.headers = { 'X-Teapot': 'true' }

		return error(418, 'I am a teapot')
	})
	.listen(3000)
```

### status
我们可以使用以下任一方法返回自定义状态代码：

- **error** 函数 (推荐)
- **set.status** (legacy)

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

### set.error
用于返回状态代码和响应的 `error` 专用函数。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ error }) => error(418, "Kirifuji Nagisa"))
    .listen(3000)
```

<Playground :elysia="handler2" />

建议 `error` 在主处理程序内部使用，因为它具有更好的推理能力：

- 允许 TypeScript 检查返回值是否正确键入响应模式
- 根据状态代码自动完成类型缩小
- 使用端到端类型安全 ([Eden](/overview/eden)) 进行错误处理的类型缩小

### set.status

如果未提供，请设置默认状态代码。

建议在只需要返回特定状态代码的插件中使用此功能，同时允许用户返回自定义值。例如 HTTP 201/206 或 403/405 等。

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

与 `error` 函数不同，`set.status` 不能推断返回值类型，因此它不能检查返回值是否正确类型以响应模式。

::: tip
HTTP 状态指示响应的类型。如果路由处理程序成功执行且没有错误，Elysia 将返回状态代码 200。
:::

你还可以使用状态代码的通用名称而不是使用数字来设置状态代码。

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

允许我们附加或删除表示为对象的响应标头。

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
The names of headers should be lowercase to force case-sensitivity consistency for HTTP headers and auto-completion, eg. use `set-cookie` rather than `Set-Cookie`.
:::

### redirect

将请求重定向到另一个资源。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ redirect }) => {
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
    })
    .get('/custom-status', ({ redirect }) => {
        // You can also set custom status to redirect
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
    })
    .listen(3000)
```

使用重定向时，返回值不是必需的，并且将被忽略。因为响应将来自另一个资源。

## Server
服务器实例可以通过 `Context.server` 访问，以与服务器交互。

服务器可能是可空的，因为它可能在一个不同的环境中运行。(test)

如果服务器正在使用 Bun 运行（分配），`server` 将会可用。(not null)

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/port', ({ server }) => {
		return server?.port
	})
	.listen(3000)
```

### 请求 IP
我们可以通过使用 `server.ip` 方法来获取请求 IP。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/ip', ({ server, request }) => {
		return server?.ip(request)
	})
	.listen(3000)
```

## Response

Elysia 构建在 Web 标准的 Request/Response 之上。

为了符合 Web 标准，从路由处理程序返回的值将被 Elysia 映射到 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 中。

让你专注于业务逻辑而不是样板代码。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // Equivalent to "new Response('hi')"
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
使用原始值或 `Response` 具有几乎相同的性能 (± 0.1%)，因此无论性能如何，请选择你喜欢的值。
:::

## Formdata
我们可以通过直接从处理器返回 `form` 实用程序来返回一个 `FormData`。

```typescript
import { Elysia, form } from 'elysia'

new Elysia()
	.get('/', () => form({
		name: 'Tea Party',
		images: [Bun.file('nagi.web'), Bun.file('mika.webp')]
	}))
	.listen(3000)
```

这种模式在需要返回文件或多部分表单数据时很有用。

### 返回单个文件
或者，你可以直接返回一个文件，而不用 `form` 直接返回 `Bun.file`。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => Bun.file('nagi.web'))
	.listen(3000)
```

## Handle

由于 Elysia 基于 Web 标准请求构建，我们可以使用 `Elysia.handle` 进行程序化测试。

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
与单元测试的模拟不同，**你可以期望它像实际发送到服务器的请求那样表现**。

但这也适用于模拟或创建单元测试。
:::

## Stream
使用带有 `yield` 关键字的生成器函数，返回一个直接流出的响应。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

在这个例子中，我们可以使用 `yield` 关键字来流式传输响应。

### 设置头信息
Elysia 将推迟返回响应头，直到第一个数据块被生成。

这允许我们在响应被流式传输之前设置头信息。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		// This will set headers
		set.headers['x-name'] = 'Elysia'
		yield 1
		yield 2

		// This will do nothing
		set.headers['x-id'] = '1'
		yield 3
	})
```

一旦第一个块被生成，Elysia 将会在同一个响应中发送头部信息和第一个块。

在第一个块生成之后设置头部信息将不起作用。

### 条件流
如果响应没有返回生成，Elysia 将自动将流转换为普通响应。

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

这允许我们条件性地流式传输响应，或者在必要时返回一个普通响应。

### 中止
在流式传输响应时，请求可能在响应完全流式传输之前被取消，这是常见的。

Elysia会在请求被取消时自动停止生成器函数。

### Eden
[Eden](/eden/overview) 将把流响应解释为 `AsyncGenerator`，允许我们使用 `for await` 循环来消耗流。

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

由于 Elysia 只提供基本信息，我们可以根据具体需要自定义上下文，例如：
- 将用户 ID 提取为变量
- 注入一个公共模式存储库
- 添加数据库连接

我们可以通过使用以下 API 来扩展 Elysia 的上下文，以自定义上下文：
- [state](#state) - 一个全局可变状态
- [decorate](#decorate) - 附加属性分配给 **Context**
- [derive](#derive)/[resolve](#resolve) - 从现有属性创建一个新值

### 何时扩展上下文
您应该仅在以下情况下扩展上下文：
- 属性是一个全局可变状态，并且使用 [state](#state) 在多个路由之间共享
- 属性与请求或响应相关联，使用 [decorate](#decorate)
- 属性是从现有属性派生出来的，使用 [derive](#derive)/[resolve](#resolve)

否则，我们建议单独定义一个值或函数，而不是扩展上下文。

::: tip
建议将与请求和响应相关的属性，或者频繁使用的函数分配给 Context，以实现关注点的分离。
:::

## State

**State** 是一个全局的可变对象或是在 Elysia 应用中共享的状态。

一旦调用了 **State**，值将会被添加到**存储**属性中**只在调用时一次**，并且可以在处理程序中使用。

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
- 当你需要在多个路由之间共享一个原始的可变值时
- 如果你想使用一个非原始值或一个包装器值或类，它改变了一个内部状态，请使用 [装饰](#decorate) 代替。

### 关键要点
- **store** 是整个 Elysia 应用的单源真相全局可变对象的表示。
- **state** 是一个函数，用于为 **store** 分配一个初始值，该值稍后可以被修改。
- 在使用它在一个处理程序之前，确保分配一个值。
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    // ❌ TypeError: counter doesn't exist in store
    .get('/error', ({ store }) => store.counter)
    .state('counter', 0)
    // ✅ Because we assigned a counter before, we can now access it
    .get('/', ({ store }) => store.counter)
```

<Playground :elysia="demo2" />

::: tip
注意，我们不能在使用之前赋值状态值。

Elysia 会自动将状态值注册到存储中，无需显式类型或额外的 TypeScript 泛型。
:::

## Decorate

**Decorate** 在调用时直接向 **Context** 添加一个额外的属性。

```typescript twoslash
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    // ✅ defined from the previous line
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

### 何时使用
- 将常量或只读值对象 **Context**
- 可能包含内部可变状态的非常量值或类
- 所有处理程序的额外函数、单例或不可变属性。

### 关键要点
- 与 **state** 不同，装饰的值 **不应该** 被变异，尽管这是可能的
- 在处理程序中使用之前，确保为其分配一个值。

## Derive
从**上下文**中的现有属性检索值，并分配一个新的属性。

在转换生命周期中发生请求时，派生分配允许我们“派生”<small>从现有属性创建新属性</small>。

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

因为 `derive` 在新的请求开始时被赋值一次，`derive` 可以访问请求属性，如 `headers`、`query`、`body`，而 `store`  和 `decorate` 不能访问。

### 何时使用
- 从**上下文**中的现有属性创建新属性，无需验证或类型检查
- 当您需要访问请求属性，如 **headers**、**query**、**body**，而无需验证时

### 关键要点
- 不同于在**调用时**进行赋值的 **state** 和 **decorate**，**derive** 是在新请求开始时进行赋值的。
- **derive** 在转换或验证之前被调用，Elysia 无法安全地确认请求属性的类型，导致结果为 **unknown**。如果你想从类型化的请求属性中赋一个新的值，你可能需要使用 [resolve](#resolve) 代替。

## Resolve
与 [derive](#derive) 相同，resolve 允许我们将新属性分配给上下文。

Resolve 在 **beforeHandle** 生命周期或**验证后**被调用，允许我们安全地**派生**请求属性。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		headers: t.Object({
			bearer: t.String({
				pattern: '/^Bearer .+$/'
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
- 从**上下文**中的现有属性创建一个新属性，并保持类型完整性（类型检查）
- 当你需要访问请求属性，如 **headers**、**query**、**body**，并进行验证时

### 关键要点
- **resolve 在 beforehandle 或验证**发生之前调用。Elysia 可以安全地确认请求属性的类型，并将其结果作为**类型化**。

### resolve/derive 中的错误
由于 resolve 和 derive 基于 **transform** 和 **beforeHandle** 生命周期，我们可以从 resolve 和 derive 返回一个错误。如果从 **derive** 返回错误，Elysia 将提前退出并返回错误作为响应。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers, error }) => {
        const auth = headers['authorization']

        if(!auth) return error(400)

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

## Pattern

**状态**、**装饰**提供了与以下内容类似的 API 模式，用于将属性分配给上下文：

-   key-value
-   object
-   remap

其中 **derive** 只能与 **remap** 一起使用，因为它取决于现有值。

### key-value

我们可以使用**状态**和**装饰**来使用键值模式分配一个值。

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

这个模式非常适合设置单个属性的可读性。

### Object

为单个赋值分配多个属性最好包含在一个对象中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate({
        logger: new Logger(),
        trace: new Trace(),
        telemetry: new Telemetry()
    })
```

对象提供了一种设置多个值时重复性较少的 API。

### Remap

重映射是一种功能上的重新分配。

允许我们从现有值创建一个新值，就像重命名或删除属性一样。

通过提供一个函数，并返回一个完全新的对象来重新分配值。

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
    // ✅ Create from state remap
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ Excluded from state remap
    .get('/version', ({ store }) => store.version)
```

<Playground :elysia="demo4" />

使用状态映射来从现有值创建一个新的初始值是一个好主意。

然而，重要的是要注意，Elysia 不提供这种方法的响应性，因为映射只分配一个初始值。

::: tip
使用重新映射，Elysia 将将返回的对象视为新属性，删除对象中缺少的任何属性。
:::

## Affix

为了提供更流畅的体验，一些插件可能有很多属性值，逐一重新映射可能会让人感到不知所措。

**Affix** 功能由 **prefix** 和 **suffix** 组成，允许我们重新映射一个实例的所有属性。

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

允许我们轻松地批量重映射插件的属性，防止插件名称冲突。

默认情况下，**affix** 将自动处理运行时和类型级别的代码，将属性重映射为驼峰命名约定。

在某些情况下，我们也可以重映射插件的 `all` 属性：

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

## 参考和值

为了改变状态，建议使用**引用**来改变，而不是使用实际的值。

当从 JavaScript 访问属性时，如果我们从一个对象属性定义一个原始值作为新值，那么引用就会丢失，值会被当作新的独立值来处理。

例如：

```typescript
const store = {
    counter: 0
}

store.counter++
console.log(store.counter) // ✅ 1
```

我们可以使用 **store.counter** 来访问和改变这个属性。

然而，如果我们将 counter 定义为一个新的值

```typescript
const store = {
    counter: 0
}

let counter = store.counter

counter++
console.log(store.counter) // ❌ 0
console.log(counter) // ✅ 1
```

一旦一个原始值被重新定义为新变量，引用 **"link"** 将会丢失，导致意外的行为。

这可以应用到 `store`，因为它是一个全局的可变对象。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    // ✅ Using reference, value is shared
    .get('/', ({ store }) => store.counter++)
    // ❌ Creating a new variable on primitive value, the link is lost
    .get('/error', ({ store: { counter } }) => counter)
```

<Playground :elysia="demo7" />

## Macro

宏允许我们为钩子定义一个自定义字段。

**Elysia.macro** 允许我们将自定义的复杂逻辑组合成钩子中可用的简单配置，并且 **guard** 提供了完整的类型安全保护。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro(({ onBeforeHandle }) => ({
        hi(word: string) {
            onBeforeHandle(() => {
                console.log(word)
            })
        }
    }))

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia'
    })
```

访问路径应该将 **"Elysia"** 记录为结果。

### API

**macro** 应该返回一个对象，每个键都会反映到钩子中，钩子中提供的值将作为第一个参数返回。

在前面的例子中，我们创建了一个接受 **string** 的 **hi**。

然后我们将 **hi** 分配给 **"Elysia"**，该值随后被发送回 **hi** 函数，然后函数向 **beforeHandle** 堆栈添加了一个新事件。

这相当于将函数推送到 **beforeHandle**，如下所示：

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('Elysia')
        }
    })
```

当逻辑比接受新函数更复杂时，**macro** 会发光，例如为每个路由创建一个授权层。

```typescript twoslash
// @filename: auth.ts
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro(() => {
        return {
            isAuth(isAuth: boolean) {},
            role(role: 'user' | 'admin') {},
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
    .use(auth)
    .get('/', () => 'hi', {
        isAuth: true,
        role: 'admin'
    })
```

字段可以接受从字符串到函数的任何内容，使我们能够创建一个自定义的生命周期事件。

宏将根据钩子中的定义从上到下按顺序执行，确保应该正确处理堆栈。

### 参数

**Elysia.macro** 参数用于与生命周期事件进行交互，如下所示：

-   onParse
-   onTransform
-   onBeforeHandle
-   onAfterHandle
-   onError
-   onResponse
-   events - 生命周期存储
    -   global: 全局堆栈的生命周期
    -   local: 内联钩子（路由）的生命周期

以 **on** 开头的参数是一个将函数附加到生命周期栈中的函数。

而 **events** 是一个实际存储生命周期事件顺序的栈。你可以直接修改栈，或者使用 Elysia 提供的辅助函数。

### Options

扩展 API 的生命周期函数接受额外的 **options** 以确保对生命周期事件的控制。

-   **options**（可选）- 确定哪个堆栈
-   **function** - 在事件上执行的函数

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro(({ onBeforeHandle }) => {
        return {
            hi(word: string) {
                onBeforeHandle(
                    { insert: 'before' }, // [!code ++]
                    () => {
                        console.log(word)
                    }
                )
            }
        }
    })
```

**Options** 可能接受以下参数：

-   **insert**
    -   函数应该添加在哪里？
    -   可选项: **'before' | 'after'**
    -   默认值: **'after'**
-   **stack**
    -   确定应该添加哪种类型的堆栈
    -   可选项: **'global' | 'local'**
    -   默认值: **'local'**

## TypeScript
Elysia 会自动根据各种因素如存储、装饰器、模式来推断类型上下文。

建议让 Elysia 来自动推断类型上下文，而不是手动定义一个。

然而，Elysia 也提供了一些工具类型来帮助你定义处理程序类型。
- [InferContext](#infercontext)
- [InferHandle](#inferhandler)

### InferContext
推断上下文是一种实用工具类型，帮助您基于 Elysia 实例定义上下文类型。

```typescript twoslash
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Context = InferContext<typeof setup>

const handler = ({ store }: Context) => store.a
```

### InferHandler
Inferhandler 是一种工具类型，帮助你基于 Elysia 实例、路径和模式来定义一个处理器类型。

```typescript twoslash
import { Elysia, type InferHandler } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Handler = InferHandler<
	// Elysia instance to based on
	typeof setup,
	// path
	'/path',
	// schema
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

与 `InferContext` 不同，`InferHandler` 需要一个路径和模式来定义处理程序类型，并且可以安全地确保返回类型的类型安全。
