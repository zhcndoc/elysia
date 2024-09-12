---
title: 将 tRPC 服务器集成到 Bun 中，使用 Elysia
sidebar: false
editLink: false
search: false
head:
  - - meta
    - property: 'og:title'
      content: 将 tRPC 服务器集成到 Bun 中，使用 Elysia

  - - meta
    - name: 'description'
      content: 了解如何将现有的 tRPC 集成到 Elysia 和 Bun 中，以及更多关于 Elysia 端到端类型安全性的信息。

  - - meta
    - property: 'og:description'
      content: 了解如何将现有的 tRPC 集成到 Elysia 和 Bun 中，以及更多关于 Elysia 端到端类型安全性的信息。

  - - meta
    - property: 'og:image'
      content: https://elysia.zhcndoc.com/blog/integrate-trpc-with-elysia/elysia-trpc.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysia.zhcndoc.com/blog/integrate-trpc-with-elysia/elysia-trpc.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="将 tRPC 服务器集成到 Bun 中，使用 Elysia"
    src="/blog/integrate-trpc-with-elysia/elysia-trpc.webp"
    alt="Elysia 连接图标与 tRPC 的加号"
    author="saltyaom"
    date="2023 年 2 月 4 日"
>

tRPC 最近成为了 web 开发的流行选择，这要归功于其端到端类型安全的方法，这种方法通过模糊前端和后端之间的界限，以及自动推断类型，加速开发过程。

帮助开发者更快、更安全地编写代码，让他们在迁移数据结构时立即知道何时出现问题，并消除前端再次创建类型的多余步骤。

但是我们可以扩展 tRPC 的功能。

## Elysia
Elysia 是一个针对 Bun 优化的 web 框架，受到了许多框架的启发，包括 tRPC。Elysia 默认支持端到端类型安全，但与 tRPC 不同，Elysia 使用了许多开发者已经熟悉的 Express 样式的语法，从而消除了 tRPC 的学习曲线。

由于 Bun 是 Elysia 的运行时，Elysia 服务器的速度和吞吐量非常快，甚至在与 Node.js 运行时相比时，性能提升了 21 倍到 12 倍。

将现有的 tRPC 服务器集成到 Elysia 一直是 Elysia 从一开始就设定的重要目标之一。

你可能想要从 tRPC 切换到 Bun 的理由：
- 显著提高速度，甚至在不需要更改任何代码的情况下比许多流行的 web 框架运行得更快。
- 扩展 tRPC 以支持 RESTful 或 GraphQL，两者可以在同一个服务器中共存。
- Elysia 提供了与 tRPC 类似的端到端类型安全性，但是对于大多数开发者来说几乎没有学习曲线。
- 使用 Elysia 是开始尝试/投资 Bun 运行时的好方法。

## 创建 Elysia 服务器
要开始，让我们创建一个新的 Elysia 服务器。确保你已经安装了 [Bun](https://bun.sh)，然后运行以下命令来生成 Elysia 项目。
```
bun create elysia elysia-trpc && cd elysia-trpc && bun add elysia
```

::: tip
有时 Bun 无法正确解析最新字段，因此我们使用 `bun add elysia` 来指定 Elysia 的最新版本。
:::

这将创建一个名为 **“elysia-trpc”** 的文件夹，其中预配置了 Elysia。

让我们通过运行开发服务器命令来启动开发服务器：
```
bun run dev
```

此命令应该在端口：3000 启动开发服务器。

## Elysia tRPC 插件
在 tRPC Web Standard 适配器的基础上构建，Elysia 提供了一个插件，用于将现有的 tRPC 服务器集成到 Elysia 中。
```bash
bun add @trpc/server zod @elysiajs/trpc @elysiajs/cors
```

假设这是现有的 tRPC 服务器：
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

通常，我们只需要导出类型路由器就能使用 tRPC，但是要将 tRPC 集成到 Elysia，我们需要导出路由器的实例。

然后在 Elysia 服务器中，我们导入路由器并使用 `.use(trpc)` 注册 tRPC 路由器。
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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

就是这样！🎉

这就是将 tRPC 集成到 Elysia 所需的一切，从而让 tRPC 在 Bun 上运行。

## tRPC 配置和上下文
为了创建上下文，`trpc` 可以接受第二个参数，这个参数可以像 `createHTTPServer` 一样配置 tRPC。

例如，在 tRPC 服务器中添加 `createContext`：
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

然后在 Elysia 服务器中：
```typescript
import { Elysia, ws } from 'elysia'
import { cors } from '@elysiajs/cors'
import '@elysiajs/trpc'

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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

我们可以使用 `endpoint` 指定 tRPC 的自定义端点：
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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

## 订阅
默认情况下，tRPC 使用 WebSocketServer 支持 `subscription`，但由于 Bun 0.5.4 不支持 WebSocketServer，我们无法直接使用 WebSocket Server。

然而，Bun 支持使用 `Bun.serve` 的 Web Socket，并且 Elysia tRPC 插件已经将 tRPC 的 Web Socket 使用全部线接到 `Bun.serve` 中，你可以直接在 Elysia Web Socket 插件中使用 tRPC 的 `subscription`：

首先安装 Web Socket 插件：
```bash
bun add @elysiajs/websocket
```

然后在 tRPC 服务器中：
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

然后在 Elysia 服务器中注册：
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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

这样就完成了将现有功能齐全的 tRPC 服务器集成到 Elysia 服务器中，从而让 tRPC 在 Bun 上运行。

当您需要支持 tRPC 和 REST API 时，Elysia 是完美的选择，因为它们可以在同一个服务器中共存。

## 额外福利：使用 Eden 的类型安全 Elysia
由于 Elysia 受到 tRPC 的启发，因此它也支持端到端的类型安全性，默认使用 **“Eden”**。

这意味着你可以使用类似于 tRPC 的客户端代码，使用 Express 样式的语法创建 RESTful API，并具有完全的类型支持。

<video src="/blog/integrate-trpc-with-elysia/elysia-eden.mp4" controls="controls" muted="muted" style="max-height:640px; min-height: 200px">
</video>

要开始，让我们导出应用类型。

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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

然后在客户端代码中：
```bash
bun add @elysia/eden && bun add -d elysia
```

然后在代码中：
```typescript
import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../server'

// 现在这个有了来自服务器的所有类型推断
const app = edenTreaty<App>('http://localhost:3000')

// data 将会有一个值为 'Hello Elysia' 的值，并有一个类型为 'string'
const data = await app.index.get()
```

Elysia 是一个很好的选择，当您想要实现类似 tRPC 的端到端类型安全性，但又需要支持更多标准模式如 REST，并且仍然需要支持 tRPC 或需要迁移其中之一时。

## 额外提示：有关 Elysia 的附加信息
您可以使用 Elysia 来实现不仅具有 tRPC 和端到端类型安全支持，还配置了许多专为 Bun 设计的关键插件的各种支持。

例如，您可以使用 [Swagger 插件](/plugins/swagger)一行代码即可生成 Swagger 文档。
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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

或者，当您想在 Bun 上使用 [GraphQL Apollo](/plugins/graphql-apollo) 时。
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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

支持 OAuth 2.0 或使用[社区 OAuth 插件](https://github.com/bogeychan/elysia-oauth2)。

然而，Elysia 是开始学习/使用 Bun 及其周围生态系统的绝佳选择。

如果您想了解更多关于 Elysia 的信息，[Elysia 文档](https://elysia.zhcndoc.com)是一个很好的开始，可以探索概念和模式；如果遇到困难或需要帮助，欢迎在 [Elysia Discord](https://discord.gg/eaFJ2KDJck) 上寻求支持。

所有代码的存储库可在 [https://github.com/saltyaom/elysia-trpc-demo](https://github.com/saltyaom/elysia-trpc-demo) 找到，欢迎实验和探讨。
</Blog>
