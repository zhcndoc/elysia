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
接受字符串形式的 URL 终端或字面量 Elysia 实例。

Eden 会根据类型更改行为，具体如下：

### URL 终端（字符串）
如果传递了 URL 终端，Eden Treaty 将使用 `fetch` 或 `config.fetcher` 创建到 Elysia 实例的网络请求。

```typescript
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const api = treaty<App>('localhost:3000')
```

您可以指定或不指定 URL 终端的协议。

Elysia 会自动追加端点，规则如下：
1. 如果指定了协议，则直接使用 URL
2. 如果 URL 是 localhost 且环境不是生产，则使用 http
3. 否则，使用 https

这同样适用于 WebSocket，用于确定使用 **ws://** 或 **wss://**。

---

### Elysia 实例
如果传递了 Elysia 实例，Eden Treaty 会创建一个 `Request` 类并直接传递给 `Elysia.handle`，而无需创建网络请求。

这允许我们直接与 Elysia 服务器交互，无需请求开销，也无需启动服务器。

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hi', 'Hi Elysia')
    .listen(3000)

const api = treaty(app)
```

如果传入实例，则无需泛型，因为 Eden Treaty 可以直接从参数中推断类型。

推荐此模式用于执行单元测试，或创建类型安全的反向代理服务器或微服务。

## 选项
Eden Treaty 的第二个可选参数用来定制 fetch 行为，接受如下参数：
- [fetch](#fetch) - 添加 fetch 初始化的默认参数（RequestInit）
- [fetcher](#fetcher) - 自定义 fetch 函数（例如 Axios、unfetch）
- [headers](#headers) - 定义默认请求头
- [onRequest](#onrequest) - 拦截并修改 fetch 请求，发送前调用
- [onResponse](#onresponse) - 拦截并修改 fetch 响应
- [parseDate](#parsedate) - 自动将日期字符串解析为 Date 对象
- [throwHttpError](#throwhttperror) - 当响应状态非 ok (2xx) 时自动抛出错误

## Fetch
默认参数附加到 fetch 的第二个参数，拓展了 **Fetch.RequestInit** 的类型。

```typescript
export type App = typeof app // [!code ++]
import { treaty } from '@elysiajs/eden'

treaty<App>('localhost:3000', {
    fetch: {
        credentials: 'include'
    }
})
```

所有传递给 fetch 的参数都会传给 fetcher，等同于：
```typescript
fetch('http://localhost:3000', {
    credentials: 'include'
})
```

## Fetcher
提供自定义 fetcher 函数，而非使用环境默认 fetch。

```typescript
treaty<App>('localhost:3000', {
    fetcher(url, options) {
        return fetch(url, options)
    }
})
```

推荐如果想使用除 fetch 以外的客户端，如 Axios、unfetch，替换 fetch。

## Headers
提供附加的默认请求头，这是 `options.fetch.headers` 的简写。

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

所有传递给 fetch 的参数都会传给 fetcher，等同于：
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

### Headers 对象
如果传入对象，则直接传给 fetch

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

### 函数
您可以将 headers 指定为函数，根据条件返回自定义头部

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

您可以返回一个对象，将其值追加到 fetch 头部。

headers 函数接受 2 个参数：
- path `string` - 将传入的路径
  - 注意：主机名会**被排除**，例如（/user/griseo）
- options `RequestInit`: 传递给 fetch 的第二个参数

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

Eden Treaty 会**运行所有函数**，即使已有返回值。

## 头部优先级
Eden Treaty 会优先考虑头部的顺序，如果存在重复，优先级如下：
1. 内联方法 - 直接传递给调用的函数参数
2. headers - 传递给 `config.headers`
  - 如果 `config.headers` 是数组，则后面的参数优先级更高
3. fetch - 传递给 `config.fetch.headers`

例如：
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

这将产生以下结果：
```typescript
fetch('http://localhost:3000', {
    headers: {
        authorization: 'Bearer Griseo'
    }
})
```

如果内联函数未指定 headers，则结果为 "**Bearer Aponia**"。

## OnRequest
拦截并在发送前修改 fetch 请求。

您可以返回一个对象，将值追加到 **RequestInit**。

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

如果有返回值，Eden Treaty 将对返回值与 `value.headers` 做**浅合并**。

**onRequest** 接受 2 个参数：
- path `string` - 传入的请求路径
  - 注意：主机名将**被排除**，例如（/user/griseo）
- options `RequestInit`：通过 fetch 的第二个参数传递的参数

### 数组
如果需要多个条件，您可以将 onRequest 函数定义为数组。

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

Eden Treaty 会**运行所有函数**，即使已有返回值。

## onResponse
拦截并修改 fetch 响应，或返回新的值。

```typescript
treaty<App>('localhost:3000', {
    onResponse(response) {
        if(response.ok)
            return response.json()
    }
})
```

**onResponse** 接受 1 个参数：
- response `Response` - 通常是从 `fetch` 返回的 Web 标准响应

### 数组
如果需要多个条件，您可以将 onResponse 函数定义为数组。

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
与 [headers](#headers) 和 [onRequest](#onrequest) 不同，Eden Treaty 会循环执行函数直到找到返回值或抛出错误，返回值会被作为新的响应使用。

## parseDate

- 默认: `true`

自动将日期字符串解析为 Date 对象。

```typescript
treaty<App>('localhost:3000', {
	parseDate: true
})
```

## throwHttpError

- 默认: `false`

如果响应状态非 ok (2xx)，自动抛出错误。

```typescript
treaty<App>('localhost:3000', {
	throwHttpError: true
})
```

默认情况下，Eden 不会抛出错误，而是返回 `{ error }`，当响应状态非 ok (2xx)。

您也可以指定自定义错误处理，如下：
```typescript
treaty<App>('localhost:3000', {
	throwHttpError: (response) => {
		return response.status === 418
	}
})
```

如果 `throwHttpError` 返回 `true`，Eden 会抛出错误，否则返回 `{ error }`。
