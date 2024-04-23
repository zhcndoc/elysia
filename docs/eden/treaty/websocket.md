---
title: Eden Treaty WebSocket
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty WebSocket - ElysiaJS 中文文档

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是一个类似对象的 Elysia 服务器表示，提供端到端类型安全性，以及显著改善的开发者体验。使用 Eden，我们可以完全类型安全地从 Elysia 服务器获取 API，无需代码生成。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是一个类似对象的 Elysia 服务器表示，提供端到端类型安全性，以及显著改善的开发者体验。使用 Eden，我们可以完全类型安全地从 Elysia 服务器获取 API，无需代码生成。
---

# WebSocket

Eden Treaty 支持使用 `subscribe` 方法的 WebSocket。

```typescript twoslash
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .ws('/chat', {
        body: t.String(),
        response: t.String(),
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

const chat = api.chat.subscribe()

chat.subscribe((message) => {
    console.log('got', message)
})

chat.send('hello from client')
```

**。subscribe** 接受与 `get` 和 `head` 相同的参数。

## 响应

**Eden.subscribe** 返回 **EdenWS**，它扩展了 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket)，结果在语法上是一致的。

如果需要更多的控制，可以访问 **EdenWebSocket.raw** 来与原生 WebSocket API 交互。
