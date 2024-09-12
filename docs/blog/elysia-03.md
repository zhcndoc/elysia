---
title: Elysia 0.3 - 寻找大地的边缘
sidebar: false
editLink: false
search: false
head:
  - - meta
    - property: 'og:title'
      content: 介绍 Elysia 0.3 - 寻找大地的边缘 [Looking for Edge of Ground]

  - - meta
    - name: 'description'
      content: 介绍 Elysia Fn，一种为高度可扩展的 TypeScript 性能重新设计的类型，支持文件上传和验证，以及对《伊甸条约》的重新设计。

  - - meta
    - property: 'og:description'
      content: 介绍 Elysia Fn，一种为高度可扩展的 TypeScript 性能重新设计的类型，支持文件上传和验证，以及对《伊甸条约》的重新设计。

  - - meta
    - property: 'og:image'
      content: https://elysia.zhcndoc.com/blog/elysia-03/edge-of-ground.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysia.zhcndoc.com/blog/elysia-03/edge-of-ground.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.3 - 寻找大地的边缘"
    src="/blog/elysia-03/edge-of-ground.webp"
    alt="破碎的玻璃碎片飘浮在深渊中"
    author="saltyaom"
    date="2023 年 3 月 17 日"
>

这个名字来源于 Camellia 的歌曲 “大地 の 閾 を 探 して [Looking for Edge of Ground]”，这首歌曲是我在 Camellia 的专辑 “U.U.F.O” 中最喜欢的最后一首。这首歌对我个人有着深远的影响，所以我不会轻易地对待这个名字。

这是一次最艰难的更新，带来了 Elysia 有史以来最大的发布，重新思考和重新设计了 Elysia 架构，以实现高度可扩展性，同时尽可能减少破坏性变化。

我很高兴地宣布 Elysia 0.3 的发布候选版本，下面是即将到来的新特性。

## Elysia Fn
介绍 Elysia Fn，它允许你在前端运行后端函数，具有完整的自动完成和完全的类型支持。

<video controls autoplay muted>
  <source src="/blog/elysia-03/elysia-fn.mp4" type="video/mp4" />
</video>

为了快速开发，Elysia Fn 允许你 “暴露” 后端代码，以便在前端调用，同时保持类型安全、自动完成、原始代码注释和 “点击以定义” 功能，使你能够加快开发速度。

你可以使用 Elysia Fn 与 Eden 相结合，以实现完整的类型安全，通过 Eden Fn 来实现。

### 权限
你可以限制允许或拒绝函数的权限范围，检查授权头和其他头部字段的验证，验证参数，或者编程方式限制密钥访问。

密钥检查支持类型安全和自动完成所有可能的功能，所以你不会错过一些功能或者不小心打错名称。
![Narrowed Key](/blog/elysia-03/narrowed-key.webp)

并且，编程方式缩小属性的范围也会缩小参数的类型，换句话说，就是完全类型安全。
![Narrowed Params](/blog/elysia-03/narrowed-param.webp)

### 技术细节
在技术细节上，Elysia Fn 使用 JavaScript 的 Proxy 来捕获对象属性，以及参数，创建一个批处理请求到服务器来处理并返回跨网络的数据。Elysia Fn 扩展了 superjson，允许 JavaScript 中的原生类型，如 Error、Map、Set 和 undefined，在跨 JSON 数据时解析。

Elysia Fn 支持多种使用案例，例如在 Nextjs 应用程序的前端访问 Prisma。理论上，使用 Redis、Sequelize、RabbitMQ 等都是可能的。由于 Elysia 在 Bun 上运行，Elysia Fn 能够并发地运行超过 120 万次操作/秒 (在 M1 Max 上测试)。

在 [Eden Fn](/plugins/eden/fn) 了解更多关于 Elysia Fn 的信息。

## 类型重构
超过 6.5~9 倍的速度提升用于类型检查，以及无数类型代码行的减少。

Elysia 0.3 中，超过 80% 的 Elysia 和 Eden 类型已经被重写，以专注于性能、类型推断和快速的自动完成。

对于超过 350 个具有复杂类型的路由进行测试，Elysia 在 0.22 秒内生成了一个类型声明，以便与 Eden 一起使用。

由于 Elysia 路由现在直接编译为字面量对象而不是 Typebox 引用，因此 Elysia 的类型声明比 0.2 中使用的要小得多，并且更容易被 Eden 消费。说到小得多，它的意思是小 50-99%。

不仅 Elysia 与 TypeScript 的集成速度显著加快，而且 Elysia 更好地理解了 TypeScript 和你的代码。

例如，在 0.3 中，Elysia 将不会对插件注册过于严格，允许你在不完整类型完成的情况下注册插件。内联 `use` 函数现在推断父类型，并且嵌套的守卫可以更准确地引用来自父类的模型类型。

类型声明现在也可以构建和导出。

随着类型的重写，Elysia 理解 TypeScript 比过去要好得多，类型完成将比过去快得多，我们鼓励你尝试一下，看看它有多快。详细了解请查看这个 [Twitter 上的线程](https://twitter.com/saltyAom/status/1629876280517869568?s=20)。

## 文件上传
感谢 Bun 0.5.7，Form Data 默认在 Elysia 0.3 中实现并启用 `multipart/formdata`。

为了定义类型完成和上传文件的验证，`Elysia.t` 现在扩展了 TypeBox，增加了 `File` 和 `Files` 以进行文件验证。

验证包括自动完成标准文件类型的检查，文件的最小和最大大小，以及字段的总文件数。

Elysia 0.3 还提供了 `schema.contentType`，以明确地验证传入请求的类型，并在验证数据之前严格检查头部。

## OpenAPI Schema 3.0.x
随着 Elysia 0.3 的推出，Elysia 现在默认使用 OpenAPI schema 3.0.x，以更好地表述 API 定义，并更好地支持基于内容类型的多种类型。

`schema.details` 现在更新到 OpenAPI 3.0.x，Elysia 还更新了 Swagger 插件以匹配 OpenAPI 3.0.x，以利用 OpenAPI 3 和 Swagger 的新特性，特别是在文件上传方面。

## Eden 重构
为了支持 Elysia 的更多需求，支持 Elysia Fn、Rest 等，Eden 已经重构以与新架构一起扩展。

Eden 现在导出三种不同类型的函数。
- [Eden Treaty](/plugins/eden/treaty) `eden/treaty`：你知道并喜爱的原始 Eden 语法
- [Eden Fn](/plugins/eden/fn) `eden/fn`：访问 Eden Fn
- [Eden Fetch](/plugins/eden/fetch) `eden/fetch`：类似于 Fetch 的语法，适用于高度复杂的 Elysia 类型 (> 1,000 个路由/Elysia 实例)

随着 Elysia 类型定义的支持和对 Elysia Eden 的改进，Eden 现在运行得更快，更好地理解类型推断。

自动完成速度更快，使用更少的资源，实际上 Eden 的类型声明已经几乎 100% 重写，减少了大小和推断时间，使其支持超过 350 个路线的自动完成，只需眨眼之间 (约 0.26 秒)。

为了使 Elysia Eden 完全类型安全，Elysia 更好地理解 TypeScript，Eden 现在可以根据响应状态缩小类型，允许你在任何条件下正确地捕获类型。
![Narrowed error.webp](/blog/elysia-03/narrowed-error.webp)

### 显著改进：
- 添加字符串格式：‘email’，‘uuid’，‘date’，‘date-time’
- 更新 @sinclair/typebox 到 0.25.24
- 更新 Raikiri 到 0.2.0-beta.0 (ei)
- 添加文件上传测试，感谢 #21 (@amirrezamahyari)
- 预编译小写方法为 Eden
- 减少大多数 Elysia 类型的复杂指令
- 将 `ElysiaRoute` 类型编译为字面量
- 优化类型编译、类型推断和自动完成
- 提高类型编译速度
- 提高 TypeScript 对插件注册的理解
- 优化 TypeScript 推断大小
- 上下文创建优化
- 默认使用 Raikiri 路由器
- 移除未使用的函数
- 重构 `registerSchemaPath` 以支持 OpenAPI 3.0.3
- 添加 `error` 推断为 Eden
- 将 `@sinclair/typebox` 标记为可选 `peerDenpendencies`

修复：
- Raikiri 0.2 在找不到时抛出错误
- 联合响应与 `t.File` 不工作
- 定义不在 Swagger 中
- 群组插件中的 `details` 丢失
- 群组插件，无法编译 schema
- 群组不可导出，因为 EXPOSED 是一个私有属性
- 多个 cookies 没有将 `content-type` 设置为 `application/json`
- `EXPOSED` 在调用 `fn.permission` 时不可导出
- 缺少合并的返回类型为 `.ws`
- 缺少 nanoid
- 上下文产生副作用
- `t.Files` 在 Swagger 中指的是单个文件
- Eden 响应类型是未知的
- 无法类型推断 `setModel`，通过 Eden 定义
- 处理在非权限函数中抛出的错误
- 导出的变量使用或使用了外部模块中的名称 ‘SCHEMA’
- 导出的变量使用或使用了外部模块中的名称 ‘DEFS’
- 在 `tsconfig.json` 中设置 `declaration: true` 可能出现错误

重大变更：
- 将 `inject` 重命名为 `derive`
- 过时 `ElysiaRoute`，改为内联
- 移除 `derive`
- 更新从 OpenAPI 2.x 到 OpenAPI 3.0.3
- 将上下文。store[SYMBOL] 移动到 meta[SYMBOL]


## 后续
随着 Elysia Fn 的引入，我个人非常兴奋地看到它将如何在前端开发中得到采用，去除前后端之间的界限。以及 Elysia 的类型重构，使得类型检查和自动完成速度更快。

我很兴奋看到你会如何使用 Elysia 来创造你将要构建的美好事物。

我们有一个 [Discord 服务器](https://discord.gg/eaFJ2KDJck)专门用于 Elysia。随时说嗨或只是放松和闲逛。

感谢您支持 Elysia。

> 在一个永远不会结束的天文地图上
>
> 在一块永远不会被命名的悬崖上
>
> 我只是低声呼唤
>
> 希望这种无尽的回声能到达你
>
> 我相信总有一天，我会站在大地的边缘
>
> (直到我能回到你身边告诉你)
>
</Blog>