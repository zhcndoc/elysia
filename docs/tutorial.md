---
title: 教程 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 教程 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 是一款为 Bun 构建的库，唯一的前提条件。要开始，请使用 "bun create elysia hi-elysia" 启动一个新项目，并使用 "bun dev" 启动开发服务器。这就是开始快速入门或使用 ElysiaJS 的全部所需。

    - - meta
      - property: 'og:description'
        content: Elysia 是一款为 Bun 构建的库，唯一的前提条件。要开始，请使用 "bun create elysia hi-elysia" 启动一个新项目，并使用 "bun dev" 启动开发服务器。这就是开始快速入门或使用 ElysiaJS 的全部所需。
---

# Elysia 教程

我们将构建一个简单的 CRUD 笔记 API 服务器。

这里没有数据库，也没有其他“生产就绪”功能。本教程将重点介绍 Elysia 的功能以及如何仅使用 Elysia。

如果你跟着做，我们预计大约需要 15-20 分钟。

## 设置

Elysia 是基于 [Bun](https://bun.sh) 构建的，Bun 是 Node.js 的一种替代运行时。

如果你还没有安装 Bun，请先安装。

::: code-group

```bash [MacOS/Linux]
curl -fsSL https://bun.sh/install | bash
```

```bash [Windows]
powershell -c "irm bun.sh/install.ps1 | iex"
```

:::

### 创建一个新项目

```bash
# 创建一个新项目
bun create elysia hi-elysia

# 切换到该项目中
cd hi-elysia

# 安装依赖
bun install
```

这将创建一个基础项目，包含 Elysia 和基本的 TypeScript 配置。

### 启动开发服务器

```bash
bun dev
```

打开浏览器并访问 **http://localhost:3000**，你应该在屏幕上看到 **Hello Elysia** 消息。

Elysia 使用 Bun 的 `--watch` 标志，当你进行更改时自动重新加载服务器。

## 路由
要添加新路由，我们需要指定一个 HTTP 方法、一个路径和一个值。

现在让我们打开 `src/index.ts` 文件，如下所示：
```typescript [index.ts]
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia')
    .get('/hello', 'Do you miss me?') // [!code ++]
    .listen(3000)
```

打开 **http://localhost:3000/hello**，你应该看到 **Do you miss me?**。

我们可以使用几种 HTTP 方法，但本教程将使用以下方法：

-   get
-   post
-   put
-   patch
-   delete

其他方法也可用，使用与 `get` 相同的语法。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia')
    .get('/hello', 'Do you miss me?') // [!code --]
    .post('/hello', 'Do you miss me?') // [!code ++]
    .listen(3000)
```

Elysia 接受值和函数作为响应。

不过，我们可以使用函数来访问 `Context`（路由和实例信息）。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia') // [!code --]
    .get('/', ({ path }) => path) // [!code ++]
    .post('/hello', 'Do you miss me?')
    .listen(3000)
```

## Swagger

在浏览器中输入 URL 只能与 GET 方法进行交互。要与其他方法进行交互，我们需要像 Postman 或 Insomnia 这样的 REST 客户端。

幸运的是，Elysia 配备了一个 **OpenAPI Schema** 和 [Scalar](https://scalar.com)，以与我们的 API 进行交互。

```bash
# 安装 Swagger 插件
bun add @elysiajs/swagger
```

然后将插件应用于 Elysia 实例。

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    // 应用 Swagger 插件
    .use(swagger()) // [!code ++]
    .get('/', ({ path }) => path)
    .post('/hello', 'Do you miss me?')
    .listen(3000)
```

导航到 **http://localhost:3000/swagger**，你应该看到如下文档：
![Scalar Documentation landing](/tutorial/scalar-landing.webp)

现在我们可以与所有已创建的路由进行交互。

滚动到 **/hello**，点击蓝色的 **测试请求** 按钮以显示表单。

我们可以通过点击黑色的 **发送** 按钮来查看结果。
![Scalar Documentation landing](/tutorial/scalar-request.webp)

## 装饰

然而，对于更复杂的数据，我们可能希望使用类来存储复杂数据，因为它允许我们定义自定义方法和属性。

现在，让我们创建一个单例类来存储我们的笔记。

```typescript twoslash
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note { // [!code ++]
    constructor(public data: string[] = ['Moonhalo']) {} // [!code ++]
} // [!code ++]

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note()) // [!code ++]
    .get('/note', ({ note }) => note.data) // [!code ++]
    .listen(3000)
```

`decorate` 允许我们将单例类注入到 Elysia 实例中，从而允许我们在路由处理程序中访问它。

打开 **http://localhost:3000/note**，我们应该在屏幕上看到 **["Moonhalo"]**。

对于 Scalar 文档，我们可能需要重新加载页面以查看新更改。
![Scalar Documentation landing](/tutorial/scalar-moonhalo.webp)

## 路径参数

现在，让我们根据索引检索笔记。

我们可以通过在前面加冒号来定义路径参数。

```typescript twoslash
// @errors: 7015
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get('/note/:index', ({ note, params: { index } }) => { // [!code ++]
        return note.data[index] // [!code ++]
    }) // [!code ++]
    .listen(3000)
```

现在我们暂时忽略这个错误。

打开 **http://localhost:3000/note/0**，我们应该在屏幕上看到 **Moonhalo**。

路径参数允许我们从 URL 中检索特定部分。在我们的例子中，我们从 **/note/0** 中检索到 **"0"** ，并将其放入名为 **index** 的变量中。

## 验证

上面的错误是一个警告，表示路径参数可以是任何字符串，而数组索引应该是数字。

例如，**/note/0** 是有效的，但 **/note/zero** 不是。

我们可以通过声明架构来强制执行和验证类型：

```typescript twoslash
import { Elysia, t } from 'elysia' // [!code ++]
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index } }) => {
            return note.data[index]
        },
        { // [!code ++]
            params: t.Object({ // [!code ++]
                index: t.Number() // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    )
    .listen(3000)
```

我们从 Elysia 导入 **t** 并为路径参数定义一个架构。

现在，如果我们尝试访问 **http://localhost:3000/note/abc**，我们应该看到错误消息。

这段代码解决了我们之前看到的错误，因为它是由于 **TypeScript 警告** 引起的。

Elysia 的架构不仅在运行时强制执行验证，还会推导出 TypeScript 类型，以实现自动补全和提前查看错误，以及 Scalar 文档。

大多数框架仅提供其中一个功能，或者分别提供它们，这要求我们单独更新每一个，但 Elysia 将它们作为 **单一真实来源** 提供。

### 验证类型

Elysia 提供以下属性的验证：

-   params - 路径参数
-   query - URL 查询字符串
-   body - 请求体
-   headers - 请求头
-   cookie - cookie
-   response - 响应体

它们都共享与上述示例相同的语法。

## 状态码

默认情况下，Elysia 将为所有路由返回 200 状态码，即使响应是错误。

例如，如果我们尝试访问 **http://localhost:3000/note/1**，我们应该在屏幕上看到 **undefined**，这不应该是 200 状态码（OK）。

我们可以通过返回错误来更改状态码。

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => { // [!code ++]
            return note.data[index] ?? error(404) // [!code ++]
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .listen(3000)
```

现在，如果我们尝试访问 **http://localhost:3000/note/1**，我们应该看到 **未找到** 的状态码为 404。

我们还可以通过将字符串传递给错误函数来返回自定义消息。

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(') // [!code ++]
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .listen(3000)
```

## 插件

主实例开始变得拥挤，我们可以将路由处理程序移到单独的文件中，并作为插件导入。

创建一个名为 **note.ts** 的新文件：

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
```

:::

然后在 **index.ts** 中，将 **note** 应用到主实例：
::: code-group

```typescript twoslash [index.ts]
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note' // [!code ++]

class Note { // [!code --]
    constructor(public data: string[] = ['Moonhalo']) {} // [!code --]
} // [!code --]

const app = new Elysia()
    .use(swagger())
    .use(note) // [!code ++]
    .decorate('note', new Note()) // [!code --]
    .get('/note', ({ note }) => note.data) // [!code --]
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => { // [!code --]
            return note.data[index] ?? error(404, 'oh no :(') // [!code --]
        },
        { // [!code --]
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }) // [!code --]
        }
    ) // [!code --]
    .listen(3000)
```

:::

打开 **http://localhost:3000/note/1**，你应该看到 **哦，不 :\(**，与之前相同。

我们刚刚创建了一种 **note** 插件，通过声明一个新的 Elysia 实例。

每个插件都是一个独立的 Elysia 实例，具有自己的路由、中间件和装饰器，可以应用于其他实例。

## 应用 CRUD

我们可以应用相同的模式来创建、更新和删除路由。

::: code-group

```typescript [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) { // [!code ++]
        this.data.push(note) // [!code ++]

        return this.data // [!code ++]
    } // [!code ++]

    remove(index: number) { // [!code ++]
        return this.data.splice(index, 1) // [!code ++]
    } // [!code ++]

    update(index: number, note: string) { // [!code ++]
        return (this.data[index] = note) // [!code ++]
    } // [!code ++]
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .put('/note', ({ note, body: { data } }) => note.add(data), { // [!code ++]
        body: t.Object({ // [!code ++]
            data: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .delete( // [!code ++]
        '/note/:index', // [!code ++]
        ({ note, params: { index }, error }) => { // [!code ++]
            if (index in note.data) return note.remove(index) // [!code ++]

            return error(422) // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            params: t.Object({ // [!code ++]
                index: t.Number() // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    ) // [!code ++]
    .patch( // [!code ++]
        '/note/:index', // [!code ++]
        ({ note, params: { index }, body: { data }, error }) => { // [!code ++]
            if (index in note.data) return note.update(index, data) // [!code ++]

            return error(422) // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            params: t.Object({ // [!code ++]
                index: t.Number() // [!code ++]
            }), // [!code ++]
            body: t.Object({ // [!code ++]
                data: t.String() // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    ) // [!code ++]
```

现在我们让我们打开 **http://localhost:3000/swagger** 并尝试进行 CRUD 操作。

## 分组

如果我们仔细观察，**note** 插件中的所有路由都共享一个 **/note** 前缀。

我们可以通过声明 **prefix** 来简化这一点。

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) {
        return (this.data[index] = note)
    }
}

// ---cut---
export const note = new Elysia({ prefix: '/note' }) // [!code ++]
    .decorate('note', new Note())
    .group('/note', (app) =>
        app // [!code ++]
            .get('/', ({ note }) => note.data) // [!code ++]
            .put('/', ({ note, body: { data } }) => note.add(data), {
                body: t.Object({
                    data: t.String()
                })
            })
            .get(
                '/:index',
                ({ note, params: { index }, error }) => {
                    return note.data[index] ?? error(404, 'Not Found :(')
                },
                {
                    params: t.Object({
                        index: t.Number()
                    })
                }
            )
            .delete(
                '/:index',
                ({ note, params: { index }, error }) => {
                    if (index in note.data) return note.remove(index)

                    return error(422)
                },
                {
                    params: t.Object({
                        index: t.Number()
                    })
                }
            )
            .patch(
                '/:index',
                ({ note, params: { index }, body: { data }, error }) => {
                    if (index in note.data) return note.update(index, data)

                    return error(422)
                },
                {
                    params: t.Object({
                        index: t.Number()
                    }),
                    body: t.Object({
                        data: t.String()
                    })
                }
            )
    ) // [!code ++]
```

:::

## 守卫

现在我们可能注意到插件中的几条路由都有 **params** 验证。

我们可以定义一个 **guard** 来将验证应用于插件中的路由。

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) {
        return (this.data[index] = note)
    }
}

// ---cut---
export const note = new Elysia({ prefix: '/note' })
    .decorate('note', new Note())
    .get('/', ({ note }) => note.data)
    .put('/', ({ note, body: { data } }) => note.add(data), {
        body: t.Object({
            data: t.String()
        })
    })
    .guard({ // [!code ++]
        params: t.Object({ // [!code ++]
            index: t.Number() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        { // [!code --]
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }) // [!code --]
        } // [!code --]
    )
    .delete(
        '/:index',
        ({ note, params: { index }, error }) => {
            if (index in note.data) return note.remove(index)

            return error(422)
        },
        { // [!code --]
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }) // [!code --]
        } // [!code --]
    )
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error }) => {
            if (index in note.data) return note.update(index, data)

            return error(422)
        },
        {
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }), // [!code --]
            body: t.Object({
                data: t.String()
            })
        }
    )
```

:::

验证将在 **guard** 被调用后应用于所有路由，并与插件绑定。

## 生命周期

在实际使用中，我们可能希望在处理请求之前做一些事情，例如记录日志。

与其在每条路由中使用内联的 `console.log`，不如应用 **lifecycle**，该生命周期在请求处理之前/之后拦截请求。

我们可以使用几种生命周期，但在这个例子中我们将使用 `onTransform`。

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) {
        return (this.data[index] = note)
    }
}
// ---cut---
export const note = new Elysia({ prefix: '/note' })
    .decorate('note', new Note())
    .onTransform(function log({ body, params, path, request: { method } }) { // [!code ++]
        console.log(`${method} ${path}`, { // [!code ++]
            body, // [!code ++]
            params // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/', ({ note }) => note.data)
    .put('/', ({ note, body: { data } }) => note.add(data), {
        body: t.Object({
            data: t.String()
        })
    })
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .get('/:index', ({ note, params: { index }, error }) => {
        return note.data[index] ?? error(404, 'Not Found :(')
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error }) => {
            if (index in note.data) return note.update(index, data)

            return error(422)
        },
        {
            body: t.Object({
                data: t.String()
            })
        }
    )
```

:::

`onTransform` 在 **路由之后但在验证之前** 被调用，因此我们可以在未定义 **404 未找到** 路由的情况下记录请求。

这使我们能够在请求处理之前记录请求，我们可以查看请求体和路径参数。

### 范围

默认情况下，**lifecycle hook 被封装**。钩子应用于同一实例中的路由，而不应用于其他插件（未在同一插件中定义的路由）。

这意味着 `onTransform` 日志不会在其他实例上被调用，除非我们明确地定义为 `scoped` 或 `global`。

## 身份验证

现在我们可能想为我们的路由添加授权，以便只有笔记的拥有者可以更新或删除笔记。

让我们创建一个 `user.ts` 文件来处理用户身份验证：

```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia' // [!code ++]
// [!code ++]
export const user = new Elysia({ prefix: '/user' })// [!code ++]
    .state({// [!code ++]
        user: {} as Record<string, string>,// [!code ++]
        session: {} as Record<number, string>// [!code ++]
    })// [!code ++]
    .put(// [!code ++]
        '/sign-up',// [!code ++]
        async ({ body: { username, password }, store, error }) => {// [!code ++]
            if (store.user[username])// [!code ++]
                return error(400, {// [!code ++]
                    success: false,// [!code ++]
                    message: 'User already exists'// [!code ++]
                })// [!code ++]
// [!code ++]
            store.user[username] = await Bun.password.hash(password)// [!code ++]
// [!code ++]
            return {// [!code ++]
                success: true,// [!code ++]
                message: 'User created'// [!code ++]
            }// [!code ++]
        },// [!code ++]
        {// [!code ++]
            body: t.Object({// [!code ++]
                username: t.String({ minLength: 1 }),// [!code ++]
                password: t.String({ minLength: 8 })// [!code ++]
            })// [!code ++]
        }// [!code ++]
    )// [!code ++]
    .post(// [!code ++]
        '/sign-in',// [!code ++]
        async ({// [!code ++]
            store: { user, session },// [!code ++]
            error,// [!code ++]
            body: { username, password },// [!code ++]
            cookie: { token }// [!code ++]
        }) => {// [!code ++]
            if (// [!code ++]
                !user[username] ||// [!code ++]
                !(await Bun.password.verify(password, user[username]))// [!code ++]
            )// [!code ++]
                return error(400, {// [!code ++]
                    success: false,// [!code ++]
                    message: 'Invalid username or password'// [!code ++]
                })// [!code ++]

            const key = crypto.getRandomValues(new Uint32Array(1))[0]// [!code ++]
            session[key] = username// [!code ++]
            token.value = key// [!code ++]

            return {// [!code ++]
                success: true,// [!code ++]
                message: `Signed in as ${username}`// [!code ++]
            }// [!code ++]
        },// [!code ++]
        {// [!code ++]
            body: t.Object({// [!code ++]
                username: t.String({ minLength: 1 }),// [!code ++]
                password: t.String({ minLength: 8 })// [!code ++]
            }),// [!code ++]
            cookie: t.Cookie(// [!code ++]
                {// [!code ++]
                    token: t.Number()// [!code ++]
                },// [!code ++]
                {// [!code ++]
                    secrets: 'seia'// [!code ++]
                }// [!code ++]
            )// [!code ++]
        }// [!code ++]
    )// [!code ++]
```

现在这里有很多需要解读：
1. 我们创建了一个新实例，包含两个路由用于注册和登录。
2. 在该实例中，我们定义了一个内存存储 `user` 和 `session`
	- 2.1 `user` 将保存 `username` 和 `password` 的键值对
	- 2.2 `session` 将保存 `session` 和 `username` 的键值对
3. 在 `/sign-in` 中，我们插入一个用户名和经过 argon2id 散列的密码
4. 在 `/sign-up` 中我们做以下事情：
	- 4.1 我们检查用户是否存在并验证密码
	- 4.2 如果密码匹配，我们会在 `session` 中生成一个新会话
	- 4.3 我们将 cookie `token` 设置为 session 的值
	- 4.4 我们将 `secret` 附加到 cookie，以防止攻击者篡改 cookie

::: tip
由于我们使用的是内存存储，数据在每次重新加载或每次编辑代码时都会被清除。

我们将在本教程的后面部分进行修复。
:::

现在，如果我们想要检查用户是否已登录，我们可以检查 `token` cookie 的值，并与 `session` 存储进行检查。

## 参考模型
然而，我们可以识别出 `/sign-in` 和 `/sign-up` 都共享同一个 `body` 模型。

我们可以通过使用 **reference model** 来重用模型，具体方法是指定一个名称。

要创建 **reference model**，我们可以使用 `.model` 并传递名称与模型的值：

```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const user = new Elysia({ prefix: '/user' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({ // [!code ++]
    	signIn: t.Object({ // [!code ++]
    		username: t.String({ minLength: 1 }), // [!code ++]
    		password: t.String({ minLength: 8 }) // [!code ++]
    	}), // [!code ++]
     	session: t.Cookie( // [!code ++]
	     	{ // [!code ++]
	     		token: t.Number() // [!code ++]
	     	}, // [!code ++]
	     	{ // [!code ++]
		     	secrets: 'seia' // [!code ++]
	     	} // [!code ++]
	    ) // [!code ++]
    }) // [!code ++]
    .model((model) => ({ // [!code ++]
    	...model, // [!code ++]
     	optionalSession: t.Optional(model.session) // [!code ++]
    })) // [!code ++]
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })
            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
           	body: 'signIn' // [!code ++]
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
           	body: 'signIn', // [!code ++]
           	cookie: 'session', // [!code ++]
        }
    )
```

添加模型后，我们可以通过在架构中引用它们的名称来重用这些模型，而不是提供字面类型，同时提供相同的功能和类型安全。

我们还可能会注意到，这一行中正在执行 **remap model**：
```ts
import { Elysia } from 'elysia'

new Elysia()
	.model({
    	signIn: t.Object({
    		username: t.String({ minLength: 1 }),
    		password: t.String({ minLength: 8 })
    	}),
     	session: t.Cookie(
      		{
        		token: t.Number()
        	},
         	{
          		secrets: 'seia'
          	}
	   	)
    })
    .model((model) => ({ // [!code ++]
    	...model, // [!code ++]
     	optionalSession: t.Optional(model.session) // [!code ++]
    })) // [!code ++]
```

`Elysia.model` 可以接受多个重载：
1. 提供一个对象，注册所有键值作为模型
2. 提供一个函数，然后访问所有先前的模型并返回新模型

通过提供一个函数，我们可以进行重映射/引用或过滤掉我们不想使用的模型。

然而在我们的例子中，我们希望引用一个模型并从中创建一个新模型。注意我们通过引用 `model.session` 创建了一个新的 `optionalSession` 模型，并在其上包裹了 `t.Optional`。

其余参数 `...rest` 也很重要，因为我们希望在添加新模型的同时保留所有模型。

最后，我们可以添加 `/profile` 和 `/sign-out` 路由，如下所示：
```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const user = new Elysia({ prefix: '/user' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get( // [!code ++]
        '/sign-out', // [!code ++]
        ({ cookie: { token } }) => { // [!code ++]
            token.remove() // [!code ++]
 // [!code ++]
            return { // [!code ++]
                success: true, // [!code ++]
                message: 'Signed out' // [!code ++]
            } // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            cookie: 'optionalSession' // [!code ++]
        } // [!code ++]
    ) // [!code ++]
    .get( // [!code ++]
        '/profile', // [!code ++]
        ({ cookie: { token }, store: { session }, error }) => { // [!code ++]
            const username = session[token.value] // [!code ++]
 // [!code ++]
            if (!username) // [!code ++]
                return error(401, { // [!code ++]
                    success: false, // [!code ++]
                    message: 'Unauthorized' // [!code ++]
                }) // [!code ++]
 // [!code ++]
            return { // [!code ++]
                success: true, // [!code ++]
                username // [!code ++]
            } // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            cookie: 'session' // [!code ++]
        } // [!code ++]
    ) // [!code ++]
```

由于我们将在 `note` 中应用 `authorization`，我们需要重复两件事情：

1. 检查用户是否存在
2. 获取用户 ID（在我们的例子中是 'username'）

对于 **1.** ，我们可以使用 **macro**。

## 插件去重

由于我们要在多个模块（用户和笔记）中重用此钩子，因此我们可以将服务（实用程序）部分提取出来并应用于两个模块。
```ts twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' }) // [!code ++]
	.state({ // [!code ++]
        user: {} as Record<string, string>, // [!code ++]
        session: {} as Record<number, string> // [!code ++]
    }) // [!code ++]
    .model({ // [!code ++]
        signIn: t.Object({ // [!code ++]
            username: t.String({ minLength: 1 }), // [!code ++]
            password: t.String({ minLength: 8 }) // [!code ++]
        }), // [!code ++]
        session: t.Cookie( // [!code ++]
            { // [!code ++]
                token: t.Number() // [!code ++]
            }, // [!code ++]
            { // [!code ++]
                secrets: 'seia' // [!code ++]
            } // [!code ++]
        ) // [!code ++]
    }) // [!code ++]
    .model((model) => ({ // [!code ++]
        ...model, // [!code ++]
        optionalSession: t.Optional(model.session) // [!code ++]
    })) // [!code ++]

export const user = new Elysia({ prefix: '/user' })
	.use(userService) // [!code ++]
	.state({ // [!code --]
        user: {} as Record<string, string>, // [!code --]
        session: {} as Record<number, string> // [!code --]
    }) // [!code --]
    .model({ // [!code --]
        signIn: t.Object({ // [!code --]
            username: t.String({ minLength: 1 }), // [!code --]
            password: t.String({ minLength: 8 }) // [!code --]
        }), // [!code --]
        session: t.Cookie( // [!code --]
            { // [!code --]
                token: t.Number() // [!code --]
            }, // [!code --]
            { // [!code --]
                secrets: 'seia' // [!code --]
            } // [!code --]
        ) // [!code --]
    }) // [!code --]
    .model((model) => ({ // [!code --]
        ...model, // [!code --]
        optionalSession: t.Optional(model.session) // [!code --]
    })) // [!code --]
```

这里的 `name` 属性非常重要，因为它是插件的唯一标识符，以防止重复实例（如单例）。

如果我们没有定义插件而定义实例，钩子/生命周期和路由会在每次使用插件时注册。

我们的目的是将此插件（服务）应用于多个模块，以提供实用功能，因此去重非常重要，因为生命周期不应注册两次。

## 宏
宏允许我们定义一个带有自定义生命周期管理的自定义钩子。

要定义宏，我们可以使用 `.macro`，如下所示：
```ts twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({ // [!code ++]
        isSignIn(enabled: boolean) { // [!code ++]
            if (!enabled) return // [!code ++]

            onBeforeHandle( // [!code ++]
                ({ error, cookie: { token }, store: { session } }) => { // [!code ++]
                    if (!token.value) // [!code ++]
                        return error(401, { // [!code ++]
                            success: false, // [!code ++]
                            message: 'Unauthorized' // [!code ++]
                        }) // [!code ++]

                    const username = session[token.value as unknown as number] // [!code ++]

                    if (!username) // [!code ++]
                        return error(401, { // [!code ++]
                            success: false, // [!code ++]
                            message: 'Unauthorized' // [!code ++]
                        }) // [!code ++]
                } // [!code ++]
            ) // [!code ++]
        } // [!code ++]
    })) // [!code ++]
```

我们刚刚创建了一个名为 `isSignIn` 的新宏，接受 `boolean` 值，如果为 true，则添加一个 `onBeforeHandle` 事件，该事件在 **验证之后但在主处理程序之前** 执行，允许我们在此处提取身份验证逻辑。

要使用宏，只需指定 `isSignIn: true`，如下所示：
```ts twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const user = new Elysia({ prefix: '/user' })
    .use(userService)
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    // ---cut---
    .get(
        '/profile',
        ({ cookie: { token }, store: { session }, error }) => {
            const username = session[token.value]

            if (!username) // [!code --]
                return error(401, { // [!code --]
                    success: false, // [!code --]
                    message: 'Unauthorized' // [!code --]
                }) // [!code --]

            return {
                success: true,
                username
            }
        },
        {
            isSignIn: true, // [!code ++]
            cookie: 'session'
        }
    )
```

设置 `isSignIn` 后，我们可以提取命令式检查部分，并在多个路由上重用相同的逻辑，而不必重复相同的代码。

::: tip
这看起来可能是一个小的代码更改，以换取更大的样板，但随着服务器变得复杂，用户检查也可能变得非常复杂。
:::

## 解决
我们最后的目标是从令牌中获取用户名（ID），我们可以使用 `resolve` 在上下文中定义一个新属性，类似于 `store`，但仅在每个请求中执行。

与 `decorate` 和 `store` 不同，resolve 在 `beforeHandle` 阶段定义，或者在验证后可用。

这确保了像 `cookie: 'session'` 这样的属性在创建新属性之前存在。

```ts twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))
// ---cut---
export const getUserId = new Elysia() // [!code ++]
    .use(userService) // [!code ++]
    .guard({ // [!code ++]
        cookie: 'session' // [!code ++]
    }) // [!code ++]
    .resolve(({ store: { session }, cookie: { token } }) => ({ // [!code ++]
        username: session[token.value] // [!code ++]
    })) // [!code ++]
```

在这个实例中，我们通过使用 `resolve` 定义了一个新属性 `username`，从而简化获取 `username` 的逻辑。

我们在这个 `getUserId` 实例中没有定义名字，因为我们希望在多个实例中重新应用 `guard` 和 `resolve`。

::: tip
同样，resolve 在获取属性的逻辑复杂时表现良好，可能不值得用于这样的小操作。但由于在实际情况下，我们需要数据库连接、缓存和排队，可能会使其符合叙述。
:::

## 范围
如果我们尝试应用 `getUserId`，我们可能会注意到属性 `username` 和 `guard` 并未应用。
```ts twoslash [user.ts]
// @errors: 2339
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))
// ---cut---
export const getUserId = new Elysia()
    .use(userService)
    .guard({
       	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))
```

这是因为 Elysia 默认情况下 **封装生命周期**，如 [lifecycle](#lifecycle) 中提到的那样。

这是故意设计的，因为我们不希望每个模块对其他模块产生副作用。产生副作用可能在代码库较大且包含多个（Elysia）依赖项时非常难以调试。

如果我们希望生命周期应用于父级，我们可以显式地标注它可以应用于父级，方法有：
1. scoped - 仅应用于一个级别以上的父级
2. global - 应用至所有父级

在我们的例子中，我们希望使用 **scoped**，因为它仅应用于使用该服务的控制器。

要做到这一点，我们需要将生命周期标注为 `scoped`：
```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))
// ---cut---
export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	as: 'scoped', // [!code ++]
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	{ as: 'scoped' }, // [!code ++]
     	({ store: { session }, cookie: { token } }) => ({
        	username: session[token.value]
      	})
    )

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
		                 // ^?
        success: true,
        username
    }))
```

另外，如果我们定义多个 `scoped`，我们可以使用 `as` 来转换多个生命周期。

```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))
// ---cut---
export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	as: 'scoped', // [!code --]
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
   		{ as: 'scoped' }, // [!code --]
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin') // [!code ++]

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))
```

两者实现相同的效果，唯一的区别在于单个或多个转换。

::: tip
封装发生在运行时和类型级别。这使我们能够提前捕获错误。
:::

最后，我们可以重用 `userService` 和 `getUserId` 来帮助在 **note** 控制器中进行授权。

但首先，不要忘记在 `index.ts` 文件中导入 `user`：
::: code-group

```typescript twoslash [index.ts]
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const user = new Elysia({ prefix: '/user' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get(
        '/sign-out',
        ({ cookie: { token } }) => {
            token.remove()

            return {
                success: true,
                message: 'Signed out'
            }
        },
        {
            cookie: 'optionalSession'
        }
    )
    .get(
        '/profile',
        ({ cookie: { token }, store: { user, session }, error }) => {
            const username = session[token.value]

            if (!username)
                return error(401, {
                    success: false,
                    message: 'Unauthorized'
                })

            return {
                success: true,
                username
            }
        },
        {
            cookie: 'session'
        }
    )

// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note'
import { user } from './user' // [!code ++]

const app = new Elysia()
    .use(swagger())
    .use(user) // [!code ++]
    .use(note)
    .listen(3000)
```

:::

## 授权
首先，让我们修改 `Note` 以存储创建笔记的用户。

但我们可以定义一个笔记架构，推导出其类型，允许我们同步运行时和类型级别。

```typescript [note.ts]
import { Elysia, t } from 'elysia'

const memo = t.Object({ // [!code ++]
	data: t.String(), // [!code ++]
	author: t.String() // [!code ++]
}) // [!code ++]

type Memo = typeof memo.static // [!code ++]

class Note {
    constructor(public data: string[] = ['Moonhalo']) {} // [!code --]
    constructor( // [!code ++]
		public data: Memo[] = [ // [!code ++]
			{ // [!code ++]
				data: 'Moonhalo', // [!code ++]
				author: 'saltyaom' // [!code ++]
			} // [!code ++]
		] // [!code ++]
	) {} // [!code ++]

    add(note: string) { // [!code --]
    add(note: Memo) { // [!code ++]
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) { // [!code --]
        return (this.data[index] = note) // [!code --]
    } // [!code --]
    update(index: number, note: Partial<Memo>) { // [!code ++]
        return (this.data[index] = { ...this.data[index], ...note }) // [!code ++]
    } // [!code ++]
}

export const note = new Elysia({ prefix: '/note' })
    .decorate('note', new Note())
    .model({ // [!code ++]
    	memo: t.Omit(memo, ['author']) // [!code ++]
    }) // [!code ++]
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .put('/', ({ note, body: { data } }) => note.add(data), { // [!code --]
        body: t.Object({ // [!code --]
            data: t.String() // [!code --]
        }), // [!code --]
    }) // [!code --]
    .put('/', ({ note, body: { data }, username }) =>
    	note.add({ data, author: username }),
     	{ // [!code ++]
     		body: 'memo' // [!code ++]
      	}
    ) // [!code ++]
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        }
    )
    .delete(
        '/:index',
        ({ note, params: { index }, error }) => {
            if (index in note.data) return note.remove(index)

            return error(422)
        }
    )
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error }) => { // [!code --]
            if (index in note.data) return note.update(index, data) // [!code --]
        ({ note, params: { index }, body: { data }, error, username }) => { // [!code ++]
        	if (index in note.data) // [!code ++]
         		return note.update(index, { data, author: username })) // [!code ++]

            return error(422)
        },
        {
            body: t.Object({ // [!code --]
                data: t.String() // [!code --]
            }), // [!code --]
            body: 'memo'
        }
    )
```

现在让我们导入并应用 `userService`、`getUserId` 来将授权应用于 **note** 控制器。

```typescript twoslash [note.ts]
// @errors: 2392 2300 2403 2345 2698
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: note.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { getUserId, userService } from './user' // [!code ++]

const memo = t.Object({
	data: t.String(),
	author: t.String()
})

type Memo = typeof memo.static

class Note {
    constructor(
		public data: Memo[] = [
			{
				data: 'Moonhalo',
				author: 'saltyaom'
			}
		]
	) {}

    add(note: Memo) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: Partial<Memo>) {
        return (this.data[index] = { ...this.data[index], ...note })
    }
}

export const note = new Elysia({ prefix: '/note' })
	.use(userService) // [!code ++]
    .decorate('note', new Note())
    .model({
        memo: t.Omit(memo, ['author'])
    })
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .use(getUserId) // [!code ++]
    .put(
        '/',
        ({ note, body: { data }, username }) =>
            note.add({ data, author: username }),
        {
            body: 'memo'
        }
    )
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error, username }) => {
            if (index in note.data)
                return note.update(index, { data, author: username })

            return error(422)
        },
        {
            isSignIn: true,
            body: 'memo'
        }
    )
```

就是这样 🎉

我们刚刚通过重用之前创建的服务实现了授权。

## 错误处理

API 最重要的一个方面是确保没有问题，如果发生了，我们需要正确处理它。

我们使用 `onError` 生命周期来捕获服务器抛出的任何错误。

::: code-group

```typescript twoslash [index.ts]
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note'
import { user } from './user'

const app = new Elysia()
    .use(swagger())
    .onError(({ error, code }) => { // [!code ++]
        if (code === 'NOT_FOUND') return // [!code ++]

        console.error(error) // [!code ++]
    }) // [!code ++]
    .use(user)
    .use(note)
    .listen(3000)
```

:::

我们刚刚添加了一个错误监听器，将捕获服务器抛出的任何错误，排除 **404 未找到**，并将其记录到控制台。

::: tip
注意 `onError` 在 `use(note)` 之前。这一点很重要，因为 Elysia 以自上而下的方式应用方法。监听器必须在路由之前应用。

由于 `onError` 应用于根实例，因此不需要定义范围，因为它将应用于所有子实例。
:::

返回一个真值将覆盖默认错误响应，因此我们可以返回一个自定义错误响应，同时继承状态码。

::: code-group

```typescript twoslash [index.ts]
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note'

const app = new Elysia()
    .use(swagger())
    .onError(({ error, code }) => { // [!code ++]
        if (code === 'NOT_FOUND') return 'Not Found :(' // [!code ++]

        console.error(error) // [!code ++]
    }) // [!code ++]
    .use(note)
    .listen(3000)
```

:::

### 可观察性

现在我们有一个工作中的 API，最后的点缀是确保在部署服务器后所有功能正常。

Elysia 默认支持 OpenTelemetry，使用 `@elysiajs/opentelemetry` 插件。

```bash
bun add @elysiajs/opentelemetry
```

确保有一个 OpenTelemetry 收集器在运行，否则我们将使用 Docker 启动 Jaeger。

```bash
docker run --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```

现在让我们将 OpenTelemetry 插件应用于我们的服务器。
::: code-group

```typescript twoslash [index.ts]
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry' // [!code ++]
import { swagger } from '@elysiajs/swagger'

import { note } from './note'
import { user } from './user'

const app = new Elysia()
    .use(opentelemetry()) // [!code ++]
    .use(swagger())
    .onError(({ error, code }) => {
        if (code === 'NOT_FOUND') return 'Not Found :('

        console.error(error)
    })
    .use(note)
    .use(user)
    .listen(3000)
```

:::

现在尝试进行更多请求并打开 http://localhost:16686 查看追踪信息。

选择服务 **Elysia**，点击 **查找追踪**，我们应该能够看到我们所做请求的列表。

![Jaeger showing list of requests](/tutorial/jaeger-list.webp)

点击任何请求以查看每个生命周期钩子处理请求所花费的时间。
![Jaeger showing request span](/tutorial/jaeger-span.webp)

点击根父跨度以查看请求的详细信息，这将显示请求和响应有效载荷，以及任何错误。
![Jaeger showing request detail](/tutorial/jaeger-detail.webp)

Elysia 直接支持 OpenTelemetry，它自动与支持 OpenTelemetry 的其他 JavaScript 库（如 Prisma、GraphQL Yoga、Effect 等）集成。

你还可以使用其他 OpenTelemetry 插件将追踪信息发送到其他服务，如 Zipkin、Prometheus 等。

## 代码库回顾
如果你跟着做，你应该有一个代码库如下所示：

::: code-group

```typescript twoslash [index.ts]
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: true) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
    .use(userService)
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get(
        '/sign-out',
        ({ cookie: { token } }) => {
            token.remove()

            return {
                success: true,
                message: 'Signed out'
            }
        },
        {
            cookie: 'optionalSession'
        }
    )
    .use(getUserId)
    .get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: note.ts
import { Elysia, t } from 'elysia'
import { getUserId, userService } from './user'

const memo = t.Object({
    data: t.String(),
    author: t.String()
})

type Memo = typeof memo.static

class Note {
    constructor(
        public data: Memo[] = [
            {
                data: 'Moonhalo',
                author: 'saltyaom'
            }
        ]
    ) {}

    add(note: Memo) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: Partial<Memo>) {
        return (this.data[index] = { ...this.data[index], ...note })
    }
}

export const note = new Elysia({ prefix: '/note' })
    .use(userService)
    .decorate('note', new Note())
    .model({
        memo: t.Omit(memo, ['author'])
    })
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .use(getUserId)
    .put(
        '/',
        ({ note, body: { data }, username }) =>
            note.add({ data, author: username }),
        {
            body: 'memo'
        }
    )
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error, username }) => {
            if (index in note.data)
                return note.update(index, { data, author: username })

            return error(422)
        },
        {
            isSignIn: true,
            body: 'memo'
        }
    )

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { note } from './note'
import { user } from './user'

const app = new Elysia()
    .use(opentelemetry())
    .use(swagger())
    .onError(({ error, code }) => {
        if (code === 'NOT_FOUND') return 'Not Found :('

        console.error(error)
    })
    .use(user)
    .use(note)
    .listen(3000)
```

```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
    .use(userService)
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get(
        '/sign-out',
        ({ cookie: { token } }) => {
            token.remove()

            return {
                success: true,
                message: 'Signed out'
            }
        },
        {
            cookie: 'optionalSession'
        }
    )
    .use(getUserId)
    .get('/profile', ({ username }) => ({
        success: true,
        username
    }))
```

```typescript twoslash [note.ts]
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        )
    })
    .model((model) => ({
        ...model,
        optionalSession: t.Optional(model.session)
    }))
    .macro(({ onBeforeHandle }) => ({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            onBeforeHandle(
                ({ error, cookie: { token }, store: { session } }) => {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            )
        }
    }))

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
    .use(getUserId)
    .get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: note.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { getUserId, userService } from './user'

const memo = t.Object({
    data: t.String(),
    author: t.String()
})

type Memo = typeof memo.static

class Note {
    constructor(
        public data: Memo[] = [
            {
                data: 'Moonhalo',
                author: 'saltyaom'
            }
        ]
    ) {}

    add(note: Memo) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: Partial<Memo>) {
        return (this.data[index] = { ...this.data[index], ...note })
    }
}

export const note = new Elysia({ prefix: '/note' })
    .use(userService)
    .decorate('note', new Note())
    .model({
        memo: t.Omit(memo, ['author'])
    })
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .use(getUserId)
    .put(
        '/',
        ({ note, body: { data }, username }) =>
            note.add({ data, author: username }),
        {
            body: 'memo'
        }
    )
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error, username }) => {
            if (index in note.data)
                return note.update(index, { data, author: username })

            return error(422)
        },
        {
            isSignIn: true,
            body: 'memo'
        }
    )
```

:::

## 生产环境构建
最后，我们可以使用 `bun build` 将服务器打包成二进制可用于生产：
```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts
```

该命令有点长，所以我们将其拆分：
1. `--compile` - 将 TypeScript 编译为二进制文件
2. `--minify-whitespace` - 删除不必要的空白
3. `--minify-syntax` - 压缩 JavaScript 语法以减少文件大小
4. `--target bun` - 目标为 `bun` 平台，这可以优化二进制文件以适应目标平台
5. `--outfile server` - 输出二进制文件为 `server`
6. `./src/index.ts` - 我们服务器的入口文件（代码库）

现在我们可以使用 `./server` 运行二进制文件，它将在 3000 端口启动服务器，效果与使用 `bun dev` 相同。
```bash
./server
```

打开浏览器并导航到 `http://localhost:3000/swagger`，你应该看到与使用开发命令相同的结果。

通过压缩二进制文件，我们不仅使服务器变得小巧且可移植，而且还显著减少了内存使用。

::: tip
Bun 确实有 `--minify` 标志，可以压缩二进制文件，但它包含 `--minify-identifiers`，而由于我们使用 OpenTelemetry，这会重命名函数名称，使追踪变得比应有的更困难。
:::

::: warning
练习：尝试同时运行开发服务器和生产服务器，并比较内存使用情况。

开发服务器将使用进程名称 'bun'，而生产服务器将使用名称 'server'。
:::

## 总结

好的，完成了 🎉

我们使用 Elysia 创建了一个简单的 API，学习了如何创建一个简单的 API、如何处理错误，以及如何使用 OpenTelemetry 观察我们的服务器。

你可以进一步尝试连接到一个真实的数据库，连接到一个真实的前端或实现基于 WebSocket 的实时通信。

本教程涵盖了创建 Elysia 服务器所需了解的大部分概念，但还有一些有用的概念你可能想知道。

### 如果你遇到问题

如果你有任何进一步的问题，请随时在 GitHub讨论、Discord和Twitter上询问我们的社区。

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        官方 ElysiaJS Discord 社区服务器
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        跟踪 Elysia 的更新和状态
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        源代码和开发
    </Card>
</Deck>

我们祝你在 Elysia 的旅程中好运 ❤️
