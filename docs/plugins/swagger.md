---
title: Swagger 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的插件，添加对生成 Elysia 服务器的 Swagger API 文档的支持。首先使用 "bun add @elysiajs/swagger" 安装插件。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，添加对生成 Elysia 服务器的 Swagger API 文档的支持。首先使用 "bun add @elysiajs/swagger" 安装插件。
---

# Swagger 插件

该插件为 Elysia 服务器生成 Swagger 端点

安装方式：

```bash
bun add @elysiajs/swagger
```

然后使用它：

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/', () => 'hi')
    .post('/hello', () => 'world')
    .listen(3000)
```

访问 `/swagger` 将显示一个包含 Elysia 服务器生成的端点文档的 Scalar UI。您还可以通过 `/swagger/json` 访问原始的 OpenAPI 规范。

## 配置

以下是插件接受的配置

### provider

@default `scalar`

文档的 UI 提供者。默认为 Scalar。

### scalar

用于自定义 Scalar 的配置。

请参考 [Scalar 配置](https://github.com/scalar/scalar?tab=readme-ov-file#configuration)

### swagger

用于自定义 Swagger 的配置。

请参考 [Swagger 规范](https://swagger.io/specification/v2/)。

### excludeStaticFile

@default `true`

确定 Swagger 是否应排除静态文件。

### path

@default `/swagger`

暴露 Swagger 的端点

### exclude

要从 Swagger 文档中排除的路径。

值可以是以下之一：

-   **字符串**
-   **RegExp**
-   **Array<string | RegExp>**

## 模式

以下是使用插件的常见模式。

## 更改 Swagger 端点

您可以通过在插件配置中设置 [path](#path) 来更改 swagger 端点。

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(
        swagger({
            path: '/v2/swagger'
        })
    )
    .listen(3000)
```

## 自定义 Swagger 信息

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Elysia 文档',
                    version: '1.0.0'
                }
            }
        })
    )
    .listen(3000)
```

## 使用标签

Elysia 可以通过使用 Swagger 的标签系统将端点分组

首先在 swagger 配置对象中定义可用的标签

```typescript
app.use(
    swagger({
        documentation: {
            tags: [
                { name: 'App', description: '通用端点' },
                { name: 'Auth', description: '认证端点' }
            ]
        }
    })
)
```

然后使用端点配置部分的 details 属性将该端点分配到组

```typescript
app.get('/', () => 'Hello Elysia', {
    detail: {
        tags: ['App']
    }
})

app.group('/auth', (app) =>
    app.post(
        '/sign-up',
        async ({ body }) =>
            db.user.create({
                data: body,
                select: {
                    id: true,
                    username: true
                }
            }),
        {
            detail: {
                tags: ['Auth']
            }
        }
    )
)
```

这将生成一个如下的 swagger 页面
<img width="1446" alt="image" src="/assets/swagger-demo.webp">

## Security Configuration

To secure your API endpoints, you can define security schemes in the Swagger configuration. The example below demonstrates how to use Bearer Authentication (JWT) to protect your endpoints:

```typescript
app.use(
    swagger({
        documentation: {
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }
    })
)

export const addressController = new Elysia({
    prefix: '/address',
    detail: {
        tags: ['Address'],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})
```

This configuration ensures that all endpoints under the `/address` prefix require a valid JWT token for access.
