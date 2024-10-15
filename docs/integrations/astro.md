---
title: 与 Astro 的集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Astro 的集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: 您可以在 Astro 上运行 Elysia。由于遵循 WinterCG，Elysia 能够正常工作。

    - - meta
      - property: 'og:description'
        content: 您可以在 Astro 上运行 Elysia。由于遵循 WinterCG，Elysia 能够正常工作。
---

# 与 Astro 的集成

使用 [Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/)，我们可以直接在 Astro 上运行 Elysia。

1. 在 **astro.config.mjs** 中将 **output** 设置为 **server**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    output: 'server' // [!code ++]
})
```

2. 创建 **pages/[...slugs].ts**
3. 在 **[...slugs].ts** 中创建或导入一个现有的 Elysia 服务器
4. 用您想要公开的方法名称导出处理器

```typescript
// pages/[...slugs].ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/api', () => 'hi')
    .post('/api', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

const handle = ({ request }: { request: Request }) => app.handle(request) // [!code ++]

export const GET = handle // [!code ++]
export const POST = handle // [!code ++]
```

Elysia 能够正常工作，因为遵循了 WinterCG。

我们推荐在 [Bun 上运行 Astro](https://docs.astro.build/en/recipes/bun)，因为 Elysia 设计是为了在 Bun 上运行。

::: tip
您可以在不使用 Bun 运行 Astro 的情况下运行 Elysia 服务器，这得益于 WinterCG 的支持。

但是如果您在 Node 上运行 Astro，某些插件如 **Elysia Static** 可能无法正常工作。
:::

通过这种方式，您可以在单个代码库中共同拥有前端和后端，并且与 Eden 实现端到端的类型安全。

有关更多信息，请参阅 [Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/)。

## 前缀

如果您将 Elysia 服务器放在应用路由的根目录之外，您需要为 Elysia 服务器注释前缀。

例如，如果您将 Elysia 服务器放在 **pages/api/[...slugs].ts**，则需要将前缀注释为 **/api**。

```typescript
// pages/api/[...slugs].ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

const handle = ({ request }: { request: Request }) => app.handle(request) // [!code ++]

export const GET = handle // [!code ++]
export const POST = handle // [!code ++]
```

这将确保 Elysia 路由在您放置的位置上能够正常工作。
