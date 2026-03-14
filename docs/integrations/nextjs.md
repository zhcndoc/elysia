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

1. 创建 **app/api/[[...slugs]]/route.ts**
2. 定义一个 Elysia 服务器
3. 导出带有所需 HTTP 方法名称的 **Elysia.fetch**

::: code-group

```typescript [app/api/[[...slugs]]/route.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
    .get('/', 'Hello Nextjs')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch // [!code ++]
export const POST = app.fetch // [!code ++]
```

:::

Elysia 将正常工作，因为它符合 WinterCG 规范，但如果您在 Node 环境下运行 Nextjs，某些插件（如 **Elysia Static**）可能不会正常工作。

您可以将 Elysia 服务器视为一个普通的 Nextjs API 路由。

通过这种方式，您可以在一个代码库中将前端和后端共同放置，并在客户端和服务器动作中拥有 [Eden 的端到端类型安全](https://elysiajs.com/eden/overview.html)。

有关更多信息，请参阅 [Nextjs 路由处理程序](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers)。

### pnpm
如果您使用 pnpm，[pnpm 默认不会自动安装 peer 依赖](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，需要您手动安装额外依赖。
```bash
pnpm add @sinclair/typebox openapi-types
```

## 前缀

由于我们的 Elysia 服务器不在应用路由的根目录下，因此需要在 Elysia 服务器上标注前缀。

例如，如果您将 Elysia 服务器放在 **app/user/[[...slugs]]/route.ts**，需要在 Elysia 服务器上将前缀标注为 **/user**。

::: code-group

```typescript [app/user/[[...slugs]]/route.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/user' }) // [!code ++]
	.get('/', 'Hello Nextjs')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch
export const POST = app.fetch
```

:::

这样可以确保无论您将其放在哪里，Elysia 路由都能正常工作。

## Eden

我们可以添加 [Eden](/eden/overview) 来实现类似 tRPC 的**端到端类型安全**。

在这种方式中，我们将使用同构 fetch 模式让 Elysia 实现：
1. 在服务端：直接调用 Elysia，无需经过网络层
2. 在客户端：通过网络层调用 Elysia

首先需要完成以下步骤：

1. 导出 Elysia 实例

::: code-group

```typescript [app/api/[[...slugs]]/route.ts]
import { Elysia } from 'elysia'

export const app = new Elysia({ prefix: '/api' }) // [!code ++]
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

export const GET = app.fetch
export const POST = app.fetch
```

:::

2. 创建 Treaty 客户端

::: code-group

```typescript [lib/eden.ts]
import { treaty } from '@elysiajs/eden'
import type { app } from '../app/api/[[...slugs]]/route'

// .api 用以进入 /api 前缀
export const api =
  // process 在服务端和构建时定义
  typeof process !== 'undefined'
    ? treaty(app).api
    : treaty<typeof app>('localhost:3000').api
```

你应该使用 `typeof process` 而不是 `typeof window`，因为在构建时 `window` 未被定义，会导致水合错误。

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

这允许你以最小的代价实现从前端到后端的类型安全，并且适用于服务端和客户端组件，以及增量静态再生 (ISR)。

## React Query
我们也可以使用 React Query 在客户端与 Elysia 服务器交互。

::: code-group

```tsx [src/routes/index.tsx]
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { getTreaty } from './api.$' // [!code ++]

export const Route = createFileRoute('/a')({
	component: App
})

function App() {
	const { data: response } = useQuery({ // [!code ++]
		queryKey: ['get'], // [!code ++]
		queryFn: () => getTreaty().get() // [!code ++]
	}) // [!code ++]

	return response?.data
}
```

:::

这可以配合 React Query 的各种功能使用，如缓存、分页、无限查询等。

---

有关更多信息，请参阅 [Next.js 路由处理程序](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers)。