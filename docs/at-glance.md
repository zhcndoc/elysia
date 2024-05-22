---
title: 简介
head:
    - - meta
      - property: 'og:title'
        content: 简介 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 设计符合人体工程学，广泛支持 TypeScript、现代 JavaScript API，并针对 Bun 进行了优化。提供独特的统一类型体验和端到端类型安全，同时保持出色的性能。

    - - meta
      - property: 'og:description'
        content: 设计符合人体工程学，广泛支持 TypeScript、现代 JavaScript API，并针对 Bun 进行了优化。提供独特的统一类型体验和端到端类型安全，同时保持出色的性能。
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)

const demo2 = new Elysia()
    .get('/user/:id', ({ params: { id }}) => id)
    .get('/user/abc', () => 'abc')
</script>

# 简介
Elysia 是一个符合人体工程学的 Web 框架，用于使用 Bun 构建后端服务器。

该框架在设计时考虑到了简洁性和类型安全性，其熟悉的 API 广泛支持 TypeScript，并针对 Bun 进行了优化。

下面是 Elysia 中一个简单的 hello world。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    .listen(3000)
```

打开 [localhost:3000](http://localhost:3000/)，结果应该显示 "Hello Elysia"。

<Playground 
    :elysia="demo1"
    :alias="{
        '/user/:id': '/user/1'
    }"
    :mock="{
        '/user/:id': {
            GET: '1'
        },
        '/form': {
            POST: JSON.stringify({
                hello: 'Elysia'
            })
        }
    }" 
/>

::: tip
将鼠标悬停在代码片段上查看类型定义。

在模拟浏览器中，单击蓝色路径突出显示以更改路径以预览响应，Elysia 可以在浏览器上运行，你看到的结果实际上是使用 Elysia 运行的。
:::

## 性能

在 Bun 和静态代码分析（Static Code Analysis）等广泛优化的基础上，Elysia 可以快速生成优化代码。

Elysia 的性能超过了当今大多数网络框架<a href="#ref-1"><sup>[1]</sup></a>，甚至可以媲美 Golang 和 Rust 框架<a href="#ref-2"><sup>[2]</sup></a>。

| Framework     | Runtime | Average     | Plain Text | Dynamic Parameters | JSON Body  |
| ------------- | ------- | ----------- | ---------- | ------------------ | ---------- |
| bun           | bun     | 262,660.433 | 326,375.76 | 237,083.18         | 224,522.36 |
| elysia        | bun     | 255,574.717 | 313,073.64 | 241,891.57         | 211,758.94 |
| hyper-express | node    | 234,395.837 | 311,775.43 | 249,675            | 141,737.08 |
| hono          | bun     | 203,937.883 | 239,229.82 | 201,663.43         | 170,920.4  |
| h3            | node    | 96,515.027  | 114,971.87 | 87,935.94          | 86,637.27  |
| oak           | deno    | 46,569.853  | 55,174.24  | 48,260.36          | 36,274.96  |
| fastify       | bun     | 65,897.043  | 92,856.71  | 81,604.66          | 23,229.76  |
| fastify       | node    | 60,322.413  | 71,150.57  | 62,060.26          | 47,756.41  |
| koa           | node    | 39,594.14   | 46,219.64  | 40,961.72          | 31,601.06  |
| express       | bun     | 29,715.537  | 39,455.46  | 34,700.85          | 14,990.3   |
| express       | node    | 15,913.153  | 17,736.92  | 17,128.7           | 12,873.84  |

## TypeScript

Elysia 旨在帮助你减少编写 TypeScript。

Elysia 的类型系统经过精心调整，可以自动推断出你的代码类型，而无需编写显式的 TypeScript，同时为运行时和编译时提供类型安全性，从而为你提供最舒适的开发者体验。

看一下这个例子：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id)
                        // ^?
    .listen(3000)
```

上述代码创建了一个路径参数 "id"，替换 `:id` 的值将在运行时和类型中都被传递到 `params.id`，无需手动声明类型。

<Playground 
    :elysia="demo2"
    :alias="{
        '/user/:id': '/user/123'
    }"
    :mock="{
        '/user/:id': {
            GET: '123'
        },
    }" 
/>

Elysia 的目标是帮助你减少 TypeScript 的编写，更专注于业务逻辑。让复杂类型由框架处理。

使用 Elysia 不需要 TypeScript，但建议与 TypeScript 一起使用 Elysia。

## 类型完整性

为了更进一步，Elysia 提供了 **Elysia.t**，这是一个模式构建器，用于在运行时和编译时验证类型和值，从而为你的数据类型创建单一的真实来源。

让我们修改先前的代码，仅接受数值而不是字符串。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
                                // ^?
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

这段代码确保我们的路径参数 **id** 将始终是一个数字字符串，并且会在运行时和编译时（类型级别）自动转换为数字。

::: tip
在上面的代码片段中将鼠标悬停在 "id" 上以查看类型定义。
:::

通过 Elysia 模式构建器，我们可以像具有单一真实来源的强类型语言一样确保类型安全。

## 标准

Elysia 默认采用许多标准，例如 OpenAPI 和 WinterCG 合规性，允许你与大多数行业标准工具集成，或者至少轻松与你熟悉的工具集成。

例如，由于 Elysia 默认采用 OpenAPI，因此使用 Swagger 生成文档就像添加一行代码一样简单：

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

使用 Swagger 插件，你可以无缝生成 Swagger 页面，无需额外代码或特定配置，并轻松与你的团队共享。

## 端到端类型安全

对于 Elysia，类型安全不仅限于服务器端。

有了 Elysia，你就可以利用 Elysia 的客户端库 "Eden"，像 tRPC 一样与前端团队自动同步类型。

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)

export type App = typeof app
```

在你的客户端：

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)

export type App = typeof app

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// Get data from /user/617
const { data } = await app.user({ id: 617 }).get()
      // ^?

console.log(data)
```

使用 Eden，你可以使用现有的 Elysia 类型来查询 Elysia 服务器，**而无需生成代码**，并自动同步前端和后端的类型。

Elysia 不仅能帮助你创建一个自信的后端，还能帮助你创建这个世界上所有美好的事物。

## 与平台无关

Elysia 的设计**不局限于 Bun**。由于[兼容 WinterCG](https://wintercg.org/)，你可以将 Elysia 服务器部署到 Cloudflare Worker、Vercel Edge Function 和其他大多数支持 Web 标准请求的运行时上。

## 我们的社区

如果你对 Elysia 有疑问或遇到困难，请随时在 GitHub 讨论、Discord 和 Twitter 上向我们的社区提问。

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        ElysiaJS 官方 Discord 社区服务器
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        跟踪 Elysia 的更新和状态
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        源代码和开发
    </Card>
</Deck>

---

<small id="ref-1">1. 以请求/秒为单位进行测量。 Debian 11、Intel i7-13700K 上解析查询、路径参数和设置响应标头的基准测试于 2023 年 8 月 6 日在 Bun 0.7.2 上进行测试。请参阅[此处的](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results)基准测试条件。</small>

<small id="ref-2">2. 基于 [TechEmpower 基准测试第 22 轮](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite)。</small>
