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
const { data: index } = await client.get()

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
有时，Eden 可能无法正确从 Elysia 推断类型，以下是解决 Eden 类型推断问题的最常见方法。

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

确保客户端和服务器端使用匹配的 Elysia 版本。

您可以使用 [`npm why`](https://docs.npmjs.com/cli/v10/commands/npm-explain) 命令检查它：

```bash
npm why elysia
```

并且输出应仅包含一个顶层的 elysia 版本：

```
elysia@1.1.12
node_modules/elysia
  elysia@"1.1.25" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/html@1.1.0
  node_modules/@elysiajs/html
    dev @elysiajs/html@"1.1.1" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/opentelemetry@1.1.2
  node_modules/@elysiajs/opentelemetry
    dev @elysiajs/opentelemetry@"1.1.7" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/swagger@1.1.0
  node_modules/@elysiajs/swagger
    dev @elysiajs/swagger@"1.1.6" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/eden@1.1.2
  node_modules/@elysiajs/eden
    dev @elysiajs/eden@"1.1.3" from the root project
```


### TypeScript 版本
Elysia 使用了较新的 TypeScript 功能和语法来实现高效的类型推断。像 Const Generic 和 Template Literal 这样的特性被广泛使用。

确保你的客户端使用的 TypeScript 版本最低为 **5.0** 或更高。

### 方法链调用
为了使 Eden 正确工作，Elysia 必须使用 **方法链调用**

Elysia 的类型系统非常复杂，方法通常会为实例引入新的类型。

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
这样，**state** 会返回一个新的 **ElysiaInstance** 类型，在 store 中引入 **build**，替代当前的类型。

如果不使用方法链调用，Elysia 不会保存新引入的类型，导致类型无法推断。
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

### 类型定义
如果你使用了 Bun 特有的功能，比如 `Bun.file` 或类似的 API，并且从处理器函数中返回它，你可能需要为客户端安装 Bun 的类型定义。

```bash
bun add -d @types/bun
```

### 路径别名（monorepo）
如果你在 monorepo 中使用了路径别名，确保前端能够像后端一样解析这些路径。

::: tip
在 monorepo 中设置路径别名有些棘手，您可以分叉我们的示例模板：[Kozeki 模板](https://github.com/SaltyAom/kozeki-template)并根据您的需要进行修改。
:::

例如，你在 **tsconfig.json** 中为后端设置了如下路径别名：
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

你**必须**确保前端代码也能解析相同的路径别名，否则类型推断就会变成 any。

```typescript
import { treaty } from '@elysiajs/eden'
import type { app } from '@/index'

const client = treaty<app>('localhost:3000')

// 这应该能够在前端和后端解析相同的模块，而不是 `any`。
import { a, b } from '@/controllers'
```

要解决此问题，你必须确保路径别名在前端和后端解析为相同的文件。

因此，你必须将 **tsconfig.json** 中的路径别名改为：
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

如果配置正确，你应该能够在前端和后端解析相同的模块。
```typescript
// 这应该能够在前端和后端解析相同的模块，而不是 `any`。
import { a, b } from '@/controllers'
```

#### 范围（Scope）
我们建议在你的 monorepo 中为每个模块添加一个 **范围** 前缀，以避免任何混淆和冲突。

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

然后，你可以这样导入模块：
```typescript
// 应该能在前端和后端都正常使用，且不会返回 `any`
import { a, b } from '@backend/controllers'
```

我们建议创建一个 **单一的 tsconfig.json**，将 `baseUrl` 指向项目根目录，根据模块位置提供路径别名，并为每个模块创建继承自根 tsconfig.json 的 **tsconfig.json**，以使用路径别名。

你可以在这个 [路径别名示例仓库](https://github.com/SaltyAom/elysia-monorepo-path-alias) 或者 [Kozeki 模板](https://github.com/SaltyAom/kozeki-template) 中查看一个工作示例。