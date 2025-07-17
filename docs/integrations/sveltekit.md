---
title: 与 SvelteKit 的集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 SvelteKit 的集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: 使用 SvelteKit，您可以在服务器路由上运行 Elysia。

    - - meta
      - property: 'og:description'
        content: 使用 SvelteKit，您可以在服务器路由上运行 Elysia。
---

# 与 SvelteKit 的集成

使用 SvelteKit，您可以在服务器路由上运行 Elysia。

1. 创建 **src/routes/[...slugs]/+server.ts**。
2. 在 **+server.ts** 中创建或导入一个现有的 Elysia 服务器
3. 导出您想要公开的方法的处理程序，您也可以使用 `fallback` 让 Elysia 处理所有方法。

```typescript
// src/routes/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';

const app = new Elysia()
    .get('/', () => 'hello SvelteKit')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>

export const GET: RequestHandler = ({ request }) => app.handle(request)
export const POST: RequestHandler = ({ request }) => app.handle(request)
// or simply
export const fallback: RequestHandler = ({ request }) => app.handle(request)
```

您可以将 Elysia 服务器视为普通的 SvelteKit 服务器路由。

通过这种方法，您可以在单个代码库中共同定位前端和后端，并且可以实现 [Eden 的端到端类型安全](https://elysiajs.com/eden/overview.html)，支持客户端和服务器的操作。

有关更多信息，请参考 [SvelteKit 路由](https://kit.svelte.dev/docs/routing#server)。

## 前缀
如果您将 Elysia 服务器放在应用路由的根目录以外的位置，您需要为 Elysia 服务器注释前缀。

例如，如果您将 Elysia 服务器放在 **src/routes/api/[...slugs]/+server.ts** 中，您需要将前缀注释为 **/api**。

```typescript twoslash
// src/routes/api/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>

export const fallback: RequestHandler = ({ request }) => app.handle(request)
```

这样可以确保 Elysia 路由在您放置它的任何位置都能正常工作。
