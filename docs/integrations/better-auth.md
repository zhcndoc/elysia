---
title: Better Authentication - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Better Auth - ElysiaJS
    - - meta
      - name: 'description'
        content: 我们可以使用 @better-auth/cli 来生成身份验证架构并迁移我们的数据库。
    - - meta
      - name: 'og:description'
        content: 我们可以使用 @better-auth/cli 来生成身份验证架构并迁移我们的数据库。
---
# Better Auth
Better Auth 是一个与框架无关的 TypeScript 身份验证（和授权）框架。
它开箱即用地提供了一套全面的功能，并包含一个插件生态系统，简化了高级功能的添加。
在阅读本文档之前，我们建议先阅读 [Better Auth 基础设置](https://www.better-auth.com/docs/installation)。
我们的基础设置将如下所示：
```ts [auth.ts]
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
export const auth = betterAuth({
    database: new Pool()
})
```
## 处理器
设置好 Better Auth 实例后，我们可以通过 [mount](/patterns/mount.html) 将其挂载到 Elysia。
我们需要将处理器挂载到 Elysia 的端点上。
```ts [index.ts]
import { Elysia } from 'elysia'
import { auth } from './auth'
const app = new Elysia()
	.mount(auth.handler) // [!code ++]
	.listen(3000)
console.log(
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```
然后我们就可以通过 `http://localhost:3000/api/auth` 访问 Better Auth。
### 自定义端点
我们建议在使用 [mount](/patterns/mount.html) 时设置一个前缀路径。
```ts [index.ts]
import { Elysia } from 'elysia'
const app = new Elysia()
	.mount('/auth', auth.handler) // [!code ++]
	.listen(3000)
console.log(
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```
然后我们就可以通过 `http://localhost:3000/auth/api/auth` 访问 Better Auth。
但该 URL 看起来有些冗余，因此我们可以在 Better Auth 实例中将 `/api/auth` 前缀自定义为其他内容。
```ts
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
export const auth = betterAuth({
    basePath: '/api' // [!code ++]
})
```
然后我们就可以通过 `http://localhost:3000/auth/api` 访问 Better Auth。
遗憾的是，我们无法将 Better Auth 实例的 `basePath` 设置为空或 `/`。
## OpenAPI
Better Auth 支持通过 `better-auth/plugins` 使用 `openapi`。
然而，如果我们正在使用 [@elysia/openapi](/plugins/openapi)，你可能希望从 Better Auth 实例中提取文档。
首先，我们需要将 `openAPI` 插件添加到我们的 Better Auth 实例中：
```ts [auth.ts]
import { betterAuth } from 'better-auth'
import { openAPI } from 'better-auth/plugins' // [!code ++]
import { Pool } from 'pg'
export const auth = betterAuth({
    database: new Pool(),
    plugins: [openAPI()] // [!code ++]
})
```
::: tip
必须使用 `openAPI()` 插件才能使 `auth.api.generateOpenAPISchema` 可用。否则，你将收到类型错误：`Property 'generateOpenAPISchema' does not exist`。
:::
然后我们可以使用以下代码提取 OpenAPI 架构：
```ts [auth.ts]
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
                    operation.tags = ['Better Auth']
                }
            }
            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const
```
然后在使用 `@elysia/openapi` 的 Elysia 实例中：
```ts
import { Elysia } from 'elysia'
import { openapi } from '@elysia/openapi'
import { OpenAPI } from './auth'
const app = new Elysia().use(
    openapi({
        documentation: {
            components: await OpenAPI.components,
            paths: await OpenAPI.getPaths()
        }
    })
)
```
## CORS
要配置 CORS，你可以使用 `@elysia/cors` 中的 `cors` 插件。
```ts
import { Elysia } from 'elysia'
import { cors } from '@elysia/cors'
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
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```
## 宏
你可以结合使用 [macro](https://elysiajs.com/patterns/macro.html#macro) 与 [resolve](https://elysiajs.com/essential/handler.html#resolve)，在将请求传递给视图之前提供会话和用户信息。
```ts
import { Elysia } from 'elysia'
import { auth } from './auth'
// 用户中间件（计算用户和会话信息并传递给路由）
const betterAuth = new Elysia({ name: 'better-auth' })
    .mount(auth.handler)
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers
                })
                if (!session) return status(401)
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
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```
这将允许你在所有路由中访问 `user` 和 `session` 对象。
