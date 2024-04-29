---
title: Map Response
head:
    - - meta
      - property: 'og:title'
        content: Map Response - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 在 “afterHandle” 之后执行，旨在提供自定义响应映射。建议使用 transform 来进行以下操作。将值映射为 Web 标准响应。

    - - meta
      - name: 'og:description'
        content: 在 “afterHandle” 之后执行，旨在提供自定义响应映射。建议使用 transform 来进行以下操作。将值映射为 Web 标准响应。
---

# Map Response

在 **afterHandle** 之后执行，旨在提供自定义响应映射。

建议使用 transform 进行以下操作：

- 压缩
- 将值映射为 Web 标准响应

## 示例

以下是使用 mapResponse 提供响应压缩的示例。

```typescript twoslash
import { Elysia } from 'elysia'

const encoder = new TextEncoder()

new Elysia()
    .mapResponse(({ response, set }) => {
        const isJson = typeof response === 'object'

        const text = isJson
            ? JSON.stringify(response)
            : response?.toString() ?? ''

        set.headers['Content-Encoding'] = 'gzip'

        return new Response(
            Bun.gzipSync(encoder.encode(text)),
            {
                headers: {
                    'Content-Type': `${
                        isJson ? 'application/json' : 'text/plain'
                    }; charset=utf-8`
                }
            }
        )
    })
    .get('/text', () => 'mapResponse')
    .get('/json', () => ({ map: 'response' }))
    .listen(3000)
```

与 **parse** 和 **beforeHandle** 一样，在返回值之后，下一次 **mapResponse** 的迭代将被跳过。

Elysia 将自动处理来自 **mapResponse** 的 **set.headers** 的合并过程。我们不需要手动将 **set.headers** 附加到响应中。
