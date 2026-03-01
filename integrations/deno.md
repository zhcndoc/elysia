---
url: 'https://elysiajs.com/integrations/deno.md'
---

# 与 Deno 集成

Elysia 构建于 Web 标准的 Request/Response 之上，允许我们直接使用 Deno.serve 运行 Elysia。

要在 Deno 上运行 Elysia，只需将 `Elysia.fetch` 包裹在 `Deno.serve` 中即可

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000) // [!code --]

Deno.serve(app.fetch) // [!code ++]
```

然后你可以使用 `deno serve` 命令来运行服务器：

```bash
deno serve --watch src/index.ts
```

这就是在 Deno 上运行 Elysia 所需的全部步骤。

### 更改端口号

你可以在 `Deno.serve` 中指定端口号。

```ts
Deno.serve(app.fetch) // [!code --]
Deno.serve({ port:8787 }, app.fetch) // [!code ++]
```

### pnpm

如果你使用 pnpm，[pnpm 默认不自动安装 peer 依赖](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230)，这就要求你手动安装额外的依赖。

```bash
pnpm add @sinclair/typebox openapi-types
```
