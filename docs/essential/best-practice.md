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

然而，在尝试将 MVC 模式 [(Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 适配到 Elysia 时，我们发现很难解耦和处理类型。

本页面是关于如何结合 MVC 模式遵循 Elysia 结构最佳实践的指南，但也可以适用于任何您喜欢的编码模式。

## 文件夹结构

Elysia 对文件夹结构没有固定看法，留给您 **自行决定** 如何组织代码。

然而，**如果您没有具体结构的想法**，我们推荐基于功能的文件夹结构。每个功能模块拥有自己的文件夹，里面包含控制器、服务和模型。

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

这种结构使您更容易找到和管理代码，并将相关代码集中在一起。

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

// If the class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
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
	export type signInBody = typeof signInBodyBody.static

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

每个文件的职责如下：
- **控制器（Controller）**：处理 HTTP 路由、请求验证和 Cookie。
- **服务（Service）**：处理业务逻辑，尽可能解耦于 Elysia 控制器。
- **模型（Model）**：定义请求和响应的数据结构及验证。

您可以随意调整此结构以满足自己的需求，使用任何您喜欢的编码模式。

## 方法链

Elysia 代码应始终使用 **方法链**。

由于 Elysia 的类型系统较复杂，Elysia 的每个方法都会返回一个新的类型引用。

**这非常重要**，以确保类型的完整性和推断。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // 存储是强类型的 // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```

在上述代码中，**state** 返回了一个新的 **ElysiaInstance** 类型，并添加了 `build` 类型。

### ❌ 不要：不要不使用方法链来使用 Elysia

如果不使用方法链，Elysia 无法保存新增类型，导致类型推断丢失。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议 <u>**始终使用方法链**</u> 以确保准确的类型推断。

## 控制器

> 1 个 Elysia 实例 = 1 个控制器

Elysia 在多个方面确保类型完整性，如果您直接把整个 `Context` 类型传递给控制器，可能会遇到以下问题：

1. Elysia 类型复杂，严重依赖插件和多级链。
2. 类型难以准确化，且可能因装饰器和状态变化而随时改变。
3. 类型转换容易导致类型完整性丢失，无法确保类型与运行时代码匹配。
4. 这会使得 [Sucrose](/blog/elysia-10#sucrose) *(Elysia 的“编译器”)* 更难对代码做静态分析。

### ❌ 不要：创建一个单独的控制器类

不要创建单独的控制器类，而是直接使用 Elysia 实例作为控制器：

```typescript
import { Elysia, t, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context) {
        return Service.doStuff(context.stuff)
    }
}

// ❌ 不要这样用
new Elysia()
    .get('/', Controller.root)
```

将整个 `Controller.method` 传给 Elysia 等同于传递了两层控制器，这违背框架设计原则和 MVC 模式本质。

### ✅ 做法：将 Elysia 本身作为控制器使用

代替上面做法，直接将 Elysia 实例本身视为控制器。

```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

### 测试

您可以使用 `handle` 方法直接调用控制器函数以进行测试（包括其生命周期）：

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

您可以在 [单元测试](/patterns/unit-test.html) 中了解更多相关信息。

## 服务

服务是独立的工具/辅助函数集合，作为业务逻辑被解耦出来，供模块或控制器使用，在此处即 Elysia 实例。

任何可以从控制器中解耦的技术逻辑都可以放在 **服务** 中。

Elysia 中有两种类型的服务：
1. 不依赖请求的服务
2. 依赖请求的服务

### ✅ 做：抽象不依赖请求的服务

建议将服务类或函数与 Elysia 解耦。

如果服务或函数不依赖 HTTP 请求或 `Context`，推荐将其抽象为静态类或函数。

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

如果服务不需要存储属性，可以使用 `abstract class` 和 `static`，避免创建类实例。

### ✅ 做：请求依赖的服务作为 Elysia 实例

**如果服务依赖请求**或需要处理 HTTP 请求，建议将其抽象为 Elysia 实例，以确保类型完整性和推断：

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
Elysia 默认自动处理[插件去重](/essential/plugin.html#plugin-deduplication)，所以您无需担心性能问题，只要指定了 **"name"** 属性，它就会是单例。
:::

### ✅ 做：只装饰请求依赖属性

建议 `decorate`（装饰） 仅针对请求依赖的属性，如 `requestIP`、`requestTime` 或 `session`。

过度使用装饰器可能导致代码与 Elysia 紧耦合，增加测试和重用难度。

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

**Context 是一个高度动态的类型**，可以从 Elysia 实例推断得到。

不要直接将整个 `Context` 传递给服务，而应对象解构只提取所需字段再传入服务：

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

由于 Elysia 类型复杂，且强依赖插件和多层链式调用，手动准确类型化很有挑战。

### ⚠️ 从 Elysia 实例推断 Context

在 **非常必要** 的情况下，可以从 Elysia 实例推断 `Context` 类型：

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

不过建议尽量避免这样，并优先使用 [Elysia 作为服务实例](#✅-做-请求依赖的服务作为-elysia-实例)。

更多关于 [InferContext](/essential/handler#infercontext) 的信息，详见 [基础：处理程序](/essential/handler)。

## 模型

模型或 [DTO（数据传输对象）](https://en.wikipedia.org/wiki/Data_transfer_object) 使用 [Elysia.t（验证系统）](/essential/validation.html#elysia-type) 处理。

Elysia 内置验证系统能从代码推断类型并进行运行时校验。

### ❌ 不要：将类实例作为模型声明

不要将类实例用于模型声明：

```typescript
// ❌ 不建议
class CustomBody {
	username: string
	password: string

	constructor(username: string, password: string) {
		this.username = username
		this.password = password
	}
}

// ❌ 不建议
interface ICustomBody {
	username: string
	password: string
}
```

### ✅ 做：使用 Elysia 验证系统定义模型

使用 Elysia 验证系统而非类或接口声明模型：

```typescript twoslash
// ✅ 推荐做法
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// 可选：获取模型对应类型
// 通常无须专门使用该类型，因为 Elysia 已推断
type CustomBody = typeof customBody.static
    // ^?



export { customBody }
```

我们可以用 `typeof` 和 `.static` 来获取类型。

这样可以通过 `CustomBody` 类型正确推断请求体。

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

### ❌ 不要：把类型和模型分开声明

不要把模型和类型分开声明，应通过模型的 `typeof` 和 `.static` 获取类型。

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

您可以将多个模型归组到一个对象中，便于管理：

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

虽然可选，但如严格遵循 MVC 模式，您可能希望像使用服务一样，将模型注入控制器中。

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
        'auth.sign': customBody
    })

const models = AuthModel.models

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .post('/sign-in', async ({ body, cookie: { session } }) => {
                             // ^?

        return true
    }, {
        body: 'auth.sign'
    })
```

这种方法带来若干优势：
1. 允许模型命名并获得自动补全。
2. 可以修改架构用于后续用途，或执行 [重映射](/essential/handler.html#remap)。
3. 在 OpenAPI 兼容客户端中作为“模型”，例如 Swagger。
4. 加快 TypeScript 推断速度，因为模型类型注册时已缓存。

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