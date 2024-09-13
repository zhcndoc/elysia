---
title: Eden Fetch
head:
  - - meta
    - property: 'og:title'
      content: Eden Fetch - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 一个类似 fetch 的 Eden Treaty 替代品，具有更快的类型推断。使用 Eden Fetch，你可以在不需要代码生成的情况下，以端到端类型安全的方式向 Elysia 服务器发出请求。

  - - meta
    - name: 'og:description'
      content: 一个类似 fetch 的 Eden Treaty 替代品，具有更快的类型推断。使用 Eden Fetch，你可以在不需要代码生成的情况下，以端到端类型安全的方式向 Elysia 服务器发出请求。
---

# Eden Fetch

一个类似 fetch 的 Eden Treaty 替代品。

使用 Eden Fetch 可以使用 Fetch API 以类型安全的方式与 Elysia 服务器交互。

---

首先导出你现有的 Elysia 服务器类型：

```typescript twoslash
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

```typescript twoslash
// @filename: server.ts
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
// @filename: client.ts
// ---cut---
// client.ts
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

// response type: 'Hi Elysia'
const pong = await fetch('/hi', {})

// response type: 1895
const id = await fetch('/id/:id', {
    params: {
        id: '1895'
    }
})

// response type: { id: 1895, name: 'Skadi' }
const nendoroid = await fetch('/mirror', {
    method: 'POST',
    body: {
        id: 1895,
        name: 'Skadi'
    }
})
```

## 错误处理

你可以像 Eden Treaty 一样处理错误：

```typescript twoslash
// @filename: server.ts
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

// @filename: client.ts
// ---cut---
// client.ts
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

// response type: { id: 1895, name: 'Skadi' }
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

## 何时使用 Eden Fetch 而非 Eden Treaty

与 Elysia < 1.0 不同，Eden Fetch 并不比 Eden Treaty 更快。

偏好基于你和你团队的协议，但我们建议使用 [Eden Treaty](/eden/treaty/overview)。

对于 Elysia < 1.0：

使用 Eden Treaty 需要大量的降级迭代来一次性映射所有可能的类型，而相比之下，Eden Fetch 可以延迟执行，直到你选择一条路线。

在复杂类型和许多服务器路由的情况下，在低端开发设备上使用 Eden Treaty 可能会导致缓慢的类型推断和自动完成。

但随着 Elysia 对类型和推断进行了很多调整和优化，Eden Treaty 可以在相当多的路由上表现得很好。

如果你的单个进程包含**超过 500 条路由**，并且你需要在**单个前端代码库**中使用所有路由，那么你可能想要使用 Eden Fetch，因为它的 TypeScript 性能明显优于 Eden Treaty。
