---
url: 'https://elysiajs.com/patterns/macro.md'
---

# 宏&#x20;

宏类似于一个函数，能够对生命周期事件、模式、上下文进行控制，并具备完全的类型安全。

一旦定义，它将在钩子中可用，并且可以通过添加该属性来激活。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro({
        hi: (word: string) => ({
            beforeHandle() {
                console.log(word)
            }
        })
    })

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia' // [!code ++]
    })
```

访问该路径时，应会在控制台输出 **"Elysia"**。

## 属性简写

从 Elysia 1.2.10 开始，宏对象中的每个属性都可以是一个函数或一个对象。

如果属性是对象，它将被转换为一个接受布尔参数的函数，并且在参数为 true 时执行。

```typescript
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro({
    	// This property shorthand
    	isAuth: { // [!code ++]
      		resolve: () => ({ // [!code ++]
      			user: 'saltyaom' // [!code ++]
      		}) // [!code ++]
        }, // [!code ++]
        // is equivalent to
        isAuth(enabled: boolean) { // [!code --]
        	if(!enabled) return // [!code --]
// [!code --]

        	return { // [!code --]
				resolve() { // [!code --]
					return { // [!code --]
						user // [!code --]
					} // [!code --]
				} // [!code --]
         	} // [!code --]
        } // [!code --]
    })
```

## 错误处理

你可以通过返回一个 `status` 来返回错误的 HTTP 状态。

```ts
import { Elysia, status } from 'elysia' // [!code ++]

new Elysia()
	.macro({
		auth: {
			resolve({ headers }) {
				if(!headers.authorization)
					return status(401, 'Unauthorized') // [!code ++]
		
				return {
					user: 'SaltyAom'
				}
			}
		}
	})
	.get('/', ({ user }) => `Hello ${user}`, {
	            // ^?
		auth: true
	})
```

建议您使用 `return status` 而不是 `throw new Error()` 来标注正确的 HTTP 状态码。

如果您抛出错误，Elysia 默认会将其转换为 `500 Internal Server Error`。

同样建议使用 `return status` 而不是 `throw status`，以确保 [Eden](/eden/overview) 和 [OpenAPI Type Gen](/patterns/openapi#openapi-from-types) 都能进行类型推断。

## 解析 (Resolve)

通过返回一个带有 [**resolve**](/essential/life-cycle.html#resolve) 函数的对象，您可以将属性添加到上下文中。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.macro({
		user: (enabled: true) => ({
			resolve: () => ({
				user: 'Pardofelis'
			})
		})
	})
	.get('/', ({ user }) => user, {
                          // ^?
		user: true
	})
```

在上面的示例中，我们通过返回一个带有 **resolve** 函数的对象向上下文添加了一个新属性 **user**。

以下是一个宏解析可能有用的示例：

* 执行身份验证并将用户添加到上下文
* 运行额外的数据库查询并将数据添加到上下文
* 向上下文添加新属性

### 带有解析的宏扩展

由于 TypeScript 的限制，扩展其他宏的宏无法推断 **resolve** 函数的类型。

我们提供了一个命名的单一宏作为解决此限制的变通方法。

```typescript twoslash
import { Elysia, t } from 'elysia'
new Elysia()
	.macro('user', {
		resolve: () => ({
			user: 'lilith' as const
		})
	})
	.macro('user2', {
		user: true,
		resolve: ({ user }) => {
		//           ^?
		}
	})
```

## 架构

您可以为您的宏定义一个自定义架构，以确保使用该宏的路由传递正确的类型。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		withFriends: {
			body: t.Object({
				friends: t.Tuple([t.Literal('Fouco'), t.Literal('Sartre')])
			})
		}
	})
	.post('/', ({ body }) => body.friends, {
//                                  ^?

		body: t.Object({
			name: t.Literal('Lilith')
		}),
		withFriends: true
	})
```

带有模式的宏将自动进行校验并推断类型，确保类型安全，并且可以与现有的模式共存。

您也可以堆叠来自不同宏的多个模式，甚至与标准验证器配合使用，它们将无缝协作。

### Schema with lifecycle in the same macro

Similar to [Macro extension with resolve](#macro-extension-with-resolve),

Macro schema also support type inference for **lifecycle within the same macro** **BUT** only with named single macro due to TypeScript limitation.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro('withFriends', {
		body: t.Object({
			friends: t.Tuple([t.Literal('Fouco'), t.Literal('Sartre')])
		}),
		beforeHandle({ body: { friends } }) {
//                             ^?
		}
	})
```

如果您想在同一宏内使用生命周期类型推断，建议使用命名的单一宏，而非多个叠加宏。

> 不要将此与使用宏模式推断路由生命周期事件中的类型混淆。后者运行良好，此限制仅针对在同一宏中使用生命周期。

## 扩展

宏可以扩展其他宏，允许您基于已有宏进行构建。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		sartre: {
			body: t.Object({
				sartre: t.Literal('Sartre')
			})
		},
		fouco: {
			body: t.Object({
				fouco: t.Literal('Fouco')
			})
		},
		lilith: {
			fouco: true,
			sartre: true,
			body: t.Object({
				lilith: t.Literal('Lilith')
			})
		}
	})
	.post('/', ({ body }) => body, {
//                            ^?
		lilith: true
	})



// ---cut-after---
//
```

这允许您基于已有宏构建，并为其添加更多功能。

## 去重

宏会自动去重生命周期事件，确保每个生命周期事件只执行一次。

默认情况下，Elysia 会使用属性值作为种子，但您也可以通过提供自定义种子来覆盖它。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		sartre: (role: string) => ({
			seed: role, // [!code ++]
			body: t.Object({
				sartre: t.Literal('Sartre')
			})
		})
	})
```

不过，如果您不慎创建了循环依赖，Elysia 会有一个16层的限制堆栈，以防止运行时和类型推断中出现无限循环。

如果路由已经有 OpenAPI 详情，它将合并该详情，但优先保留路由的详情，而非宏的详情。
