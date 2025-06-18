---
title: Eden Treaty 响应 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 响应 - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的一种类对象表示，提供端到端的类型安全，并显著改善开发者体验。借助 Eden，我们可以在无需代码生成的情况下，从 Elysia 服务器获取完全类型安全的 API。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的一种类对象表示，提供端到端的类型安全，并显著改善开发者体验。借助 Eden，我们可以在无需代码生成的情况下，从 Elysia 服务器获取完全类型安全的 API。
---

# 响应
一旦调用 fetch 方法，Eden Treaty 会返回一个包含以下属性的对象的 `Promise`：
- data - 响应返回的值（2xx）
- error - 响应返回的错误值（>= 3xx）
- response `Response` - Web 标准的 Response 类
- status `number` - HTTP 状态码
- headers `FetchRequestInit['headers']` - 响应头信息

返回后，您必须进行错误处理以确保响应数据值被解包，否则该值将为可空。Elysia 提供了 `error()` 辅助函数来处理错误，Eden 会为错误值提供类型收窄。

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body: { name }, status }) => {
        if(name === 'Otto')
            return status(400, '错误请求')

        return name
    }, {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

const submit = async (name: string) => {
    const { data, error } = await api.user.post({
        name
    })

    // 类型: string | null
    console.log(data)

    if (error)
        switch(error.status) {
            case 400:
                // 错误类型将被收窄
                throw error.value

            default:
                throw error.value
        }

    // 一旦错误被处理，类型将被解包
    // 类型: string
    return data
}
```

默认情况下，Elysia 会自动推断 `error` 和 `response` 的类型到 TypeScript，Eden 将提供自动补全和类型收窄以实现准确的行为。

::: tip
如果服务器响应的 HTTP 状态码 >= 300，则值始终为 `null`，而 `error` 会包含返回的值。

否则，响应值将传递给 `data`。
:::

## 流响应
Eden 会将流响应视为 `AsyncGenerator`，允许我们使用 `for await` 循环来消费流。

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
               // ^?
```