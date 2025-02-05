---
title: 与 Nextjs 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Nextjs 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: 使用 Nextjs 应用路由，您可以在 Nextjs 路由上运行 Elysia。由于符合 WinterCG，Elysia 将正常工作。

    - - meta
      - property: 'og:description'
        content: 使用 Nextjs 应用路由，您可以在 Nextjs 路由上运行 Elysia。由于符合 WinterCG，Elysia 将正常工作。
---

# 与 Nextjs 集成

使用 Nextjs 应用路由，我们可以在 Nextjs 路由上运行 Elysia。

1. 在应用路由中创建 **api/[[...slugs]]/route.ts**
2. 在 **route.ts** 中创建或导入一个现有的 Elysia 服务器
3. 导出您想要暴露的方法的处理程序

```typescript
// app/api/[[...slugs]]/route.ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'hello Next')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle // [!code ++]
export const POST = app.handle // [!code ++]
```

由于符合 WinterCG，Elysia 将正常工作，但如果您在 Node 上运行 Nextjs，某些插件（如 **Elysia Static**）可能不会正常工作。

您可以将 Elysia 服务器视为一个普通的 Nextjs API 路由。

通过这种方式，您可以在一个代码库中将前端和后端共同放置，并在客户端和服务器动作中拥有 [Eden 的端到端类型安全](https://elysiajs.com/eden/overview.html)

有关更多信息，请参阅 [Nextjs 路由处理程序](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers)。

## 前缀

因为我们的 Elysia 服务器不在应用路由的根目录下，所以您需要为 Elysia 服务器注释前缀。

例如，如果您将 Elysia 服务器放在 **app/user/[[...slugs]]/route.ts** 中，则需要将前缀注释为 **/user**。

```typescript
// app/user/[[...slugs]]/route.ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/user' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle
export const POST = app.handle
```

这将确保 Elysia 路由能够在您放置它的任何位置正常工作。
