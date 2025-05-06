---
title: 端到端类型安全 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 端到端类型安全 - ElysiaJS

  - - meta
    - name: 'description'
      content: 自始至终，Elysia 的 Elysia Eden 支持端到端类型安全。端到端类型安全是指系统中的每个组件都经过类型一致性检查，这意味着数据在组件之间传递时，只有当数据的类型兼容时才会进行传递。

  - - meta
    - property: 'og:description'
      content: 自始至终，Elysia 的 Elysia Eden 支持端到端类型安全。端到端类型安全是指系统中的每个组件都经过类型一致性检查，这意味着数据在组件之间传递时，只有当数据的类型兼容时才会进行传递。
---

# 端到端类型安全
想象一下你有一个玩具火车套件。

每一段火车轨道都必须完美契合下一段，就像拼图一样。

端到端类型安全就像确保所有轨道的拼接都正确，以免火车脱轨或卡住。

对于一个框架来说，具备端到端类型安全的意思是你可以以类型安全的方式连接客户端和服务器。

Elysia 提供了端到端类型安全 **无代码生成** 开箱即用，与 RPC 类似的连接器 **Eden**

<video mute controls>
  <source src="/eden/eden-treaty.mp4" type="video/mp4" />
  加载视频时出错
</video>

支持 e2e 类型安全的其他框架：
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
悬停在变量和函数上以查看类型定义。
::: -->

Elysia 允许你在服务器上更改类型，并会立即反映到客户端，帮助自动完成和类型强制。

## Eden
Eden 是一个类似于 RPC 的客户端，旨在仅使用 TypeScript 的类型推断来连接 Elysia **端到端类型安全**，而无需代码生成。

使你能够轻松同步客户端和服务器类型，体积不到 2KB。

Eden 由两个模块组成：
1. Eden Treaty **（推荐）**: Eden Treaty 的改进版本 RFC
2. Eden Fetch: 具有类型安全的 Fetch 类客户端。

下面是每个模块的概述、用例和比较。

## Eden Treaty （推荐）
Eden Treaty 是一个类似对象的表示，提供 Elysia 服务器的端到端类型安全和显著改善的开发体验。

通过 Eden Treaty，我们可以与 Elysia 服务器进行交互，支持完整的类型和自动完成、类型收窄的错误处理，以及创建类型安全的单元测试。

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




// 调用 [GET] 在 '/'
const { data } = await app.get()

// 调用 [PUT] 在 '/nendoroid/:id'
const { data: nendoroid, error } = await app.nendoroid({ id: 1895 }).put({
    name: 'Skadi',
    from: 'Arknights'
})
```

## Eden Fetch
一个类似于 Eden Treaty 的 Fetch 替代方案，适合偏好 fetch 语法的开发者。
```typescript
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

::: tip 注意
与 Eden Treaty 不同，Eden Fetch 不提供 Elysia 服务器的 Web Socket 实现
:::
