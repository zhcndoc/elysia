---
title: Mount - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Mount - ElysiaJS

  - - meta
    - name: 'description'
      content: 应用 WinterCG 互操作代码与 Elysia 运行或反之亦然。

  - - meta
    - property: 'og:description'
      content: 应用 WinterCG 互操作代码与 Elysia 运行或反之亦然。
---

# Mount
WinterCG 是一个用于网页互操作运行时的标准。它得到了 Cloudflare、Deno、Vercel Edge Runtime、Netlify Function 和其他多种支持，允许网页服务器在使用 Web 标准定义（如 `Fetch`、`Request` 和 `Response`）的运行时之间互操作。

Elysia 遵循 WinterCG 标准。我们经过优化以在 Bun 上运行，但也开放支持其他运行时。

理论上，这允许任何符合 WinterCG 标准的框架或代码一起运行，使得像 Elysia、Hono、Remix、Itty Router 等框架可以简单地在一个函数中共同运行。

遵循这一点，我们为 Elysia 引入了 `.mount` 方法，以便与任何符合 WinterCG 标准的框架或代码一起运行。

## Mount
要使用 **.mount**，[只需传递一个 `fetch` 函数](https://twitter.com/saltyAom/status/1684786233594290176):
```ts
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

一个 **fetch** 函数是一个接受 Web 标准请求并返回 Web 标准响应的函数，其定义为：
```ts
// Web 标准请求类对象
// Web 标准响应
type fetch = (request: RequestLike) => Response
```

默认情况下，以下声明被使用：
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler
- 等等。

这使您可以在单个服务器环境中执行上述所有代码，并使与 Elysia 的无缝交互成为可能。您还可以在单个部署中重用现有功能，从而消除管理多个服务器所需的反向代理。

如果框架也支持 **.mount** 函数，您可以深层嵌套一个支持该功能的框架。
```ts
import { Elysia } from 'elysia'
import { Hono } from 'hono'

const elysia = new Elysia()
    .get('/', () => 'Hello from Elysia inside Hono inside Elysia')

const hono = new Hono()
    .get('/', (c) => c.text('Hello from Hono!'))
    .mount('/elysia', elysia.fetch)

const main = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
    .listen(3000)
```

## 重用 Elysia
此外，您可以在服务器上重用多个现有的 Elysia 项目。

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

如果传递给 `mount` 的实例是一个 Elysia 实例，它将通过 `use` 自动解析，默认提供类型安全和 Eden 支持。

这使得互操作框架和运行时的可能性成为现实。
