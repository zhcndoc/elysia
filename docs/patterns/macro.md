---
title: 宏 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 宏 - ElysiaJS

  - - meta
    - name: 'description'
      content: 宏 允许我们为钩子定义一个自定义字段。

  - - meta
    - property: 'og:description'
      content: 宏 允许我们为钩子定义一个自定义字段。
---

# 宏

<script setup>
import Tab from '../components/fern/tab.vue'
</script>

宏允许我们为钩子定义一个自定义字段。

<Tab
	id="macro"
	:names="['宏 v2', '宏 v1']"
	:tabs="['macro2', 'macro1']"
>

<template v-slot:macro1>

宏 v1 使用带有事件监听器功能的函数回调。

**Elysia.macro** 允许我们将自定义的复杂逻辑组合成一个在钩子中可用的简单配置，并且在类型安全上进行 **guard**。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro(({ onBeforeHandle }) => ({
        hi(word: string) {
            onBeforeHandle(() => {
                console.log(word)
            })
        }
    }))

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia'
    })
```

访问该路径应该会记录 **"Elysia"** 作为结果。

### API

**macro** 应返回一个对象，每个键在钩子中反映，钩子内提供的值将作为第一个参数返回。

在之前的示例中，我们创建了一个接受 **string** 的 **hi**。

然后我们将 **hi** 赋值为 **"Elysia"**，该值然后被发送回 **hi** 函数，之后该函数向 **beforeHandle** 栈中添加了一个新事件。

这相当于将函数推送到 **beforeHandle**，如下所示：

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('Elysia')
        }
    })
```

**macro** 在逻辑比仅接受一个新函数更复杂时闪耀，比如为每个路由创建授权层。

```typescript twoslash
// @filename: auth.ts
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro(() => {
        return {
            isAuth(isAuth: boolean) {},
            role(role: 'user' | 'admin') {},
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
    .use(auth)
    .get('/', () => 'hi', {
        isAuth: true,
        role: 'admin'
    })
```

该字段可以接受从字符串到函数的任何内容，允许我们创建一个自定义生命周期事件。

**macro** 将按照定义中从上到下的顺序执行，确保栈以正确的顺序处理。

### 参数

**Elysia.macro** 参数与生命周期事件交互如下：

-   onParse
-   onTransform
-   onBeforeHandle
-   onAfterHandle
-   onError
-   onResponse
-   events - 生命周期存储
    -   global: 全局栈的生命周期
    -   local: 内联钩子的生命周期（路由）

以 **on** 开头的参数是一个将函数附加到生命周期栈的函数。

而 **events** 是一个实际的栈，存储生命周期事件的顺序。您可以直接修改栈或使用 Elysia 提供的帮助函数。

### 选项

扩展 API 的生命周期函数接受额外的 **options** 以确保控制生命周期事件。

-   **options** （可选）- 确定哪个栈
-   **function** - 在事件上执行的函数

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro(({ onBeforeHandle }) => {
        return {
            hi(word: string) {
                onBeforeHandle(
                    { insert: 'before' }, // [!code ++]
                    () => {
                        console.log(word)
                    }
                )
            }
        }
    })
```

**Options** 可接受以下参数：

-   **insert**
    -   函数应该添加到哪里
    -   值： **'before' | 'after'**
    -   @default: **'after'**
-   **stack**
    -   确定应该添加哪种类型的栈
    -   值： **'global' | 'local'**
    -   @default: **'local'**

</template>

<template v-slot:macro2>

宏 v2 使用对象语法以返回生命周期，如内联钩子。

**Elysia.macro** 允许我们将自定义的复杂逻辑组合成一个在钩子中可用的简单配置，并且在类型安全上进行 **guard**。

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro({
        hi(word: string) {
            return {
	            beforeHandle() {
	                console.log(word)
	            }
            }
        }
    })

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia'
    })
```

访问该路径应该会记录 **"Elysia"** 作为结果。

### API

**macro** 具有与钩子相同的 API。

在之前的示例中，我们创建了一个接受 **string** 的 **hi** 宏。

然后我们将 **hi** 赋值为 **"Elysia"**，该值然后被发送回 **hi** 函数，之后该函数向 **beforeHandle** 栈中添加了一个新事件。

这相当于将函数推送到 **beforeHandle**，如下所示：

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('Elysia')
        }
    })
```

**macro** 在逻辑比仅接受一个新函数更复杂时闪耀，比如为每个路由创建授权层。

```typescript twoslash
// @filename: auth.ts
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro({
    	isAuth: {
      		resolve() {
     			return {
         			user: 'saltyaom'
          		}
      		}
        },
        role(role: 'admin' | 'user') {
        	return {}
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
    .use(auth)
    .get('/', ({ user }) => user, {
                          // ^?
        isAuth: true,
        role: 'admin'
    })
```

宏 v2 还可以向上下文注册一个新属性，允许我们直接从上下文访问该值。

该字段可以接受从字符串到函数的任何内容，允许我们创建一个自定义生命周期事件。

**macro** 将根据钩子的定义从上到下顺序执行，确保堆栈以正确的顺序处理。

## Resolve

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

在上面的例子中，我们通过返回一个带有 **resolve** 函数的对象向上下文添加了一个新属性 **user**。

下面是一个宏解析可能有用的示例：
- 执行身份验证并将用户添加到上下文中
- 运行额外的数据库查询并将数据添加到上下文中
- 向上下文添加一个新属性

## Property shorthand
Starting from Elysia 1.2.10, each property in the macro object can be a function or an object.

If the property is an object, it will be translated to a function that accept a boolean parameter, and will be executed if the parameter is true.
```typescript
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro({
    	// This property shorthand
    	isAuth: {
      		resolve() {
     			return {
         			user: 'saltyaom'
          		}
      		}
        },
        // is equivalent to
        isAuth(enabled: boolean) {
        	if(!enabled) return

        	return {
				resolve() {
					return {
						user
					}
				}
         	}
        }
    })
```

</template>

</Tab>