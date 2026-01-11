---
url: 'https://elysiajs.com/integrations/tanstack-start.md'
---

# 与 Tanstack Start 集成

Elysia 可以运行在 Tanstack Start 服务器路由内。

1. 创建 **src/routes/api.$.ts**
2. 定义一个 Elysia 服务器
3. 在 **server.handlers** 中导出 Elysia 处理器

::: code-group

```typescript [src/routes/api.$.ts]
import { Elysia } from 'elysia'

import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

const app = new Elysia({
	prefix: '/api' // [!code ++]
}).get('/', 'Hello Elysia!')

const handle = ({ request }: { request: Request }) => app.fetch(request) // [!code ++]

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle, // [!code ++]
			POST: handle // [!code ++]
		}
	}
})
```

:::

现在 Elysia 应该已经运行在 **/api** 路径下。

我们可以根据需要向 **server.handlers** 添加其他 HTTP 方法支持。

### pnpm

If you use pnpm, [pnpm doesn't auto install peer dependencies by default](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230) forcing you to install additional dependencies manually.

```bash
pnpm add @sinclair/typebox openapi-types
```

## Eden

我们可以添加 [Eden](/eden/overview.html) 实现类似 tRPC 的**端到端类型安全**。

::: code-group

```typescript [src/routes/api.$.ts]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden' // [!code ++]

import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

const app = new Elysia({
	prefix: '/api'
}).get('/', 'Hello Elysia!')

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle,
			POST: handle
		}
	}
})

export const getTreaty = createIsomorphicFn() // [!code ++]
	.server(() => treaty(app).api) // [!code ++]
	.client(() => treaty<typeof app>('localhost:3000').api) // [!code ++]
```

:::

注意我们使用 **createIsomorphicFn** 分别为服务器和客户端创建不同的 Eden Treaty 实例。

1. 服务器端直接调用 Elysia，无需 HTTP 开销。
2. 客户端通过 HTTP 调用 Elysia 服务器。

在 React 组件中，可以使用 `getTreaty` 以类型安全的方式调用 Elysia 服务器。

## 加载器数据

Tanstack Start 支持 **Loader**，用于在渲染组件前获取数据。

::: code-group

```tsx [src/routes/index.tsx]
import { createFileRoute } from '@tanstack/react-router'

import { getTreaty } from './api.$' // [!code ++]

export const Route = createFileRoute('/a')({
	component: App,
	loader: () => getTreaty().get().then((res) => res.data) // [!code ++]
})

function App() {
	const data = Route.useLoaderData() // [!code ++]

	return data
}
```

:::

作为加载器调用 Elysia，会在 SSR 期间于服务器端执行，无需 HTTP 开销。

Eden Treaty 会保证服务器和客户端的类型安全。

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

::: code-group

这可以与 React Query 的任何特性配合使用，如缓存、分页、无限查询等。

***

如需了解更多关于 Tanstack Start 的信息，请访问 [Tanstack Start 文档](https://tanstack.com/start)。
