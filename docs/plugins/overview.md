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

遵循与 Arch Linux 相同的理念（顺便说一句，我使用 Arch）：

> 设计决策是通过开发者共识逐个案例做出的

这确保了开发者最终能够创建出高性能的 web 服务器。因此，Elysia 包含了预构建的常见模式插件，以方便开发者使用：

## 官方插件

以下是由 Elysia 团队维护的一些官方插件：

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

-   [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 轻松搭建你的 Elysia 项目环境（帮助配置 ORM、代码检查器和插件）！
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 简洁且简单的身份验证
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方 Clerk 身份验证插件
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
-   [Vite server](https://github.com/kravetsone/elysia-vite-server) - 在 `development` 和 `production` 模式下启动并装饰 [`vite`](https://vitejs.dev/) 开发服务器的插件，并根据需要提供静态文件服务
-   [Vite](https://github.com/timnghg/elysia-vite) - 通过 Vite 注入脚本后提供入口 HTML 文件服务
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松将 Elysia 与 Nuxt 集成！
-   [Remix](https://github.com/kravetsone/elysia-remix) - 使用带 `HMR` 支持的 [Remix](https://remix.run/)（由 [`vite`](https://vitejs.dev/) 提供支持）！解决了长期存在的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)
-   [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - 轻量级的离线优先数据同步框架，基于 [Dexie.js](https://dexie.org/)
-   [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 允许你直接在 Elysia 中使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件的插件！
-   [Elysia HTTP Exception](https://github.com/codev911/elysia-http-exception) - 基于结构化异常类的 Elysia 4xx/5xx HTTP 错误处理插件
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 通过多种 HTTP 头保护 Elysia 应用安全
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 使用 Elysia 服务器的 Vite SSR 插件
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 支持超过 **42** 家提供商和 **类型安全** 的 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流插件！
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流程
-   [OAuth2 Resource Server](https://github.com/ap-1/elysia-oauth2-resource-server) - 验证 OAuth2 提供商的 JWKS 端点上的 JWT 令牌的插件，支持发行人、受众和权限验证
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单轻量的速率限制器
-   [LLMs.txt](https://github.com/opuu/elysia-llms-txt) - 从 OpenAPI/Swagger 生成适合大型语言模型的 `/llms.txt` 文件
-   [Logysia](https://github.com/tristanisham/logysia) - 经典日志中间件
-   [Logestic](https://github.com/cybercoder-naj/logestic) - 高级且可定制的 ElysiaJS 日志库
-   [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
-   [Elysia Line](https://github.com/KrataiB/elysia-line) - Elysia 的 LINE 消息和登录集成（官方 [@line/bot-sdk](https://github.com/line/line-bot-sdk-nodejs) 的包装器）
-   [Elylog](https://github.com/eajr/elylog) - 简单且可定制的标准输出日志库
-   [Logify for Elysia.js](https://github.com/0xrasla/logify) - 为 Elysia.js 应用提供美观、快速且类型安全的日志中间件
-   [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 不是最棒，但非常好用且简洁的 Elysia 日志器
-   [LogTape for Elysia](https://logtape.org/manual/integrations#elysia) - 支持多出口（传输）的结构化日志中间件，通过 [LogTape](https://logtape.org/)
-   [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 通过该 [Sentry](https://docs.sentry.io/) 插件捕获跟踪和错误
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 部署到 AWS Lambda
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，支持为 [Eden](/eden/overview) 生成类型，支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许你使用 [MessagePack](https://msgpack.org)
-   [XML](https://github.com/kravetsone/elysia-xml) - 允许你操作 XML
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 基于文件系统和文件夹的分组路由器
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本 HTTP 身份验证
-   [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
-   [CDN Cache](https://github.com/johnny-woodtke/elysiajs-cdn-cache) - Elysia 的 Cache-Control 插件 —— 不再需要手动设置 HTTP 头
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基本 HTTP 身份验证（使用 `request` 事件）
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 封装
-   [Intlify](https://github.com/intlify/srvmid/blob/main/packages/elysia/README.md) - 国际化服务器中间件和工具
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID（`X-Request-ID` 或自定义）
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - 针对 [HTMX](https://htmx.org/) 的上下文辅助
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 监听目录文件更改并自动重新加载 HTML 文件
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 向 HTML 文件注入 HTML 代码
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理函数返回 HTTP 错误
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方 [WorkOS 的 AuthKit](https://www.authkit.com/) 认证
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简洁的错误处理
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - 使用 typebox 的类型安全环境变量
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 辅助在 Elysia OpenAPI 模型中使用 Drizzle ORM 架构
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务器（Yoga 和 Apollo）的错误代码
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 处理带有 JWT（头部/Cookie/查询参数）认证的库
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 灵感来源于 [graceful-server](https://github.com/gquittet/graceful-server) 的库
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 一个漂亮且简单的带颜色和时间戳的 ElysiaJS 日志中间件
-   [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 简单且可定制的错误处理中间件，支持创建自定义 HTTP 错误
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的 ElysiaJS 压缩响应插件
-   [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 紧凑而卓越的效果：支持 gzip、deflate 和 brotli 的 Elysia 和 Bunnyhop HTTP 压缩器
-   [Elysia Accepts](https://github.com/morigs/elysia-accepts) - 用于解析 accept 头及内容协商的 Elysia 插件
-   [Elysia Compression](https://github.com/chneau/elysia-compression) - 用于响应压缩的 Elysia 插件
-   [Elysia Logger](https://github.com/chneau/elysia-logger) - 灵感来自 [hono/logger](https://hono.dev/docs/middleware/builtin/logger) 的 Elysia HTTP 请求和响应日志插件
-   [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - Elysia 的 CQRS 模式插件
-   [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 无缝集成 [Supabase](https://supabase.com/) 身份认证和数据库功能，便于访问认证用户数据和 Supabase 客户端，尤其适用于 [Edge Functions](https://supabase.com/docs/guides/functions)
-   [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - Elysia.js 的 XSS（跨站脚本）防护插件，通过清理请求体数据实现保护
-   [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 为 Elysia.js 应用提供多种 HTTP 头以增强安全性的综合安全中间件
-   [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 使用这个小型库无缝开发和集成 API、WebSocket 和流式 API
-   [Elysia Protobuf](https://github.com/ilyhalight/elysia-protobuf) - Elysia 的 protobuf 支持
-   [Elysia Prometheus](https://github.com/m1handr/elysia-prometheus) - 用于暴露 Prometheus HTTP 指标的 Elysia 插件
-   [Elysia Remote DTS](https://github.com/rayriffy/elysia-remote-dts) - 为 Eden Treaty 提供远程 .d.ts 类型的插件
-   [Cap Checkpoint plugin for Elysia](https://capjs.js.org/guide/middleware/elysia.html) - 类似 Cloudflare 的中间件，基于 SHA-256 PoW 设计的轻量级现代开源 CAPTCHA 替代方案 Cap
-   [Elysia Background](https://github.com/staciax/elysia-background) - Elysia.js 的后台任务处理插件
-   [Elysia External Session - TS only GitHub package](https://github.com/extend-therapy/elysia-external-session) - 一个为 Redis 和 SQLite 设计的可扩展会话包，采用当前 Elysia 架构
-   [@fedify/elysia](https://github.com/fedify-dev/fedify/tree/main/packages/elysia) - 提供与 [Fedify](https://fedify.dev/) ActivityPub 服务器框架无缝集成的插件
-   [elysia-healthcheck](https://github.com/iam-medvedev/elysia-healthcheck) - Elysia.js 的健康检查插件
-   [elysia-csrf](https://github.com/lauhon/elysia-csrf) - 移植自 [express-csrf](https://github.com/expressjs/csurf) 的 CSRF 插件
-   [elysia-local-https](https://github.com/mrtcmn/elysia-local-https) - 为 Elysia 自动提供本地 HTTPS —— 证书一行命令生成、管理和刷新
-   [elysia-circuit-breaker](https://github.com/camargo-leonardo/elysia-circuit-breaker) - 为 Elysia.js 引入容错能力的断路器插件
-   [Eden TanStack Query](https://github.com/xkelxmc/eden-tanstack-query) - 类似 @trpc/react-query 但用于 Elysia 的类型安全 TanStack Query 集成
-   [Socket.IO Proxy](https://www.npmjs.com/package/@synchjs/elysocket) - Elysia 的 Socket.IO 代理
-   [ModernCSRF](https://github.com/auto-medica-labs/modern-csrf) - 轻量级无令牌 CSRF 保护中间件，适用于 ElysiaJS
-   [elysia-wide-event](https://github.com/choiexe1/elysia-wide-event) - 用于结构化请求级别可观测性的广泛事件日志插件
- [elysia-beta-headers](https://github.com/P0u4a/elysia-beta-headers) - 用于通过类型安全的 API 头控制应用 Beta/实验性功能的 Elysia 插件

## 相关项目：

-   [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成 TypeBox 架构的生成器，非常适合与 Elysia 配合使用

---

如果您为 Elysia 编写了一个插件，请随时通过 **点击下面的 <i>在 GitHub 上编辑此页面</i>** 将您的插件添加到列表中 👇