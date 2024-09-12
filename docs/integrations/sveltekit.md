---
title: 集成 SvelteKit
head:
    - - meta
      - property: 'og:title'
        content: 集成 SvelteKit - Elysia 中文文档

    - - meta
      - name: 'description'
        content: With SvelteKit, you can run Elysia on server routes.

    - - meta
      - property: 'og:description'
        content: With SvelteKit, you can run Elysia on server routes.
---

# 与 SvelteKit 集成

通过 SvelteKit，你可以在服务器路由上运行 Elysia。

1. 创建 **src/routes/[...slugs]/+server.ts**。
2. 在 **+server.ts** 中，创建或导入现有的 Elysia 服务器。
3. 使用要公开的方法的名称导出处理程序。

```typescript twoslash
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
```

你可以将 Elysia 服务器视为普通的 SvelteKit 服务器路由。

使用这种方法，你可以将前端和后端的代码放在同一个存储库中，并在客户端和服务器端上实现 [End-to-end type-safety with Eden](https://elysia.zhcndoc.com/eden/overview.html)。

请参考 [SvelteKit Routing](https://kit.svelte.dev/docs/routing#server) 获取更多信息。

## 前缀

如果你将 Elysia 服务器放置在应用路由的根目录之外，你需要给 Elysia 服务器添加前缀注释。

例如，如果你将 Elysia 服务器放置在 **src/routes/api/[...slugs]/+server.ts** 中，你需要将前缀注释为 **/api**。

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

export const GET: RequestHandler = ({ request }) => app.handle(request)
export const POST: RequestHandler = ({ request }) => app.handle(request)
```

这将确保无论你在何处放置 Elysia 路由，它都能正常工作。
