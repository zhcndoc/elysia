---
title: 集成 Astro
head:
    - - meta
      - property: 'og:title'
        content: 集成 Astro - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 你可以在 Astro 上运行 Elysia。由于 WinterCG 合规性，Elysia 将按预期正常工作。

    - - meta
      - property: 'og:description'
        content: 你可以在 Astro 上运行 Elysia。由于 WinterCG 合规性，Elysia 将按预期正常工作。
---

# 集成 Astro

通过 [Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/)，我们可以直接在 Astro 上运行 Elysia。

1. 在 **astro.config.mjs** 中将 **output** 设置为 **server**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    output: 'server' // [!code ++]
})
```

2. 创建 `pages/[...slugs].ts`
3. 在 `[...slugs].ts` 中创建或导入现有的 Elysia 服务器
4. 通过指定要公开的方法的名称导出处理程序

```typescript twoslash
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

由于采用了 WinterCG 标准，Elysia 将正常工作。

我们建议在 [Bun 上运行 Astro](https://docs.astro.build/en/recipes/bun)，因为 Elysia 是为 Bun 设计的。

::: tip
如果您在 Node 上运行 Astro，则可以在不运行 Astro on Bun 的情况下运行 Elysia 服务器，这要归功于 WinterCG 的支持。

但是，如果您在 Node 上运行 Astro，则某些插件 (如 **Elysia Static**) 可能无法正常工作。
:::

通过这种方法，您可以在单个存储库中同时定位前端和后端，并使用 Eden 进行端到端类型安全。

有关更多信息，请参阅 [Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/)。

## 前缀

如果您将 Elysia 服务器放置在应用程序路由的根目录之外，您需要为 Elysia 服务器添加前缀注释。

例如，如果您将 Elysia 服务器放置在 `pages/api/[...slugs].ts` 中，您需要将注释前缀设置为 `/api`。

```typescript twoslash
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

这样可以确保不管您将 Elysia 放在何处，其路由都能正常工作。
