---
title: Eden 安装 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden 安装 - ElysiaJS

  - - meta
    - name: 'description'
      content: 从你的前端开始安装 Eden：先执行 "bun add elysia @elysia/eden"，然后导出你的 Elysia 服务器类型，接着开始使用 Eden Treaty 或 Eden Fetch。

  - - meta
    - name: 'og:description'
      content: 从你的前端开始安装 Eden：先执行 "bun add elysia @elysia/eden"，然后导出你的 Elysia 服务器类型，接着开始使用 Eden Treaty 或 Eden Fetch。
---

# Eden 安装
首先通过以下命令在你的前端安装 Eden：
```bash
bun add @elysia/eden
bun add -d elysia
```

::: tip
Eden 需要 Elysia 来推断实用类型。

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
import { treaty } from '@elysia/eden'
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
有时，Eden 可能无法正确从 Elysia 推断类型。以下是修复 Eden 类型推断最常见的解决方法。

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

确保客户端和服务器端的 Elysia 版本一致。

你可以使用 [`npm why`](https://docs.npmjs.com/cli/v10/commands/npm-explain) 命令检查它：

```bash
npm why elysia
```

输出应只包含一个顶级的 elysia 版本：

```
elysia@1.1.12
node_modules/elysia
  elysia@"1.1.25" from the root project
  peer elysia@">= 1.1.0" from @elysia/html@1.1.0
  node_modules/@elysia/html
    dev @elysia/html@"1.1.1" from the root project
  peer elysia@">= 1.1.0" from @elysia/opentelemetry@1.1.2
  node_modules/@elysia/opentelemetry
    dev @elysia/opentelemetry@"1.1.7" from the root project
  peer elysia@">= 1.1.0" from @elysia/swagger@1.1.0
  node_modules/@elysia/swagger
    dev @elysia/swagger@"1.1.6" from the root project
  peer elysia@">= 1.1.0" from @elysia/eden@1.1.2
  node_modules/@elysia/eden
    dev @elysia/eden@"1.1.3" from the root project
```


### TypeScript 版本
Elysia 使用了较新的 TypeScript 特性和语法来以最高效的方式推断类型。大量使用了 Const Generics 和模板字符串。

确保你的客户端使用的 TypeScript 版本**最低为 5.0 及以上**

### 方法链调用
为了使 Eden 正常工作，Elysia 必须使用**方法链调用**

Elysia 的类型系统非常复杂，方法通常会为实例引入新的类型。

使用方法链可以帮助保存这个新的类型引用。

例如：
```typescript
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
如果你在 monorepo 中使用路径别名，确保前端能够与后端以相同方式解析路径。

::: tip
在 monorepo 中设置路径别名可能会比较棘手。你可以 fork 我们的示例模板：[Kozeki Template](https://github.com/SaltyAom/kozeki-template) 并根据需要修改。
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
import { treaty } from '@elysia/eden'
import type { app } from '@/index'

const client = treaty<app>('localhost:3000')

// 这应该能在前端和后端都解析同一个模块，而不是 `any`
import { a, b } from '@/controllers' // [!code ++]
```

为此，你必须确保路径别名在前端和后端都解析到相同的文件。

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

如果配置正确，你应该能在前端和后端都解析相同的模块。
```typescript
// 这应该能在前端和后端都解析同一个模块，而不是 `any`
import { a, b } from '@/controllers'
```

#### 命名空间
我们建议为 monorepo 中的每个模块添加**命名空间**前缀，以避免可能发生的混淆和冲突。

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

我们建议创建一个**单一的 tsconfig.json**，将 `baseUrl` 设置为仓库根目录，根据模块位置提供路径，并为每个模块创建一个继承根 tsconfig.json（含路径别名）的 tsconfig.json。

你可以参考这个 [路径别名示例仓库](https://github.com/SaltyAom/elysia-monorepo-path-alias) 或 [Kozeki Template](https://github.com/SaltyAom/kozeki-template) 来获得一个可用示例。
