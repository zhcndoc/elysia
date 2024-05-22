---
title: After Handle
head:
    - - meta
      - property: 'og:title'
        content: After Handle - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 在主处理程序之后执行，用于将 “before handle” 和 “route handler” 的返回值映射为适当的响应。建议在以下情况下使用 After Handle：将请求转换为新值，例如压缩，事件流；根据响应值添加自定义标头，例如 Content-Type。

    - - meta
      - property: 'og:description'
        content: 在主处理程序之后执行，用于将 “before handle” 和 “route handler” 的返回值映射为适当的响应。建议在以下情况下使用 After Handle：将请求转换为新值，例如压缩，事件流；根据响应值添加自定义标头，例如 Content-Type。
---

# After Handle

在主处理程序之后执行，用于将 “before handle” 和 “route handler” 的返回值映射为适当的响应。

建议在以下情况下使用 After Handle：

-   将请求转换为新值，例如压缩，事件流
-   根据响应值添加自定义标头，例如 Content-Type

## 示例

以下是使用 after handle 将 HTML 内容类型添加到响应标头的示例。

```typescript twoslash
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['content-type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

响应应该如下所示：

| Path | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## 返回值

如果返回一个值，After Handle 将使用该返回值作为新的响应值，除非该值为 **undefined**。

上面的示例可以重写如下：

```typescript twoslash
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response)) {
                set.headers['content-type'] = 'text/html; charset=utf8'
                return new Response(response)
            }
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

与 **beforeHandle** 不同，在从 **afterHandle** 返回值之后，**afterHandle** 的迭代**不会**被跳过。

## 上下文

`onAfterHandle` 上下文扩展自 `Context`，具有以下额外属性：

- response：要返回给客户端的响应

所有上下文都基于普通上下文，并且可以像在路由处理程序中使用普通上下文一样使用。
