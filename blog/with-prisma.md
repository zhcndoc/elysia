---
url: /blog/with-prisma.md
---

\<Blog
title="用 Elysia 加速你的下一个 Prisma 服务器"
src="/blog/with-prisma/prism.webp"
alt="中心放置的三角棱镜"
author="saltyaom"
date="2023 年 6 月 4 日"

>

Prisma 是一个著名的 TypeScript ORM，以其优秀的开发者体验而闻名。

它提供了类型安全和直观的 API，使我们能够使用流畅自然的语法与数据库进行交互。

编写数据库查询就像使用 TypeScript 的自动补全编写数据结构一样简单，随后 Prisma 会生成高效的 SQL 查询并在后台处理数据库连接。

Prisma 的一个突出特点是它与流行数据库的无缝集成，例如：

* PostgreSQL
* MySQL
* SQLite
* SQL Server
* MongoDB
* CockroachDB

因此，我们可以灵活地选择最适合我们项目需求的数据库，而不必妥协于 Prisma 带来的强大性能。

这意味着你可以专注于真正重要的事情：构建应用程序逻辑。

Prisma 是 Elysia 的灵感之一，其声明性 API 和流畅的开发体验让人愉悦。

现在，我们可以通过 [Bun 0.6.7 的发布](https://bun.sh/blog/bun-v0.6.7) 让期待已久的想法成真，Bun 现在原生支持 Prisma。

## Elysia

当你问应该使用什么框架和 Bun 搭配时，Elysia 是显而易见的选择。

虽然你可以使用 Express 与 Bun，但 Elysia 是专为 Bun 构建的。

Elysia 的性能几乎比 Express 快了 19 倍，结合了声明性 API，能够创建统一的类型系统和端到端的类型安全。

Elysia 以其流畅的开发者体验而闻名，尤其是自早期以来 Elysia 就被设计用于与 Prisma 一起使用。

凭借 Elysia 的严格类型验证，我们可以轻松地使用声明性 API 集成 Elysia 和 Prisma。

换句话说，Elysia 确保运行时类型与 TypeScript 的类型始终同步，使其表现得像一种类型严格的语言，你可以完全信任类型系统，提前发现任何类型错误，减少与类型相关的调试错误。

## 设置

我们开始的第一步是运行 `bun create` 来设置一个 Elysia 服务器。

```bash
bun create elysia elysia-prisma
```

其中 `elysia-prisma` 是我们的项目名称（文件夹目的地），可以自由更改为你喜欢的名称。

现在进入我们的文件夹，安装 Prisma CLI 作为开发依赖。

```ts
bun add -d prisma
```

然后我们可以使用 `prisma init` 设置 Prisma 项目。

```ts
bunx prisma init
```

`bunx` 是 Bun 的命令，相当于 `npx`，允许我们执行包的执行文件。

设置完成后，我们可以看到 Prisma 会更新 `.env` 文件，并生成一个名为 **prisma** 的文件夹，文件夹内有 **schema.prisma** 文件。

**schema.prisma** 是使用 Prisma 的 schema 语言定义的数据库模型。

让我们将 **schema.prisma** 文件更新如下作为演示：

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

这段代码告诉 Prisma 我们想创建一个名为 **User** 的表，包含以下列：
| 列名 | 类型 | 约束 |
| --- | --- | --- |
| id  | 数字 | 主键并自动增值 |
| username | 字符串 | 唯一 |
| password | 字符串 | - |

然后 Prisma 会读取模式，并根据 `.env` 文件中的 DATABASE\_URL，因此在同步我们的数据库之前，我们需要先定义 `DATABASE_URL`。

由于我们没有正在运行的数据库，可以使用 Docker 设置一个：

```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=12345678 -d postgres
```

现在进入项目根目录下的 `.env` 文件并编辑：

```
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/db?schema=public"
```

然后我们可以运行 `prisma migrate` 来同步数据库与 Prisma 模式：

```bash
bunx prisma migrate dev --name init
```

之后 Prisma 将根据我们的模式生成强类型的 Prisma Client 代码。

这意味着我们可以在代码编辑器中获得自动补全和类型检查，在编译时捕获潜在错误，而不是在运行时。

## 进入代码

在我们的 **src/index.ts** 中，更新 Elysia 服务器以创建一个简单的用户注册接口。

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
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```

我们刚刚创建了一个简单的接口，用于使用 Elysia 和 Prisma 向数据库插入新用户。

::: tip
**重要**的是，在返回 Prisma 函数时，你应该始终将回调函数标记为 async。

因为 Prisma 函数不返回原生 Promise，Elysia 不能动态处理自定义 Promise 类型，但通过静态代码分析，通过将回调函数标记为 async，Elysia 会尝试等待函数的返回类型，从而允许我们映射 Prisma 结果。
:::

现在问题是，body 可能是任何内容，而不仅限于我们预期定义的类型。

我们可以通过使用 Elysia 的类型系统来改进这一点。

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
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```

这告诉 Elysia 验证传入请求的 body 是否匹配指定的形状，并将回调中 `body` 的 TypeScript 类型更新为匹配相同类型：

```ts
// 'body' 现在的类型如下：
{
    username: string
    password: string
}
```

这意味着如果这个形状与数据库表不匹配，它会立即给你警告。

这在你需要编辑表格或执行迁移时非常有效，Elysia 可以逐行记录错误，因为类型冲突在达到生产环境之前。

## 错误处理

由于我们的 `username` 字段是唯一的，有时 Prisma 可能会抛出错误，可能会在尝试注册时意外重复 `username`，如：

```ts
Invalid `prisma.user.create()` invocation:

Unique constraint failed on the fields: (`username`)
```

默认的 Elysia 错误处理程序可以自动处理这种情况，但我们可以通过指定使用 Elysia 的局部 `onError` 钩子来改进：

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
                            error: '用户名必须是唯一的'  // [!code ++]
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
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```

使用 `error` 钩子，回调内部抛出的任何错误都会传递到 `error` 钩子，允许我们定义自定义错误处理。

根据 [Prisma 文档](https://www.prisma.io/docs/reference/api-reference/error-reference#p2002)，错误代码 'P2002' 意味着执行查询时违反了唯一约束。

由于此表只有一个 `username` 字段是唯一的，我们可以推断该错误是由于用户名不唯一引起，因此我们返回自定义错误消息：

```ts
{
    error: '用户名必须是唯一的'
}
```

当唯一约束失败时，这将返回我们自定义错误消息的 JSON 等效项。

使我们能够流畅地从 Prisma 错误中定义任何自定义错误。

## 奖励：参考模式

当我们的服务器变得复杂，类型变得冗余并成为模板代码时，使用 **参考模式** 可以改进内联的 Elysia 类型。

简单地说，我们可以为我们的模式命名，并通过名称引用类型。

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
                            error: '用户名必须是唯一的'
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
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```

这与使用内联相同，但你只需定义一次，然后通过名称引用模式以消除冗余的验证代码。

TypeScript 和验证代码会按预期工作。

## 奖励：文档

作为奖励，Elysia 的类型系统也是 OpenAPI Schema 3.0 的兼容版，这意味着它能够与支持 OpenAPI Schema 的工具（如 Swagger）生成文档。

我们可以使用 Elysia Swagger 插件以一行代码生成 API 文档。

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
                            error: '用户名必须是唯一的'
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
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```

这就是创建一个良好定义的 API 文档所需的一切。

由于严格定义类型的文档，我们发现由于不应返回私密信息而意外返回了 `password` 字段。

得益于 Elysia 的类型系统，我们定义响应不应包含 `password`，这会自动警告我们 Prisma 查询返回了密码，允许我们提前修复这个问题。

此外，我们无须担心可能会忘记 OpenAPI Schema 3.0 的规范，因为我们也有自动补全和类型安全。

我们可以用 `detail` 定义我们的路由细节，它也遵循 OpenAPI Schema 3.0，因此我们可以轻松创建文档。

## 接下来是什么

在 Bun 和 Elysia 的支持下，我们进入了一个全新的开发者体验时代。

通过 Prisma，我们可以加速与数据库的交互，Elysia 则加速了我们在开发者体验和性能方面创建后台 Web 服务器的过程。

> 与之工作是一种绝对的乐趣。

Elysia 正在努力创建一个更好的开发者体验的新标准，以 Bun 构建高性能的 TypeScript 服务器，能够与 Go 和 Rust 的性能相匹配。

如果你在寻找学习 Bun 的起点，可以考虑看看 Elysia ，特别是在 [端到端类型安全](/eden/overview) 方面，类似于 tRPC，但基于 REST 标准，而无需任何代码生成。

如果你对 Elysia 感兴趣，欢迎查看我们的 [Discord 服务器](https://discord.gg/eaFJ2KDJck) 或查看 [Elysia 的 GitHub](https://github.com/elysiajs/elysia)
