---
title: 插件
head:
    - - meta
      - property: 'og:title'
        content: 插件 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 插件是一种将逻辑解耦为更小部分的方法，可在服务器上定义可重复使用的组件。插件可以通过使用 `use` 进行注册，注册插件会合并插件和当前实例之间的类型，钩子的范围和模式也会合并。

    - - meta
      - property: 'og:description'
        content: 插件是一种将逻辑解耦为更小部分的方法，可在服务器上定义可重复使用的组件。插件可以通过使用 `use` 进行注册，注册插件会合并插件和当前实例之间的类型，钩子的范围和模式也会合并。
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
</script>

# 插件

插件是一种将功能分解成较小部分的模式。为我们的 Web 服务器创建可重复使用的组件。

定义插件就是定义一个单独的实例。

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

我们可以通过向 `Elysia.use` 传递一个实例来使用该插件。

<Playground :elysia="demo1" />

插件将继承插件实例的所有属性，包括**状态**、**装饰**、**派生**、**路由**、**生命周期**等。

Elysia 还将自动处理类型推断，因此你可以想象一下在主实例上调用所有其他实例的情形。

::: tip
注意插件中不包含 `.listen`，因为 `.listen` 会为使用分配端口，而我们只希望主实例分配端口。
:::

## 独立文件

使用插件模式，可以将业务逻辑分离到单独的文件中。

首先，我们在 `plugin.ts` 中定义一个实例：

```typescript twoslash
// plugin.ts
import { Elysia } from 'elysia'

export const plugin = new Elysia()
    .get('/plugin', () => 'hi')
```

然后，我们将实例导入主文件：

```typescript twoslash
// @filename: plugin.ts
import { Elysia } from 'elysia'

export const plugin = new Elysia()
    .get('/plugin', () => 'hi')
// @filename: index.ts
// ---cut---
// main.ts
import { Elysia } from 'elysia'
import { plugin } from './plugin'

const app = new Elysia()
    .use(plugin)
    .listen(3000)
```

## 配置

为使插件更有用，建议允许通过配置进行自定义。

你可以创建一个可接受参数的函数，这些参数可以改变插件的行为，使其更易于重用。

```typescript twoslash
import { Elysia } from 'elysia'

const version = (version = 1) => new Elysia()
        .get('/version', version)

const app = new Elysia()
    .use(version(1))
    .listen(3000)
```

## 函数回调

建议定义一个新的插件实例，而不是使用函数回调。

函数回调允许我们访问主实例的现有属性。例如，检查特定路线或商店是否存在。

要定义函数回调，请创建一个接受 Elysia 作为参数的函数。

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

<Playground :elysia="demo3" />

一旦传递给 `Elysia.use`，函数回调的行为与普通插件无异，只是属性会直接赋值。

::: tip
你不必担心函数回调与创建实例之间的性能差异。

Elysia 可以在几毫秒内创建 1 万个实例，新的 Elysia 实例的类型推断性能甚至比函数回调更好。
:::

## 插件数据去重

默认情况下，Elysia 将注册任何插件并处理类型定义。

某些插件可能会多次使用来提供类型推断，从而导致重复设置初始值或路由。

Elysia 通过使用**名称**和**可选种子**来区分实例来帮助 Elysia 识别实例重复，从而避免了这种情况：

```typescript twoslash
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

Elysia 将使用**名称**和**种子**创建校验和，以识别实例是否已被注册，如果已被注册，Elysia 将跳过插件注册。

如果没有提供 seed，Elysia 将只使用**名称**来区分实例。这意味着，即使你注册了多次插件，也只会注册一次。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

这样，Elysia 就可以通过重复使用已注册的插件来提高性能，而不是反复处理插件。

::: tip
种子可以是任何东西，从字符串到复杂对象或类。

如果提供的值是类，Elysia 将尝试使用 `.toString` 方法生成校验和。
:::

## 服务定位器

在一个实例中应用多个状态和装饰器插件时，该实例将获得类型安全。

不过，你可能会注意到，当你试图在另一个不带装饰器的实例中使用被装饰的值时，类型会丢失。

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

这是 TypeScript 的限制，Elysia 只能引用当前实例。

Elysia 引入了**服务定位器**模式来解决这个问题。

简单地说，Elysia 会查找插件校验和，然后获取值或注册一个新值。从插件推断类型。

简单地说，我们需要提供插件引用，以便 Elysia 找到服务。

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

## 官方插件

你可以在 Elysia 的插件中找到官方维护的[插件](/plugins/overview)。

部分插件包括

- GraphQL
- Swagger
- Server Sent Event

以及各种社区插件。
