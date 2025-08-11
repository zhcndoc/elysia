---
title: 插件概述 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 旨在实现模块化和轻量化，这就是为什么 Elysia 包含了涉及常见模式的预构建插件，以方便开发者使用。Elysia 通过社区插件进一步增强，使其更加个性化。

    - - meta
      - name: 'og:description'
        content: Elysia 旨在实现模块化和轻量化，这就是为什么 Elysia 包含了涉及常见模式的预构建插件，以方便开发者使用。Elysia 通过社区插件进一步增强，使其更加个性化。
---

# 概述

Elysia 旨在实现模块化和轻量化。

遵循与 Arch Linux 相同的理念（顺便说一句，我使用 Arch）：

> 设计决策通过开发者共识逐案作出

这确保了开发者最终得到他们所希望创建的高性能 Web 服务器。由此，Elysia 包含了预构建的常见模式插件，以方便开发者使用：

## 官方插件：

-   [Bearer](/plugins/bearer) - 自动获取 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
-   [CORS](/plugins/cors) - 设置 [跨域资源共享 (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
-   [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 任务
-   [Eden](/eden/overview) - Elysia 的端到端类型安全客户端
-   [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
-   [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
-   [HTML](/plugins/html) - 处理 HTML 响应
-   [JWT](/plugins/jwt) - 使用 [JWT](https://jwt.io/) 进行身份验证
-   [OpenTelemetry](/plugins/opentelemetry) - 添加对 OpenTelemetry 的支持
-   [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 审计性能瓶颈
-   [Static](/plugins/static) - 提供静态文件/文件夹服务
-   [Stream](/plugins/stream) - 集成响应流和 [服务器发送事件 (SSEs)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
-   [Swagger](/plugins/swagger) - 生成 [Swagger](https://swagger.io/) 文档
-   [WebSocket](/patterns/websocket) - 支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 社区插件：

-   [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 轻松搭建带有环境配置的 Elysia 项目（支持 ORM、Lint 工具和插件）！
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 简洁且干净的身份认证方案
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方 Clerk 身份验证插件
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
-   [Vite server](https://github.com/kravetsone/elysia-vite-server) - 插件，在开发模式下启动并装饰 [`vite`](https://vitejs.dev/) 开发服务器，并在生产模式下提供静态文件（如需要）
-   [Vite](https://github.com/timnghg/elysia-vite) - 提供注入了 Vite 脚本的入口 HTML 文件服务
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松集成 Elysia 与 Nuxt！
-   [Remix](https://github.com/kravetsone/elysia-remix) - 使用带有 `HMR` 支持的 [Remix](https://remix.run/)（基于 [`vite`](https://vitejs.dev/)）！解决了一个长期存在的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)
-   [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - 基于 [Dexie.js](https://dexie.org/) 的轻量级离线优先数据同步框架
-   [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 允许直接在 Elysia 中使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件的插件！
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 通过各种 HTTP 头增强 Elysia 应用安全
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 基于 Elysia 服务器的 Vite SSR 插件
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 支持超过 **42** 个提供商和具备 **类型安全** 的 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流程插件！
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流程
-   [OAuth2 Resource Server](https://github.com/ap-1/elysia-oauth2-resource-server) - 验证来自 OAuth2 提供商的 JWT 令牌的插件，支持基于 JWKS 端点的发行者、受众和作用域验证
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单轻量的速率限制器
-   [Logysia](https://github.com/tristanisham/logysia) - 经典日志中间件
-   [Logestic](https://github.com/cybercoder-naj/logestic) - 为 ElysiaJS 提供高级且可定制的日志库
-   [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
-   [Elylog](https://github.com/eajr/elylog) - 简单的 stdout 日志库，支持部分自定义
-   [Logify for Elysia.js](https://github.com/0xrasla/logify) - 快速、美观且类型安全的 Elysia.js 日志中间件
-   [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 不是最好的，但相当好用且简洁的 Elysia 日志工具
-   [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 使用该 [Sentry](https://docs.sentry.io/) 插件捕获追踪和错误
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 部署到 AWS Lambda
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，支持为 [Eden](https://elysiajs.com/eden/overview.html) 生成类型，支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 支持使用 [MessagePack](https://msgpack.org)
-   [XML](https://github.com/kravetsone/elysia-xml) - 支持 XML
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 基于文件夹和组的路由器
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本 HTTP 认证
-   [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
-   [CDN Cache](https://github.com/johnny-woodtke/elysiajs-cdn-cache) - 适用于 Elysia 的 Cache-Control 插件 - 无需手动设置 HTTP 头
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基本 HTTP 认证（使用 `request` 事件）
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 包装器
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID (`X-Request-ID` 或自定义)
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - 为 [HTMX](https://htmx.org/) 提供上下文辅助
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 当目录中任何文件变更时，重新加载 HTML 文件
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 在 HTML 文件中注入 HTML 代码
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方 [WorkOS' AuthKit](https://www.authkit.com/) 身份验证
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简单的错误处理
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - 使用 typebox 的类型安全环境变量
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 Elysia Swagger 模型中使用 Drizzle ORM schema。
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务器（Yoga & Apollo）的错误代码
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 使用 JWT（Header/Cookie/QueryParam）处理身份验证的库。
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 受 [graceful-server](https://github.com/gquittet/graceful-server) 启发的库。
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 美观简洁的带有颜色和时间戳的 ElysiaJS 日志中间件。
-   [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 简单且可定制的错误处理中间件，可创建自定义 HTTP 错误。
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的 ElysiaJS 响应压缩插件
-   [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 支持 gzip、deflate 和 brotli 的 Elysia 和 Bunnyhop HTTP 压缩器。
-   [Elysia Accepts](https://github.com/morigs/elysia-accepts) - 解析 accept 头和内容协商的 Elysia 插件
-   [Elysia Compression](https://github.com/chneau/elysia-compression) - 负责压缩响应的 Elysia 插件
-   [Elysia Logger](https://github.com/chneau/elysia-logger) - 灵感源自 [hono/logger](https://hono.dev/docs/middleware/builtin/logger) 的 HTTP 请求和响应日志插件
-   [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - 支持 CQRS 模式的 Elysia 插件
-   [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 无缝整合 [Supabase](https://supabase.com/) 的认证和数据库功能，方便访问认证用户数据及 Supabase 客户端，特别适用于 [Edge Functions](https://supabase.com/docs/guides/functions)。
-   [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - 通过清理请求体数据提供 XSS（跨站脚本）保护的 Elysia.js 插件。
-   [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 为 Elysia.js 应用提供全面安全中间件，通过设置多种 HTTP 头增强安全性。
-   [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 轻松开发和集成 API、Websocket 及流式 API 的小型库。
-   [Elysia Protobuf](https://github.com/ilyhalight/elysia-protobuf) - 支持 Elysia 的 protobuf。
-   [Elysia Prometheus](https://github.com/m1handr/elysia-prometheus) - 用于 Prometheus 暴露 HTTP 指标的 Elysia 插件。
-   [Elysia Remote DTS](https://github.com/rayriffy/elysia-remote-dts) - 为 Eden Treaty 提供远程 .d.ts 类型的插件。
-   [Cap Checkpoint plugin for Elysia](https://capjs.js.org/guide/middleware/elysia.html) - 类似 Cloudflare 的基于 SHA-256 工作量证明（PoW）设计的轻量现代开源 CAPTCHA 替代方案 Cap 的中间件。
-   [Elysia Background](https://github.com/staciax/elysia-background) - Elysia.js 的后台任务处理插件
-   [@fedify/elysia](https://github.com/fedify-dev/fedify/tree/main/packages/elysia) - 与 [Fedify](https://fedify.dev/) ActivityPub 服务器框架的无缝集成插件。

## 相关项目：

-   [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成 typebox 模式的生成器，适用于 elysia

---

如果您为 Elysia 编写了一个插件，请随时通过 **点击下面的 <i>在 GitHub 上编辑此页面</i>** 将您的插件添加到列表中 👇