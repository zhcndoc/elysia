---
title: Eden Treaty 配置
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty 配置 - Elysia 中文文档

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的对象化表示，提供了端到端的类型安全性和显著提高的开发者体验。使用 Eden，我们可以在不生成代码的情况下，完全类型安全地从 Elysia 服务器获取 API。

    - - meta
      - name: 'og:description'
        content: Eden Treaty 是 Elysia 服务器的对象化表示，提供了端到端的类型安全性和显著提高的开发者体验。使用 Eden，我们可以在不生成代码的情况下，完全类型安全地从 Elysia 服务器获取 API。
---

# 配置

Eden Treaty 接受两个参数：

- **urlOrInstance** - URL 端点或 Elysia 实例
- **options** (可选)- 自定义 fetch 行为

## urlOrInstance

可以接受 URL 端点字符串或直接量 Elysia 实例。

根据类型，Eden 将改变行为如下：

### URL 端点 (字符串)

如果传递了 URL 端点，Eden Treaty 将使用 `fetch` 或 `config.fetcher` 创建到 Elysia 实例的网络请求。

```typescript
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const api = treaty<App>('localhost:3000')
```

你可以指定 URL 端点的协议，也可以不指定。

Elysia 会自动附加端点，规则如下：

1. 如果指定了协议，则直接使用该 URL
2. 如果 URL 是 localhost，并且环境不是生产环境，则使用 http
3. 否则使用 https

对于 Web Socket 也适用于确定 **ws://** 或 **wss://**。

---

### Elysia 实例

如果传递了 Elysia 实例，Eden Treaty 将创建一个 `Request` 类并直接传递给 `Elysia.handle`，而不创建网络请求。

这使我们可以直接与 Elysia 服务器进行交互，无需请求开销或启动服务器的需求。

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hi', 'Hi Elysia')
    .listen(3000)

const api = treaty(app)
```

如果传递了实例，则不需要传递泛型，因为 Eden Treaty 可以直接从参数中推断出类型。

这种模式适用于执行单元测试，或创建类型安全的反向代理服务器或微服务。

## Options

Eden Treaty 的第二个可选参数，用于自定义 fetch 行为，接受以下参数：
- [fetch](#fetch) - 向 fetch 初始化 (RequestInit) 添加默认参数
- [headers](#headers) - 定义默认头部
- [fetcher](#fetcher) - 自定义 fetch 函数，例如 Axios、unfetch
- [onRequest](#on-request) - 拦截和修改发送请求之前的 fetch 请求
- [onResponse](#on-response) - 拦截和修改 fetch 的响应

## Fetch

将默认参数附加到 fetch 的第二个参数，扩展了 **Fetch.RequestInit** 的类型。

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

将传递给 fetch 的所有参数都将传递给 fetcher，相当于：
```typescript
fetch('http://localhost:3000', {
    credentials: 'include'
})
```

## Headers

为 fetch 提供额外的默认头部，是 `options.fetch.headers` 的简写形式。

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

将传递给 fetch 的所有参数都将传递给 fetcher，相当于：

```typescript twoslash
fetch('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

headers 可以接受以下参数：

- 对象
- 函数

### Headers 对象

如果传递了对象，则会直接传递给 fetch

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

### 函数

你可以将头部指定为函数，根据条件返回自定义头部

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

你可以返回对象以将其值附加到 fetch 头部。

headers 函数接受两个参数：
- path `string` - 将发送到参数的路径
  - 注意：主机名将被**排除**，例如 (/user/griseo)
- options `RequestInit`：传递给 fetch 的第二个参数的参数

### 数组

如果需要多个条件，则可以将 headers 函数定义为数组。

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

如果存在多个函数，则 Eden Treaty 将**运行所有函数**，即使值已经返回。

## Headers 优先级

如果存在重复的头部，Eden Treaty 将按照以下顺序优先考虑头部：

1. 内联方法 - 直接在方法函数中传递
2. headers - 传递给 `config.headers`
  - 如果 `config.headers` 是数组，则后面的参数将优先考虑
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

如果内联函数没有指定头部，则结果将为 “**Bearer Aponia**”。

## Fetcher

提供自定义的 fetcher 函数，而不是使用环境的默认 fetch。

```typescript
treaty<App>('localhost:3000', {
    fetcher(url, options) {
        return fetch(url, options)
    }
})
```

如果要使用除 fetch 之外的其他客户端 (例如 Axios、unfetch)，建议替换 fetch。

## OnRequest

拦截和修改发送请求之前的 fetch 请求。

你可以返回对象以将值附加到 **RequestInit**。

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

如果返回了值，Eden Treaty 将对返回的值和 `value.headers` 执行**浅合并**。

**onRequest** 接受两个参数：
- path `string` - 将发送到参数的路径
  - 注意：主机名将被**排除**，例如 (/user/griseo)
- options `RequestInit`：传递给 fetch 的第二个参数的参数

### 数组

如果需要多个条件，则可以将 onRequest 函数定义为数组。

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

与 [headers](#headers) 和 [onRequest](#on-request) 不同，Eden Treaty 将循环遍历函数，直到找到返回值或抛出错误，返回值将用作新的响应。

## onResponse

拦截和修改 fetch 的响应，或返回新值。

```typescript
treaty<App>('localhost:3000', {
    onResponse(response) {
        if(response.ok)
            return response.json()
    }
})
```

**onRequest** 接受一个参数：

- response `Response` - 通常从 `fetch` 返回的 Web 标准响应

### 数组

如果需要多个条件，则可以将 onResponse 函数定义为数组。

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

与 [headers](#headers) 和 [onRequest](#on-request) 不同，Eden Treaty 将循环遍历函数，直到找到返回值或抛出错误，返回值将用作新的响应。
