---
title: 结构
head:
    - - meta
      - property: 'og:title'
        content: 结构 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Elysia 是一个无模式偏见的框架，我们将决策权交给您和您的团队来选择使用的编码模式。然而，我们发现有一些人在 Elysia 上使用 MVC 模式（模型-视图-控制器），发现解耦和处理类型很困难。本页是一个使用 MVC 模式的 Elysia 的指南。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个无模式偏见的框架，我们将决策权交给您和您的团队来选择使用的编码模式。然而，我们发现有一些人在 Elysia 上使用 MVC 模式（模型-视图-控制器），发现解耦和处理类型很困难。本页是一个使用 MVC 模式的 Elysia 的指南。
---

# 结构

Elysia 是一个无模式偏见的框架，我们将决策权交给您和您的团队来选择使用的编码模式。

然而，在尝试将 MVC 模式[（模型-视图-控制器）](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)与 Elysia 结合使用时，遇到了一些问题，很难解耦和处理类型。

本页是一个指南，介绍如何按照最佳实践结合 MVC 模式使用 Elysia，但也可以适应任何您喜欢的编码模式。

## 方法链
Elysia 代码应始终使用**方法链**。

由于 Elysia 类型系统复杂，Elysia 中的每个方法都返回一个新的类型引用。

**这很重要**，以确保类型完整性和推断。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store is strictly typed // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```

在上面的代码中，**state** 返回一个新的 **ElysiaInstance** 类型，添加了一个 `build` 类型。

## ❌ 不要：不使用方法链
如果不使用方法链，Elysia 就不会保存这些新类型，导致没有类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议<u>**始终使用方法链**</u>来提供准确的类型推断。

## 控制器
> 1 个 Elysia 实例 = 1 个控制器

Elysia 会做很多事情来确保类型完整性，如果将整个 `Context` 类型传递给控制器，可能会遇到以下问题：

1. Elysia 类型复杂，且严重依赖于插件和多级链式调用。
2. 很难为其进行类型编写，Elysia 类型可能随时发生变化，特别是使用装饰器和存储。
3. 类型转换可能导致类型完整性损失或无法确保类型和运行时代码之间的一致性。
4. 这使得 [Sucrose](/blog/elysia-10#sucrose) 更难以静态分析您的代码（Elysia 的“类似”编译器）。

### ❌ 不要：创建一个单独的控制器
不要创建一个单独的控制器，而是直接使用 Elysia 本身作为控制器：
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

将整个 `Controller.method` 传递给 Elysia 相当于在两个控制器之间传递数据。这违反了框架和 MVC 模式本身的设计。

### ✅ 应该：将 Elysia 作为控制器使用
将 Elysia 实例视为控制器本身：
```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

## 服务
服务是一组作为业务逻辑解耦的实用/辅助函数，我们在这里指的是 Elysia 实例中的模块/控制器中使用的服务。

任何可以从控制器解耦的技术逻辑都可以作为一个**服务**。

Elysia 中有两种类型的服务：
1. 无请求依赖的服务
2. 有请求依赖的服务

### ✅ 应该：无请求依赖的服务
这种类型的服务不需要访问请求或 `Context` 的任何属性，可以像通常的 MVC 服务模式一样作为静态类初始化。

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

如果您的服务不需要存储属性，您可以使用 `abstract class` 和 `static` 来避免分配类实例。

### 有请求依赖的服务
这种类型的服务可能需要一些来自请求的属性，并且应**作为 Elysia 实例初始化**。

### ❌ 不要：将整个 `Context` 传递给服务
**Context 是一个高度动态的类型**，可以从 Elysia 实例中推断出来。

不要将整个 `Context` 传递给服务，而是使用对象解构提取您所需的内容并将其传递给服务。
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

由于 Elysia 类型复杂，并且严重依赖于插件和多级链式调用，手动编写类型可能会很困难。

### ✅ 应该：使用 Elysia 实例作为服务

我们建议使用 Elysia 实例作为服务，以确保类型完整性和推断：
```typescript
import { Elysia } from 'elysia'

// ✅ 这样做
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
Elysia 默认处理[插件去重](/essential/plugin.html#插件去重)，因此您无需担心性能问题，因为如果指定了 **"name"** 属性，它将成为单例。
:::

### ⚠️ 根据 Elysia 实例推断 Context

如果绝对必要，您可以从 Elysia 实例本身推断出 `Context` 类型：
```typescript
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

class AuthService {
	constructor() {}

	// ✅ 这样做
	isSignIn({ cookie: { session } }: InferContext<typeof setup>) {
		if (session.value)
			return error(401)
	}
}
```

然而，我们建议避免这样做，而是使用[Elysia 作为服务](#✅-应该：将-Elysia-作为服务使用)。

您可以在[Essential: Handler](/essential/handler) 中了解有关 [InferContext](/essential/handler#infercontext) 的更多信息。

## 模型
模型或 [DTO (数据传输对象)](https://en.wikipedia.org/wiki/Data_transfer_object) 是由 [Elysia.t（验证）](/validation/overview.html#data-validation) 处理的。

Elysia 内置了一个验证系统，可以根据您的代码推断类型并在运行时验证它们。

### ❌ 不要：将类实例声明为模型

不要将类实例声明为模型：
```typescript
// ❌ 不要这样做
class CustomBody {
	username: string
	password: string

	constructor(username: string, password: string) {
		this.username = username
		this.password = password
	}
}

// ❌ 不要这样做
interface ICustomBody {
	username: string
	password: string
}
```

### ✅ 应该：使用 Elysia 的验证系统

而不是声明类或接口，使用 Elysia 的验证系统来定义模型：
```typescript twoslash
// ✅ 这样做
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// Optional if you want to get the type of the model
// Usually if we didn't use the type, as it's already inferred by Elysia
type CustomBody = typeof customBody.static
    // ^?



export { customBody }
```

我们可以通过使用 `typeof` 和模型的 `.static` 属性来获取模型的类型。

然后，您可以使用 `CustomBody` 类型来推断请求体的类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})
// ---cut---
// ✅ 这样做
new Elysia()
	.post('/login', ({ body }) => {
	                 // ^?
		return body
	}, {
		body: customBody
	})
```

### ❌ 不要：将类型与模型分开声明
不要单独声明类型，而是使用 `typeof` 与 `.static` 属性来获取模型的类型。

```typescript
// ❌ 不要这样做
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = {
	username: string
	password: string
}

// ✅ 这样做
const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type customBody = typeof customBody.static
```

### 分组
您可以将多个模型组合成一个对象，使其更加有组织。

```typescript
import { Elysia, t } from 'elysia'

export const AuthModel = {
	sign: t.Object({
		username: t.String(),
		password: t.String()
	})
}
```

### 模型注入
尽管这是可选的，如果您严格遵循 MVC 模式，您可能希望像服务一样将其注入到控制器中。我们推荐使用 [Elysia 引用模型](/validation/reference-model.html#reference-model)

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
1. 允许我们给模型命名并提供自动补全。
2. 修改模式供以后使用，或执行[重映射](/patterns/remapping.html#remapping)。
3. 在 OpenAPI 兼容的客户端中显示为“模型”，例如 Swagger。
4. 提高 TypeScript 推断速度，因为模型类型将在注册过程中缓存。

---

正如上面所提到的，Elysia 是一个无模式偏见的框架，并且我们只为使用 MVC 模式处理 Elysia 提供了一些建议。

根据您的偏好和协议，是否遵循此建议完全由您和您的团队决定。
