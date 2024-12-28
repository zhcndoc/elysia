---
title: 伊甸条约遗产 - ElysiaJS
search: false
head:
  - - meta
    - property: 'og:title'
      content: 伊甸条约遗产 - ElysiaJS

  - - meta
    - name: 'og:description'
      content: 伊甸条约是一个对象类似的 Elysia 服务器表示，提供端到端的类型安全和显著改善的开发者体验。借助伊甸，我们可以从 Elysia 服务器中获取完全类型安全的 API，而不需要代码生成。

  - - meta
    - name: 'og:description'
      content: 伊甸条约是一个对象类似的 Elysia 服务器表示，提供端到端的类型安全和显著改善的开发者体验。借助伊甸，我们可以从 Elysia 服务器中获取完全类型安全的 API，而不需要代码生成。
---

# 伊甸条约遗产

::: tip 注意
这是针对伊甸条约 1 或 (edenTreaty) 的文档。

对于新项目，建议使用伊甸条约 2 (treaty) 而不是。
:::

伊甸条约是 Elysia 服务器的对象类似表示。

提供类似普通对象的访问器，直接从服务器获取类型，帮助我们更快地工作，并确保不会发生错误。

---

要使用伊甸条约，首先导出您现有的 Elysia 服务器类型：
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => '嗨，Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!代码 ++]
```

然后导入服务器类型，并在客户端使用 Elysia API：
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server' // [!代码 ++]

const app = edenTreaty<App>('http://localhost:')

// 响应类型: '嗨，Elysia'
const { data: pong, error } = app.get()

// 响应类型: 1895
const { data: id, error } = app.id['1895'].get()

// 响应类型: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})
```

::: tip
伊甸条约具有完全的类型安全和自动补全支持。
:::

## 构造
伊甸条约会将所有现有路径转换为对象类似表示，可以描述为：
```typescript
EdenTreaty.<1>.<2>.<n>.<method>({
    ...body,
    $query?: {},
    $fetch?: RequestInit
})
```

### 路径
伊甸会将 `/` 转换为 `.`，可以用已注册的 `method` 调用，例如：
- **/path** -> .path
- **/nested/path** -> .nested.path

### 路径参数
路径参数会根据它们在 URL 中的名称自动映射。

- **/id/:id** -> .id.`<任何东西>`
- 例如: .id.hi
- 例如: .id['123']

::: tip
如果路径不支持路径参数，TypeScript 会显示错误。
:::

### 查询
您可以使用 `$query` 将查询附加到路径：
```typescript
app.get({
    $query: {
        name: '伊甸',
        code: '金'
    }
})
```

### 获取
伊甸条约是一个获取封装器，您可以通过将其传递给 `$fetch` 来为伊甸添加任何有效的 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 参数：
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
伊甸条约将返回一个 `data` 和 `error` 的值作为结果，均为完全类型。
```typescript
// 响应类型: { id: 1895, name: 'Skadi' }
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

**data** 和 **error** 的类型在您确认其状态之前都是可为空的。

简单来说，如果获取成功，data 将有值而 error 将为 null，反之亦然。

::: tip
错误被包装在一个 `Error` 中，其值从服务器返回，可以从 `Error.value` 中检索
:::

### 基于状态的错误类型
如果您在 Elysia 服务器中明确提供了错误类型，伊甸条约和伊甸获取可以根据状态码缩小错误类型。

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
    .get('/', () => '嗨，Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: 'nendoroid',
        response: {
            200: 'nendoroid', // [!代码 ++]
            400: 'error', // [!代码 ++]
            401: 'error' // [!代码 ++]
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
            // 缩小到服务器中描述的类型 'error'
            warnUser(error.value)
            break

        default:
            // 类型为 unknown
            reportError(error.value)
            break
    }

    throw error
}
```

## WebSocket
伊甸支持 WebSocket，使用与普通路由相同的 API。
```typescript
// 服务器
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

要开始监听实时数据，调用 `.subscribe` 方法：
```typescript
// 客户端
import { edenTreaty } from '@elysiajs/eden'
const app = edenTreaty<App>('http://localhost:')

const chat = app.chat.subscribe()

chat.subscribe((message) => {
    console.log('接收到', message)
})

chat.send('客户端发送的你好')
```

我们可以使用 [schema](/integrations/cheat-sheet#schema) 来强制 WebSocket 的类型安全，正如普通路由一样。

---

**Eden.subscribe** 返回 **EdenWebSocket**，它扩展了 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) 类，具备类型安全。语法与 WebSocket 相同。

如果需要更多控制，可以访问 **EdenWebSocket.raw** 与原生 WebSocket API 交互。

## 文件上传
您可以将以下之一传递到字段中以附加文件：
- **File**
- **FileList**
- **Blob**

附加文件将导致 **content-type** 为 **multipart/form-data**。

假设我们有如下服务器：
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

我们可以如下使用客户端：
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
