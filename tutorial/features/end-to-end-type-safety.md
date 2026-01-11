---
url: 'https://elysiajs.com/tutorial/features/end-to-end-type-safety.md'
---

# 端到端类型安全

Elysia 提供了后端和前端之间的端到端类型安全 **无需代码生成**，使用 Eden，类似于 tRPC。

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

// 后端
export const app = new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)

// 前端
const client = treaty<typeof app>('localhost:3000')

const { data, error } = await client.get()

console.log(data) // Hello World
```

这通过从 Elysia 实例推导类型来工作，并使用类型提示提供客户端的类型安全。

请参见 Eden Treaty。

## 任务

让我们在预览中点击  图标，看看请求是如何被记录的。
