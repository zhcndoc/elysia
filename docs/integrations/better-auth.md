---
title: 更好的身份验证 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 更好的身份验证 - ElysiaJS

    - - meta
      - name: 'description'
        content: 我们可以使用 @better-auth/cli 来生成身份验证架构并迁移我们的数据库。

    - - meta
      - name: 'og:description'
        content: 我们可以使用 @better-auth/cli 来生成身份验证架构并迁移我们的数据库。
---

# 更好的身份验证

更好的身份验证是一个与框架无关的 TypeScript 身份验证（和授权）框架。

它提供了一整套全面的功能，并包括一个插件生态系统，可以简化添加高级功能。

我们建议在浏览本页面之前，先阅读 [更好的身份验证基本设置](https://www.better-auth.com/docs/installation)。

## 处理程序

在设置了更好的身份验证实例后，我们可以通过 [mount](/patterns/mount.html) 将其挂载到 Elysia。

我们需要将处理程序挂载到 Elysia 端点。

```ts
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia().mount(auth.handler).listen(3000)

console.log(
	`🦊 Elysia 正在 ${app.server?.hostname}:${app.server?.port} 运行`
)
```

然后我们可以通过 `http://localhost:3000/api/auth` 访问更好的身份验证。

### 自定义端点

我们建议在使用 [mount](/patterns/mount.html) 时设置一个前缀路径。

```ts
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia().mount('/auth', auth.handler).listen(3000) // ![代码 ++]

console.log(
	`🦊 Elysia 正在 ${app.server?.hostname}:${app.server?.port} 运行`
)
```

然后我们可以通过 `http://localhost:3000/auth/api/auth` 访问更好的身份验证。

但是这个 URL 看起来有些冗余，我们可以在更好的身份验证实例中将 `/api/auth` 前缀自定义为其他内容。

```ts
import { betterAuth } from 'better-auth'
import { openAPI } from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'

import { Pool } from 'pg'

export const auth = betterAuth({
	basePath: '/' // [!代码 ++]
})
```

然后我们可以通过 `http://localhost:3000/auth` 访问更好的身份验证。

## Swagger / OpenAPI

更好的身份验证支持使用 `better-auth/plugins` 的 `openapi`。

然而，如果我们使用 [@elysiajs/swagger](/plugins/swagger)，您可能希望从更好的身份验证实例中提取文档。

我们可以通过以下代码实现：

```ts
import { openAPI } from 'better-auth/plugins'

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
	getPaths: (prefix = '/auth/api') =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null)

			for (const path of Object.keys(paths)) {
				const key = prefix + path
				reference[key] = paths[path]

				for (const method of Object.keys(paths[path])) {
					const operation = (reference[key] as any)[method]

					operation.tags = ['更好的身份验证']
				}
			}

			return reference
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>
} as const
```

然后在我们使用 `@elysiajs/swagger` 的 Elysia 实例中。

```ts
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { OpenAPI } from './auth'

const app = new Elysia().use(
	swagger({
		documentation: {
			components: await OpenAPI.components,
			paths: await OpenAPI.getPaths()
		}
	})
)
```

## CORS

要配置 CORS，您可以使用 `@elysiajs/cors` 中的 `cors` 插件。

```ts
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { auth } from './auth'

const app = new Elysia()
	.use(
		cors({
			origin: 'http://localhost:3001',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization']
		})
	)
	.mount(auth.handler)
	.listen(3000)

console.log(
	`🦊 Elysia 正在 ${app.server?.hostname}:${app.server?.port} 运行`
)
```

## 宏

您可以结合使用 [macro](https://elysiajs.com/patterns/macro.html#macro) 和 [resolve](https://elysiajs.com/essential/handler.html#resolve) 来在传递给视图之前提供会话和用户信息。

```ts
import { Elysia } from 'elysia'
import { auth } from './auth'

// 用户中间件（计算用户和会话并传递给路由）
const betterAuth = new Elysia({ name: 'better-auth' })
	.mount(auth.handler)
	.macro({
		auth: {
			async resolve({ error, request: { headers } }) {
				const session = await auth.api.getSession({
					headers
				})

				if (!session) return error(401)

				return {
					user: session.user,
					session: session.session
				}
			}
		}
	})

const app = new Elysia()
	.use(betterAuth)
	.get('/user', ({ user }) => user, {
		auth: true
	})
	.listen(3000)

console.log(
	`🦊 Elysia 正在 ${app.server?.hostname}:${app.server?.port} 运行`
)
```

这将允许您在所有路由中访问 `user` 和 `session` 对象。