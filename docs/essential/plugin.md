---
title: 插件
head:
    - - meta
      - property: 'og:title'
        content: 插件 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 插件是将逻辑解耦为更小的部分的一种方式，定义服务器上可重复使用的组件。我们可以使用 `use` 来注册插件，注册插件将会合并插件和当前实例之间的类型，还有钩子的范围和架构也会合并。

    - - meta
      - property: 'og:description'
        content: 插件是将逻辑解耦为更小的部分的一种方式，定义服务器上可重复使用的组件。我们可以使用 `use` 来注册插件，注册插件将会合并插件和当前实例之间的类型，还有钩子的范围和架构也会合并。
---

<script setup>
import Playground from '../../components/nearl/playground.vue'
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

插件是一种将功能解耦为更小部分的模式，为我们的 Web 服务器创建可重复使用的组件。

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

我们可以通过将实例作为参数传递给 **Elysia.use** 来使用插件。

<Playground :elysia="demo1" />

插件将继承插件实例的所有属性，包括 **state**、**decorate**、**derive**、**route**、**lifecycle** 等等。

Elysia 也会自动处理类型推断，所以你可以将其想象成在主要实例上调用所有其他实例。

::: tip
请注意插件不包含 **.listen**，因为 **.listen** 会为使用分配一个端口，我们只想主要实例分配端口。
:::

## 插件

每个 Elysia 实例都可以是一个插件。

我们可以将逻辑解耦为一个新的单独的 Elysia 实例，并将其用作插件。

首先，我们在另一个文件中定义一个实例：
```typescript twoslash
// plugin.ts
import { Elysia } from 'elysia'

export const plugin = new Elysia()
    .get('/plugin', () => 'hi')
```

然后我们将该实例导入到主要文件中：
```typescript
import { Elysia } from 'elysia'
import { plugin } from './plugin'

const app = new Elysia()
    .use(plugin)
    .listen(3000)
```

### 配置

为了使插件更加有用，推荐通过配置允许自定义。

您可以创建一个接受可能会改变插件行为的参数的函数，以使其更具可重用性。

```typescript
import { Elysia } from 'elysia'

const version = (version = 1) => new Elysia()
        .get('/version', version)

const app = new Elysia()
    .use(version(1))
    .listen(3000)
```

### 函数回调

建议使用一个新的插件实例来定义一个函数回调，而不是使用一个函数回调。

函数回调允许我们访问主要实例的现有属性。例如，检查特定路由或存储是否存在。

要定义一个函数回调，请创建一个接受 Elysia 作为参数的函数。

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

一旦传递给 `Elysia.use`，函数回调就像一个普通的插件一样运行，只是该属性直接被分配给

::: tip
您不需要担心函数回调和创建实例之间的性能差异。

Elysia 可以在几毫秒内创建 10k 个实例，新的 Elysia 实例甚至比函数回调有更好的类型推断性能。
:::

## 插件去重

默认情况下，Elysia 将注册任何插件并处理类型定义。

某些插件可能被多次使用以提供类型推断，导致初始值或路由设置重复。

Elysia 通过使用 **name** 和 **可选的 seed** 来区分实例，以帮助 Elysia 识别实例重复性:

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

Elysia 将使用 **name** 和 **seed** 创建一个校验和来识别实例是否先前已注册，如果是，则 Elysia 将跳过插件的注册。

如果没有提供 seed，Elysia 将只使用 **name** 来区分实例。这意味着即使您多次注册了插件，该插件也只注册一次。

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

这使得 Elysia 可以通过重复使用已注册的插件而不是一遍又一遍地处理插件来提高性能。

::: tip
Seed 可以是任何内容，从字符串到复杂对象或类不等。

如果提供的值是一个类，Elysia 将尝试使用 `.toString` 方法生成校验和。
:::

### 服务定位器
当将多个状态和修饰器插件应用于一个实例时，该实例将获得类型安全性。

但是，您可能会注意到，当您尝试在没有修饰器的另一个实例中使用装饰值时，类型会丢失。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const child = new Elysia()
    // ❌ 'a' is missing
    .get('/', ({ a }) => a)

const main = new Elysia()
    .decorate('a', 'a')
    .use(child)
```

这是 TypeScript 的限制；Elysia 只能引用当前实例。

Elysia 引入了 **服务定位器** 模式来解决这个问题。

简单来说，Elysia 会查找插件的校验和并获取该值，或注册一个新值。从插件推断类型。

简单来说，我们需要为 Elysia 提供插件引用，以便找到该服务。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

// setup.ts
const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// index.ts
const error = new Elysia()
    .get('/', ({ a }) => a)

const main = new Elysia()
    .use(setup)
    .get('/', ({ a }) => a)
    //           ^?
```

<Playground :elysia="demo5" />

## 守卫

守卫允许我们一次将钩子和架构应用于多个路由。

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

此代码将对 `/sign-in` 和 `/sign-up` 的 `body` 应用验证，而不是逐个内联模式应用验证，但不适用于 `/`。

我们可以总结路由验证如下：
| 路径 | 具有验证 |
| ---------- | ------------- |
| /sign-up   | ✅             |
| /sign-in   | ✅             |
| /          | ❌             |

守卫接受与内联钩子相同的参数，唯一的区别是你可以在作用域中将钩子应用于多个路由。

这意味着上面的代码可以转换为：

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

### 分组守卫

我们可以通过向分组提供 3 个参数来使用带前缀的分组。

1. 前缀 - 路由前缀
2. 守卫 - 架构
3. 作用域 - Elysia 应用回调

与应用于第二个参数的守卫相同的 API，而不是将分组和守卫嵌套在一起。

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


从嵌套的分组守卫中，我们可以通过将守卫作用域提供给分组的第二个参数来合并组和守卫：
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

## 作用域

默认情况下，钩子和架构将仅应用于**当前实例**。

Elysia 有一个封装作用域，以防止意外副作用发生。

作用域类型用于指定钩子的作用域是否应该是封装还是全局。

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
    // ⚠️ Hi is missing
    .get('/parent', ({ hi }) => hi)
```

从以上代码中，我们可以看到父实例缺少 `hi`，因为范围默认为局部，如果未指定，则不会应用于父实例。

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
    // ✅ Hi is now available
    .get('/parent', ({ hi }) => hi)
```

### 作用域级别
Elysia拥有以下三个级别的范围：
范围类型如下：
- **local**（默认）- 仅应用于当前实例和后代
- **scoped** - 应用于父级、当前实例和后代
- **global** - 应用于所有应用插件的实例（父级、当前和后代）

让我们通过使用以下示例来回顾每个作用域类型的功能：
```typescript
import { Elysia } from 'elysia'

// ? Value base on table value provided below
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

通过更改 `type` 值，结果应如下：

| type       | 子实例 | 当前实例 | 父实例 | 主实例 |
| ---------- | ------ | -------- | ------ | ------ |
| 'local'    | ✅      | ✅        | ❌      | ❌      |
| 'scoped'   | ✅      | ✅        | ✅      | ❌      |
| 'global'   | ✅      | ✅        | ✅      | ✅      |

### 作用域转换
要将钩子应用于父实例，可以使用以下方法之一：
1. `inline as` 仅适用于单个钩子
2. `guard as` 适用于作用域中的所有钩子
3. `instance as` 适用于实例中的所有钩子

### 1. Inline as
每个事件监听器都接受 `as` 参数来指定钩子的作用域。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive({ as: 'scoped' }, () => { // [!code ++]
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)

const main = new Elysia()
    .use(plugin)
    // ✅ Hi is now available
    .get('/parent', ({ hi }) => hi)
```

但是，此方法仅适用于单个钩子，并且可能不适用于多个钩子。

### 2. Guard as
每个事件监听器都接受 `as` 参数来指定钩子的作用域。

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

守卫允许我们一次将 `schema` 和 `hook` 应用于多个路由，同时指定作用域。

但是，它不支持 `derive` 和 `resolve` 方法。

### 3. Instance as
`as` 将读取当前实例的所有钩子和架构作用域，并进行修改。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive(() => { // [!code ++]
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)
    .as('plugin')

const main = new Elysia()
    .use(plugin)
    // ✅ Hi is now available
    .get('/parent', ({ hi }) => hi)
```

有时我们希望同时将插件应用于父实例，但由于 `scoped` 机制的限制，它仅限于一个父级。

为了将插件应用于父实例，我们需要将作用域提升到父实例，并且 `as` 是执行此操作的完美方法。

这意味着如果你的作用域为 `local`，并且想将其应用于父实例，您可以使用 `as('plugin')` 来提升它。
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
	.as('plugin') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)
	.as('plugin') // [!code ++]

const parent = new Elysia()
	.use(instance)
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

### 后代

默认情况下，插件将仅**应用钩子于自己和后代**。

如果钩子在插件中注册，那么继承插件的实例将**不会**继承钩子和架构。

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

要将钩子应用于全局，需要将钩子指定为全局。
```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        return 'hi'
    })
    .get('/child', 'child')
    .as('plugin')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'parent')
```

<Playground :elysia="_demo2" :mock="_mock2" />

## 懒加载
默认情况下，模块是急切加载的。

Elysia 会先加载所有模块，然后注册并索引它们，最后再启动服务器。这样做确保了所有模块在服务器开始接受请求之前都已经加载完成。

虽然这对大多数应用程序来说是可以的，但对于运行在无服务器环境或边缘函数中的服务器来说，启动时间可能变得非常重要，这时懒加载可能成为瓶颈。

懒加载可以帮助减少启动时间，通过在服务器启动后逐步索引模块来实现。

当一些模块较大且导入时的启动时间至关重要时，懒加载模块是一个不错的选择。

默认情况下，任何不包含 await 的异步插件都被视为延迟模块，而 import 语句被视为懒加载模块。

这两种方式都会在服务器启动后注册。

### 延迟模块
延迟模块是指可以在服务器启动后注册的异步插件。

```typescript
// plugin.ts
import { Elysia } from 'elysia'
import { loadAllFiles } from './files'

export const loadStatic = async (app: Elysia) => {
    const files = await loadAllFiles()

    files.forEach((file) => app
        .get(file, () => Bun.file(file))
    )

    return app
}
```

主文件中的代码如下：
```typescript
import { Elysia } from 'elysia'
import { loadStatic } from './plugin'

const app = new Elysia()
    .use(loadStatic)
```

Elysia 静态插件也是一个延迟模块，因为它异步加载文件并注册文件路径。

### 惰性加载模块
与异步插件相同，惰性加载模块将在服务器启动后注册。

惰性加载模块可以是同步函数或异步函数，只要该模块与 `import` 一起使用，它就会被惰性加载。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .use(import('./plugin'))
```

在计算密集型和/或阻塞的模块上使用模块惰性加载是推荐的。

为确保模块在服务器启动之前注册，可以在延迟模块上使用 `await`。

### 测试
在测试环境中，我们可以使用 `await app.modules` 来等待延迟和惰性加载模块。

```typescript
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Modules', () => {
    it('inline async', async () => {
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
