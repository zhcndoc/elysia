---

title: Eden Treaty Legacy
head:
  - - meta
    - property: 'og:title'
      content: Eden Treaty Legacy - ElysiaJS 中文文档

  - - meta
    - name: 'og:description'
      content: Eden Treaty 是 Elysia 服务器的对象式表示，提供了端到端类型安全，以及显著改善的开发体验。使用 Eden，我们可以完全类型安全地从 Elysia 服务器获取 API，而无需代码生成。

  - - meta
    - name: 'og:description'
      content: Eden Treaty 是 Elysia 服务器的对象式表示，提供了端到端类型安全，以及显著改善的开发体验。使用 Eden，我们可以完全类型安全地从 Elysia 服务器获取 API，而无需代码生成。
---

# Eden Treaty Legacy

::: tip NOTE
这是 Eden Treaty 1 或 (edenTreaty) 的文档。

对于新项目，我们建议使用 Eden Treaty 2 (treaty) 代替。
:::

Eden Treaty 是 Elysia 服务器的对象式表示。

提供像普通对象一样的访问器，类型直接来自服务器，帮助我们更快地移动，并确保没有东西会坏掉。

---

要使用 Eden Treaty，首先导出您现有的 Elysia 服务器类型：

```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]
```

然后导入服务器类型，并在客户端使用 Elysia API：

```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const app = edenTreaty<App>('http://localhost:')

// response type: 'Hi Elysia'
const { data: pong, error } = app.get()

// response type: 1895
const { data: id, error } = app.id['1895'].get()

// response type: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})
```

::: tip
Eden Treaty 完全类型安全，并支持自动完成。
:::

## 解构

Eden Treaty 将所有现有路径转换为对象式表示，可以描述为：
```typescript
EdenTreaty.<1>.<2>.<n>.<method>({
    ...body,
    $query?: {},
    $fetch?: RequestInit
})
```

### 路径

Eden 将 `/` 转换为 `.`，可以用注册的 `method` 调用，例如：

- **/path** -> .path
- **/nested/path** -> .nested.path

### 路径参数

路径参数将根据 URL 中的名称自动映射。

- **/id/:id** -> .id.`<anyThing>`
- 例如：`.id.hi`
- 例如：`.id['123']`

::: tip
如果路径不支持路径参数，TypeScript 将显示错误。
:::

### 查询

你可以使用 `$query` 将查询附加到路径：
```typescript
app.get({
    $query: {
        name: 'Eden',
        code: 'Gold'
    }
})
```

### 获取

Eden Treaty 是一个获取包装器，你可以通过将参数传递给 `$fetch` 来向 Eden 添加任何有效的 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 参数：

```typescript
app.post({
    $fetch: {
        headers: {
            'x-organization': 'MANTIS'
        }
    }
})
```

## 错误处理

Eden Treaty 将返回 `data` 和 `error` 作为结果，两者都是完全类型的。

```typescript
// response type: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            warnUser(error.value)
            break

        case 500:
        case 502:
            emergencyCallDev(error.value)
            break

        default:
            reportError(error.value)
            break
    }

    throw error
}

const { id, name } = nendoroid
```

**data** 和 **error** 都将被类型化为可空，直到你可以使用类型保护来确认它们的状态。

简单来说，如果获取成功，data 将有值，error 将为 null，反之亦然。

::: tip
错误被包装在一个 `Error` 中，其值从服务器返回，可以从 `Error.value` 中检索
:::

### 基于状态的错误类型

Eden Treaty 和 Eden Fetch 可以根据状态码缩小错误类型，如果你在 Elysia 服务器中明确提供了错误类型。

```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
        nendoroid: t.Object({
            id: t.Number(),
            name: t.String()
        }),
        error: t.Object({
            message: t.String()
        })
    })
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: 'nendoroid',
        response: {
            200: 'nendoroid', // [!code ++]
            400: 'error', // [!code ++]
            401: 'error' // [!code ++]
        }
    })
    .listen(3000)

export type App = typeof app
```

在客户端：

```typescript
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            // narrow down to type 'error' described in the server
            warnUser(error.value)
            break

        default:
            // typed as unknown
            reportError(error.value)
            break
    }

    throw error
}
```

## WebSocket

Eden 使用与普通路由相同的 API 支持 WebSocket。

```typescript
// Server
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .ws('/chat', {
        message(ws, message) {
            ws.send(message)
        },
        body: t.String(),
        response: t.String()
    })
    .listen(3000)

type App = typeof app
```

要开始监听实时数据，请调用 `.subscribe` 方法：

```typescript
// Client
import { edenTreaty } from '@elysiajs/eden'
const app = edenTreaty<App>('http://localhost:')

const chat = app.chat.subscribe()

chat.subscribe((message) => {
    console.log('got', message)
})

chat.send('hello from client')
```

我们可以使用 [schema](/essential/schema) 来强制 WebSockets 上的类型安全，就像普通路由一样。

---

**Eden.subscribe** 返回 **EdenWebSocket**，它扩展了 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) 类，增加了类型安全。语法与 WebSocket 相同。

如果需要更多控制，**EdenWebSocket.raw** 可以被访问以与原生 WebSocket API 交互。

## 文件上传

你可以将以下任一内容传递给字段以附加文件：

- **File**
- **FileList**
- **Blob**

附加文件将导致 **content-type** 变为 **multipart/form-data**

假设我们的服务器如下：

```typescript
// server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
    .post('/image', ({ body: { image, title } }) => title, {
        body: t.Object({
            title: t.String(),
            image: t.Files(),
        })
    })
    .listen(3000)

export type App = typeof app
```

我们可以使用以下客户端：

```typescript
// client.ts
import { edenTreaty } from '@elysia/eden'
import type { Server } from './server'

export const client = edenTreaty<Server>('http://localhost:3000')

const id = <T extends HTMLElement = HTMLElement>(id: string) =>
    document.getElementById(id)! as T

const { data } = await client.image.post({
    title: "Misono Mika",
    image: id<HTMLInputElement>('picture').files!,
})
```
