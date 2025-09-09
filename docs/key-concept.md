---
title: 关键概念 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 关键概念 - ElysiaJS

    - - meta
      - name: 'description'
        content: 尽管 Elysia 是一个简单的库，但它有一些关键概念，您需要理解以有效地使用它。此页面将指导您了解 ElysiaJS 的关键概念。

    - - meta
      - property: 'og:description'
        content: 尽管 Elysia 是一个简单的库，但它有一些关键概念，您需要理解以有效地使用它。此页面将指导您了解 ElysiaJS 的关键概念。
---

# 关键概念

尽管 Elysia 是一个简单的库，但它有一些关键概念，您需要理解以有效地使用它。

此页面涵盖了您应该了解的 Elysia 的最重要概念。

::: tip
我们 __强烈推荐__ 您在深入学习 Elysia 之前阅读此页面。
:::

## 一切都是组件

每个 Elysia 实例都是一个组件。

组件是可以连接到其他实例的插件。

它可以是路由、存储、服务或其他任何东西。

```ts twoslash
import { Elysia } from 'elysia'

const store = new Elysia()
	.state({ visitor: 0 })

const router = new Elysia()
	.use(store)
	.get('/increase', ({ store }) => store.visitor++)

const app = new Elysia()
	.use(router)
	.get('/', ({ store }) => store)
	.listen(3000)
```

这迫使您将应用程序分解为小块，使您能够轻松添加或删除功能。

在 [插件](/essential/plugin.html) 中了解更多关于此的内容。

## 方法链
Elysia 代码应始终使用 **方法链**。

由于 Elysia 类型系统复杂，Elysia 中的每个方法都返回一个新的类型引用。

**这很重要**，以确保类型的完整性和推断。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // 存储是严格类型 // [!code ++]
    .get('/', ({ store: { build } }) => build)
                        // ^?
    .listen(3000)
```

在上面的代码中，**state** 返回一个新的 **ElysiaInstance** 类型，添加了一个类型化的 `build` 属性。

### 不要在没有方法链的情况下使用 Elysia
如果不使用方法链，Elysia 不会保存这些新类型，导致没有类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议您 <u>**始终使用方法链**</u> 来提供准确的类型推断。

## 作用域
默认情况下，每个实例中的事件/生命周期是相互隔离的。

```ts twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const ip = new Elysia()
	.derive(({ server, request }) => ({
		ip: server?.requestIP(request)
	}))
	.get('/ip', ({ ip }) => ip)

const server = new Elysia()
	.use(ip)
	.get('/ip', ({ ip }) => ip)
	.listen(3000)
```

在此示例中，`ip` 属性仅在其自身实例中共享，而不在 `server` 实例中共享。

要共享生命周期，在我们的例子中，与 `server` 实例共享 `ip` 属性，我们需要 **明确指定** 它可以被共享。

```ts twoslash
import { Elysia } from 'elysia'

const ip = new Elysia()
	.derive(
		{ as: 'global' }, // [!code ++]
		({ server, request }) => ({
			ip: server?.requestIP(request)
		})
	)
	.get('/ip', ({ ip }) => ip)

const server = new Elysia()
	.use(ip)
	.get('/ip', ({ ip }) => ip)
	.listen(3000)
```

在这个例子中，`ip` 属性在 `ip` 和 `server` 实例之间共享，因为我们将其定义为 `global`。

这迫使您考虑每个属性的作用域，防止您意外地在实例之间共享属性。

在 [作用域](/essential/plugin.html#scope) 中了解更多关于此的内容。

## 依赖性
默认情况下，每个实例在应用于另一个实例时会被重新执行。

这可能导致相同方法被多次应用，而某些方法，如 **生命周期** 或 **路由**，应该只调用一次。

为了防止生命周期方法重复调用，我们可以为实例添加 **一个唯一标识符**。

```ts twoslash
import { Elysia } from 'elysia'

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

这将通过使用唯一名称进行去重，防止 `ip` 属性被多次调用。

这使我们能够在没有性能损失的情况下多次重用相同的实例。迫使您考虑每个实例的依赖性。

在 [插件去重](/essential/plugin.html#plugin-deduplication) 中了解更多关于此的内容。

### 服务定位器
当您将带状态/装饰器的插件应用于实例时，实例将获得类型安全。

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

Elysia 引入了 **服务定位器** 设计模式来解决这个问题。

我们简单地提供插件引用，以便 Elysia 找到服务以添加类型安全。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// 没有 'setup'，类型将缺失
const error = new Elysia()
    .get('/', ({ a }) => a)

const main = new Elysia()
	// 有了 `setup`，类型将被推断
    .use(setup) // [!code ++]
    .get('/', ({ a }) => a)
    //           ^?
```

正如在 [依赖性](#dependencies) 中提到的，我们可以使用 `name` 属性来去重实例，因此不会有任何性能损失或生命周期重复。

## 代码顺序

Elysia 的生命周期代码顺序非常重要。

因为事件只会在注册后应用于路由。

如果你把 onError 放在插件之前，插件将不会继承 onError 事件。

```typescript
import { Elysia } from 'elysia'

new Elysia()
 	.onBeforeHandle(() => {
        console.log('1')
    })
	.get('/', () => 'hi')
    .onBeforeHandle(() => {
        console.log('2')
    })
    .listen(3000)
```

控制台应记录以下内容：

```bash
1
```

注意到它没有记录 **2**，因为事件是在路由之后注册的，所以它不适用于该路由。

在 [代码顺序](/essential/life-cycle.html#order-of-code) 中了解更多信息。

## 类型推断
Elysia 具有复杂的类型系统，允许您从实例推断类型。

```ts twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.post('/', ({ body }) => body, {
                // ^?

		body: t.Object({
			name: t.String()
		})
	})
```

如果可能，**始终使用内联函数**以提供准确的类型推断。

如果您需要应用单独的函数，例如 MVC 的控制器模式，建议从内联函数中解构属性，以防止不必要的类型推断。

```ts twoslash
import { Elysia, t } from 'elysia'

abstract class Controller {
	static greet({ name }: { name: string }) {
		return 'hello ' + name
	}
}

const app = new Elysia()
	.post('/', ({ body }) => Controller.greet(body), {
		body: t.Object({
			name: t.String()
		})
	})
```

### TypeScript
我们可以通过以下方式访问 `static` 属性获取每个 Elysia/TypeBox 类型的类型定义：

```ts twoslash
import { t } from 'elysia'

const MyType = t.Object({
	hello: t.Literal('Elysia')
})

type MyType = typeof MyType.static
//    ^?
```

<br>
<br>
<br>

这使 Elysia 能够自动推断并提供类型，减少了声明重复架构的需要

单个 Elysia/TypeBox 架构可以用于：
- 运行时验证
- 数据强制转换
- TypeScript 类型
- OpenAPI 架构

这使我们能够将架构作为 **单一事实来源**。

在 [最佳实践：MVC 控制器](/essential/best-practice.html#controller) 中了解更多关于此的内容。