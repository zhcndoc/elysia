---
title: 最佳实践 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 最佳实践 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 是一个与模式无关的框架，我们将决定采用何种编码模式的权力交给您和您的团队。然而，我们发现有一些团队在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现很难解耦和处理类型。本页面为使用 Elysia 的 MVC 模式指南。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个与模式无关的框架，我们将决定采用何种编码模式的权力交给您和您的团队。然而，我们发现有一些团队在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现很难解耦和处理类型。本页面为使用 Elysia 的 MVC 模式指南。
---

# 最佳实践

Elysia 是一个与模式无关的框架，选择何种编码模式由您和您的团队决定。

然而，在尝试在 Elysia 中适应 MVC 模式 [(模型-视图-控制器)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 时存在一些问题，我们发现解耦和处理类型很困难。

本页面是关于如何遵循 Elysia 结构最佳实践并结合 MVC 模式的指南，但可以适配您喜欢的任何编码模式。

## 文件夹结构

Elysia 对文件夹结构没有固定看法，留给您 **自行决定** 如何组织代码。

然而，**如果您没有具体的结构想法**，我们建议使用基于功能的文件夹结构，每个功能有自己的文件夹，包含控制器、服务和模型。

```
| src
  | modules
	| auth
	  | index.ts (Elysia 控制器)
	  | service.ts (服务)
	  | model.ts (模型)
	| user
	  | index.ts (Elysia 控制器)
	  | service.ts (服务)
	  | model.ts (模型)
  | utils
	| a
	  | index.ts
	| b
	  | index.ts
```

此结构使您能够轻松查找和管理代码，并将相关代码聚集在一起。

下面是一个如何将代码分布到基于功能文件夹结构的示例：

::: code-group

```typescript [auth/index.ts]
// 控制器处理 HTTP 相关，如路由、请求验证
import { Elysia } from 'elysia'

import { Auth } from './service'
import { AuthModel } from './model'

export const auth = new Elysia({ prefix: '/auth' })
	.get(
		'/sign-in',
		async ({ body, cookie: { session } }) => {
			const response = await Auth.signIn(body)

			// 设置 session cookie
			session.value = response.token

			return response
		}, {
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid
			}
		}
	)
```

```typescript [auth/service.ts]
// 服务处理业务逻辑，解耦于 Elysia 控制器
import { status } from 'elysia'

import type { AuthModel } from './model'

// 如果类不需要存储属性，可以使用 `abstract class` 避免类实例分配
export abstract class Auth {
	static async signIn({ username, password }: AuthModel.signInBody) {
		const user = await sql`
			SELECT password
			FROM users
			WHERE username = ${username}
			LIMIT 1`

		if (!await Bun.password.verify(password, user.password))
			// 你可以直接抛出 HTTP 错误
			throw status(
				400,
				'Invalid username or password' satisfies AuthModel.signInInvalid
			)

		return {
			username,
			token: await generateAndSaveTokenToDB(user.id)
		}
	}
}
```

```typescript [auth/model.ts]
// 模型定义请求和响应的数据结构和验证
import { t } from 'elysia'

export namespace AuthModel {
	// 定义用于 Elysia 验证的数据传输对象
	export const signInBody = t.Object({
		username: t.String(),
		password: t.String(),
	})

	// 以 TypeScript 类型定义
	export type signInBody = typeof signInBody.static

	// 其它模型同理
	export const signInResponse = t.Object({
		username: t.String(),
		token: t.String(),
	})

	export type signInResponse = typeof signInResponse.static

	export const signInInvalid = t.Literal('Invalid username or password')
	export type signInInvalid = typeof signInInvalid.static
}
```

:::

每个文件各司其职，具体如下：
- **控制器（Controller）**：处理 HTTP 路由、请求验证和 Cookie。
- **服务（Service）**：处理业务逻辑，尽可能解耦于 Elysia 控制器。
- **模型（Model）**：定义请求和响应的数据结构及验证。

您可以根据需求自行调整此结构，并使用喜欢的任何编码模式。

## 控制器（Controller）
> 1 个 Elysia 实例 = 1 个控制器

Elysia 做了很多工作来保证类型完整性，如果您将整个 `Context` 类型传入控制器，可能会遇到以下问题：

1. Elysia 类型复杂，且严重依赖插件和多层链式调用。
2. 复杂的类型难以维护，尤其是伴随装饰器和状态管理的变化。
3. 类型转换可能导致类型安全性降低或无法保证类型与运行时代码的一致性。
4. 这让 [Sucrose](/blog/elysia-10#sucrose)（Elysia 的"某种"编译器）更难静态分析代码。

### ❌ 不要：创建独立控制器

不要创建单独的控制器，应该直接使用 Elysia 本身作为控制器：

```typescript
import { Elysia, t, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context) {
        return Service.doStuff(context.stuff)
    }
}

// ❌ 不推荐这样写
new Elysia()
    .get('/', Controller.root)
```

直接将整个 `Controller.method` 传递给 Elysia 意味着传递了双重控制器，这违背了框架设计原则和 MVC 模式的核心思想。

### ✅ 推荐做法：使用 Elysia 本身作为控制器

替代上面做法，直接将 Elysia 实例当作控制器使用。

```typescript
// ✅ 推荐写法
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

如果您确实想要分离控制器，可以创建一个与 HTTP 请求无关的控制器类。

```typescript
import { Elysia } from 'elysia'

abstract class Controller {
	static doStuff(stuff: string) {
		return Service.doStuff(stuff)
	}
}

new Elysia()
	.get('/', ({ stuff }) => Controller.doStuff(stuff))
```

### 测试

您可以用 `handle` 直接调用函数（包括其生命周期）来测试控制器。

```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

import { describe, it, expect } from 'bun:test'

const app = new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)

        return 'ok'
    })

describe('控制器', () => {
	it('应该工作', async () => {
		const response = await app
			.handle(new Request('http://localhost/'))
			.then((x) => x.text())

		expect(response).toBe('ok')
	})
})
```

您可以在 [单元测试](/patterns/unit-test.html) 中找到更多相关信息。

## 服务（Service）

服务是一组实用工具或辅助函数，作为业务逻辑独立模块供模块/控制器使用，即 Elysia 实例中的逻辑。

任何和控制器解耦的技术逻辑都可以放入 **服务**。

在 Elysia 中，服务分为两种：
1. 无请求依赖的服务
2. 有请求依赖的服务

### ✅ 推荐做法：抽象无请求依赖服务

建议将服务类或函数从 Elysia 实例中抽离出来。

如果服务或函数不依赖 HTTP 请求或不访问 `Context`，建议实现为静态类或纯函数。

```typescript
import { Elysia, t } from 'elysia'

abstract class Service {
    static fibo(number: number): number {
        if(number < 2)
            return number

        return Service.fibo(number - 1) + Service.fibo(number - 2)
    }
}

new Elysia()
    .get('/fibo', ({ body }) => {
        return Service.fibo(body)
    }, {
        body: t.Numeric()
    })
```

如果服务不维护状态，使用 `abstract class` 搭配静态方法可以避免创建实例。

### ✅ 推荐做法：请求依赖服务作为 Elysia 实例

如果服务依赖请求或需要处理 HTTP 请求，建议将服务抽象为 Elysia 实例，确保类型完整性和推断准确：

```typescript
import { Elysia } from 'elysia'

// ✅ 推荐做法
const AuthService = new Elysia({ name: 'Auth.Service' })
    .macro({
        isSignIn: {
            resolve({ cookie, status }) {
                if (!cookie.session.value) return status(401)

                return {
                	session: cookie.session.value,
                }
            }
        }
    })

const UserController = new Elysia()
    .use(AuthService)
    .get('/profile', ({ Auth: { session } }) => session, {
    	isSignIn: true
    })
```

::: tip
Elysia 默认支持[插件去重](/essential/plugin.html#plugin-deduplication)，所以您不必担心性能问题，只要指定 **"name"** 属性，插件将变为单例。
:::

### ✅ 推荐做法：仅装饰请求依赖的属性

建议只装饰请求相关的属性，如 `requestIP`、`requestTime` 或 `session`。

滥用装饰器可能使代码与 Elysia 紧耦合，难以测试和复用。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.decorate('requestIP', ({ request }) => request.headers.get('x-forwarded-for') || request.ip)
	.decorate('requestTime', () => Date.now())
	.decorate('session', ({ cookie }) => cookie.session.value)
	.get('/', ({ requestIP, requestTime, session }) => {
		return { requestIP, requestTime, session }
	})
```

### ❌ 不要：将整个 `Context` 传递给服务

**Context 是高度动态类型**，可以从 Elysia 实例推断得到。

不要直接将整个 `Context` 传给服务，应通过解构仅传入所需字段：

```typescript
import type { Context } from 'elysia'

class AuthService {
	constructor() {}

	// ❌ 不建议这样写
	isSignIn({ status, cookie: { session } }: Context) {
		if (session.value)
			return status(401)
	}
}
```

由于 Elysia 类型复杂，且高度依赖插件与多层链式调用，准确类型化手动操作相当困难。

### ⚠️ 从 Elysia 实例推断 Context

在**非常必要**的情况下，可从 Elysia 实例推断 `Context` 类型：

```typescript
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

class AuthService {
	constructor() {}

	// ✅ 推荐写法
	isSignIn({ status, cookie: { session } }: InferContext<typeof setup>) {
		if (session.value)
			return status(401)
	}
}
```

但建议尽量避免此做法，优先使用 [Elysia 作为服务实例](#✅-推荐做法请求依赖服务作为-elysia-实例)。

## 模型（Model）

模型或 [DTO（数据传输对象）](https://en.wikipedia.org/wiki/Data_transfer_object) 使用 [Elysia.t（验证系统）](/essential/validation.html#elysia-type) 进行处理。

Elysia 内置验证系统能从代码推断类型，并做运行时校验。

### ❌ 不要：使用类实例声明模型

不要用类实例声明模型：

```typescript
// ❌ 不推荐
class CustomBody {
	username: string
	password: string

	constructor(username: string, password: string) {
		this.username = username
		this.password = password
	}
}

// ❌ 不推荐
interface ICustomBody {
	username: string
	password: string
}
```

### ✅ 推荐做法：使用 Elysia 验证系统定义模型

应该用 Elysia 验证系统定义模型，而非类或接口：

```typescript twoslash
// ✅ 推荐写法
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// 可选：获取模型对应类型
// 通常无需单独使用类型，因为 Elysia 已自动推断
type CustomBody = typeof customBody.static
    // ^?

export { customBody }
```

我们可用 `typeof` 和 `.static` 获取类型。

这样请求体可以正确推断为 `CustomBody` 类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})
// ---cut---
// ✅ 推荐写法
new Elysia()
	.post('/login', ({ body }) => {
	                 // ^?
		return body
	}, {
		body: customBody
	})
```

### ❌ 不要：分开声明类型和模型

不要将模型和对应的类型分开声明，应直接通过模型的 `typeof` 和 `.static` 获取类型。

```typescript
// ❌ 不推荐
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = {
	username: string
	password: string
}

// ✅ 推荐写法
const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = typeof customBody.static
```

### 分组

您可以将多个模型按对象归组，方便管理：

```typescript
import { Elysia, t } from 'elysia'

export const AuthModel = {
	sign: t.Object({
		username: t.String(),
		password: t.String()
	})
}

const models = AuthModel.models
```

### 模型注入

虽然可选，但如果严格遵循 MVC 模式，您可能想像使用服务一样，将模型注入控制器。

推荐使用 [Elysia 引用模型](/essential/validation#reference-model)。

使用 Elysia 的模型引用示例：

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

const AuthModel = new Elysia()
    .model({
        sign: customBody
    })

const models = AuthModel.models

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .prefix('model', 'auth.')
    .post('/sign-in', async ({ body, cookie: { session } }) => {
                             // ^?

        return true
    }, {
        body: 'auth.Sign'
    })
```

这种方式带来以下优势：
1. 模型可命名，获得自动补全支持。
2. 可以修改结构做后续使用，或执行[重映射](/essential/handler.html#remap)。
3. 在 OpenAPI 等兼容客户端中作为“模型”使用。
4. 加快 TypeScript 推断速度，因模型类型注册时被缓存。

## 重用插件

多次重用插件以支持类型推断是可行的。

Elysia 默认自动处理插件去重，性能影响极小。

要创建唯一插件，您可以给 Elysia 实例指定一个 **name** 或可选的 **seed**。

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'my-plugin' })
	.decorate("type", "plugin")

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

这样 Elysia 会复用已注册插件提升性能，而不是重复加载插件。