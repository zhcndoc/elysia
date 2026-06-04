---
title: 插件概述 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 插件概述 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 旨在实现模块化和轻量化，这就是为什么 Elysia 包含了涉及常见模式的预构建插件，以方便开发者使用。Elysia 通过社区插件进一步增强，使其更加个性化。

    - - meta
      - name: 'og:description'
        content: Elysia 旨在实现模块化和轻量化，这就是为什么 Elysia 包含了涉及常见模式的预构建插件，以方便开发者使用。Elysia 通过社区插件进一步增强，使其更加个性化。
---

# 概述

Elysia 旨在实现模块化和轻量化。

遵循与 Arch Linux 相同的理念（顺便说一句，我用的是 Arch）：

> 设计决策是基于开发者共识，针对每个具体案例逐一制定的

这确保了开发者最终能够构建出高性能的 Web 服务器。因此，Elysia 内置了涵盖常见模式的预构建插件，以方便开发者直接使用：

## 官方插件

以下是由 Elysia 团队维护的部分官方插件：

-   [Bearer](/plugins/bearer) - 自动检索 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
-   [CORS](/plugins/cors) - 设置 [跨源资源共享 (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
-   [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 任务
-   [Eden](/eden/overview) - Elysia 的端到端类型安全客户端
-   [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
-   [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
-   [HTML](/plugins/html) - 处理 HTML 响应
-   [JWT](/plugins/jwt) - 使用 [JWT](https://jwt.io/) 进行身份验证
-   [OpenAPI](/plugins/openapi) - 生成 [OpenAPI](https://swagger.io/specification/) 文档
-   [OpenTelemetry](/plugins/opentelemetry) - 添加对 OpenTelemetry 的支持
-   [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 进行性能瓶颈审计
-   [Static](/plugins/static) - 提供静态文件/文件夹

## 社区插件

-   [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 使用该环境轻松为你的 Elysia 项目搭建脚手架（帮助处理 ORM、Lint 和插件）！
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 简洁清晰的身份验证
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方的 Clerk 身份验证插件
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
-   [Vite server](https://github.com/kravetsone/elysia-vite-server) - 在 `development` 和 `production` 模式下启动并装饰 [`vite`](https://vitejs.dev/) 开发服务器的插件，并在需要时提供静态文件
-   [Vite](https://github.com/timnghg/elysia-vite) - 注入 Vite 脚本并提供入口 HTML 文件
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松将 Elysia 与 Nuxt 集成！
-   [Remix](https://github.com/kravetsone/elysia-remix) - 使用支持 `HMR` 的 [Remix](https://remix.run/)（由 [`vite`](https://vitejs.dev/) 提供支持）！解决了一个非常久的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)
-   [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - 一个轻量级的离线优先数据同步框架，由 [Dexie.js](https://dexie.org/) 驱动
-   [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 允许你直接在 Elysia 中使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件的插件！
-   [Elysia HTTP Exception](https://github.com/codev911/elysia-http-exception) - 用于 HTTP 4xx/5xx 错误处理的 Elysia 插件，带结构化异常类
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 使用各种 HTTP 头增强 Elysia 应用安全性
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 使用 Elysia 服务器的 Vite SSR 插件
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 一个用于 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流程的插件，支持超过 **42** 个提供商，并且具有**类型安全**！
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流程
-   [OAuth2 Resource Server](https://github.com/ap-1/elysia-oauth2-resource-server) - 一个用于验证来自 OAuth2 提供商的 JWT 令牌并通过 JWKS 端点进行校验的插件，支持 issuer、audience 和 scope 验证
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单、轻量的限流器
-   [Elysia Nazli](https://github.com/esbuker/elysia-nazli) - 符合人体工学、可插拔存储的限流器，支持全局和按路由规则。
-   [LLMs.txt](https://github.com/opuu/elysia-llms-txt) - 为 OpenAPI/Swagger 生成适合 LLM 的文档 `/llms.txt`
-   [Logysia](https://github.com/tristanisham/logysia) - 经典日志中间件
-   [Logestic](https://github.com/cybercoder-naj/logestic) - ElysiaJS 的高级且可定制日志库
-   [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
-   [Elysia Line](https://github.com/KrataiB/elysia-line) - 为 Elysia 提供 LINE Messaging API 和 LINE 登录集成（对官方 [@line/bot-sdk](https://github.com/line/line-bot-sdk-nodejs) 的封装）
-   [Elylog](https://github.com/eajr/elylog) - 带一些自定义能力的简单 stdout 日志库
-   [Logify for Elysia.js](https://github.com/0xrasla/logify) - 适用于 Elysia.js 应用的美观、快速且类型安全的日志中间件
-   [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 虽然不是最“nice”的，但对于 Elysia 来说是一个相当不错且精致的日志器
-   [LogTape for Elysia](https://logtape.org/manual/integrations#elysia) - 结构化日志中间件，通过 [LogTape](https://logtape.org/) 支持多个输出端（transports）
-   [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 使用此 [Sentry](https://docs.sentry.io/) 插件捕获追踪和错误
-   [Apitally](https://github.com/apitally/apitally-js) - 在 [Apitally](https://apitally.io/elysia) 中捕获指标、日志和追踪，这是一个简单的 API 监控和分析工具
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 部署到 AWS Lambda
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
-   [Elysia FSR](https://github.com/deadlinecode/elysia-fsr) - 基于文件系统路由，支持 Eden 兼容的类型生成、monorepo/workspace 支持以及逻辑路由分组
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，可为 [Eden](/eden/overview) 生成类型，并支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许你使用 [MessagePack](https://msgpack.org)
-   [XML](https://github.com/kravetsone/elysia-xml) - 允许你使用 XML
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 用于分组的基于文件系统和文件夹的路由器
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本 HTTP 身份验证
-   [Body Limit](https://github.com/hexadecimal233/elysia-body-limit) - 限制 Elysia 中的请求体大小
-   [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
-   [CDN Cache](https://github.com/johnny-woodtke/elysiajs-cdn-cache) - Elysia 的 Cache-Control 插件——不再需要手动设置 HTTP 头
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基本 HTTP 身份验证（使用 `request` 事件）
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 封装
-   [Intlify](https://github.com/intlify/srvmid/blob/main/packages/elysia/README.md) - 国际化服务器中间件和工具
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID（`X-Request-ID` 或自定义）
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - 为 [HTMX](https://htmx.org/) 提供上下文辅助函数
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 当目录中任意文件发生变化时重新加载 HTML 文件
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 向 HTML 文件中注入 HTML 代码
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理器返回 HTTP 错误
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)。
-   [tailwind-serve](https://github.com/Moshyfawn/tailwind-serve) - 在运行时编译并提供 [Tailwind CSS v4](https://tailwindcss.com/)，无需构建步骤，适用于任何服务器框架
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪现消息
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方的 [WorkOS' AuthKit](https://www.authkit.com/) 身份验证
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简单的错误处理
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - 使用 typebox 的类型安全环境变量
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 Elysia OpenAPI 模型中使用 Drizzle ORM schema
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务器（Yoga & Apollo）的错误代码
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 处理基于 JWT（Header/Cookie/QueryParam）认证的库
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 受 [graceful-server](https://github.com/gquittet/graceful-server) 启发的库
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 一个美观且简单的 ElysiaJS 日志中间件，带有颜色和时间戳。
-   [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 一个简单且可定制的错误处理中间件，并支持创建你自己的 HTTP 错误
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的用于压缩响应的 ElysiaJS 插件
-   [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 紧凑出众，成果广阔：适用于 Elysia 和 Bunnyhop 的 HTTP 压缩器，支持 gzip、deflate 和 brotli。
-   [Elysia Accepts](https://github.com/morigs/elysia-accepts) - 用于解析 accept 头和内容协商的 Elysia 插件
-   [Elysia Compression](https://github.com/chneau/elysia-compression) - 用于压缩响应的 Elysia 插件
-   [Elysia Logger](https://github.com/chneau/elysia-logger) - 受 [hono/logger](https://hono.dev/docs/middleware/builtin/logger) 启发的用于记录 HTTP 请求和响应的 Elysia 插件
-   [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - 用于 CQRS 模式的 Elysia 插件
-   [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 将 [Supabase](https://supabase.com/) 身份验证和数据库功能无缝集成到 Elysia 中，方便轻松访问已认证用户数据和 Supabase 客户端实例。特别适用于 [Edge Functions](https://supabase.com/docs/guides/functions)。
-   [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - 通过清理请求体数据来提供 XSS（跨站脚本）防护的 Elysia.js 插件。
-   [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 一个面向 Elysia.js 应用的综合安全中间件，通过设置各种 HTTP 头来帮助保护你的应用。
-   [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 通过这个小型库无缝开发和集成 API、WebSocket 和流式 API。
-   [Elysia Protobuf](https://github.com/ilyhalight/elysia-protobuf) - 为 Elysia 提供 protobuf 支持。
-   [Elysia Prometheus](https://github.com/m1handr/elysia-prometheus) - 用于向 Prometheus 暴露 HTTP 指标的 Elysia 插件。
-   [Elysia Remote DTS](https://github.com/rayriffy/elysia-remote-dts) - 一个为 Eden Treaty 提供远程 .d.ts 类型的插件。
-   [Cap Checkpoint plugin for Elysia](https://capjs.js.org/guide/middleware/elysia.html) - 适用于 Cap 的类似 Cloudflare 的中间件；Cap 是一个轻量、现代、开源的 CAPTCHA 替代方案，使用 SHA-256 PoW 设计。
-   [Elysia Background](https://github.com/staciax/elysia-background) - 一个用于 Elysia.js 的后台任务处理插件
-   [Elysia External Session - TS only GitHub package](https://github.com/extend-therapy/elysia-external-session) - 一个适用于 Redis 和 SQLite 的会话包，具有可扩展性并使用当前的 Elysia 架构。
-   [@fedify/elysia](https://github.com/fedify-dev/fedify/tree/main/packages/elysia) - 一个与 [Fedify](https://fedify.dev/) 无缝集成的插件，Fedify 是 ActivityPub 服务器框架。
-   [elysia-healthcheck](https://github.com/iam-medvedev/elysia-healthcheck) - Elysia.js 的健康检查插件
-   [elysia-csrf](https://github.com/lauhon/elysia-csrf) - 一个 CSRF 插件，移植自 [express-csrf](https://github.com/expressjs/csurf)
-   [elysia-local-https](https://github.com/mrtcmn/elysia-local-https) - 为 Elysia 自动启用本地 HTTPS —— 证书在一行中生成、管理和刷新。
-   [elysia-circuit-breaker](https://github.com/camargo-leonardo/elysia-circuit-breaker) - 一个为 Elysia.js 带来容错能力的熔断器插件。
-   [Eden TanStack Query](https://github.com/xkelxmc/eden-tanstack-query) - 为 Eden 提供类型安全的 TanStack Query 集成，类似
  @trpc/react-query 但适用于 Elysia
-   [Socket.IO Proxy](https://www.npmjs.com/package/@synchjs/elysocket) - Elysia 的 Socket.IO 代理。
-   [ModernCSRF](https://github.com/auto-medica-labs/modern-csrf) - 一个为 ElysiaJS 提供的轻量、无 token 的 CSRF 防护中间件
-   [elysia-wide-event](https://github.com/choiexe1/elysia-wide-event) - 用于结构化请求级可观测性的广域事件日志插件。
- [elysia-beta-headers](https://github.com/P0u4a/elysia-beta-headers) - 一个通过类型安全的 API 头来控制应用 beta/实验性功能的 Elysia 插件
-   [elysia-better-session](https://github.com/0x0arash/elysia-better-session) - 一个用于服务端会话管理的 Elysia 插件，支持不同的存储适配器。

## 相关项目：

-   [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成 TypeBox 架构的生成器，非常适合与 Elysia 配合使用

## 项目模板：

-   [ElysiaTemplate](https://github.com/QLing-yes/ElysiaTemplate) - MVC 后端，自动路由与中间件，更多功能持续更新中。

---

如果您为 Elysia 编写了一个插件，请随时通过 **点击下面的 <i>在 GitHub 上编辑此页面</i>** 将您的插件添加到列表中 👇