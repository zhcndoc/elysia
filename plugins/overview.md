---
url: 'https://elysiajs.com/plugins/overview.md'
---

# 概述

Elysia 旨在实现模块化和轻量化。

遵循与 Arch Linux 相同的理念（顺便说一句，我使用 Arch）：

> 设计决策通过开发者共识逐案作出

这确保了开发者最终得到他们所希望创建的高性能 Web 服务器。由此，Elysia 包含了预构建的常见模式插件，以方便开发者使用：

## 官方插件：

* [Bearer](/plugins/bearer) - 自动获取 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
* [CORS](/plugins/cors) - 设置 [跨域资源共享 (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 任务
* [Eden](/eden/overview) - Elysia 的端到端类型安全客户端
* [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
* [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
* [HTML](/plugins/html) - 处理 HTML 响应
* [JWT](/plugins/jwt) - 使用 [JWTs](https://jwt.io/) 进行身份验证
* [OpenAPI](/plugins/openapi) - 生成 [OpenAPI](https://swagger.io/specification/) 文档
* [OpenTelemetry](/plugins/opentelemetry) - 添加 OpenTelemetry 支持
* [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 审计性能瓶颈
* [Static](/plugins/static) - 提供静态文件/文件夹服务
* [Stream](/plugins/stream) - 集成响应流和 [服务器发送事件 (SSEs)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
* [WebSocket](/patterns/websocket) - 支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 社区插件：

* [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - 轻松搭建您的 Elysia 项目环境（支持 ORM、代码规范和插件）！
* [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 简洁的身份验证
* [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方 Clerk 身份验证插件
* [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
* [Vite server](https://github.com/kravetsone/elysia-vite-server) - 启动并装饰 `vite` 开发服务器的插件，在“开发”模式下运行，在“生产”模式下提供静态文件（如果需要）
* [Vite](https://github.com/timnghg/elysia-vite) - 提供注入了 Vite 脚本的入口 HTML 文件
* [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松将 Elysia 与 Nuxt 集成！
* [Remix](https://github.com/kravetsone/elysia-remix) - 使用支持 `HMR` 的 [Remix](https://remix.run/)（由 [`vite`](https://vitejs.dev/) 提供支持）！解决了一个长期请求的插件[#12](https://github.com/elysiajs/elysia/issues/12)
* [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - 由 [Dexie.js](https://dexie.org/) 驱动的轻量级离线优先数据同步框架
* [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - 允许你直接在 Elysia 中使用 [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 中间件的插件！
* [Elysia HTTP Exception](https://github.com/codev911/elysia-http-exception) - Elysia 插件，用于处理 HTTP 4xx/5xx 错误，提供结构化异常类
* [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 通过各种 HTTP 头保护 Elysia 应用安全
* [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 基于 Elysia 服务器的 Vite SSR 插件
* [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 支持超过 **42** 个提供者并具备 **类型安全** 的 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流程插件！
* [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权代码流程
* [OAuth2 Resource Server](https://github.com/ap-1/elysia-oauth2-resource-server) - 通过 JWKS 端点验证 OAuth2 提供者的 JWT 令牌的插件，支持验证发行者、受众和权限
* [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
* [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单轻量的速率限制器
* [Logysia](https://github.com/tristanisham/logysia) - 经典日志中间件
* [Logestic](https://github.com/cybercoder-naj/logestic) - 为 ElysiaJS 设计的高级且可定制的日志库
* [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
* [Elylog](https://github.com/eajr/elylog) - 简易的标准输出日志库，支持一定的自定义
* [Logify for Elysia.js](https://github.com/0xrasla/logify) - 为 Elysia.js 应用提供美观、快速且类型安全的日志中间件
* [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 不是最漂亮，但非常不错和简洁的 Elysia 日志器
* [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 使用 [Sentry](https://docs.sentry.io/) 捕获跟踪和错误的插件
* [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 在 AWS Lambda 上部署
* [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
* [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，支持为 [Eden](https://elysiajs.com/eden/overview.html) 生成类型，且支持 [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage)
* [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 支持操作 [MessagePack](https://msgpack.org)
* [XML](https://github.com/kravetsone/elysia-xml) - 支持处理 XML
* [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
* [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 基于文件夹的分组路由器
* [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基础 HTTP 认证
* [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
* [CDN Cache](https://github.com/johnny-woodtke/elysiajs-cdn-cache) - Elysia 的 Cache-Control 插件 - 无需手动设置 HTTP 头
* [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基础 HTTP 认证（使用 `request` 事件）
* [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的本地化封装
* [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID（`X-Request-ID` 或自定义）
* [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - 提供针对 [HTMX](https://htmx.org/) 的上下文辅助
* [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 在目录中任意文件变更时重新加载 HTML 文件
* [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 向 HTML 文件注入 HTML 代码
* [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
* [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
* [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
* [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 在插件中编译 [Tailwindcss](https://tailwindcss.com/)
* [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
* [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
* [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
* [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
* [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方 [WorkOS 的 AuthKit](https://www.authkit.com/) 认证支持
* [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简洁的错误处理
* [Elysia env](https://github.com/yolk-oss/elysia-env) - 使用 typebox 的类型安全环境变量
* [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 Elysia OpenAPI 模型中使用 Drizzle ORM 模式
* [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
* [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL 服务器（Yoga & Apollo）的错误代码
* [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 使用 JWT（Header/Cookie/QueryParam）处理身份验证的库
* [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 受 [graceful-server](https://github.com/gquittet/graceful-server) 启发的库
* [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 带颜色和时间戳的美观简洁的 ElysiaJS 日志中间件
* [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 简单且可定制的错误处理中间件，支持自定义 HTTP 错误
* [Elysia Compress](https://github.com/vermaysha/elysia-compress) - 受 [@fastify/compress](https://github.com/fastify/fastify-compress) 启发的 ElysiaJS 响应压缩插件
* [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - 适用于 Elysia 和 Bunnyhop 的 HTTP 压缩器，支持 gzip、deflate 和 brotli
* [Elysia Accepts](https://github.com/morigs/elysia-accepts) - 用于解析 Accept 头和内容协商的 Elysia 插件
* [Elysia Compression](https://github.com/chneau/elysia-compression) - 用于压缩响应的 Elysia 插件
* [Elysia Logger](https://github.com/chneau/elysia-logger) - 受 [hono/logger](https://hono.dev/docs/middleware/builtin/logger) 启发的 Elysia HTTP 请求和响应日志插件
* [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - 适用于 CQRS 模式的 Elysia 插件
* [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - 无缝集成 [Supabase](https://supabase.com/) 身份验证和数据库功能，轻松访问认证用户数据和 Supabase 客户端实例，特别适用于 [边缘函数](https://supabase.com/docs/guides/functions)
* [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - 为 Elysia.js 提供的 XSS（跨站脚本攻击）防护插件，通过清理请求体数据实现
* [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 为 Elysia.js 应用提供的全面安全中间件，设置多种 HTTP 头以增强安全性
* [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 通过这个小型库无缝开发并集成 API、Websocket 和流式 API
* [Elysia Protobuf](https://github.com/ilyhalight/elysia-protobuf) - 支持 Elysia 的 protobuf
* [Elysia Prometheus](https://github.com/m1handr/elysia-prometheus) - 用于暴露 Prometheus HTTP 指标的 Elysia 插件
* [Elysia Remote DTS](https://github.com/rayriffy/elysia-remote-dts) - 为 Eden Treaty 提供远程 .d.ts 类型的插件
* [Cap Checkpoint plugin for Elysia](https://capjs.js.org/guide/middleware/elysia.html) - 类似 Cloudflare 的 Cap 中间件，一个基于 SHA-256 PoW 设计的轻量级现代开源 CAPTCHA 替代方案
* [Elysia Background](https://github.com/staciax/elysia-background) - Elysia.js 的后台任务处理插件
* [@fedify/elysia](https://github.com/fedify-dev/fedify/tree/main/packages/elysia) - 与 [Fedify](https://fedify.dev/)（ActivityPub 服务器框架）无缝集成的插件

## 相关项目：

* [prismabox](https://github.com/m1212e/prismabox) - 基于您的数据库模型生成 typebox 模式的生成器，适用于 Elysia

***

如果您为 Elysia 编写了一个插件，请随时通过 **点击下面的 在 GitHub 上编辑此页面** 将您的插件添加到列表中 👇
