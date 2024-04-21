---
title: Schema
head:
    - - meta
      - property: 'og:title'
        content: Schema - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 模式是严格类型化的定义，用于推断 TypeScript 对传入请求和传出响应的类型和数据验证。Elysia 的模式验证基于 Sinclair 的 TypeBox，这是一个用于数据验证的 TypeScript 库。

    - - meta
      - property: 'og:description'
        content: 模式是严格类型化的定义，用于推断 TypeScript 对传入请求和传出响应的类型和数据验证。Elysia 的模式验证基于 Sinclair 的 TypeBox，这是一个用于数据验证的 TypeScript 库。
---

<script setup>
import Playground from '../../components/nearl/playground.vue'
import { Elysia, t, ValidationError } from 'elysia'

const demo1 = new Elysia()
    .get('/id/1', 1)
	.get('/id/a', () => {
		throw new ValidationError(
			'params',
			t.Object({
				id: t.Numeric()
			}),
			{
				id: 'a'
			}
		)
	})

const demo2 = new Elysia()
    .get('/none', () => 'hi')
    .guard({ 
        query: t.Object({ 
            name: t.String() 
        }) 
    }) 
    .get('/query', ({ query: { name } }) => name)
    .get('/any', ({ query }) => query)
</script>

# Schema

要创建一个安全的 Web 服务器，最重要的一点就是确保请求的格式正确。

Elysia 通过提供一个验证工具来解决这个问题，该工具使用模式生成器（Schema Builder）验证传入的请求。

**Elysia.t** 是基于 [TypeBox](https://github.com/sinclairzx81/typebox) 的模式生成器，可在运行时和编译时验证值，提供严格类型语言的类型安全性。

## 类型

Elysia 模式可验证以下内容：

-   body - HTTP 主体
-   query - 查询字符串或 URL 参数
-   params - 路径参数
-   header - 请求标头
-   cookie - 请求的 cookie
-   response - 处理程序返回的值

模式可分为 2 类：

1. 本地 Schema：在特定路由上验证
2. 全局 Schema：在每条路由上验证

## 本地 Schema

本地模式在特定路由上执行。

要验证本地模式，可以将模式内嵌到路由处理程序中：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
                               // ^?
        params: t.Object({ // [!code ++]
            id: t.Numeric() // [!code ++]
        }) // [!code ++]
    })
    .listen(3000)
```

<Playground :elysia="demo1" />

这段代码可确保路径参数 `id` 始终为数字字符串，然后在运行时和编译时（类型级）自动转换为数字。

响应列表如下：

| Path  | Response |
| ----- | -------- |
| /id/1 | 1        |
| /id/a | Error    |

## 全局 Schema

将钩子注册到之后的**每个**处理程序中。

要添加全局钩子，可以使用 `.guard`，然后用 camelCase 写一个生命周期事件：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/none', () => 'hi')
    .guard({ // [!code ++]
        query: t.Object({ // [!code ++]
            name: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/query', ({ query: { name } }) => name)
                    // ^?
    .get('/any', ({ query }) => query)
    .listen(3000)
```

<Playground
    :elysia="demo2"
    :mock="{
        '/query': {
            GET: 'Elysia'
        },
        '/any': {
            GET: JSON.stringify({ name: 'Elysia', race: 'Elf' })
        },
    }" 
/>

响应列表如下：

| Path          | Response |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

与生命周期事件一样，重要的是要记住 Elysia 模式的存储顺序与生命周期、队列或先进先出的顺序相同。

Elysia **始终**遵守代码从上到下的顺序，然后是生命周期事件和验证模式的顺序。
