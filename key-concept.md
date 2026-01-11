---
url: 'https://elysiajs.com/key-concept.md'
---

# 关键概念&#x20;

Elysia 拥有一些非常重要的概念，您需要理解它们才能使用。

本页面涵盖了在开始使用之前您应该了解的大多数概念。

## 封装&#x20;

Elysia 的生命周期方法仅**封装**在其自身实例内。

这意味着如果您创建了一个新的实例，它不会与其他实例共享生命周期方法。

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(({ cookie }) => {
		throwIfNotSignIn(cookie)
	})
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// ⚠️ 这里将不会有登录检查
	.patch('/rename', ({ body }) => updateProfile(body))
```

在这个例子中，`isSignIn` 检查仅应用在 `profile`，而不会应用在 `app`。

> 试着在地址栏中改为访问 **/rename** 并查看结果

**Elysia 默认会隔离生命周期**，除非明确说明。这类似于 JavaScript 中的 **export**，你需要导出函数才能让它在模块外可用。

若要将生命周期“导出”到其他实例，您必须指定作用域。

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
	// 这里将有登录检查
	.patch('/rename', ({ body }) => updateProfile(body))
```

将生命周期作用域设置为 **"global"** 将其导出到 **所有实例**。

更多内容请见 [scope](/essential/plugin.html#scope-level)。

## 方法链&#x20;

Elysia 代码应**始终**使用方法链。

这对**确保类型安全**非常重要。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // store 是严格类型 // [!code ++]
    .get('/', ({ store: { build } }) => build)
                        // ^?
    .listen(3000)
```

在上述代码中，**state** 返回一个新的 **ElysiaInstance** 类型，附带了类型化的 `build` 属性。

### 不使用方法链

因为 Elysia 的类型系统很复杂，Elysia 中的每个方法都会返回一个新的类型引用。

如果不使用方法链，Elysia 不会保存这些新类型，导致无法进行类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议您**始终使用方法链**以便获得准确的类型推断。

## 依赖&#x20;

Elysia 天然由多个微型的 Elysia 应用组成，这些实例可以像微服务一样**独立运行**并相互通信。

每个 Elysia 实例都是独立的，**并且可以作为独立服务器运行**。

当一个实例需要使用另一个实例的服务时，您**必须显式声明依赖**。

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
	// 需要使用 auth 来调用 Auth 的服务
	.use(auth) // [!code ++]
	.get('/profile', ({ Auth }) => Auth.getProfile())
//                                        ^?



// ---cut-after---
```

这类似于**依赖注入**，每个实例必须声明它自身的依赖。

这种方式强制您显式声明依赖，利于依赖跟踪和模块化。

### 去重&#x20;

默认情况下，每个插件在应用到另一个实例时都会**每次执行**。

为防止重复执行，Elysia 可以通过为实例添加**唯一标识符**，使用 `name` 以及可选的 `seed` 属性，来实现生命周期的去重。

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

为实例添加 `name` 属性会让它成为唯一标识符，从而防止重复调用。

更多内容请见 [插件去重](/essential/plugin.html#plugin-deduplication)。

### 全局依赖 vs 显式依赖

有些情况下使用全局依赖比显式依赖更合适。

**全局** 插件示例：

* **不添加类型的插件** —— 如 cors、compress、helmet
* 添加全局生命周期且无实例应控制的插件 —— 如 tracing, logging

示例用例：

* OpenAPI/Open - 全局文档
* OpenTelemetry - 全局追踪器
* Logging - 全局日志器

这种情况下，创建为全局依赖更有意义，而不是将它应用到每个实例。

然而，如果您的依赖不符合上述类别，则建议使用**显式依赖**。

**显式依赖** 示例：

* **添加类型的插件** —— 如 macro、state、model
* 添加业务逻辑且实例可交互的插件 —— 如 Auth、Database

示例用例：

* 状态管理 —— 如 Store、Session
* 数据建模 —— 如 ORM、ODM
* 业务逻辑 —— 如 Auth、Database
* 功能模块 —— 如 Chat、Notification

## 代码顺序&#x20;

Elysia 的生命周期代码顺序非常重要。

事件只会对注册之后的路由生效。

如果把 onError 放在插件之前，插件将不会继承该 onError 事件。

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

控制台应打印：

```bash
1
```

注意未打印 **2**，因为事件是在路由之后注册的，所以不会对该路由生效。

更多内容请见 [代码顺序](/essential/life-cycle.html#order-of-code)。

## 类型推断

Elysia 拥有复杂的类型系统，允许您从实例推断类型。

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

您应**始终使用内联函数**以获得准确的类型推断。

如果您需要使用独立函数，比如 MVC 控制器模式，建议从内联函数中解构所需属性，以避免不必要的类型推断，如下所示：

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

详见 [最佳实践：MVC 控制器](/essential/best-practice.html#controller)。

### TypeScript

我们可以通过访问 `static` 属性来获取每个 Elysia/TypeBox 类型的类型定义：

```ts twoslash
import { t } from 'elysia'

const MyType = t.Object({
	hello: t.Literal('Elysia')
})

type MyType = typeof MyType.static
//    ^?
```

这使得 Elysia 能够自动推断并提供类型，减少了重复声明 schema 的需求。

单个 Elysia/TypeBox schema 可用于：

* 运行时验证
* 数据强制转换
* TypeScript 类型
* OpenAPI schema

这使我们能够将 schema 作为**单一可信源**。
