---
title: 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 插件是一种将逻辑解耦成更小部分的方式，定义了在服务器上可重用的组件。可以使用 `use` 注册插件，注册插件将组合插件和当前实例之间的类型，以及钩子的作用域，模式也会合并。

    - - meta
      - property: 'og:description'
        content: 插件是一种将逻辑解耦成更小部分的方式，定义了在服务器上可重用的组件。可以使用 `use` 注册插件，注册插件将组合插件和当前实例之间的类型，以及钩子的作用域，模式也会合并。
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

const demo1 = new Elysia()
    .get('/', ({ plugin }) => plugin)
    .use(plugin)

const plugin2 = (app) => {
    if ('counter' in app.store) return app

    return app
        .state('counter', 0)
        .get('/plugin', () => 'Hi')
}

const demo2 = new Elysia()
    .use(plugin2)
    .get('/counter', ({ store: { counter } }) => counter)

const version = (version = 1) => new Elysia()
        .get('/version', version)

const demo3 = new Elysia()
    .use(version(1))

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

const plugin3 = (config) => new Elysia({
        name: 'my-plugin',
        seed: config,
    })
    .get(`${config.prefix}/hi`, () => 'Hi')

const demo4 = new Elysia()
    .use(
        plugin3({
            prefix: '/v2'
        })
    )

// child.ts
const child = new Elysia()
    .use(setup)
    .get('/', ({ a }) => a)

// index.ts
const demo5 = new Elysia()
    .use(child)

const _demo1 = new Elysia()
    .post('/student', 'Rikuhachima Aru')

const _plugin2 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const _demo2 = new Elysia()
    .use(plugin2)
    .get('/parent', () => 'parent')

const _mock2 = {
    '/child': {
        'GET': 'hi'
    },
    '/parent': {
        'GET': 'hi'
    }
}

const _plugin3 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'overwrite'
    })

const _demo3 = new Elysia()
    .guard(app => app
        .use(plugin3)
        .get('/inner', () => 'inner')
    )
    .get('/outer', () => 'outer')

const _mock3 = {
    '/inner': {
        'GET': 'overwrite'
    },
    '/outer': {
        'GET': 'outer'
    }
}
</script>

# 插件

插件是一种将功能解耦成更小部分的模式。为我们的 Web 服务器创建可重用的组件。

定义一个插件就是定义一个单独的实例。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

const app = new Elysia()
    .use(plugin)
    .get('/', ({ plugin }) => plugin)
               // ^?
    .listen(3000)
```

我们可以通过将实例传递给 **Elysia.use** 来使用插件。

<Playground :elysia="demo1" />

插件将继承插件实例的所有属性，包括 **state**, **decorate**, **derive**, **route**, **lifecycle** 等。

Elysia 还将自动处理类型推断，因此你可以想象就像你在主实例上调用所有其他实例。

::: tip
请注意插件不包含 **.listen**，因为 **.listen** 将为使用分配一个端口，而我们只希望主实例分配端口。
:::

## 插件

每一个 Elysia 实例都可以成为一个插件。

我们可以将逻辑解耦成一个新的单独的 Elysia 实例并将其用作插件。

首先，我们在不同的文件中定义一个实例:
```typescript twoslash
// plugin.ts
import { Elysia } from 'elysia'

export const plugin = new Elysia()
    .get('/plugin', () => 'hi')
```

然后我们将实例导入到主文件中：
```typescript
import { Elysia } from 'elysia'
import { plugin } from './plugin'

const app = new Elysia()
    .use(plugin)
    .listen(3000)
```

### 配置

为了使插件更加有用，建议通过配置允许自定义。

你可以创建一个接受参数的函数，这些参数可以改变插件的行为，使其更具可重用性。

```typescript
import { Elysia } from 'elysia'

const version = (version = 1) => new Elysia()
        .get('/version', version)

const app = new Elysia()
    .use(version(1))
    .listen(3000)
```

### 功能回调

建议定义一个新的插件实例，而不是使用功能回调。

功能回调允许我们访问主实例的现有属性。例如，检查特定的路由或存储是否存在。

要定义功能回调，创建一个接受 Elysia 作为参数的函数。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = (app: Elysia) => app
    .state('counter', 0)
    .get('/plugin', () => 'Hi')

const app = new Elysia()
    .use(plugin)
    .get('/counter', ({ store: { counter } }) => counter)
    .listen(3000)
```

<Playground :elysia="demo2" />

一旦传递给 `Elysia.use`，函数式回调的行为类似于普通插件，只不过其属性会直接赋值给主实例。

::: tip
你不必担心功能回调和创建实例之间的性能差异。

Elysia 可以在几毫秒内创建 10k 个实例，新 Elysia 实例的类型推断性能甚至优于功能回调。
:::

## 插件去重

默认情况下，Elysia 会注册任何插件并处理类型定义。

某些插件可能会多次使用以提供类型推断，导致初始值或路由的重复设置。

Elysia 通过使用 **name** 和 **optional seeds** 区分实例来避免这一点，从而帮助 Elysia 识别实例重复：

```typescript
import { Elysia } from 'elysia'

const plugin = <T extends string>(config: { prefix: T }) =>
    new Elysia({
        name: 'my-plugin', // [!code ++]
        seed: config, // [!code ++]
    })
    .get(`${config.prefix}/hi`, () => 'Hi')

const app = new Elysia()
    .use(
        plugin({
            prefix: '/v2'
        })
    )
    .listen(3000)
```

<Playground :elysia="demo4" />

Elysia 将使用 **name** 和 **seed** 创建校验和来识别实例是否已注册，如果是，则 Elysia 将跳过插件的注册。

如果未提供种子，Elysia 只会使用 **name** 来区分实例。这意味着即使你多次注册插件，它也只会注册一次。

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

这允许 Elysia 通过重用已注册的插件而不是一次又一次地处理插件来提高性能。

::: tip
种子可以是任何东西，从字符串到复杂对象或类。

如果提供的值是类，Elysia 将尝试使用 `.toString` 方法生成校验和。
:::

### 服务定位器

当您将带有状态/装饰器的插件应用于一个实例时，该实例将获得类型安全性。

但如果您不将插件应用于另一个实例，它将无法推断类型。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const child = new Elysia()
    // ❌ 'a' 缺失
    .get('/', ({ a }) => a)

const main = new Elysia()
    .decorate('a', 'a')
    .use(child)
```

Elysia 引入了 **服务定位器** 模式来抵消这一点。

Elysia 将查找插件的校验和并获取值或注册一个新的。根据插件推断类型。

因此，我们必须提供插件引用，以便 Elysia 找到服务以添加类型安全。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// Without 'setup', type will be missing
const error = new Elysia()
    .get('/', ({ a }) => a)

const main = new Elysia()
	// With `setup`, type will be inferred
    .use(setup) // [!code ++]
    .get('/', ({ a }) => a)
    //           ^?
```

<Playground :elysia="demo5" />

## 防护

防护允许我们将钩子和模式应用于多个路由一次性。

```typescript twoslash
const signUp = <T>(a: T) => a
const signIn = <T>(a: T) => a
const isUserExists = <T>(a: T) => a
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        { // [!code ++]
            body: t.Object({ // [!code ++]
                username: t.String(), // [!code ++]
                password: t.String() // [!code ++]
            }) // [!code ++]
        }, // [!code ++]
        (app) => // [!code ++]
            app
                .post('/sign-up', ({ body }) => signUp(body))
                .post('/sign-in', ({ body }) => signIn(body), {
                                                     // ^?
                    beforeHandle: isUserExists
                })
    )
    .get('/', 'hi')
    .listen(3000)
```

这段代码为 `/sign-in` 和 `/sign-up` 应用 `body` 的验证，而不是逐个内联模式，但不适用于 `/`。

我们可以将路由验证总结如下：
| 路径 | 有验证 |
| ------- | ------------- |
| /sign-up | ✅ |
| /sign-in | ✅ |
| / | ❌ |

防护接受与内联钩子相同的参数，唯一的区别在于你可以将钩子应用于作用域中的多个路由。

这意味着上面的代码被翻译为：

```typescript twoslash
const signUp = <T>(a: T) => a
const signIn = <T>(a: T) => a
const isUserExists = (a: any) => a
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/sign-up', ({ body }) => signUp(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
        beforeHandle: isUserExists,
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .get('/', () => 'hi')
    .listen(3000)
```

### 分组防护

我们可以通过提供 3 个参数给分组来使用前缀。

1. 前缀 - 路由前缀
2. 防护 - 模式
3. 范围 - Elysia 应用回调

与防护应用相同的 API 应用到第二个参数，而不是将分组和防护嵌套在一起。

考虑以下示例：
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group('/v1', (app) =>
        app.guard(
            {
                body: t.Literal('Rikuhachima Aru')
            },
            (app) => app.post('/student', ({ body }) => body)
                                            // ^?
        )
    )
    .listen(3000)
```


从嵌套的分组防护中，我们可以通过在 `group` 的第二个参数中提供防护范围将组和防护合并在一起：
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/v1',
        (app) => app.guard( // [!code --]
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', ({ body }) => body)
        ) // [!code --]
    )
    .listen(3000)
```

这将导致以下语法：
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/v1',
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', ({ body }) => body)
                                       // ^?
    )
    .listen(3000)
```

<Playground :elysia="_demo1" />

## 范围

默认情况下，钩子和模式将仅适用于 **当前实例**。

Elysia 具有封装范围，以防止意外的副作用。

范围类型用于指定钩子的作用域，是否应该被封装或全局。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive(() => {
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)

const main = new Elysia()
    .use(plugin)
    // ⚠️ Hi 缺失
    .get('/parent', ({ hi }) => hi)
```

从上面的代码，我们可以看到 `hi` 在父实例中缺失，因为默认情况下，如果未指定，作用域是局部的，并且不会应用于父级。

要将钩子应用于父实例，我们可以使用 `as` 来指定钩子的作用域。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive({ as: 'scoped' }, () => { // [!code ++]
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)

const main = new Elysia()
    .use(plugin)
    // ✅ Hi 现在可用
    .get('/parent', ({ hi }) => hi)
```

### 范围等级
Elysia 有 3 种范围类型，如下所示：
范围类型如下：
- **local** (默认) - 仅适用于当前实例及其后代
- **scoped** - 适用于父级、当前实例及其后代
- **global** - 适用于所有应用插件的实例（所有父级、当前及后代）

我们通过使用以下示例回顾每种范围类型的作用：
```typescript
import { Elysia } from 'elysia'

// ? 基于下表提供的值
const type = 'local'

const child = new Elysia()
    .get('/child', 'hi')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => { // [!code ++]
        console.log('hi')
    })
    .use(child)
    .get('/current', 'hi')

const parent = new Elysia()
    .use(current)
    .get('/parent', 'hi')

const main = new Elysia()
    .use(parent)
    .get('/main', 'hi')
```

通过更改 `type` 值，结果应如下所示：

| 类型       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   |
| 'scoped'    | ✅    | ✅       | ✅     | ❌   |
| 'global'   | ✅    | ✅       | ✅     | ✅   |

### 范围提升
要将钩子应用于父级，可以使用以下一种：
1. `inline as` 仅适用于单个钩子
2. `guard as` 适用于防护中的所有钩子
3. `instance as` 适用于实例中的所有钩子

### 1. 内联提升
每个事件监听器将接受 `as` 参数来指定钩子的作用域。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive({ as: 'scoped' }, () => { // [!code ++]
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)

const main = new Elysia()
    .use(plugin)
    // ✅ Hi 现在可用
    .get('/parent', ({ hi }) => hi)
```

但是，这种方法仅适用于单个钩子，并且可能不适合多个钩子。

### 2. 防护提升
每个事件监听器将接受 `as` 参数来指定钩子的作用域。

```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		response: t.String(),
		beforeHandle() {
			console.log('ok')
		}
	})
    .get('/child', 'ok')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'hello')
```

防护允许我们将 `schema` 和 `hook` 应用于多个路由一次性，并且可以指定作用域。

然而，它不支持 `derive` 和 `resolve` 方法。

### 3. 实例提升
`as` 将读取当前实例的所有钩子和模式范围，并进行修改。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive(() => {
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)
    .as('scoped') // [!code ++]

const main = new Elysia()
    .use(plugin)
    // ✅ Hi 现在可用
    .get('/parent', ({ hi }) => hi)
```

有时我们希望将插件重新应用于父实例，但是由于 `scoped` 机制的限制，它限于 1 个父级。

要将其应用于父实例，我们需要 **提升作用域到父实例"**，而 `as` 是实现这一点的完美方法。

这意味着如果你有 `local` 范围，想要将其应用于父实例，你可以使用 `as('scoped')` 来提升它。
```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('scoped') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)
	.as('scoped') // [!code ++]

const parent = new Elysia()
	.use(instance)
	// 这现在会报错，因为 `scoped` 被提升到父级
	.get('/ok', () => 3)
```

### 后代

默认情况下，插件将仅 **应用钩子到自身及其后代**。

如果钩子在插件中注册，继承该插件的实例将 **不会** 继承钩子和模式。

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('hi')
    })
    .get('/child', 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'not log hi')
```

要全局应用钩子，我们需要将钩子指定为全局。
```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        return 'hi'
    })
    .get('/child', 'child')
    .as('scoped')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'parent')
```

<Playground :elysia="_demo2" :mock="_mock2" />

## 延迟加载
模块默认是立即加载的。

Elysia 在启动服务器之前加载所有模块，然后注册和索引所有模块。这确保所有模块在开始接受请求之前都已加载。

虽然对于大多数应用程序来说，这很好，但对于运行在无服务器环境或边缘函数的服务器，它可能成为瓶颈，因为启动时间至关重要。

延迟加载可以通过在服务器启动后逐步索引模块来帮助减少启动时间。

对于某些模块很重，并且在启动时导入时间至关重要，使用延迟加载模块是一个不错的选择。

默认情况下，任何异步插件都不会被等待，视为延迟模块，导入语句被视为延迟加载模块。

这两个模块将在服务器启动后注册。

### 延迟模块
延迟模块是一个异步插件，可以在服务器启动后注册。

```typescript
// plugin.ts
import { Elysia, file } from 'elysia'
import { loadAllFiles } from './files'

export const loadStatic = async (app: Elysia) => {
    const files = await loadAllFiles()

    files.forEach((asset) => app
        .get(asset, file(file))
    )

    return app
}
```

在主文件中：
```typescript
import { Elysia } from 'elysia'
import { loadStatic } from './plugin'

const app = new Elysia()
    .use(loadStatic)
```

Elysia 静态插件也是一个延迟模块，因为它以异步方式加载文件并注册文件路径。

### 延迟加载模块
与异步插件相同，延迟加载模块将在服务器启动后注册。

延迟加载模块可以是同步或异步函数，只要该模块与 `import` 一起使用，该模块将延迟加载。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .use(import('./plugin'))
```

在模块计算量较大和/或阻塞时，建议使用模块延迟加载。

要确保在服务器启动之前注册模块，我们可以对延迟模块使用 `await`。

### 测试
在测试环境中，我们可以使用 `await app.modules` 等待延迟加载和懒加载模块。

```typescript
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('模块', () => {
    it('内联异步', async () => {
        const app = new Elysia()
              .use(async (app) =>
                  app.get('/async', () => 'async')
              )

        await app.modules

        const res = await app
            .handle(new Request('http://localhost/async'))
            .then((r) => r.text())

        expect(res).toBe('async')
    })
})
```
