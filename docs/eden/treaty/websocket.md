---
title: 天堂条约 Web Socket - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 天堂条约 Web Socket - ElysiaJS

    - - meta
      - name: 'og:description'
        content: 天堂条约是一个类似对象的 Elysia 服务器表示，提供端到端的类型安全，以及显著改善的开发者体验。使用天堂条约，我们可以完全类型安全地从 Elysia 服务器获取 API，而无需代码生成。

    - - meta
      - name: 'og:description'
        content: 天堂条约是一个类似对象的 Elysia 服务器表示，提供端到端的类型安全，以及显著改善的开发者体验。使用天堂条约，我们可以完全类型安全地从 Elysia 服务器获取 API，而无需代码生成。
---

# WebSocket
天堂条约支持使用 `subscribe` 方法的 WebSocket。

```typescript twoslash
import { Elysia, t } from "elysia";
import { treaty } from "@elysiajs/eden";

const app = new Elysia()
  .ws("/chat", {
    body: t.String(),
    response: t.String(),
    message(ws, message) {
      ws.send(message);
    },
  })
  .listen(3000);

const api = treaty<typeof app>("localhost:3000");

const chat = api.chat.subscribe();

chat.subscribe((message) => {
  console.log("收到", message);
});

chat.on("open", () => {
  chat.send("来自客户端的问候");
});
```

**.subscribe** 接受与 `get` 和 `head` 相同的参数。

## 响应
**Eden.subscribe** 返回 **EdenWS**，它扩展了 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) 并且语法相同。

如果需要更多控制，可以访问 **EdenWebSocket.raw** 以与原生 WebSocket API 进行交互。
