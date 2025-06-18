---
title: 将 tRPC 服务器集成到 Bun 中与 Elysia
sidebar: false
editLink: false
search: false
head:
  - - meta
    - property: 'og:title'
      content: 将 tRPC 服务器集成到 Bun 中与 Elysia

  - - meta
    - name: 'description'
      content: 学习如何将现有的 tRPC 集成到 Elysia 和 Bun 中，使用 Elysia tRPC 插件，了解更多关于 Elysia 的 Eden 端到端类型安全的内容。

  - - meta
    - property: 'og:description'
      content: 学习如何将现有的 tRPC 集成到 Elysia 和 Bun 中，使用 Elysia tRPC 插件，了解更多关于 Elysia 的 Eden 端到端类型安全的内容。

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/integrate-trpc-with-elysia/elysia-trpc.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/integrate-trpc-with-elysia/elysia-trpc.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="将 tRPC 服务器集成到 Bun 中与 Elysia"
    src="/blog/integrate-trpc-with-elysia/elysia-trpc.webp"
    alt="Elysia 的 logo 连接着一个加号和 tRPC"
    author="saltyaom"
    date="2023 年 2 月 4 日"
>

最近，tRPC 因其端到端类型安全的方法而成为网络开发的热门选择，它通过模糊前后端之间的界限，自动推断后端的类型，从而加快了开发速度。

帮助开发者更快速、更安全地编写代码，快速发现数据结构迁移时出现的问题，并消除在前端重新创建类型的冗余步骤。

但在扩展 tRPC 时，我们可以做得更多。

## Elysia
Elysia 是一个为 Bun 优化的网络框架，受到包括 tRPC 在内的许多框架的启发。Elysia 默认支持端到端的类型安全，但不同于 tRPC，Elysia 使用许多人已经熟知的类似 Express 的语法，从而消除了 tRPC 的学习曲线。

由于 Bun 是 Elysia 的运行时，Elysia 服务器的速度和吞吐量都非常快，甚至在镜像 JSON 主体时超过了 [Express 的 21 倍和 Fastify 的 12 倍（请参见基准测试）](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/655fe7f87f0f4f73f2121433f4741a9d6cf00de4)。

将现有的 tRPC 服务器结合到 Elysia 中一直是 Elysia 从开始时的首要目标之一。

你可能想要从 tRPC 切换到 Bun 的原因包括：
- 速度显著更快，甚至超过许多在 Nodejs 中运行的流行网络框架，而无需更改一行代码。
- 将 tRPC 与 RESTful 或 GraphQL 扩展，两者可以在同一服务器中共存。
- Elysia 具有像 tRPC 一样的端到端类型安全，但对于大多数开发者几乎没有学习曲线。
- 使用 Elysia 是实验和投资 Bun 运行时的良好起点。

## 创建 Elysia 服务器
要开始，让我们创建一个新的 Elysia 服务器，确保首先安装了 [Bun](https://bun.sh)，然后运行以下命令来搭建 Elysia 项目。
```
bun create elysia elysia-trpc && cd elysia-trpc && bun add elysia
```

::: tip
有时 Bun 无法正确解析最新的字段，因此我们使用 `bun add elysia` 来指定 Elysia 的最新版本。
:::

这将创建一个名为 **"elysia-trpc"** 的文件夹，并预先配置好 Elysia。

让我们通过运行 dev 命令启动开发服务器：
```
bun run dev
```

该命令应在端口 :3000 上启动开发服务器。

## Elysia tRPC 插件
基于 tRPC Web 标准适配器，Elysia 有一个插件，用于将现有的 tRPC 服务器集成到 Elysia 中。
```bash
bun add @trpc/server zod @elysiajs/trpc @elysiajs/cors
```

假设这是一个现有的 tRPC 服务器：
```typescript
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable'

import { z } from 'zod'

const t = initTRPC.create()

export const router = t.router({
    mirror: t.procedure.input(z.string()).query(({ input }) => input),
})

export type Router = typeof router
```

通常我们只需要导出路由器的类型，但要将 tRPC 集成到 Elysia 中，我们还需要导出路由器的实例。

然后在 Elysia 服务器中，我们导入路由器，并使用 `.use(trpc)` 注册 tRPC 路由器。
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors' // [!code ++]
import { trpc } from '@elysiajs/trpc' // [!code ++]

import { router } from './trpc' // [!code ++]

const app = new Elysia()
    .use(cors()) // [!code ++]
    .get('/', () => 'Hello Elysia')
    .use( // [!code ++]
        trpc(router) // [!code ++]
    ) // [!code ++]
    .listen(3000)

console.log(`🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`)
```

就这样！🎉 

这就是将 tRPC 集成到 Elysia 中的所有步骤，使 tRPC 在 Bun 上运行。

## tRPC 配置和上下文
要创建上下文，`trpc` 可以接受第二个参数，这与 `createHTTPServer` 配置 tRPC 的方式相同。

例如，将 `createContext` 添加到 tRPC 服务器中：
```typescript
// trpc.ts
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch' // [!code ++]
import { z } from 'zod'

export const createContext = async (opts: FetchCreateContextFnOptions) => { // [!code ++]
    return { // [!code ++]
        name: 'elysia' // [!code ++]
    } // [!code ++]
} // [!code ++]

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create() // [!code ++]

export const router = t.router({ 
    mirror: t.procedure.input(z.string()).query(({ input }) => input),
})

export type Router = typeof router
```

在 Elysia 服务器中：
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { trpc } '@elysiajs/trpc'

import { router, createContext } from './trpc' // [!code ++]

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello Elysia')
    .use(
        trpc(router, { // [!code ++]
            createContext // [!code ++]
        }) // [!code ++]
    )
    .listen(3000)

console.log(`🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`)
```

我们还可以使用 `endpoint` 指定 tRPC 的自定义端点：
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { trpc } from '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello Elysia')
    .use(
        trpc(router, {
            createContext,
            endpoint: '/v2/trpc' // [!code ++]
        })
    )
    .listen(3000)

console.log(`🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`)
```

## 订阅
默认情况下，tRPC 使用 WebSocketServer 来支持 `subscription`，但不幸的是，因为 Bun 0.5.4 尚不支持 WebSocketServer，所以我们无法直接使用 WebSocket Server。

然而，Bun 确实支持 Web Socket，使用 `Bun.serve`，并且由于 Elysia tRPC 插件已将 tRPC 的 Web Socket 的所有用法接线到 `Bun.serve`，您可以直接使用 Elysia Web Socket 插件的 tRPC `subscription`：

首先安装 Web Socket 插件：
```bash
bun add @elysiajs/websocket
```

然后在 tRPC 服务器内部：
```typescript
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable' // [!code ++]
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import { EventEmitter } from 'stream' // [!code ++]

import { zod } from 'zod'

export const createContext = async (opts: FetchCreateContextFnOptions) => {
    return {
        name: 'elysia'
    }
}

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create()
const ee = new EventEmitter() // [!code ++]

export const router = t.router({
    mirror: t.procedure.input(z.string()).query(({ input }) => {
        ee.emit('listen', input) // [!code ++]

        return input
    }),
    listen: t.procedure.subscription(() => // [!code ++]
        observable<string>((emit) => { // [!code ++]
            ee.on('listen', (input) => { // [!code ++]
                emit.next(input) // [!code ++]
            }) // [!code ++]
        }) // [!code ++]
    ) // [!code ++]
})

export type Router = typeof router
```

然后我们注册：
```typescript
import { Elysia, ws } from 'elysia'
import { cors } from '@elysiajs/cors'
import '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .use(ws()) // [!code ++]
    .get('/', () => 'Hello Elysia')
    .trpc(router, {
        createContext
    })
    .listen(3000)

console.log(`🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`)
```

这就是将现有完整功能的 tRPC 服务器集成到 Elysia 服务器的所有步骤，从而使 tRPC 在 Bun 上运行 🥳。

当您需要同时使用 tRPC 和 REST API 时，Elysia 非常出色，因为它们可以在一个服务器中共存。

## 奖励：使用 Eden 的类型安全 Elysia
由于 Elysia 受到 tRPC 的启发，Elysia 也默认支持像 tRPC 一样的端到端类型安全，使用 **"Eden"**。

这意味着您可以使用类似 Express 的语法创建完全类型支持的 RESTful API，就像 tRPC 一样。

<video src="/blog/integrate-trpc-with-elysia/elysia-eden.mp4" controls="controls" muted="muted" style="max-height:640px; min-height: 200px">
</video>

要开始，让我们导出应用程序类型。

```typescript
import { Elysia, ws } from 'elysia'
import { cors } from '@elysiajs/cors'
import { trpc } from '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .use(ws())
    .get('/', () => 'Hello Elysia')
    .use(
        trpc(router, {
            createContext
        })
    )
    .listen(3000)

export type App = typeof app // [!code ++]

console.log(`🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`)
```

在客户端：
```bash
bun add @elysia/eden && bun add -d elysia
```

在代码中：
```typescript
import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../server'

// 这现在具有来自服务器的所有类型推断
const app = edenTreaty<App>('http://localhost:3000')

// data 将具有值 'Hello Elysia'，并且类型为 'string'
const data = await app.index.get()
```

当您希望获得像 tRPC 一样的端到端类型安全，但需要支持更标准的模式（如 REST），同时仍然要支持 tRPC 或需要从一个迁移到另一个时，Elysia 是一个不错的选择。

## 奖励：Elysia 的额外提示
你可以做的另一个附加事情是，Elysia 不仅支持 tRPC 和端到端类型安全，还有各种为 Bun 配置的基本插件支持。

例如，您可以仅用一行代码使用 [Swagger 插件](/plugins/swagger) 生成文档。
```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger' // [!code ++]

const app = new Elysia()
    .use(swagger()) // [!code ++]
    .setModel({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .get('/', () => 'Hello Elysia')
    .post('/typed-body', ({ body }) => body, {
        schema: {
            body: 'sign',
            response: 'sign'
        }
    })
    .listen(3000)

export type App = typeof app

console.log(`🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`)
```

或者当您想在 Bun 上使用 [GraphQL Apollo](/plugins/graphql-apollo) 时。
```typescript
import { Elysia } from 'elysia'
import { apollo, gql } from '@elysiajs/apollo' // [!code ++]

const app = new Elysia()
    .use( // [!code ++]
        apollo({ // [!code ++]
            typeDefs: gql` // [!code ++]
                type Book { // [!code ++]
                    title: String // [!code ++]
                    author: String // [!code ++]
                } // [!code ++]
 // [!code ++]
                type Query { // [!code ++]
                    books: [Book] // [!code ++]
                } // [!code ++]
            `, // [!code ++]
            resolvers: { // [!code ++]
                Query: { // [!code ++]
                    books: () => { // [!code ++]
                        return [ // [!code ++]
                            { // [!code ++]
                                title: 'Elysia', // [!code ++]
                                author: 'saltyAom' // [!code ++]
                            } // [!code ++]
                        ] // [!code ++]
                    } // [!code ++]
                } // [!code ++]
            } // [!code ++]
        }) // [!code ++]
    ) // [!code ++]
    .get('/', () => 'Hello Elysia')
    .listen(3000)

export type App = typeof app

console.log(`🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`)
```

或使用社区 [OAuth 2.0 插件](https://github.com/bogeychan/elysia-oauth2)。

总之，Elysia 是学习/使用 Bun 及其生态系统的绝佳起点。

如果您想了解更多 Elysia，[Elysia 文档](https://elysiajs.com) 是探索概念和模式的一个很好的起点。如果您遇到困难或需要帮助，请随时在 [Elysia Discord](https://discord.gg/eaFJ2KDJck) 中与我们联系。

所有代码的仓库可以在 [https://github.com/saltyaom/elysia-trpc-demo](https://github.com/saltyaom/elysia-trpc-demo) 找到，欢迎您随意尝试和反馈。
</Blog>
