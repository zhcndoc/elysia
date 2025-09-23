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

const profile1 = new Elysia()
	.onBeforeHandle(({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const scope1 = new Elysia()
	.use(profile1)
	// This will NOT have sign in check
	.patch('/rename', () => 'Updated!')

const profile2 = new Elysia()
	.onBeforeHandle({ as: 'global' }, ({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const scope2 = new Elysia()
	.use(profile2)
	// This will NOT have sign in check
	.patch('/rename', ({ status }) => status(401))
</script>

# 插件

插件是一种将功能解耦成更小部分的模式。为我们的 Web 服务器创建可重用的组件。

要创建一个插件，就是创建一个单独的实例。

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

插件将继承插件实例的所有属性，比如 `state`、`decorate`，但**不会继承插件生命周期**，因为它默认是[隔离的](#scope)。

Elysia 也会自动处理类型推断。

## 插件

每一个 Elysia 实例都可以成为一个插件。

我们将逻辑拆分成一个单独的 Elysia 实例，并在多个实例中重用它。

创建插件，只需在单独的文件中定义一个实例：
```typescript twoslash
// plugin.ts
import { Elysia } from 'elysia'

export const plugin = new Elysia()
    .get('/plugin', () => 'hi')
```

然后在主文件中导入该实例：
```typescript
import { Elysia } from 'elysia'
import { plugin } from './plugin' // [!code ++]

const app = new Elysia()
    .use(plugin) // [!code ++]
    .listen(3000)
```


## 作用域

Elysia 的生命周期方法**只对其自身实例封装**。

这意味着如果你创建一个新的实例，它不会与其他实例共享生命周期方法。

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(({ cookie }) => {
		throwIfNotSignIn(cookie)
	})
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// ⚠️ 此处不会有登录检查
	.patch('/rename', ({ body }) => updateProfile(body))
```

<!-- 此处不要加“the”修饰符于 profile 和 app - @Saltyaom -->
在此示例中，`isSignIn` 检查只会应用于 `profile`，而不会应用于 `app`。

<Playground :elysia="scope1" />

> 尝试在 URL 输入框中切换到 **/rename** 查看结果

<br>

**Elysia 默认隔离生命周期**，除非显式声明。这类似于JavaScript中的**export**，你需要导出函数才能让其在模块外部可用。

要将生命周期**“导出”**到其他实例，必须指定作用域。

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		{ as: 'global' }, // [!code ++]
		({ cookie }) => {
			throwIfNotSignIn(cookie)
		}
	)
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// 这将进行登录检查
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="scope2" />

将生命周期作用域设置为**"global"**将把生命周期导出至**所有实例**。

### 作用域级别
Elysia 有三种作用域级别：

作用域类型如下：
1. **local**（默认） - 仅应用于当前实例及其子实例
2. **scoped** - 应用于父实例、当前实例及子实例
3. **global** - 应用于所有使用此插件的实例（所有父级、当前实例及子实例）

通过以下示例查看每种作用域类型的行为：
```typescript
import { Elysia } from 'elysia'


const child = new Elysia()
    .get('/child', 'hi')

const current = new Elysia()
	// ? 类型值基于下表
    .onBeforeHandle({ as: 'local' }, () => { // [!code ++]
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

根据 `type` 值的不同，结果应如下所示：

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| local      | ✅    | ✅      | ❌      | ❌   |
| scoped     | ✅    | ✅      | ✅      | ❌   |
| global     | ✅    | ✅      | ✅      | ✅   |

### 子实例

默认情况下，插件只会**将钩子应用于自身及其子实例**。

如果钩子注册在一个插件中，继承该插件的实例**不会**继承该钩子和模式。

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

要将钩子应用到全局，需指定钩子作用域为 global。
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

## 配置

为了让插件更有用，建议通过配置支持自定义。

你可以创建一个接受参数的函数，这些参数能够影响插件行为，从而提升复用性。

```typescript
import { Elysia } from 'elysia'

const version = (version = 1) => new Elysia()
        .get('/version', version)

const app = new Elysia()
    .use(version(1))
    .listen(3000)
```

### 功能回调

推荐定义一个新的插件实例，而非使用功能回调。

函数式回调允许我们访问主实例已有属性，例如检测某些路由或状态是否存在，但正确处理封装和作用域较困难。

函数式回调是指创建一个接受 Elysia 实例作为参数的函数。

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

一旦传递给 `Elysia.use`，函数式回调的行为类似于普通插件，只不过其属性直接赋值给主实例。

::: tip
你无需担心函数回调与新建实例间的性能差异。

Elysia 能在几毫秒内创建 1 万个实例，且新实例的类型推断性能优于函数回调。
:::

## 插件去重

默认情况下，Elysia 会注册任意插件并处理类型定义。

某些插件可能因需要多次使用以实现类型推断，导致初始化值或路由重复设置。

Elysia 通过使用 **name** 和 **可选种子(seed)** 来区分实例，避免重复注册：

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

Elysia 使用 **name** 和 **seed** 生成校验和用以判断实例是否已注册，若已注册则跳过插件注册。

若未提供种子，Elysia 只判断 **name**。这意味着即使多次注册插件，也只会注册一次。

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

这让 Elysia 通过复用已注册的插件而不是重复处理插件，从而提升性能。

::: tip
种子可以是任何类型，从字符串到复杂对象或类。

若种子为类，Elysia 会尝试调用其 `.toString` 方法生成校验和。
:::

### 服务定位器

当你将带状态或装饰器的插件应用于实例时，该实例将获得类型安全。

但若不将插件应用于另一个实例，则无法推断类型。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const child = new Elysia()
    // ❌ 缺少 'a'
    .get('/', ({ a }) => a)

const main = new Elysia()
    .decorate('a', 'a')
    .use(child)
```

为解决该问题，Elysia 引入了 **服务定位器** 模式。

Elysia 会寻找插件的校验和以获取值，或者注册新的值，并根据插件推断类型。

因此，我们必须提供插件引用，以便 Elysia 找到服务，从而添加类型安全。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// 没有使用 'setup'，类型会缺失
const error = new Elysia()
    .get('/', ({ a }) => a)

// 使用 `setup`，类型可以推断
const child = new Elysia()
    .use(setup) // [!code ++]
    .get('/', ({ a }) => a)
    //           ^?

const main = new Elysia()
    .use(child)
```

<Playground :elysia="demo5" />

## 防护

防护允许我们将钩子和模式一次性应用于多个路由。

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

此代码为 `/sign-in` 和 `/sign-up` 应用了 `body` 验证，而 `/` 则没有。

路由验证总结如下：
| 路径 | 有验证 |
| ------- | ------------- |
| /sign-up | ✅ |
| /sign-in | ✅ |
| / | ❌ |

防护接受与内联钩子相同的参数，唯一不同的是你可以在作用域内将钩子应用于多个路由。

这意味着上述代码可等同于：

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

通过提供三个参数给 group 可以使用前缀：

1. 前缀 - 路由前缀
2. 防护 - 模式
3. 范围 - Elysia 应用回调

防护应用的 API 和内联用法相同，只是作用于第二个参数，而不是将分组和防护嵌套。

示例：

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


防护和分组合并写法：

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

等价于如下语法：

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

## 作用域转换 <Badge type="warning">高级概念</Badge>
若要将钩子应用于父实例，可以使用以下方式之一：
1. [内联 as](#inline-as) 仅应用于单个钩子
2. [防护 as](#guard-as) 应用于防护中的所有钩子
3. [实例 as](#instance-as) 应用于实例中的所有钩子

### 内联钩子

每个事件监听器都接受 `as` 参数，用以指定钩子的作用域。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive({ as: 'scoped' }, () => { // [!code ++]
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)

const main = new Elysia()
    .use(plugin)
    // ✅ 可以访问 hi
    .get('/parent', ({ hi }) => hi)
```

但此方法只适用于单个钩子，且可能不适合多个钩子。

### 防护 as

每个事件监听器接受 `as` 参数，指定钩子作用域。

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

防护允许我们一次性将 `schema` 和 `hook` 应用于多个路由，并且可以指定作用域。

但它不支持 `derive` 和 `resolve` 方法。

### 实例 as

`as` 会读取当前实例所有钩子和模式的作用域，并对其进行修改。

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
    // ✅ 可以访问 hi
    .get('/parent', ({ hi }) => hi)
```

有时我们希望将插件重新应用于父实例，但受限于 `scoped` 机制仅限一个父级。

要将其应用到父实例，我们需要**提升作用域到父实例**，而 `as` 是实现此目的的绝佳方式。

这意味着如果你有一个 `local` 范围，想要应用到父实例，你可以用 `as('scoped')` 来提升它。

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
	// 这里将报错，因为 `scoped` 被提升到父级
	.get('/ok', () => 3)
```

## 延迟加载
模块默认是立即加载的。

Elysia 会确保所有模块在服务器启动之前被注册。

然而，有些模块计算开销大或阻塞，导致服务器启动变慢。

为了解决这个问题，Elysia 允许你提供异步插件，以免阻塞服务器启动。

### 延迟模块
延迟模块是一个异步插件，服务器启动后才注册。

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

### 延迟加载模块
与异步插件类似，延迟加载模块会在服务器启动后注册。

延迟加载模块可以是同步或异步函数，只要通过 `import` 使用，模块就会延迟加载。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .use(import('./plugin'))
```

对计算量大和/或阻塞的模块，推荐使用延迟加载。

若需确保模块在服务器启动前加载，请 `await` 延迟模块。

### 测试
测试环境中，我们可以通过 `await app.modules` 等待延迟加载和懒加载模块完成。

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