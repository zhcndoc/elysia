---
title: MVC 模式
head:
    - - meta
      - property: 'og:title'
        content: MVC 模式 - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: Elysia 是一个无模式的框架，我们将编码模式的决定权交给你和你的团队。然而，我们发现有一些人在 Elysia 上使用 MVC 模式，并发现它很难解耦并处理类型。本页面是使用 MVC 模式使用 Elysia 的指南。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个无模式的框架，我们将编码模式的决定权交给你和你的团队。然而，我们发现有一些人在 Elysia 上使用 MVC 模式，并发现它很难解耦并处理类型。本页面是使用 MVC 模式使用 Elysia 的指南。
---

# MVC 模式

Elysia 是一个无模式的框架，我们将编码模式的决定权交给你和你的团队。

然而，我们发现有一些人在 Elysia 上使用 MVC 模式（[模型-视图-控制器](https://zh.wikipedia.org/wiki/模型-视图-控制器)），并发现它很难解耦并处理类型。

本页面是使用 MVC 模式使用 Elysia 的指南。

## 控制器

1 个 Elysia 实例 = 1 个控制器。

**请勿**创建单独的控制器，而是直接使用 Elysia 本身作为控制器。

```typescript twoslash
const Controller = {
    hi(context: any) {}
}

const Service = {
    do1(v?: string) {},
    do2(v?: string) {}
}
// ---cut---
import { Elysia } from 'elysia'
 
// ❌ 不要这样做：
new Elysia()
    .get('/', Controller.hi)

// ✅ 这样做：
new Elysia()
    // 获取所需内容
    .get('/', ({ query: { name } }) => {
        Service.do1(name)
        Service.do2(name)
    })
```

Elysia 在确保类型完整性方面做了很多工作，如果将整个 Context 类型传递给控制器，可能会出现以下问题：
1. Elysia 类型复杂，且严重依赖插件和多级链接。
2. 难以进行类型推断，Elysia 类型可能随时更改，特别是使用装饰器和存储器时。
3. 类型转换可能导致类型完整性丢失或无法确保类型和运行时代码。
4. 对于 [Sucrose](/blog/elysia-10#sucrose)（Elysia 的“类似”编译器），更难进行静态分析你的代码

我们建议使用对象解构将所需内容提取出来，并传递给 **"Service"**。

将整个 `Controller.method` 传递给 Elysia 相当于有 2 个控制器之间相互传递数据。这与框架和 MVC 模式的设计相违背。

```typescript twoslash
const Service = {
    doStuff(stuff?: string) {
        return stuff
    }
}
// ---cut---
// ❌ 不要这样做：
import { Elysia, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context<any, any>) {
        return Service.doStuff(context.stuff)
    }
}

new Elysia()
    .get('/', Controller.root)
```

以下是在 NestJS 中执行类似操作的示例。

```typescript
// ❌ 不要这样做：
abstract class InternalController {
    static root(res: Response) {
        return Service.doStuff(res.stuff)
    }
}

@Controller()
export class AppController {
    constructor(private appService: AppService) {}

    @Get()
    root(@Res() res: Response) {
        return InternalController.root(res)
    }
}
```

相反，将 Elysia 实例视为控制器本身。

```typescript twoslash
// @filename: service.ts
import { Elysia } from 'elysia'

export const HiService = new Elysia()
    .decorate({
        stuff: 'a',
        Hi: {
            doStuff(stuff: string) {
                return stuff
            }
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { HiService } from './service'

// ✅ 这样做：
new Elysia()
    .use(HiService)
    .get('/', ({ Hi, stuff }) => {
        Hi.doStuff(stuff)
    })
```

如果你想调用或对控制器执行单元测试，请使用 [Elysia.handle](/essential/route.html#handle)。

```typescript twoslash
// @filename: service.ts
import { Elysia } from 'elysia'

export const HiService = new Elysia()
    .decorate({
        stuff: 'a',
        Hi: {
            doStuff(stuff: string) {
                return stuff
            }
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { HiService } from './service'

const app = new Elysia()
    .use(HiService)
    .get('/', ({ Hi, stuff }) => {
        Hi.doStuff(stuff)
    })

app.handle(new Request('http://localhost/'))
    .then(console.log)
```

或者更好的是，使用 [Eden](/eden/treaty/unit-test.html) 进行端到端类型安全的单元测试。

```typescript twoslash
// @filename: service.ts
import { Elysia } from 'elysia'

export const HiService = new Elysia()
    .decorate({
        stuff: 'a',
        Hi: {
            doStuff(stuff: string) {
                return stuff
            }
        }
    })

// @filename: index.ts
// ---cut---

import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

import { HiService } from './service'

const AController = new Elysia()
    .use(HiService)
    .get('/', ({ Hi, stuff }) => Hi.doStuff(stuff))

const controller = treaty(AController)
const { data, error } = await controller.index.get()
```

## 服务

Service 是每个模块的一组实用程序/辅助函数，在我们的案例中是 Elysia 实例。

可以将可以与控制器解耦的任何逻辑放在 **Service** 中。

```typescript twoslash
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

如果你的 Service 不需要存储属性，可以使用 `abstract class` 和 `static` 来避免分配类实例。

但是，如果你的 Service 涉及本地变异，例如缓存，你可能需要初始化一个实例。

```typescript twoslash
import { Elysia, t } from 'elysia'

class Service {
    public cache = new Map<number, number>()

    fibo(number: number): number {
        if(number < 2)
            return number

        if(this.cache.has(number))
            return this.cache.get(number)!

        const a = this.fibo(number - 1)
        const b = this.fibo(number - 2)

        this.cache.set(number - 1, a)
        this.cache.set(number - 2, b)

        return a + b
    }
}

new Elysia()
    .decorate({
        Service: new Service()
    })
    .get('/fibo', ({ Service, body }) => {
        return Service.fibo(body)
    }, {
        body: t.Numeric()
    })
```

你可以使用 [Elysia.decorate](/essential/context#decorate) 将类实例嵌入到 Elysia 中，是否这样做取决于你的情况。

使用 [Elysia.decorate](/essential/context#decorate) 相当于在 NestJS 中使用**依赖注入**：

```typescript
// 使用依赖注入
@Controller()
export class AppController {
    constructor(service: Service) {}
}

// 使用与依赖项分开的实例
const service = new Service()

@Controller()
export class AppController {
    constructor() {}
}
```

### 请求相关的 Service

如果你的 Service 将在多个实例中使用，或者可能需要一些来自请求的属性。我们建议创建一个专用的 Elysia 实例作为 **Service**。

Elysia 默认处理[插件去重](/essential/plugin.html#plugin-deduplication)，因此你不必担心性能问题，因为如果指定了 **"name"** 属性，它将成为单例。

```typescript twoslash
import { Elysia } from 'elysia'

const AuthService = new Elysia({ name: 'Service.Auth' })
    .derive({ as: 'scoped' }, ({ cookie: { session } }) => {
        return {
            Auth: {
                user: session.value
            }
        }
    })
    .macro(({ onBeforeHandle }) => ({
        isSignIn(value: boolean) {
            onBeforeHandle(({ Auth, error }) => {
                if (!Auth?.user || !Auth.user) return error(401)
            })
        }
    }))

const UserController = new Elysia()
    .use(AuthService)
    .guard({
        isSignIn: true
    })
    .get('/profile', ({ Auth: { user } }) => user)
```

## 模型

Model 或 [DTO](https://zh.wikipedia.org/wiki/数据传输对象)（数据传输对象）由 [Elysia.t](/validation/overview.html#data-validation)（验证）处理。

我们建议使用 [Elysia 引用模型](/validation/reference-model.html#reference-model)或为每个模块创建 DTO 的对象或类。

1. 使用 Elysia 的模型引用

```typescript twoslash
import { Elysia, t } from 'elysia'

const AuthModel = new Elysia({ name: 'Model.Auth' })
    .model({
        'auth.sign': t.Object({
            username: t.String(),
            password: t.String({
                minLength: 5
            })
        })
    })

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .post('/sign-in', async ({ body, cookie: { session } }) => {
        return {
            success: true
        }
    }, {
        body: 'auth.sign'
    })
```

这种方法提供了几个好处。

1. 允许我们为模型命名并提供自动完成。
2. 修改模式以供后续使用，或执行[重新映射](/patterns/remapping.html#remapping)。
3. 在 OpenAPI 兼容的客户端中显示为 “models”，例如 Swagger。

## 视图

你可以使用 Elysia HTML 进行模板渲染。

Elysia 支持使用 [Elysia HTML 插件](/plugins/html)的 JSX 作为模板引擎。

你**可以**创建渲染服务或直接嵌入视图由你决定，但根据 MVC 模式，你可能会创建一个用于处理视图的服务。

1. 直接嵌入视图，如果你需要渲染多个视图可能会很有用，例如使用 [HTMX](https://htmx.org)：

```tsx twoslash
import React from 'react'
// ---cut---
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ query: { name } }) => {
        return (
            <h1>hello {name}</h1>
        )
    })
```

2. 作为服务的专用视图：

```tsx twoslash
import React from 'react'
// ---cut---
import { Elysia } from 'elysia'

abstract class Render {
    static root(name?: string) {
        return <h1>hello {name}</h1>
    }
}

new Elysia()
    .get('/', ({ query: { name } }) => {
        return Render.root(name)
    })
```

---

正如前面所说，Elysia 是一个无模式的框架，我们只是为处理 Elysia 与 MVC 的指南提供了一些建议。

你可以选择遵循或不遵循，这取决于你和你的团队的偏好和协议。
