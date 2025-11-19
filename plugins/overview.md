---
url: 'https://elysiajs.com/plugins/overview.md'
---

# 概述

Elysia 旨在实现模块化和轻量化。

遵循与 Arch Linux 相同的理念（顺便说一句，我使用 Arch）：

> 设计决策是通过开发者共识逐个案例做出的

这确保了开发者最终能够创建出高性能的 web 服务器。因此，Elysia 包含了预构建的常见模式插件，以方便开发者使用：

## 官方插件

以下是由 Elysia 团队维护的一些官方插件：

* [Bearer](/plugins/bearer) - 自动检索 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
* [CORS](/plugins/cors) - 设置 [跨源资源共享 (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 任务
* [Eden](/eden/overview) - Elysia 的端到端类型安全客户端
* [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
* [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
* [HTML](/plugins/html) - 处理 HTML 响应
* [JWT](/plugins/jwt) - 使用 [JWT](https://jwt.io/) 进行身份验证
* [OpenAPI](/plugins/openapi) - 生成 [OpenAPI](https://swagger.io/specification/) 文档
* [OpenTelemetry](/plugins/opentelemetry) - 添加对 OpenTelemetry 的支持
* [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 进行性能瓶颈审计
* [Static](/plugins/static) - 提供静态文件/文件夹

## 社区插件

* [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 轻松搭建您的 Elysia 项目环境（帮助处理 ORM、Linters 和插件）！
* [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 身份验证，简单而清晰
* [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方 Clerk 身份验证插件
* [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
* [Vite server](https://github.com/kravetsone/elysia-vite-server) - 插件，在 `development` 模式下启动和装饰 [`vite`](https://vitejs.dev/) 开发服务器，在 `production` 模式下提供静态文件（如果需要）
* [Vite](https://github.com/timnghg/elysia-vite) - 提供注入 Vite 脚本的入口 HTML 文件
* [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松将 Elysia 与 Nuxt 集成！
* [Remix](https://github.com/kravetsone/elysia-remix) - 使用 [`HMR`](https://vitejs.dev/) 支持的 [Remix](https://remix.run/)！关闭一个长期存在的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)
* [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - 一个基于 [Dexie.js](https://dexie.org/) 的轻量级离线优先数据同步框架
* [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 插件，允许您在 Elysia 中直接使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件！
* [Elysia HTTP Exception](https://github.com/codev911/elysia-http-exception) - Elysia 插件，用于处理 HTTP 4xx/5xx 错误，提供结构化异常类
* [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 用各种 HTTP 头安全保护 Elysia 应用
* [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 使用 Elysia 服务器的 Vite SSR 插件
* [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 用于 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流程的插件，支持超过 **42** 个提供者且具有 **类型安全性**！
* [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流
* [OAuth2 Resource Server](https://github.com/ap-1/elysia-oauth2-resource-server) - 插件，用于验证来自 OAuth2 提供者的 JWT 令牌与 JWKS 端点，支持发行者、受众和范围验证
* [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
* [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单轻量的速率限制器
* [Logysia](https://github.com/tristanisham/logysia) - 经典的日志中间件
* [Logestic](https://github.com/cybercoder-naj/logestic) - 为 ElysiaJS 提供的高级可定制日志库
* [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
* [Elylog](https://github.com/eajr/elylog) - 简单的 stdout 日志库，具备一些自定义功能
* [Logify for Elysia.js](https://github.com/0xrasla/logify) - 一款优雅、快速且类型安全的 Elysia.js 应用日志中间件
* [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 可能不是最好的，但对于 Elysia 来说是一个相当不错且甜美的日志器。
* [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 使用此 [Sentry](https://docs.sentry.io/) 插件捕获追踪和错误
* [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 部署在 AWS Lambda 上
* [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
* [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由，支持生成 [Eden](https://elysiajs.com/eden/overview.html) 的类型，并支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
* [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许您与 [MessagePack](https://msgpack.org) 一起工作
* [XML](https://github.com/kravetsone/elysia-xml) - 允许您与 XML 一起工作
* [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
* [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 基于文件系统和文件夹的组路由器
* [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本 HTTP 身份验证
* [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
* [CDN Cache](https://github.com/johnny-woodtke/elysiajs-cdn-cache) - Elysia 的 Cache-Control 插件 - 不再手动设置 HTTP 头
* [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基本 HTTP 身份验证（使用 `request` 事件）
* [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 封装
* [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID（`X-Request-ID` 或自定义）
* [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - [HTMX](https://htmx.org/) 的上下文助手
* [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 在更改目录中的任何文件时重新加载 HTML 文件
* [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 将 HTML 代码注入 HTML 文件
* [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
* [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态代码
* [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
* [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)。
* [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
* [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
* [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
* [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
* [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方 [WorkOS' AuthKit](https://www.authkit.com/) 身份验证
* [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简单的错误处理
* [Elysia env](https://github.com/yolk-oss/elysia-env) - 具有 typebox 的类型安全环境变量
* [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 Elysia OpenAPI 模型中使用 Drizzle ORM 架构。
* [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 为 Elysia 统一错误代码
* [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 为 Elysia GraphQL 服务器（Yoga & Apollo）统一错误代码
* [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 处理 JWT 认证的库（头/ Cookie/ 查询参数）。
* [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 受 [graceful-server](https://github.com/gquittet/graceful-server) 启发的库。
* [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 旨在为 ElysiaJS 提供美观且简单的日志中间件，支持颜色和时间戳。
* [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 提供简单且可定制的错误处理中间件，允许创建自定义 HTTP 错误。
* [Elysia Compress](https://github.com/vermaysha/elysia-compress) - ElysiaJS 插件，用于压缩响应，灵感来自 [@fastify/compress](https://github.com/fastify/fastify-compress)
* [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 紧凑的卓越与广泛的结果：支持 gzip、deflate 和 brotli 的 Elysia 和 Bunnyhop HTTP 压缩器。
* [Elysia Accepts](https://github.com/morigs/elysia-accepts) - 用于接受头解析和内容协商的 Elysia 插件
* [Elysia Compression](https://github.com/chneau/elysia-compression) - 用于压缩响应的 Elysia 插件
* [Elysia Logger](https://github.com/chneau/elysia-logger) - 用于记录 HTTP 请求和响应的 Elysia 插件，灵感来自 [hono/logger](https://hono.dev/docs/middleware/builtin/logger)
* [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - Elysia 插件，实现 CQRS 模式
* [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 无缝集成 [Supabase](https://supabase.com/) 身份验证和数据库功能，使访问经过身份验证的用户数据和 Supabase 客户端实例变得容易。特别适用于 [Edge Functions](https://supabase.com/docs/guides/functions)。
* [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - 为 Elysia.js 提供 XSS（跨站脚本）保护的插件，清洗请求体数据。
* [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 为 Elysia.js 应用提供全面安全性的中间件，通过设置各种 HTTP 头保护您的应用。
* [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 使用这个小库无缝开发和集成 API、Websocket 和流式 API。
* [Elysia Protobuf](https://github.com/ilyhalight/elysia-protobuf) - 为 Elysia 支持 Protobuf。
* [Elysia Prometheus](https://github.com/m1handr/elysia-prometheus) - Elysia 插件，用于为 Prometheus 暴露 HTTP 监控指标。
* [Elysia Remote DTS](https://github.com/rayriffy/elysia-remote-dts) - 为 Eden Treaty 提供可远程消费的 .d.ts 类型的插件。
* [Cap Checkpoint plugin for Elysia](https://capjs.js.org/guide/middleware/elysia.html) - 类 Cloudflare 的中间件，用于 Cap，一个轻量级、现代的开源 CAPTCHA 替代方案，使用 SHA-256 PoW 设计。
* [Elysia Background](https://github.com/staciax/elysia-background) - 用于 Elysia.js 的后台任务处理插件
* [@fedify/elysia](https://github.com/fedify-dev/fedify/tree/main/packages/elysia) - 与 [Fedify](https://fedify.dev/) 平台无缝集成的插件，兼容 ActivityPub 服务器框架。
* [elysia-healthcheck](https://github.com/iam-medvedev/elysia-healthcheck) - 用于 Elysia.js 的健康检查插件

## 相关项目：

* [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成 typebox 模式的生成器，适用于 Elysia

***

如果您为 Elysia 编写了一个插件，请随时通过 **点击下面的 在 GitHub 上编辑此页面** 将您的插件添加到列表中 👇
