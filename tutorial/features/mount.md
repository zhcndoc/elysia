---
url: 'https://elysiajs.com/tutorial/features/mount.md'
---

# Mount

Elysia 提供了一个 Elysia.mount 用于在基于 Web 标准（如 Hono、H3 等）构建的后端框架之间互操作。

```typescript
import { Elysia, t } from 'elysia'
import { Hono } from 'hono'

const hono = new Hono()
	.get('/', (c) => c.text('Hello from Hono'))

new Elysia()
	.get('/', 'Hello from Elysia')
	.mount('/hono', hono.fetch)
	.listen(3000)
```

这使我们能够逐步将应用程序迁移到 Elysia，或者在单个应用程序中使用多个框架。

## 任务

让我们使用预览来 **GET '/hono'**，看看我们的 Hono 路由是否工作。

尝试修改代码，看看它是如何变化的！
