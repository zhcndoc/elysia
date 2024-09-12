---
title: Elysia 与 Supabase - 使用声速般的速度创建下一个后端
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 与 Supabase - 使用声速般的速度创建下一个后端

    - - meta
      - name: 'description'
        content: Elysia 和 Supabase 是快速开发原型工具的绝佳匹配，让我们来看看如何利用这两者的优势。

    - - meta
      - property: 'og:description'
        content: Elysia 和 Supabase 是快速开发原型工具的绝佳匹配，让我们来看看如何利用这两者的优势。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/elysia-supabase/elysia-supabase.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/elysia-supabase/elysia-supabase.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
  title="Elysia 与 Supabase - 使用声速般的速度创建下一个后端"
  src="/blog/elysia-supabase/elysia-supabase.webp"
  alt="Elysia 和 Supabase 像 CPU 一样紧密相拥"
  author="saltyaom"
  date="2023 年 3 月 10 日"
>

Supabase，一个开源的 Firebase 替代品，已经成为开发者们最喜爱的工具之一，因其快速开发而闻名。

它提供了 PostgreSQL、现成的用户认证、无服务器边缘函数、云存储等功能，而且这些功能都是即用的。

Supabase 已经预构建和组合了你可能需要重复 100 次的相同特性，只需要不到 10 行的代码。

例如，认证功能，你可能需要在每个项目中重写 100 行代码，而现在，你只需要：

```ts
supabase.auth.signUp(body)

supabase.auth.signInWithPassword(body)
```

Supabase 会处理剩下的工作，包括发送确认邮件、使用魔法链接或一次性密码进行认证，以及使用行级认证来保护你的数据库，等等。

许多需要数小时重复的操作，现在只需几分钟就能完成。

## Elysia

如果你还没有听说过 Elysia，它是一个以速度和开发者体验为核心的 Bun-first 网络框架。

Elysia 的性能比 Express 快了近 20 倍，同时几乎与 Express 和 Fastify 拥有相同的语法。

(性能可能会有所不同，我们建议你在你自己的机器上运行[基准测试](https://github.com/SaltyAom/bun-http-framework-benchmark)，然后再决定性能。)

Elysia 提供了一个非常流畅的开发者体验。
不仅可以定义单一的类型来源，还能在数据发生变化时发出警告。

这一切都是在声明式的少行代码中完成的。

## 设置

你可以使用 Supabase Cloud 来快速开始。

Supabase Cloud 将为你设置数据库、扩展和云中的一切，只需单击一下。

<img class="-png" src="/blog/elysia-supabase/supabase-web.webp" alt="Supabase 首页" />

创建项目时，你将看到类似这样的页面，填写你所需的所有请求。如果你在亚洲，Supabase 在新加坡和东京都有服务器。

##### 有时这是对亚洲开发者的一个决定性因素，因为它们有助于降低延迟。

<img class="-png" src="/blog/elysia-supabase/supabase-create-project.webp" alt="创建新的 Supabase 项目" />

创建项目后，您应该在欢迎页面上打招呼，您可以在那里复制项目 URL 和服务角色。

两者都用于指示您在项目中使用的 Supabase 项目。

如果你错过了欢迎页面，你可以导航到**设置 > API**，复制**项目 URL** 和**项目 API 密钥**。

<img class="-png" src="/blog/elysia-supabase/supabase-config.webp" alt="Supabase Config Page" />

现在，在命令行中，你可以创建 Elysia 项目，运行：

```bash
bun create elysia elysia-supabase
```

最后一个参数是我们想让 Bun 创建的文件夹名称，你可以根据自己的喜好更改名称。

现在，**cd** 进入我们的文件夹。由于我们将使用 Elysia 0.3 (RC) 中的一个新特性，我们首先需要安装 Elysia RC 频道，并且让我们也安装我们将使用的 cookie 插件和 Supabase 客户端。

```bash
bun add elysia@rc @elysiajs/cookie@rc @supabase/supabase-js
```

让我们创建一个**。env** 文件来加载我们的 Supabase 服务加载作为密钥。

```bash
# .env
supabase_url=https://********************.supabase.co
supabase_service_role=**** **** **** ****
```

你不需要安装任何插件来加载环境文件，因为 Bun 默认加载**。env** 文件。

现在，打开我们的项目，创建一个文件在 `src/libs/supabase.ts`。

```ts
// src/libs/supabase.ts
import { createClient } from '@supabase/supabase-js'

const { supabase_url, supabase_service_role } = process.env

export const supabase = createClient(supabase_url!, supabase_service_role!)
```

就这样！这就是你设置 Supabase 和 Elysia 项目所需的所有内容。

现在，让我们开始实现！

## 认证

现在，让我们创建一个认证路由，与主要文件分开。

创建 `src/modules/authen.ts` 文件，首先为我们的路由创建一个轮廓。

```ts
// src/modules/authen.ts
import { Elysia } from 'elysia'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post('/sign-up', () => {
                return '这个路由预期用于注册用户'
            })
            .post('/sign-in', () => {
                return '这个路由预期用于登录用户'
            })
    )
```

现在，让我们使用 Supabase 来实现用户认证。

```ts
// src/modules/authen.ts
import { Elysia } from 'elysia'
import { supabase } from '../../libs'  // [!code ++]

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post('/sign-up', async ({ body }) => {
                const { data, error } = await supabase.auth.signUp(body) // [!code ++]
 // [!code ++]
                if (error) return error // [!code ++]

                return data.user // [!code ++]
                return '这个路由预期用于注册用户' // [!code --]
            })
            .post('/sign-in', async ({ body }) => {
                const { data, error } = await supabase.auth.signInWithPassword( // [!code ++]
                    body // [!code ++]
                ) // [!code ++]
 // [!code ++]
                if (error) return error // [!code ++]
 // [!code ++]
                return data.user // [!code ++]
                return '这个路由预期用于登录用户' // [!code --]
            })
    )
```

而且-完成！这就是创建用户的**登录**和**注册**路由所需要的全部内容。

但是我们这里有个小问题，你看，我们的路由可以接受**任何**请求主体并将其放入 Supabase 参数中，即使是无效的请求主体。

因此，为了确保我们放入正确的数据，我们可以为请求主体定义一个模式。

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post(
                '/sign-up',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.signUp(body)

                    if (error) return error

                    return data.user
                },
                { // [!code ++]
                    schema: { // [!code ++]
                        body: t.Object({ // [!code ++]
                            email: t.String({ // [!code ++]
                                format: 'email' // [!code ++]
                            }), // [!code ++]
                            password: t.String({ // [!code ++]
                                minLength: 8 // [!code ++]
                            }) // [!code ++]
                        }) // [!code ++]
                    } // [!code ++]
                } // [!code ++]
            )
            .post(
                '/sign-in',
                async ({ body }) => {
                    const { data, error } =
                        await supabase.auth.signInWithPassword(body)

                    if (error) return error

                    return data.user
                },
                { // [!code ++]
                    schema: { // [!code ++]
                        body: t.Object({ // [!code ++]
                            email: t.String({ // [!code ++]
                                format: 'email' // [!code ++]
                            }), // [!code ++]
                            password: t.String({ // [!code ++]
                                minLength: 8 // [!code ++]
                            }) // [!code ++]
                        }) // [!code ++]
                    } // [!code ++]
                } // [!code ++]
            )
    )
```

现在我们在**登录**和**注册**中声明一个模式，Elysia 会确保传入的数据体与我们声明的形式相同，以防止无效参数传入 `supabase.auth`。

Elysia 也了解模式，因此她不需要单独声明 TypeScript 的类型，而是自动将 `body` 类型定义为您定义的模式。

因此，如果您意外地在将来创建了一个破坏性的变更，Elysia 会提醒您有关数据类型。

我们拥有的代码很棒，它完成了我们预期的工作，但我们可以再进一步。

您知道，**登录**和**注册**都接受相同形状的数据，在未来，您可能会发现自己在多个路由中重复一个很长的模式。

我们可以通过告诉 Elysia 记住我们的模式来解决这个问题，然后告诉 Elysia 我们要使用哪个模式的名字。

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .setModel({ // [!code ++]
                sign: t.Object({ // [!code ++]
                    email: t.String({ // [!code ++]
                        format: 'email' // [!code ++]
                    }), // [!code ++]
                    password: t.String({ // [!code ++]
                        minLength: 8 // [!code ++]
                    }) // [!code ++]
                }) // [!code ++]
            }) // [!code ++]
            .post(
                '/sign-up',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.signUp(body)

                    if (error) return error
                    return data.user
                },
                {
                    schema: {
                        body: 'sign', // [!code ++]
                        body: t.Object({ // [!code --]
                            email: t.String({ // [!code --]
                                format: 'email' // [!code --]
                            }), // [!code --]
                            password: t.String({ // [!code --]
                                minLength: 8 // [!code --]
                            }) // [!code --]
                        }) // [!code --]
                    }
                }
            )
            .post(
                '/sign-in',
                async ({ body }) => {
                    const { data, error } =
                        await supabase.auth.signInWithPassword(body)

                    if (error) return error

                    return data.user
                },
                {
                    schema: {
                        body: 'sign', // [!code ++]
                        body: t.Object({ // [!code --]
                            email: t.String({ // [!code --]
                                format: 'email' // [!code --]
                            }), // [!code --]
                            password: t.String({ // [!code --]
                                minLength: 8 // [!code --]
                            }) // [!code --]
                        }) // [!code --]
                    }
                }
            )
    )
```

太棒了！我们刚刚在路由中使用了名称引用。

::: tip
如果你发现自己在长 schema 中，你可以在一个单独的文件中声明它们，然后在任何 Elysia 路由中重用它们，以将注意力重新集中在业务逻辑上。
:::

## 存储用户会话

太好了，现在我们需要做的最后一件事就是存储用户会话。登录后，用户会收到一个包含 `access_token` 和 `refresh_token` 的令牌。

`access_token` 是一个短寿命的 JWT 令牌，用于在短时间内认证用户。
`refresh_token` 是一个一次性使用的永远不过期的令牌，用于刷新 `access_token`。只要我们拥有这个令牌，我们就可以创建一个新的 `access_token` 来延长用户会话。

我们可以在 cookie 中存储这两个值。

现在，有些人可能不喜欢在 cookie 中存储 `access_token`，可能会选择使用 Bearer 令牌。但为了简单起见，我们将在 cookie 中存储它。

::: tip
我们可以设置 cookie 为 `HttpOnly` 来防止 XSS，`Secure`，`Same-Site`，还可以加密 cookie 来防止中间人攻击。
:::

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { cookie } from '@elysiajs/cookie' // [!code ++]

import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .use( // [!code ++]
                cookie({ // [!code ++]
                    httpOnly: true, // [!code ++]
                    // 如果你需要 cookie 仅通过 https 传输 // [!code ++]
                    // secure: true, // [!code ++]
                    // // [!code ++]
                    // 如果你需要 cookie 只对同站有效 // [!code ++]
                    // sameSite: "strict", // [!code ++]
                    // // [!code ++]
                    // 如果你想加密 cookie // [!code ++]
                    // signed: true, // [!code ++]
                    // secret: process.env.COOKIE_SECRET, // [!code ++]
                }) // [!code ++]
            ) // [!code ++]
            .setModel({
                sign: t.Object({
                    email: t.String({
                        format: 'email'
                    }),
                    password: t.String({
                        minLength: 8
                    })
                })
            })
            // 其余代码
    )
```

这就是创建 Elysia 和 Supabase 的**登录**和**注册**路由所需的全部步骤！

<img class="-png" src="/blog/elysia-supabase/lagrange-sign-in.webp" alt="使用 Rest Client 登录" />

## 刷新令牌

如前所述，access_token 的有效期有限，我们可能需要不时地更新令牌。

幸运的是，我们可以通过 Supabase 中的一行代码来实现。

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .setModel({
                sign: t.Object({
                    email: t.String({
                        format: 'email'
                    }),
                    password: t.String({
                        minLength: 8
                    })
                })
            })
            .post(
                '/sign-up',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.signUp(body)

                    if (error) return error
                    return data.user
                },
                {
                    schema: {
                        body: 'sign'
                    }
                }
            )
            .post(
                '/sign-in',
                async ({ body }) => {
                    const { data, error } =
                        await supabase.auth.signInWithPassword(body)

                    if (error) return error

                    return data.user
                },
                {
                    schema: {
                        body: 'sign'
                    }
                }
            )
            .get( // [!code ++]
                '/refresh', // [!code ++]
                async ({ setCookie, cookie: { refresh_token } }) => { // [!code ++]
                    const { data, error } = await supabase.auth.refreshSession({ // [!code ++]
                        refresh_token // [!code ++]
                    }) // [!code ++]
 // [!code ++]
                    if (error) return error // [!code ++]
 // [!code ++]
                    setCookie('refresh_token', data.session!.refresh_token) // [!code ++]
 // [!code ++]
                    return data.user // [!code ++]
                } // [!code ++]
            ) // [!code ++]
    )
```

最后，将路由添加到主服务器。
```ts
import { Elysia, t } from 'elysia'

import { auth } from './modules' // [!code ++]

const app = new Elysia()
    .use(auth) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

就是这样！

## 授权路由

我们刚刚实现了具有乐趣和游戏性的用户认证，但现在您可能发现自己需要为每条路由进行授权，并且在各个地方重复相同的代码来检查 cookie。

幸运的是，我们可以在 Elysia 中重复使用该函数。

让我们举个例子，我们可能希望用户创建一个简单的博客文章，该文章可以具有以下数据库架构：

在 Supabse 控制台内，我们将创建一个名为 ‘post’ 的 Postgres 表，如下所示：
<img class="-png" src="/blog/elysia-supabase/supabase-create-table.webp" alt="Creating table using Supabase UI, in the public table with the name of 'post', and a columns of 'id' with type of 'int8' as a primary value, 'created_at' with type of 'timestamp' with default value of 'now()', 'user_id' linked to Supabase's user schema linked as 'user.id', and 'post' with type of 'text'" />

**user_id** 链接到 Supabase 生成的 **auth** 表，链接为 **user.id**，利用这个关系，我们可以创建基于行级安全性的功能，只允许帖子的所有者修改数据。

<img class="-png" src="/blog/elysia-supabase/supabase-create-table-link.webp" alt="Linking the 'user_id' field with Supabase's user schema as 'user.id'" />

现在，让我们在另一个文件夹中创建一个新的单独的 Elysia 路由，以将代码与 auth 路由分离开，位于 `src/modules/post/index.ts` 中。

```ts
// src/modules/post/index.ts
import { Elysia, t } from 'elysia'

import { supabase } from '../../libs'

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app.put(
            '/create',
            async ({ body }) => {
                const { data, error } = await supabase
                    .from('post')
                    .insert({
                        // Add user_id somehow
                        // user_id: userId,
                        ...body
                    })
                    .select('id')

                if (error) throw error

                return data[0]
            },
            {
                schema: {
                    body: t.Object({
                        detail: t.String()
                    })
                }
            }
        )
    )
```

现在，这条路由可以接受请求体并将其放入数据库中，我们所要做的只剩下处理授权和提取 `user_id`。

幸运的是，我们可以很容易地通过 Supabase 和我们的 cookies 来完成这个任务。

```ts
import { Elysia, t } from 'elysia'
import { cookie } from '@elysiajs/cookie' // [!code ++]

import { supabase } from '../../libs'

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app.put(
            '/create',
            async ({ body }) => {
                let userId: string // [!code ++]
   // [!code ++]
                const { data, error } = await supabase.auth.getUser( // [!code ++]
                    access_token // [!code ++]
                ) // [!code ++]
   // [!code ++]
                if(error) { // [!code ++]
                    const { data, error } = await supabase.auth.refreshSession({ // [!code ++]
                        refresh_token // [!code ++]
                    }) // [!code ++]
   // [!code ++]
                    if (error) throw error // [!code ++]
   // [!code ++]
                    userId = data.user!.id // [!code ++]
                } // [!code ++]

                const { data, error } = await supabase
                    .from('post')
                    .insert({
                        // Add user_id somehow
                        // user_id: userId,
                        ...body
                    })
                    .select('id')

                if (error) throw error

                return data[0]
            },
            {
                schema: {
                    body: t.Object({
                        detail: t.String()
                    })
                }
            }
        )
    )
```

太好了！现在我们可以使用 **supabase.auth.getUser** 从我们的 cookie 中提取 `user_id`

## 衍生
我们的代码目前运行良好，但让我们做个小插曲。

假设你有很多需要授权的路由，就像这样，需要提取 `userId`，这意味着你在这里将有很多重复的代码，对吧？

幸运的是，Elysia 是专门设计来解决这个问题的。

---

在 Elysia，我们有一种叫做 **scope** 的东西。

想象一下它就像 **closure**，在这里只有一个变量可以在其中使用，或者如果你来自 Rust 的话，那就是所有权。

在像 **group**、**guard** 这样的作用域中声明的任何生命周期将只在该作用域中可用。

这意味着您可以将特定的生命周期声明给特定的路由在作用域内。

例如，需要授权的路由范围，而其他根本不需要。

所以，我们不是重复使用所有那些代码，而是定义了一次，然后将其应用于您需要的所有路由。

---

现在，让我们将检索 **user_id** 的功能移动到一个插件中，并将其应用于范围内的所有路由。

让我们将这个插件放在 `src/libs/authen.ts` 中。

```ts
import { Elysia } from 'elysia'
import { cookie } from '@elysiajs/cookie'

import { supabase } from './supabase'

export const authen = (app: Elysia) =>
    app
        .use(cookie())
        .derive(
            async ({ setCookie, cookie: { access_token, refresh_token } }) => {
                const { data, error } = await supabase.auth.getUser(
                    access_token
                )

                if (data.user)
                    return {
                        userId: data.user.id
                    }

                const { data: refreshed, error: refreshError } =
                    await supabase.auth.refreshSession({
                        refresh_token
                    })

                if (refreshError) throw error

                return {
                    userId: refreshed.user!.id
                }
            }
        )
```

这段代码试图提取 `userId`，并在路由的上下文中添加 `userId`，否则将抛出错误，防止无效的错误进入我们的业务逻辑，即 `supabase.from.insert`。

::: tip
我们也可以使用 **onBeforeHandle** 创建一个自定义验证，在进入主要处理程序之前，`.derive` 也做同样的事情，但是 `.derive` 返回的任何内容都会添加到 **Context** 中，而 **onBeforeHandle** 则不会。

实际上，**derive** 在背后使用 **transform**。
:::

并且用一行代码，我们将所有路由应用到 scope 内的授权路由，类型安全的访问 `userId`。

```ts
import { Elysia, t } from 'elysia'

import { authen, supabase } from '../../libs' // [!code ++]

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app
            .use(authen) // [!code ++]
            .put(
                '/create',
                async ({ body, userId }) => { // [!code ++]
                    let userId: string // [!code --]
    // [!code --]
                    const { data, error } = await supabase.auth.getUser( // [!code --]
                        access_token // [!code --]
                    ) // [!code --]
    // [!code --]
                    if(error) { // [!code --]
                        const { data, error } = await supabase.auth.refreshSession({ // [!code --]
                            refresh_token // [!code --]
                        }) // [!code --]
    // [!code --]
                        if (error) throw error // [!code --]
    // [!code --]
                        userId = data.user!.id // [!code --]
                    } // [!code --]

                    const { data, error } = await supabase
                        .from('post')
                        .insert({
                            user_id: userId, // [!code ++]
                            ...body
                        })
                        .select('id')

                    if (error) throw error

                    return data[0]
                },
                {
                    schema: {
                        body: t.Object({
                            detail: t.String()
                        })
                    }
                }
            )
    )

```

很棒对吧？我们甚至不需要像魔术一样查看代码来处理授权。

把我们的焦点重新放在我们的核心业务逻辑上。

<img class="-png" src="/blog/elysia-supabase/lagrange-create-post.webp" alt="Using Rest Client to create post" />

## 非授权范围
现在，让我们为数据库创建一个新路由来获取帖子。

```ts
import { Elysia, t } from 'elysia'

import { authen, supabase } from '../../libs'

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app
            .get('/:id', async ({ params: { id } }) => { // [!code ++]
                const { data, error } = await supabase // [!code ++]
                    .from('post') // [!code ++]
                    .select() // [!code ++]
                    .eq('id', id) // [!code ++]
 // [!code ++]
                if (error) return error // [!code ++]
 // [!code ++]
                return { // [!code ++]
                    success: !!data[0], // [!code ++]
                    data: data[0] ?? null // [!code ++]
                } // [!code ++]
            }) // [!code ++]
            .use(authen)
            .put(
                '/create',
                async ({ body, userId }) => {
                    const { data, error } = await supabase
                        .from('post')
                        .insert({
                            // Add user_id somehow
                            // user_id: userId,
                            ...body
                        })
                        .select('id')

                    if (error) throw error

                    return data[0]
                },
                {
                    schema: {
                        body: t.Object({
                            detail: t.String()
                        })
                    }
                }
            )
    )
```

我们使用成功来指示是否找到了帖子。
<img class="-png" src="/blog/elysia-supabase/lagrange-get-post-success.webp" alt="使用 REST 客户端获取帖子" />

如果没有找到，我们将返回 `success: false` 和 `data: null`。
<img class="-png" src="/blog/elysia-supabase/lagrange-get-post-failed.webp" alt="使用 REST 客户端获取帖子但失败" />

正如我们之前提到的，`.use(authen)` 应用到 scope 中，但是只有在其后面的路由，这意味着任何在其前面的路由都不会受到影响，而任何在其后面的路由现在都是强制授权的。

最后，不要忘记将路由添加到主服务器。
```ts
import { Elysia, t } from 'elysia'

import { auth, post } from './modules' // [!code ++]

const app = new Elysia()
    .use(auth)
    .use(post) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```


## 奖励：文档

作为一个奖励，在我们创建完所有内容之后，而不是一条一条地告知路径，我们可以为我们的前端开发人员创建一行的文档。

使用 Swagger 插件，我们可以安装：

```bash
bun add @elysiajs/swagger@rc
```

And then just add the plugin:

```ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger' // [!code ++]

import { auth, post } from './modules'

const app = new Elysia()
    .use(swagger()) // [!code ++]
    .use(auth)
    .use(post)
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

塔达 🎉 我们为我们的 API 准备了明确定义的文档。

<img class="-png" src="/blog/elysia-supabase/elysia-swagger.webp" alt="Swagger documentation generated by Elysia" />

如果有更多内容，您不必担心可能会忘记 OpenAPI Schema 3.0 的规范，我们还拥有自动补全和类型安全功能。

我们可以使用 `schema.detail` 来定义我们的路由详细信息，这也遵循 OpenAPI Schema 3.0，因此您可以正确地创建文档。
<img class="-png" src="/blog/elysia-supabase/swagger-auto-complete.webp" alt="Using auto-completion with `schema.detail`" />

## 下一步是什么

下一步，我们鼓励您尝试和探索更多[我们刚刚在本文中编写的代码](https://github.com/saltyaom/elysia-supabase-example)，并尝试添加图像上传帖子，以探索 Supabase 和 Elysia 生态系统。

正如我们所看到的，使用 Supabase 创建一个生产就绪的 Web 服务器超级简单，许多事情只是单行本，方便快速开发。

特别是当与 Elysia 配对时，您将获得出色的开发人员体验，声明模式作为唯一真理来源，以及在使用 TypeScript 时创建 API、高性能服务器的经过深思熟虑的设计选择，作为奖励，我们可以在一行中创建文档。

Elysia 正在用新技术和新方法创建 Bun-first 网络框架。

如果您对 Elysia 感兴趣，请随时查看我们的 [Discord 服务器](https://discord.gg/eaFJ2KDJck)或查看 [GitHub 上的 Elysia](https://github.com/elysiajs/elysia)

此外，您可能想要查看 [Elysia Eden](/eden/overview)，这是一个完全类型安全、无代码生成的获取客户端，如 Elysia 服务器的 tRPC。
</Blog>
