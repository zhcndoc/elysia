---
title: Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]
sidebar: false
editLink: false
search: false
head:
  - - meta
    - property: 'og:title'
      content: 介绍 Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]

  - - meta
    - name: 'description'
      content: 介绍 Elysia Fn，针对高可扩展性的 TypeScript 性能进行的类型重构，支持文件上传及验证，重构的 Eden 合同。

  - - meta
    - property: 'og:description'
      content: 介绍 Elysia Fn，针对高可扩展性的 TypeScript 性能进行的类型重构，支持文件上传及验证，重构的 Eden 合同。

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-03/edge-of-ground.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-03/edge-of-ground.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]"
    src="/blog/elysia-03/edge-of-ground.webp"
    alt="碎玻璃片漂浮在深渊中"
    author="saltyaom"
    date="2023 年 3 月 17 日"
>

以 Camellia 的歌曲[「大地の閾を探して [Looking for Edge of Ground]」](https://youtu.be/oyJf72je2U0) ft. 初音未来 命名，是我最喜欢的 Camellia 专辑「U.U.F.O」的最后一曲。这首歌对我个人影响深远，因此我不会轻视这个名字。

这是最具挑战性的更新，带来了迄今为止最大的 Elysia 发布，重新思考和重新设计了 Elysia 架构，以实现高可扩展性，同时尽量减少破坏性更改。

我很高兴地宣布 Elysia 0.3 的发布候选版本，令人兴奋的新功能即将到来。

## Elysia Fn
介绍 Elysia Fn，可以在前端运行任何后端函数，具备完整的自动补全和类型支持。

<video controls autoplay muted>
  <source src="/blog/elysia-03/elysia-fn.mp4" type="video/mp4" />
</video>

为了快速开发，Elysia Fn 允许你“暴露”后端代码，以便从前端调用，具备完整的类型安全、自动补全、原始代码注释和“点击定义”功能，帮助你加速开发进程。

你可以通过 Eden Fn 将 Elysia Fn 与 Eden 结合使用，以实现完全的类型安全。

### 权限
你可以限制函数的允许或拒绝范围，检查授权头和其他头字段，验证参数，或以编程方式限制密钥访问。

密钥检查支持类型安全和自动补全所有可能的函数，因此你不会错过某些功能或意外输入错误的名称。
![Narrowed Key](/blog/elysia-03/narrowed-key.webp)

以编程方式缩小属性范围也会缩小参数的类型，换句话说，实现了完全的类型安全。
![Narrowed Params](/blog/elysia-03/narrowed-param.webp)

### 技术细节
在技术细节上，Elysia Fn 使用 JavaScript 的 Proxy 来捕获对象属性和参数，以创建批量请求发送到服务器进行处理，并在网络上返回值。
Elysia Fn 扩展了 superjson，允许在 JSON 数据中解析 JavaScript 的原生类型，如 Error、Map、Set 和 undefined。

Elysia Fn 支持多种用例，例如在客户端 Nextjs 应用中访问 Prisma。
理论上，可以使用 Redis、Sequelize、RabbitMQ 等等。
由于 Elysia 运行在 Bun 上，Elysia Fn 可以并发运行超过 120 万次操作/秒（在 M1 Max 上测试）。

了解更多关于 Elysia Fn 的信息，请访问 [Eden Fn](/plugins/eden/fn)。

## 类型重构
类型检查速度提高了 6.5-9 倍，类型行数减少无法计数。

Elysia 0.3 中，超过 80% 的 Elysia 和 Eden 类型已经重写，专注于性能、类型推断和快速自动补全。

对超过 350 条复杂路由进行测试，Elysia 仅需 0.22
秒即可生成用于 Eden 的类型声明。

由于 Elysia 路由现在直接编译为字面对象而不是 Typebox 引用，Elysia 的类型声明比 0.2 版本小得多，Eden 更易于使用。这里的小得多的意思是 50%-99% 更小。

不仅 Elysia 与 TypeScript 的集成显著提升，Elysia 对 TypeScript 和你的代码的理解也更好。

例如，在 0.3 版本中，Elysia 在插件注册时不再那么严格，允许你在没有完全类型补全的情况下注册插件。
内联的 `use` 函数现在推断父类型，而嵌套守卫可以更准确地引用父类的模型类型。

类型声明现在也可以构建和导出。

经过类型重构，Elysia 对 TypeScript 的理解远超以前，类型补全的速度将显著加快，我们鼓励你尝试一下，看看有多快。
有关更多细节，请参见这条 [Twitter 线程](https://twitter.com/saltyAom/status/1629876280517869568?s=20)。

## 文件上传
感谢 Bun 0.5.7，Elysia 0.3 中默认实现并启用了表单数据 `multipart/formdata`。

为上传文件定义类型补全和验证后，`Elysia.t` 现在通过 `File` 和 `Files` 扩展 TypeBox 以进行文件验证。

验证包括检查文件类型，并自动补全标准文件大小，文件的最小和最大大小，以及每个字段的文件总数。

Elysia 0.3 还引入了 `schema.contentType`，以明确验证传入请求类型，在验证数据之前严格检查头信息。

## OpenAPI Schema 3.0.x
在 Elysia 0.3 中，Elysia 现在默认使用 OpenAPI schema 3.0.x，以更好地声明 API 定义，并根据内容类型更好地支持多种类型。

`schema.details` 现已更新为 OpenAPI 3.0.x，Elysia 还更新了 Swagger 插件，以匹配 OpenAPI 3.0.x，利用 OpenAPI 3 和 Swagger 中的新功能，尤其是文件上传方面。

## Eden 重构
为了支持更高的 Elysia 需求，支持 Elysia Fn、Rest 等，Eden 被重新设计以与新架构扩展。

Eden 现在导出 3 类型的函数。
- [Eden Treaty](/plugins/eden/treaty) `eden/treaty`: 原始的 Eden 语法
- [Eden Fn](/plugins/eden/fn) `eden/fn`: 访问 Elysia Fn
- [Eden Fetch](/plugins/eden/fetch) `eden/fetch`: 类似 fetch 的语法，适用于复杂的 Elysia 类型 (> 1,000 路由 / Elysia 实例)

通过重构类型定义和支持 Elysia Eden，Eden 现在在推断服务器类型时显著更快和更好。

自动补全速度更快，使用的资源比以往更少，实际上，Eden 的类型声明几乎重构了 100%，以减少大小和推断时间，使其在眨眼之间支持超过 350 条路由的自动补全（约 0.26 秒）。

为了使 Elysia Eden 完全类型安全，利用 Elysia 对 TypeScript 更好的理解，Eden 现在可以根据响应状态缩小类型，使你能够在任何条件下准确捕获类型。
![Narrowed error.webp](/blog/elysia-03/narrowed-error.webp)

### 显著改进：
- 添加字符串格式：'email'、'uuid'、'date'、'date-time'
- 更新 @sinclair/typebox 至 0.25.24
- 更新 Raikiri 至 0.2.0-beta.0 (ei)
- 感谢 #21 添加文件上传测试 (@amirrezamahyari)
- 为 Eden 预编译小写方法
- 为大多数 Elysia 类型减少复杂指令
- 将 `ElysiaRoute` 类型编译为字面量
- 优化类型编译、类型推断和自动补全
- 提高类型编译速度
- 改进插件注册中的 TypeScript 推断
- 优化 TypeScript 推断大小
- 上下文创建优化
- 默认使用 Raikiri 路由
- 移除未使用的函数
- 重构 `registerSchemaPath` 以支持 OpenAPI 3.0.3
- 为 Eden 添加 `error` 推断
- 将 `@sinclair/typebox` 标记为可选的 `peerDenpendencies`

修复：
- Raikiri 0.2 在未找到时抛出错误
- 与 `t.File` 的联合响应无法工作
- Swagger 中未定义定义
- 在分组插件中缺少详细信息
- 分组插件无法编译架构
- 因为 EXPOSED 是私有属性，分组不能导出
- 多个 cookies 不将 `content-type` 设置为 `application/json`
- 使用 `fn.permission` 时 `EXPOSED` 未导出
- `.ws` 合并返回类型缺失
- 缺少 nanoid
- 上下文副作用
- Swagger 中的 `t.Files` 引用单个文件
- Eden 响应类型未知
- 通过 Eden 无法类型化 `setModel` 推断定义
- 在不允许权限的函数中处理抛出的错误
- 导出的变量使用了外部模块的名称 'SCHEMA'
- 导出的变量使用了外部模块的名称 'DEFS'
- 在 `tsconfig.json` 中使用 `declaration: true` 建立 Elysia 应用时可能出现错误

重大变更：
- 将 `inject` 重命名为 `derive`
- 弃用 `ElysiaRoute`，更改为内联
- 移除 `derive`
- 从 OpenAPI 2.x 更新到 OpenAPI 3.0.3
- 将 context.store[SYMBOL] 移动到 meta[SYMBOL]


## 之后
随着 Elysia Fn 的引入，我个人很期待它在前端开发中的应用，打破前端与后端的界限。而 Elysia 的类型重构，使类型检查和自动补全变得更快。

我期待着看到你们使用 Elysia 创建你们要构建的精彩事物。

我们有专门的 [Discord 服务器](https://discord.gg/eaFJ2KDJck) 支持 Elysia。欢迎随时打招呼或畅所欲言。

感谢您对 Elysia 的支持。

> 在永无止境的天幕下
>
> 在没有名字的悬崖上
>
> 我只是嚎叫
>
> 希望那无尽的回响能传达到你
>
> 我相信某天，我会站在大地的边缘
>
> （直到那天我能回到你身边告诉你）
>
</Blog>
