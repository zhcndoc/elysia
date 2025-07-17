---
title: 结构 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 结构 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 是一个无模式框架，我们将决定权留给您和您的团队来选择编码模式。然而，我们发现有很多人在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现很难解耦和处理类型。此页面是使用 Elysia 与 MVC 模式的指南。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个无模式框架，我们将决定权留给您和您的团队来选择编码模式。然而，我们发现有很多人在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现很难解耦和处理类型。此页面是使用 Elysia 与 MVC 模式的指南。
---

#### 此页面已移至 [最佳实践](/essential/best-practice)

# 结构

Elysia 是一个无模式框架，决定使用哪种编码模式由您和您的团队决定。

然而，尝试将 MVC 模式 [(模型-视图-控制器)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 与 Elysia 适配时，有几点需要关注，发现很难解耦和处理类型。

此页面是关于如何遵循 Elysia 结构最佳实践与 MVC 模式结合的指南，但可以适应您喜欢的任何编码模式。

## 方法链
Elysia 代码应始终使用 **方法链**。

由于 Elysia 的类型系统复杂，Elysia 中的每个方法都返回一个新的类型引用。

**这点很重要**，以确保类型的完整性和推断。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store 是严格类型的 // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```

在上面的代码中 **state** 返回一个新的 **ElysiaInstance** 类型，添加了一个 `build` 类型。

### ❌ 不要：不使用方法链
如果不使用方法链，Elysia 就无法保存这些新类型，从而导致没有类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议 <u>**始终使用方法链**</u> 以提供准确的类型推断。

## 控制器
> 1 个 Elysia 实例 = 1 个控制器

Elysia 确保类型完整性做了很多工作，如果您将整个 `Context` 类型传递给控制器，这可能会产生以下问题：

1. Elysia 类型复杂且严重依赖插件和多级链式调用。
2. 难以类型化，Elysia 类型可能随时改变，特别是在使用装饰器和存储时。
3. 类型转换可能导致类型完整性的丧失或无法确保类型与运行时代码之间的一致性。
4. 这使得 [Sucrose](/blog/elysia-10#sucrose) *(Elysia的“类似”编译器)* 更难以对您的代码进行静态分析。

### ❌ 不要：创建单独的控制器
不要创建单独的控制器，而是使用 Elysia 自身作为控制器：
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

将整个 `Controller.method` 传递给 Elysia 相当于拥有两个控制器在数据之间来回传递。这违背了框架和 MVC 模式本身的设计。

### ✅ 要：将 Elysia 作为控制器使用
相反，将 Elysia 实例视为控制器本身。
```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

## 服务
服务是一组实用程序/辅助函数，解耦为在模块/控制器中使用的业务逻辑，在我们的例子中就是 Elysia 实例。

任何可以从控制器中解耦的技术逻辑都可以放在 **Service** 中。

Elysia 中有两种类型的服务：
1. 非请求依赖服务
2. 请求依赖服务

### ✅ 要：非请求依赖服务
这种服务不需要访问请求或 `Context` 的任何属性，可以像通常的 MVC 服务模式一样作为静态类进行初始化。

```typescript
import { Elysia, t } from 'elysia'

abstract class Service {
    static fibo(number: number): number {
        if (number < 2)
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

### 请求依赖服务
这种服务可能需要请求中的一些属性，应该 **作为 Elysia 实例进行初始化**。

### ❌ 不要：将整个 `Context` 传递给服务
**Context 是高度动态的类型**，可以从 Elysia 实例推断。

不要将整个 `Context` 传递给服务，而是使用对象解构提取所需内容并将其传递给服务。
```typescript
import type { Context } from 'elysia'

class AuthService {
    constructor() {}

    // ❌ 不要这样做
    isSignIn({ status, cookie: { session } }: Context) {
        if (session.value)
            return status(401)
    }
}
```

由于 Elysia 类型复杂且严重依赖插件和多级链式调用，手动进行类型化可能会很具挑战性，因为它高度动态。

### ✅ 建议做法：将依赖服务请求抽象为Elysia实例

我们建议将服务类抽象化，远离 Elysia。

然而，**如果服务是请求依赖服务**或需要处理 HTTP 请求，我们建议将其抽象为 Elysia 实例，以确保类型的完整性和推断：

```typescript
import { Elysia } from 'elysia'

// ✅ 要
const AuthService = new Elysia({ name: 'Service.Auth' })
    .derive({ as: 'scoped' }, ({ cookie: { session } }) => ({
    	// 这相当于依赖注入
        Auth: {
            user: session.value
        }
    }))
    .macro(({ onBeforeHandle }) => ({
     	// 这声明了一个服务方法
        isSignIn(value: boolean) {
            onBeforeHandle(({ Auth, status }) => {
                if (!Auth?.user || !Auth.user) return status(401)
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
Elysia 默认处理 [插件去重](/essential/plugin.html#plugin-deduplication)，您无需担心性能，因为如果您指定了 **"name"** 属性，它将成为单例。
:::

### ⚠️ 从 Elysia 实例中推断 Context

如果**绝对必要**，您可以从 Elysia 实例本身推断 `Context` 类型：
```typescript
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

class AuthService {
    constructor() {}

	// ✅ 要
	isSignIn({ status, cookie: { session } }: InferContext<typeof setup>) {
		if (session.value)
			return status(401)
	}
}
```

然而，我们建议尽可能避免这样做，而是使用 [Elysia 作为服务](✅-do-use-elysia-instance-as-a-service)。

您可以在 [Essential: Handler](/essential/handler) 中了解更多关于 [InferContext](/essential/handler#infercontext) 的信息。

## 模型
模型或 [DTO (数据传输对象)](https://en.wikipedia.org/wiki/Data_transfer_object) 通过 [Elysia.t (验证)](/validation/overview.html#data-validation) 来处理。

Elysia 内置了验证系统，可以从您的代码中推断类型并在运行时进行验证。

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

### ✅ 要：使用 Elysia 的验证系统

不要声明类或接口，而是使用 Elysia 的验证系统来定义模型：
```typescript twoslash
// ✅ 要
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// 如果您想获取模型的类型可以选择性地
// 通常如果我们不使用类型，因为它已由 Elysia 推断
type CustomBody = typeof customBody.static
    // ^?



export { customBody }
```

我们可以通过与 `.static` 属性结合使用 `typeof` 来获取模型的类型。

然后您可以使用 `CustomBody` 类型来推断请求体的类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})
// ---cut---
// ✅ 要
new Elysia()
	.post('/login', ({ body }) => {
	                 // ^?
		return body
	}, {
		body: customBody
	})
```

### ❌ 不要：将类型与模型分开声明
不要将类型与模型分开声明，而是使用 `typeof` 和 `.static` 属性来获取模型的类型。

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

// ✅ 要
const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type customBody = typeof customBody.static
```

### 分组
您可以将多个模型分组为一个单独的对象，以使其更加有序。

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
虽然这不是必需的，如果您严格遵循 MVC 模式，您可能想像服务一样将模型注入到控制器中。我们推荐使用 [Elysia 参考模型](/essential/validation.html#reference-model)

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

这个方法提供了几个好处：
1. 允许我们命名模型并提供自动完成。
2. 为以后的使用修改模式，或执行 [重新映射](/patterns/remapping.html#remapping)。
3. 在 OpenAPI 合规客户端中显示为“模型”，例如 Swagger。
4. 提升 TypeScript 推断速度，因为模型类型在注册期间会被缓存。

---

如前所述，Elysia 是一个无模式框架，我们仅提供关于如何将 Elysia 与 MVC 模式结合的推荐指南。

是否遵循此推荐完全取决于您和您的团队的偏好和共识。