---
title: 端到端类型安全 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 端到端类型安全 - ElysiaJS

  - - meta
    - name: 'description'
      content: 从头到尾，Elysia 的 Elysia Eden 支持端到端类型安全。端到端类型安全是指系统中的每个组件都经过类型一致性检查，这意味着数据在组件之间传递时，只有当数据的类型兼容时才会进行传递。

  - - meta
    - property: 'og:description'
      content: 从头到尾，Elysia 的 Elysia Eden 支持端到端类型安全。端到端类型安全是指系统中的每个组件都经过类型一致性检查，这意味着数据在组件之间传递时，只有当数据的类型兼容时才会进行传递。
---

<script setup lang="ts">
import TutorialBadge from '../components/arona/badge.vue'
</script>

# 端到端类型安全 <TutorialBadge href="/tutorial/features/end-to-end-type-safety" />

想象一下你有一个玩具火车套件。

每一段火车轨道都必须完美契合下一段，就像拼图一样。

对于一个框架来说，具备端到端类型安全意味着你可以以类型安全的方式连接客户端和服务器。

Elysia 提供了开箱即用的端到端类型安全 **无需代码生成**，通过类似 RPC 的连接器 **Eden** 实现。

<video mute controls style="aspect-ratio: 16/9;">
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

Elysia 允许你在服务器端更改类型，客户端将立即反映这些更改，有助于自动补全和类型强制。

## Eden

Eden 是一个类似 RPC 的客户端，旨在仅利用 TypeScript 的类型推断连接 Elysia，实现**端到端类型安全**，无需代码生成。

Eden 由两个模块组成：
1. Eden Treaty **（推荐）**：Eden Treaty 1（edenTreaty）的改进版 RPC
2. Eden Fetch：具有类型安全的类似 fetch 的客户端

下面是每个模块的概述、用例和比较。

使用 Eden Treaty，我们能以完整类型支持和自动补全、类型范围缩小的错误处理与类型安全的单元测试方式与 Elysia 服务器交互。

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
import { treaty } from '@elysia/eden'
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
为偏好 fetch 语法的开发者提供的类似 fetch 的 Eden Treaty 替代方案。
```typescript
import { edenFetch } from '@elysia/eden'
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
与 Eden Treaty 不同，Eden Fetch 不提供 Elysia 服务器的 WebSocket 实现。
:::
