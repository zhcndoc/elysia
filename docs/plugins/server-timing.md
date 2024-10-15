---
title: 服务器计时插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 服务器计时插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的性能审计插件，通过服务器计时 API 实现。首先通过 "bun add @elysiajs/server-timing" 安装插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的性能审计插件，通过服务器计时 API 实现。首先通过 "bun add @elysiajs/server-timing" 安装插件。
---

# 服务器计时插件
此插件支持使用服务器计时 API 审计性能瓶颈

安装命令：
```bash
bun add @elysiajs/server-timing
```

然后使用它：
```typescript
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'

new Elysia()
    .use(serverTiming())
    .get('/', () => 'hello')
    .listen(3000)
```

服务器计时将为每个生命周期函数附加 'Server-Timing' 头，记录持续时间、函数名称和详细信息。

要检查，请打开浏览器开发者工具 > 网络 > [通过 Elysia 服务器发出的请求] > 计时。

![开发者工具显示的服务器计时截图](/assets/server-timing.webp)

现在您可以轻松审计服务器的性能瓶颈。

## 配置
以下是插件接受的配置

### enabled
@default `NODE_ENV !== 'production'`

确定是否启用服务器计时

### allow
@default `undefined`

判断是否记录服务器计时的条件

### trace
@default `undefined`

允许服务器计时记录指定的生命周期事件：

Trace 接受以下对象：
- request：记录请求的持续时间
- parse：记录解析的持续时间
- transform：记录转换的持续时间
- beforeHandle：记录处理前的持续时间
- handle：记录处理的持续时间
- afterHandle：记录处理后的持续时间
- total：记录从开始到结束的总持续时间

## 模式
以下是使用插件的常见模式。

- [允许条件](#允许条件)

## 允许条件
您可以通过 `allow` 属性在特定路由上禁用服务器计时

```ts
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'

new Elysia()
    .use(
        serverTiming({
            allow: ({ request }) => {
                return new URL(request.url).pathname !== '/no-trace'
            }
        })
    )
```
