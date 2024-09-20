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

一旦返回，你必须提供错误处理以确保响应数据值被解封装，否则该值将为空。Elysia 提供了 `error()` 辅助函数来处理错误，而 Eden 将为错误值提供类型缩小。

```typescript
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

    if (error)
        switch(error.status) {
            case 400:
                // 错误类型将被缩小
                throw error.value

            default:
                throw error.value
        }

    // Once the error is handled, type will be unwrapped
    // type: string
    return data
}
```

默认情况下，Elysia 将自动推断 `error` 和 `response` 类型到 TypeScript，并且伊甸将提供自动完成和类型缩小以实现准确的行为。

::: tip
如果服务器响应的 HTTP 状态码大于等于 300，则 value 将始终为 null，`error` 将返回一个值。

否则，响应将传递给 data。
:::

## 流响应
Eden 将解释流响应为 `AsyncGenerator`，允许我们使用 `for await` 循环来消费流。


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
