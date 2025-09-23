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

<script setup>
import { Elysia } from 'elysia'
import Playground from './components/nearl/playground.vue'

const profile1 = new Elysia()
	.onBeforeHandle(({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const demo1 = new Elysia()
	.use(profile1)
	// This will NOT have sign in check
	.patch('/rename', () => 'Updated!')

const profile2 = new Elysia()
	.onBeforeHandle({ as: 'global' }, ({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const demo2 = new Elysia()
	.use(profile2)
	// This will NOT have sign in check
	.patch('/rename', ({ status }) => status(401))
</script>

# 关键概念 <Badge type="danger" text="必须阅读" />

Elysia 拥有一些非常重要的概念，您需要理解它们才能使用。

本页面涵盖了在开始使用之前您应该了解的大多数概念。

## 封装 <Badge type="danger" text="必须阅读" />
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

<!-- 在这里不要在 "profile" 和 "app" 前加 "the" - @Saltyaom -->
在这个例子中，`isSignIn` 检查仅应用在 `profile`，而不会应用在 `app`。

<Playground :elysia="demo1" />

> 试着在地址栏中改为访问 **/rename** 并查看结果

<br>

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

<Playground :elysia="demo2" />

将生命周期作用域设置为 **"global"** 将其导出到 **所有实例**。

更多内容请见 [scope](/essential/plugin.html#scope-level)。

<!--## 一切皆组件

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

这促使您将应用拆分为小部分，使添加或删除功能变得容易。

了解更多请见 [plugin](/essential/plugin.html)。-->

## 方法链 <Badge type="warning" text="重要" />
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

我们建议您<u>**始终使用方法链**</u>以便获得准确的类型推断。

## 依赖 <Badge type="danger" text="必须阅读" />
每个插件在应用到另一个实例时都会**每次执行**。

如果插件应用多次，会导致不必要的重复。

某些方法，比如**生命周期**或**路由**，只能被调用一次，这点很重要。

为避免此问题，Elysia 可以通过**唯一标识符**来去重生命周期。

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

### 服务定位器 <Badge type="warning" text="重要" />
当您将插件应用到实例时，该实例将获得类型安全。

但是如果您没有将插件应用于另一个实例，类型将无法推断。

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

Elysia 引入了**服务定位器**设计模式来解决这个问题。

只需提供插件引用，Elysia 就能找到该服务以增强类型安全。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// 没有 'setup' 时，类型会缺失
const error = new Elysia()
    .get('/', ({ a }) => a)

// 通过 `setup`，会正确推断类型
const child = new Elysia()
    .use(setup) // [!code ++]
    .get('/', ({ a }) => a)
    //           ^?



// ---cut-after---
console.log()
```

这相当于 TypeScript 的**类型导入**，这里导入类型而不实际引入运行时代码。

如前所述，Elysia 已经处理了去重，因此这不会带来性能开销或生命周期重复。

## 代码顺序 <Badge type="warning" text="重要" />

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

<br>
<br>
<br>

这使得 Elysia 能够自动推断并提供类型，减少了重复声明 schema 的需求。

单个 Elysia/TypeBox schema 可用于：
- 运行时验证
- 数据强制转换
- TypeScript 类型
- OpenAPI schema

这使我们能够将 schema 作为**单一可信源**。