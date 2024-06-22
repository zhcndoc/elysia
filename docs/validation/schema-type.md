---
title: Schema 类型
head:
    - - meta
      - property: 'title'
        content: Schema 类型 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Elysia 支持以下类型的声明式架构。Body 用于验证传入的 HTTP 消息。Query 用于查询字符串或 URL 参数。Params 用于路径参数。Header 用于请求头。Cookie 用于 cookies。Response 用于验证响应。

    - - meta
      - name: 'og:description'
        content: Elysia 支持以下类型的声明式架构。Body 用于验证传入的 HTTP 消息。Query 用于查询字符串或 URL 参数。Params 用于路径参数。Header 用于请求头。Cookie 用于 cookies。Response 用于验证响应。
---

<script setup>
    import Card from '../../components/nearl/card.vue'
    import Deck from '../../components/nearl/card-deck.vue'

    import Playground from '../../components/nearl/playground.vue'
    import { Elysia, t, ValidationError } from 'elysia'

    const demo1 = new Elysia()
        .get('/id/1', '1')
        .get('/id/a', () => {
            throw new ValidationError(
                'params',
                t.Object({
                    id: t.Numeric()
                }),
                {
                    id: 'a'
                }
            )
        })
</script>

# Schema 类型

Elysia 支持以下类型的声明式模式：

<Deck>
    <Card title="Body" href="#body">
        验证传入的 HTTP 消息
    </Card>
    <Card title="Query" href="#query">
        查询字符串或 URL 参数
    </Card>
    <Card title="Params" href="#query">
        路径参数
    </Card>
    <Card title="Header" href="#header">
        请求的标头
    </Card>
    <Card title="Cookie" href="#cookie">
        请求的 Cookie
    </Card>
    <Card title="Response" href="#response">
        请求的响应
    </Card>
</Deck>

---

这些属性应作为路由处理程序的第三个参数提供，以验证传入请求。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', () => 'Hello World!', {
        query: t.Object({
            name: t.String()
        }),
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

<Playground :elysia="demo1" />

响应应该如下：

| URL | Query | Params |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

如果提供了模式，将自动从模式中推断出类型，并生成 OpenAPI 类型供生成 Swagger 文档，从而省去了手动提供类型的多余工作。

## Body

验证传入的 [HTTP 消息](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) (或 `body`)。

这些信息是供 Web 服务器处理的附加信息。

提供的 `body` 与 `fetch` API 中的 `body` 相同。应根据定义的 body 设置相应的内容类型。

```typescript twoslash
fetch('https://elysiajs.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Elysia'
    })
})
```

### 示例

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)
```

验证方法如下：

| Body | Validation |
| --- | --------- |
| \{ name: 'Elysia' \} | ✅ |
| \{ name: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

根据 HTTP/1.1 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3) 的规定，Elysia 默认禁用了 **GET** 和 **HEAD** 消息的正文解析器。

> 如果请求方法不包含实体正文的定义语义，那么在处理请求时就应该忽略消息正文。

对于 **GET** 和 **HEAD** 方法，大多数浏览器默认情况下都会禁用主体附件。

## Query

查询字符串是 URL 中以 `?` 开头的部分，可包含一个或多个查询参数，这些参数是键值对，用于向服务器传递附加信息，通常用于过滤或搜索等自定义行为。

![URL Object](/essential/url-object.svg)

在 Fetch API 中的 `?` 后面提供查询。

```typescript twoslash
fetch('https://elysiajs.com/?name=Elysia')
```

在指定查询参数时，必须了解所有查询参数值都必须用字符串表示。这是因为它们是如何编码并附加到 URL 中的。

### 示例

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ query }) => query, {
        query: t.Object({
            name: t.String(),
            alias: t.Optional(t.String())
        })
    })
    .listen(3000)
```

验证方法如下：

| Body | Validation |
| --- | --------- |
| \{ name: 'Elysia' \} | ✅ |
| \{ name: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

## Params

详细解释请参阅[路径](/essential/path)，但可以概括如下。

动态路径是对 URL 段特定部分的模式匹配，其中可能存储了重要信息，供以后使用。

Elysia 使用带冒号 `:` 的段前缀

![Path Parameters](/essential/path-parameter.webp)

例如，`/id/:id` 会告诉 Elysia 匹配 `/id` 之前的任何路径，然后将下一段作为 `params` 对象。

**params** 用于验证路径参数对象。

**通常不需要这个字段，因为 Elysia 可以自动从路径参数中推断出类型**，除非需要特定的值模式，例如数值或模板字面模式。

```typescript twoslash
fetch('https://elysiajs.com/id/1')
```

### 示例

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params }) => params, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

<Playground :elysia="demo1" />

验证方法如下：

| URL | Validation |
| --- | --------- |
| /id/1 | ✅ |
| /id/a | ❌ |

## Header

HTTP 头信息可让客户端和服务器通过 HTTP 请求或响应传递附加信息，通常被视为元数据。

该字段通常用于执行某些特定的头字段，例如 `Authorization`。

在 `fetch` API 中，头信息的提供与 `body` 相同。


```typescript twoslash
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia 将仅以小写键解析 Header。

在使用标题验证时，请确保使用小写字段名称。
:::

### 示例

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ query }) => query, {
        headers: t.Object({
            authorization: t.String()
        })
    })
    .listen(3000)
```

验证方法如下：

| URL | Validation |
| --- | --------- |
| \{ authorization: 'Bearer 12345' \} | ✅ |
| \{ X-Request-Id: '1' \} | ❌ |

## Cookie

HTTP cookie 是服务器发送给客户端的一小段数据，它是每次访问同一网络服务器时都会发送的数据，以便服务器记住客户端的信息。

简单地说，就是每次请求都会发送的字符串化状态。

该字段通常用于执行某些特定的 cookie 字段。

Cookie 是一种特殊的标头字段，Fetch API 不接受自定义值，而是由浏览器管理。要发送 cookie，必须使用 `credentials` 字段：

```typescript twoslash
fetch('https://elysiajs.com/', {
    credentials: 'include'
})
```

### 示例

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie }) => cookie.session.value, {
        cookie: t.Cookie({
            session: t.String()
        })
    })
```

## Response

验证处理程序的返回值。

除非需要强制执行返回类型的特定值或用于文档目的，否则通常不会使用此字段。

如果提供，默认情况下，Elysia 将尝试使用 TypeScript 强制类型，为你的集成开发环境提供类型提示。

### 示例

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', () => 'hello world', {
        response: t.String()
    })
```

Response 可以接受一个以 HTTP 状态为关键字的对象，以便在特定状态下强制执行响应类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', () => 'hello world', {
        response: {
            200: t.String(),
            400: t.Number()
        }
    })
```

验证方法如下：

| Response | Status | Validation |
| --- | --- | --------- |
| 'hello' | 200 | ✅ |
| 1 | 200 | ❌ |
| 'hello' | 400 | ❌ |
| 1 | 400 | ✅ |
| `false` | 200 | ❌ |
| `false` | 400 | ❌ |

## Constructor
You can use the Elysia constructor to set the behavior for unknown fields on outgoing and incoming bodies via the `normalize` option. By default, elysia will raise an error in case a request or response contains fields which are not explicitly allowed in the schema of the respective handler.
You can change this by setting `normalize` to true when constructing your elysia instance.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
    normalize: true
})
```
