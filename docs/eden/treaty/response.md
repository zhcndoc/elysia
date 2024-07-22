---
title: Eden Treaty 响应
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 响应 - Elysia 中文文档

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的对象类表示，提供端到端类型安全性，以及显著改善的开发者体验。使用伊甸，我们可以完全类型安全地从 Elysia 服务器获取 API，无需代码生成。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的对象类表示，提供端到端类型安全性，以及显著改善的开发者体验。使用伊甸，我们可以完全类型安全地从 Elysia 服务器获取 API，无需代码生成。
---

# 响应

一旦调用 fetch 方法，Eden Treaty 返回一个 Promise，其对象如下：
- data - 响应返回值 (2xx)
- error - 响应返回值 (>= 3xx)
- response `Response` - Web 标准响应类
- status `number` - HTTP 状态码
- headers `FetchRequestInit['headers']` - 响应的头部

返回后，您必须提供错误处理以确保值真正返回以访问该值，否则该值将是可空的。

```typescript twoslash
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body: { name }, error }) => {
        if(name === 'Otto')
            return error(400, 'Bad Request')

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

    if(error)
        switch(error.status) {
            case 400:
                // 错误类型将被缩小
                throw error.value

            default:
                throw error.value
        }

    // 一旦错误被处理，类型将被展开
    // 类型: string
    return data
}
```

默认情况下，Elysia 将自动推断错误和响应类型到 TypeScript，并且伊甸将提供自动完成和类型缩小以实现准确的行为。

::: tip
如果服务器响应的 HTTP 状态 >= 300，那么值将始终为 null，并且错误将有返回值。

否则，响应将传递给 data。
:::

## Stream response
Eden will will interpret a stream response as `AsyncGenerator` allowing us to use `for await` loop to consume the stream.


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
```
