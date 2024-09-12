---
title: 使用 Elysia 加速您的下一个 Prisma 服务器
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 使用 Elysia 加速您的下一个 Prisma 服务器

    - - meta
      - name: 'description'
        content: 通过 Bun 和 Elysia 对 Prisma 的支持，我们进入了一个新的开发体验时代。对于 Prisma，我们可以加速与数据库的交互，而 Elysia 则可以加速后端 web 服务器的创建，在开发体验和性能方面都提供了提升。


    - - meta
      - property: 'og:description'
        content: 通过 Bun 和 Elysia 对 Prisma 的支持，我们进入了一个新的开发体验时代。对于 Prisma，我们可以加速与数据库的交互，而 Elysia 则可以加速后端 web 服务器的创建，在开发体验和性能方面都提供了提升。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/with-prisma/prism.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/with-prisma/prism.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
title="使用 Elysia 加速您的下一个 Prisma 服务器"
src="/blog/with-prisma/prism.webp"
alt="中心放置的三角形棱镜"
author="saltyaom"
date="2023 年 6 月 4 日"
>
Prisma 是一种著名的 TypeScript ORM，以其出色的开发体验而著称。

Prisma 提供了一组类型安全的、直观的 API，这些 API 允许我们使用流畅、自然的语法与数据库进行交互。

编写数据库查询就像使用 TypeScript 自动完成功能编写数据形状一样简单，Prisma 会负责生成高效的 SQL 查询并在后台处理数据库连接。

Prisma 的一个显著特点是它与流行数据库的紧密集成，包括：
- PostgreSQL
- MySQL
- SQLite
- SQL Server
- MongoDB
- CockroachDB

这意味着我们可以选择最适合项目需求的数据库，同时不会牺牲 Prisma 提供的强大性能。

这意味着你可以专注于真正重要的内容：构建应用程序逻辑。

Prisma 一直是对 Elysia 的一个灵感来源，它的声明式 API 和流畅的开发体验使用起来是一种绝对的乐趣。

现在，随着 [Bun 0.6.7](https://bun.sh/blog/bun-v0.6.7) 的发布，Bun 现在支持 Prisma 开箱即用。

## Elysia

当被问到你应该使用哪个框架与 Bun 搭配时，Elysia 是一个可能浮现在脑海中的答案。

尽管你可以使用 Express 与 Bun 搭配，但 Elysia 是专门为 Bun 构建的。

Elysia 可以以约 19 倍的速度超过 Express，它拥有一个声明式 API，用于创建统一类型系统和端到端类型安全。

Elysia 还以其流畅的开发体验而闻名，特别是自从 Elysia 的早期日子就开始与 Prisma 设计使用。

Elysia 的严格类型验证可以轻松地与 Prisma 集成，使用声明式 API。

换句话说，Elysia 将确保运行时类型与 TypeScript 的类型始终保持同步，使得类型系统完全值得信赖，并能够提前发现任何类型错误，以及更容易调试与类型相关的错误。

## 设置

我们需要做的就是运行 `bun create` 来设置一个 Elysia 服务器

```bash
bun create elysia elysia-prisma
```

在这里，`elysia-prisma` 是我们的项目名称 (文件夹目的地)，可以随意更改名称。

现在在我们的文件夹中，让我们将 Prisma CLI 作为开发依赖项安装。
```ts
bun add -d prisma
```

然后我们可以使用 `prisma init` 设置 Prisma 项目：
```ts
bunx prisma init
```

`bunx` 是 bun 命令，相当于 `npx`，允许我们执行包二进制文件。

设置完成后，我们可以看到 Prisma 将更新 `.env` 文件，并在 `prisma` 文件夹中生成一个名为 **schema.prisma** 的文件。

**schema.prisma** 是使用 Prisma 的模式语言定义的数据库模型。

让我们更新我们的 **schema.prisma** 文件，用于演示：
```ts
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int     @id @default(autoincrement())
  username  String  @unique
  password  String
}
```

这告诉 Prisma，我们想要创建一个名为 **User** 的表，其中包含以下列：
| 列 | 类型 | 约束 |
| --- | --- | --- |
| id  | 数字 | 主键，具有自动递增 |
| username | 字符串 | 唯一 |
| password | 字符串 | - |

Prisma 会读取模式，并从 `.env` 文件中获取 DATABASE_URL，因此在同步数据库之前，我们需要首先定义 `DATABASE_URL`。

由于我们没有运行任何数据库，我们可以使用 Docker 设置一个：
```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=12345678 -d postgres
```

现在进入项目根目录的 `.env` 文件，然后编辑：
```
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/db?schema=public"
```

然后我们可以运行 `prisma migrate` 来同步我们的数据库与 Prisma 模式：
```bash
bunx prisma migrate dev --name init
```

Prisma 会根据我们的模式生成一个强类型的 Prisma Client 代码。

这意味着我们在代码编辑器中得到自动完成和类型检查，在编译时而不是运行时捕获潜在错误。

## 进入代码

在我们的 **src/index.ts** 中，让我们更新我们的 Elysia 服务器，创建一个简单的用户注册端点。

```ts
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client' // [!code ++]

const db = new PrismaClient() // [!code ++]

const app = new Elysia()
    .post( // [!code ++]
        '/sign-up', // [!code ++]
        async ({ body }) => db.user.create({ // [!code ++]
            data: body // [!code ++]
        }) // [!code ++]
    ) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

我们刚刚创建了一个简单的端点，用于将新用户插入我们的数据库中，使用 Elysia 和 Prisma。

::: tip
**非常重要**，当返回 Prisma 函数时，你应该总是将回调函数标记为 `async`。

因为 Prisma 函数不会返回原生 Promise，Elysia 不能动态处理自定义 Promise 类型，但是通过静态代码分析，标记回调函数为 `async`，Elysia 将尝试等待函数的返回类型，从而允许我们映射 Prisma 结果。
:::

现在的问题是，body 可以是任何东西，不限于我们定义的类型。

我们可以通过使用 Elysia 的类型系统来提高这一点。
```ts
import { Elysia, t } from 'elysia' // [!code ++]
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .post(
        '/sign-up', 
        async ({ body }) => db.user.create({
            data: body
        }),
        { // [!code ++]
            body: t.Object({ // [!code ++]
                username: t.String(), // [!code ++]
                password: t.String({ // [!code ++]
                    minLength: 8 // [!code ++]
                }) // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

这告诉 Elysia 验证传入请求的 body 是否与形状匹配，并更新回调内 `body` 的 TypeScript 类型以匹配确切的相同类型：
```ts
// 'body' 现在被类型化为以下内容:
{
    username: string
    password: string
}
```

这意味着如果你修改表或执行迁移，并且类型冲突，它会立即警告你。

这对于需要编辑表或执行迁移时非常有用，因为 Elysia 可以在问题到达生产之前立即逐行记录类型错误。

## 错误处理
由于我们的 `username` 字段是唯一的，有时候 Prisma 可能会抛出错误，因为 `username` 可能不小心重复了，当我们尝试注册时就像这样：
```ts
Invalid `prisma.user.create()` invocation:

Unique constraint failed on the fields: (`username`)
```

默认的 Elysia 错误处理程序可以自动处理这种情况，但我们可以通过使用 Elysia 的本地 `onError` 钩子来改进它：
```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .post(
        '/',
        async ({ body }) => db.user.create({
            data: body
        }),
        {
            error({ code }) {  // [!code ++]
                switch (code) {  // [!code ++]
                    // Prisma P2002: "Unique constraint failed on the {constraint}"  // [!code ++]
                    case 'P2002':  // [!code ++]
                        return {  // [!code ++]
                            error: 'Username must be unique'  // [!code ++]
                        }  // [!code ++]
                }  // [!code ++]
            },  // [!code ++]
            body: t.Object({
                username: t.String(),
                password: t.String({
                    minLength: 8
                })
            })
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

使用 `error` 钩子，任何回调中抛出的错误都会被填充到 `error` 钩子中，允许我们定义自定义错误处理程序。

根据 [Prisma 文档](https://www.prisma.io/docs/reference/api-reference/error-reference#p2002)，错误代码 ‘P2002’ 意味着执行查询将失败唯一性约束。

因为这个表只有 `username` 字段是唯一的，我们可以推断错误是因为用户名不唯一，所以我们返回一个自定义错误消息：
```ts
{
    error: 'Username must be unique'
}
```

这将返回一个 JSON，其内容是我们自定义的错误消息，当唯一性约束失败时。

这允许我们无缝地定义任何自定义错误。

## 额外：参考模式
当我们的服务器变得复杂，并且类型变得更加冗余并成为样板代码时，内联 Elysia 类型可以通过使用**参考模式**得到改进。

简单来说，我们可以为我们的模式命名并引用类型，通过使用名称。

```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .model({ // [!code ++]
        'user.sign': t.Object({ // [!code ++]
            username: t.String(), // [!code ++]
            password: t.String({ // [!code ++]
                minLength: 8 // [!code ++]
            }) // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .post(
        '/',
        async ({ body }) => db.user.create({
            data: body
        }),
        {
            error({ code }) {
                switch (code) {
                    // Prisma P2002: "Unique constraint failed on the {constraint}"
                    case 'P2002':
                        return {
                            error: 'Username must be unique'
                        }
                }
            },
            body: 'user.sign', // [!code ++]
            body: t.Object({ // [!code --]
                username: t.String(), // [!code --]
                password: t.String({ // [!code --]
                    minLength: 8 // [!code --]
                }) // [!code --]
            }) // [!code --]
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

这工作得和内联一样，但是你只在定义一次后引用模式名称，以消除重复的验证代码。

TypeScript 和验证代码将按预期工作。

## 额外：文档
作为一个额外，Elysia 类型系统也是 OpenAPI Schema 3.0 兼容的，这意味着它可以使用支持 OpenAPI Schema 的工具 (如 Swagger) 生成文档。

我们可以使用 Elysia Swagger 插件来生成一个 API 文档，只需一行代码。

```bash
bun add @elysiajs/swagger
```

然后只需添加插件：

```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { swagger } from '@elysiajs/swagger' // [!code ++]

const db = new PrismaClient()

const app = new Elysia()
    .use(swagger()) // [!code ++]
    .post(
        '/',
        async ({ body }) =>
            db.user.create({
                data: body,
                select: { // [!code ++]
                    id: true, // [!code ++]
                    username: true // [!code ++]
                } // [!code ++]
            }),
        {
            error({ code }) {
                switch (code) {
                    // Prisma P2002: "Unique constraint failed on the {constraint}"
                    case 'P2002':
                        return {
                            error: 'Username must be unique'
                        }
                }
            },
            body: t.Object({
                username: t.String(),
                password: t.String({
                    minLength: 8
                })
            }),
            response: t.Object({ // [!code ++]
                id: t.Number(), // [!code ++]
                username: t.String() // [!code ++]
            }) // [!code ++]
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

这就是创建一个严格定义文档所需的一切。

<img class="-png" src="/blog/with-prisma/swagger.webp" alt="Elysia 生成的 Swagger 文档" />

由于定义了严格的类型，我们发现我们错误地从 API 返回了 `password` 字段，这是不应该返回私密信息的。

由于 Elysia 的类型系统，我们定义了响应不应包含 `password`，这自动警告我们，我们的 Prisma 查询正在返回密码，使我们能够提前修复问题。

如果还有更多，我们不用担心可能会忘记 OpenAPI Schema 3.0 的规格，因为我们在自动完成和类型安全方面都有。

我们可以在 `detail` 中定义我们的路由细节，这也遵循 OpenAPI Schema 3.0，因此我们可以轻松创建文档。

## 下一步是什么
通过 Bun 和 Elysia 对 Prisma 的支持，我们进入了一个新级别的开发体验新时代。

对于 Prisma，我们可以加速与数据库的交互，而 Elysia 则能够加速后端 web 服务器的创建，在开发体验和性能方面都提供了提升。

> 这绝对是一种乐趣。

Elysia 正在创造一个新的标准，为与 Bun 结合的高性能 TypeScript 服务器提供更好的开发体验，以匹配 Go 和 Rust 的性能。

如果你想开始学习关于 Bun 的知识，可以考虑看看 Elysia 能提供什么，特别是[端到端类型安全的概述](/eden/overview)，就像 tRPC 一样，但建立在 REST 标准上，无需任何代码生成。

如果你对 Elysia 感兴趣，请查看我们的 [Discord 服务器](https://discord.gg/eaFJ2KDJck)或查看 [Elysia 在 GitHub](https://github.com/elysiajs/elysia)。
</Blog>
