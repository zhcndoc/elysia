---
title: 与 Expo 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Expo 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: 使用 Expo App Router，您可以在 Expo 路由上运行 Elysia。得益于 WinterCG 的兼容性，Elysia 将正常运行。

    - - meta
      - property: 'og:description'
        content: 使用 Expo App Router，您可以在 Expo 路由上运行 Elysia。得益于 WinterCG 的兼容性，Elysia 将正常运行。
---

# 与 Expo 集成

从 Expo SDK 50 和 App Router v3 开始，Expo 允许我们直接在 Expo 应用中创建 API 路由。

1. 如果尚不存在，请创建一个 Expo 应用：
```typescript
bun create expo-app --template tabs
```

2. 创建 **app/[...slugs]+api.ts**
3. 在 **[...slugs]+api.ts** 中创建或导入一个现有的 Elysia 服务器
4. 以您想要暴露的方法名称导出处理器

```typescript
// app/[...slugs]+api.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello Next')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle // [!code ++]
export const POST = app.handle // [!code ++]
```

Elysia 将正常运行，因为得益于 WinterCG 的兼容性，然而，某些插件如 **Elysia Static** 可能在您在 Node 上运行 Expo 时无法正常工作。

您可以像对待普通的 Expo API 路由那样对待 Elysia 服务器。

通过这种方式，您可以将前端和后端共同放置在一个仓库中，并实现 [Eden 的端到端类型安全](https://elysiajs.com/eden/overview.html)，同时支持客户端和服务器操作。

有关更多信息，请参考 [API 路由](https://docs.expo.dev/router/reference/api-routes/)。

## 前缀
如果您将 Elysia 服务器放置在应用路由的根目录之外，您需要为 Elysia 服务器注释前缀。

例如，如果您将 Elysia 服务器放在 **app/api/[...slugs]+api.ts** 中，您需要将前缀注释为 **/api**。

```typescript
// app/api/[...slugs]+api.ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle
export const POST = app.handle
```

这样可以确保无论您将其放置在何处，Elysia 路由都会正常工作。

## 部署
您可以直接使用 Elysia 的 API 路由，根据需要部署为正常的 Elysia 应用，或使用 [实验性的 Expo 服务器运行时](https://docs.expo.dev/router/reference/api-routes/#deployment)。

如果您使用 Expo 服务器运行时，可以使用 `expo export` 命令为您的 Expo 应用创建优化构建，这将包括一个使用 Elysia 的 Expo 函数，位于 **dist/server/_expo/functions/[...slugs\]+api.js**

::: tip
请注意，Expo 函数被视为边缘函数，而不是普通服务器，因此直接运行边缘函数不会分配任何端口。
:::

您可以使用 Expo 提供的 Expo 函数适配器来部署您的边缘函数。

目前 Expo 支持以下适配器：
- [Express](https://docs.expo.dev/router/reference/api-routes/#express)
- [Netlify](https://docs.expo.dev/router/reference/api-routes/#netlify)
- [Vercel](https://docs.expo.dev/router/reference/api-routes/#vercel)
