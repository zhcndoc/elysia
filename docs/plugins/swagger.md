---
title: Swagger 插件 - ElysiaJS
search: false
head:
    - - meta
      - property: 'og:title'
        content: Swagger 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为 Elysia 添加支持生成 Swagger API 文档的插件。通过 "bun add @elysiajs/swagger" 来安装插件。

    - - meta
      - name: 'og:description'
        content: 这是一个为 Elysia 提供生成 Swagger API 文档支持的插件。首先通过 "bun add @elysiajs/swagger" 安装该插件。
---

::: warning
Swagger 插件已弃用且不再维护。请使用 [OpenAPI 插件](/plugins/openapi) 替代。
:::

# Swagger 插件

该插件为 Elysia 服务器生成一个 Swagger 端点。

安装命令：

```bash
bun add @elysiajs/swagger
```

然后这样使用它：

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/', () => 'hi')
    .post('/hello', () => 'world')
    .listen(3000)
```

访问 `/swagger` 将展示一个 Scalar UI，显示从 Elysia 服务器生成的端点文档。您还可以在 `/swagger/json` 访问原始的 OpenAPI 规范。

## 配置

以下是插件接受的配置项：

### provider

@default `scalar`

文档 UI 的提供者，默认是 Scalar。

### scalar

自定义 Scalar 的配置。

请参考 [Scalar 配置](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)

### swagger

自定义 Swagger 的配置。

请参考 [Swagger 规范](https://swagger.io/specification/v2/)。

### excludeStaticFile

@default `true`

确定 Swagger 是否应排除静态文件。

### path

@default `/swagger`

暴露 Swagger 的端点路径。

### exclude

需要从 Swagger 文档中排除的路径。

支持以下类型的值：

-   **字符串**
-   **正则表达式（RegExp）**
-   **字符串或正则表达式数组**

## 使用模式

以下是该插件的一些常见使用模式。

## 更改 Swagger 端点

您可以通过插件配置中的 [path](#path) 属性更改 Swagger 端点位置。

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

Elysia 可以利用 Swagger 的标签系统对端点进行分组。

首先，在 Swagger 配置对象中定义可用标签：

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

然后在端点配置的 `detail` 属性中为该端点分配标签组：

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

这样将生成类似如下的 Swagger 页面
<img width="1446" alt="image" src="/assets/swagger-demo.webp">

## 安全配置

为了保护您的 API 端点，您可以在 Swagger 配置中定义安全方案。下面示例展示了如何用 Bearer 认证（JWT）来保护端点：

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