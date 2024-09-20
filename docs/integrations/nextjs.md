---
title: 集成 Next.js
head:
    - - meta
      - property: 'og:title'
        content: 集成 Next.js - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 通过 Next.js 应用路由，你可以在 Next.js 路径上运行 Elysia。由于 WinterCG 兼容性，Elysia 将按预期正常工作。

    - - meta
      - property: 'og:description'
        content: 通过 Next.js 应用路由，你可以在 Next.js 路径上运行 Elysia。由于 WinterCG 兼容性，Elysia 将按预期正常工作。
---

# 集成 Next.js

通过 Next.js 应用路由，我们可以在 Next.js 路径上运行 Elysia。

1. 在应用路由中创建 `[[...slugs]]/route.ts` 文件。
2. 在 `route.ts` 中创建或导入一个现有的 Elysia 服务器。
3. 使用想要公开的方法名称导出处理程序。

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

由于 WinterCG 兼容性，Elysia 将按预期正常工作，然而，如果你在 Node 上运行 Next.js，某些插件如 **Elysia Static** 可能无法正常工作。

你可以将 Elysia 服务器视为普通的 Next.js API 路由。

使用这种方法，你可以在单个代码仓库中同时拥有前端和后端，并使用 [Eden 进行端到端类型安全的开发](https://elysia.zhcndoc.com/eden/overview.html)，包括客户端和服务器端操作。

请参阅 [Next.js 路由处理程序](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers)获取更多信息。

## 前缀

如果你将 Elysia 服务器放置在应用路由的根目录以外的位置，你需要在 Elysia 服务器中添加前缀。

例如，如果你将 Elysia 服务器放置在 **app/api/[[...slugs]]/route.ts** 中，你需要将前缀注释为 **/api**。

```typescript
// app/api/[[...slugs]]/route.ts
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

这样可以确保无论你将 Elysia 服务器放置在哪个位置，Elysia 路由都能正常工作。
