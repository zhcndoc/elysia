---
title: 简介 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 简介 - ElysiaJS

    - - meta
      - name: 'description'
        content: 设计注重人体工学，广泛支持 TypeScript，现代 JavaScript API，优化用于 Bun。提供独特的统一类型体验和端到端的类型安全，同时保持出色的性能。

    - - meta
      - property: 'og:description'
        content: 设计注重人体工学，广泛支持 TypeScript，现代 JavaScript API，优化用于 Bun。提供独特的统一类型体验和端到端的类型安全，同时保持出色的性能。
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', '你好 Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)

const demo2 = new Elysia()
    .get('/user/:id', ({ params: { id }}) => id)
    .get('/user/abc', () => 'abc')
</script>

# 简介
Elysia 是一个用于构建后端服务器的符合人体工学的 Web 框架，旨在与 Bun 配合使用。

旨在简洁和类型安全，具有熟悉的 API，并广泛支持 TypeScript，优化用于 Bun。

以下是在 Elysia 中的简单 hello world 示例。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', '你好 Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    .listen(3000)
```

打开 [localhost:3000](http://localhost:3000/)，结果应该显示 '你好 Elysia'。

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
将鼠标悬停在代码片段上以查看类型定义。

在模拟浏览器中，单击蓝色高亮路径更改路径以预览响应， 

Elysia 可以在浏览器中运行，你所看到的结果实际上是通过 Elysia 执行的。
:::

## 性能

基于 Bun 及诸多优化（如静态代码分析），Elysia 能够动态生成优化后的代码。

Elysia 的性能优于当今大多数 Web 框架<a href="#ref-1"><sup>[1]</sup></a>，甚至可以与 Golang 和 Rust 框架的性能相匹配<a href="#ref-2"><sup>[2]</sup></a>。

| 框架         | 运行时 | 平均       | 普通文本   | 动态参数       | JSON 数据   |
| ------------ | ------ | ---------- | ---------- | --------------- | ----------- |
| bun          | bun    | 262,660.433| 326,375.76 | 237,083.18      | 224,522.36  |
| elysia       | bun    | 255,574.717| 313,073.64 | 241,891.57      | 211,758.94  |
| hyper-express| node   | 234,395.837| 311,775.43 | 249,675         | 141,737.08  |
| hono         | bun    | 203,937.883| 239,229.82 | 201,663.43      | 170,920.4   |
| h3           | node   | 96,515.027 | 114,971.87 | 87,935.94       | 86,637.27   |
| oak          | deno   | 46,569.853 | 55,174.24  | 48,260.36       | 36,274.96   |
| fastify      | bun    | 65,897.043 | 92,856.71  | 81,604.66       | 23,229.76   |
| fastify      | node   | 60,322.413 | 71,150.57  | 62,060.26       | 47,756.41   |
| koa          | node   | 39,594.14  | 46,219.64  | 40,961.72       | 31,601.06   |
| express      | bun    | 29,715.537 | 39,455.46  | 34,700.85       | 14,990.3    |
| express      | node   | 15,913.153 | 17,736.92  | 17,128.7        | 12,873.84   |

## TypeScript

Elysia 旨在帮助你编写更少的 TypeScript。

Elysia 的类型系统经过微调，可以自动推断你的代码类型，而无需编写显式的 TypeScript，同时提供运行时和编译时的类型安全，以提供最佳的开发者体验。

看这个例子：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id)
                        // ^?
    .listen(3000)
```

<br>

上述代码创建了一个路径参数 "id"，替换 `:id` 的值将被作为 `params.id` 传递，在运行时和类型中无需手动声明类型。

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

Elysia 的目标是帮助你编写更少的 TypeScript，并更多地关注业务逻辑。让复杂的类型处理交给框架。

使用 Elysia 并不需要 TypeScript，但建议使用 TypeScript。

## 类型完整性

为了更进一步，Elysia 提供 **Elysia.t**，一个架构构建器，用于在运行时和编译时验证类型和值，以创建数据类型的单一真实来源。

让我们修改之前的代码，仅接受数字值，而不是字符串。

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

这段代码确保我们的路径参数 **id** 永远是一个数字字符串，然后在运行时和编译时（类型级别）自动将其转换为数字。

::: tip
将鼠标悬停在上述代码片段中的 "id" 以查看类型定义。
:::

使用 Elysia 架构构建器，我们可以确保类型安全，如同强类型语言，且具有单一真实来源。

## 标准

Elysia 默认采用许多标准，如 OpenAPI 和 WinterCG 合规，允许你与大多数行业标准工具集成，或至少与你熟悉的工具轻松集成。

例如，由于 Elysia 默认采用 OpenAPI，因此生成 Swagger 文档就像添加一行代码一样简单：

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

使用 Swagger 插件，你可以轻松生成一个 Swagger 页面，而无需额外代码或特定配置，并轻松与团队分享。

## 端到端类型安全

使用 Elysia，类型安全不仅限于服务器端。

使用 Elysia，你可以像 tRPC 一样自动与前端团队同步你的类型，使用 Elysia 的客户端库 "Eden"。

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

在你的客户端代码中：

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

// 从 /user/617 获取数据
const { data } = await app.user({ id: 617 }).get()
      // ^?

console.log(data)
```

使用 Eden，你可以使用现有的 Elysia 类型来查询 Elysia 服务器 **无需代码生成**，并自动同步前后端的类型。

Elysia 不仅仅是帮助你创建一个可靠的后端，还关乎这个世界上美好的事物。

## 平台无关性

Elysia 被设计但**并不限于 Bun**。遵循 [WinterCG 合规](https://wintercg.org/) 允许你将 Elysia 服务器部署在 Cloudflare Worker、Vercel Edge Function 和其他支持 Web 标准请求的大多数运行时。

## 我们的社区

如果你有问题或在使用 Elysia 时遇到困难，欢迎在 GitHub Discussions、Discord 和 Twitter 上询问我们的社区。

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        官方 ElysiaJS Discord 社区服务器
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        追踪 Elysia 的更新和状态
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        源代码和开发
    </Card>
</Deck>

---

<small id="ref-1">1. 测量请求/秒。基于在 Debian 11 上进行的查询、路径参数解析和设置响应头的基准测试，Intel i7-13700K 测试于 2023 年 8 月 6 日，基于 Bun 0.7.2。有关基准测试条件，请参见 [此处](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results)。</small>

<small id="ref-2">2. 基于 [TechEmpower Benchmark round 22](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite)。</small>
