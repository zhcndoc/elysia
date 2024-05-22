---

title: 端到端类型安全 
head:
  - - meta
    - property: 'og:title'
      content: 端到端类型安全 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: Elysia 自启动以来就支持端到端类型安全，使用 Elysia Eden。端到端类型安全指的是一个系统，系统中的每个组件都经过类型一致性检查，这意味着只有在数据类型兼容的情况下，数据才会在组件之间传递。

  - - meta
    - property: 'og:description'
      content: Elysia 自启动以来就支持端到端类型安全，使用 Elysia Eden。端到端类型安全指的是一个系统，系统中的每个组件都经过类型一致性检查，这意味着只有在数据类型兼容的情况下，数据才会在组件之间传递。
---

# 端到端类型安全

想象你有一个玩具火车套装。

每一块铁轨都必须与下一块完美契合，就像拼图一样。

端到端类型安全就像确保所有铁轨的部件正确匹配，这样火车就不会掉下或卡住。

对于一个框架来说，拥有端到端类型安全意味着你可以以类型安全的方式连接客户端和服务器。

Elysia 提供端到端类型安全**无需代码生成**即可使用 RPC 类似的连接器，**Eden**

<video mute controls>
  <source src="/eden/eden-treaty.mp4" type="video/mp4" />
  Something went wrong trying to load video
</video>

其他支持 e2e 类型安全的框架：

- tRPC
- Remix
- SvelteKit
- Nuxt
- TS-Rest

<!-- <iframe
    id="embedded-editor"
    src="https://codesandbox.io/p/sandbox/bun-elysia-rdxljp?embed=1&codemirror=1&hidenavigation=1&hidedevtools=1&file=eden.ts"
    allow="accelerometer"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    loading="lazy"
/>

::: tip
Hover over variable and function to see type definition.
::: -->

Elysia 允许你在服务器上更改类型，并且它将立即反映在客户端上，有助于自动完成和类型强制。

## Eden

Eden 是一个 RPC 类似的客户端，使用 TypeScript 的类型推断而非代码生成，连接 Elysia **端到端类型安全**。

允许你轻松同步客户端和服务器类型，大小不到 2KB。

Eden 由 2 个模块组成：

1. Eden Treaty **(推荐)**：Eden Treaty 的 RFC 版本改进版
2. Eden Fetch：带有类型安全的类似 Fetch 的客户端。

以下是每个模块的概述、用例和比较。

## Eden Treaty (推荐)

Eden Treaty 是一个对象类表示的 Elysia 服务器，提供端到端类型安全和显著改善的开发体验。

使用 Eden Treaty，我们可以连接交互 Elysia 服务器，具有完全类型支持和自动完成，错误处理与类型缩小，以及创建类型安全的单元测试。

Eden Treaty 的示例用法：

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'hi')
    .get('/users', () => 'Skadi')
    .put('/nendoroid/:id', ({ body }) => body, {
        body: t.Object({
            name: t.String(),
            from: t.String()
        })
    })
    .get('/nendoroid/:id/name', () => 'Skadi')
    .listen(3000)

export type App = typeof app

// @filename: index.ts
// ---cut---
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// @noErrors
app.
//  ^|




// Call [GET] at '/'
const { data } = await app.index.get()

// Call [POST] at '/nendoroid/:id'
const { data: nendoroid, error } = await app.nendoroid({ id: 1895 }).post({
    name: 'Skadi',
    from: 'Arknights'
})
```

## Eden Fetch

对于喜欢 fetch 语法的开发者，Eden Fetch 是 Eden Treaty 的 fetch 类似替代品。

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'hi')
    .post('/name/:name', ({ body }) => body, {
        body: t.Object({
            branch: t.String(),
            type: t.String()
        })
    })
    .listen(3000)

export type App = typeof app

// @filename: index.ts
// ---cut---
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:3000')

const { data } = await fetch('/name/:name', {
    method: 'POST',
    params: {
        name: 'Saori'
    },
    body: {
        branch: 'Arius',
        type: 'Striker'
    }
})
```

::: tip NOTE
与 Eden Treaty 不同，Eden Fetch 没有为 Elysia 服务器提供 Web Socket 实现
:::
