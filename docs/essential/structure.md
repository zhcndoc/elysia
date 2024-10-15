---
title: 结构 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 结构 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia是一个无特定模式的框架，我们将编码模式的选择交给您和您的团队。然而，我们发现许多人在Elysia上使用MVC模式（模型-视图-控制器），并且发现拆解和处理类型很困难。本页面是关于如何使用Elysia与MVC模式的指南。

    - - meta
      - property: 'og:description'
        content: Elysia是一个无特定模式的框架，我们将编码模式的选择交给您和您的团队。然而，我们发现许多人在Elysia上使用MVC模式（模型-视图-控制器），并且发现拆解和处理类型很困难。本页面是关于如何使用Elysia与MVC模式的指南。
---

# 结构

Elysia是一个无特定模式的框架，编码模式的选择由您和您的团队决定。

然而，将MVC模式[(模型-视图-控制器)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)与Elysia结合使用时，存在几个问题，我们发现很难拆分和处理类型。

本页面是关于如何遵循Elysia结构最佳实践与MVC模式结合的指南，但可以根据您的喜好调整以适应任何编码模式。

## 方法链
Elysia代码应该始终使用**方法链**。

由于Elysia的类型系统复杂，每个方法都会返回一个新的类型引用。

**这很重要**，以确保类型的完整性和推断。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store是严格类型的 // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```

在上面的代码中，**state**返回一个新的**ElysiaInstance**类型，添加了一个`build`类型。

### ❌ 不要：不使用方法链
如果不使用方法链，Elysia不会保存这些新类型，导致没有类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议<u>**始终使用方法链**</u>以提供准确的类型推断。

## 控制器
> 1个Elysia实例 = 1个控制器

Elysia在确保类型完整性方面做了很多工作，如果您将整个`Context`类型传递给控制器，可能会遇到以下问题：

1. Elysia的类型复杂，严重依赖插件和多级链式调用。
2. 难以类型化，Elysia的类型可能随时变化，尤其是在使用装饰器和存储时。
3. 类型转换可能导致类型完整性丢失或者无法确保类型与运行时代码之间的一致性。
4. 这使得[Sucrose](/blog/elysia-10#sucrose) *(Elysia的一种编译器)*更难对您的代码进行静态分析。

### ❌ 不要：创建单独的控制器
不要创建单独的控制器，而是直接使用Elysia作为控制器：
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

将整个`Controller.method`传递给Elysia等同于有两个控制器在数据之间来回传递。这违背了框架的设计和MVC模式本身。

### ✅ 要：使用Elysia作为控制器
相反，将Elysia实例视为控制器本身。
```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

## 服务
服务是一组与业务逻辑解耦的实用程序/辅助函数，用于在模块/控制器中使用，在我们的案例中，是一个Elysia实例。

任何可以与控制器解耦的技术逻辑都可以放在**Service**中。

Elysia中有两种类型的服务：
1. 非请求依赖的服务
2. 请求依赖的服务

### ✅ 要：非请求依赖的服务
这种服务不需要访问请求或`Context`中的任何属性，可以像通常的MVC服务模式一样作为静态类进行初始化。

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

如果您的服务不需要存储属性，您可以使用`abstract class`和`static`来避免分配类实例。

### 请求依赖的服务
这种服务可能需要请求中的某些属性，并且应该**作为Elysia实例进行初始化**。

### ❌ 不要：将整个`Context`传递给服务
**Context是一个高度动态的类型**，可以从Elysia实例推断出来。

不要将整个`Context`传递给服务，而是使用对象解构提取您所需的内容，并将其传递给服务。
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

由于Elysia类型复杂，并且严重依赖插件和多级链式调用，因此手动类型化可能会很有挑战性，因为它高度动态。

### ✅ 要：使用Elysia实例作为服务

我们建议使用Elysia实例作为服务，以确保类型完整性和推断：
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
Elysia默认处理[插件去重](/essential/plugin.html#plugin-deduplication)，因此您不必担心性能问题，因为如果您指定了**“name”**属性，它将成为单例。
:::

### ⚠️ 从Elysia实例推断Context

在**绝对必要**的情况下，您可以从Elysia实例本身推断`Context`类型：
```typescript
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
    .state('a', 'a')
    .decorate('b', 'b')

class AuthService {
    constructor() {}

    // ✅ 要
    isSignIn({ cookie: { session } }: InferContext<typeof setup>) {
        if (session.value)
            return error(401)
    }
}
```

但我们建议尽可能避免这样做，使用[将Elysia作为服务](✅-do-use-elysia-instance-as-a-service)的方法。

您可以在[Essential: Handler](/essential/handler)中找到有关[InferContext]的更多信息。

## 模型
模型或[DTO (数据传输对象)](https://en.wikipedia.org/wiki/Data_transfer_object)由[Elysia.t (验证)](/validation/overview.html#data-validation)处理。

Elysia内置了验证系统，可以从您的代码中推断类型并在运行时验证它。

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

### ✅ 要：使用Elysia的验证系统

使用Elysia的验证系统定义模型，而不是声明类或接口：
```typescript twoslash
// ✅ 要
import { Elysia, t } from 'elysia'

const customBody = t.Object({
    username: t.String(),
    password: t.String()
})

// 可选，如果您想获取模型的类型
// 通常如果我们不使用类型，它已经通过Elysia推断
type CustomBody = typeof customBody.static
    // ^?



export { customBody }
```

我们可以使用`typeof`和模型的`.static`属性获取模型的类型。

然后您可以使用`CustomBody`类型来推断请求体的类型。

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
不要将类型与模型分开声明，而是使用`typeof`和`.static`属性获取模型的类型。

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

### 组
您可以将多个模型组合成一个对象，以使其更有组织。

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
虽然这是可选的，如果您严格遵循MVC模式，您可能希望像将服务注入控制器一样注入模型。我们建议使用[Elysia引用模型](/validation/reference-model.html#reference-model)。

使用Elysia的模型引用
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

这种方法提供了几种好处：
1. 允许我们命名模型并提供自动完成。
2. 为后续使用修改模式或执行[重映射](/patterns/remapping.html#remapping)。
3. 在OpenAPI合规客户端中显示为“模型”，例如Swagger。
4. 改善TypeScript推断速度，因为模型类型将在注册期间被缓存。

---

如前所述，Elysia是一个无特定模式的框架，我们仅提供处理Elysia与MVC模式的推荐指南。

是否遵循这一建议完全取决于您和您的团队，根据您的偏好和共识来决定。
