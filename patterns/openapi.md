---
url: 'https://elysiajs.com/patterns/openapi.md'
---

# OpenAPI&#x20;

Elysia 默认支持并遵循 OpenAPI 规范。

Elysia 可以通过使用 OpenAPI 插件自动生成 API 文档页面。

要生成 Swagger 页面，需安装该插件：

```bash
bun add @elysiajs/openapi
```

并将插件注册到服务器：

```typescript
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi()) // [!code ++]
```

默认情况下，Elysia 使用 OpenAPI V3 规范和 [Scalar UI](http://scalar.com)

通过访问 `/openapi`，你将看到由 Elysia 服务器生成的端点文档的 Scalar UI 界面。

有关 OpenAPI 插件配置，请参见[OpenAPI 插件页面](/plugins/openapi)。

## 从类型生成 OpenAPI

> 这是可选的，但我们强烈推荐这样做，以获得更好的文档体验。

默认情况下，Elysia 依赖运行时的 schema 来生成 OpenAPI 文档。

但是，你也可以通过使用 OpenAPI 插件中的生成器根据类型生成 OpenAPI 文档，方法如下：

1. 指定你的 Elysia 根文件（如果未指定，Elysia 将使用 `src/index.ts`），并导出一个实例

2. 导入生成器并向类型生成器提供**相对于项目根的文件路径**

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

export const app = new Elysia() // [!code ++]
    .use(
        openapi({
            references: fromTypes() // [!code ++]
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

Elysia 会尝试通过读取导出实例的类型来生成 OpenAPI 文档。

这将与运行时的 schema 共存，且运行时 schema 会优先于类型定义。

### 生产环境

在生产环境中，你很可能会将 Elysia 编译为 [Bun 单个可执行文件](/patterns/deploy.html) 或 [打包为单个 JavaScript 文件](https://elysiajs.com/patterns/deploy.html#compile-to-javascript)。

推荐预先生成声明文件（**.d.ts**）来提供类型声明给生成器。

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

const app = new Elysia()
    .use(
        openapi({
            references: fromTypes(
            	process.env.NODE_ENV === 'production' // [!code ++]
             		? 'dist/index.d.ts' // [!code ++]
               		: 'src/index.ts' // [!code ++]
            )
        })
    )
```

### 注意事项：根路径

由于推断项目根目录不可靠，建议明确提供项目根路径，这样生成器才能正确运行，尤其在使用 monorepo 时。

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(
        openapi({
            references: fromTypes('src/index.ts', {
            	projectRoot: path.join('..', import.meta.dir) // [!code ++]
            })
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

### 自定义 tsconfig.json

如果你有多个 `tsconfig.json`，务必指定正确的 `tsconfig.json` 文件用于类型生成。

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(
        openapi({
            references: fromTypes('src/index.ts', {
            	// 这是相对于项目根目录的路径
            	tsconfigPath: 'tsconfig.dts.json' // [!code ++]
            })
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

## 使用标准 Schema 生成 OpenAPI

Elysia 会尝试使用每个 schema 自带的方法来转换为 OpenAPI schema。

如果 schema 没有提供原生方法，你可以通过给 OpenAPI 提供 `mapJsonSchema` 自定义转换函数，例如：

\<Tab
id="schema-openapi"
noTitle
:names="\['Zod', 'Valibot', 'Effect']"
:tabs="\['zod', 'valibot', 'effect']"

>

### Zod OpenAPI

由于 Zod 的 schema 上没有 `toJSONSchema` 方法，我们需要提供自定义映射函数，将 Zod schema 转换为 OpenAPI schema。

::: code-group

```typescript [Zod 4]
import openapi from '@elysiajs/openapi'
import * as z from 'zod'

openapi({
	mapJsonSchema: {
		zod: z.toJSONSchema
	}
})
```

```typescript [Zod 3]
import openapi from '@elysiajs/openapi'
import { zodToJsonSchema } from 'zod-to-json-schema'

openapi({
	mapJsonSchema: {
		zod: zodToJsonSchema
	}
})
```

:::

### Valibot OpenAPI

Valibot 使用独立包（`@valibot/to-json-schema`）来转换 Valibot schema 为 JSON Schema。

```typescript
import openapi from '@elysiajs/openapi'
import { toJsonSchema } from '@valibot/to-json-schema'

openapi({
	mapJsonSchema: {
		valibot: toJsonSchema
	}
})
```

### Effect OpenAPI

由于 Effect 的 schema 上没有 `toJSONSchema` 方法，我们需要提供自定义映射函数，将 Effect schema 转换为 OpenAPI schema。

```typescript
import openapi from '@elysiajs/openapi'
import { JSONSchema } from 'effect'

openapi({
 	mapJsonSchema: {
   		effect: JSONSchema.make
 	}
})
```

## 描述路由

我们可以通过提供 schema 类型来添加路由信息。

但有时仅定义类型并不清晰路由具体功能。你可以使用 [detail](/plugins/openapi#detail) 字段明确描述路由。

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/sign-in',
		({ body }) => body, {
    		body: t.Object(
      		{
	            username: t.String(),
	            password: t.String({
	                minLength: 8,
	                description: '用户密码（至少8个字符）' // [!code ++]
	            })
	        },
	        { // [!code ++]
	            description: '需要用户名和密码' // [!code ++]
	        } // [!code ++]
	    ),
	    detail: { // [!code ++]
	        summary: '用户登录', // [!code ++]
	        tags: ['authentication'] // [!code ++]
	    } // [!code ++]
	})
```

detail 字段遵循 OpenAPI V3 定义，默认具备自动补全和类型安全。

detail 会传递给 OpenAPI，为路由添加描述。

## 响应头

我们可以通过使用 `withHeader` 包装 schema 来添加响应头：

```typescript
import { Elysia, t } from 'elysia'
import { openapi, withHeader } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi())
	.get(
		'/thing',
		({ body, set }) => {
			set.headers['x-powered-by'] = 'Elysia'

			return body
		},
		{
		    response: withHeader( // [!code ++]
				t.Literal('Hi'), // [!code ++]
				{ // [!code ++]
					'x-powered-by': t.Literal('Elysia') // [!code ++]
				} // [!code ++]
			) // [!code ++]
		}
	)
```

注意，`withHeader` 仅作注解用，不会强制或验证实际响应头。你需要手动设置响应头。

### 隐藏路由

你可以通过将 `detail.hide` 设置为 `true` 来隐藏 Swagger 页面中的路由。

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/sign-in',
		({ body }) => body,
		{
		    body: t.Object(
		        {
		            username: t.String(),
		            password: t.String()
		        },
		        {
		            description: '需要用户名和密码'
		        }
		    ),
		    detail: { // [!code ++]
		        hide: true // [!code ++]
		    } // [!code ++]
		}
	)
```

## 标签

Elysia 可以通过 Swagger 的标签系统将端点分组。

首先，在 Swagger 配置对象中定义可用的标签

```typescript
new Elysia().use(
    openapi({
        documentation: {
            tags: [
                { name: 'App', description: '通用端点' },
                { name: 'Auth', description: '身份验证端点' }
            ]
        }
    })
)
```

然后，在端点配置部分的 detail 属性中为该端点指定标签

```typescript
new Elysia()
    .get('/', () => 'Hello Elysia', {
        detail: {
            tags: ['App']
        }
    })
    .group('/auth', (app) =>
        app.post(
            '/sign-up',
            ({ body }) =>
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

这将生成如下的 Swagger 页面


### 标签分组

Elysia 也可接受标签，将整个实例或路由组归到特定标签下。

```typescript
import { Elysia, t } from 'elysia'

new Elysia({
    tags: ['user']
})
    .get('/user', 'user')
    .get('/admin', 'admin')
```

## 模型

通过使用[引用模型](/essential/validation.html#reference-model)，Elysia 会自动处理 schema 生成。

将模型分离到专门的部分并通过引用链接。

```typescript
new Elysia()
    .model({
        User: t.Object({
            id: t.Number(),
            username: t.String()
        })
    })
    .get('/user', () => ({ id: 1, username: 'saltyaom' }), {
        response: {
            200: 'User'
        },
        detail: {
            tags: ['User']
        }
    })
```

## 守卫

另外，Elysia 也可通过守卫将整个实例或路由组关联到特定守卫。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard({
        detail: {
            description: '要求用户必须登录'
        }
    })
    .get('/user', 'user')
    .get('/admin', 'admin')
```

## 更改 OpenAPI 端点

你可以通过在插件配置中设置 [path](#path) 来更改 OpenAPI 端点。

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(
        openapi({
            path: '/v2/openapi'
        })
    )
    .listen(3000)
```

## 自定义 OpenAPI 信息

我们可以通过在插件配置中设置 [documentation.info](#documentationinfo) 来自定义 OpenAPI 信息。

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(
        openapi({
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

这对于以下情况非常有用：

* 添加标题
* 设置 API 版本
* 添加描述说明我们的 API 是关于什么的
* 解释可用的标签，以及每个标签的含义

## 安全配置

为了保护你的 API 端点，你可以在 Swagger 配置中定义安全方案。下面的示例演示如何使用 Bearer 认证 (JWT) 保护端点：

```typescript
new Elysia().use(
    openapi({
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

这将确保 `/address` 前缀下的所有端点都需要有效的 JWT 令牌才能访问。
