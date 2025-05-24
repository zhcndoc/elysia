---
url: /plugins/overview.md
---

# 概述

Elysia 旨在实现模块化和轻量化。

遵循与 Arch Linux 相同的理念（顺便说一句，我使用 Arch）：

> 设计决策通过开发者共识逐案作出

这确保了开发者最终得到他们所希望创建的高性能 Web 服务器。由此，Elysia 包含了预构建的常见模式插件，以方便开发者使用：

## 官方插件：

* [Bearer](/plugins/bearer) - 自动检索 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
* [CORS](/plugins/cors) - 设置 [跨来源资源共享 (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 任务
* [Eden](/eden/overview) - Elysia 的端到端类型安全客户端
* [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
* [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
* [HTML](/plugins/html) - 处理 HTML 响应
* [JWT](/plugins/jwt) - 使用 [JWT](https://jwt.io/) 进行身份验证
* [OpenTelemetry](/plugins/opentelemetry) - 添加对 OpenTelemetry 的支持
* [Server Timing](/plugins/server-timing) - 通过 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 审核性能瓶颈
* [Static](/plugins/static) - 服务静态文件/文件夹
* [Stream](/plugins/stream) - 集成响应流和 [服务器发送事件 (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
* [Swagger](/plugins/swagger) - 生成 [Swagger](https://swagger.io/) 文档
* [tRPC](/plugins/trpc) - 支持 [tRPC](https://trpc.io/)
* [WebSocket](/patterns/websocket) - 支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 社区插件：

* [BunSai](https://github.com/nikiskaarup/bunsai2) - 一个全栈无关的 Web 框架，基于 Bun 和 Elysia 构建
* [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 为您的 Elysia 项目搭建开发环境，以便于（提供 ORM、代码风格检查工具和插件的帮助）！
* [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 身份验证，简单而干净
* [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方的 Clerk 身份验证插件
* [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
* [Vite server](https://github.com/kravetsone/elysia-vite-server) - 插件，用于在 `development` 模式下启动和装饰 [`vite`](https://vitejs.dev/) 开发服务器，并在 `production` 模式下提供静态服务（如果需要）
* [Vite](https://github.com/timnghg/elysia-vite) - 提供带有 Vite 脚本注入的入口 HTML 文件
* [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 将 elysia 与 nuxt 轻松集成！
* [Remix](https://github.com/kravetsone/elysia-remix) - 使用支持 `HMR` 的 [Remix](https://remix.run/)！（由 [`vite`](https://vitejs.dev/) 提供支持）！ 关闭一个长期存在的插件请求 [#12](https://github.com/elysiajs/elysia/issues/12)
* [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - 一个轻量级的离线优先数据同步框架，基于 [Dexie.js](https://dexie.org/)
* [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 插件，允许您在 Elysia 中直接使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件！
* [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 通过各种 HTTP 头保护 Elysia 应用
* [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 使用 Elysia 服务器的 Vite SSR 插件
* [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 一个用于 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流程的插件，支持超过 **42** 个提供商，并且具备 **类型安全**！
* [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流程
* [OAuth2 Resource Server](https://github.com/ap-1/elysia-oauth2-resource-server) - 一个用于验证来自 OAuth2 提供者的 JWT 令牌与 JWKS 端点的插件，支持发行者、受众和范围验证。
* [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 一个基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
* [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单、轻量级的速率限制器
* [Logysia](https://github.com/tristanisham/logysia) - 经典的日志中间件
* [Logestic](https://github.com/cybercoder-naj/logestic) - 一个高级且可定制的 ElysiaJS 日志库
* [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
* [Elylog](https://github.com/eajr/elylog) - 简单的标准输出日志库，具有一些自定义选项
* [Logify for Elysia.js](https://github.com/0xrasla/logify) - 一个漂亮、快速且类型安全的 Elysia.js 应用日志中间件
* [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 虽然不是最好的，但也是一个相当不错和甜美的 Elysia 日志器。
* [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 通过这个 [Sentry](https://docs.sentry.io/) 插件捕获跟踪信息和错误
* [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 部署到 AWS Lambda
* [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
* [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，为 [Eden](https://elysiajs.com/eden/overview.html) 生成类型，并支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
* [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许您处理 [MessagePack](https://msgpack.org)
* [XML](https://github.com/kravetsone/elysia-xml) - 允许您处理 XML
* [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
* [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 基于文件系统和文件夹的分组路由器
* [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本 HTTP 身份验证
* [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
* [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基本 HTTP 身份验证（使用 `request` 事件）
* [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 包装
* [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID（`X-Request-ID` 或自定义）
* [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - [HTMX](https://htmx.org/) 的上下文助手
* [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 更改目录中的任何文件时重新加载 HTML 文件
* [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 在 HTML 文件中注入 HTML 代码
* [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
* [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
* [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
* [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)。
* [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
* [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
* [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
* [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
* [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方的 [WorkOS' AuthKit](https://www.authkit.com/) 身份验证
* [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 简化错误处理
* [Elysia env](https://github.com/yolk-oss/elysia-env) - 使用 typebox 的类型安全环境变量
* [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 elysia swagger 模型中使用 Drizzle ORM 模式。
* [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
* [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务器 (Yoga & Apollo) 的错误代码
* [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 用于处理 JWT 认证的库（Header/Cookie/QueryParam）。
* [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 灵感来自 [graceful-server](https://github.com/gquittet/graceful-server) 的库。
* [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 一个美观而简单的 ElysiaJS 日志中间件，带有颜色和时间戳。
* [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 一个简单且可定制的错误处理间件，可以创建您自己的 HTTP 错误
* [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的 ElysiaJS 插件，用于压缩响应
* [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 紧凑的辉煌、广泛的结果：适用于 Elysia 和 Bunnyhop 的 HTTP 压缩器，支持 gzip、deflate 和 brotli。
* [Elysia Accepts](https://github.com/morigs/elysia-accepts) - Elysia 插件，用于解析接受头和内容协商
* [Elysia Compression](https://github.com/chneau/elysia-compression) - Elysia 插件，用于压缩响应
* [Elysia Logger](https://github.com/chneau/elysia-logger) - Elysia 插件，用于记录 HTTP 请求和响应，灵感来自 [hono/logger](https://hono.dev/docs/middleware/builtin/logger)
* [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - Elysia 插件，用于 CQRS 模式
* [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 无缝集成 [Supabase](https://supabase.com/) 身份验证和数据库功能到 Elysia，使访问经过身份验证的用户数据和 Supabase 客户端实例变得简单，特别适用于 [Edge Functions](https://supabase.com/docs/guides/functions)。
* [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - Elysia.js 的插件，通过清洗请求体数据提供 XSS (跨站脚本) 保护。
* [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 一个全面的安全中间件，帮助通过设置各种 HTTP 头来保护 Elysia.js 应用。
* [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 通过这个小型库无缝开发和集成 API、Websocket 和流媒体 API。
* [Elysia Protobuf](https://github.com/ilyhalight/elysia-protobuf) - 支持 Elysia 的 protobuf。
* [Elysia Prometheus](https://github.com/m1handr/elysia-prometheus) - Elysia 插件，用于暴露 Prometheus 的 HTTP 指标。
* [Elysia Remote DTS](https://github.com/rayriffy/elysia-remote-dts) - 一个为 Eden Treaty 提供远程 .d.ts 类型的插件。

## 相关项目：

* [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成 typebox 模式的生成器，适用于 elysia

***

如果您为 Elysia 编写了一个插件，请随时通过 **点击下面的 在 GitHub 上编辑此页面** 将您的插件添加到列表中 👇
