---
title: Macro
head:
    - - meta
      - property: 'og:title'
        content: Macro - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: Macro 允许我们为钩子定义一个自定义字段，以便将自定义的复杂逻辑组合到简单的配置中，并通过完整的类型安全性进行保护。

    - - meta
      - property: 'og:description'
        content: Macro 允许我们为钩子定义一个自定义字段，以便将自定义的复杂逻辑组合到简单的配置中，并通过完整的类型安全性进行保护。
---

# Macro

Macro 允许我们为钩子定义一个自定义字段。

**Elysia.macro** 允许我们将自定义的复杂逻辑组合到简单的配置中，并通过完整的类型安全性进行**保护**。

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

访问该路径应将结果记录为 **“Elysia”**。

## API

**macro** 应返回一个对象，其中每个键都反映到钩子上，并且钩子内部提供的值将作为第一个参数发送回。

在上面的示例中，我们创建了一个接受 **string** 的 **hi**。

然后，我们将 **hi** 分配给 **“Elysia”**，然后该值将发送回 **hi** 函数，然后该函数将一个新事件添加到 **beforeHandle** 堆栈中。

这等效于将函数推送到 **beforeHandle**，如下所示：

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('Elysia')
        }
    })
```

当逻辑比接受新函数更复杂时，**macro** 发挥作用，例如为每个路由创建授权层。

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

该字段可以接受从字符串到函数的任何内容，使我们能够创建自定义的生命周期事件。

宏将按照钩子中的定义从上到下顺序执行，确保堆栈应按正确顺序处理。

## 参数

**Elysia.macro** 参数用于与生命周期事件进行交互，如下所示：

-   onParse
-   onTransform
-   onBeforeHandle
-   onAfterHandle
-   onError
-   onResponse
-   events - 生命周期存储
    -   global：全局堆栈的生命周期
    -   local：内联钩子 (路由) 的生命周期

以 **on** 开头的参数是将函数附加到生命周期堆栈中的函数。

而 **events** 是实际存储生命周期事件顺序的堆栈。你可以直接更改堆栈，也可以使用 Elysia 提供的辅助函数。

## 选项

扩展 API 的生命周期函数接受额外的**选项**以确保对生命周期事件的控制。

-   **options** (可选)- 确定哪个堆栈
-   **function** - 在事件上执行的函数

```typescript twoslash
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

**选项**可以接受以下参数：

-   **insert**
    -   函数应添加到何处
    -   值：**‘before’ | ‘after’**
    -   @default：**‘after’**
-   **stack**
    -   确定应添加哪种类型的堆栈
    -   值：**‘global’ | ‘local’**
    -   @default：**‘local’**
    