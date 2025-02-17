---
title: Elysia 0.6 - 这个游戏
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.6 - 这个游戏

    - - meta
      - name: 'description'
        content: 介绍重新设计的插件模型、动态模式、更好的开发者体验（通过声明式自定义错误）、可自定义的宽松和严格路径映射、TypeBox 0.30 和 WinterCG 框架的互操作性。再一次推动可能性的边界。

    - - meta
      - property: 'og:description'
        content: 介绍重新设计的插件模型、动态模式、更好的开发者体验（通过声明式自定义错误）、可自定义的宽松和严格路径映射、TypeBox 0.30 和 WinterCG 框架的互操作性。再一次推动可能性的边界。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-06/this-game.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-06/this-game.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.6 - 这个游戏"
    src="/blog/elysia-06/this-game.webp"
    alt="水晶骑士碎片"
    author="saltyaom"
    date="2023 年 8 月 6 日"
>

以传奇动漫 **“No Game No Life”** 的开场曲命名，**「[This Game](https://youtu.be/kJ04dMmimn8)」** 作曲者是 Konomi Suzuki。

这个游戏将中型项目的边界推向了大型应用程序，重新设计的插件模型、动态模式、声明式自定义错误的开发者体验提升、通过“onResponse”收集更多指标、可自定义的宽松和严格路径映射、TypeBox 0.30 和 WinterCG 框架的互操作性。

###### （我们仍在等待《No Game No Life》第二季）

## 新插件模型
这个游戏引入了新的插件注册语法，并提出了新的内部插件模型。

之前，你可以通过定义 Elysia 实例的回调函数来注册插件，如下所示：
```ts
const plugin = (app: Elysia) => app.get('/', () => 'hello')
```

使用新插件模型，你可以将 Elysia 实例直接转化为插件：
```ts
const plugin = new Elysia()
    .get('/', () => 'hello')
```

这允许任何 Elysia 实例甚至现有实例在应用程序中使用，消除了任何可能的额外回调和制表符间隔。

这显著提升了嵌套组的开发者体验：
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

我们鼓励您使用新的 Elysia 插件实例模型，因为我们可以利用插件校验和未来的新特性。

然而，我们并未**弃用**回调函数方法，因为某些情况下函数模型仍然有用，例如：
- 内联函数
- 需要访问主实例信息的插件（例如访问 OpenAPI 架构）

通过这个新的插件模型，我们希望您能够使代码库更易于维护。

## 插件校验和
默认情况下，Elysia 插件使用函数回调来注册插件。

这意味着如果你为类型声明注册一个插件，它会为了提供类型支持而自我重复，从而在生产中导致插件的重复使用。

因此引入了插件校验和，以防止类型声明注册的插件重复。

要使用插件校验和，您需要使用新的插件模型，并提供一个 `name` 属性来告诉 Elysia 防止插件重复：
```ts
const plugin = new Elysia({
    name: 'plugin'
})
```

这让 Elysia 能够根据名称识别插件并进行重复消除。

任何重复的名称将只注册一次，但即使插件已被去重，类型安全将在注册后提供。

如果您的插件需要配置，可以将配置提供到 **seed** 属性中，以生成去重复插件的校验和。

```ts
const plugin = (config) => new Elysia({
    name: 'plugin',
    seed: config
})
```

名称和种子将用于生成去重注册的校验和，从而实现更好的性能提升。

此更新还修复了插件的生命周期重复消除的情况，当 Elysia 不确定插件是本地还是全局事件时，会意外内联生命周期。

一如既往，这意味着对于大于“Hello World”的应用程序来说性能得到了提升。

## 挂载和 WinterCG 合规
WinterCG 是一个由 Cloudflare、Deno、Vercel Edge Runtime、Netlify Functions 和其他多种支持的网络互操作运行时标准。

WinterCG 允许 Web 服务器在运行时之间进行互操作，它使用 Fetch、Request 和 Response 等 Web 标准定义。

基于此，Elysia 部分遵循 WinterCG 合规，因为我们对 Bun 进行了优化，但在可能的情况下也开放地支持其他运行时。

这理论上允许任何框架和代码在一起运行，只要它们符合 WinterCG 的标准，这一实现由 [Hono](https://honojs.dev) 提出，它引入了 **.mount** 方法，以 [在一个代码库中运行多个框架](https://twitter.com/honojs/status/1684839623355490304)，包括 Remix、Elysia、Itty Router 和 Hono 本身。

因此，我们通过引入 `.mount` 方法实现了相同的逻辑，以运行任何符合 WinterCG 标准的框架或代码。

要使用 `.mount`，只需 [传递一个 `fetch` 函数](https://twitter.com/saltyAom/status/1684786233594290176)：
```ts
const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

**fetch** 函数是接受 Web 标准请求并返回 Web 标准响应的函数，其定义为：
```ts
// Web 标准请求类对象
// Web 标准响应
type fetch = (request: RequestLike) => Response
```

默认情况下，此声明适用于：
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler

这意味着您可以在同一服务器上运行上述所有代码与 Elysia 互操作，所有功能都可以在单次部署中重用，不再需要设置反向代理以处理多个服务器。

如果框架还支持 **.mount** 函数，您可以无限嵌套支持此功能的框架。
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

您甚至可以在服务器中重用多个现有的 Elysia 项目。

```ts
import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

如果挂载的实例是 Elysia 实例，它将自动解析为 `use`，提供默认的类型安全和 Eden 支持。

这使得互操作框架和运行时成为现实的可能性。

## 启动时间改善
启动时间是一个在无服务器环境中重要的度量，Elysia 在这方面表现出色，但我们已经进一步提升了这一点。

默认情况下，Elysia 会自动生成每个路由的 OpenAPI 架构并在内部存储，即使不使用。

在这个版本中，Elysia 推迟了编译，并移至 `@elysiajs/swagger`，从而使 Elysia 的启动时间更快。

通过各种微优化，并在新的插件模型的帮助下，启动时间现在提高了多达 35%。

## 动态模式
Elysia 引入了静态代码分析和预编译（Ahead of Time Compilation）以推动性能的边界。

静态代码分析允许 Elysia 阅读您的代码，然后生成最优化的代码版本，允许 Elysia 将性能推至极限。

即使 Elysia 符合 WinterCG，像 Cloudflare Worker 这样的环境也不支持函数组合。

这意味着无法进行预编译，从而促使我们创建了一种动态模式，采用 JIT 编译而不是 AoT，使 Elysia 也能够在 Cloudflare Worker 上运行。

要启用动态模式，请将 `aot` 设置为 false。
```ts
new Elysia({
    aot: false
})
```

动态模式在 Cloudflare Worker 中默认启用。

#### 值得注意的是，启用动态模式将禁用一些功能，例如动态注入的代码，如 `t.Numeric`，它会自动将字符串解析为数字。

预编译可以读取、检测并优化您的代码，以便换取启动时间的损失，但动态模式使用 JIT 编译，允许启动时间提高到 6 倍。

但需要注意的是，Elysia 的启动时间默认已经足够快。

Elysia 能够在仅 78 毫秒内注册 10,000 个路由，这意味着平均每个路由为 0.0079 毫秒。

综上所述，我们为您留下了自我决策的选择。

## 声明式自定义错误
此更新添加了支持添加类型支持以处理自定义错误的能力。

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
            // 带自动补全
            case 'MyError':
                // 类型缩小
                // 错误被类型化为 CustomError
                return error
        }
    })
```

这让我们能够使用类型缩小来处理自定义类型，从而处理自定义错误，并为错误代码提供自动补全，以缩小到正确的类型，从而实现完全的声明式类型安全。

这实现了我们主要哲学之一，专注于开发者体验，尤其是类型。

Elysia 的类型系统复杂，但我们尽量让用户无需编写自定义类型或传递自定义泛型，使所有代码看起来就像 JavaScript。

它就是这样工作，所有代码看起来都像 JavaScript。

## TypeBox 0.30
TypeBox 是驱动 Elysia 严格类型系统的核心库，称为 **Elysia.t**。

在此更新中，我们将 TypeBox 从 0.28 更新到 0.30，以使类型系统更为精细，几乎变成严格类型语言。

这些更新引入了新功能和许多有趣的变化，例如 **Iterator** 类型、减少包的大小、TypeScript 代码生成。

并支持诸如：
- `t.Awaited`
- `t.Uppercase`
- `t.Capitlized`

## 严格路径
我们收到了很多关于处理宽松路径的请求。

默认情况下，Elysia 严格处理路径，这意味着如果您需要支持带有或不带可选 `/` 的路径，它将无法解析，您必须重复两次路径名称。

```ts
new Elysia()
    .group('/v1', (app) => app
        // 处理 /v1
        .get('', handle)
        // 处理 /v1/
        .get('/', handle)
    )
```

因此，许多人请求 `/v1/` 也应该解析为 `/v1`。

在此更新中，我们默认添加了对宽松路径匹配的支持，以自动启用此功能。
```ts
new Elysia()
    .group('/v1', (app) => app
        // 处理 /v1 和 /v1/
        .get('/', handle)
    )
```

要禁用宽松路径映射，您可以将 `strictPath` 设置为 true，以使用先前的行为：
```ts
new Elysia({
    strictPath: false
})
```

我们希望这将清除关于路径匹配及其预期行为的任何疑问。

## onResponse
此更新介绍了一个新的生命周期钩子，称为 `onResponse`。

这是由 [elysia#67](https://github.com/elysiajs/elysia/issues/67) 提出的提案。

之前，Elysia 的生命周期如下图所示。
![Elysia 生命周期图](/blog/elysia-06/lifecycle-05.webp)

对于任何指标、数据收集或日志记录目的，您可以使用 `onAfterHandle` 来运行收集指标的功能，但是当处理程序遇到错误时，此生命周期并不会被执行，无论是路由错误还是提供的自定义错误。

这就是为什么我们引入了 `onResponse` 以处理所有的响应情况。

您可以同时使用 `onRequest` 和 `onResponse` 来测量性能指标或任何所需的日志记录。

引用：
> 然而，onAfterHandle 函数仅在成功响应时触发。例如，如果找不到路由，或主体无效，或抛出错误，则不会触发。如何监听成功和不成功的请求？这就是我建议 onResponse 的原因。
>
> 根据图示，我建议如下：
> ![Elysia 生命周期图, 带 onResponse 钩子](/blog/elysia-06/lifecycle-06.webp)

---

### 显著改进：
- 在 Elysia 类型系统中添加错误字段，以添加自定义错误消息
- 支持 Cloudflare Worker 的动态模式（和 ENV）
- AfterHandle 现在自动映射值
- 使用 bun build 针对 Bun 环境，整体性能提高 5-10%
- 在使用插件注册时消除了内联生命周期的重复
- 支持设置 `prefix`
- 递归路径类型
- 轻微提高类型检查速度
- 递归架构冲突导致无限类型

### 更改：
- 将 **registerSchemaPath** 移至 @elysiajs/swagger
- [内部] 向上下文添加 qi (queryIndex)

### 破坏性更改：
- [内部] 移除 Elysia Symbol
- [内部] 将 `getSchemaValidator`, `getResponseSchemaValidator` 重构为命名参数
- [内部] 将 `registerSchemaPath` 移至 `@elysiajs/swagger`

## 后续
我们刚刚迈过了一年的里程碑，对于 Elysia 和 Bun 在这一年的改进感到非常兴奋！

与 Bun 一起推进 JavaScript 的性能边界，并与 Elysia 一起提升开发者体验，我们非常高兴能与您和我们的社区保持联系。

每次更新都让 Elysia 变得更加稳定，并逐渐提供更好的开发者体验，同时不影响性能和功能。

我们很高兴看到我们的开源开发者社区通过他们的项目使 Elysia 充满活力。
- [Elysia Vite 插件 SSR](https://github.com/timnghg/elysia-vite-plugin-ssr)，允许我们使用 Elysia 作为服务器进行 Vite 服务器端渲染。
- [Elysia Connect](https://github.com/timnghg/elysia-connect)，使 Connect 的插件与 Elysia 兼容

以及许多选择 Elysia 作为下一个大项目的开发者。

凭借我们的承诺，我们最近还推出了 [Mobius](https://github.com/saltyaom/mobius)，这是一个开源 TypeScript 库，可以将 GraphQL 解析为 TypeScript 类型，而无需依赖代码生成，利用 TypeScript 模板字面量类型，使其成为第一个实现端到端类型安全的框架，而不依赖代码生成。

我们非常感谢您对 Elysia 的持续支持，并希望能在下一次发布中与您一起推动边界。

> 当这个全新世界为我欢呼时
>
> 我绝不会将其交给命运
>
> 当我看到机会时，我会开辟道路
>
> 我称之为将军
>
> 是时候突破了
>
> 所以我会重写故事，最终改变所有规则
>
> 我们是独行侠
>
> 我们不会放弃，直到赢得这场游戏
>
> 尽管我不知道明天会如何
>
> 我会下注，尽我所能赢得这场游戏
>
> 与其他人不同，我会尽力而为，我永远不会失败
>
> 放弃这个机会将是致命的，所以让我们全力以赴
>
> 我将把我的命运寄托于此，让 **游戏开始**

</Blog>
