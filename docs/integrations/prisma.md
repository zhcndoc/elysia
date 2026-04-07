---
title: 与 Prisma 集成 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 与 Prisma 集成 - ElysiaJS

  - - meta
    - name: 'description'
      content: 我们可以使用 Prisma 通过 prismabox 实现从数据库到验证再到前端的端到端类型安全

  - - meta
    - name: 'og:description'
      content: 我们可以使用 Prisma 通过 prismabox 实现从数据库到验证再到前端的端到端类型安全
---

# Prisma
[Prisma](https://prisma.io) 是一个 ORM，使我们能够以类型安全的方式与数据库交互。

它提供了一种使用 Prisma 架构文件定义数据库模式的方法，然后基于该模式生成 TypeScript 类型。

### Prismabox
[Prismabox](https://github.com/m1212e/prismabox) 是一个库，可从 Prisma 模式生成 TypeBox 或 Elysia 验证模型。

我们可以使用 Prismabox 将 Prisma 模式转换为 Elysia 验证模型，然后用来确保 Elysia 中的类型验证。

### 工作原理：
1. 在 Prisma 模式中定义数据库架构。
2. 添加 `prismabox` 生成器以生成 Elysia 模式。
3. 使用转换后的 Elysia 验证模型确保类型验证。
4. 从 Elysia 验证模型生成 OpenAPI 模式。
5. 添加 [Eden Treaty](/eden/overview) 以为前端添加类型安全。

```
                                                    * ——————————————— *
                                                    |                 |
                                               | -> |  文档          |
* ————————— *             * ———————— * OpenAPI |    |                 |
|           |  prismabox  |          | ——————— |    * ——————————————— *
|  Prisma   | —————————-> |  Elysia  |
|           |             |          | ——————— |    * ——————————————— *
* ————————— *             * ———————— *   Eden  |    |                 |
                                               | -> |  前端代码      |
												    |                 |
												    * ——————————————— *

```

## 安装
安装 Prisma，请运行以下命令：

```bash
bun add @prisma/client prismabox prisma-adapter-bun-sqlite && \
bun add -d prisma
```

## Prisma 模式
假设你已经有一个 `prisma/schema.prisma` 文件。

我们可以在 Prisma 模式文件中添加一个 `prismabox` 生成器，如下所示：

::: code-group

```ts [prisma/schema.prisma]
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
  // 注意：在 Prisma 7+ 中，数据源 URL 在 prisma.config.ts 中配置（用于 Prisma CLI），
  // 并且在使用驱动适配器时，还需要在适配器设置中传递运行时 URL。
}

generator prismabox { // [!code ++]
  provider = "prismabox" // [!code ++]
  typeboxImportDependencyName = "elysia" // [!code ++]
  typeboxImportVariableName = "t" // [!code ++]
  inputModel = true // [!code ++]
  output   = "../generated/prismabox" // [!code ++]
} // [!code ++]

model User {
  id    String  @id @default(cuid())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id    	String  @id @default(cuid())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  String
}
```

:::

这将在 `generated/prismabox` 目录生成 Elysia 验证模型。

每个模型会有自己的文件，且模型名称基于 Prisma 的模型名称。

例如：
- `User` 模型将生成到 `generated/prismabox/User.ts`
- `Post` 模型将生成到 `generated/prismabox/Post.ts`

## 使用生成的模型
然后我们可以在 Elysia 应用中导入生成的模型：

::: code-group

```ts [src/index.ts]
import { Elysia, t } from 'elysia'

import { PrismaBunSqlite } from 'prisma-adapter-bun-sqlite';
import { PrismaClient } from '../generated/prisma/client' // [!code ++]
import { UserPlain, UserPlainInputCreate } from '../generated/prismabox/User' // [!code ++]

const adapter = new PrismaBunSqlite({ url: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

const app = new Elysia()
    .put(
        '/',
        async ({ body }) =>
            prisma.user.create({
                data: body
            }),
        {
            body: UserPlainInputCreate, // [!code ++]
            response: UserPlain // [!code ++]
        }
    )
    .get(
        '/id/:id',
        async ({ params: { id }, status }) => {
            const user = await prisma.user.findUnique({
                where: { id }
            })

            if (!user) return status(404, '用户未找到')

            return user
        },
        {
            response: {
                200: UserPlain, // [!code ++]
                404: t.String() // [!code ++]
            }
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia 正在运行于 ${app.server?.hostname}:${app.server?.port}`
)
```

:::

这使我们可以在 Elysia 验证模型中复用数据库架构。

---

更多信息，请参阅 [Prisma](https://prisma.io) 和 [Prismabox](https://github.com/m1212e/prismabox) 文档。