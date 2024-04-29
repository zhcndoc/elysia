---
title: WebSocket
head:
    - - meta
      - property: 'title'
        content: WebSocket - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: Elysia 的 WebSocket 实现。使用 "ws" 声明 WebSocket 路由。WebSocket 是用于客户端和服务器之间实时通信的协议。

    - - meta
      - name: 'og:description'
        content: Elysia 的 WebSocket 实现。使用 "ws" 声明 WebSocket 路由。WebSocket 是用于客户端和服务器之间实时通信的协议。
---

# WebSocket

WebSocket 是用于客户端和服务器之间实时通信的协议。

与 HTTP 不同，我们的客户端不需要重复向网站请求信息并等待每次的回复。WebSocket 建立了一条直接的通信线路，使得客户端和服务器可以直接来回发送消息，从而使对话更快、更顺畅，无需每次都重新开始。

SocketIO 是一个流行的 WebSocket 库，但不是唯一的选择。Elysia 使用 [uWebSocket](https://github.com/uNetworking/uWebSockets)，Bun 在底层使用相同的 API。

要使用 WebSocket，只需调用 `Elysia.ws()`：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(3000)
```

## WebSocket 消息验证

与普通路由一样，WebSocket 也接受一个 **schema** 对象来严格类型化和验证请求。

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        // 验证传入的消息
        body: t.Object({
            message: t.String()
        }),
        message(ws, { message }) {
            ws.send({
                message,
                time: Date.now()
            })
        }
    })
    .listen(3000)
```

WebSocket schema 可以验证以下内容：

-   **message** - 传入的消息。
-   **query** - 查询字符串或 URL 参数。
-   **params** - 路径参数。
-   **header** - 请求的头部。
-   **cookie** - 请求的 cookie。
-   **response** - 处理程序返回的值。

默认情况下，Elysia 会将传入的字符串化 JSON 消息解析为对象进行验证。

## 配置

你可以设置 Elysia 构造函数来设置 WebSocket 的值。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
    websocket: {
        idleTimeout: 30
    }
})
```

Elysia 的 WebSocket 实现扩展了 Bun 的 WebSocket 配置，请参阅 [Bun 的 WebSocket 文档](https://bun.sh/docs/api/websockets)了解更多信息。

以下是来自 [Bun WebSocket](https://bun.sh/docs/api/websockets#create-a-websocket-server) 的简要配置：

### perMessageDeflate

@default `false`

启用对支持的客户端的压缩。

默认情况下，禁用压缩。

### maxPayloadLength

消息的最大大小。

### idleTimeout

@default `120`

连接在多少秒内未接收到消息后将被关闭。

### backpressureLimit

@default `16777216` (16MB)

单个连接可以缓冲的最大字节数。

### closeOnBackpressureLimit

@default `false`

达到背压限制时关闭连接。

## 方法

下面是 WebSocket 路由可用的新方法

## ws

创建一个 WebSocket 处理程序。

示例：

```typescript twoslash
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

endpoint：要公开为 WebSocket 处理程序的路径
options：自定义 WebSocket 处理程序的行为

## WebSocketHandler

WebSocketHandler 扩展了 [config](#configuration) 的配置。

以下是 `ws` 接受的配置。

## open

新的 WebSocket 连接的回调函数。

类型：

```typescript
open(ws: ServerWebSocket<{
    // 每个连接的唯一标识符
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
        // 每个连接的唯一标识符
        id: string
        data: Context
    }>,
    message: Message
): this
```

`Message` 类型基于 `schema.message`。默认为 `string`。

## close

关闭 WebSocket 连接的回调函数。

类型：

```typescript
close(ws: ServerWebSocket<{
    // 每个连接的唯一标识符
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
        // 每个连接的唯一标识符
        id: string
        data: Context
    }>,
    code: number,
    reason: string
): this
```

## parse

在升级 HTTP 连接为 WebSocket 之前解析请求的 `Parse` 中间件。

## beforeHandle

在升级 HTTP 连接为 WebSocket 之前执行的 `Before Handle` 中间件。

验证的理想位置。

## transform

在验证之前执行的 `Transform` 中间件。

## transformMessage

类似于 `transform`，但在验证 WebSocket 消息之前执行。

## header

在升级连接为 WebSocket 之前添加的其他头部。
