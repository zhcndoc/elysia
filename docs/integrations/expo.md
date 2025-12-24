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

1. 创建 **app/[...slugs]+api.ts**
2. 定义一个 Elysia 服务器
3. 导出您想要使用的 HTTP 方法名的 **Elysia.fetch**

::: code-group

```typescript [app/[...slugs]+api.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'hello Expo')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch // [!code ++]
export const POST = app.fetch // [!code ++]
```

:::
Elysia 将正常运行，因为得益于 WinterCG 的兼容性，然而，某些插件如 **Elysia Static** 可能在您在 Node 上运行 Expo 时无法正常工作。

您可以像对待普通的 Expo API 路由那样对待 Elysia 服务器。

### pnpm
如果您使用 pnpm，[pnpm 默认不自动安装 peer dependencies](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，这会迫使您手动安装额外的依赖项。
```bash
pnpm add @sinclair/typebox openapi-types
```

## 前缀
如果您将 Elysia 服务器放置在应用路由的根目录之外，您需要为 Elysia 服务器注释前缀。

有关更多信息，请参考 [API 路由](https://docs.expo.dev/router/reference/api-routes/)。

例如，如果您将 Elysia 服务器放在 **app/api/[...slugs]+api.ts** 中，您需要将前缀注释为 **/api**。

::: code-group

```typescript [app/api/[...slugs]+api.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', 'Hello Expo')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch
export const POST = app.fetch
```

:::

这样可以确保无论您将其放置在何处，Elysia 路由都会正常工作。

## Eden

我们可以添加 [Eden](/eden/overview) 实现类似 tRPC 的**端到端类型安全**。

1. 从 Elysia 服务器导出 `type`

::: code-group

```typescript [app/[...slugs]+api.ts]
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello Nextjs')
	.post(
		'/user',
		({ body }) => body,
		{
			body: treaty.schema('User', {
				name: 'string'
			})
		}
	)

export type app = typeof app // [!code ++]

export const GET = app.fetch
export const POST = app.fetch
```

:::

2. 创建 Treaty 客户端

::: code-group

```typescript [lib/eden.ts]
import { treaty } from '@elysiajs/eden'
import type { app } from '../app/[...slugs]+api'

export const api = treaty<app>('localhost:3000/api')
```

:::

3. 在服务端和客户端组件中使用该客户端

::: code-group

```tsx [app/page.tsx]
import { api } from '../lib/eden'

export default async function Page() {
	const message = await api.get()

	return <h1>Hello, {message}</h1>
}
```

:::

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