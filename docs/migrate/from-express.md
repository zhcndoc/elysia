---
title: 从 Express 迁移 - ElysiaJS
prev:
  text: '快速开始'
  link: '/quick-start'
next:
  text: '教程'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: 从 Express 迁移 - ElysiaJS

    - - meta
      - name: 'description'
        content: 本指南适用于希望了解 Express 与 Elysia 之间差异的 Express 用户，包括语法，以及如何通过示例将应用程序从 Express 迁移到 Elysia。

    - - meta
      - property: 'og:description'
        content: 本指南适用于希望了解 Express 与 Elysia 之间差异的 Express 用户，包括语法，以及如何通过示例将应用程序从 Express 迁移到 Elysia。
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-express.vue'
</script>

# 从 Express 到 Elysia

本指南适用于希望了解 Express 与 Elysia 之间差异的 Express 用户，包括语法，以及如何通过示例将应用程序从 Express 迁移到 Elysia。

**Express** 是一个流行的 Node.js 网络框架，广泛用于构建 Web 应用程序和 API。因其简单性和灵活性而闻名。

**Elysia** 是一个人性化的 Web 框架，适用于 Bun、Node.js 和支持 Web 标准 API 的运行时。设计时强调人体工学和开发者友好，专注于 **健全的类型安全** 和性能。

## 性能
由于本机 Bun 实现和静态代码分析，Elysia 在性能上相比 Express 有显著提高。

<Benchmark />

## 路由

Express 和 Elysia 有类似的路由语法，使用 `app.get()` 和 `app.post()` 方法来定义路由，并且有类似的路径参数语法。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/id/:id', (req, res) => {
    res.status(201).send(req.params.id)
})

app.listen(3000)
```

:::
</template>

<template v-slot:left-content>

> Express 使用 `req` 和 `res` 作为请求和响应对象

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

> Elysia 使用单一的 `context` 直接返回响应

</template>

</Compare>

在风格指南上存在一些细微的差异，Elysia 推荐使用方法链和对象解构。

如果您不需要使用上下文，Elysia 还支持内联值作为响应。

## 处理程序

两者在访问输入参数（如 `headers`、`query`、`params` 和 `body`）时有类似的属性。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

app.use(express.json())

app.post('/user', (req, res) => {
    const limit = req.query.limit
    const name = req.body.name
    const auth = req.headers.authorization

    res.json({ limit, name, auth })
})
```

:::
</template>

<template v-slot:left-content>

> Express 需要 `express.json()` 中间件来解析 JSON 主体

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

> Elysia 默认解析 JSON、URL 编码数据和表单数据

</template>

</Compare>

## 子路由

Express 使用专门的 `express.Router()` 声明子路由，而 Elysia 将每个实例视为可以插件式组合的组件。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const subRouter = express.Router()

subRouter.get('/user', (req, res) => {
	res.send('Hello User')
})

const app = express()

app.use('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Express 使用 `express.Router()` 创建子路由

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

> Elysia 将每个实例视为一个组件

</template>

</Compare>

## 验证
Elysia 内置支持请求验证，具有健全的类型安全，而 Express 不提供内置验证，需要根据每个验证库手动声明类型。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import { z } from 'zod'

const app = express()

app.use(express.json())

const paramSchema = z.object({
	id: z.coerce.number()
})

const bodySchema = z.object({
	name: z.string()
})

app.patch('/user/:id', (req, res) => {
	const params = paramSchema.safeParse(req.params)
	if (!params.success)
		return res.status(422).json(result.error)

	const body = bodySchema.safeParse(req.body)
	if (!body.success)
		return res.status(422).json(result.error)

	res.json({
		params: params.id.data,
		body: body.data
	})
})
```

:::
</template>

<template v-slot:left-content>

> Express 需要外部验证库如 `zod` 或 `joi` 来验证请求主体

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

## 文件上传
Express 使用外部库 `multer` 处理文件上传，而 Elysia 内置支持文件和表单数据，并使用声明式 API 进行 MIME 类型验证。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import multer from 'multer'
import { fileTypeFromFile } from 'file-type'
import path from 'path'

const app = express()
const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('image'), async (req, res) => {
	const file = req.file

	if (!file)
		return res
			.status(422)
			.send('没有上传文件')

	const type = await fileTypeFromFile(file.path)
	if (!type || !type.mime.startsWith('image/'))
		return res
			.status(422)
			.send('文件不是有效的图像')

	const filePath = path.resolve(file.path)
	res.sendFile(filePath)
})
```

:::
</template>

<template v-slot:left-content>

> Express 需要 `express.json()` 中间件来解析 JSON 主体

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

> Elysia 用声明式方法处理文件和 MIME 类型验证

</template>

</Compare>

由于 **multer** 不验证 MIME 类型，您需要使用 **file-type** 或类似库手动验证 MIME 类型。

Elysia 验证文件上传，并使用 **file-type** 自动验证 MIME 类型。

## 中间件

Express 中间件使用单一的基于队列的顺序，而 Elysia 提供使用 **基于事件** 的生命周期进行更精细的控制。

Elysia 的生命周期事件可以如下所示。
![Elysia 生命周期图](/assets/lifecycle-chart.svg)
> 点击图片放大

尽管 Express 对请求管道有单一流的处理顺序，Elysia 可以拦截请求管道中的每个事件。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

// 全局中间件
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`)
	next()
})

app.get(
	'/protected',
	// 路由特定中间件
	(req, res, next) => {
	  	const token = req.headers.authorization

	  	if (!token)
	   		return res.status(401).send('未授权')

	  	next()
	},
	(req, res) => {
  		res.send('受保护的路由')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Express 使用单个基于队列的顺序来处理中间件，按顺序执行

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
  			if (!headers.authorizaton)
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

虽然 Hono 具有调用下一个中间件的 `next` 函数，但 Elysia 并没有。

## 健全的类型安全
Elysia 被设计为具有健全的类型安全。

例如，您可以使用 [derive](/essential/life-cycle.html#derive) 和 [resolve](/essential/life-cycle.html#resolve) 以 **类型安全** 的方式自定义上下文，而 Express 则无法做到。

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Express]
// @errors: 2339
import express from 'express'
import type { Request, Response } from 'express'

const app = express()

const getVersion = (req: Request, res: Response, next: Function) => {
	// @ts-ignore
    req.version = 2

	next()
}

app.get('/version', getVersion, (req, res) => {
	res.send(req.version)
	//            ^?
})

const authenticate = (req: Request, res: Response, next: Function) => {
  	const token = req.headers.authorization

  	if (!token)
   		return res.status(401).send('未授权')

	// @ts-ignore
    req.token = token.split(' ')[1]

	next()
}

app.get('/token', getVersion, authenticate, (req, res) => {
	req.version
	//  ^?

  	res.send(req.token)
   //            ^?
})
```

:::
</template>

<template v-slot:left-content>

> Express 使用单个基于队列的顺序来处理中间件，按顺序执行

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	.decorate('version', 2)
	.get('/version', ({ version }) => version)
	.resolve(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
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

虽然 Express 可以使用 `declare module` 扩展 `Request` 接口，但它是全局可用的，并且没有健全的类型安全，也不保证该属性在所有请求处理程序中都是可用的。

```ts
declare module 'express' {
  	interface Request {
    	version: number
  		token: string
  	}
}
```
> 这对于使上面的 Express 示例正常工作是必需的，但并不提供健全的类型安全

## 中间件参数
Express 使用函数返回插件来定义可重用的路由特定中间件，而 Elysia 使用 [macro](/patterns/macro) 定义自定义钩子。

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Express]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
// @errors: 2339
import express from 'express'
import type { Request, Response } from 'express'

const app = express()

const role = (role: 'user' | 'admin') =>
	(req: Request, res: Response, next: Function) => {
	  	const user = findUser(req.headers.authorization)

	  	if (user.role !== role)
	   		return res.status(401).send('未授权')

		// @ts-ignore
	    req.user = user

		next()
	}

app.get('/token', role('admin'), (req, res) => {
  	res.send(req.user)
   //            ^?
})
```

:::
</template>

<template v-slot:left-content>

> Express 使用函数回调接受中间件的自定义参数

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

				if(user.role !== role)
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

Express 使用单一错误处理程序处理所有路由，而 Elysia 提供了更精细的错误处理控制。

<Compare>

<template v-slot:left>

::: code-group

```ts
import express from 'express'

const app = express()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

// 全局错误处理程序
app.use((error, req, res, next) => {
	if(error instanceof CustomError) {
		res.status(500).json({
			message: '发生了错误！',
			error
		})
	}
})

// 路由特定错误处理程序
app.get('/error', (req, res) => {
	throw new CustomError('哦，啊')
})
```

:::
</template>

<template v-slot:left-content>

> Express 使用中间件处理错误，所有路由共享一个错误处理程序

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

class CustomError extends Error {
	// 可选：自定义 HTTP 状态码
	status = 500

	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}

	// 可选：发送到客户端的内容
	toResponse() {
		return {
			message: "如果您看到这个，我们的开发人员忘记处理此错误",
			error: this
		}
	}
}

const app = new Elysia()
	// 可选：注册自定义错误类
	.error({
		CUSTOM: CustomError,
	})
	// 全局错误处理程序
	.onError(({ error, code }) => {
		if(code === 'CUSTOM')
		// ^?


			return {
				message: '发生了错误！',
				error
			}
	})
	.get('/error', () => {
		throw new CustomError('哦，啊')
	}, {
		// 可选：路由特定错误处理程序
		error({ error }) {
			return {
				message: '仅适用于此路由！',
				error
			}
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 提供更精细的错误处理控制和作用域机制

</template>

</Compare>

虽然 Express 使用中间件提供错误处理，但 Elysia 提供：

1. 全局和特定路由的错误处理程序
2. 快捷方式用于映射 HTTP 状态和 `toResponse` 用于将错误映射到响应
3. 为每个错误提供自定义错误代码

错误代码对于日志记录和调试非常有用，并且在区分扩展相同类的不同错误类型时至关重要。

## 封装

Express 中间件是全局注册的，而 Elysia 通过显式作用域机制和代码顺序控制插件的副作用。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

app.get('/', (req, res) => {
	res.send('Hello World')
})

const subRouter = express.Router()

subRouter.use((req, res, next) => {
	const token = req.headers.authorization

	if (!token)
		return res.status(401).send('未授权')

	next()
})

app.use(subRouter)

// 从子路由产生副作用
app.get('/side-effect', (req, res) => {
	res.send('嗨')
})

```

:::
</template>

<template v-slot:left-content>

> Express 不会处理中间件的副作用，需要添加前缀以分开副作用

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // 不会有来自子路由的副作用
    .get('/side-effect', () => '嗨')
```

:::
</template>

<template v-slot:right-content>

> Elysia 将副作用封装到插件中

</template>

</Compare>

默认情况下，Elysia 将生命事件和上下文封装到所使用的实例中，因此插件的副作用不会影响父实例，除非明确说明。

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	// 作用域限定于父实例，但不再超过此范围
	.as('scoped') // [!code ++]

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // [!code ++]
    // 现在有来自子路由的副作用
    .get('/side-effect', () => '嗨')
```

Elysia 提供三种类型的作用域机制：
1. **局部** - 只应用于当前实例，没有副作用（默认）
2. **受限** - 将副作用作用域限定于父实例，但不再超过此范围
3. **全局** - 影响所有实例

虽然 Express 可以通过添加前缀来限制中间件副作用，但这并不是真正的封装。副作用仍然存在，但被分隔到以所述前缀开头的任何路由，使得开发人员需要记住哪个前缀具有副作用。

这使得您可以执行以下操作：

1. 重新排列代码顺序，但仅在只有一个具有副作用的实例中有效。
2. 添加前缀，但副作用仍然存在。如果其他实例具有相同的前缀，则它也具有副作用。

这可能导致调试时出现噩梦场景，因为 Express 不提供真正的封装。

## Cookie
Express 使用外部库 `cookie-parser` 解析 cookies，而 Elysia 内置支持 cookie，并使用基于信号的方法处理 cookies。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser('secret'))

app.get('/', function (req, res) {
	req.cookies.name
	req.signedCookies.name

	res.cookie('name', 'value', {
		signed: true,
		maxAge: 1000 * 60 * 60 * 24
	})
})
```

:::
</template>

<template v-slot:left-content>

> Express 使用 `cookie-parser` 解析 Cookies

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
		// 签名验证自动处理
		name.value

		// 整个 cookie 签名自动处理
		name.value = 'value'
		name.maxAge = 1000 * 60 * 60 * 24
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用基于信号的方法处理 Cookies

</template>

</Compare>


## OpenAPI
Express 需要单独的配置来支持 OpenAPI、验证和类型安全，而 Elysia 使用架构作为 **单一真实来源** 内置支持 OpenAPI。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(express.json())

app.post('/users', (req, res) => {
	// TODO: 验证请求主体
	res.status(201).json(req.body)
})

const swaggerSpec = {
	openapi: '3.0.0',
	info: {
		title: '我的 API',
		version: '1.0.0'
	},
	paths: {
		'/users': {
			post: {
				summary: '创建用户',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										description: '仅为名'
									},
									age: { type: 'integer' }
								},
								required: ['name', 'age']
							}
						}
					}
				},
				responses: {
					'201': {
						description: '用户已创建'
					}
				}
			}
		}
	}
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```

:::
</template>

<template v-slot:left-content>

> Express 需要单独的配置来支持 OpenAPI、验证和类型安全

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

> Elysia 将架构用作单一真实来源

</template>

</Compare>

Elysia 会根据您提供的架构生成 OpenAPI 规范，并根据该架构验证请求和响应，并自动推断类型。

Elysia 还将在 `model` 中注册的架构附加到 OpenAPI 规范，允许您在 Swagger 或 Scalar UI 的专用部分中引用该模型。

## 测试

Express 使用单个 `supertest` 库测试应用程序，而 Elysia 构建在 Web 标准 API 之上，允许与任何测试库一起使用。

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import request from 'supertest'
import { describe, it, expect } from 'vitest'

const app = express()

app.get('/', (req, res) => {
	res.send('Hello World')
})

describe('GET /', () => {
	it('应该返回 Hello World', async () => {
		const res = await request(app).get('/')

		expect(res.status).toBe(200)
		expect(res.text).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:left-content>

> Express 使用 `supertest` 库测试应用程序

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'
import { describe, it, expect } from 'vitest'

const app = new Elysia()
	.get('/', 'Hello World')

describe('GET /', () => {
	it('应该返回 Hello World', async () => {
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

此外，Elysia 还提供了一个称为 [Eden](/eden/overview) 的助手库，用于端到端的类型安全，允许我们进行自动补全和完全类型安全的测试。

```ts twoslash [Elysia]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'

const app = new Elysia().get('/hello', 'Hello World')
const api = treaty(app)

describe('GET /', () => {
	it('应该返回 Hello World', async () => {
		const { data, error, status } = await api.hello.get()

		expect(status).toBe(200)
		expect(data).toBe('Hello World')
		//      ^?
	})
})
```

## 端到端类型安全
Elysia 内置支持 **端到端类型安全**，无需代码生成，Express 不提供此功能。

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

if(error)
	throw error
	//     ^?














console.log(data)
//          ^?



// ---cut-after---
console.log('ok')
```

:::

如果端到端类型安全对您来说很重要，那么 Elysia 是正确的选择。

---

Elysia 提供了更人性化和开发者友好的体验，专注于性能、类型安全和简易性，而 Express 是一个流行的 Node.js 网络框架，但在性能和简易性方面存在一些局限性。

如果您在寻找一个易于使用、具有出色开发者体验且基于 Web 标准 API 的框架，Elysia 是您正确的选择。

另外，如果您来自其他框架，可以查看：

<Deck>
    <Card title="从 Fastify 迁移" href="/migrate/from-fastify">
  		从 Fastify 到 Elysia 的迁移指南
    </Card>
	<Card title="从 Hono 迁移" href="/migrate/from-hono">
  		从 Hono 到 Elysia 的迁移指南
	</Card>
</Deck>