---
title: Parse
head:
    - - meta
      - property: 'og:title'
        content: Parse - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Parse 是 Express 中的 "body parser" 的等效功能。它用于解析请求体，返回值将被附加到 `Context.body`，如果没有，Elysia 将继续迭代通过 `onParse` 分配的其他解析器函数，直到分配了请求体或执行了所有解析器函数。

    - - meta
      - property: 'og:description'
        content: Parse 是 Express 中的 "body parser" 的等效功能。它用于解析请求体，返回值将被附加到 `Context.body`，如果没有，Elysia 将继续迭代通过 `onParse` 分配的其他解析器函数，直到分配了请求体或执行了所有解析器函数。
---

# Parse

Parse 是 Express 中的 **body parser** 的等效功能。

它用于解析请求体，返回值将被附加到 `Context.body`，如果没有，Elysia 将继续迭代通过 `onParse` 分配的其他解析器函数，直到分配了请求体或执行了所有解析器函数。

默认情况下，Elysia 会解析以下内容类型的请求体：

- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

建议使用 `onParse` 事件来提供自定义的 body parser，Elysia 不提供此功能。

## 示例

以下是一个根据自定义头部检索值的示例代码。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request }, contentType) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

返回的值将被分配给 Context.body。如果没有，Elysia 将继续迭代通过 **onParse** 栈分配的其他解析器函数，直到分配了请求体或执行了所有解析器函数。

## Context

`onParse` 上下文继承自 `Context`，具有以下附加属性：

- contentType：请求的 Content-Type 头部

所有的上下文都基于普通上下文，并且可以像在路由处理程序中使用普通上下文一样使用。

## 显式请求体

默认情况下，Elysia 会提前尝试确定请求体解析函数，并选择最合适的函数以加快处理速度。

Elysia 可以通过读取 `body` 来确定请求体函数。

看下面的示例：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

Elysia 读取了请求体的模式，并发现它完全是一个对象，因此很可能是 JSON 请求体。Elysia 预先选择了 JSON 请求体解析函数并尝试解析请求体。

以下是 Elysia 用于选择请求体解析类型的标准：

- `application/json`：请求体类型为 `t.Object`
- `multipart/form-data`：请求体类型为 `t.Object`，且为 1 级深度且包含 `t.File`
- `application/x-www-form-urlencoded`：请求体类型为 `t.URLEncoded`
- `text/plain`：其他原始类型

这使得 Elysia 可以提前优化请求体解析器，减少编译时间开销。

## 显式内容类型

然而，在某些情况下，如果 Elysia 无法选择正确的请求体解析函数，我们可以明确告诉 Elysia 使用特定的函数，通过指定 `type`。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        // application/json 的简写形式
        type: 'json',
    })
```

这样可以控制 Elysia 在复杂场景中选择适合我们需求的请求体解析函数的行为。

`type` 可以是以下之一：

```typescript
type ContentType = |
    // 'text/plain' 的简写形式
    | 'text'
    // 'application/json' 的简写形式
    | 'json'
    // 'multipart/form-data' 的简写形式
    | 'formdata'
    // 'application/x-www-form-urlencoded' 的简写形式
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```
