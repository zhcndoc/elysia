---
title: 与 Vercel Function 集成 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 与 Vercel Function 集成 - ElysiaJS

    - - meta
      - name: 'description'
        content: Vercel Function 默认支持 Web 标准框架，因此您可以在 Vercel Function 上运行 Elysia，无需任何额外配置。

    - - meta
      - property: 'og:description'
        content: Vercel Function 默认支持 Web 标准框架，因此您可以在 Vercel Function 上运行 Elysia，无需任何额外配置。
---

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSaltyAom%2Fvercel-function-elysia-demo">
	<img src="https://vercel.com/button" alt="Deploy with Vercel"/>
</a>

<br>

# 与 Vercel Function 集成

Vercel Function 默认支持 Web 标准框架，因此您可以在 Vercel Function 上运行 Elysia，无需任何额外配置。

1. 在 **api/index.ts** 中创建文件
2. 在 **index.ts** 文件中创建或导入一个已有的 Elysia 服务器
3. 将 Elysia 服务器作为默认导出导出

```typescript
import { Elysia, t } from 'elysia'

export default new Elysia()
    .get('/', () => 'Hello Vercel Function')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
```

4. 创建 **vercel.json** 文件，将 API 路由重写到 Elysia 服务器

```json
{
    "$schema": "https://openapi.vercel.sh/vercel.json",
	"builds": [{ "src": "api/**/*.ts", "use": "@vercel/node" }],
    "rewrites": [
		{
			"source": "/(.*)",
			"destination": "/api"
		}
    ]
}
```

此配置将把所有请求重写到 `/api` 路由，该路由即定义了 Elysia 服务器。

Elysia 可无须任何额外配置即可与 Vercel Function 配合使用，因为它默认支持 Web 标准框架。

您还可以像在其他环境中一样使用 Elysia 内置的功能，如验证、错误处理、[OpenAPI](/plugins/openapi.html) 等。

更多信息，请参考 [Vercel Function 文档](https://vercel.com/docs/functions?framework=other)。