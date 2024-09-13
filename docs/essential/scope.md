---
title: 作用域
head:
    - - meta
      - property: 'og:title'
        content: 作用域 - Elysia 中文文档

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

const mock2 = {
    '/child': {
        'GET': 'hi'
    },
    '/parent': {
        'GET': 'hi'
    }
}

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

const mock3 = {
    '/inner': {
        'GET': 'overwrite'
    },
    '/outer': {
        'GET': 'outer'
    }
}
</script>

默认情况下，钩子和模式将只应用于 **当前实例**。

Elysia 提供了一个封装作用域，以防止不必要的副作用。

## 作用域
作用域类型用于指定钩子是否应该被封装或全局。

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

从上面的代码中，我们可以看到 `hi` 在父实例中缺失，因为默认情况下作用域是局部的，如果没有指定，将不会应用到父实例。

要使钩子应用到父实例，可以使用 `as` 来指定钩子作用域。

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

## 作用域级别
Elysia 有以下三种作用域级别：
作用域类型如下：
- **局部**（默认）- 只应用到当前实例及其子实例
- **封装**（scoped）- 应用到父实例、当前实例及其子实例
- **全局** - 应用到所有应用了插件的实例（所有父实例、当前实例及其子实例）

让我们通过以下示例来查看每个作用域级别的效果：
```typescript twoslash
import { Elysia } from 'elysia'

// ? Value base on table value provided below
const type = 'local'

const child = new Elysia()
    .get('/child', () => 'hi')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => { // [!code ++]
        console.log('hi')
    })
    .use(child)
    .get('/current', () => 'hi')

const parent = new Elysia()
    .use(current)
    .get('/parent', () => 'hi')

const main = new Elysia()
    .use(parent)
    .get('/main', () => 'hi')
```

通过更改 `type` 的值，结果应该如下：

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   |
| 'scoped'    | ✅    | ✅       | ✅     | ❌   |
| 'global'   | ✅    | ✅       | ✅     | ✅   |

## 守卫

守卫允许我们将钩子和模式同时应用到多个路由。

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

这段代码将验证应用于 '/sign-in' 和 '/sign-up'，而不是逐个内联模式，但不会应用于 '/'。

我们可以将路由验证总结如下：
| Path | Has validation |
| ------- | ------------- |
| /sign-up | ✅ |
| /sign-in | ✅ |
| / | ❌ |

守卫接受与内联钩子相同的参数，唯一的区别是你可以在作用域内将钩子应用到多个路由。

这意味着上面的代码被转换为：

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

## 分组守卫

我们可以通过提供三个参数来使用前缀分组：

1. 前缀 - 路由前缀
2. 守卫 - 模式
3. 作用域 - Elysia 应用回调

与守卫相同的使用 API，而不是将分组和守卫一起嵌套。

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


通过将分组守卫合并在一起，我们可以通过将守卫作用域提供给分组的第二参数来实现：
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/v1',
        (app) => app.guard( // [!code ++]
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', ({ body }) => body)
        ) // [!code ++]
    )
    .listen(3000)
```

这导致以下语法：
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

## 作用域转换
要将钩子应用到父实例，可以使用以下方法之一：
1. `inline as` 仅应用于单个钩子
2. `guard as` 应用于守卫内的所有钩子和模式
3. `instance as` 应用于当前实例内的所有钩子和模式

### 1. 内联
每个事件监听器都会接受 `as` 参数来指定钩子的作用域。

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

但是，这种方法只适用于单个钩子，可能不适用于多个钩子。

### 2. 守卫
每个事件监听器都会接受 `as` 参数来指定钩子的作用域。

```typescript twoslash
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		response: t.String(),
		beforeHandle() {
			console.log('ok')
		}
	})
    .get('/child', () => 'ok')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'hello')
```

守卫允许我们将 `schema` 和 `hook` 同时应用到多个路由，同时指定作用域。

但是，它不支持 `derive` 和 `resolve` 方法。

### 3. 实例
`as` 会读取当前实例的所有钩子和模式作用域，并进行修改。

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

有时我们想要将插件应用到父实例，但由于 `scoped` 机制的限制，它只能应用到 1 个父实例。

要将它应用到父实例，我们需要将作用域 **"提升到父实例"**，`as` 是完成这一点的完美方法。

这意味着如果你有一个 `local` 作用域，并且想要将其应用到父实例，你可以使用 `as('plugin')` 来提升它。
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

## 插件

默认情况下，插件将只 **应用钩子到自身及其子实例**。

如果钩子注册在插件中，继承了该插件的实例 **将不会继承钩子和模式**。

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

要全局应用钩子，我们需要指定钩子为全局。
```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        return 'hi'
    })
    .get('/child', () => 'child')
    .as('plugin')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'parent')
```

<Playground :elysia="demo2" :mock="mock2" />
