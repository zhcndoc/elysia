---
title: CORS 插件 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: CORS 插件 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 的插件，添加对自定义跨域资源共享行为的支持。使用 "bun add @elysiajs/cors" 安装插件开始。

  - - meta
    - name: 'og:description'
      content: Elysia 的插件，添加对自定义跨域资源共享行为的支持。使用 "bun add @elysiajs/cors" 安装插件开始。
---

# CORS 插件
此插件添加对自定义 [跨域资源共享](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 行为的支持。

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

这将设置 Elysia 接受来自任何来源的请求。

## 配置
以下是插件接受的配置

### origin
@默认 `true`

指示响应是否可以与来自给定来源的请求代码共享。

值可以是以下之一：
- **string** - 来源的名称，将直接分配给 [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 头。
- **boolean** - 如果设置为 true， [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 将被设置为 `*`（任何来源）
- **RegExp** - 匹配请求 URL 的模式，如果匹配则允许。
- **Function** - 自定义逻辑以允许资源共享，如果返回 true，则允许。
    - 预期类型为：
    ```typescript
    cors(context: Context) => boolean | void
    ```
- **Array<string | RegExp | Function>** - 按顺序迭代上述所有情况，如果有任一值为 `true` 则允许。

---
### methods
@默认 `*`

允许的跨域请求方法。

分配给 [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) 头。

值可以是以下之一：
- **undefined | null | ''** - 忽略所有方法。
- **\*** - 允许所有方法。
- **string** - 期望为单个方法或以逗号分隔的字符串 
    - (例如：`'GET, PUT, POST'`)
- **string[]** - 允许多个 HTTP 方法。
    - 例如：`['GET', 'PUT', 'POST']`

---
### allowedHeaders
@默认 `*`

允许的传入请求头。

分配给 [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) 头。

值可以是以下之一：
- **string** - 期望为单个头或以逗号分隔的字符串
    - 例如：`'Content-Type, Authorization'`。
- **string[]** - 允许多个 HTTP 头。
    - 例如：`['Content-Type', 'Authorization']`

---
### exposeHeaders
@默认 `*`

通过指定头部响应 CORS。

分配给 [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) 头。

值可以是以下之一：
- **string** - 期望为单个头或以逗号分隔的字符串。
    - 例如：`'Content-Type, X-Powered-By'`。
- **string[]** - 允许多个 HTTP 头。
    - 例如：`['Content-Type', 'X-Powered-By']`

---
### credentials
@默认 `true`

Access-Control-Allow-Credentials 响应头告诉浏览器当请求的凭证模式 [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) 为 `include` 时，是否将响应暴露给前端 JavaScript 代码。

当请求的凭证模式 [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) 为 `include` 时，只有当 Access-Control-Allow-Credentials 的值为 true 时，浏览器才会将响应暴露给前端 JavaScript 代码。

凭证包括 Cookie、授权头或 TLS 客户端证书。

分配给 [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) 头。

---
### maxAge
@默认 `5`

指示 [预检请求](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) 的结果（即 [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) 和 [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) 头中包含的信息）可以被缓存多久。

分配给 [Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age) 头。

---
### preflight
预检请求是发送请求以检查 CORS 协议是否被理解，并且服务器是否知晓如何使用特定方法和头。

响应 **OPTIONS** 请求时包含 3 个 HTTP 请求头：
- **Access-Control-Request-Method**
- **Access-Control-Request-Headers**
- **Origin**

此配置指示服务器是否应响应预检请求。

## 使用模式
以下是使用此插件的常见模式。

## 允许通过顶级域名的 CORS

```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(cors({
        origin: /.*\.saltyaom\.com$/
    }))
    .get('/', () => '嗨')
    .listen(3000)
```

这将允许来自顶级域名为 `saltyaom.com` 的请求。
