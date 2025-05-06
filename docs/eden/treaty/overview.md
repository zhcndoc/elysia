---
title: 概述 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden 条约概述 - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden 条约是 Elysia 服务器的对象化表示，提供端到端类型安全性和显著改善的开发者体验。使用 Eden，我们可以在完全类型安全的情况下从 Elysia 服务器获取 API，无需生成代码。

    - - meta
      - name: 'og:description'
        content: Eden 条约是 Elysia 服务器的对象化表示，提供端到端类型安全性和显著改善的开发者体验。使用 Eden，我们可以在完全类型安全的情况下从 Elysia 服务器获取 API，无需生成代码。
---

# Eden 条约

Eden 条约是用于与服务器交互的对象表示，具有类型安全、自动补全和错误处理等特性。

要使用 Eden 条约，首先导出您现有的 Elysia 服务器类型：

```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => '你好 Elysia')
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

然后导入服务器类型并在客户端使用 Elysia API：

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => '你好 Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!代码 ++]

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!代码 ++]

const app = treaty<App>('localhost:3000')

// 响应类型: '你好 Elysia'
const { data, error } = await app.hi.get()
      // ^?
```

## 树状语法

HTTP 路径是文件系统树的资源指示符。

文件系统由多个级别的文件夹组成，例如：

-   /documents/elysia
-   /documents/kalpas
-   /documents/kelvin

每个层级由 **/**（斜杠）和一个名称分隔。

但是在 JavaScript 中，我们使用 **"."**（点）来访问更深层的资源，而不是使用 **"/"**（斜杠）。

Eden 条约将 Elysia 服务器转换为可以在 JavaScript 前端访问的树状文件系统。

| 路径         | 条约       |
| ------------ | ------------ |
| /            |              |
| /hi          | .hi          |
| /deep/nested | .deep.nested |

结合 HTTP 方法，我们可以与 Elysia 服务器进行交互。

| 路径         | 方法 | 条约              |
| ------------ | ------ | ------------------- |
| /            | GET    | .get()              |
| /hi          | GET    | .hi.get()           |
| /deep/nested | GET    | .deep.nested.get()  |
| /deep/nested | POST   | .deep.nested.post() |

## 动态路径

然而，动态路径参数无法使用符号表示。如果它们被完全替换，我们不知道参数名称应该是什么。

```typescript
// ❌ 不清楚这个值应该表示什么？
treaty.item['skadi'].get()
```

为了解决这个问题，我们可以使用函数指定一个动态路径，以提供键值。

```typescript
// ✅ 清楚值的动态路径是 'name'
treaty.item({ name: 'Skadi' }).get()
```

| 路径            | 条约                           |
| --------------- | -------------------------------- |
| /item           | .item                            |
| /item/:name     | .item({ name: 'Skadi' })         |
| /item/:name/id  | .item({ name: 'Skadi' }).id      |
