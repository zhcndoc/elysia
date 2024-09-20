---
title: Eden 安装
head:
  - - meta
    - property: 'og:title'
      content: Eden 安装 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 首先通过 "bun add elysia @elysiajs/eden" 在你的前端安装 Eden，然后公开你的 Elysia 服务器类型，然后开始使用 Eden Treaty 或 Eden Fetch。

  - - meta
    - name: 'og:description'
      content: 首先通过 "bun add elysia @elysiajs/eden" 在你的前端安装 Eden，然后公开你的 Elysia 服务器类型，然后开始使用 Eden Treaty 或 Eden Fetch。
---

# Eden 安装
首先在你的前端安装 Eden：
```bash
bun add @elysiajs/eden
bun add -d elysia
```

::: tip
Eden 需要 Elysia 来推断实用程序类型。

确保在服务器上安装的 Elysia 版本与客户端匹配。
:::

首先，导出你现有的 Elysia 服务器类型：
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]
```

然后在客户端使用 Elysia API：

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]

// @filename: index.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const client = treaty<App>('localhost:3000') // [!code ++]

// response: Hi Elysia
const { data: index } = await client.index.get()

// response: 1895
const { data: id } = await client.id({ id: 1895 }).get()

// response: { id: 1895, name: 'Skadi' }
const { data: nendoroid } = await client.mirror.post({
    id: 1895,
    name: 'Skadi'
})

// @noErrors
client.
//     ^|
```

## 注意事项

有时 Eden 可能无法正确地从 Elysia 推断类型，以下是一些常见的解决方法来修复 Eden 类型推断。

### 类型严格

确保在 **tsconfig.json** 中启用严格模式

```json
{
  "compilerOptions": {
    "strict": true // [!code ++]
  }
}
```

### Elysia 版本不匹配

Eden 依赖 Elysia 类来导入 Elysia 实例并正确推断类型。

确保客户端和服务器使用相同版本的 Elysia。

### TypeScript 版本

Elysia 使用 TypeScript 的新特性和语法以最高效的方式推断类型。特性如常量泛型和模板字面量被大量使用。

确保你的客户端有**至少 TypeScript 版本 >= 5.0**

### 方法链

为了让 Eden 工作，Elysia 必须使用**方法链**

Elysia 的类型系统是复杂的，方法通常向实例引入一个新类型。

使用方法链将有助于保存那个新类型引用。

例如：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store is strictly typed // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```

使用此方法，**state** 现在返回一个新的 **ElysiaInstance** 类型，将 **build** 引入存储并替换当前的。

如果不使用方法链，Elysia 在引入新类型时不会保存新类型，导致没有类型推断。

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

我们建议**始终使用方法链**以提供准确的类型推断。
