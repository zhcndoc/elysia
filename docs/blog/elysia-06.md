---
title: Elysia 0.6 - 游戏
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.6 - 游戏

    - - meta
      - name: 'description'
        content: 介绍重新设计的插件模型、动态模式、更好的开发者体验，包括声明式自定义错误、可定制的宽松和严格路径映射、TypeBox 0.30 和 WinterCG 框架互操作性。再次推动可能性的边界。

    - - meta
      - property: 'og:description'
        content: 介绍重新设计的插件模型、动态模式、更好的开发者体验，包括声明式自定义错误、可定制的宽松和严格路径映射、TypeBox 0.30 和 WinterCG 框架互操作性。再次推动可能性的边界。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/elysia-06/this-game.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/elysia-06/this-game.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.6 - 游戏"
    src="/blog/elysia-06/this-game.webp"
    alt="水晶骑士棋子"
    author="saltyaom"
    date="2023 年 8 月 6 日"
>

以传奇动漫《No Game No Life》的开场曲名 “这游戏” 命名，由 Konomi Suzuki 创作。

这游戏推动中型项目到大型应用的边界，通过重新设计的插件模型、动态模式，提高开发者体验，包括声明式自定义错误、收集更多度量数据的 ‘onResponse’、可定制的宽松和严格路径映射、TypeBox 0.30 和 WinterCG 框架互操作性。

###### (我们仍在等待《No Game No Life》的第二季)

## 新插件模型
这游戏引入了新的插件注册语法，并提出了一个新的内部插件模型。

之前，你可以在定义一个回调函数以处理 Elysia 实例，就像这样：
```ts
const plugin = (app: Elysia) => app.get('/', () => 'hello')
```

有了新的插件，你现在可以将 Elysia 实例转换成一个插件：
```ts
const plugin = new Elysia()
    .get('/', () => 'hello')
```

这允许任何 Elysia 实例，甚至是现有的实例，在应用程序中使用，消除了可能存在的额外回调和缩进。

这极大地提高了开发体验，特别是在嵌套组的情况中：
```ts
// < 0.6
const group = (app: Elysia) => app
    .group('/v1', (app) => app
        .get('/hello', () => 'Hello World')
    )

// >= 0.6
const group = new Elysia({ prefix: '/v1' })
    .get('/hello', () => 'Hello World')
```

我们鼓励你使用新的 Elysia 插件实例模型，因为我们能够利用插件校验和未来可能的新功能。

然而，我们**并没有弃用**回调函数方法，因为有些情况函数模型是有用的，比如：
- 内联函数
- 插件需要主实例的信息 (例如访问 OpenAPI 模式)

有了新的插件模型，我们希望你的代码库更容易维护。

## 插件校验
默认情况下，Elysia 插件使用函数回调来注册插件。

这意味着如果你注册一个插件用于类型声明，它会在生产环境中重复自身，只为了提供类型支持。

这就是为什么引入了插件校验，以去重复化注册的插件。

要启用插件校验，你需要使用新的插件模型，并为插件提供一个 `name` 属性，告诉 Elysia 防止插件被去重复化：
```ts
const plugin = new Elysia({
    name: 'plugin'
})
```

这允许 Elysia 识别插件并进行去重复化处理。

任何重复的名称将只在注册一次，但即使插件被去重复化，也会在注册后提供类型安全性。

如果在插件中需要配置，你可以将配置传递到一个 **seed** 属性中来生成一个用于去重复化的校验和。

```ts
const plugin = (config) = new Elysia({
    name: 'plugin',
    seed: config
})
```

名称和种子将用于生成校验和以去重复化注册，从而带来更好的性能改进。

这次更新还修复了插件的生命周期事件，因为在 Elysia 不确定插件是本地还是全局事件时，插件的生命周期事件被意外去重复化。

一如既往，这意味着在 “Hello World” 之外的项目中性能改进。

## Mount 和 WinterCG 兼容性
WinterCG 是一个由 Cloudflare、Deno、Vercel Edge Runtime、Netlify Function 等支持的 Web 互操作性运行时标准。

WinterCG 是一个标准，允许 Web 服务器在不同的运行时之间运行互操作性代码，它使用 Web 标准定义如 Fetch、Request 和 Response。

由于这一点，Elysia 部分遵循 WinterCG 兼容性，因为我们优化了 Bun，同时也公开支持其他可能的运行时。

这允许任何兼容 WinterCG 的框架和代码在一起运行，[Hono](https://honojs.dev) 框架证明了这个可能，它引入了**。mount** 方法来在单个代码库中运行多个框架，包括 Remix、Elysia、Itty Router 和 Hono 本身。

通过这一点，我们实现了同样的逻辑，为 Elysia 引入了 `.mount` 方法来运行任何兼容 WinterCG 的框架或代码。

要使用 `.mount`，[只需传递一个 `fetch` 函数](https://twitter.com/saltyAom/status/1684786233594290176)：
```ts
const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

一个 **fetch** 函数是一个函数，它接受一个类似 Web 标准请求的对象，并返回一个 Web 标准响应，其定义为：
```ts
// Web Standard Request-like object
// Web Standard Response
type fetch = (request: RequestLike) => Response
```

默认情况下，这个声明被以下使用：
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler

这意味着你可以在一个服务器上运行所有上述代码，或者在单个部署中重用现有代码，无需设置反向代理来处理多个服务器。

如果框架也支持 `.mount` 方法，你可以无限地嵌套支持它的框架。
```ts
const elysia = new Elysia()
    .get('/Hello from Elysia inside Hono inside Elysia')

const hono = new Hono()
    .get('/', (c) => c.text('Hello from Hono!'))
    .mount('/elysia', elysia.fetch)

const main = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
    .listen(3000)
```

你甚至可以在你的服务器中重用多个现有的 Elysia 项目。

```ts
import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

如果传入 `mount` 的实例是一个 Elysia 实例，它将自动解析为 `use`，默认提供类型安全和 Eden 的支持。

这使得框架和运行时之间的互操作性成为可能。

## 改进启动时间
在无服务器环境中，启动时间是一个重要指标，而 Elysia 在这方面表现出色，但我们又进一步提高了它。

默认情况下，Elysia 为每个路由自动生成 OpenAPI 模式并将其存储在内部，如果不使用它们。

在这个版本中，Elysia 推迟了编译并将它移动到 `@elysiajs/swagger`，从而使得 Elysia 的启动时间更快。

通过各种微优化，以及新的插件模型，启动时间现在快了 35%。

## 动态模式
Elysia 引入了静态代码分析和提前编译，以推动性能的边界。

静态代码分析允许 Elysia 读取你的代码，然后生成最优化的代码版本，使 Elysia 性能达到极限。

即使 Elysia 是 WinterCG 兼容的，像 Cloudflare worker 这样的环境也不支持函数组合。

这意味着提前编译是不可能的，导致我们创建了一个动态模式，使用即时编译 (JIT)，允许 Elysia 在 Cloudflare Worker 上也运行。

要启用动态模式，请将 `aot` 设置为 false。
```ts
new Elysia({
    aot: false
})
```

动态模式在 Cloudflare worker 中默认启用。

#### 值得注意的是，启用动态模式会禁用一些特性，比如动态注入代码，如 `t.Numeric`，它自动将字符串解析为数字。

提前编译可以读取、检测和优化你的代码，以换取启动时间，而动态模式使用 JIT 编译，使得启动时间更快，达到 6 倍。

但应该注意的是，Elysia 的启动时间已经足够快了。

Elysia 能够注册 10,000 个路由，只需 78 毫秒，这意味着平均每个路由 0.0079 毫秒/路由。

也就是说，我们给你留下了一个选择。

## 声明式自定义错误
这个更新增加了为处理自定义错误添加类型支持的功能。

```ts
class CustomError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .addError({
        MyError: CustomError
    })
    .onError(({ code, error }) => {
        switch(code) {
            // 带有自动完成
            case 'MyError':
                // 带有类型缩小
                // Error 被类型化为 CustomError
                return error
        }
    })
```

这允许我们处理自定义类型，使用类型缩小来处理自定义错误和自动完成错误代码，完全类型安全地声明式地处理。

这满足了我们的主要哲学之一，即专注于开发者的体验，特别是类型。

Elysia 类型系统很复杂，但我们试图避免使用者需要编写自定义类型或传递自定义泛型，保留所有代码看起来就像 JavaScript。

它只是工作，所有代码看起来就像 JavaScript。

## TypeBox 0.30
TypeBox 是核心库，它为 Elysia 的严格类型系统 “Elysia.t” 提供动力。

在这个更新中，我们更新了 TypeBox 从 0.28 到 0.30，以使类型系统更加精细，几乎实现了严格的类型语言。

这些更新引入了新的功能和许多有趣的改变，例如 **Iterator** 类型，减少包的大小，TypeScript 代码生成。

并且支持实用类型，如：
- `t.Awaited`
- `t.Uppercase`
- `t.Capitlized`

## 严格路径
我们收到了很多关于处理宽松路径的请求。

默认情况下，Elysia 严格处理路径，这意味着如果你支持路径有或没有可选的 `/`，它不会被解析，你需要重复路径名两次。

```ts
new Elysia()
    .group('/v1', (app) => app
        // 处理 /v1
        .get('', handle)
        // 处理 /v1/
        .get('/', handle)
    )
```

通过这一点，许多人要求 `/v1/` 也应该解析为 `/v1`。

有了这个更新，我们添加了对宽松路径匹配的支持，默认自动启用。
```ts
new Elysia()
    .group('/v1', (app) => app
        // 处理 /v1 和 /v1/
        .get('/', handle)
    )
```

要禁用宽松路径映射，你可以将 `strictPath` 设置为 true 来使用以前的行为：
```ts
new Elysia({
    strictPath: false
})
```

我们希望这将澄清任何关于路径匹配和预期行为的问题。

## onResponse
这个更新引入了一个新的生命周期钩子，称为 `onResponse`。

这是在 elysia#67 中提出的一个提议。

以前，Elysia 的生命周期如图所示。
![Elysia 生命周期图](/blog/elysia-06/lifecycle-05.webp)

对于任何度量、数据收集或日志记录的目的，你可以使用 `onAfterHandle` 运行函数来收集度量，但是这个生命周期在处理程序运行时错误 (无论是路由错误还是自定义错误提供) 时不会被触发。

这就是为什么我们引入了 `onResponse` 来处理所有响应的情况。

你可以使用 `onRequest` 和 `onResponse` 一起来衡量性能或其他必要的日志记录。

引用
> 然而，onAfterHandle 函数只有在成功响应时才会触发。例如，如果路由没有找到，或者正文无效，或者抛出错误，它就不会触发。我该如何监听成功和失败的请求？这就是为什么我建议 onResponse。
>
> 根据绘图，我建议以下内容：
> ![Elysia 生命周期图，带有 onResponse 钩子](/blog/elysia-06/lifecycle-06.webp)

---

### 重要改进：
- 添加了一个错误字段到 Elysia 类型系统中，以添加自定义错误消息
- 支持 Cloudflare worker 的动态模式 (和 ENV)
- AfterHandle 现在自动映射值
- 使用 bun build 来针对 Bun 环境，总体性能提高了 5-10%
- 去重复化了内联生命周期，当使用插件注册时
- 支持设置 `prefix`
- 递归路径类型
- 略微提高了类型检查速度
- 递归模式冲突导致无限类型

### 变更：
- 将 **registerSchemaPath** 移动到 `@elysiajs/swagger`
- [内部] 增加了 qi (查询索引) 到上下文中

### 重大变更：
- [内部] 移除了 Elysia Symbol
- [内部] 重构了 `getSchemaValidator`、`getResponseSchemaValidator` 到具名参数
- [内部] 将 `registerSchemaPath` 移动到 `@elysiajs/swagger`

我们已经度过了一年的里程碑，对于 Elysia 和 Bun 在这一年中的改进感到非常兴奋！

通过 Bun 推动 JavaScript 的性能边界，并通过 Elysia 提升开发者的体验，我们很高兴能够与你和我们的社区保持联系。

每一次更新都在使 Elysia 更加稳定，并逐渐提供更好的开发者体验，同时不会牺牲性能和功能。

我们很高兴看到我们的开源开发者社区如何通过他们的项目使 Elysia 焕发生机，例如：

- [Elysia Vite 插件 SSR](https://github.com/timnghg/elysia-vite-plugin-ssr)，允许我们使用 Vite 进行服务器端渲染，使用 Elysia 作为服务器。
- [Elysia Connect](https://github.com/timnghg/elysia-connect)，使 Connect 的插件与 Elysia 兼容。

以及更多选择 Elysia 作为下一个大项目的开发者。

随着我们的承诺，我们最近还推出了 [Mobius](https://github.com/saltyaom/mobius)，这是一个开源的 TypeScript 库，用于将 GraphQL 解析为 TypeScript 类型，而不依赖于代码生成，完全使用 TypeScript 模板文字类型，成为第一个实现端到端类型安全而不依赖于代码生成的框架。

我们非常感谢你对 Elysia 的巨大持续支持，我们希望在下一次发布中你一起推动边界。

> As this whole new world cheers my name
>
> I will never leave it to fate
>
> and when I see a chance, I will pave the way
>
> I calls checkmate
>
> This is the time to breakthrough
>
> So I will rewrite the story and finally change all the rule
>
> We are maverick
>
> We won't give in, until we win this game
> 
> Though I don't know what tomorrow holds
>
> I'll make a bet any play my cards to win this game
>
> Unlike the rest, I'll do my best, and I won't ever lose
>
> To give up this chance would be a deadly since, so let's bet it all
>
> I put all my fate in used let **the game begin**

</Blog>
