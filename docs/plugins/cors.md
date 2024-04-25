---
title: CORS Plugin
head:
  - - meta
    - property: 'og:title'
      content: CORS Plugin - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: Elysia 的插件，增加了对自定义跨域资源共享行为的支持。首先通过 bun add @elysiajs/cors 安装插件。

  - - meta
    - name: 'og:description'
      content: Elysia 的插件，增加了对自定义跨域资源共享行为的支持。首先通过 bun add @elysiajs/cors 安装插件。
---

# CORS Plugin
该插件为 Elysia 提供了自定义跨源资源共享行为的支持。

安装方式：
```bash
bun add @elysiajs/cors
```

然后使用它：
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

new Elysia()
    .use(cors())
    .listen(3000)
```

这将使 Elysia 接受来自任意源的请求。

## Config
以下是该插件接受的配置项。

### origin
@default `true`

表示是否可以与给定源代码共享响应。

取值可以是以下之一：
- **string** - 直接指定为 [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 头部的源名称。
- **boolean** - 如果设置为 true，则 [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 将设置为 `*` (任意源)。
- **RegExp** - 匹配请求 URL 的模式，如果匹配则允许。
- **Function** - 自定义逻辑来允许资源共享，如果返回 `true` 则允许。
    - 期望的类型为：
    ```typescript
    cors(context: Context) => boolean | void
    ```
- **Array<string | RegExp | Function>** - 按顺序迭代上述所有情况，如果任何值为 `true` 则允许。

---
### methods
@default `*`

允许跨源请求的方法。

分配 [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) 头部。

取值可以是以下之一：
- **undefined | null | ‘’** - 忽略所有方法。
- **\*** - 允许所有方法。
- **string** - 期望单个方法或逗号分隔的字符串
    - (例如：`'GET, PUT, POST'`)
- **string []** - 允许多个 HTTP 方法。
    - 例如：`['GET', 'PUT', 'POST']`

---
### allowedHeaders
@default `*`

允许传入请求的标头。

分配 [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) 头部。

取值可以是以下之一：
- **string** - 期望单个标头或逗号分隔的字符串
    - 例如：`'Content-Type, Authorization'`。
- **string []** - 允许多个 HTTP 标头。
    - 例如：`['Content-Type', 'Authorization']`

---
### exposedHeaders
@default `*`

响应中公开指定标头的 CORS。

分配 [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) 头部。

取值可以是以下之一：
- **string** - 期望单个标头或逗号分隔的字符串。
    - 例如：`'Content-Type, X-Powered-By'`。
- **string []** - 允许多个 HTTP 标头。
    - 例如：`['Content-Type', 'X-Powered-By']`

---
### credentials
@default `true`

Access-Control-Allow-Credentials 响应头告诉浏览器在请求的凭据模式 [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) 为 `include` 时是否将响应暴露给前端 JavaScript 代码。

当请求的凭据模式 [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) 为 `include` 时，只有当 Access-Control-Allow-Credentials 的值为 true 时，浏览器才会将响应暴露给前端 JavaScript 代码。

凭证可以是 cookie、授权标头或 TLS 客户端证书。

分配 [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) 头部。

---
### maxAge
@default `5`

表示预检请求 (即 [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)) 的结果 (即 [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) 和 [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) 标头中包含的信息) 可以缓存多长时间。

分配 [Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age) 头部。

---
### preflight
预检请求是发送的请求，用于检查是否理解 CORS 协议以及服务器是否知道使用特定方法和标头。

使用 **OPTIONS** 请求进行响应时需要 3 个 HTTP 请求头：
- **Access-Control-Request-Method**
- **Access-Control-Request-Headers**
- **Origin**

该配置指示服务器是否应响应预检请求。

---
## Pattern
下面是使用该插件的常见模式。

## 允许特定顶级域名的 CORS

```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(cors({
        origin: /.*\.saltyaom\.com$/
    }))
    .get('/', () => 'Hi')
    .listen(3000)
```

这将允许来自以 `saltyaom.com` 结尾的顶级域名的请求。