---
url: 'https://elysiajs.com/patterns/extends-context.md'
---

# 扩展上下文&#x20;

Elysia默认提供了一个最小的上下文，允许我们使用状态、装饰、派生和解析根据我们的具体需求扩展上下文。

Elysia允许我们为各种用例扩展上下文，例如：

* 将用户ID提取为变量
* 注入一个公共模式存储库
* 添加一个数据库连接

我们可以通过使用以下API来扩展Elysia的上下文，以自定义上下文：

* [state](#state) - 全局可变状态
* [decorate](#decorate) - 分配给 **Context** 的额外属性
* [derive](#derive) / [resolve](#resolve) - 从现有属性创建新值

### 何时扩展上下文

只有在以下情况下，您才应该扩展上下文：

* 属性是一个全局可变状态，并且在多个路由中使用[state](#state)共享
* 属性与请求或响应相关联，使用[decorate](#decorate)
* 属性是从现有属性派生的，使用[derive](#derive) / [resolve](#resolve)

否则，我们建议将值或函数单独定义，而不是扩展上下文。

::: tip
建议将与请求和响应相关的属性或经常使用的函数分配给Context，以实现关注点分离。
:::

## 状态

**状态**是一个全局可变对象或状态，在Elysia应用程序中共享。

一旦调用 **state**，值将添加到 **store** 属性 **一次在调用时**，并且可以在处理程序中使用。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .get('/a', ({ store: { version } }) => version)
                // ^?
    .get('/b', ({ store }) => store)
    .get('/c', () => '仍然可以')
    .listen(3000)
```

### 何时使用

* 当您需要在多个路由中共享一个原始可变值时
* 如果您想使用一个非原始或 `wrapper` 值或类来改变内部状态，请改用[decorate](#decorate)。

### 关键要点

* **store** 是整个Elysia应用程序的单一真相来源的全局可变对象的表示。
* **state** 是一个函数，用于为 **store** 分配初始值，该值可以在后续进行修改。
* 确保在处理程序中使用之前分配一个值。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    // ❌ TypeError: counter 在 store 中不存在
    .get('/error', ({ store }) => store.counter)
    .state('counter', 0)
    // ✅ 因为我们之前分配了一个 counter，所以现在可以访问它
    .get('/', ({ store }) => store.counter)
```

::: tip
请注意，在分配之前，我们不能使用状态值。

Elysia会自动将状态值注册到商店中，而无需显式类型或额外的TypeScript泛型。
:::

### 引用和值 注意事项

要改变状态，建议使用 **引用** 进行修改，而不是使用实际值。

在从JavaScript访问属性时，如果我们将对象属性中的原始值定义为新值，则会丢失引用，该值将被视为新的独立值。

例如：

```typescript
const store = {
    counter: 0
}

store.counter++
console.log(store.counter) // ✅ 1
```

我们可以使用 **store.counter** 来访问和修改属性。

但是，如果我们将 counter 定义为新值

```typescript
const store = {
    counter: 0
}

let counter = store.counter

counter++
console.log(store.counter) // ❌ 0
console.log(counter) // ✅ 1
```

一旦原始值被重新定义为新变量，引用 **"链接"** 将会丢失，从而导致意外行为。

这也适用于 `store`，因为它是一个全局可变对象。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    // ✅ 使用引用，共享值
    .get('/', ({ store }) => store.counter++)
    // ❌ 在原始值上创建新变量，链接丢失
    .get('/error', ({ store: { counter } }) => counter)
```

## 装饰

**decorate** 直接在调用时为 **Context** 分配一个额外的属性。

```typescript twoslash
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    // ✅ 从前一行定义
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

### 何时使用

* 一个常量或只读值对象到 **Context**
* 非原始值或类，可能包含内部可变状态
* 附加函数、单例或不可变属性到所有处理程序。

### 关键要点

* 与 **state** 不同，装饰的值 **不应** 被改变，尽管这是可能的
* 确保在处理程序中使用之前分配一个值。

## 派生

###### ⚠️ 派生不处理类型完整性，您可能想要使用 [resolve](#resolve) 代替。

从 **Context** 中现有属性中检索值并分配新属性。

在请求发生时 **派生** 在转换生命周期中分配，允许我们 "派生" (从现有属性创建新属性)。

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

因为 **derive** 在新请求开始时分配，**derive** 可以访问请求属性，如 **headers**、**query**、**body**，而 **store** 和 **decorate** 则无法。

### 何时使用

* 从现有属性中创建一个新属性，而无需验证或类型检查
* 当您需要访问请求属性，如 **headers**、**query**、**body**，而无需验证

### 关键要点

* 与 **state** 和 **decorate** 不同，**derive** 是在新请求开始时分配的，而不是在调用时赋值。
* **derive 在转换时被调用，或者在验证之前** 发生，Elysia无法安全确认请求属性的类型，导致其结果为 **unknown**。如果您想从类型请求属性中分配新值，您可能想使用 [resolve](#resolve) 代替。

## 解析

类似于[derive](#derive)，但确保类型完整性。

解析允许我们将新属性分配到上下文中。

解析在 **beforeHandle** 生命周期或 **after validation** 阶段被调用，允许我们安全地 **解析** 请求属性。

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

* 在具有类型完整性的情况下，从现有属性中创建新属性（进行类型检查）
* 当您需要访问请求属性，如 **headers**、**query**、**body**，并且需要进行验证时

### 关键要点

* **resolve 在 beforeHandle 阶段或验证后被调用**。Elysia可以安全确认请求属性的类型并将其视为 **typed**。

### 来自解析/派生的错误

由于解析和派生基于 **transform** 和 **beforeHandle** 生命周期，我们可以从解析和派生中返回错误。如果从 **derive** 返回错误，Elysia将提前退出并将错误作为响应返回。

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

## 模式 高级概念

**state**，**decorate** 为向Context分配属性提供了类似API模式，如下所示：

* 键-值
* 对象
* 重映射

其中 **derive** 只能与 **remap** 一起使用，因为它依赖于现有值。

### 键-值

我们可以使用 **state** 和 **decorate** 通过键值模式分配一个值。

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

这种模式非常适合设置单个属性时的可读性。

### 对象

同时分配多个属性在单一分配的对象中更好地包含。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate({
        logger: new Logger(),
        trace: new Trace(),
        telemetry: new Telemetry()
    })
```

对象提供了一个较少重复的API用于设置多个值。

### 重映射

重映射是一个函数重新分配。

允许我们从现有值创建一个新值，例如重命名或移除一个属性。

通过提供一个函数，并返回一个全新的对象来重新分配该值。

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
    // ❌ 从状态重映射中排除
    .get('/version', ({ store }) => store.version)
```

使用状态重映射从现有值创建新的初始值是个好主意。

但是，重要的是要注意Elysia并未从这种方法中提供反应性，因为重映射只是分配了初始值。

::: tip
使用重映射，Elysia会将返回的对象视为新属性，从而移除对象中缺失的任何属性。
:::

## 附加 高级概念

为提供更流畅的体验，一些插件可能有很多属性值，这使得逐个重映射变得繁琐。

**附加** 函数由 **prefix** 和 **suffix** 组成，使我们能够重映射实例的所有属性。

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup)
    .prefix('decorator', 'setup')
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

这使我们可以轻松地批量重映射插件的属性，防止插件名称冲突。

默认情况下，**附加** 将自动处理运行时、类型级别的代码，将属性重映射为命名约定的驼峰式命名。

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
    .use(setup)
    .prefix('all', 'setup') // [!code ++]
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```
