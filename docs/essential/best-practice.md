---
title: 最佳实践 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 最佳实践 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 是一个与模式无关的框架，我们把使用何种编码模式的决定权交给你和你的团队。然而，我们发现有不少人在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现在解耦和处理类型方面比较困难。本页面是使用 MVC 模式结合 Elysia 的指南。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个与模式无关的框架，我们把使用何种编码模式的决定权交给你和你的团队。然而，我们发现有不少人在 Elysia 上使用 MVC 模式（模型-视图-控制器），并且发现在解耦和处理类型方面比较困难。本页面是使用 MVC 模式结合 Elysia 的指南。
---

<script setup>
import AronaBanner from '../components/arona/arona-banner.vue'
</script>

# 最佳实践

Elysia 是一个与模式无关的框架，编码模式的选择留给你和你的团队决定。

然而，在尝试用 Elysia 适配 MVC 模式 [(模型-视图-控制器)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 时，存在一些问题，我们发现很难实现解耦和处理类型。

本页面是结合 MVC 模式遵循 Elysia 结构最佳实践的指南，但同样可以适配你喜欢的任何编码模式。

<AronaBanner />

## 文件夹结构

Elysia 对文件夹结构持无偏见态度，留给你 **自己决定** 如何组织代码。

不过，**如果你没有具体结构想法**，我们推荐使用基于功能的文件夹结构，每个功能都有自己的文件夹，包含控制器、服务以及模型。

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

该结构方便你查找和管理代码，将相关代码聚集在一起。

以下示例代码展示了如何分配代码到基于功能的文件夹结构：

::: code-group

```typescript [auth/index.ts] twoslash
// @filename: model.ts
import { t, type UnwrapSchema } from 'elysia'

export const AuthModel = {
	signInBody: t.Object({
		username: t.String(),
		password: t.String(),
	}),
	signInResponse: t.Object({
		username: t.String(),
		token: t.String(),
	}),
	signInInvalid: t.Literal('Invalid username or password')
} as const

// 可选，将所有模型转换为 TypeScript 类型
export type AuthModel = {
	[k in keyof typeof AuthModel]: UnwrapSchema<typeof AuthModel[k]>
}

// @filename: service.ts
import { status } from 'elysia'
import type { AuthModel } from './model'

export abstract class Auth {
	static async signIn({ username, password }: AuthModel['signInBody']) {
		if (Math.random() > 0.5)
			throw status(
				400,
				'Invalid username or password' satisfies AuthModel['signInInvalid']
			)

		return {
			username: 'saltyaom',
			token: 'token'
		}
	}	
}

// @filename: index.ts
// ---cut---
// 控制器（HTTP 适配器），如路由，请求验证
// 你也可以定义不绑定 Elysia 的其他控制器
import { Elysia } from 'elysia'

import { Auth } from './service'
import { AuthModel } from './model'

export const auth = new Elysia({ prefix: '/auth' })
	.get(
		'/sign-in',
		async ({ body, cookie: { session } }) => {
			const response = await Auth.signIn(body)

			// 设置 session cookie
			// （Elysia 的 cookie 是代理，它永远不会是 null/undefined）
			session!.value = response.token

			return response
		}, {
			body: AuthModel.signInBody,
			// response 是可选的，用于验证返回类型
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid
			}
		}
	)
```

```typescript [auth/service.ts]
// 服务处理业务逻辑，与 Elysia 控制器解耦
import { status } from 'elysia'

import type { AuthModel } from './model'

// 如果类不需要存储属性，
// 你可以使用 `abstract class` 避免类实例化开销
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

```typescript [auth/model.ts] twoslash
// 模型定义请求和响应的数据结构及验证
import { t, type UnwrapSchema } from 'elysia'

const AuthModel = {
	signInBody: t.Object({
		username: t.String(),
		password: t.String(),
	}),
	signInResponse: t.Object({
		username: t.String(),
		token: t.String(),
	}),
	signInInvalid: t.Literal('Invalid username or password')
} as const

// 可选，将所有模型转换为 TypeScript 类型
export type AuthModel = {
	[k in keyof typeof AuthModel]: UnwrapSchema<typeof AuthModel[k]>
}
```

:::

每个文件有自己的职责：
- **控制器**：处理 HTTP 路由、请求验证和 Cookie。
- **服务**：处理业务逻辑，尽可能与 Elysia 控制器解耦。
- **模型**：定义请求和响应的数据结构及验证。

你可以根据需求调整此结构，并使用你喜欢的任何编码模式。

## 控制器

::: note
当你使用 `cookie.name` 时，可能会出现警告，因为根据你的 TypeScript 配置，它可能是 `undefined`。

Elysia 的 cookie 永远不会是 `undefined`，因为它是一个代理对象。`cookie` 总是定义的，只有它的值（通过 cookie.value）可能是 undefined。

你可以通过使用 [cookie schema] 或在 `tsconfig.json` 中禁用 [strictNullChecks](https://www.typescriptlang.org/tsconfig/#strictNullChecks) 来修复这个问题。
:::

## Controller
由于 Elysia 的类型安全机制，不推荐使用与 Elysia 的 `Context` 紧密绑定的传统控制器类，原因如下：

1. **Elysia 类型较复杂**，且高度依赖插件和多层链式调用。
2. **难以正确类型化**；Elysia 类型可能随时变化，特别是使用装饰器和 store 时。
3. **类型完整性丧失**，类型与运行时代码不一致。

我们推荐以下两种方式之一来实现 Elysia 中的控制器。
1. 使用 Elysia 实例本身作为控制器
2. 创建与 HTTP 请求或 Elysia 无关的控制器。

---

### 1. 使用 Elysia 实例作为控制器

> 1 个 Elysia 实例 = 1 个控制器

将 Elysia 实例视为控制器，直接在 Elysia 实例上定义路由。

```typescript
// ✅ 推荐做法
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

这种方式允许 Elysia 自动推断 `Context` 类型，保证类型完整性和运行时与类型的一致性。

```typescript
// ❌ 不推荐
import { Elysia, t, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context) {
        return Service.doStuff(context.stuff)
    }
}

new Elysia()
    .get('/', Controller.root)
```

这种方式难以正确类型化 `Context`，可能导致类型完整性丢失。

### 2. 不依赖 HTTP 请求的控制器

这种方式允许你将控制器与 Elysia 解耦，更容易测试、复用，甚至可以在遵循 MVC 模式的同时更换框架。

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

将控制器与 Elysia Context 紧密绑定可能导致：
1. 类型完整性丢失
2. 测试和复用难度增加
3. 依赖供应商锁定

我们推荐尽量让控制器与 Elysia 解耦。

### ❌ 不推荐：传递整个 `Context` 给控制器

**Context 是高度动态的类型**，可由 Elysia 实例推断。

不要将整个 `Context` 传给控制器，应通过对象解构提取所需参数传入。

```typescript
import type { Context } from 'elysia'

abstract class Controller {
	constructor() {}

	// ❌ 不要这样做
	static root(context: Context) {
		return Service.doStuff(context.stuff)
	}
}
```

此做法难以正确类型化 `Context`，可能导致类型完整性丧失。

### 测试

如果使用 Elysia 作为控制器，可用 `handle` 方法直接调用函数（包括其生命周期）进行测试：

```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

import { describe, it, expect } from 'bun:test'

const app = new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)

        return 'ok'
    })

describe('Controller', () => {
	it('should work', async () => {
		const response = await app
			.handle(new Request('http://localhost/'))
			.then((x) => x.text())

		expect(response).toBe('ok')
	})
})
```

更多测试信息可查看 [单元测试](/patterns/unit-test.html)。

## Service
服务是一组解耦的工具/辅助函数，用于模块/控制器中的业务逻辑。

所有可以与控制器解耦的技术逻辑，都可以放在 **服务** 中。

Elysia 中有两种服务类型：

We recommend abstracting service classes/functions away from Elysia.

### 1. 抽象非请求依赖服务

推荐将服务类/函数抽象出来，独立于 Elysia。

如果服务或函数不依赖 HTTP 请求或不访问 `Context`，建议实现为静态类或函数。

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

如果你的服务不需要存储属性，可以使用 `abstract class` 和 `static` 方法避免实例化类。

### 2. 请求依赖服务作为 Elysia 实例

**如果服务是请求依赖的**，或需要处理 HTTP 请求，推荐抽象成 Elysia 实例以保证类型完整性和推断：

```typescript
import { Elysia } from 'elysia'

// ✅ 推荐做法
const AuthService = new Elysia({ name: 'Auth.Service' })
    .macro({
        isSignIn: {
            resolve({ cookie, status }) {
                if (!cookie.session.value)
                	return status(401, 'Unauthorized')

                return {
                	session: cookie.session.value,
                }
            }
        }
    })

const UserController = new Elysia()
    .use(AuthService)
    .get('/profile', ({ Auth: { user } }) => user, {
    	isSignIn: true
    })
```

::: tip
Elysia 默认处理 [插件去重](/essential/plugin.html#plugin-deduplication)，因此你不必担心性能问题，指定 **"name"** 属性时它将作为单例存在
:::

### ✅ 推荐：只装饰请求依赖属性

建议只为请求依赖的属性装饰，如 `requestIP`、`requestTime` 或 `session`。

过度使用装饰器会将你的代码绑死在 Elysia 上，难以测试和复用。

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

## 模型

模型或 [DTO（数据传输对象）](https://en.wikipedia.org/wiki/Data_transfer_object) 由 [Elysia.t（验证）](/essential/validation.html#elysia-type) 处理。

Elysia 内置验证系统，可自动根据代码推断类型并在运行时验证。

### ✅ 推荐使用 Elysia 验证系统

Elysia 的优势在于优先保证类型和运行时验证的单一可信来源。

不要声明接口，复用验证模型：

```typescript twoslash
// ✅ 推荐
import { Elysia, t, type UnwrapSchema } from 'elysia'

export const models = {
	customBody: t.Object({
		username: t.String(),
		password: t.String()
	})
}

// 可选：如果你想抽取模型的类型
type CustomBody = UnwrapSchema<typeof models.customBody>
//    ^?

// 或者将整个对象转换为类型
type Models = {
	[k in keyof typeof models]: UnwrapSchema<typeof models[k]>
}

// ❌ 不要这样做：分开声明model和类型
interface ICustomBody {
	username: string
	password: string
}
```

用 `typeof` 和 `.static` 属性获取模型类型。

然后用 `CustomBody` 推断请求体类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const models = {
	customBody: t.Object({
		username: t.String(),
		password: t.String()
	})	
}
// ---cut---
// ✅ 推荐做法
new Elysia()
	.post('/login', ({ body }) => {
		return body
	}, {
		body: models.customBody
	})
```

### ❌ 不要声明类实例作为模型

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

### ❌ 不要将类型和模型分开声明

不要分开声明类型，应使用 `typeof` 和 `.static` 直接获取模型类型。

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

// ✅ 推荐
const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = typeof customBody.static
```

### 分组

你可以将多个模型聚合到单个对象中，更加组织化。

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

虽然可选，但若严格遵循 MVC 模式，你可能希望像注入服务一样注入模型。我们推荐使用 [Elysia 引用模型](/essential/validation#reference-model)。

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
        return true
    }, {
        body: 'auth.Sign'
    })
```

这种方法带来若干好处：
1. 允许你为模型命名并提供自动补全。
2. 修改模式以便后续使用，或执行 [重映射](/essential/handler.html#remap)。
3. 在遵循 OpenAPI 的客户端（例如 OpenAPI）中显示为“models”。
4. 提升 TypeScript 推断速度，因为模型类型会在注册期间缓存。
