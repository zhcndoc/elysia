---
title: 从 Hono 迁移 - ElysiaJS
prev:
  text: '快速入门'
  link: '/quick-start'
next:
  text: '教程'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: 从 Hono 迁移 - ElysiaJS

    - - meta
      - name: 'description'
        content: 本指南适用于希望了解 Elysia 与 Hono 之间的差异，包括语法，以及如何通过示例将应用程序从 Hono 迁移到 Elysia 的 Hono 用户。

    - - meta
      - property: 'og:description'
        content: 本指南适用于希望了解 Elysia 与 Hono 之间的差异，包括语法，以及如何通过示例将应用程序从 Hono 迁移到 Elysia 的 Hono 用户。
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-hono.vue'
</script>

# 从 Hono 到 Elysia

本指南适用于希望了解 Elysia 与 Hono 之间的差异，包括语法，以及如何通过示例将应用程序从 Hono 迁移到 Elysia 的 Hono 用户。

**Hono** 是一个快速而轻量的框架，基于 Web 标准构建。它与 Deno、Bun、Cloudflare Workers 和 Node.js 等多个运行时具有广泛的兼容性。

**Elysia** 是一个符合人体工程学的 Web 框架，旨在提供良好的开发者体验，重点关注 **强类型安全** 和性能。

这两个框架均建立在 Web 标准 API 之上，语法略有不同。Hono 提供对多个运行时的更广泛兼容，而 Elysia 则专注于特定的运行时集。

## 性能
由于静态代码分析，Elysia 在性能上相较 Hono 有显著提升。

<Benchmark />

## 路由

Hono 和 Elysia 的路由语法相似，使用 `app.get()` 和 `app.post()` 方法来定义路由，并采用类似的路径参数语法。

两者都使用单个 `Context` 参数来处理请求和响应，并直接返回响应。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello World')
})

app.post('/id/:id', (c) => {
    c.status(201)
    return c.text(req.params.id)
})

export default app
```

:::
</template>

<template v-slot:left-content>

> Hono 使用辅助函数 `c.text`、`c.json` 返回响应

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', 'Hello World')
    .post(
        '/id/:id',
        ({ status, params: { id } }) => {
            return status(201, id)
        }
    )
    .listen(3000)
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用单个 `context` 并直接返回响应

</template>

</Compare>

虽然 Hono 使用 `c.text` 和 `c.json` 来包装响应，Elysia 则自动将值映射到响应。

在样式指南上有轻微差异，Elysia 推荐使用方法链和对象解构。

Hono 的端口分配依赖于运行时和适配器，而 Elysia 使用单个 `listen` 方法来启动服务器。

## 处理程序

Hono 使用功能手动解析查询、头和主体，而 Elysia 自动解析属性。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

app.post('/user', async (c) => {
    const limit = c.req.query('limit')
    const { name } = await c.body()
    const auth = c.req.header('authorization')

    return c.json({ limit, name, auth })
})
```

:::
</template>

<template v-slot:left-content>

> Hono 自动解析主体，但不适用于查询和头

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
    .post('/user', (ctx) => {
        const limit = ctx.query.limit
        const name = ctx.body.name
        const auth = ctx.headers.authorization

        return { limit, name, auth }
    })
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用静态代码分析来分析要解析的内容

</template>

</Compare>

Elysia 使用 **静态代码分析** 来确定要解析的内容，仅解析所需的属性。

这对性能和类型安全非常有用。

## 子路由

两者都可以作为路由器继承另一个实例，但 Elysia 将每个实例视为可用作子路由器的组件。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const subRouter = new Hono()

subRouter.get('/user', (c) => {
    return c.text('Hello User')
})

const app = new Hono()

app.route('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Hono **需要** 前缀来分隔子路由器

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ prefix: '/api' })
    .get('/user', 'Hello User')

const app = new Elysia()
    .use(subRouter)
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用可选前缀构造函数来定义前缀

</template>

</Compare>

虽然 Hono 需要前缀来分隔子路由器，但 Elysia 不需要前缀。

## 验证
尽管 Hono 支持 **zod**，但 Elysia 专注于与 **TypeBox** 的深度集成，以便在幕后提供无缝集成 OpenAPI、验证和高级功能。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

app.patch(
    '/user/:id',
    zValidator(
        'param',
        z.object({
            id: z.coerce.number()
        })
    ),
    zValidator(
        'json',
        z.object({
            name: z.string()
        })
    ),
    (c) => {
        return c.json({
            params: c.req.param(),
            body: c.req.json()
        })
    }
)
```

:::
</template>

<template v-slot:left-content>

> Hono 使用基于管道的方式

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
//                           ^?
		params,
		body
//   ^?
	}),



	{
		params: t.Object({
			id: t.Number()
		}),
		body: t.Object({
			name: t.String()
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用 TypeBox 进行验证，并自动强制转换类型

</template>

</Compare>

两者都自动从模式推断类型到上下文。

## 文件上传
Hono 和 Elysia 都使用 Web 标准 API 处理文件上传，但 Elysia 具有内置的声明式支持，使用 **file-type** 验证 MIME 类型。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { fileTypeFromBlob } from 'file-type'

const app = new Hono()

app.post(
    '/upload',
    zValidator(
        'form',
        z.object({
            file: z.instanceof(File)
        })
    ),
    async (c) => {
        const body = await c.req.parseBody()

        const type = await fileTypeFromBlob(body.image as File)
        if (!type || !type.mime.startsWith('image/')) {
            c.status(422)
            return c.text('File is not a valid image')
        }

        return new Response(body.image)
    }
)
```

:::
</template>

<template v-slot:left-content>

> Hono 需要单独的 `file-type` 库来验证 MIME 类型

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .post('/upload', ({ body }) => body.file, {
        body: t.Object({
            file: t.File({
                type: 'image'
            })
        })
    })
```

:::
</template>

<template v-slot:right-content>

> Elysia 以声明方式处理文件和 MIME 类型验证

</template>

</Compare>

由于 Web 标准 API 不验证 MIME 类型，因此信任客户端提供的 `content-type` 可能存在安全风险，因此 Hono 需要外部库，而 Elysia 则使用 `file-type` 自动验证 MIME 类型。

## 中间件

Hono 中间件使用类似于 Express 的单队列顺序，而 Elysia 使用 **基于事件** 的生命周期为您提供更精细的控制。

Elysia 的生命周期事件可以如下图所示。
![Elysia 生命周期图](/assets/lifecycle-chart.svg)
> 单击图片放大

虽然 Hono 的请求管道有单一流程，但 Elysia 可以拦截请求管道中的每个事件。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

// 全局中间件
app.use(async (c, next) => {
    console.log(`${c.method} ${c.url}`)

    await next()
})

app.get(
    '/protected',
    // 路由特定中间件
    async (c, next) => {
        const token = c.headers.authorization

        if (!token) {
            c.status(401)
            return c.text('Unauthorized')
        }

        await next()
    },
    (req, res) => {
        res.send('Protected route')
    }
)
```

:::
</template>

<template v-slot:left-content>

> Hono 使用单队列顺序的中间件，按顺序执行

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
    // 全局中间件
    .onRequest(({ method, path }) => {
        console.log(`${method} ${path}`)
    })
    // 路由特定中间件
    .get('/protected', () => 'protected', {
        beforeHandle({ status, headers }) {
            if (!headers.authorization)
                return status(401)
        }
    })
```

:::
</template>

<template v-slot:right-content>

> Elysia 为请求管道中的每个点使用特定的事件拦截器

</template>

</Compare>

虽然 Hono 有 `next` 函数来调用下一个中间件，但 Elysia 没有这个函数。

## 类型安全
Elysia 旨在实现强类型安全。

例如，您可以使用 [derive](/essential/life-cycle.html#derive) 和 [resolve](/essential/life-cycle.html#resolve) 以 **类型安全** 的方式自定义上下文，而 Hono 则不能。

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
// @errors: 2339, 2769
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

const getVersion = createMiddleware(async (c, next) => {
    c.set('version', 2)

    await next()
})

app.use(getVersion)

app.get('/version', getVersion, (c) => {
    return c.text(c.get('version') + '')
})

const authenticate = createMiddleware(async (c, next) => {
    const token = c.req.header('authorization')

    if (!token) {
        c.status(401)
        return c.text('Unauthorized')
    }

    c.set('token', token.split(' ')[1])

    await next()
})

app.post('/user', authenticate, async (c) => {
    c.get('version')

    return c.text(c.get('token'))
})
```

:::
</template>

<template v-slot:left-content>

> Hono 使用中间件扩展上下文，但不具备类型安全

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
    .decorate('version', 2)
    .get('/version', ({ version }) => version)
    .resolve(({ status, headers: { authorization } }) => {
        if (!authorization?.startsWith('Bearer '))
            return status(401)

        return {
            token: authorization.split(' ')[1]
        }
    })
    .get('/token', ({ token, version }) => {
        version
        //  ^?


        return token
        //       ^?
    })
```

:::
</template>

<template v-slot:right-content>

> Elysia 为请求管道中的每个点使用特定的事件拦截器

</template>

</Compare>

虽然 Hono 可以使用 `declare module` 来扩展 `ContextVariableMap` 接口，但它是全局可用的，因此不具备类型安全，也无法确保该属性在所有请求处理程序中可用。

```ts
declare module 'hono' {
  	interface ContextVariableMap {
    	version: number
  		token: string
  	}
}
```
> 这对于上述 Hono 示例的正常工作是必需的，但不提供强类型安全。

## 中间件参数
Hono 使用回调函数定义可重用的路由特定中间件，而 Elysia 使用 [macro](/patterns/macro) 定义自定义钩子。

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
const findUser = (authorization?: string) => {
    return {
        name: 'Jane Doe',
        role: 'admin' as const
    }
}
// ---cut---
// @errors: 2339 2589 2769
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

const role = (role: 'user' | 'admin') => createMiddleware(async (c, next) => {
    const user = findUser(c.req.header('Authorization'))

    if (user.role !== role) {
        c.status(401)
        return c.text('Unauthorized')
    }

    c.set('user', user)

    await next()
})

app.get('/user/:id', role('admin'), (c) => {
    return c.json(c.get('user'))
})
```

:::
</template>

<template v-slot:left-content>

> Hono 使用回调返回 `createMiddleware` 来创建可重用的中间件，但不具备类型安全

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
const findUser = (authorization?: string) => {
    return {
        name: 'Jane Doe',
        role: 'admin' as const
    }
}
// ---cut---
import { Elysia } from 'elysia'

const app = new Elysia()
    .macro({
        role: (role: 'user' | 'admin') => ({
            resolve({ status, headers: { authorization } }) {
                const user = findUser(authorization)

                if (user.role !== role)
                    return status(401)

                return {
                    user
                }
            }
        })
    })
    .get('/token', ({ user }) => user, {
    //                 ^?
        role: 'admin'
    })
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用宏将自定义参数传递给自定义中间件

</template>

</Compare>

## 错误处理

Hono 提供了一个适用于所有路由的 `onError` 函数，而 Elysia 则提供了更细粒度的错误处理控制。

<Compare>

<template v-slot:left>

::: code-group

```ts
import { Hono } from 'hono'

const app = new Hono()

class CustomError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CustomError'
    }
}

// 全局错误处理程序
app.onError((error, c) => {
    if (error instanceof CustomError) {
        c.status(500)

        return c.json({
            message: '出了一些问题！',
            error
        })
    }
})

// 路由特定错误处理程序
app.get('/error', (req, res) => {
    throw new CustomError('哦，出错了')
})
```

:::
</template>

<template v-slot:left-content>

> Hono 使用 `onError` 函数处理错误，所有路由共享一个错误处理器

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

class CustomError extends Error {
	// Optional: custom HTTP status code
	status = 500

	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}

	// Optional: what should be sent to the client
	toResponse() {
		return {
			message: "If you're seeing this, our dev forgot to handle this error",
			error: this
		}
	}
}

const app = new Elysia()
	// Optional: register custom error class
	.error({
		CUSTOM: CustomError,
	})
	// Global error handler
	.onError(({ error, code }) => {
		if(code === 'CUSTOM')
		// ^?




			return {
				message: 'Something went wrong!',
				error
			}
	})
	.get('/error', () => {
		throw new CustomError('oh uh')
	}, {
		// Optional: route specific error handler
		error({ error }) {
			return {
				message: 'Only for this route!',
				error
			}
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 在错误处理方面提供了更细粒度的控制和作用域机制

</template>

</Compare>

虽然 Hono 提供了中间件式的错误处理，但 Elysia 提供：

1. 全局和路由特定的错误处理器
2. 将 HTTP 状态与 `toResponse` 映射的简写
3. 为每个错误提供自定义错误代码

错误代码对于日志和调试非常有用，并且在区分扩展相同类的不同错误类型时非常重要。

## 封装

Hono 封装插件副作用，而 Elysia 通过显式的作用域机制和代码顺序让您控制插件的副作用。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const subRouter = new Hono()

subRouter.get('/user', (c) => {
    return c.text('Hello User')
})

const app = new Hono()

app.route('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Hono 封装插件的副作用

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
    .onBeforeHandle(({ status, headers: { authorization } }) => {
        if (!authorization?.startsWith('Bearer '))
            return status(401)
    })

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // 不会有 subRouter 的副作用
    .get('/side-effect', () => 'hi')
```

:::
</template>

<template v-slot:right-content>

> Elysia 除非明确声明，否则不封装插件的副作用

</template>

</Compare>

两者都有插件的封装机制以防止副作用。

然而，Elysia 可以通过声明作用域来明确声明哪些插件应该具有副作用，而 Fastify 总是封装副作用。

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
    .onBeforeHandle(({ status, headers: { authorization } }) => {
        if (!authorization?.startsWith('Bearer '))
            return status(401)
    })
    // 作用域限定于父实例，不能超出
    .as('scoped') // [!code ++]

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // [!code ++]
    // 现在具有来自 subRouter 的副作用
    .get('/side-effect', () => 'hi')
```

Elysia 提供 3 种类型的作用域机制：
1. **local** - 仅适用于当前实例，没有副作用（默认）
2. **scoped** - 将副作用范围限定于父实例，但不能超出
3. **global** - 影响所有实例

---

由于 Hono 不提供作用域机制，我们需要：

1. 为每个钩子创建一个函数并手动附加它们
2. 使用高阶函数，并将其应用于需要效果的实例

但是，如果处理不当，可能会导致副作用的重复。

```ts [Hono]
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const middleware = createMiddleware(async (c, next) => {
    console.log('called')

    await next()
})

const app = new Hono()
const subRouter = new Hono()

app.use(middleware)
app.get('/main', (c) => c.text('Hello from main!'))

subRouter.use(middleware)

// 这将会记录两次
subRouter.get('/sub', (c) => c.text('Hello from sub router!'))

app.route('/sub', subRouter)

export default app
```

在这种情况下，Elysia 提供了一个插件去重机制以防止重复副作用。

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ name: 'subRouter' }) // [!code ++]
    .onBeforeHandle(({ status, headers: { authorization } }) => {
        if (!authorization?.startsWith('Bearer '))
            return status(401)
    })
    .as('scoped')

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    .use(subRouter) // [!code ++]
    .use(subRouter) // [!code ++]
    .use(subRouter) // [!code ++]
    // 副作用只会调用一次
    .get('/side-effect', () => 'hi')
```

通过使用唯一的 `name`，Elysia 只会应用插件一次，并不会导致副作用的重复。

## Cookie
Hono 在 `hono/cookie` 下有内置的 cookie 工具函数，而 Elysia 采用基于信号的方法处理 Cookies。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'

const app = new Hono()

app.get('/', async (c) => {
    const name = await getSignedCookie(c, 'secret', 'name')

    await setSignedCookie(
        c,
        'name',
        'value',
        'secret',
        {
            maxAge: 1000,
        }
    )
})
```

:::
</template>

<template v-slot:left-content>

> Hono 使用工具函数处理 cookies

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia({
    cookie: {
        secret: 'secret'
    }
})
    .get('/', ({ cookie: { name } }) => {
        // 签名验证会自动处理
        name.value

        // cookie 签名会自动签名
        name.value = 'value'
        name.maxAge = 1000 * 60 * 60 * 24
    })
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用基于信号的方法处理 cookies

</template>

</Compare>

## OpenAPI
Hono 需要额外的工作来描述规范，而 Elysia 无缝地将规范集成到模式中。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { describeRoute, openAPISpecs } from 'hono-openapi'
import { resolver, validator as zodValidator } from 'hono-openapi/zod'
import { swaggerUI } from '@hono/swagger-ui'

import { z } from '@hono/zod-openapi'

const app = new Hono()

const model = z.array(
    z.object({
        name: z.string().openapi({
            description: '仅限姓'
        }),
        age: z.number()
    })
)

const detail = await resolver(model).builder()

console.log(detail)

app.post(
    '/',
    zodValidator('json', model),
    describeRoute({
        validateResponse: true,
        summary: '创建用户',
        requestBody: {
            content: {
                'application/json': { schema: detail.schema }
            }
        },
        responses: {
            201: {
                description: '用户创建',
                content: {
                    'application/json': { schema: resolver(model) }
                }
            }
        }
    }),
    (c) => {
        c.status(201)
        return c.json(c.req.valid('json'))
    }
)

app.get('/ui', swaggerUI({ url: '/doc' }))

app.get(
    '/doc',
    openAPISpecs(app, {
        documentation: {
            info: {
                title: 'Hono API',
                version: '1.0.0',
                description: '问候 API'
            },
            components: {
                ...detail.components
            }
        }
    })
)

export default app
```

:::
</template>

<template v-slot:left-content>

> Hono 需要额外努力来描述规范

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger' // [!code ++]

const app = new Elysia()
    .use(swagger()) // [!code ++]
    .model({
        user: t.Object({
            name: t.String(),
            age: t.Number()
        })
    })
    .post('/users', ({ body }) => body, {
    //                  ^?
        body: 'user[]',
        response: {
            201: 'user[]'
        },
        detail: {
            summary: '创建用户'
        }
    })
```

:::
</template>

<template v-slot:right-content>

> Elysia Seamlessly integrate the specification into the schema

</template>

</Compare>

Hono 具有单独的函数来描述路由规范、验证，并且需要一些额外的工作进行正确设置。

Elysia 使用您提供的模式生成 OpenAPI 规范，并验证请求/响应，并自动推断类型，所有这些都来自一个 **单一的信息源**。

Elysia 还将注册的模式附加到 OpenAPI 规范中，允许您在 Swagger 或 Scalar UI 中的专用部分中引用该模型，而 Hono 将模式内联到路由中。

## 测试

两个框架均建立在 Web 标准 API 之上，允许与任何测试库一起使用。

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { describe, it, expect } from 'vitest'

const app = new Hono()
    .get('/', (c) => c.text('Hello World'))

describe('GET /', () => {
    it('should return Hello World', async () => {
        const res = await app.request('/')

        expect(res.status).toBe(200)
        expect(await res.text()).toBe('Hello World')
    })
})
```

:::
</template>

<template v-slot:left-content>

> Hono 具有内置的 `request` 方法来执行请求

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'
import { describe, it, expect } from 'vitest'

const app = new Elysia()
    .get('/', 'Hello World')

describe('GET /', () => {
    it('should return Hello World', async () => {
        const res = await app.handle(
            new Request('http://localhost')
        )

        expect(res.status).toBe(200)
        expect(await res.text()).toBe('Hello World')
    })
})
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用 Web 标准 API 处理请求和响应

</template>

</Compare>

另外，Elysia 还提供了一个名为 [Eden](/eden/overview) 的辅助库，用于端到端类型安全，允许我们在测试中进行自动补全和完整的类型安全。

```ts twoslash [Elysia]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'

const app = new Elysia().get('/hello', 'Hello World')
const api = treaty(app)

describe('GET /', () => {
    it('should return Hello World', async () => {
        const { data, error, status } = await api.hello.get()

        expect(status).toBe(200)
        expect(data).toBe('Hello World')
        //      ^?
    })
})
```

## 端到端类型安全
两者都提供端到端类型安全，然而 Hono 在基于状态码的错误处理方面似乎不提供类型安全。

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()
    .post(
        '/mirror',
        zValidator(
            'json',
            z.object({
                message: z.string()
            })
        ),
        (c) => c.json(c.req.valid('json'))
    )

const client = hc<typeof app>('/')

const response = await client.mirror.$post({
    json: {
        message: 'Hello, world!'
    }
})

const data = await response.json()
//     ^?

console.log(data)
```

:::
</template>

<template v-slot:left-content>

> Hono 使用 `hc` 运行请求，并提供端到端类型安全

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            message: t.String()
        })
    })

const api = treaty(app)

const { data, error } = await api.mirror.post({
    message: 'Hello World'
})

if (error)
    throw error
    //     ^?















console.log(data)
//          ^?



// ---cut-after---
console.log('ok')
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用 `treaty` 运行请求，并提供端到端类型安全

</template>

</Compare>

虽然两者都提供端到端类型安全，但 Elysia 在基于状态码的错误处理方面提供了更多类型安全，而 Hono 则没有。

使用相同目的的代码来测量类型推理速度时，Elysia 在类型检查方面比 Hono 快 2.3 倍。

![Elysia eden 类型推理性能](/migrate/elysia-type-infer.webp)
> Elysia 花费 536 毫秒推断 Elysia 和 Eden（点击放大）

![Hono HC 类型推理性能](/migrate/hono-type-infer.webp)
> Hono 花费 1.27 秒推断 Hono 和 HC，带有错误（中止）（点击放大）

1.27 秒并不反映推断的整个持续时间，而是从开始到因错误 **“类型实例化过于深且可能是无限的。”** 而中止的持续时间，这在模式过大时会发生。

![Hono HC 显示过于深的错误](/migrate/hono-hc-infer.webp)
> Hono HC 显示过于深的错误

这是由于模式过大，Hono 不支持超过 100 个路由，且具有复杂主体和响应验证，而 Elysia 则没有这个问题。

![Elysia Eden 代码显示类型推理没有错误](/migrate/elysia-eden-infer.webp)
> Elysia Eden 代码显示类型推理没有错误

Elysia 的类型推理性能更快，且不必担心 **“类型实例化过于深且可能是无限的。”** *至少* 在具有复杂主体和响应验证的 2000 条路由之内。

如果端到端类型安全对您很重要，那么 Elysia 是正确的选择。

---

两者都是建立在 Web 标准 API 之上的下一代 web 框架，存在细微的差别。

Elysia 旨在符合人体工程学且对开发者友好，关注 **强类型安全**，并且在性能上优于 Hono。

虽然 Hono 提供了对多个运行时的广泛兼容性，特别是与 Cloudflare Workers 兼容，以及更大的用户基础。

如果您是来自其他框架的用户，可以查看：

<Deck>
    <Card title="从 Express 迁移" href="/migrate/from-express">
        一份从 Express 迁移到 Elysia 的指南
    </Card>
    <Card title="从 Fastify 迁移" href="/migrate/from-fastify">
        一份从 Fastify 迁移到 Elysia 的指南
    </Card>
</Deck>