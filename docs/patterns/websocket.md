---
title: WebSocket - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: WebSocket - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的 WebSocket 实现。通过 "ws" 声明 WebSocket 路由开始。WebSocket 是一种用于客户端与服务器之间通信的实时协议。

    - - meta
      - name: 'og:description'
        content: Elysia 的 WebSocket 实现。通过 "ws" 声明 WebSocket 路由开始。WebSocket 是一种用于客户端与服务器之间通信的实时协议。
---

# WebSocket

WebSocket 是一种用于客户端与服务器之间通信的实时协议。

与 HTTP 不同，客户端一次又一次地询问网站信息并等待每次的回复，WebSocket 建立了一条直接的通道，使我们的客户端和服务器可以直接来回发送消息，从而使对话更快、更流畅，而无需每条消息都重新开始。

SocketIO 是一个流行的 WebSocket 库，但并不是唯一的。Elysia 使用 [uWebSocket](https://github.com/uNetworking/uWebSockets)，它与 Bun 在底层使用相同的 API。

要使用 WebSocket，只需调用 `Elysia.ws()`：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(3000)
```

## WebSocket 消息验证：

与普通路由相同，WebSocket 也接受一个 **schema** 对象来严格类型化和验证请求。

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        // 验证传入消息
        body: t.Object({
            message: t.String()
        }),
        query: t.Object({
            id: t.String()
        }),
        message(ws, { message }) {
            // 从 `ws.data` 获取 schema
            const { id } = ws.data.query
            ws.send({
                id,
                message,
                time: Date.now()
            })
        }
    })
    .listen(3000)
```

WebSocket schema 可以验证如下内容：

-   **message** - 传入消息。
-   **query** - 查询字符串或 URL 参数。
-   **params** - 路径参数。
-   **header** - 请求的头部。
-   **cookie** - 请求的 cookie。
-   **response** - 从处理器返回的值。

默认情况下，Elysia 将解析传入的字符串化 JSON 消息为对象以供验证。

## 配置

您可以通过 Elysia 构造函数设置 WebSocket 值。

```ts
import { Elysia } from 'elysia'

new Elysia({
    websocket: {
        idleTimeout: 30
    }
})
```

Elysia 的 WebSocket 实现扩展了 Bun 的 WebSocket 配置，更多信息请参见 [Bun 的 WebSocket 文档](https://bun.sh/docs/api/websockets)。

以下是 [Bun WebSocket](https://bun.sh/docs/api/websockets#create-a-websocket-server) 的简要配置：

### perMessageDeflate

@default `false`

为支持的客户端启用压缩。

默认情况下，压缩是禁用的。

### maxPayloadLength

消息的最大大小。

### idleTimeout

@default `120`

在连接未接收到消息后，经过这一秒数将关闭连接。

### backpressureLimit

@default `16777216` (16MB)

单个连接可以缓冲的最大字节数。

### closeOnBackpressureLimit

@default `false`

如果超过背压限制，关闭连接。

## 方法

以下是可用于 WebSocket 路由的新方法。

## ws

创建 WebSocket 处理程序。

示例：

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(3000)
```

类型：

```typescript
.ws(endpoint: path, options: Partial<WebSocketHandler<Context>>): this
```

* **endpoint** - 作为 WebSocket 处理程序暴露的路径
* **options** - 自定义 WebSocket 处理程序行为

## WebSocketHandler

WebSocketHandler 扩展自 [config](#configuration) 的配置。

以下是 `ws` 接受的配置。

## open

新的 WebSocket 连接的回调函数。

类型：

```typescript
open(ws: ServerWebSocket<{
    // 每个连接的 uid
    id: string
    data: Context
}>): this
```

## message

传入 WebSocket 消息的回调函数。

类型：

```typescript
message(
    ws: ServerWebSocket<{
        // 每个连接的 uid
        id: string
        data: Context
    }>,
    message: Message
): this
```

`Message` 类型基于 `schema.message`。默认是 `string`。

## close

关闭 WebSocket 连接的回调函数。

类型：

```typescript
close(ws: ServerWebSocket<{
    // 每个连接的 uid
    id: string
    data: Context
}>): this
```

## drain

服务器准备好接受更多数据的回调函数。

类型：

```typescript
drain(
    ws: ServerWebSocket<{
        // 每个连接的 uid
        id: string
        data: Context
    }>,
    code: number,
    reason: string
): this
```

## parse

`Parse` 中间件在将 HTTP 连接升级到 WebSocket 之前解析请求。

## beforeHandle

`Before Handle` 中间件在将 HTTP 连接升级到 WebSocket 之前执行。

理想的验证位置。

## transform

`Transform` 中间件在验证之前执行。

## transformMessage

类似于 `transform`，但在验证 WebSocket 消息之前执行。

## header

在将连接升级到 WebSocket 之前添加的附加头。
