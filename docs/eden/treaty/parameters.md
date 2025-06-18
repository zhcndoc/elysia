---
title: Eden Treaty 参数 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 参数 - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的类对象表示，提供端到端的类型安全和显著改善的开发者体验。通过 Eden，我们可以从 Elysia 服务器安全地获取 API，而无需代码生成。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的类对象表示，提供端到端的类型安全和显著改善的开发者体验。通过 Eden，我们可以从 Elysia 服务器安全地获取 API，而无需代码生成。
---

# 参数

我们最终需要向服务器发送一个有效载荷。

为此，Eden Treaty 的方法接受 2 个参数来发送数据到服务器。

这两个参数都是类型安全的，并将由 TypeScript 自动指导：

1. body
2. 其他参数
    - query
    - headers
    - fetch

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

// ✅ 有效
api.user.post({
    name: 'Elysia'
})

// ✅ 也有效
api.user.post({
    name: 'Elysia'
}, {
    // 在模式中未指定，这是可选的
    headers: {
        authorization: 'Bearer 12345'
    },
    query: {
        id: 2
    }
})
```

除非方法不接受 body，否则将省略 body，仅保留一个参数。

如果方法为 **"GET"** 或 **"HEAD"**：

1. 其他参数
    -   query
    -   headers
    -   fetch

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

// ✅ 有效
api.hello.get({
    // 在模式中未指定，这是可选的
    headers: {
        hello: 'world'
    }
})
```

## 空的 body
如果 body 可选或不需要，但 query 或 headers 是必需的，则可以将 body 传递为 `null` 或 `undefined`。

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', () => 'hi', {
        query: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

api.user.post(null, {
    query: {
        name: 'Ely'
    }
})
```

## Fetch 参数

Eden Treaty 是一个 fetch 封装，我们可以通过将有效的 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 参数传递给 `$fetch` 来添加到 Eden 中：

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

const controller = new AbortController()

const cancelRequest = setTimeout(() => {
    controller.abort()
}, 5000)

await api.hello.get({
    fetch: {
        signal: controller.signal
    }
})

clearTimeout(cancelRequest)
```

## 文件上传
我们可以传递以下任一项来附加文件：
- **File**
- **File[]**
- **FileList**
- **Blob**

附加文件将使 **content-type** 变为 **multipart/form-data**

假设我们有如下的服务器：
```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/image', ({ body: { image, title } }) => title, {
        body: t.Object({
            title: t.String(),
            image: t.Files()
        })
    })
    .listen(3000)

export const api = treaty<typeof app>('localhost:3000')

const images = document.getElementById('images') as HTMLInputElement

const { data } = await api.image.post({
    title: "Misono Mika",
    image: images.files!,
})
```
