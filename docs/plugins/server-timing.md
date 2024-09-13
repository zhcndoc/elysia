---
title: Server Timing Plugin
head:
    - - meta
      - property: 'og:title'
        content: Server Timing Plugin - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 通过 Server Timing API 对 Elysia 进行性能审计的插件。通过 "bun add @elysiajs/server-timing" 安装插件。

    - - meta
      - name: 'og:description'
        content: 通过 Server Timing API 对 Elysia 进行性能审计的插件。通过 "bun add @elysiajs/server-timing" 安装插件。
---

# Server Timing 插件
该插件为 Server Timing API 增加了性能审计支持

安装方式：
```bash
bun add @elysiajs/server-timing
```

然后使用：
```typescript
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'

new Elysia()
    .use(serverTiming())
    .get('/', () => 'hello')
    .listen(3000)
```

Server Timing 将为每个生命周期函数附加 ‘Server-Timing’ 头部，其中包含日志持续时间、函数名称和细节。

要检查，请打开浏览器开发者工具 > Network > [通过 Elysia 服务器发出的请求] > Timing。

![显示 Server Timing 的开发者工具截图](/assets/server-timing.webp)

现在，你可以轻松审计服务器的性能瓶颈。

## 配置
以下是插件接受的配置项

### enabled
@default `NODE_ENV !== 'production'`

确定是否启用 Server Timing

### allow
@default `undefined`

确定是否记录 server timing 的条件

### trace
@default `undefined`

允许 Server Timing 记录指定的生命周期事件：

trace 参数接受以下对象：
- request：捕捉请求的持续时间
- parse：捕捉解析的持续时间
- transform：捕捉转换的持续时间
- beforeHandle：捕捉处理之前的持续时间
- handle：捕捉处理的持续时间
- afterHandle：捕捉处理之后的持续时间
- total：捕捉从开始到结束的总持续时间

## 模式
下面是常见的使用该插件的模式。

- [允许条件](#allow-condition)

## 允许条件
你可以通过 `allow` 属性在特定路由上禁用 Server Timing。

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