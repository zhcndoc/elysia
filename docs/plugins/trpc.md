---
title: tRPC Plugin
head:
    - - meta
      - property: 'og:title'
        content: tRPC Plugin - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for using tRPC on Bun with Elysia Server. Start by installing the plugin with "bun add @elysiajs/trpc".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for using tRPC on Bun with Elysia Server. Start by installing the plugin with "bun add @elysiajs/trpc".
---

# tRPC 插件
此插件添加了对 [tRPC](https://trpc.io/) 的支持

安装插件：
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

`Router` 是 TRPC 路由器的实例。

### endpoint
公开的 TRPC 终点的路径。