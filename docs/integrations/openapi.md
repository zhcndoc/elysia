---
title: OpenAPI - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: OpenAPI - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 提供了一流的支持，并默认遵循 OpenAPI 模式。只需使用 Elysia Swagger 插件的一行代码，便能允许任何 Elysia 服务器自动生成 Swagger 页面并作为文档提供。

  - - meta
    - property: 'og:description'
      content: Elysia 提供了一流的支持，并默认遵循 OpenAPI 模式。只需使用 Elysia Swagger 插件的一行代码，便能允许任何 Elysia 服务器自动生成 Swagger 页面并作为文档提供。
---

# OpenAPI
Elysia 提供了一流的支持，并默认遵循 OpenAPI 模式。

Elysia 可以通过提供 Swagger 插件自动生成 API 文档页面。

要生成 Swagger 页面，请安装插件：
```bash
bun add @elysiajs/swagger
```

并将插件注册到服务器：
```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
```

默认情况下，Elysia 使用 OpenAPI V3 模式和 [Scalar UI](http://scalar.com)。

有关 Swagger 插件配置，请参见 [Swagger 插件页面](/plugins/swagger)。

## 路由定义
我们通过提供模式类型添加路由信息。

然而，有时候仅定义类型并不能清楚表达路由的功能。您可以使用 `schema.detail` 字段明确地定义路由的目的。

```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .post('/sign-in', ({ body }) => body, {
        body: t.Object(
            {
                username: t.String(),
                password: t.String({
                	minLength: 8,
                	description: '用户密码（至少 8 个字符）' // [!code ++]
                })
            },
            { // [!code ++]
                description: '期望的用户名和密码' // [!code ++]
            } // [!code ++]
        ),
        detail: { // [!code ++]
            summary: '用户登录', // [!code ++]
            tags: ['身份验证'] // [!code ++]
        } // [!code ++]
    })
```

详细字段遵循 OpenAPI V3 定义，并默认具有自动补全和类型安全。

详细信息随后传递给 Swagger，以便将描述放入 Swagger 路由中。

### detail
`detail` 扩展了 [OpenAPI 操作对象](https://swagger.io/specification#operation-object) 

详细字段是一个对象，可以用来描述有关该路由的 API 文档信息。

该字段可能包含以下内容：

### tags
该操作的标签数组。标签可用于根据资源或任何其他标识符逻辑分组操作。

### summary
该操作执行的简短摘要。

### description
该操作行为的详细解释。

### externalDocs
该操作的额外外部文档。

### operationId
用于唯一标识操作的字符串。该 ID 必须在 API 中所有描述的操作中唯一。operationId 值对大小写敏感。

### deprecated
声明该操作已被弃用。消费者应避免使用已声明的操作。默认值为 `false`。

### security
声明该操作可以使用哪些安全机制。值的列表包括可以使用的替代安全要求对象。只需满足安全要求对象中的一个即可授权请求。要使安全性可选，可以在数组中包含一个空的安全要求（`{}`）。

## 隐藏
您可以通过将 `detail.hide` 设置为 `true` 来隐藏 Swagger 页面上的路由。

```typescript
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
                description: '期望的用户名和密码'
            }
        ),
        detail: { // [!code ++]
        	hide: true // [!code ++]
        } // [!code ++]
    })
```

## 标签组
Elysia 可能会接受标签以将整个实例或一组路由添加到特定标签。

```typescript
import { Elysia, t } from 'elysia'

new Elysia({
	tags: ['用户']
})
	.get('/user', '用户')
	.get('/admin', '管理员')
```

## 保护
另外，Elysia 可能会接受保护以将整个实例或一组路由添加到特定保护。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		detail: {
			description: '要求用户已登录'
		}
	})
	.get('/user', '用户')
	.get('/admin', '管理员')
```
