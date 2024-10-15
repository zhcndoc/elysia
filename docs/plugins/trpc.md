---
title: tRPC 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: tRPC 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 提供的插件，支持在 Bun 上使用 tRPC 与 Elysia 服务器。首先通过 "bun add @elysiajs/trpc" 安装插件。

    - - meta
      - name: 'og:description'
        content: 为 Elysia 提供的插件，支持在 Bun 上使用 tRPC 与 Elysia 服务器。首先通过 "bun add @elysiajs/trpc" 安装插件。
---

# tRPC 插件
该插件支持使用 [tRPC](https://trpc.io/)

安装方式：
```bash
bun add @elysiajs/trpc @trpc/server @elysiajs/websocket 
```

然后使用它：
```typescript
import { compile as c, trpc } from "@elysiajs/trpc";
import { initTRPC } from "@trpc/server";
import { Elysia, t as T } from "elysia";

const t = initTRPC.create();
const p = t.procedure;

const router = t.router({
  greet: p

    // 💡 使用 Zod
    //.input(z.string())
    // 💡 使用 Elysia 的 T
    .input(c(T.String()))
    .query(({ input }) => input),
});

export type Router = typeof router;

const app = new Elysia().use(trpc(router)).listen(3000);
```

## trpc
接受 tRPC 路由器并注册到 Elysia 的处理程序。

类型：
```
trpc(router: Router, option?: {
    endpoint?: string
}): this
```

`Router` 是 TRPC 路由器实例。

### endpoint
暴露的 TRPC 端点路径。
