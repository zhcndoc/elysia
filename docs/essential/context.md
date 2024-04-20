---
title: Context - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Context - ElysiaJS

    - - meta
      - name: 'description'
        content: Context 是关于客户端每次请求的信息，对每个请求都是唯一的，具有全局可变存储。上下文可通过状态、装饰和派生进行定制。

    - - meta
      - property: 'og:description'
        content: Context 是关于客户端每次请求的信息，对每个请求都是唯一的，具有全局可变存储。上下文可通过状态、装饰和派生进行定制。
---


<script setup>
import Playground from '../../components/nearl/playground.vue'
import { Elysia } from 'elysia'

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

# Context

Context 是传递给[路由处理程序](/handler)的请求信息。

每个请求的上下文都是唯一的，除了存储是全局可变的 `store` 之外，上下文是不可共享的。

Elysia 上下文包括：

-   **path** - 请求的路径名
-   **body** - [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)、表单或文件上传。
-   **query** - [查询字符串](https://en.wikipedia.org/wiki/Query_string)，包括作为 JavaScript 对象的搜索查询附加参数。（查询字符串是从 `?` 开始的路径名后的值中提取的）
-   **params** - Elysia 的路径参数解析为 JavaScript 对象
-   **headers** - [HTTP 标头](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)，有关请求的附加信息，如用户代理、内容类型、缓存提示。
-   **request** - [Web 标准请求](https://developer.mozilla.org/en-US/docs/Web/API/Request)
-   **store** - Elysia 实例的全局可变存储
-   **cookie** - 用于与 Cookie 交互的全局可变信号存储（包括 get/set）
-   **set** - 应用于响应的属性：
    -   **status** - [HTTP 状态](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)，如果未设置，则默认为 200。
    -   **headers** - 响应标头
    -   **redirect** - 响应作为重定向到的路径
-   **error** - 返回自定义状态代码的函数

## 扩展 Context

由于 Elysia 只提供必要的信息，我们可以根据我们的特定需求定制 Context，例如：

- 提取用户 ID 作为变量
- 注入通用模式存储库
- 添加数据库连接

---

我们可以通过使用以下 API 来自定义 Context 来扩展 Elysia 的上下文：

-   **state** - 在 **Context.store** 中创建一个全局可变状态
-   **decorate** - 添加分配给 **Context** 的附加功能或属性
-   **derive** / **resolve** - 基于现有属性的附加属性，唯一分配给每个请求。

::: tip
建议将与请求和响应相关的属性或常用功能分配给 Context，以实现关注点分离。
:::

## Store

**State** 是在 Elysia 应用程序中共享的全局可变对象或状态。

如果我们熟悉 React、Vue 或 Svelte 等前端库，就会有一个全局状态管理的概念，它也在 Elysia 中通过状态和存储部分实现。

- **store** 是整个 Elysia 应用程序的单一真实来源全局可变对象的表示。

- **state** 是一个为 **store** 分配初始值的函数，该值稍后可能会发生变化。

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

一旦 **state** 被调用，值将被添加到 **store** 属性中，并且可以在 Handler 中使用。

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
请注意，我们不能在分配之前使用状态值。

Elysia 会自动将状态值注册到存储中，无需显式类型或额外的 TypeScript 泛型。
:::

## Decorate

**decorate** 直接为 **Context** 分配一个附加属性，不带前缀。

不同之处在于该值应该是只读的并且以后不能重新分配。

这是向所有处理程序分配附加函数、单例或不可变属性的理想方法。

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

## Derive

与 `decorate` 一样，我们可以直接为 **Context** 分配额外的属性。

与在服务器启动前赋值不同，**derive** 会在请求发生时赋值。

这样我们就可以“派生”（根据现有属性创建新属性）。

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

由于 **derive** 是在新请求开始后分配的，因此 **derive** 可以访问请求属性，如 **headers**、**query** 和 **body**，而 **store** 和 **decorate** 则不能。

不同于 **state** 和 **decorate**。由 **derive** 分配的属性是唯一的，不会与其他请求共享。

::: tip
derive 与 resolve 类似，但存储在不同的队列中。

**derive** 存储在 [transform](/life-cycle/transform) 队列中，**resolve** 存储在 [beforeHandle](/life-cycle/before-handle) 队列中。
:::

## Pattern

**state**、**decorate** 提供了类似的 API 模式，用于将属性分配给 Context，如下所示：

-   key-value
-   object
-   remap

其中，**derive** 只能与 **remap** 一起使用，因为它取决于现有值。

### key-value

我们可以使用 **state** 和 **decorate** 使用键值模式来分配值。

```typescript twoslash
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

此模式非常适合设置单个属性的可读性。

### Object

分配多个属性最好包含在单个分配的对象中。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate({
        logger: new Logger(),
        trace: new Trace(),
        telemetry: new Telemetry()
    })
```

该对象提供了一个较少重复的 API 用于设置多个值。

### Remap

Remap 是函数的重新映射。

允许我们从现有值创建新值，例如重命名或删除属性。

通过提供一个函数，并返回一个全新的对象来重新分配值。

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

最好使用状态重映射从现有值创建新的初始值。

然而，值得注意的是，Elysia 不提供这种方法的反应性，因为重新映射仅分配一个初始值。

::: tip
使用 Remap，Elysia 会将返回的对象视为新属性，删除对象中缺少的任何属性。
:::

## Affix

为了提供更流畅的体验，某些插件可能具有大量属性值，这对于逐一重新映射可能会造成巨大的负担。

**Affix** 函数由 **prefix** 和 **suffix** 组成，允许我们重新映射实例的所有属性。

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

允许我们轻松地批量重新映射插件的属性，防止插件的名称冲突。

默认情况下，**affix** 将自动处理运行时、类型级代码，将属性重新映射为驼峰式命名约定。

在某些情况下，我们还可以重新映射 `all` 插件的属性：

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

## 引用值

要改变状态，建议使用**引用**来改变，而不是使用实际值。

当从 JavaScript 访问属性时，如果我们将对象属性的原始值定义为新值，则引用将丢失，该值将被视为新的单独值。

例如：

```typescript twoslash
const store = {
    counter: 0
}

store.counter++
console.log(store.counter) // ✅ 1
```

我们可以使用 **store.counter** 来访问和改变该属性。

但是，如果我们将计数器定义为新值

```typescript twoslash
const store = {
    counter: 0
}

let counter = store.counter

counter++
console.log(store.counter) // ❌ 0
console.log(counter) // ✅ 1
```

一旦原始值被重新定义为新变量，引用 **“链接”** 就会丢失，从而导致意外行为。

这可以应用于 `store`，因为它是一个全局可变对象。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    // ✅ Using reference, value is shared
    .get('/', ({ store }) => store.counter++)
    // ❌ Creating a new variable on primitive value, the link is lost
    .get('/error', ({ store: { counter } }) => counter)
```

<Playground :elysia="demo7" />
