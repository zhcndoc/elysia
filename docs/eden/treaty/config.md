---
title: Eden Treaty 配置 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 配置 - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是对 Elysia 服务器的类对象表示，提供端到端的类型安全，显著改善开发者体验。通过 Eden，我们可以从 Elysia 服务器获取完全类型安全的 API，而无需代码生成。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是对 Elysia 服务器的类对象表示，提供端到端的类型安全，显著改善开发者体验。通过 Eden，我们可以从 Elysia 服务器获取完全类型安全的 API，而无需代码生成。
---

# 配置
Eden Treaty 接受 2 个参数：
- **urlOrInstance** - URL 终端或 Elysia 实例
- **options**（可选） - 自定义获取行为

## urlOrInstance
接受 URL 终端作为字符串或字面量 Elysia 实例。

Eden 会根据类型改变行为如下：

### URL 终端 (字符串)
如果传入 URL 终端，Eden Treaty 将使用 `fetch` 或 `config.fetcher` 创建对 Elysia 实例的网络请求。

```typescript
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const api = treaty<App>('localhost:3000')
```

你可以选择是否为 URL 终端指定协议。

Elysia 将自动附加终端如下：
1. 如果指定了协议，直接使用该 URL
2. 如果 URL 是 localhost 并且 ENV 不是生产环境，使用 http
3. 否则使用 https

这同样适用于 Web Socket，以确定使用 **ws://** 还是 **wss://**。

---

### Elysia 实例
如果传入 Elysia 实例，Eden Treaty 将创建一个 `Request` 类，并直接传递到 `Elysia.handle`，而无需创建网络请求。

这使我们能够直接与 Elysia 服务器交互，而无需请求开销或启动服务器。

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hi', 'Hi Elysia')
    .listen(3000)

const api = treaty(app)
```

如果传入实例，则不需要传递泛型，因为 Eden Treaty 可以直接从参数中推断类型。

这种模式推荐用于执行单元测试，或创建类型安全的反向代理服务器或微服务。

## 选项
Eden Treaty 的第二个可选参数用于自定义获取行为，接受以下参数：
- [fetch](#fetch) - 添加默认参数到获取初始化（RequestInit）
- [headers](#headers) - 定义默认头部
- [fetcher](#fetcher) - 自定义获取函数，例如 Axios，unfetch
- [onRequest](#onrequest) - 在发送请求前拦截并修改获取请求
- [onResponse](#onresponse) - 在获取响应后拦截并修改响应

## 获取
默认参数附加到 fetch 的第二个参数，扩展类型为 **Fetch.RequestInit**。

```typescript
export type App = typeof app // [!code ++]
import { treaty } from '@elysiajs/eden'
// ---cut---
treaty<App>('localhost:3000', {
    fetch: {
        credentials: 'include'
    }
})
```

所有传递给 fetch 的参数，将作为等价传递给 fetcher：
```typescript
fetch('http://localhost:3000', {
    credentials: 'include'
})
```

## 头部
提供额外的默认头部到 fetch，为 `options.fetch.headers` 的简写。

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

所有传递给 fetch 的参数，将作为等价传递给 fetcher：
```typescript twoslash
fetch('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

头部可以接受以下参数：
- 对象
- 函数

### 头部对象
如果传入对象，则将直接传递到 fetch

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

### 函数
你可以将头部指定为函数，以根据条件返回自定义头部。

```typescript
treaty<App>('localhost:3000', {
    headers(path, options) {
        if(path.startsWith('user'))
            return {
                authorization: 'Bearer 12345'
            }
    }
})
```

你可以返回对象以将其值追加到 fetch 头部。

头部函数接受 2 个参数：
- path `string` - 将发送到参数的路径
  - 注意：主机名将被 **排除**，例如（/user/griseo）
- options `RequestInit`: 通过 fetch 的第二个参数传入的参数

### 数组
如果需要多个条件，您可以将 headers 函数定义为数组。

```typescript
treaty<App>('localhost:3000', {
    headers: [
      (path, options) => {
        if(path.startsWith('user'))
            return {
                authorization: 'Bearer 12345'
            }
        }
    ]
})
```

Eden Treaty 将 **运行所有函数**，即使值已经返回。

## 头部优先级
Eden Treaty 将优先考虑头部的顺序，如果重复如下：
1. 内联方法 - 直接传递的方法函数
2. headers - 传递给 `config.headers`
  - 如果 `config.headers` 是数组，则后来的参数将被优先考虑
3. fetch - 传递给 `config.fetch.headers`

例如，对于以下示例：
```typescript
const api = treaty<App>('localhost:3000', {
    headers: {
        authorization: 'Bearer Aponia'
    }
})

api.profile.get({
    headers: {
        authorization: 'Bearer Griseo'
    }
})
```

这将导致以下结果：
```typescript
fetch('http://localhost:3000', {
    headers: {
        authorization: 'Bearer Griseo'
    }
})
```

如果内联函数未指定头部，则结果将是 "**Bearer Aponia**"。

## Fetcher
提供一个自定义的获取函数，而不是使用环境的默认 fetch。

```typescript
treaty<App>('localhost:3000', {
    fetcher(url, options) {
        return fetch(url, options)
    }
})
```

如果你想使用其他客户端而不是 fetch，建议替换 fetch，例如 Axios，unfetch。

## OnRequest
在发送请求前拦截并修改获取请求。

你可以返回对象以将值追加到 **RequestInit**。

```typescript
treaty<App>('localhost:3000', {
    onRequest(path, options) {
        if(path.startsWith('user'))
            return {
                headers: {
                    authorization: 'Bearer 12345'
                }
            }
    }
})
```

如果返回了值，Eden Treaty 将对返回的值和 `value.headers` 进行 **浅合并**。

**onRequest** 接受 2 个参数：
- path `string` - 将发送到参数的路径
  - 注意：主机名将被 **排除**，例如（/user/griseo）
- options `RequestInit`: 通过 fetch 的第二个参数传入的参数

### 数组
如果需要多个条件，你可以将 onRequest 函数定义为数组。

```typescript
treaty<App>('localhost:3000', {
    onRequest: [
      (path, options) => {
        if(path.startsWith('user'))
            return {
                headers: {
                    authorization: 'Bearer 12345'
                }
            }
        }
    ]
})
```

Eden Treaty 将 **运行所有函数**，即使值已经返回。

## onResponse
拦截并修改 fetch 的响应或返回新值。

```typescript
treaty<App>('localhost:3000', {
    onResponse(response) {
        if(response.ok)
            return response.json()
    }
})
```

**onResponse** 接受 1 个参数：
- response `Response` - 通常从 `fetch` 返回的 Web 标准响应

### 数组
如果需要多个条件，你可以将 onResponse 函数定义为数组。

```typescript
treaty<App>('localhost:3000', {
    onResponse: [
        (response) => {
            if(response.ok)
                return response.json()
        }
    ]
})
```
与 [headers](#headers) 和 [onRequest](#onrequest) 不同，Eden Treaty 将循环执行函数，直到找到返回的值或抛出错误，返回的值将用作新响应。
