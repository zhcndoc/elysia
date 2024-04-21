---
title: On Request
head:
    - - meta
      - property: 'og:title'
        content: On Request - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 每收到一个新请求，就会执行第一个生命周期事件。由于 "onRequest" 旨在只提供最关键的上下文以减少开销，因此建议在以下情况下使用：缓存、速率限制器/IP/区域锁定、分析、提供自定义头信息，如 CORS。

    - - meta
      - property: 'og:description'
        content: 每收到一个新请求，就会执行第一个生命周期事件。由于 "onRequest" 旨在只提供最关键的上下文以减少开销，因此建议在以下情况下使用：缓存、速率限制器/IP/区域锁定、分析、提供自定义头信息，如 CORS。

---

# Request

每个新请求接收到的第一个生命周期事件。

由于 `onRequest` 的设计目的是提供最关键的上下文以减少开销，建议在以下场景中使用：

- 缓存
- 速率限制器 / IP / 区域锁定
- 分析
- 提供自定义标头，例如 CORS

## 示例

以下是一个伪代码，用于对特定 IP 地址执行速率限制。
```typescript twoslash
import { Elysia } from 'elysia'

// ---cut-start---
const rateLimiter = new Elysia()
    .decorate({
        ip: '127.0.0.1' as string,
        rateLimiter: {
            check(ip: string) {
                return true as boolean
            }
        }
    })
// ---cut-end---
new Elysia()
    .use(rateLimiter)
    .onRequest(({ rateLimiter, ip, set }) => {
        if(rateLimiter.check(ip)) {
            set.status = 420
            return 'Enhance your calm'
        }
    })
    .get('/', () => 'hi')
    .listen(3000)
```

如果从 `onRequest` 返回了一个值，它将被用作响应，并跳过生命周期的其余部分。

## 前置上下文

上下文的 `onRequest` 的类型为 `PreContext`，它是 `Context` 的一个最简表示，具有以下属性：

- request: `Request`
- set: `Set`
- store
- decorators

上下文不提供 `derived` 值，因为派生是基于 `onTransform` 事件。
