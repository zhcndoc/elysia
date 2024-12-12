---
title: 插件概述 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 旨在模块化和轻量化，这就是为什么 Elysia 包含了预构建的插件，以方便开发者使用常见模式。Elysia 还通过社区插件进一步增强了自定义功能。

    - - meta
      - name: 'og:description'
        content: Elysia 旨在模块化和轻量化，这就是为什么 Elysia 包含了预构建的插件，以方便开发者使用常见模式。Elysia 还通过社区插件进一步增强了自定义功能。
---

# 概述

Elysia 的设计理念是模块化和轻量化。

遵循与 Arch Linux 相同的理念（顺便提一下，我使用 Arch）：

> 设计决策是通过开发者共识逐案进行的

这一点旨在确保开发者能够创造出他们所希望的高性能网络服务器。由此，Elysia 包含了预构建的常见模式插件，以方便开发者使用：

## 官方插件：

-   [Bearer](/plugins/bearer) - 自动获取 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
-   [CORS](/plugins/cors) - 设置 [跨源资源共享（CORS）](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
-   [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 任务
-   [Eden](/eden/overview) - 为 Elysia 提供端到端类型安全的客户端
-   [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
-   [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
-   [HTML](/plugins/html) - 处理 HTML 响应
-   [JWT](/plugins/jwt) - 使用 [JWT](https://jwt.io/) 进行身份验证
-   [OpenTelemetry](/plugins/opentelemetry) - 添加对 OpenTelemetry 的支持
-   [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 审核性能瓶颈
-   [Static](/plugins/static) - 提供静态文件/文件夹服务
-   [Stream](/plugins/stream) - 集成响应流和 [服务器推送事件（SSE）](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
-   [Swagger](/plugins/swagger) - 生成 [Swagger](https://swagger.io/) 文档
-   [tRPC](/plugins/trpc) - 支持 [tRPC](https://trpc.io/)
-   [WebSocket](/patterns/websocket) - 支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 社区插件：

-   [BunSai](https://github.com/nikiskaarup/bunsai2) - 基于 Bun 和 Elysia 的全栈无关框架
-   [创建 ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 轻松搭建 Elysia 项目环境（支持 ORM、Linter 和插件）！
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 简单干净的身份验证
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方 Clerk 身份验证插件
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
-   [Vite 服务器](https://github.com/kravetsone/elysia-vite-server) - 在 `development` 模式下启动并装饰 [`vite`](https://vitejs.dev/) 开发服务器，并在 `production` 模式下提供静态文件（如有需要）
-   [Vite](https://github.com/timnghg/elysia-vite) - 提供带有 Vite 脚本注入的入口 HTML 文件
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松将 Elysia 与 Nuxt 集成！
-   [Remix](https://github.com/kravetsone/elysia-remix) - 使用 [Remix](https://remix.run/) 和 `HMR` 支持（由 [`vite`](https://vitejs.dev/) 提供支持）！ 解决了一个长期以来的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)
-   [Connect 中间件](https://github.com/kravetsone/elysia-connect-middleware) - 允许您在 Elysia 中直接使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件的插件！
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 使用各种 HTTP 头来保护 Elysia 应用程序
-   [Vite 插件 SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 使用 Elysia 服务器的 Vite SSR 插件
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 一个支持 **42** 个以上提供者并具有 **类型安全** 的 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流插件！
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流
-   [Elysia OpenID 客户端](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
-   [速率限制](https://github.com/rayriffy/elysia-rate-limit) - 简单、轻量的速率限制插件
-   [Logysia](https://github.com/tristanisham/logysia) - 经典记录中间件
-   [Logestic](https://github.com/cybercoder-naj/logestic) - 高级且可自定义的 ElysiaJS 日志库
-   [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
-   [Elylog](https://github.com/eajr/elylog) - 具有一些自定义选项的简单标准输出日志库
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 部署到 AWS Lambda
-   [装饰器](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
-   [自动加载](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，可为 [Eden](https://elysiajs.com/eden/overview.html) 生成类型，支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许您处理 [MessagePack](https://msgpack.org)
    [XML](https://github.com/kravetsone/elysia-xml) - 允许您处理 XML
-   [自动路由](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
-   [分组路由器](https://github.com/itsyoboieltr/elysia-group-router) - 基于文件系统和文件夹的分组路由器
-   [基本身份验证](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本 HTTP 身份验证
-   [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
-   [基本身份验证](https://github.com/eelkevdbos/elysia-basic-auth) - 基本 HTTP 身份验证（使用 `request` 事件）
-   [国际化（i18n）](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 包装器
-   [Elysia 请求 ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID（`X-Request-ID` 或自定义）
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - [HTMX](https://htmx.org/) 的上下文帮助程序
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 在更改目录中的任何文件时重新加载 HTML 文件
-   [Elysia 注入 HTML](https://github.com/gtrabanco/elysia-inject-html) - 在 HTML 文件中注入 HTML 代码
-   [Elysia HTTP 错误](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
-   [Elysia HTTP 状态码](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
-   [无缓存](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)。
-   [Elysia 压缩](https://github.com/gusb3ll/elysia-compression) - 压缩响应
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
-   [OAuth2 服务器](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
-   [Elysia Flash 消息](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方 [WorkOS' AuthKit](https://www.authkit.com/) 身份验证
-   [Elysia 错误处理器](https://github.com/gtramontina/elysia-error-handler) - 更简单的错误处理
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - 使用 typebox 的类型安全环境变量
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 Elysia Swagger 模型中使用 Drizzle ORM 架构。
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务器（Yoga & Apollo）的错误代码
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 处理使用 JWT 进行身份验证的库（Header/Cookie/QueryParam）。
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 受 [graceful-server](https://github.com/gquittet/graceful-server) 启发的库。
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 一个美观简单的 ElysiaJS 日志中间件，带有颜色和时间戳。
-   [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 一个简单且可自定义的错误处理中的间件，可以创建您自己的 HTTP 错误
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的 ElysiaJS 插件，用于压缩响应
-   [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 紧凑的辉煌，广泛的结果：Elysia 和 Bunnyhop 的 HTTP 压缩器，支持 gzip、deflate 和 brotli。
-   [Elysia Accepts](https://github.com/morigs/elysia-accepts) - Elysia 插件，用于解析接受头和内容协商
-   [Elysia Compression](https://github.com/chneau/elysia-compression) - Elysia 插件，用于压缩响应
-   [Elysia Logger](https://github.com/chneau/elysia-logger) - Elysia 插件，用于记录 HTTP 请求和响应，受 [hono/logger](https://hono.dev/docs/middleware/builtin/logger) 启发
-   [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - Elysia 插件，用于 CQRS 模式
-   [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 不是最好的，但是一款相当不错的 Elysia 日志记录器。
-   [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 无缝集成 [Supabase](https://supabase.com/) 身份验证和数据库功能到 Elysia，允许轻松访问经过身份验证的用户数据和 Supabase 客户端实例。特别适用于 [Edge Functions](https://supabase.com/docs/guides/functions)。
-   [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - 一个为 Elysia.js 提供 XSS（跨站脚本）保护的插件，通过清理请求体数据来实现。
-   [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 一个全面的安全中间件，用于 Elysia.js 应用程序，通过设置各种 HTTP 头来帮助保护您的应用。
-   [Logify for Elysia.js](https://github.com/0xrasla/logify) - 一个美观、快速且类型安全的日志中间件，适用于 Elysia.js 应用程序。

## 互补项目：
-   [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成 typebox 方案的生成器，与 Elysia 配合良好

---

如果您为 Elysia 编写了一个插件，欢迎通过**点击下面的 <i>在 GitHub 上编辑此页面</i>**将您的插件添加到列表中 👇
