---
title: Swagger 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 添加支持生成 Swagger API 文档的插件。通过 "bun add @elysiajs/swagger" 来安装插件。

    - - meta
      - name: 'og:description'
        content: 为 Elysia 添加支持生成 Swagger API 文档的插件。通过 "bun add @elysiajs/swagger" 来安装插件。
---

# Swagger 插件

该插件为 Elysia 服务器生成 Swagger 端点。

安装方法：

```bash
bun add @elysiajs/swagger
```

然后使用它：

```typescript twoslash
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/', () => 'hi')
    .post('/hello', () => 'world')
    .listen(3000)
```

访问 `/swagger` 将会展示一个 Scalar UI，显示来自 Elysia 服务器的生成端点文档。您还可以在 `/swagger/json` 访问原始 OpenAPI 规格。

## 配置

以下是插件接受的配置

### provider

@default `scalar`

文档的 UI 提供者。默认值为 Scalar。

### scalar

自定义 Scalar 的配置。

请参考 [Scalar 配置](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)

### swagger

自定义 Swagger 的配置。

请参考 [Swagger 规范](https://swagger.io/specification/v2/)。

### excludeStaticFile

@default `true`

确定 Swagger 是否应该排除静态文件。

### path

@default `/swagger`

暴露 Swagger 的端点。

### exclude

要从 Swagger 文档中排除的路径。

值可以是以下之一：

-   **字符串**
-   **RegExp**
-   **Array<string | RegExp>**

## 模式

以下是使用该插件的常见模式。

## 更改 Swagger 端点

您可以通过在插件配置中设置 [path](#path) 来更改 swagger 端点。

```typescript twoslash
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

```typescript twoslash
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

Elysia 可以通过使用 Swagger 的标签系统将端点分组。

首先在Swagger配置对象中定义可用的标签

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

然后使用端点配置部分的 details 属性将该端点分配到组中

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

这将生成类似于以下的 Swagger 页面
<img width="1446" alt="image" src="/assets/swagger-demo.webp">

## 安全配置

要保护您的 API 端点，您可以在 Swagger 配置中定义安全方案。以下示例演示了如何使用 Bearer 认证 (JWT) 来保护您的端点：

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

此配置确保所有以 `/address` 前缀的端点都需要有效的 JWT 令牌才能访问。