---
title: 创建文档
head:
  - - meta
    - property: 'og:title'
      content: 创建文档 - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: Elysia 默认提供一流的支持，并遵循 OpenAPI 模式。通过使用 Elysia Swagger 插件的一行代码，任何 Elysia 服务器都可以自动生成 Swagger 页面并作为文档提供。

  - - meta
    - property: 'og:description'
      content: Elysia 默认提供一流的支持，并遵循 OpenAPI 模式。通过使用 Elysia Swagger 插件的一行代码，任何 Elysia 服务器都可以自动生成 Swagger 页面并作为文档提供。
---

# 创建文档

Elysia 默认提供一流的支持，并遵循 OpenAPI 模式。

通过使用 Elysia Swagger 插件的一行代码，任何 Elysia 服务器都可以自动生成 Swagger 页面并作为文档提供。

要生成 wagger 页面，请安装插件：

```bash
bun add @elysiajs/swagger
```

并将插件注册到服务器：

```typescript twoslash
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
```

有关 Swagger 插件的更多信息，请参阅 [Swagger 插件页面](/plugins/swagger)。

## 路由定义

`schema` 用于自定义路由定义，它不仅会生成 OpenAPI 模式和 Swagge r定义，还提供类型验证、类型推断和自动完成。

然而，有时仅定义类型并不清楚路由的作用。你可以使用 `schema.detail` 字段明确定义路由的用途。

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .post('/sign-in', ({ body }) => body, {
        body: t.Object(
            {
                username: t.String(),
                password: t.String()
            },
            {
                description: 'Expected an username and password'
            }
        ),
        detail: {
            summary: 'Sign in the user',
            tags: ['authentication']
        }
    })
```

详细字段遵循 OpenAPI V3 定义，并具有默认的自动完成和类型安全性。

然后，详细信息将传递给 Swagger，以将描述放入 Swagger 路由中。
