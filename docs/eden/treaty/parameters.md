---

title: Eden Treaty 参数
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 参数 - ElysiaJS 中文文档

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是一个类似对象的 Elysia 服务器表示，提供端到端类型安全，以及显著改善的开发体验。使用 Eden，我们可以完全类型安全地从 Elysia 服务器获取 API，无需代码生成。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是一个类似对象的 Elysia 服务器表示，提供端到端类型安全，以及显著改善的开发体验。使用 Eden，我们可以完全类型安全地从 Elysia 服务器获取 API，无需代码生成。
---

# 参数

我们最终需要向服务器发送一个有效载荷。

为了处理这个问题，Eden Treaty 的方法接受 2 个参数向服务器发送数据。

两个参数都是类型安全的，并且将由 TypeScript 自动引导：

1. body
2. 附加参数
    - query
    - headers
    - fetch

```typescript twoslash
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

// ✅ 同样有效
api.user.post({
    name: 'Elysia'
}, {
    // 这是可选的，因为架构中没有指定
    headers: {
        authorization: 'Bearer 12345'
    },
    query: {
        id: 2
    }
})
```

除非方法不接受 body，那么 body 将被省略，只剩下单个参数。

如果方法为 **“GET”** 或 **“HEAD”**：

1. 附加参数
    -   query
    -   headers
    -   fetch

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

// ✅ 有效
api.hello.get({
    // 这是可选的，因为架构中没有指定
    headers: {
        hello: 'world'
    }
})
```

## 空 body

如果 body 是可选的或不需要，但是需要 query 或 headers，你可以将 body 作为 `null` 或 `undefined` 传递。

```typescript twoslash
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

Eden Treaty 是一个 fetch 包装器，我们可以通过将它们传递给 `$fetch` 向 Eden 添加任何有效的 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 参数：

```typescript twoslash
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

我们可以通过传递以下任一来附加文件：

- **File**
- **File[]**
- **FileList**
- **Blob**

附加文件将导致 **content-type** 变为 **multipart/form-data**

假设我们有如下服务器：

```typescript twoslash
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
