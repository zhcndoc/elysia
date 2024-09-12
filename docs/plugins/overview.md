---
title: 插件概述
head:
    - - meta
      - property: 'og:title'
        content: Swagger Plugin - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Elysia 的设计目标是模块化和轻量级的，这就是为什么 Elysia 包含了预构建的插件，涉及常见的模式，方便开发者使用。Elysia 通过社区插件进行进一步的定制。

    - - meta
      - name: 'og:description'
        content: Elysia 的设计目标是模块化和轻量级的，这就是为什么 Elysia 包含了预构建的插件，涉及常见的模式，方便开发者使用。Elysia 通过社区插件进行进一步的定制。
---

# 概述

Elysia 被设计为模块化和轻量级的。

遵循与 Arch Linux 相同的理念（顺便说一句，我使用 Arch）：

> 设计的决策是根据开发者的共识逐案作出的

这样做是为了确保开发者能够创建出他们意图创造的性能良好的网络服务器。因此，Elysia 包含了一些预构建的常见模式插件，以方便开发者的使用：

## 官方插件

-   [Bearer](/plugins/bearer) - 自动检索 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
-   [CORS](/plugins/cors) - 设置 [跨源资源共享（CORS）](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
-   [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 作业
-   [Eden](/eden/overview) - 为 Elysia 提供的端到端类型安全客户端
-   [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
-   [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
-   [HTML](/plugins/html) - 处理 HTML 响应
-   [JWT](/plugins/jwt) - 使用 [JWTs](https://jwt.io/) 进行身份验证
-   [OpenTelemetry](/plugins/opentelemetry) - 添加对 OpenTelemetry 的支持
-   [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 审计性能瓶颈
-   [Static](/plugins/static) - 提供静态文件/文件夹
-   [Stream](/plugins/stream) - 集成响应流和 [服务器发送的事件（SSEs）](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
-   [Swagger](/plugins/swagger) - 生成 [Swagger](https://swagger.io/) 文档
-   [tRPC](/plugins/trpc) - 支持 [tRPC](https://trpc.io/)
-   [WebSocket](/patterns/websocket) - 支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 社区插件

-   [BunSai](https://github.com/nikiskaarup/bunsai2) - 专为 Web 设计的全栈无关框架，基于 Bun 和 Elysia
-   [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 使用环境帮助（帮助 ORM、Linters 和 Plugins）快速搭建 Elysia 项目
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 简单干净的认证
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方 Clerk 认证插件
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
-   [Vite server](https://github.com/kravetsone/elysia-vite-server) - 插件，在 `development` 模式下启动和装饰 [`vite`](https://vitejs.dev/) 开发服务器，在 `production` 模式下提供静态服务（如果需要）
-   [Vite](https://github.com/timnghg/elysia-vite) - 使用 Vite 的脚本注入服务 HTML 文件
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松集成 Nuxt 和 Elysia！
-   [Remix](https://github.com/kravetsone/elysia-remix) - 使用 [Remix](https://remix.run/) 支持 `HMR`（由 [`vite`](https://vitejs.dev/) 提供动力！关闭了一个长期存在的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)）
-   [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 插件允许您直接在 Elysia 中使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件！
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 使用各种 HTTP 标头安全 Elysia 应用
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - Vite SSR 插件使用 Elysia 服务器
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 插件支持 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流，有超过 **42** 个提供商和 **类型安全**！
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单、轻量级的限速器
-   [Logysia](https://github.com/tristanisham/logestic) - 经典的日志中间件
-   [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
-   [Elylog](https://github.com/eajr/elylog) - 带有一些自定义的简单标准输出日志库
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 在 AWS Lambda 上部署
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，为 [Eden](https://elysiajs.com/eden/overview.html) 生成类型，支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许您使用 [MessagePack](https://msgpack.org)
    [XML](https://github.com/kravetsone/elysia-xml) - 允许您处理 XML
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 基于目录和文件夹的组路由器
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - HTTP基本认证
-   [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - HTTP基本认证（使用 `request` 事件）
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 包装器
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID (`X-Request-ID` 或自定义）
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - [HTMX](https://htmx.org/) 的上下文帮助器
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 更改目录中的任何文件时重新加载 HTML 文件
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 将 HTML 代码注入 HTML 文件
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 在 Elysia 上开发 OAuth 2.0 服务器
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方 [WorkOS 的 AuthKit](https://www.authkit.com/) 认证
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简单的错误处理
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - 使用 Typebox 的类型安全环境变量
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在使用 Drizzle ORM 模式时在 elysia swagger 模型中使用 Drizzle ORM 模式。
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务（Yoga & Apollo）的错误代码
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 基于 JWT（Header/Cookie/QueryParam）处理的 Drizzle ORM 认证库。
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 基于 [graceful-server](https://github.com/gquittet/graceful-server) 的插件。
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 一个漂亮而简单的 ElysiaJS 日志中间件，带有颜色和时间戳。
-   [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 一个简单且可定制的错误处理中间件，具有创建自己的 HTTP 错误的可能性。
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 一个受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的 ElysiaJS 插件，用于压缩响应。
-   [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 压缩的辉煌，扩展的结果：HTTP 压缩器，为 Elysia 和 Bunnyhop 提供 gzip、deflate 和 brotli 支持。
-   [Elysia Accepts](https://github.com/morigs/elysia-accepts) - Elysia 插件，用于解析 accept 头和内容协商
-   [Elysia Compression](https://github.com/chneau/elysia-compression) - Elysia 插件，用于压缩响应
-   [Elysia Logger](https://github.com/chneau/elysia-logger) - Elysia 插件，用于根据 [hono/logger](https://hono.dev/docs/middleware/builtin/logger) 记录 HTTP 请求和响应
-   [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - Elysia 插件，用于支持 CQRS 模式
-   [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 不是最漂亮的，但一个相当漂亮和甜美的 Elysia 日志记录库。

## 互补项目
-   [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成类型框方案的生成器，与 Elysia 很好地配合使用
---

如果您为 Elysia 编写了一个插件，请自由地将您的插件添加到列表中，只需 **点击下面“在 GitHub 上编辑此页面”** 即可👇
