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

### 我们 __强烈建议__ 您在开始使用 Elysia 之前阅读此页面。

尽管 Elysia 是一个简单的库，但它有一些关键概念，您需要理解以有效地使用它。

此页面涵盖了您应该了解的 Elysia 最重要的概念。

## 一切都是组件

每个 Elysia 实例都是一个组件。

组件是可以连接到其他实例的插件。

一个组件可以是路由、存储、服务或其他任何东西。

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

这迫使您将应用程序拆分为小块，使得添加或移除功能变得简单。

在 [插件](/essential/plugin.html) 中了解更多内容。

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

在这个例子中，`ip` 属性只在它自己的实例中共享，而不在 `server` 实例中共享。

要共享生命周期，在我们的例子中，即与 `server` 实例共享 `ip` 属性，我们需要**明确地指出它**可以被共享。

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

这迫使您考虑每个属性的作用域，防止意外地在实例之间共享该属性。

在 [作用域](/essential/plugin.html#scope) 中了解更多内容。

## 方法链
Elysia 的代码应始终使用 **方法链**。

由于 Elysia 的类型系统复杂，Elysia 中的每个方法都会返回一个新的类型引用。

**这很重要**，以确保类型完整性和推断。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // 存储是严格类型的 // [!code ++]
    .get('/', ({ store: { build } }) => build)
                        // ^?
    .listen(3000)
```

在上面的代码中，**state** 返回一个新的 **ElysiaInstance** 类型，添加了 `build` 类型。

### ❌ 不要：在没有方法链的情况下使用 Elysia
如果不使用方法链，Elysia 不会保存这些新类型，从而导致没有类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议 <u>**始终使用方法链**</u> 以提供准确的类型推断。

## 依赖
默认情况下，每个实例在应用于另一个实例时都会重新执行。

这可能导致同一方法被多次应用，但某些方法应仅调用一次，如 **生命周期** 或 **路由**。

为了防止生命周期方法重复，我们可以给实例添加 **唯一标识符**。

```ts twoslash
import { Elysia } from 'elysia'

const ip = new Elysia({ name: 'ip' })
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

这将通过使用唯一名称的去重来防止 `ip` 属性被多次调用。

一旦提供了 `name`，实例将变为 **单例**。允许 Elysia 应用插件去重。

这样我们可以多次重用同一实例，而不会影响性能。

这迫使您考虑每个实例的依赖关系，方便进行迁移或重构。

在 [插件去重](/essential/plugin.html#plugin-deduplication) 中了解更多内容。

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

如果您需要应用一个单独的函数，例如 MVC 的控制器模式，建议从内联函数中解构属性，以防止不必要的类型推断。

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

在 [最佳实践：MVC 控制器](/essential/best-practice.html#controller) 中了解更多内容。