---
title: Eden Treaty 概览
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 概览 - Elysia 中文文档

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的对象化表示，提供了端到端的类型安全性，以及显著提升的开发体验。使用 Eden，我们可以在不生成代码的情况下，完全类型安全地从 Elysia 服务器获取 API。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的对象化表示，提供了端到端的类型安全性，以及显著提升的开发体验。使用 Eden，我们可以在不生成代码的情况下，完全类型安全地从 Elysia 服务器获取 API。
---

# Eden Treaty

Eden Treaty 是一种对象表示，用于与服务器交互，具有类型安全性、自动完成和错误处理。

要使用 Eden Treaty，首先导出您现有的 Elysia 服务器类型：

```typescript twoslash
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
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

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const app = treaty<App>('localhost:3000')

// response type: 'Hi Elysia'
const { data, error } = await app.hi.get()
```

## 类似树的语法

HTTP 路径是文件系统树的资源指示器。

文件系统由多个级别的文件夹组成，例如：

- /documents/elysia
- /documents/kalpas
- /documents/kelvin

每个级别由 **/** (斜杠) 和一个名称分隔。

然而在 JavaScript 中，我们不是使用 **“/”** (斜杠)，而是使用 **“。”** (点) 来访问更深层次的资源。

Eden Treaty 将 Elysia 服务器转换成类似文件系统树的系统，以便在 JavaScript 前端访问。

| Path         | Treaty       |
| ------------ | ------------ |
| /            | .index       |
| /hi          | .hi          |
| /deep/nested | .deep.nested |

结合 HTTP 方法，允许我们完全与 Elysia 服务器交互。

| Path         | Method | Treaty              |
| ------------ | ------ | ------------------- |
| /            | GET    | .index.get()        |
| /hi          | GET    | .hi.get()           |
| /deep/nested | GET    | .deep.nested.get()  |
| /deep/nested | POST   | .deep.nested.post() |

## 动态路径

然而，动态路径参数不能通过符号表示表达，如果完全替换，我们就不知道参数名称应该是什么。

```typescript
// ❌ 不清楚值应该代表什么？
treaty.item['skadi']
```

为了处理这个问题，我们可以使用函数来指定动态路径，提供键值对。

```typescript
// ✅ 清楚值是动态路径 'name'
treaty.item({ name: 'Skadi' })
```

| Path            | Treaty                           |
| --------------- | -------------------------------- |
| /item           | .item                            |
| /item/:name     | .item({ name: 'Skadi' })         |
| /item/:name/id  | .item({ name: 'Skadi' }).id      |
