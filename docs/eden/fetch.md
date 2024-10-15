---
title: Eden Fetch - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Fetch - ElysiaJS

  - - meta
    - name: 'description'
      content: 一个像 Fetch 的替代品，速度更快的类型推断，与 Eden Treaty 相比。使用 Eden Fetch，您可以以端到端的类型安全性向 Elysia 服务器发起请求，而无需代码生成。

  - - meta
    - name: 'og:description'
      content: 一个像 Fetch 的替代品，速度更快的类型推断，与 Eden Treaty 相比。使用 Eden Fetch，您可以以端到端的类型安全性向 Elysia 服务器发起请求，而无需代码生成。
---

# Eden Fetch
一个像 Fetch 的替代品，与 Eden Treaty 相比。

使用 Eden Fetch，可以使用 Fetch API 以类型安全的方式与 Elysia 服务器交互。

---

首先导出您现有的 Elysia 服务器类型：
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app
```

然后导入服务器类型，并在客户端使用 Elysia API：
```typescript
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

// 响应类型: 'Hi Elysia'
const pong = await fetch('/hi', {})

// 响应类型: 1895
const id = await fetch('/id/:id', {
    params: {
        id: '1895'
    }
})

// 响应类型: { id: 1895, name: 'Skadi' }
const nendoroid = await fetch('/mirror', {
    method: 'POST',
    body: {
        id: 1895,
        name: 'Skadi'
    }
})
```

## 错误处理
您可以像处理 Eden Treaty 一样处理错误：
```typescript
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

// 响应类型: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = await fetch('/mirror', {
    method: 'POST',
    body: {
        id: 1895,
        name: 'Skadi'
    }
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            throw error.value
            break

        case 500:
        case 502:
            throw error.value
            break

        default:
            throw error.value
            break
    }
}

const { id, name } = nendoroid
```

## 何时应该使用 Eden Fetch 而不是 Eden Treaty
与 Elysia < 1.0 不同，Eden Fetch 现在并不比 Eden Treaty 更快。

选择取决于您和您的团队的协议，然而我们建议使用 [Eden Treaty](/eden/treaty/overview)。

对于 Elysia < 1.0：

使用 Eden Treaty 需要大量的降级迭代来一次性映射所有可能的类型，而相反，Eden Fetch 可以延迟执行，直到您选择一个路由。

对于复杂的类型和大量的服务器路由，在低端开发设备上使用 Eden Treaty 可能导致类型推断和自动补全变慢。

但随着 Elysia 调整和优化了很多类型和推断，Eden Treaty 在大量路由中表现得非常好。

如果您的单个进程包含 **超过 500 个路由**，而您需要在 **单个前端代码库中使用所有路由**，那么您可能想要使用 Eden Fetch，因为它的 TypeScript 性能显著优于 Eden Treaty。
