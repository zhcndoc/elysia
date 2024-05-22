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

Elysia 的设计目标是模块化和轻量级。

遵循与 Arch Linux 相同的思路 (顺便一提，我使用 Arch)：

> 设计决策是通过开发者共识逐案进行的。

这样可以确保开发者能够创建出他们想要的高性能 Web 服务器。扩展而言，Elysia 包含了预构建的常见模式插件，方便开发者使用：

## 官方插件

-   [Bearer](/plugins/bearer) - 自动检索 [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 令牌
-   [CORS](/plugins/cors) - 设置[跨源资源共享 (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
-   [Cron](/plugins/cron) - 设置 [cron](https://en.wikipedia.org/wiki/Cron) 定时任务
-   [Eden](/eden/overview) - Elysia 的端到端类型安全客户端
-   [GraphQL Apollo](/plugins/graphql-apollo) - 在 Elysia 上运行 [Apollo GraphQL](https://www.apollographql.com/)
-   [GraphQL Yoga](/plugins/graphql-yoga) - 在 Elysia 上运行 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga)
-   [HTML](/plugins/html) - 处理 HTML 响应
-   [JWT](/plugins/jwt) - 使用 [JWT](https://jwt.io/) 进行身份验证
-   [Server Timing](/plugins/server-timing) - 使用 [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 审计性能瓶颈
-   [Static](/plugins/static) - 提供静态文件/文件夹服务
-   [Stream](/plugins/stream) - 集成响应流和[服务器推送事件 (SSEs)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
-   [Swagger](/plugins/swagger) - 生成 [Swagger](https://swagger.io/) 文档
-   [tRPC](/plugins/trpc) - 支持 [tRPC](https://trpc.io/)
-   [WebSocket](/patterns/websocket) - 支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 社区插件

-   [BunSai](https://github.com/levii-pires/bunsai) - 针对 Web 的全栈无关框架，基于 Bun 和 Elysia 构建
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 身份验证，简单干净
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 非官方的 Clerk 身份验证插件
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - 在 Node.js 和 Deno 上运行 Elysia 生态系统
-   [Vite](https://github.com/timnghg/elysia-vite) - 使用 Vite 注入脚本来提供入口 HTML 文件服务
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - 轻松集成 elysia 到 nuxt！
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 使用各种 HTTP 标头保护 Elysia 应用
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - 使用 Elysia 服务器的 Vite SSR 插件
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - 用于 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) 授权流程的插件，支持 **42** 个以上的提供商和**类型安全**！
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - 处理 OAuth 2.0 授权码流程
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - 基于 [openid-client](https://github.com/panva/node-openid-client) 的 OpenID 客户端
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 简单、轻量级的速率限制器
-   [Logysia](https://github.com/tristanisham/logysia) - 经典的日志中间件
-   [Logestic](https://github.com/cybercoder-naj/logestic) - ElysiaJS 的高级可定制日志库
-   [Logger](https://github.com/bogeychan/elysia-logger) - 基于 [pino](https://github.com/pinojs/pino) 的日志中间件
-   [Elylog](https://github.com/eajr/elylog) - 简单的 stdout 日志库，带有一些自定义功能
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - 在 AWS Lambda 上部署
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - 使用 TypeScript 装饰器
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - 基于目录结构的文件系统路由器，为 [Eden](https://elysiajs.com/eden/overview.html) 生成类型
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - 允许您使用 [MessagePack](https://msgpack.org) 进行操作
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 文件系统路由
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 基于文件系统和文件夹的路由器，用于分组
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 基本的 HTTP 身份验证
-   [ETag](https://github.com/bogeychan/elysia-etag) - 自动生成 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 基本的 HTTP 身份验证 (使用 `request` 事件)
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - 基于 [i18next](https://www.i18next.com/) 的 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 封装
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 添加/转发请求 ID (`X-Request-ID` 或自定义)
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - 用于 [HTMX](https://htmx.org/) 的上下文助手
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 当更改目录中的任何文件时重新加载 HTML 文件
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - 向 HTML 文件中注入 HTML 代码
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - 从 Elysia 处理程序返回 HTTP 错误
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - 集成 HTTP 状态码
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - 禁用缓存
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 编译 [Tailwindcss](https://tailwindcss.com/) 插件。
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 压缩响应
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - 获取 IP 地址
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - 使用 Elysia 开发 OAuth2 服务器
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 启用闪存消息
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 非官方的 [WorkOS' AuthKit](https://www.authkit.com/) 验证
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 更简单的错误处理
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - 带有 typebox 的类型安全环境变量
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - 帮助在 elysia swagger 模型中使用 Drizzle ORM 模式。
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - 统一 Elysia 的错误代码
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - 统一 Elysia GraphQL Server (Yoga & Apollo) 的错误代码
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - 使用 JWT (Header/Cookie/QueryParam) 处理认证的库。
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - 受 [graceful-server](https://github.com/gquittet/graceful-server) 启发的库。
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 一个漂亮而简单的带有颜色和时间戳的 ElysiaJS 日志中间件。

---

如果您为 Elysia 编写了插件，请随时点击下方**在 GitHub 上编辑此页面**添加您的插件到列表中 👇
