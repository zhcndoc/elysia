---
title: 插件概述 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 旨在实现模块化和轻量化，这就是为什么 Elysia 包含了涉及常见模式的预构建插件，方便开发者使用。Elysia 还通过社区插件进一步增强了自定义功能。

    - - meta
      - name: 'og:description'
        content: Elysia 旨在实现模块化和轻量化，这就是为什么 Elysia 包含了涉及常见模式的预构建插件，方便开发者使用。Elysia 还通过社区插件进一步增强了自定义功能。
---

# 概述

Elysia 旨在实现模块化和轻量化。

遵循 Arch Linux 的相同理念（顺便说一下，我使用 Arch）：

> 设计决策是通过开发者共识逐案做出的

这是为了确保开发者最终能创建他们所期望的高性能 Web 服务器。由此，Elysia 包含了预构建的常见模式插件，以方便开发者使用：

## 官方插件：

-   [Bearer](/plugins/bearer) - 自动检索 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
-   [CORS](/plugins/cors) - 设置 [跨源资源共享（CORS）](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
-   [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 任务
-   [Eden](/eden/overview) - Elysia 的端到端类型安全客户端
-   [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
-   [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
-   [HTML](/plugins/html) - 处理 HTML 响应
-   [JWT](/plugins/jwt) - 使用 [JWT](https://jwt.io/) 进行身份验证
-   [OpenTelemetry](/plugins/opentelemetry) - 增加对 OpenTelemetry 的支持
-   [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 审计性能瓶颈
-   [Static](/plugins/static) - 提供静态文件/文件夹
-   [Stream](/plugins/stream) - 集成响应流和 [服务器发送事件（SSE）](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
-   [Swagger](/plugins/swagger) - 生成 [Swagger](https://swagger.io/) 文档
-   [tRPC](/plugins/trpc) - 支持 [tRPC](https://trpc.io/)
-   [WebSocket](/patterns/websocket) - 支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 社区插件：

-   [BunSai](https://github.com/nikiskaarup/bunsai2) - 一个无全栈依赖的 Web 框架，基于 Bun 和 Elysia
-   [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 用于快速搭建 Elysia 项目的环境（支持 ORM、代码检查和插件）！
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 身份验证，简单且清晰
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方 Clerk 身份验证插件
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
-   [Vite server](https://github.com/kravetsone/elysia-vite-server) - 在 `development` 模式下启动并装饰 [`vite`](https://vitejs.dev/) 开发服务器，在 `production` 模式下提供静态文件（如果需要）
-   [Vite](https://github.com/timnghg/elysia-vite) - 用 Vite 的脚本注入提供入口 HTML 文件
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松将 Elysia 与 Nuxt 集成！
-   [Remix](https://github.com/kravetsone/elysia-remix) - 使用支持 `HMR` 的 [Remix](https://remix.run/)！（由 [`vite`](https://vitejs.dev/) 提供支持）解决了长期存在的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)
-   [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - 一个轻量级的离线优先数据同步框架，由 [Dexie.js](https://dexie.org/) 提供支持
-   [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 允许直接在 Elysia 中使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件的插件！
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 使用各种 HTTP 头保护 Elysia 应用
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 使用 Elysia 服务器的 Vite SSR 插件
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 一个用于 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流程的插件，支持超过 **42** 个提供者和 **类型安全**！
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流程
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单、轻量的限流器
-   [Logysia](https://github.com/tristanisham/logysia) - 经典的日志中间件
-   [Logestic](https://github.com/cybercoder-naj/logestic) - ElysiaJS 的高级可定制日志库
-   [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
-   [Elylog](https://github.com/eajr/elylog) - 带有一些自定义的简单标准输出日志库
-   [Logify for Elysia.js](https://github.com/0xrasla/logify) - 一个美观、快速且类型安全的 Elysia.js 应用程序日志中间件
-   [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 可能不是最好的，但对 Elysia 而言是一个相当不错且温和的日志器。
-   [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 使用此 [Sentry](https://docs.sentry.io/) 插件捕获痕迹和错误
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 部署到 AWS Lambda
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，生成 [Eden](https://elysiajs.com/eden/overview.html) 的类型，并支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许您使用 [MessagePack](https://msgpack.org)
    [XML](https://github.com/kravetsone/elysia-xml) - 允许您处理 XML
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 用于分组的文件系统和基于文件夹的路由器
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本 HTTP 身份验证
-   [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基本 HTTP 身份验证（使用 `request` 事件）
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 封装
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID（`X-Request-ID` 或自定义）
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - [HTMX](https://htmx.org/) 的上下文助手
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 当更改目录中的任何文件时重新加载 HTML 文件
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 在 HTML 文件中注入 HTML 代码
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)。
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方 [WorkOS' AuthKit](https://www.authkit.com/) 身份验证
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简单的错误处理
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - 具有类型框的类型安全环境变量
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 Elysia Swagger 模型中使用 Drizzle ORM 架构。
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务器（Yoga & Apollo）的错误代码
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 处理 JWT（Header/Cookie/QueryParam）身份验证的库。
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 受 [graceful-server](https://github.com/gquittet/graceful-server) 启发的库。
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 一个美观简单的 ElysiaJS 日志中间件，带有颜色和时间戳。
-   [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 一个简单且可自定义的错误处理内务，支持创建自定义 HTTP 错误
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的 ElysiaJS 插件，用于压缩响应
-   [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 紧凑的卓越，广泛的效果：Elysia 和 Bunnyhop 的 HTTP 压缩器，支持 gzip、deflate 和 brotli。
-   [Elysia Accepts](https://github.com/morigs/elysia-accepts) - Elysia 插件，用于解析接受头和内容协商
-   [Elysia Compression](https://github.com/chneau/elysia-compression) - Elysia 插件，压缩响应
-   [Elysia Logger](https://github.com/chneau/elysia-logger) - Elysia 插件，用于记录 HTTP 请求和响应，受 [hono/logger](https://hono.dev/docs/middleware/builtin/logger) 启发
-   [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - Elysia 插件，用于 CQRS 模式
-   [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 无缝集成 [Supabase](https://supabase.com/) 身份验证和数据库功能，方便访问经过身份验证的用户数据和 Supabase 客户端实例。特别适用于 [Edge Functions](https://supabase.com/docs/guides/functions)。
-   [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - 提供 XSS（跨站脚本攻击）保护的 Elysia.js 插件，通过清理请求体数据来实现。
-   [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 适用于 Elysia.js 应用程序的全面安全中间件，通过设置各种 HTTP 头来帮助保护您的应用。
-   [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 通过这个小型库无缝开发和集成 API、Websocket 和流式 API。

## 互补项目：
-   [prismabox](https://github.com/m1212e/prismabox) - 基于数据库模型生成 typebox 架构，能与 elysia 良好配合

---

如果您为 Elysia 编写了插件，请通过点击下面的 **<i>Edit this page on GitHub</i>** 轻松将您的插件添加到此列表中 👇