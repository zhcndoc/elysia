---
title: Mount
head:
  - - meta
    - property: 'og:title'
      content: Mount - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 将 WinterCG 的可互操作代码应用于 Elysia 或反之。

  - - meta
    - property: 'og:description'
      content: 将 WinterCG 的可互操作代码应用于 Elysia 或反之。
---

# Mount

WinterCG 是一种用于 Web 可互操作运行时的标准。得到 Cloudflare、Deno、Vercel Edge Runtime、Netlify Function 和其他各种运行时的支持，它允许 Web 服务器在使用像 `Fetch`、`Request` 和 `Response` 之类的 Web 标准定义的运行时之间进行互操作。

Elysia 是符合 WinterCG 的。我们优化了在 Bun 上运行，但也公开支持其他可能的运行时。

理论上，这允许任何符合 WinterCG 的框架或代码一起运行，使得像 Elysia、Hono、Remix、Itty Router 这样的框架可以在一个简单的函数中一起运行。

为了遵循这一点，我们通过引入 `.mount` 方法为 Elysia 实现了相同的逻辑，以便与任何符合 WinterCG 的框架或代码一起运行。

## Mount

要使用**。mount**，[只需传递一个 `fetch` 函数](https://twitter.com/saltyAom/status/1684786233594290176)：
```ts
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

**fetch** 函数是一个接受 Web 标准请求并返回带有以下定义的 Web 标准响应的函数：
```ts
// 类似 Web 标准请求的对象
// Web 标准响应
type fetch = (request: RequestLike) => Response
```

默认情况下，这个声明被以下运行时使用：

- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler
- 等等

这使得你可以在单个服务器环境中执行所有前述的代码，从而可以与 Elysia 无缝交互。你还可以在单个部署中重用现有函数，无需使用反向代理来管理多个服务器。

如果框架还支持**。mount** 函数，你可以深度嵌套支持它的框架。
```ts
import { Elysia } from 'elysia'
import Hono from 'hono'

const elysia = new Elysia()
    .get('/Hello from Elysia inside Hono inside Elysia')

const hono = new Hono()
    .get('/', (c) => c.text('Hello from Hono!'))
    .mount('/elysia', elysia.fetch)

const main = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
    .listen(3000)
```

## 重用 Elysia

此外，你可以在服务器上重用多个现有的 Elysia 项目。

```ts
import { Elysia } from 'elysia'

import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

如果传递给 `mount` 的实例是 Elysia 实例，它将自动解析为 `use`，从而提供类型安全性和对 Eden 的支持。

这使得可互操作的框架和运行时成为现实。
