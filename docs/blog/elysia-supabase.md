---
title: Elysia 与 Supabase：您下一个以超音速构建的后端
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 与 Supabase：您下一个以超音速构建的后端

    - - meta
      - name: 'description'
        content: Elysia 和 Supabase 结合，适合快速开发原型，时间少于一个小时，让我们看看如何利用这两者的优势。

    - - meta
      - property: 'og:description'
        content: Elysia 和 Supabase 结合，适合快速开发原型，时间少于一个小时，让我们看看如何利用这两者的优势。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-supabase/elysia-supabase.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-supabase/elysia-supabase.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
  title="Elysia 与 Supabase：您下一个以超音速构建的后端"
  src="/blog/elysia-supabase/elysia-supabase.webp"
  alt="Elysia 和 Supabase 像 CPU 一样紧密相连"
  author="saltyaom"
  date="2023 年 3 月 10 日"
>

Supabase 是一个开源的 Firebase 替代品，已成为开发者们快速开发的热门工具包。

它提供了 PostgreSQL、即用型用户认证、无服务器边缘功能、云存储等功能，供您随时使用。

因为 Supabase 已经预构建并组合了情境，您可以减少重复开发相同功能的代码行数，将其缩短到不到 10 行代码。

例如，对于认证，这通常需要您为每个项目重写一百行代码，仅需：

```ts
supabase.auth.signUp(body)

supabase.auth.signInWithPassword(body)
```

然后 Supabase 将处理剩余的部分，通过发送确认链接来验证电子邮件，或者使用一个魔术链接或一次性密码 (OTP) 进行认证，确保您的数据库拥有行级认证，您说了算。

在每个项目中需要耗费数小时重新做的事情，现在只需一分钟即可完成。

## Elysia

如果您还没有听说，Elysia 是一个以 Bun 为核心的 web 框架，旨在提升速度和开发者体验。

Elysia 的性能比 Express 快近 20 倍，同时其语法几乎与 Express 和 Fastify 相同。

###### （性能可能因机器而异，我们建议您在决定性能之前在您的机器上运行 [基准测试](https://github.com/SaltyAom/bun-http-framework-benchmark)）

Elysia 提供了极为灵活的开发者体验。
不仅可以定义单一事实来源类型，并且在您意外修改数据时还可以检测并报警。

这一切都通过简洁的声明式代码实现。

## 设置

您可以使用 Supabase Cloud 快速入门。

Supabase Cloud 将处理数据库的设置、扩展和您在云中所需的所有内容，只需单击一下即可完成。

<img class="-png" src="/blog/elysia-supabase/supabase-web.webp" alt="Supabase 登陆页面" />

创建项目时，您应该会看到类似以下界面，填写所有所需的请求，如果您在亚洲，Supabase 在新加坡和东京都有服务器。

##### （有时这对生活在亚洲的开发者来说是一个决定性因素，因为延迟问题）

<img class="-png" src="/blog/elysia-supabase/supabase-create-project.webp" alt="创建新的 Supabase 项目" />

创建项目后，您应该会看到一个欢迎屏幕，可以在其中复制项目 URL 和服务角色。

这两者用于指示您在项目中使用的是哪个 Supabase 项目。

如果您错过了欢迎页面，请导航到 **设置 > API**，复制 **项目 URL** 和 **项目 API 密钥**。

<img class="-png" src="/blog/elysia-supabase/supabase-config.webp" alt="Supabase 配置页面" />

现在在您的命令行中，通过运行以下命令开始创建 Elysia 项目：

```bash
bun create elysia elysia-supabase
```

最后一个参数是我们要创建的 Bun 文件夹名称，可以随意更改该名称。

现在，**cd** 进入我们的文件夹，因我们将使用 Elysia 0.3 (RC) 中的新功能，所以需要先安装 Elysia 的 RC 通道，并在这里获取一个 Cookie 插件和将来要使用的 Supabase 客户端。

```bash
bun add elysia@rc @elysiajs/cookie@rc @supabase/supabase-js
```

让我们创建一个 **.env** 文件以将 Supabase 服务加载为秘密。

```bash
# .env
supabase_url=https://********************.supabase.co
supabase_service_role=**** **** **** ****
```

您不必安装任何插件来加载环境文件，因为 Bun 默认会加载 **.env** 文件。

现在让我们在我们喜欢的 IDE 中打开我们的项目，并在 `src/libs/supabase.ts` 中创建一个文件。

```ts
// src/libs/supabase.ts
import { createClient } from '@supabase/supabase-js'

const { supabase_url, supabase_service_role } = process.env

export const supabase = createClient(supabase_url!, supabase_service_role!)
```

就这样！设置 Supabase 和 Elysia 项目所需的一切。

现在让我们深入实现！

## 认证

现在让我们创建一个与主文件分开的认证路由。

在 `src/modules/authen.ts` 中，首先为我们的路由创建大纲。

```ts
// src/modules/authen.ts
import { Elysia } from 'elysia'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post('/sign-up', () => {
                return 'This route is expected to sign up a user'
            })
            .post('/sign-in', () => {
                return 'This route is expected to sign in a user'
            })
    )
```

现在，让我们应用 Supabase 来认证我们的用户。

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
                return 'This route is expected to sign up a user' // [!code --]
            })
            .post('/sign-in', async ({ body }) => {
                const { data, error } = await supabase.auth.signInWithPassword( // [!code ++]
                    body // [!code ++]
                ) // [!code ++]
 // [!code ++]
                if (error) return error // [!code ++]
 // [!code ++]
                return data.user // [!code ++]
                return 'This route is expected to sign in a user' // [!code --]
            })
    )
```

完成了！这就是为我们的用户创建 **sign-in** 和 **sign-up** 路由所需的一切。

但我们这里有一个小问题，您会看到，我们的路由可以接受 **任何** 请求体并将其放入 Supabase 参数，甚至是无效的。

所以，为了确保我们放入正确的数据，我们可以为我们的请求体定义一个 schema。

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

现在我们在 **sign-in** 和 **sign-up** 中都声明了一个 schema，Elysia 将确保传入的请求体与我们声明的格式相同，从而防止无效参数传递给 `supabase.auth`。

Elysia 还理解该 schema，因此不需要单独声明 TypeScript 的类型，Elysia 会自动将 `body` 的类型设为您定义的 schema。

因此，如果您意外在将来创建了破坏性更改，Elysia 会警告您有关数据类型的信息。

我们的代码非常出色，完成了我们期待的工作，但我们可以进一步优化。

您会看到，**sign-in** 和 **sign-up** 都接受相同形状的数据，未来，您可能还会发现自己在多个路由中重复一个长 schema。

我们可以通过告诉 Elysia 记住我们的 schema 来解决这个问题，然后我们可以通过告诉 Elysia 我们要使用的 schema 的名称来使用它。

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

太好了！我们在路由中只是使用了名称引用！

::: tip
如果您发现自己有一个长 schema，可以将它们声明在一个单独的文件中，并在 Elysia 的任何路由中重新使用，从而将重点放回业务逻辑上。
:::

## 存储用户会话

太好了，现在为完成认证系统，我们需要做的最后一件事是存储用户会话，在用户登录后，Supabase 中的令牌称为 `access_token` 和 `refresh_token`。

`access_token` 是一个短期有效的 JWT 访问令牌，用于在短时间内验证用户。
`refresh_token` 是一个一次性使用且永不过期的令牌，用于续订 `access_token`。所以只要我们有这个令牌，我们就可以创建一个新的访问令牌来延长我们的用户会话。

我们可以将这两个值存储在一个 cookie 中。

现在，有些人可能不喜欢将访问令牌存储在 cookie 中，可能会使用 Bearer，但为了简单起见，我们将在这里使用 cookie。

::: tip
我们可以将 cookie 设置为 **HttpOnly** 以防止 XSS，设置为 **Secure** 和 **Same-Site**，还可以加密 cookie 以防止中间人攻击。
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
                    // 如果需要 cookie 仅通过 https 发送 // [!code ++]
                    // secure: true, // [!code ++]
                    // // [!code ++]
                    // 如果需要 cookie 仅对同源可用 // [!code ++]
                    // sameSite: "strict", // [!code ++]
                    // // [!code ++]
                    // 如果希望加密 cookie // [!code ++]
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

就这样，创建了 Elysia 和 Supabase 的 **sign-in** 和 **sign-up** 路由！

<img class="-png" src="/blog/elysia-supabase/lagrange-sign-in.webp" alt="使用 Rest 客户端登录" />

## 刷新令牌

如前所述，`access_token` 是短期有效的，我们可能需要时不时地续订令牌。

幸运的是，我们可以用 Supabase 的一行代码做到这一点。

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

最后，将路由添加到主服务器中。
```ts
import { Elysia, t } from 'elysia'

import { auth } from './modules' // [!code ++]

const app = new Elysia()
    .use(auth) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia 正在运行在 ${app.server?.hostname}:${app.server?.port}`
)
```

就这样！

## 授权路由

我们刚刚实现了用户认证，这很有趣，但现在您可能会发现自己需要对每个路由进行授权，并且在各处重复相同的代码来检查 cookie。

幸运的是，我们可以在 Elysia 中重用这个函数。

让我们通过说，假设我们可能希望用户创建一个简单的博客帖子，而其数据库架构如下：

在 Supabse 控制台中，我们将创建一个名为 'post' 的 Postgres 表，如下所示：
<img class="-png" src="/blog/elysia-supabase/supabase-create-table.webp" alt="使用 Supabase UI 创建表，公共表名为 'post'，列为 'id'，主键类型为 'int8'，'created_at' 类型为 'timestamp'，默认值为 'now()'，'user_id' 链接到 Supabase 的用户架构 'user.id'，'post' 的类型为 'text'" />

**user_id** 链接到 Supabase 生成的 **auth** 表，链接为 **user.id**，通过这种关系，我们可以创建行级安全性，只允许帖子的所有者修改数据。

<img class="-png" src="/blog/elysia-supabase/supabase-create-table-link.webp" alt="将 'user_id' 字段与 Supabase 的用户架构 'user.id' 连接" />

现在，让我们在另一个文件夹中创建一个新的 Elysia 路由，以将代码与认证路由分开，文件路径为 `src/modules/post/index.ts`。

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
                        // 以某种方式添加 user_id
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

现在，此路由可以接受请求体并将其放入数据库中，我们需要做的唯一事情是处理授权并提取 `user_id`。

幸运的是，由于 Supabase 和我们的 cookies，这一切都很简单。

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
                        // 以某种方式添加 user_id
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

太好了！现在我们可以使用 **supabase.auth.getUser** 从 cookie 中提取 `user_id`。

## 派生
我们的代码目前运行良好，但让我们描绘一个小场景。

假设您有许多需要授权的路由，像这样，您需要提取 `userId`，这意味着您将拥有大量重复的代码，对吧？

幸运的是，Elysia 特别设计用于解决这个问题。

---

在 Elysia 中，我们有一个名为 **scope** 的概念。

想象一下，这就像一个 **闭包**，其中变量只能在一个范围内使用，或者如果您来自 Rust，它就像所有权。

在范围内声明的任何生命周期，例如 **group**、**guard**，都只会在该范围内可用。

这意味着您可以为需要授权的特定路由声明一个特定的生命周期，而其他路由则不需要。

例如，某些需要授权的路由范围，而其他则不需要。

因此，我们没有重复使用所有代码，而是定义了一次，并将其应用于您需要的所有路由。

---

现在，让我们将获取 **user_id** 的过程放入一个插件中，并将其应用于该范围内的所有路由。

让我们将此插件放在 `src/libs/authen.ts` 中。

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

此代码尝试提取 userId，并将 `userId` 添加到路由的 `Context` 中，否则将抛出错误并跳过处理程序，防止无效错误被放入我们的业务逻辑，即 **supabase.from.insert**。

::: tip
我们也可以使用 **onBeforeHandle** 创建自定义验证，以便在进入主处理程序之前进行验证，而 **.derive** 则会执行相同的操作，任何从 **derive** 返回的内容都会添加到 **Context** 中，而 **onBeforeHandle** 则不会。

从技术上讲，**derive** 使用 **transform** 作为底层机制。
:::

只需一行代码，我们就可以将所有路径都应用到该作用域内，并以类型安全的方式访问 **userId**。

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

太好了！我们在代码中根本看不到处理授权的部分，简直像魔法一样。

将我们的注意力重新放回核心业务逻辑中。

<img class="-png" src="/blog/elysia-supabase/lagrange-create-post.webp" alt="使用 Rest 客户端创建帖子" />

## 非授权作用域
现在让我们再创建一个路由，从数据库中获取帖子。

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
                            // 以某种方式添加 user_id
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

我们使用 `success` 来指示帖子是否存在。
<img class="-png" src="/blog/elysia-supabase/lagrange-get-post-success.webp" alt="使用 Rest 客户端通过 ID 获取帖子" />

如果不存在，我们将返回 `success: false` 和 `data: null`。
<img class="-png" src="/blog/elysia-supabase/lagrange-get-post-failed.webp" alt="使用 Rest 客户端尝试获取帖子的 ID 但失败" />

如前所述，`.use(authen)` 应用于被定义在自己后面的作用域 **但**，这意味着在之前的语句不会受到影响，而此后则为仅限授权的路由。

最后，不要忘记将路由添加到主服务器中。
```ts
import { Elysia, t } from 'elysia'

import { auth, post } from './modules' // [!code ++]

const app = new Elysia()
    .use(auth)
    .use(post) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia 正在运行在 ${app.server?.hostname}:${app.server?.port}`
)
```


## 奖励：文档

作为奖励，在我们创建的一切之后，除了逐条告诉前端开发人员外，我们可以只需一行代码为他们创建文档。

使用 Swagger 插件，我们可以安装:

```bash
bun add @elysiajs/swagger@rc
```

然后只需添加插件：

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
    `🦊 Elysia 正在运行在 ${app.server?.hostname}:${app.server?.port}`
)
```

瞧 🎉 我们为我们的 API 创建了良好定义的文档。

<img class="-png" src="/blog/elysia-supabase/elysia-swagger.webp" alt="Elysia 生成的 Swagger 文档" />

如果更多细节，您不必担心会忘记 OpenAPI Schema 3.0 的规格，我们还有自动补全和类型安全。

我们可以通过 `schema.detail` 定义路线详细信息，这也遵循 OpenAPI Schema 3.0，以便您可以妥善创建文档。
<img class="-png" src="/blog/elysia-supabase/swagger-auto-complete.webp" alt="使用 `schema.detail` 的自动补全" />

## 下一步

在接下来的步骤中，我们鼓励您尝试并探索 [我们在本文中编写的代码](https://github.com/saltyaom/elysia-supabase-example)，并尝试添加图像上传帖子，以进一步探索 Supabase 和 Elysia 生态系统。

如我们所见，使用 Supabase 创建一个生产就绪的 web 服务器是超级简单的，许多东西只需一行代码，非常有利于快速开发。

特别是当与 Elysia 配对时，您将获得出色的开发者体验，作为单一事实来源的声明式 schema，以及在使用 TypeScript 时创建 API 时的精心设计选择，并且作为奖励，我们可以在仅一行代码中创建文档。

Elysia 正在致力于创建一个以 Bun 为优先的 web 框架，采用新技术和新方法。

如果您对 Elysia 感兴趣，可以随时查看我们的 [Discord 服务器](https://discord.gg/eaFJ2KDJck) 或访问 [Elysia 在 GitHub 上](https://github.com/elysiajs/elysia)。

另外，您可能还想了解 [Elysia Eden](/eden/overview)，这是一个完全类型安全、无需代码生成的请求客户端，类似于 Elysia 服务器的 tRPC。
</Blog>
