---
title: 作用域
head:
    - - meta
      - property: 'og:title'
        content: 作用域 - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: Elysia 可以封装全局事件、重构冗余逻辑，并应用到特定路由使用守卫和组。

    - - meta
      - property: 'og:description'
        content: Elysia 可以封装全局事件、重构冗余逻辑，并应用到特定路由使用守卫和组。
---

# 作用域

<script setup>
import Playground from '../../components/nearl/playground.vue'
import Elysia from 'elysia'

const demo1 = new Elysia()
    .post('/student', 'Rikuhachima Aru')

const plugin2 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const demo2 = new Elysia()
    .use(plugin2)
    .get('/parent', () => 'parent')

const plugin3 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'overwrite'
    })

const demo3 = new Elysia()
    .guard(app => app
        .use(plugin3)
        .get('/inner', () => 'inner')
    )
    .get('/outer', () => 'outer')
</script>

默认情况下，钩子和架构的作用域仅限于当前实例，而不是全局的。

Elysia 具有封装作用域，可以更好地控制生命周期的多功能性。

## Hook 类型

钩子类型用于指定钩子的作用域是封装的还是全局的。

Elysia 钩子类型如下：

- **local** (默认)- 仅适用于当前实例和后代
- **scoped** - 适用于父类、当前实例和子类
- **global** - 适用于应用该插件的所有实例 (所有父实例、当前实例和子代实例)

如果未指定，钩子默认为本地钩子。

要指定钩子的类型，请在钩子中添加 `{ as: hookType }`。

要将钩子应用于全局，我们需要将钩子指定为全局钩子。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => { // [!code ++]
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'log hi')
```

让我们创建一个插件来说明钩子类型是如何工作的。

```typescript twoslash
import { Elysia } from 'elysia'

// ? Value base on table value provided below
const type = 'local'

const child = new Elysia()
    .get('/child', () => 'hello')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => {
        console.log('hi')
    })
    .use(child)
    .get('/current', () => 'hello')

const parent = new Elysia()
    .use(current)
    .get('/parent', () => 'hello')

const main = new Elysia()
    .use(parent)
    .get('/main', () => 'hello')
```

通过更改该 `type` 值，结果应如下所示：

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   | 
| 'scoped'    | ✅    | ✅       | ✅     | ❌   | 
| 'global'   | ✅    | ✅       | ✅     | ✅   | 

## Guard

Guard 允许我们同时将钩子和模式应用到多个路由中。

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
    .get('/', () => 'hi')
    .listen(3000)
```

这段代码对 `/sign-in` 和 `/sign-up` 的 `body` 都进行了验证，而不是逐一内联模式，但对 `/` 却没有进行验证。

我们可以将路由验证总结如下：

| Path | Has validation |
| ------- | ------------- |
| /sign-up | ✅ |
| /sign-in | ✅ |
| / | ❌ |

Guard 接受的参数与内联钩子相同，唯一的区别是可以将钩子应用于作用域中的多个路由。

这意味着上面的代码会被翻译成：

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

### Guard 作用域

Guard 是钩子类型的硬限制。

在 `guard` 和 `group` 中定义的任何生命周期**都将始终**包含在作用域中，即使钩子类型是**全局**的。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'overwrite'
    })

const app = new Elysia()
    .guard(app => app
        .use(plugin)
        .get('/inner', () => 'inner')
    )
    .get('/outer', () => 'outer')
    .listen(3000)
```

<Playground :elysia="demo3" />

评估路由的日志如下：

| route       | response  |
| ----------- | --------- |
| /inner      | overwrite |
| /outer      | outer     |

## 分组 Guard

我们可以通过向组提供 3 个参数来使用带前缀的组。

1. Prefix - 路由前缀
2. Guard - Schema
3. Scope - Elysia 应用程序回调

与 guard 相同的 API 适用于第 2 个参数，而不是将 group 和 guard 嵌套在一起。

请看下面的示例：

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


从嵌套的分组保护中，我们可以通过为分组的第 2 个参数提供保护作用域，将分组和保护合并在一起：

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

其语法如下

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

<Playground :elysia="demo1" />

## 插件

默认情况下，插件只**对自身和后代应用钩子**。

如果在插件中注册了钩子，继承该插件的实例将**不会**继承钩子和模式。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'not log hi')
```

要在全局应用钩子，我们需要指定钩子为全局钩子。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'parent')
```

<Playground :elysia="demo2" />
