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
import TutorialBadge from '../components/arona/badge.vue'

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

# 插件 <TutorialBadge href="/tutorial/getting-started/plugin" />

插件是一个从主实例中**解耦**出来的部分。

每个 Elysia 实例都可以独立运行，也可以作为其他实例的一部分使用。

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

插件将继承插件实例的所有属性，如 `state`、`decorate`，但**不会继承插件生命周期**，因为它默认是[隔离的](#scope)（将在下一节中提到 ↓）。

Elysia 也会自动处理类型推断。

## 作用域 <TutorialBadge href="/tutorial/getting-started/encapsulation" />

Elysia 的生命周期方法**只对其自身实例封装**。

## 依赖 <Badge type="danger" text="必读" />
Elysia 设计上由多个小型 Elysia 应用组成，这些应用就像微服务一样可以**独立运行**并相互通信。

每个 Elysia 实例都是独立的，并且**可以作为独立服务器运行**。

当一个实例需要使用另一个实例的服务时，必须**显式声明依赖**。

```ts twoslash
// @errors: 2339
import { t } from 'elysia'

abstract class Auth {
	static getProfile() {
		return {
			name: 'Elysia User'
		}
	}

	static models = {
		user: t.Object({
			name: t.String()
		})
	} as const
}
// ---cut---
import { Elysia } from 'elysia'

const auth = new Elysia()
	.decorate('Auth', Auth)
	.model(Auth.models)

const main = new Elysia()
 	// ❌ 缺少 'auth'
	.get('/', ({ Auth }) => Auth.getProfile())
	// 使用 Auth 的服务必须依赖 auth
	.use(auth) // [!code ++]
	.get('/profile', ({ Auth }) => Auth.getProfile())
//                                        ^?



// ---cut-after---
```

这类似于**依赖注入**，每个实例必须声明它的依赖项。

这种方法强制你明确依赖，有助于更好地跟踪和模块化。

### 去重 <Badge type="warning" text="重要" />

默认情况下，每个插件会在应用到另一个实例时**每次都被重新执行**。

为防止这种情况，Elysia 可以通过使用 `name` 和可选的 `seed` 属性，利用**唯一标识符**来对[lifecycle](/essential/life-cycle)进行去重。

```ts twoslash
import { Elysia } from 'elysia'

// `name` 是唯一标识符
const ip = new Elysia({ name: 'ip' }) // [!code ++]
	.derive(
		{ as: 'global' },
		({ server, request }) => ({
			ip: server?.requestIP(request)
		})
	)
	.get('/ip', ({ ip }) => ip)

const router1 = new Elysia()
	.use(ip)
	.get('/ip-1', ({ ip }) => ip)

const router2 = new Elysia()
	.use(ip)
	.get('/ip-2', ({ ip }) => ip)

const server = new Elysia()
	.use(router1)
	.use(router2)
```

给实例添加 `name` 和可选的 `seed` 会使其成为唯一标识符，防止多次调用。

更多内容请参见[插件去重](/essential/plugin.html#plugin-deduplication)。

### 全局依赖与显式依赖

某些情况下，全局依赖比显式依赖更合适。

**全局** 插件示例：
- **不添加类型的插件** - 例如 cors，compress，helmet
- 添加全局[lifecycle](/essential/life-cycle)而不应由任何实例控制的插件 - 例如 tracing，logging

示例用例：
- OpenAPI/Open - 全局文档
- OpenTelemetry - 全局追踪器
- Logging - 全局记录器

在这种情况下，作为全局依赖创建比应用于每个实例更合理。

然而，如果你的依赖不属于上述类别，建议使用**显式依赖**。

**显式依赖**示例：
- **添加类型的插件** - 例如 macro, state, model
- 添加业务逻辑供实例交互的插件 - 例如 Auth，Database

示例用例：
- 状态管理 - 例如 Store，Session
- 数据建模 - 例如 ORM，ODM
- 业务逻辑 - 例如 Auth，Database
- 功能模块 - 例如 Chat，Notification

## 作用域 <Badge type="danger" text="必读" /> <TutorialBadge href="/tutorial/getting-started/encapsulation" />

Elysia 的[lifecycle](/essential/life-cycle)方法**封装在各自的实例内**。

这意味着如果你创建新的实例，它不会与其他实例共享生命周期方法。

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(({ cookie }) => {
		throwIfNotSignIn(cookie)
	})
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// ⚠️ 这里不会进行登录检查
	.patch('/rename', ({ body }) => updateProfile(body))
```

<!-- 此处不要加“the”修饰符于 profile 和 app - @Saltyaom -->
在此示例中，`isSignIn` 检查只会应用于 `profile`，而不会应用于 `app`。

<Playground :elysia="scope1" />

> 尝试在 URL 输入框中切换到 **/rename** 查看结果

<br>

**Elysia 默认隔离生命周期**，除非显式声明。这类似于 JavaScript 中的**export**，你需要导出函数才能让其在模块外部可用。

要将生命周期**“导出”**至其他实例，必须指定作用域。

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
	// 这里会进行登录检查
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="scope2" />

将生命周期作用域设置为**"global"**会把生命周期导出到**所有实例**。

### 作用域级别
Elysia 有三种作用域级别：

Scope types are as follows:
1. **local**（默认）- 仅应用于当前实例及其子孙实例
2. **scoped** - 应用于父实例、当前实例及其子孙实例
3. **global** - 应用于所有使用该插件的实例（所有父实例、当前实例及子孙实例）

我们通过以下示例来回顾每个作用域级别的作用：
```typescript
import { Elysia } from 'elysia'


const child = new Elysia()
    .get('/child', 'hi')

const current = new Elysia()
	// ? 根据下面表格的取值
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

根据 `type` 值不同，结果如下表：

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| local      | ✅    | ✅      | ❌      | ❌   |
| scoped     | ✅    | ✅      | ✅      | ❌   |
| global     | ✅    | ✅      | ✅      | ✅   |

### 子实例

默认情况下，插件**仅对自身及其子孙应用钩子**。

如果钩子注册在插件中，使用该插件的实例将**不继承钩子和模式**。

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

要全局应用钩子，需要指定钩子为全局。
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

Functional callbacks allow access to existing properties of the main instance. For example, checking if specific routes or stores exist, but they make encapsulation and scope harder to handle correctly.

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
你无需担心函数式回调与创建实例之间的性能差异。

Elysia 能在几毫秒内创建 1 万个实例，且新实例的类型推断性能优于函数回调。
:::

## 插件去重

Guard 允许你一次性将一个钩子和模式应用到多个路由上。

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

这段代码将 `body` 验证应用到了 `/sign-in` 和 `/sign-up` 路由，而不是逐个内联模式，但没应用到 `/`。

路由验证总结如下：
| 路径 | 有验证 |
| ------- | ------------- |
| /sign-up | ✅ |
| /sign-in | ✅ |
| / | ❌ |

Guard 接收和内联钩子相同的参数；唯一的区别是你可以将钩子应用于作用域内的多个路由。

这意味着上述代码等同于：

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

通过向 group 提供三个参数，可以使用前缀：

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


从嵌套分组防护中，可以通过将防护作为 group 的第 2 个参数合并 group 和 guard：
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

这将得到如下语法：
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
要将钩子应用到父级，可以采用以下之一：
1. [内联 as](#inline-as) 仅应用于单个钩子
2. [防护 as](#guard-as) 应用于 guard 中的所有钩子
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

不过，这种方式只针对单个钩子，可能不适合多个钩子。

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

Guard 允许我们将 `schema` 和 `hook` 同时应用于多个路由，并指定作用域。

但它不支持 `derive` 和 `resolve` 方法。

### 实例 as
`as` 会读取当前实例的所有钩子和模式作用域，并修改它们。

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

### Lazy Load Module
跟异步插件一样，懒加载模块会在服务器启动后注册。

懒加载模块可以是同步的或异步的；只要使用 `import` 引入，模块就会懒加载。

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