---
title: Eden Treaty 概览
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 概览 - Elysia 中文文档

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是对 Elysia 服务器的对象样式表示，提供端到端类型安全性和显着改进的开发人员体验。通过 Eden，我们可以从 Elysia 服务器全面类型安全地获取 API，而无需进行代码生成。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是对 Elysia 服务器的对象样式表示，提供端到端类型安全性和显着改进的开发人员体验。通过 Eden，我们可以从 Elysia 服务器全面类型安全地获取 API，而无需进行代码生成。
---

# Eden Treaty

Eden Treaty 是用于与服务器进行交互的对象表示，具有类型安全、自动完成和错误处理功能。

要使用 Eden Treaty，首先导出你现有的 Elysia 服务器类型：

```typescript
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

然后在客户端导入服务器类型并使用 Elysia API。

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
      // ^?
```

## 类似树的语法

HTTP 路径是文件系统树的资源指示符。

文件系统由多层文件夹组成，例如：

-   /documents/elysia
-   /documents/kalpas
-   /documents/kelvin

每个级别由 **/** (斜杠) 和一个名称分隔。

然而在 JavaScript 中，我们不是使用 **“/”** (斜杠)，而是使用 **“。”** (点) 来访问更深层次的资源。

Eden Treaty 将 Elysia 服务器转换成类似文件系统树的系统，以便在 JavaScript 前端访问。

| Path         | Treaty       |
| ------------ | ------------ |
| /            | .index       |
| /hi          | .hi          |
| /deep/nested | .deep.nested |

结合 HTTP 方法，我们可以与 Elysia 服务器进行交互。

| Path         | Method | Treaty              |
| ------------ | ------ | ------------------- |
| /            | GET    | .index.get()        |
| /hi          | GET    | .hi.get()           |
| /deep/nested | GET    | .deep.nested.get()  |
| /deep/nested | POST   | .deep.nested.post() |

## 动态路径

然而，不能使用符号表示动态路径参数。如果完全替换它们，我们就不知道参数名称应该是什么。

```typescript
// ❌ 不清楚这个值应该代表什么？
treaty.item['skadi'].get()
```

为了处理这个问题，我们可以使用一个函数来指定动态路径，以提供一个键值。

```typescript
// ✅ 清楚值是动态路径 'name'
treaty.item({ name: 'Skadi' }).get()
```

| Path            | Treaty                           |
| --------------- | -------------------------------- |
| /item           | .item                            |
| /item/:name     | .item({ name: 'Skadi' })         |
| /item/:name/id  | .item({ name: 'Skadi' }).id      |
