---
url: 'https://elysiajs.com/essential/best-practice.md'
---

# 最佳实践

Elysia 是一个与模式无关的框架，编码模式的选择留给你和你的团队决定。

然而，在尝试用 Elysia 适配 MVC 模式 [(模型-视图-控制器)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) 时，存在一些问题，我们发现很难实现解耦和处理类型。

本页面是结合 MVC 模式遵循 Elysia 结构最佳实践的指南，但同样可以适配你喜欢的任何编码模式。

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

```typescript [auth/index.ts]
// 控制器处理 HTTP 相关，如路由，请求验证
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
// 服务处理业务逻辑，与 Elysia 控制器解耦
import { status } from 'elysia'

import type { AuthModel } from './model'

// 如果类不需要存储属性，
// 可以使用 `abstract class` 避免创建实例
export abstract class Auth {
	static async signIn({ username, password }: AuthModel.signInBody) {
		const user = await sql`
			SELECT password
			FROM users
			WHERE username = ${username}
			LIMIT 1`

		if (await Bun.password.verify(password, user.password))
			// 可以直接抛出 HTTP 错误
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
// 模型定义请求和响应的数据结构及验证
import { t } from 'elysia'

export namespace AuthModel {
	// 定义用于 Elysia 验证的 DTO
	export const signInBody = t.Object({
		username: t.String(),
		password: t.String(),
	})

	// 定义 TypeScript 类型
	export type signInBody = typeof signInBody.static

	// 其他模型依此类推
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

* **控制器**：处理 HTTP 路由、请求验证和 Cookie。
* **服务**：处理业务逻辑，尽量与 Elysia 控制器解耦。
* **模型**：定义请求和响应的数据结构及验证。

可以根据你的需求调整此结构，并使用你喜欢的任何编码模式。

## 控制器

鉴于 Elysia 的类型系统健壮，我们不推荐使用传统的紧耦合 Elysia `Context` 的控制器类，因为：

1. **Elysia 类型复杂**，且强依赖插件及多层链式调用。
2. **难以准确类型化**，特别是使用装饰器和存储时，Elysia 类型可能随时变化。
3. **类型完整性丢失**，代码的类型和运行时不一致。

推荐以下两种方式实现 Elysia 控制器：

1. 使用 Elysia 实例本身作为控制器
2. 创建不依赖于 HTTP 请求或 Elysia 的控制器

***

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

该方式允许 Elysia 自动推断 `Context` 类型，保证类型完整性和运行时与类型的一致性。

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

该方式难以正确类型化 `Context`，可能导致类型完整性丢失。

### 2. 不依赖 HTTP 请求的控制器

若要创建控制器类，建议创建与 HTTP 请求或 Elysia 完全无关的类。

这样允许你解耦控制器和 Elysia，使测试、复用，甚至替换框架更为简单，同时保持 MVC 模式。

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

绑定控制器到 Elysia Context 可能导致：

1. 类型完整性丢失
2. 不易测试和复用
3. 产生厂商锁定

推荐尽量让控制器与 Elysia 解耦。

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

## 服务

服务是一组解耦的工具/辅助函数，用于模块/控制器中的业务逻辑。

所有可以与控制器解耦的技术逻辑，都可以放在 **服务** 中。

Elysia 中有两种服务类型：

1. 非请求依赖的服务
2. 请求依赖的服务

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

如果服务不需存储属性，可以使用 `abstract class` 和 `static` 避免实例化。

### 2. 请求依赖服务作为 Elysia 实例

**如果服务是请求依赖的**，或需要处理 HTTP 请求，推荐抽象成 Elysia 实例以保证类型完整性和推断：

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
    .get('/profile', ({ Auth: { user } }) => user, {
    	isSignIn: true
    })
```

::: tip
Elysia 默认支持[插件去重](/essential/plugin.html#plugin-deduplication)，你无需担心性能问题，只要指定 **"name"** 属性，即保证为单例。
:::

### ✅ 推荐：只装饰请求依赖属性

建议 `decorate` 仅用于请求依赖属性，如 `requestIP`、`requestTime` 或 `session`。

过度使用装饰器会使代码紧耦合 Elysia，影响测试和复用。

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

模型或 [DTO（数据传输对象）](https://en.wikipedia.org/wiki/Data_transfer_object) 由 [Elysia.t (验证)](/essential/validation.html#elysia-type) 处理。

Elysia 内置验证系统，可自动推断类型并在运行时验证。

### ✅ 推荐使用 Elysia 验证系统

Elysia 的优势在于优先保证类型和运行时验证的单一可信来源。

不要声明接口，复用验证模型：

```typescript twoslash
// ✅ 推荐
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// 可选：如果想获取模型的类型
// 通常不需要专门声明类型，Elysia 会推断
type CustomBody = typeof customBody.static
    // ^?

export { customBody }
```

用 `typeof` 和 `.static` 属性获取模型类型。

然后用 `CustomBody` 推断请求体类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})
// ---截断---
// ✅ 推荐做法
new Elysia()
	.post('/login', ({ body }) => {
	                 // ^?
		return body
	}, {
		body: customBody
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
                             // ^?

        return true
    }, {
        body: 'auth.Sign'
    })
```

该方式带来多个好处：

1. 允许模型命名并支持自动补全。
2. 便于后续修改 Schema 或执行 [重映射](/essential/handler.html#remap)。
3. 在 OpenAPI 合规客户端（如 OpenAPI）中显示为“models”。
4. 提高 TypeScript 类型推断速度，因为模型类型注册时会被缓存。
