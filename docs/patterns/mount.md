---
title: 挂载 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 挂载 - ElysiaJS

  - - meta
    - name: 'description'
      content: 应用 WinterTC 互操作代码与 Elysia 运行或反之亦然。

  - - meta
    - property: 'og:description'
      content: 应用 WinterTC 互操作代码与 Elysia 运行或反之亦然。
---

<script setup lang="ts">
import TutorialBadge from '../components/arona/badge.vue'
</script>

# 挂载 <TutorialBadge href="/tutorial/features/openapi" />
[WinterTC](https://wintertc.org/) 是一个用于在 Cloudflare、Deno、Vercel 等平台背后构建 HTTP 服务的标准。

它允许 Web 服务器通过使用 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 实现跨运行时的互操作运行。

Elysia 兼容 WinterTC。优化以在 Bun 上运行，但如果可能，也支持其他运行时。

这允许任何符合 WinterTC 标准的框架或代码一起运行，使得 Elysia、Hono、Remix、Itty Router 等框架可以简洁的函数中共存运行。

## 挂载
要使用 **.mount**，[只需传递一个 `fetch` 函数](https://twitter.com/saltyAom/status/1684786233594290176)：
```ts
import { Elysia } from 'elysia'
import { Hono } from 'hono'

const hono = new Hono()
	.get('/', (c) => c.text('Hello from Hono!'))

const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

任何使用 `Request` 和 `Response` 的框架都可以与 Elysia 互操作，例如
- Hono
- Nitro
- H3
- [Nextjs API 路由](/integrations/nextjs)
- [Nuxt API 路由](/integrations/nuxt)
- [SvelteKit API 路由](/integrations/sveltekit)

这些框架也能在多种运行时环境中使用：
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function

如果框架支持 **.mount** 方法，你也可以在另一个框架里面挂载 Elysia：
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