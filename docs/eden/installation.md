---
title: Eden 安装 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden 安装 - ElysiaJS

  - - meta
    - name: 'description'
      content: 首先通过 "bun add elysia @elysiajs/eden" 在前端安装 Eden，然后暴露你的 Elysia 服务器类型，接着开始使用 Eden Treaty 或 Eden Fetch。

  - - meta
    - name: 'og:description'
      content: 首先通过 "bun add elysia @elysiajs/eden" 在前端安装 Eden，然后暴露你的 Elysia 服务器类型，接着开始使用 Eden Treaty 或 Eden Fetch。
---

# Eden 安装
首先通过以下命令在你的前端安装 Eden：
```bash
bun add @elysiajs/eden
bun add -d elysia

# 如果您使用 Bun 特定功能，例如`Bun.file`
bun add -d @types/bun
```

::: tip
Eden 需要 Elysia 来推断工具的类型。

确保安装的 Elysia 版本与服务器匹配。
:::

首先，导出你现有的 Elysia 服务器类型：
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => '嗨 Elysia')
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
    .get('/', '嗨 Elysia')
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

// 响应: 嗨 Elysia
const { data: index } = await client.index.get()

// 响应: 1895
const { data: id } = await client.id({ id: 1895 }).get()

// 响应: { id: 1895, name: 'Skadi' }
const { data: nendoroid } = await client.mirror.post({
    id: 1895,
    name: 'Skadi'
})

// @noErrors
client.
//     ^|
```

## 注意事项
有时候 Eden 可能无法准确推断 Elysia 的类型，以下是一些常见的解决方法来修复 Eden 的类型推断。

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

确保客户端和服务器使用匹配的 Elysia 版本。

### TypeScript 版本
Elysia 使用 TypeScript 的新特性和语法以最有效的方式推断类型。像 Const Generic 和 Template Literal 的特性被广泛使用。

确保你的客户端有 **最低 TypeScript 版本 >= 5.0**

### 方法链
为了让 Eden 正常工作，Elysia 必须使用 **方法链**

Elysia 的类型系统很复杂，方法通常会为实例引入新类型。

使用方法链可以帮助保存这个新的类型引用。

例如：
```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store 是严格类型 // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```
这样，**state** 现在返回一个新的 **ElysiaInstance** 类型，将 **build** 引入 store 并替换当前类型。

不使用方法链时，Elysia 在引入新类型时不会保存，导致没有类型推断。
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

### 类型定义
有时，如果您使用的是 Bun 特定功能，如 `Bun.file` 或类似的 API，您可能还需要将 Bun 类型定义安装到客户端。

```bash
bun add -d @types/bun
```

### 路径别名（单一代码库）
如果您在单一代码库中使用路径别名，请确保前端能够与后端相同地解析路径。

例如，如果您在 **tsconfig.json** 中为后端设置了以下路径别名：
```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@/*": ["./src/*"]
	}
  }
}
```

你的后端代码是这样的：
```typescript
import { Elysia } from 'elysia'
import { a, b } from '@/controllers'

const app = new Elysia()
	.use(a)
	.use(b)
	.listen(3000)

export type app = typeof app
```

您**必须**确保您的前端代码能够解析相同的路径别名，否则类型推断将被解析为任何类型。

```typescript
import { treaty } from '@elysiajs/eden'
import type { app } from '@/index'

const client = treaty<app>('localhost:3000')

// 这应该能够在前端和后端解析相同的模块，而不是 `any`。
import { a, b } from '@/controllers'
```

要解决此问题，您必须确保路径别名在前端和后端解析为相同的文件。

因此，您必须将 **tsconfig.json** 中的路径别名更改为：
```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@/*": ["../apps/backend/src/*"]
	}
  }
}
```

如果配置正确，您应该能够在前端和后端解析相同的模块。
```typescript
// 这应该能够在前端和后端解析相同的模块，而不是 `any`。
import { a, b } from '@/controllers'
```

#### 范围
我们建议在您的单体仓库中的每个模块前添加一个 **scope** 前缀，以避免可能发生的任何混淆和冲突。

```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@frontend/*": ["./apps/frontend/src/*"],
	  "@backend/*": ["./apps/backend/src/*"]
	}
  }
}
```

然后你可以像这样导入模块：
```typescript
// Should work in both frontend and backend and not return `any`
import { a, b } from '@backend/controllers'
```

我们建议创建一个 **single tsconfig.json**，将 `baseUrl` 定义为您仓库的根目录，根据模块位置提供路径，并为每个模块创建一个继承根 **tsconfig.json** 的 **tsconfig.json**，该文件具有路径别名。

您可以在这个 [路径别名示例仓库](https://github.com/SaltyAom/elysia-monorepo-path-alias) 中找到一个有效的示例。
