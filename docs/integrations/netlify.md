---
title: 与 Netlify Edge Function 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Netlify Edge Function 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 构建于 Web 标准的 Request/Response 之上，使我们能够在 Netlify Edge Function 上运行 Elysia

    - - meta
      - property: 'og:description'
        content: Elysia 构建于 Web 标准的 Request/Response 之上，使我们能够在 Netlify Edge Function 上运行 Elysia
---

# 与 Netlify Edge Function 集成
[Netlify Edge Function](https://docs.netlify.com/build/edge-functions/overview/) 运行在 [Deno](/integrations/deno) 环境上，Deno 是 Elysia 支持的运行时之一，因为 Elysia 是建立在 Web 标准之上。

Netlify Edge Functions 需要一个特定的目录来运行函数，默认目录是 **\<directory\>/netlify/edge-functions**。

如果要创建一个路径为 **/hello** 的函数，需要在 `netlify/edge-functions/hello.ts` 文件中创建，然后直接 `export default` 一个 Elysia 实例。

::: code-group

```typescript [netlify/edge-functions/hello.ts]
import { Elysia } from 'elysia'

export const config = { path: '/hello' } // [!code ++]

export default new Elysia({ prefix: '/hello' }) // [!code ++]
	.get('/', () => 'Hello Elysia')
```

:::

### 本地运行
要在本地测试 Netlify Edge Function 上的 Elysia 服务器，可以安装 [Netlify CLI](https://docs.netlify.com/build/edge-functions/get-started/#test-locally) 来模拟函数调用。

安装 Netlify CLI：
```bash
bun add -g netlify-cli
```

启动开发环境：
```bash
netlify dev
```

更多信息，请参考 [Netlify Edge Function 文档](https://docs.netlify.com/build/edge-functions)。