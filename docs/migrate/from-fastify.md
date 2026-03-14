---
title: 从 Fastify 迁移 - ElysiaJS
prev:
  text: '快速开始'
  link: '/quick-start'
next:
  text: '教程'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: 从 Fastify 迁移 - ElysiaJS

    - - meta
      - name: 'description'
        content: 本指南面向希望看到 Fastify 之间差异的用户，包括语法，以及如何通过示例将应用程序从 Fastify 迁移到 Elysia。

    - - meta
      - property: 'og:description'
        content: This guide is for Fastify users who want to see the differences from Fastify including syntax, and how to migrate your application from Fastify to Elysia by example.
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-fastify.vue'
</script>

# 从 Fastify 到 Elysia

本指南面向希望看到 Fastify 之间差异的用户，包括语法，以及如何通过示例将应用程序从 Fastify 迁移到 Elysia。

**Fastify** 是一个快速且低开销的 Node.js 网络框架，旨在简单易用。它基于 HTTP 模块构建，提供了一组易于构建 Web 应用程序的功能。

**Elysia** 是一个符合人体工程学的 Web 框架，支持 Bun、Node.js 和 Web 标准 API 的运行时。旨在使开发人员友好，并专注于 **良好的类型安全** 和性能。

## 性能
得益于本地 Bun 实现和静态代码分析，Elysia 相比 Fastify 有了显著的性能提升。

<Benchmark />

## 路由

Fastify 和 Elysia 拥有类似的路由语法，使用 `app.get()` 和 `app.post()` 方法定义路由，并且路径参数的语法也相似。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'

const app = fastify()

app.get('/', (request, reply) => {
    reply.send('Hello World')
})

app.post('/id/:id', (request, reply) => {
    reply.status(201).send(request.params.id)
})

app.listen({ port: 3000 })
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `request` 和 `reply` 作为请求和响应对象

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

风格指南上有些许差异，Elysia 推荐使用方法链和对象解构。

如果您不需要使用上下文，Elysia 还支持响应的内联值。

## 处理程序

两者都具有类似的属性来访问输入参数，如 `headers`、`query`、`params` 和 `body`，并自动解析请求体为 JSON、URL 编码数据和表单数据。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'

const app = fastify()

app.post('/user', (request, reply) => {
    const limit = request.query.limit
    const name = request.body.name
    const auth = request.headers.authorization

    reply.send({ limit, name, auth })
})
```

:::
</template>

<template v-slot:left-content>

> Fastify 解析数据并放入 `request` 对象中

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

> Elysia 解析数据并放入 `context` 对象中

</template>

</Compare>

## 子路由

Fastify 使用函数回调来定义子路由，而 Elysia 则将每个实例视为可以即插即用的组件。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify, { FastifyPluginCallback } from 'fastify'

const subRouter: FastifyPluginCallback = (app, opts, done) => {
	app.get('/user', (request, reply) => {
		reply.send('Hello User')
	})
}

const app = fastify()

app.register(subRouter, {
	prefix: '/api'
})
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用函数回调声明子路由

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

虽然 Elysia 在构造函数中设置前缀，但 Fastify 要求您在选项中设置前缀。

## 验证
Elysia 内置对请求验证的支持，开箱即用地提供良好的类型安全，使用 **TypeBox**，而 Fastify 使用 JSON Schema 来声明模式，并使用 **ajv** 进行验证。

但是，它不会自动推断类型，需要使用像 `@fastify/type-provider-json-schema-to-ts` 这样的类型提供者来推断类型。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'

const app = fastify().withTypeProvider<JsonSchemaToTsProvider>()

app.patch(
	'/user/:id',
	{
		schema: {
			params: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						pattern: '^[0-9]+$'
					}
				},
				required: ['id']
			},
			body: {
				type: 'object',
				properties: {
					name: { type: 'string' }
				},
				required: ['name']
			},
		}
	},
	(request, reply) => {
		// 将字符串映射到数字
		request.params.id = +request.params.id

		reply.send({
			params: request.params,
			body: request.body
		})
	}
})
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 JSON Schema 进行验证

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia TypeBox]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
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

```ts twoslash [Elysia Zod]
import { Elysia } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: z.object({
			id: z.number()
		}),
		body: z.object({
			name: z.string()
		})
	})
```

```ts twoslash [Elysia Valibot]
import { Elysia } from 'elysia'
import * as v from 'valibot'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: v.object({
			id: v.number()
		}),
		body: v.object({
			name: v.string()
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用 TypeBox 进行验证，并自动进行类型转换。同时也支持使用相同语法的 Zod、Valibot 等验证库。

</template>

</Compare>

此外，Fastify 还能使用 **TypeBox** 或 **Zod** 进行验证，通过 `@fastify/type-provider-typebox` 自动推断类型。

虽然 Elysia **偏好 TypeBox** 进行验证，Elysia 也支持标准模式 Schema，让您可以开箱即用地使用 Zod、Valibot、ArkType、Effect Schema 等库。

## 文件上传
Fastify 使用 `fastify-multipart` 来处理文件上传，该插件底层使用 `Busboy`，而 Elysia 使用 Web 标准 API 来处理表单数据，使用声明式 API 进行 mimetype 验证。

但是，Fastify 没有提供简单的文件验证方式，如文件大小和 mimetype 验证，通常需要自己做一些变通来验证文件。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import multipart from '@fastify/multipart'

import { fileTypeFromBuffer } from 'file-type'

const app = fastify()
app.register(multipart, {
	attachFieldsToBody: 'keyValues'
})

app.post(
	'/upload',
	{
		schema: {
			body: {
				type: 'object',
				properties: {
					file: { type: 'object' }
				},
				required: ['file']
			}
		}
	},
	async (req, res) => {
		const file = req.body.file
		if (!file) return res.status(422).send('未上传文件')

		const type = await fileTypeFromBuffer(file)
		if (!type || !type.mime.startsWith('image/'))
			return res.status(422).send('文件不是有效的图像')

		res.header('Content-Type', type.mime)
		res.send(file)
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `fastify-multipart` 处理文件上传，假装 `type: object` 以允许 Buffer

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

> Elysia 使用 `t.File` 处理文件和 mimetype 验证

</template>

</Compare>

由于 **multer** 不验证 mimetype，您需要使用 **file-type** 或类似库手动验证 mimetype。

而 Elysia 自动验证文件上传，使用 **file-type** 自动验证 mimetype。

## 生命周期事件

Fastify 和 Elysia 都有一些类似的生命周期事件，采用基于事件的方法。

### Elysia 生命周期
Elysia 的生命周期事件可以如下所示。
![Elysia 生命周期图](/assets/lifecycle-chart.svg)
> 点击图片放大

### Fastify 生命周期
Fastify 生命周期事件也采用类似 Elysia 的基于事件的方式。

两者拦截请求和响应生命周期事件的语法也较为相似，但 Elysia 不需要您调用 `done` 来继续生命周期事件。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'

const app = fastify()

// 全局中间件
app.addHook('onRequest', (request, reply, done) => {
	console.log(`${request.method} ${request.url}`)

	done()
})

app.get(
	'/protected',
	{
		// 路由特定中间件
		preHandler(request, reply, done) {
			const token = request.headers.authorization

			if (!token) reply.status(401).send('未授权')

			done()
		}
	},
	(request, reply) => {
		reply.send('受保护的路由')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `addHook` 注册中间件，并需要手动调用 `done` 来继续生命周期事件

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

> Elysia 自动检测生命周期事件，无需调用 `done` 来继续生命周期事件

</template>

</Compare>

## 类型安全性
Elysia 设计上具备强类型安全性。

例如，您可以使用 [derive](/essential/life-cycle.html#derive) 和 [resolve](/essential/life-cycle.html#resolve) 以 **类型安全** 的方式自定义上下文，而 Fastify 则不能。

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Fastify]
// @errors: 2339
import fastify from 'fastify'

const app = fastify()

app.decorateRequest('version', 2)

app.get('/version', (req, res) => {
	res.send(req.version)
	//            ^?
})

app.get(
	'/token',
	{
		preHandler(req, res, done) {
			const token = req.headers.authorization

			if (!token) return res.status(401).send('未授权')

			// @ts-ignore
			req.token = token.split(' ')[1]

			done()
		}
	},
	(req, res) => {
		req.version
		//  ^?

		res.send(req.token)
		//            ^?
	}
)

app.listen({
	port: 3000
})
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `decorateRequest`，但不提供强类型安全性

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

> Elysia 使用 `decorate` 扩展上下文，并使用 `resolve` 将自定义属性添加到上下文中

</template>

</Compare>

虽然 Fastify 可以使用 `declare module` 来扩展 `FastifyRequest` 接口，但这是全局可用的，并不具备强类型安全，也不能保证该属性在所有请求处理程序中都可用。

```ts
declare module 'fastify' {
  	interface FastifyRequest {
    	version: number
  		token: string
  	}
}
```
> 上述 Fastify 示例需要此声明，但它并不提供强类型安全

## 中间件参数
Fastify 使用函数返回 Fastify 插件定义命名中间件，而 Elysia 使用 [macro](/patterns/macro) 定义自定义钩子。

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Fastify]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
// @errors: 2339
import fastify from 'fastify'
import type { FastifyRequest, FastifyReply } from 'fastify'

const app = fastify()

const role =
	(role: 'user' | 'admin') =>
	(request: FastifyRequest, reply: FastifyReply, next: Function) => {
		const user = findUser(request.headers.authorization)

		if (user.role !== role) return reply.status(401).send('未授权')

		// @ts-ignore
		request.user = user

		next()
	}

app.get(
	'/token',
	{
		preHandler: role('admin')
	},
	(request, reply) => {
		reply.send(request.user)
		//            ^?
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用函数回调接受中间件的自定义参数

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

> Elysia 使用 macro 传递自定义参数给自定义中间件

</template>

</Compare>

虽然 Fastify 使用函数回调，但它需要返回一个放置在事件处理程序中的函数或表示钩子的对象，这在需要多个自定义函数时可能很难处理，因为您需要将它们合并到一个对象中。

## 错误处理

Fastify 和 Elysia 都提供生命周期事件来处理错误。

<Compare>

<template v-slot:left>

::: code-group

```ts
import fastify from 'fastify'

const app = fastify()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

// 全局错误处理程序
app.setErrorHandler((error, request, reply) => {
	if (error instanceof CustomError)
		reply.status(500).send({
			message: '出现问题！',
			error
		})
})

app.get(
	'/error',
	{
		// 路由特定错误处理程序
		errorHandler(error, request, reply) {
			reply.send({
				message: '仅此路由适用！',
				error
			})
		}
	},
	(request, reply) => {
		throw new CustomError('哦 uh')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `setErrorHandler` 作为全局错误处理器，使用 `errorHandler` 作为路由特定错误处理器

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

	// 可选：应将什么发送给客户端
	toResponse() {
		return {
			message: "如果您看到此消息，我们的开发人员忘记处理此错误",
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
				message: '出现问题！',
				error
			}
	})
	.get('/error', () => {
		throw new CustomError('哦 uh')
	}, {
		// 可选：路由特定错误处理程序
		error({ error }) {
			return {
				message: '仅此路由适用！',
				error
			}
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 提供自定义错误代码，简化状态码设置和 `toResponse` 用于错误映射响应。

</template>

</Compare>

尽管两者都提供生命周期事件进行错误处理，Elysia 还提供了：

1. 自定义错误代码
2. 映射 HTTP 状态码和 `toResponse` 用于将错误映射到响应

错误代码非常有助于日志记录和调试，并且在区分扩展同一类的不同类型错误时非常重要。

Elysia 提供了所有这些类型安全，而 Fastify 则没有。

## 封装

Fastify 封装插件的副作用，而 Elysia 通过显式的作用域机制和代码顺序让您控制插件的副作用。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import type { FastifyPluginCallback } from 'fastify'

const subRouter: FastifyPluginCallback = (app, opts, done) => {
	app.addHook('preHandler', (request, reply) => {
		if (!request.headers.authorization?.startsWith('Bearer '))
			reply.code(401).send({ error: '未授权' })
	})

	done()
}

const app = fastify()
	.get('/', (request, reply) => {
		reply.send('Hello World')
	})
	.register(subRouter)
	// 没有来自 subRouter 的副作用
	.get('/side-effect', () => 'hi')
```

:::
</template>

<template v-slot:left-content>

> Fastify 封装插件的副作用

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
    // 没有来自 subRouter 的副作用
    .get('/side-effect', () => 'hi')
```

:::
</template>

<template v-slot:right-content>

> Elysia 封装插件的副作用，除非显式声明

</template>

</Compare>

两者均有插件封装机制以防止副作用。

然而，Elysia 可以显式声明哪个插件应该有副作用，通过声明作用域，而 Fastify 始终将其封装。

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	// 仅限于父实例的作用域，但不超出
	.as('scoped') // [!code ++]

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // [!code ++]
    // 现在有来自 subRouter 的副作用
    .get('/side-effect', () => 'hi')
```

Elysia 提供三种作用域机制：
1. **local** - 只应用于当前实例，无副作用（默认）
2. **scoped** - 将副作用限制在父实例内，但不超出
3. **global** - 影响所有实例

---

由于 Fastify 不提供作用域机制，我们需要：

1. 为每个钩子创建一个函数并手动附加
2. 使用高阶函数，将其应用到需要副作用的实例上

然而，这可能导致不正确处理时产生重复副作用。

```ts
import fastify from 'fastify'
import type {
	FastifyRequest,
	FastifyReply,
	FastifyPluginCallback
} from 'fastify'

const log = (request: FastifyRequest, reply: FastifyReply, done: Function) => {
	console.log('中间件已执行')

	done()
}

const app = fastify()

app.addHook('onRequest', log)
app.get('/main', (request, reply) => {
	reply.send('来自主路由的问候！')

})

const subRouter: FastifyPluginCallback = (app, opts, done) => {
	app.addHook('onRequest', log)

	// 这将记录两次
	app.get('/sub', (request, reply) => {
		return reply.send('来自子路由的问候！')
	})

	done()
}

app.register(subRouter, {
	prefix: '/sub'
})

app.listen({
	port: 3000
})
```

对应此情况，Elysia 提供插件去重机制，防止重复副作用。

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ name: 'subRouter' }) // [!code ++]
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	.as('scoped')

const app = new Elysia()
	.get('/', 'Hello World')
	.use(subRouter)
	.use(subRouter) // [!code ++]
	.use(subRouter) // [!code ++]
	.use(subRouter) // [!code ++]
	// 副作用只调用一次
	.get('/side-effect', () => 'hi')
```

通过使用唯一的 `name`，Elysia 仅会应用该插件一次，避免重复副作用。

## Cookie
Fastify 使用 `@fastify/cookie` 来解析 cookie，而 Elysia 内置支持 cookie，使用基于信号的方法处理 cookie。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import cookie from '@fastify/cookie'

const app = fastify()

app.use(cookie, {
	secret: 'secret',
	hook: 'onRequest'
})

app.get('/', function (request, reply) {
	request.unsignCookie(request.cookies.name)

	reply.setCookie('name', 'value', {
      	path: '/',
      	signed: true
    })
})
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `unsignCookie` 验证 cookie 签名，使用 `setCookie` 设置 cookie

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

		// cookie 签名自动签名
		name.value = 'value'
		name.maxAge = 1000 * 60 * 60 * 24
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用基于信号的方法处理 cookie，并自动处理签名验证

</template>

</Compare>


## OpenAPI
两者都使用 Swagger 提供 OpenAPI 文档，但 Elysia 默认使用 Scalar UI，这是一种更现代且用户友好的 OpenAPI 文档界面。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import swagger from '@fastify/swagger'

const app = fastify()
app.register(swagger, {
	openapi: '3.0.0',
	info: {
		title: '我的 API',
		version: '1.0.0'
	}
})

app.addSchema({
	$id: 'user',
	type: 'object',
	properties: {
		name: {
			type: 'string',
			description: '仅限名字'
		},
		age: { type: 'integer' }
	},
	required: ['name', 'age']
})

app.post(
	'/users',
	{
		schema: {
			summary: '创建用户',
			body: {
				$ref: 'user#'
			},
			response: {
				'201': {
					$ref: 'user#'
				}
			}
		}
	},
	(req, res) => {
		res.status(201).send(req.body)
	}
)

await fastify.ready()
fastify.swagger()
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `@fastify/swagger` 进行 OpenAPI 文档的生成

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

const app = new Elysia()
	.use(openapi()) // [!code ++]
	.model({
		user: t.Array(
			t.Object({
				name: t.String(),
				age: t.Number()
			})
		)
	})
	.post('/users', ({ body }) => body, {
	//                  ^?
		body: 'user',
		response: {
			201: 'user'
		},
		detail: {
			summary: '创建用户'
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia 使用 `@elysiajs/swagger` 进行 OpenAPI 文档生成，默认使用 Scalar，也可以选择使用 Swagger

</template>

</Compare>

两者都支持 OpenAPI 文档中使用 `$ref` 进行模型引用，但 Fastify 不支持在指定模型名称时的类型安全和自动补全，而 Elysia 支持。

## 测试

Fastify 内置支持测试，使用 `fastify.inject()` **模拟** 网络请求，而 Elysia 使用 Web 标准 API 进行 **实际** 请求。

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import request from 'supertest'
import { describe, it, expect } from 'vitest'

function build(opts = {}) {
  	const app = fastify(opts)

  	app.get('/', async function (request, reply) {
	    reply.send({ hello: 'world' })
	})

  	return app
}

describe('GET /', () => {
	it('应该返回 Hello World', async () => {
  		const app = build()

		const response = await app.inject({
		    url: '/',
		    method: 'GET',
	  })

		expect(res.status).toBe(200)
		expect(res.text).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:left-content>

> Fastify 使用 `fastify.inject()` 模拟网络请求

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

> Elysia 使用 Web 标准 API 处理 **实际** 请求

</template>

</Compare>

此外，Elysia 还提供了一个名为 [Eden](/eden/overview) 的辅助库，提供端到端类型安全，允许我们在测试时获得自动补全和完全的类型安全。

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
Elysia 内置支持使用 [Eden](/eden/overview) 实现 **端到端类型安全**，无需代码生成，而 Fastify 不支持此功能。

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

如果端到端类型安全对您而言很重要，则 Elysia 是您的正确选择。

---

Elysia 提供了更符合人体工程学和开发者友好的体验，专注于性能、类型安全和简洁性，而 Fastify 是 Node.js 的成熟框架之一，但没有次世代框架所提供的**健全的类型安全**和**端到端类型安全**。

如果您正在寻找一个易于使用、具有良好开发体验，并基于 Web 标准 API 的框架，Elysia 是您的理想选择。

另外，如果您来自其他框架，您可以查看：

<Deck>
    <Card title="From Express" href="/migrate/from-express">
  		Express 与 Elysia 的比较
    </Card>
	<Card title="From Hono" href="/migrate/from-hono">
 		Hono 与 Elysia 的比较
	</Card>
	<Card title="From tRPC" href="/migrate/from-trpc">
  		tRPC 与 Elysia 的比较
    </Card>
</Deck>