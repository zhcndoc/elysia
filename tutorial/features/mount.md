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

让我们使用预览来 **GET '/openapi'**，看看我们的 API 文档看起来怎么样。

这个 API 文档是从你的代码中反映出来的。

尝试修改代码，看看文档是如何变化的！
