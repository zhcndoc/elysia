---
title: 分组路由
head:
    - - meta
      - property: 'og:title'
        content: 分组路由 - ElysiaJS 中文文档

    - - meta
      - name: 'description'
        content: 分组允许你一次为多个路由设置前缀，使用 “.group”。假设你有许多具有相同前缀的路径——而不是多次编写相同的前缀，可以使用单个 “.group” 方法对它们进行分组。

    - - meta
      - property: 'og:description'
        content: 分组允许你一次为多个路由设置前缀，使用 “.group”。假设你有许多具有相同前缀的路径——而不是多次编写相同的前缀，可以使用单个 “.group” 方法对它们进行分组。
---

<script setup>
    import Playground from '../../components/nearl/playground.vue'
    import { Elysia } from 'elysia'

    const demo1 = new Elysia()
        .post('/user/sign-in', () => 'Sign in')
        .post('/user/sign-up', () => 'Sign up')
        .post('/user/profile', () => 'Profile')

    const demo2 = new Elysia()
        .group('/user', (app) =>
            app
                .post('/sign-in', () => 'Sign in')
                .post('/sign-up', () => 'Sign up')
                .post('/profile', () => 'Profile')
        )

    const users = new Elysia({ prefix: '/user' })
        .post('/sign-in', () => 'Sign in')
        .post('/sign-up', () => 'Sign up')
        .post('/profile', () => 'Profile')

    const demo3 = new Elysia()
        .get('/', () => 'hello world')
        .use(users)
</script>

# 分组路由

在创建一个 Web 服务器时，通常会有多个路由共享相同的前缀：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .post('/user/sign-in', () => 'Sign in')
    .post('/user/sign-up', () => 'Sign up')
    .post('/user/profile', () => 'Profile')
    .listen(3000)
```

<Playground :elysia="demo1" />

可以使用 `Elysia.group` 来改进这个问题，它允许我们将多个路由一起分组，并为它们同时应用前缀：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', () => 'Sign in')
            .post('/sign-up', () => 'Sign up')
            .post('/profile', () => 'Profile')
    )
    .listen(3000)
```

<Playground :elysia="demo2" />

这段代码的行为与我们第一个示例相同，应该按照以下结构组织：

| Path          | Result  |
| ------------- | ------- |
| /user/sign-in | Sign in |
| /user/sign-up | Sign up |
| /user/profile | Profile |

`.group()` 还可以接受一个可选的 guard 参数，以减少同时使用分组和 guard 的样板代码：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/user', 
        { 
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app
            .post('/sign-in', () => 'Sign in')
            .post('/sign-up', () => 'Sign up')
            .post('/profile', () => 'Profile')
    )
    .listen(3000)
```

你可以在 [scope](/essential/scope.html) 中找到有关分组 guard 的更多信息。

## 前缀

我们可以通过为构造函数提供一个**前缀**将一个分组分离为一个单独的插件实例，以减少嵌套：

```typescript twoslash
import { Elysia } from 'elysia'

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', () => 'Sign in')
    .post('/sign-up', () => 'Sign up')
    .post('/profile', () => 'Profile')

new Elysia()
    .use(users)
    .get('/', () => 'hello world')
    .listen(3000)
```

<Playground :elysia="demo3" />
