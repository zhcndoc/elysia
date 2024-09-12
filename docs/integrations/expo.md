---
title: 集成 Expo
head:
    - - meta
      - property: 'og:title'
        content: 集成 Expo - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 使用 Expo 应用程序路由器，您可以在 Expo 路由上运行 Elysia。由于 WinterCG 的兼容性，Elysia 将正常工作。

    - - meta
      - property: 'og:description'
        content: 使用 Expo 应用程序路由器，您可以在 Expo 路由上运行 Elysia。由于 WinterCG 的兼容性，Elysia 将正常工作。
---

# 集成 Expo

从 Expo SDK 50 和 App Router v3 开始，Expo 允许我们在 Expo 应用程序中直接创建 API 路由。

1. 如果尚不存在，请创建 Expo 应用程序：

```typescript
bun create expo-app --template tabs
```

2. 创建 **app/[...slugs]+api.ts**
3. 在 **[...slugs]+api.ts** 中创建或导入现有的 Elysia 服务器
4. 使用要公开的方法名称导出处理程序

```typescript twoslash
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

由于 WinterCG 的兼容性，Elysia 将正常工作，但是，如果您在 Expo 上运行，一些插件 (如 **Elysia Static**) 可能不起作用。

您可以将 Elysia 服务器视为普通的 Expo API 路由。

通过这种方法，您可以在单个代码库中同时放置前端和后端，并且在客户端和服务器端都使用 [Eden 实现端到端类型安全](https://elysia.zhcndoc.com/eden/overview.html)。

请参阅 [API 路由](https://docs.expo.dev/router/reference/api-routes/)了解更多信息。

## 前缀

如果您将 Elysia 服务器放置在应用程序路由器的根目录之外，您需要为 Elysia 服务器添加前缀注释。

例如，如果您将 Elysia 服务器放置在 **app/api/[...slugs]+api.ts** 中，您需要将前缀注释为 **/api**。

```typescript twoslash
// app/api/[...slugs]+api.ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' }) // ![code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle
export const POST = app.handle
```

这将确保在任何位置放置时，Elysia 路由将正常工作。

## 部署

如果需要，您可以直接使用 Elysia 使用 API 路由并像正常的 Elysia 应用程序一样进行部署，或者使用[实验性的 Expo 服务器运行时](https://docs.expo.dev/router/reference/api-routes/#deployment)。

如果使用 Expo 服务器运行时，您可以使用 `expo export` 命令为您的 Expo 应用程序创建优化构建。这将包括一个使用 Elysia 的 Expo 函数，位于 `dist/server/_expo/functions/[...slugs]+api.js` 中。

::: tip
请注意，Expo 函数被视为边缘函数而不是普通服务器，因此直接运行边缘函数将不会分配任何端口。
:::

您可以使用 Expo 提供的函数适配器来部署您的边缘函数。

目前 Expo 支持以下适配器：

- [Express](https://docs.expo.dev/router/reference/api-routes/#express)
- [Netlify](https://docs.expo.dev/router/reference/api-routes/#netlify)
- [Vercel](https://docs.expo.dev/router/reference/api-routes/#vercel)
