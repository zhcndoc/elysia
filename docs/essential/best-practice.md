---
title: 最佳实践 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 最佳实践 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 是一个与模式无关的框架，我们将决定采用何种编码模式的权力交给您和您的团队。然而，我们发现有一些团队在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现很难解耦和处理类型。本页面为使用 Elysia 的 MVC 模式指南。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个与模式无关的框架，我们将决定采用何种编码模式的权力交给您和您的团队。然而，我们发现有一些团队在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现很难解耦和处理类型。本页面为使用 Elysia 的 MVC 模式指南。
---

# 最佳实践

Elysia 是一个与模式无关的框架，选择何种编码模式由您和您的团队决定。

然而，在尝试将 MVC 模式 [(Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 适配到 Elysia 时，我们发现很难解耦和处理类型。

本页面是结合 MVC 模式与 Elysia 结构最佳实践的指南，但可以适配到您喜欢的任何编码模式。

## 方法链
Elysia 代码应始终使用 **方法链**。

由于 Elysia 的类型系统复杂，Elysia 的每个方法都返回一个新的类型引用。

**这很重要**，以确保类型完整性和推断。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // 存储是严格类型化的 // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```

在上述代码中，**state** 返回一个新的 **ElysiaInstance** 类型，添加了一个 `build` 类型。

### ❌ 不要：不使用方法链来使用 Elysia
如果不使用方法链，Elysia 不保存这些新类型，导致没有类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议 <u>**始终使用方法链**</u> 来提供准确的类型推断。

## 控制器
> 1 Elysia 实例 = 1 控制器

Elysia 做了很多以确保类型完整性，如果您将整个 `Context` 类型传递给控制器，可能会出现以下问题：

1. Elysia 类型复杂，并且严重依赖插件和多级链。
2. 难以类型化，Elysia 类型可能随时改变，尤其是在装饰器和存储中。
3. 类型转换可能导致类型完整性丧失或无法确保类型与运行时代码之间的一致性。
4. 这使得 [Sucrose](/blog/elysia-10#sucrose) *(Elysia 的 “编译器”)* 更难静态分析您的代码。

### ❌ 不要：创建一个单独的控制器
不要创建一个单独的控制器，使用 Elysia 本身作为控制器：
```typescript
import { Elysia, t, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context) {
        return Service.doStuff(context.stuff)
    }
}

// ❌ 不要
new Elysia()
    .get('/', Controller.hi)
```

将整个 `Controller.method` 传递给 Elysia 等同于有两个控制器传递数据，这违背了框架的设计和 MVC 模式本身。

### ✅ 做：将 Elysia 作为控制器使用
代之以将 Elysia 实例本身视为控制器。
```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

### 测试
您可以使用 `handle` 测试您的控制器直接调用函数（及其生命周期）

```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

import { describe, it, should } from 'bun:test'

const app = new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)

        return 'ok'
    })

describe('控制器', () => {
	it('应该工作', async () => {
		const response = await app
			.handle(new Request('http://localhost/'))
			.then((x) => x.text())

		expect(response).toBe('ok')
	})
})
```

您可以在 [单元测试](/patterns/unit-test.html) 中找到更多关于测试的信息。

## 服务
服务是一组实用/辅助功能，作为业务逻辑解耦以用于模块/控制器，在我们的案例中，是一个 Elysia 实例。

任何可以从控制器中解耦的技术逻辑都可以存在于一个 **服务** 中。

Elysia 中有两种类型的服务：
1. 非请求依赖的服务
2. 请求依赖的服务

### ✅ 做：非请求依赖的服务
这种服务不需要访问请求或 `Context` 的任何属性，可以像通常的 MVC 服务模式一样启动为静态类。

```typescript
import { Elysia, t } from 'elysia'

abstract class Service {
    static fibo(number: number): number {
        if(number < 2)
            return number

        return Service.fibo(number - 1) + Service.fibo(number - 2)
    }
}

new Elysia()
    .get('/fibo', ({ body }) => {
        return Service.fibo(body)
    }, {
        body: t.Numeric()
    })
```

如果您的服务不需要存储属性，可以使用 `abstract class` 和 `static` 来避免分配类实例。

### 请求依赖的服务
这种服务可能需要请求中的某些属性，应该 **作为 Elysia 实例启动**。

### ❌ 不要：将整个 `Context` 传递给服务
**Context 是一个高度动态的类型**，可以从 Elysia 实例推断出。

不要将整个 `Context` 传递给服务，而是使用对象解构提取所需的内容并传递给服务。
```typescript
import type { Context } from 'elysia'

class AuthService {
	constructor() {}

	// ❌ 不要这样做
	isSignIn({ cookie: { session } }: Context) {
		if (session.value)
			return error(401)
	}
}
```

由于 Elysia 类型复杂，并且严重依赖插件和多级链，因此手动类型化具有挑战性，因为它是高度动态的。

### ✅ 做：将 Elysia 实例作为服务使用

我们推荐使用 Elysia 实例作为服务，以确保类型完整性和推断：
```typescript
import { Elysia } from 'elysia'

// ✅ 做
const AuthService = new Elysia({ name: 'Service.Auth' })
    .derive({ as: 'scoped' }, ({ cookie: { session } }) => ({
    	// 这相当于依赖注入
        Auth: {
            user: session.value
        }
    }))
    .macro(({ onBeforeHandle }) => ({
     	// 这是声明一个服务方法
        isSignIn(value: boolean) {
            onBeforeHandle(({ Auth, error }) => {
                if (!Auth?.user || !Auth.user) return error(401)
            })
        }
    }))

const UserController = new Elysia()
    .use(AuthService)
    .get('/profile', ({ Auth: { user } }) => user, {
    	isSignIn: true
    })
```

::: tip
Elysia 默认处理 [插件去重](/essential/plugin.html#plugin-deduplication)，因此无需担心性能，因为如果指定了 **"name"** 属性，它将成为单例。
:::

### ⚠️ 从 Elysia 实例推断 Context

在 **绝对必要** 的情况下，您可以从 Elysia 实例本身推断出 `Context` 类型：
```typescript
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

class AuthService {
	constructor() {}

	// ✅ 做
	isSignIn({ cookie: { session } }: InferContext<typeof setup>) {
		if (session.value)
			return error(401)
	}
}
```

然而，我们建议尽可能避免这种情况，并使用 [Elysia 作为服务](✅-do-use-elysia-instance-as-a-service) 代替。

您可以在 [基础：处理程序](/essential/handler) 中找到更多关于 [InferContext](/essential/handler#infercontext) 的信息。

## 模型
模型或 [DTO（数据传输对象）](https://en.wikipedia.org/wiki/Data_transfer_object) 由 [Elysia.t (验证)](/validation/overview.html#data-validation) 处理。

Elysia 有一个内置的验证系统，可以从您的代码中推断类型并在运行时验证它。

### ❌ 不要：将类实例声明为模型

不要将类实例声明为模型：
```typescript
// ❌ 不要
class CustomBody {
	username: string
	password: string

	constructor(username: string, password: string) {
		this.username = username
		this.password = password
	}
}

// ❌ 不要
interface ICustomBody {
	username: string
	password: string
}
```

### ✅ 做：使用 Elysia 的验证系统

而不是声明类或接口，使用 Elysia 的验证系统来定义模型：
```typescript twoslash
// ✅ 做
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// 如果您想获取模型的类型，这是可选的
// 通常如果我们没有使用该类型，因为它已被 Elysia 推断
type CustomBody = typeof customBody.static
    // ^?



export { customBody }
```

我们可以通过使用 `typeof` 和 `.static` 属性从模型中获取类型。

然后您可以使用 `CustomBody` 类型推断请求体的类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})
// ---cut---
// ✅ 做
new Elysia()
	.post('/login', ({ body }) => {
	                 // ^?
		return body
	}, {
		body: customBody
	})
```

### ❌ 不要：将类型与模型分开声明
不要将类型与模型分开声明，而是使用 `typeof` 和 `.static` 属性获取模型的类型。

```typescript
// ❌ 不要
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = {
	username: string
	password: string
}

// ✅ 做
const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type customBody = typeof customBody.static
```

### 分组
您可以将多个模型分组到一个对象中，以便更有条理。

```typescript
import { Elysia, t } from 'elysia'

export const AuthModel = {
	sign: t.Object({
		username: t.String(),
		password: t.String()
	})
}

const models = AuthModel.models
```

### 模型注入
虽然这是可选的，但如果您严格遵循 MVC 模式，您可能想像服务一样将模型注入到控制器中。我们推荐使用 [Elysia 引用模型](/validation/reference-model.html#reference-model)。

使用 Elysia 的模型引用
```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

const AuthModel = new Elysia()
    .model({
        'auth.sign': customBody
    })

const models = AuthModel.models

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .post('/sign-in', async ({ body, cookie: { session } }) => {
                             // ^?

        return true
    }, {
        body: 'auth.sign'
    })
```

这种方法提供了几个好处：
1. 允许我们为模型命名并提供自动补全。
2. 为以后使用修改模式，或执行 [重新映射](/patterns/remapping.html#remapping)。
3. 作为 OpenAPI 合规客户端中的 “模型” 出现，如 Swagger。
4. 改善 TypeScript 推断速度，因为模型类型将在注册时缓存。

## 重用插件

多次重用插件以提供类型推断是可以的。

Elysia 默认自动处理插件去重，性能影响可以忽略不计。

要创建一个唯一的插件，您可以为 Elysia 实例提供一个 **name** 或可选的 **seed**。

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'my-plugin' })
	.decorate("type", "plugin")

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

这允许 Elysia 通过重用已注册的插件来提高性能，而不是重复处理插件。
