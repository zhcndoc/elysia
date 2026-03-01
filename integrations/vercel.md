---
url: 'https://elysiajs.com/integrations/vercel.md'
---

# 在 Vercel 上部署 Elysia

Elysia 可以使用 Bun 或 Node 运行时在 Vercel 上零配置部署。

1. 在 **src/index.ts** 中，创建或导入现有的 Elysia 服务器
2. 将 Elysia 服务器作为默认导出

```typescript
import { Elysia, t } from 'elysia'

export default new Elysia() // [!code ++]
    .get('/', () => 'Hello Vercel Function')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
```

3. 使用 Vercel CLI 在本地开发

```bash
vc dev
```

4. 部署到 Vercel

```bash
vc deploy
```

就是这么简单。您的 Elysia 应用现在已运行在 Vercel 上。

### pnpm

如果您使用 pnpm，[pnpm 默认不自动安装 peer dependencies](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，因此需要您手动安装额外的依赖。

```bash
pnpm add @sinclair/typebox openapi-types
```

### 使用 Node.js

使用 Node.js 部署时，请确保在您的 `package.json` 中设置 `type: module`

::: code-group

```ts [package.json]
{
  "name": "elysia-app",
  "type": "module" // [!code ++]
}
```

:::

### 使用 Bun

使用 Bun 部署时，请确保在 `vercel.json` 中将运行时设置为 Bun

::: code-group

```ts [vercel.json]
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "bunVersion": "1.x" // [!code ++]
}
```

## 如果此方法不起作用

Vercel 对 Elysia 提供零配置支持，若需额外配置，请参考 [Vercel 文档](https://vercel.com/docs/frameworks/backend/elysia)

更多信息，请参考 [Vercel Function 文档](https://vercel.com/docs/functions?framework=other)。
